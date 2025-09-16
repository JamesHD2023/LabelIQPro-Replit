import { apiOrchestrator } from './APIOrchestrator';
import { offlineService } from './OfflineService';
import { FoodRecognitionUtils } from './FoodRecognitionServiceUtils';

class FoodRecognitionService {
  constructor() {
    this.cache = new Map();
    this.sessionCache = new Map();
    this.recognitionHistory = [];
    this.confidenceThresholds = {
      high: 0.85,
      medium: 0.65,
      low: 0.4
    };

    // Vision API configurations with fallback priority
    this.visionAPIs = {
      googleVision: {
        name: 'Google Vision',
        priority: 1,
        features: ['food_detection', 'portion_estimation', 'ingredient_analysis'],
        maxFileSize: 20 * 1024 * 1024 // 20MB
      },
      clarifai: {
        name: 'Clarifai',
        priority: 2,
        features: ['food_detection', 'meal_categorization'],
        maxFileSize: 10 * 1024 * 1024 // 10MB
      },
      logmeal: {
        name: 'LogMeal',
        priority: 3,
        features: ['nutrition_analysis', 'portion_estimation'],
        maxFileSize: 8 * 1024 * 1024 // 8MB
      }
    };

    // Food categories for classification
    this.foodCategories = {
      proteins: ['meat', 'chicken', 'fish', 'beef', 'pork', 'turkey', 'eggs', 'beans', 'tofu', 'nuts'],
      carbohydrates: ['rice', 'bread', 'pasta', 'potato', 'cereal', 'oats', 'quinoa', 'noodles'],
      vegetables: ['broccoli', 'carrots', 'spinach', 'lettuce', 'tomato', 'onion', 'peppers', 'corn'],
      fruits: ['apple', 'banana', 'orange', 'berries', 'grapes', 'melon', 'citrus', 'tropical'],
      dairy: ['milk', 'cheese', 'yogurt', 'butter', 'cream'],
      fats: ['oil', 'avocado', 'nuts', 'seeds', 'olive oil', 'coconut oil'],
      beverages: ['water', 'juice', 'soda', 'coffee', 'tea', 'alcohol', 'smoothie'],
      processed: ['chips', 'cookies', 'candy', 'frozen meals', 'packaged foods']
    };
  }

  /**
   * Main method to recognize food items in a prepared meal image
   * @param {Blob|File|string} imageInput - Image data or base64 string
   * @param {Object} options - Recognition options
   * @returns {Object} Recognition results with food components and analysis
   */
  async recognizeMeal(imageInput, options = {}) {
    try {
      const {
        includePortions = true,
        includeNutrition = true,
        userPreferences = null,
        learningLevel = 'beginner'
      } = options;

      // Validate and prepare image
      const imageData = await this.prepareImage(imageInput);

      // Check cache first
      const cacheKey = this.generateCacheKey(imageData, options);
      if (this.cache.has(cacheKey)) {
        return this.enhanceWithUserContext(this.cache.get(cacheKey), userPreferences);
      }

      // Perform multi-API food recognition
      const recognitionResults = await this.performMultiAPIRecognition(imageData, options);

      // Analyze meal components
      const mealComponents = await this.analyzeMealComponents(recognitionResults, imageData);

      // Estimate portions if requested
      const portions = includePortions
        ? await this.estimatePortions(mealComponents, imageData)
        : null;

      // Create comprehensive meal analysis
      const mealAnalysis = {
        id: `meal_${Date.now()}`,
        timestamp: new Date().toISOString(),
        image: imageData.base64,
        confidence: this.calculateOverallConfidence(recognitionResults),
        components: mealComponents,
        portions,
        categories: this.categorizeMealComponents(mealComponents),
        preparationMethod: await this.analyzePreparationMethod(mealComponents, recognitionResults),
        complexity: this.assessMealComplexity(mealComponents),
        learningLevel,
        rawResults: recognitionResults
      };

      // Cache results
      this.cache.set(cacheKey, mealAnalysis);
      setTimeout(() => this.cache.delete(cacheKey), 3600000); // 1 hour cache

      // Store in history
      await this.storeMealHistory(mealAnalysis);

      // Add user context and personalization
      return this.enhanceWithUserContext(mealAnalysis, userPreferences);

    } catch (error) {
      console.error('Meal recognition failed:', error);
      return this.createFallbackResult(imageInput, error, options);
    }
  }

  /**
   * Prepare and validate image input
   */
  async prepareImage(imageInput) {
    let base64Data;
    let fileSize = 0;

    if (typeof imageInput === 'string') {
      // Already base64
      base64Data = imageInput.startsWith('data:') ? imageInput : `data:image/jpeg;base64,${imageInput}`;
      fileSize = Math.ceil(base64Data.length * 0.75); // Approximate file size
    } else if (imageInput instanceof Blob || imageInput instanceof File) {
      // Convert to base64
      base64Data = await this.blobToBase64(imageInput);
      fileSize = imageInput.size;
    } else {
      throw new Error('Invalid image input format');
    }

    // Validate file size
    const maxSize = Math.max(...Object.values(this.visionAPIs).map(api => api.maxFileSize));
    if (fileSize > maxSize) {
      base64Data = await this.compressImage(base64Data, maxSize);
    }

    return {
      base64: base64Data,
      size: fileSize,
      format: this.detectImageFormat(base64Data)
    };
  }

  /**
   * Perform recognition using multiple vision APIs with fallback
   */
  async performMultiAPIRecognition(imageData, options) {
    const results = {
      primary: null,
      fallback: [],
      errors: []
    };

    // Sort APIs by priority
    const sortedAPIs = Object.entries(this.visionAPIs)
      .sort((a, b) => a[1].priority - b[1].priority);

    for (const [apiName, config] of sortedAPIs) {
      try {
        // Check if image size is compatible
        if (imageData.size > config.maxFileSize) continue;

        const apiResult = await this.callVisionAPI(apiName, imageData, options);

        if (apiResult && apiResult.confidence > this.confidenceThresholds.low) {
          if (!results.primary) {
            results.primary = { api: apiName, ...apiResult };
          } else {
            results.fallback.push({ api: apiName, ...apiResult });
          }
        }

        // Break if we have high confidence primary result
        if (results.primary && results.primary.confidence > this.confidenceThresholds.high) {
          break;
        }
      } catch (error) {
        console.warn(`${apiName} recognition failed:`, error);
        results.errors.push({ api: apiName, error: error.message });
      }
    }

    // Fallback to offline recognition if no API results
    if (!results.primary && results.fallback.length === 0) {
      results.primary = await this.performOfflineRecognition(imageData, options);
    }

    return results;
  }

  /**
   * Call specific vision API for food recognition
   */
  async callVisionAPI(apiName, imageData, options) {
    switch (apiName) {
      case 'googleVision':
        return await this.callGoogleVision(imageData, options);
      case 'clarifai':
        return await this.callClarifai(imageData, options);
      case 'logmeal':
        return await this.callLogMeal(imageData, options);
      default:
        throw new Error(`Unknown API: ${apiName}`);
    }
  }

  /**
   * Google Vision API integration
   */
  async callGoogleVision(imageData, options) {
    const config = apiOrchestrator.apiConfig.vision.googleVision;

    const requestBody = {
      requests: [{
        image: {
          content: imageData.base64.split(',')[1] // Remove data URL prefix
        },
        features: [
          { type: 'OBJECT_LOCALIZATION', maxResults: 20 },
          { type: 'LABEL_DETECTION', maxResults: 50 },
          { type: 'TEXT_DETECTION', maxResults: 10 }
        ],
        imageContext: {
          languageHints: ['en']
        }
      }]
    };

    const response = await fetch(`${config.url}/images:annotate?key=${config.key}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Google Vision API error: ${response.status}`);
    }

    const data = await response.json();
    return this.parseGoogleVisionResponse(data);
  }

  /**
   * Parse Google Vision API response
   */
  parseGoogleVisionResponse(data) {
    const result = data.responses[0];
    const detectedItems = [];

    // Parse object localization
    if (result.localizedObjectAnnotations) {
      for (const obj of result.localizedObjectAnnotations) {
        if (this.isFoodRelated(obj.name)) {
          detectedItems.push({
            name: obj.name,
            confidence: obj.score,
            boundingBox: obj.boundingPoly,
            category: this.categorizeFoodItem(obj.name),
            source: 'object_detection'
          });
        }
      }
    }

    // Parse label detection
    if (result.labelAnnotations) {
      for (const label of result.labelAnnotations) {
        if (this.isFoodRelated(label.description)) {
          const existing = detectedItems.find(item =>
            this.isSimilarFoodItem(item.name, label.description));

          if (!existing && label.score > this.confidenceThresholds.low) {
            detectedItems.push({
              name: label.description,
              confidence: label.score,
              category: this.categorizeFoodItem(label.description),
              source: 'label_detection'
            });
          }
        }
      }
    }

    // Parse any visible text (for packaged foods or menus)
    let detectedText = null;
    if (result.textAnnotations && result.textAnnotations.length > 0) {
      detectedText = result.textAnnotations[0].description;
    }

    return {
      confidence: this.calculateAverageConfidence(detectedItems),
      detectedItems,
      textContent: detectedText,
      apiFeatures: ['object_detection', 'label_detection', 'text_detection']
    };
  }

  /**
   * Clarifai API integration
   */
  async callClarifai(imageData, options) {
    const config = apiOrchestrator.apiConfig.vision.clarifai;

    const requestBody = {
      inputs: [{
        data: {
          image: {
            base64: imageData.base64.split(',')[1]
          }
        }
      }]
    };

    const response = await fetch(`${config.url}/models/food-item-recognition/outputs`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${config.key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Clarifai API error: ${response.status}`);
    }

    const data = await response.json();
    return this.parseClarifaiResponse(data);
  }

  /**
   * Parse Clarifai response
   */
  parseClarifaiResponse(data) {
    const detectedItems = [];
    const output = data.outputs[0];

    if (output.data && output.data.concepts) {
      for (const concept of output.data.concepts) {
        if (concept.value > this.confidenceThresholds.low) {
          detectedItems.push({
            name: concept.name,
            confidence: concept.value,
            category: this.categorizeFoodItem(concept.name),
            source: 'clarifai_concepts'
          });
        }
      }
    }

    return {
      confidence: this.calculateAverageConfidence(detectedItems),
      detectedItems,
      apiFeatures: ['food_recognition', 'concept_detection']
    };
  }

  /**
   * LogMeal API integration
   */
  async callLogMeal(imageData, options) {
    const config = apiOrchestrator.apiConfig.vision.logmeal;

    // LogMeal expects multipart form data
    const formData = new FormData();
    const blob = this.base64ToBlob(imageData.base64);
    formData.append('image', blob, 'meal.jpg');

    const response = await fetch(`${config.url}/recognize`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.key}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`LogMeal API error: ${response.status}`);
    }

    const data = await response.json();
    return this.parseLogMealResponse(data);
  }

  /**
   * Parse LogMeal response
   */
  parseLogMealResponse(data) {
    const detectedItems = [];

    if (data.recognition_results) {
      for (const item of data.recognition_results) {
        detectedItems.push({
          name: item.food_name,
          confidence: item.prob,
          category: this.categorizeFoodItem(item.food_name),
          nutritionInfo: item.nutrition,
          portionInfo: item.portion,
          source: 'logmeal'
        });
      }
    }

    return {
      confidence: this.calculateAverageConfidence(detectedItems),
      detectedItems,
      nutritionalData: data.nutrition_summary,
      apiFeatures: ['food_recognition', 'nutrition_analysis']
    };
  }

  /**
   * Offline recognition fallback using local patterns
   */
  async performOfflineRecognition(imageData, options) {
    try {
      // Use basic image analysis techniques
      const detectedItems = [];

      // Try to extract any text from the image
      const textContent = await this.extractTextFromImage(imageData.base64);

      if (textContent) {
        // Parse text for food-related terms
        const foodTerms = this.extractFoodTermsFromText(textContent);
        for (const term of foodTerms) {
          detectedItems.push({
            name: term,
            confidence: 0.3, // Low confidence for text-based detection
            category: this.categorizeFoodItem(term),
            source: 'offline_text_analysis'
          });
        }
      }

      // Add common meal patterns based on image characteristics
      const commonItems = await this.inferCommonMealItems(imageData, options);
      detectedItems.push(...commonItems);

      return {
        confidence: Math.max(0.2, this.calculateAverageConfidence(detectedItems)),
        detectedItems,
        apiFeatures: ['offline_analysis'],
        fallback: true
      };
    } catch (error) {
      console.error('Offline recognition failed:', error);
      return {
        confidence: 0.1,
        detectedItems: [],
        apiFeatures: ['basic_fallback'],
        fallback: true,
        error: error.message
      };
    }
  }

  /**
   * Analyze meal components from recognition results
   */
  async analyzeMealComponents(recognitionResults, imageData) {
    const components = [];
    const primaryResult = recognitionResults.primary;

    if (!primaryResult || !primaryResult.detectedItems) {
      return components;
    }

    // Consolidate similar items and remove duplicates
    const consolidatedItems = this.consolidateDetectedItems(primaryResult.detectedItems);

    // Enhance each component with additional analysis
    for (const item of consolidatedItems) {
      const component = {
        id: `component_${Date.now()}_${Math.random()}`,
        name: item.name,
        category: item.category,
        confidence: item.confidence,
        boundingBox: item.boundingBox,

        // Enhanced analysis
        nutritionInfo: await MealAnalysisUtils.getNutritionInfo(item.name),
        preparationMethod: this.inferPreparationMethod(item.name, item.category),
        healthProfile: await MealAnalysisUtils.getHealthProfile(item.name, item.category),
        allergenInfo: await MealAnalysisUtils.getAllergenInfo(item.name),

        // Metadata
        source: item.source,
        detectedAt: new Date().toISOString()
      };

      components.push(component);
    }

    return components.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Estimate portion sizes using computer vision techniques
   */
  async estimatePortions(mealComponents, imageData) {
    const portions = {};

    for (const component of mealComponents) {
      try {
        const portionEstimate = await this.estimateComponentPortion(component, imageData);
        portions[component.id] = portionEstimate;
      } catch (error) {
        console.warn(`Failed to estimate portion for ${component.name}:`, error);
        portions[component.id] = this.getDefaultPortion(component.category);
      }
    }

    return portions;
  }

  /**
   * Estimate portion size for individual component
   */
  async estimateComponentPortion(component, imageData) {
    // Use reference objects and bounding box analysis
    const boundingBox = component.boundingBox;

    if (!boundingBox) {
      return this.getDefaultPortion(component.category);
    }

    // Calculate approximate area of the food item
    const area = this.calculateBoundingBoxArea(boundingBox);

    // Estimate portion based on category and visual area
    const basePortionSize = this.getBasePortionSize(component.category);
    const sizeMultiplier = this.calculateSizeMultiplier(area, component.category);

    const estimatedWeight = basePortionSize * sizeMultiplier;
    const estimatedVolume = this.estimateVolumeFromWeight(estimatedWeight, component.category);

    return {
      weight: {
        value: Math.round(estimatedWeight),
        unit: 'g',
        confidence: component.confidence * 0.7 // Lower confidence for portion estimation
      },
      volume: {
        value: Math.round(estimatedVolume * 10) / 10,
        unit: this.getVolumeUnit(component.category),
        confidence: component.confidence * 0.6
      },
      servingSize: this.getServingEquivalent(estimatedWeight, component.category),
      method: 'computer_vision_estimation'
    };
  }

  /**
   * Categorize meal components by food groups
   */
  categorizeMealComponents(components) {
    const categories = {
      proteins: [],
      carbohydrates: [],
      vegetables: [],
      fruits: [],
      dairy: [],
      fats: [],
      beverages: [],
      processed: [],
      other: []
    };

    for (const component of components) {
      const category = component.category;
      if (categories[category]) {
        categories[category].push(component);
      } else {
        categories.other.push(component);
      }
    }

    // Calculate category statistics
    const stats = {
      totalComponents: components.length,
      categoryDistribution: {},
      balanceScore: 0
    };

    for (const [category, items] of Object.entries(categories)) {
      stats.categoryDistribution[category] = {
        count: items.length,
        percentage: (items.length / components.length) * 100
      };
    }

    // Calculate meal balance score
    stats.balanceScore = this.calculateMealBalanceScore(categories);

    return {
      categories,
      stats
    };
  }

  /**
   * Analyze preparation method from visual cues
   */
  async analyzePreparationMethod(components, recognitionResults) {
    const preparationMethods = new Set();
    const cookingCues = {
      grilled: ['char marks', 'grill lines', 'blackened edges'],
      fried: ['golden brown', 'crispy', 'oil', 'battered'],
      roasted: ['caramelized', 'browned', 'roasted'],
      steamed: ['bright color', 'tender'],
      raw: ['fresh', 'uncooked', 'salad'],
      baked: ['golden', 'risen', 'baked'],
      boiled: ['soft texture', 'clear broth']
    };

    // Analyze visual cues from API results
    const textContent = recognitionResults.primary?.textContent || '';
    const itemNames = components.map(c => c.name.toLowerCase());

    for (const [method, cues] of Object.entries(cookingCues)) {
      const matchedCues = cues.filter(cue =>
        textContent.toLowerCase().includes(cue) ||
        itemNames.some(name => name.includes(cue))
      );

      if (matchedCues.length > 0) {
        preparationMethods.add(method);
      }
    }

    // Infer from food types
    for (const component of components) {
      const inferredMethod = this.inferPreparationMethod(component.name, component.category);
      if (inferredMethod) {
        preparationMethods.add(inferredMethod);
      }
    }

    return {
      methods: Array.from(preparationMethods),
      confidence: preparationMethods.size > 0 ? 0.7 : 0.3,
      cuesFound: preparationMethods.size
    };
  }

  /**
   * Assess meal complexity for learning purposes
   */
  assessMealComplexity(components) {
    const factors = {
      componentCount: components.length,
      categoryDiversity: new Set(components.map(c => c.category)).size,
      averageConfidence: components.reduce((sum, c) => sum + c.confidence, 0) / components.length,
      processedFoodRatio: components.filter(c => c.category === 'processed').length / components.length
    };

    let complexityScore = 0;

    // More components = higher complexity
    complexityScore += Math.min(factors.componentCount * 10, 50);

    // More food categories = higher complexity
    complexityScore += factors.categoryDiversity * 8;

    // Lower confidence = higher complexity (harder to identify)
    complexityScore += (1 - factors.averageConfidence) * 30;

    // More processed foods = lower complexity
    complexityScore -= factors.processedFoodRatio * 20;

    const level = complexityScore < 30 ? 'simple' :
                 complexityScore < 60 ? 'moderate' : 'complex';

    return {
      score: Math.max(0, Math.min(100, complexityScore)),
      level,
      factors,
      description: this.getComplexityDescription(level, factors)
    };
  }

  /**
   * Store meal analysis in history
   */
  async storeMealHistory(mealAnalysis) {
    try {
      // Store in offline database
      await offlineService.saveScanResult({
        ...mealAnalysis,
        type: 'meal_analysis',
        category: 'food'
      });

      // Add to session history
      this.recognitionHistory.unshift(mealAnalysis);

      // Keep only last 50 items in memory
      if (this.recognitionHistory.length > 50) {
        this.recognitionHistory = this.recognitionHistory.slice(0, 50);
      }
    } catch (error) {
      console.error('Failed to store meal history:', error);
    }
  }

  /**
   * Enhance results with user context and preferences
   */
  enhanceWithUserContext(mealAnalysis, userPreferences) {
    if (!userPreferences) {
      return mealAnalysis;
    }

    const enhanced = { ...mealAnalysis };

    // Add dietary restriction warnings
    if (userPreferences.dietaryRestrictions) {
      enhanced.dietaryWarnings = MealAnalysisUtils.checkDietaryRestrictions(
        mealAnalysis.components,
        userPreferences.dietaryRestrictions
      );
    }

    // Add allergy warnings
    if (userPreferences.allergies) {
      enhanced.allergyWarnings = MealAnalysisUtils.checkAllergenWarnings(
        mealAnalysis.components,
        userPreferences.allergies
      );
    }

    // Add personalized recommendations
    enhanced.recommendations = MealAnalysisUtils.generatePersonalizedRecommendations(
      mealAnalysis,
      userPreferences
    );

    return enhanced;
  }

  /**
   * Create fallback result when recognition fails
   */
  createFallbackResult(imageInput, error, options) {
    return {
      id: `fallback_${Date.now()}`,
      timestamp: new Date().toISOString(),
      confidence: 0.1,
      components: [],
      categories: { categories: {}, stats: { totalComponents: 0 } },
      complexity: { level: 'unknown', score: 0 },
      error: error.message,
      fallback: true,
      recommendations: [
        'Image quality may be too low for accurate recognition',
        'Try taking a clearer photo with better lighting',
        'Ensure food items are clearly visible and well-lit',
        'Consider using manual ingredient entry for this meal'
      ]
    };
  }

  // Utility methods - delegated to utils class
  generateCacheKey(imageData, options) {
    const optionsStr = JSON.stringify(options);
    return `${this.hashString(imageData.base64.substring(0, 100))}_${this.hashString(optionsStr)}`;
  }

  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  async blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  base64ToBlob(base64) {
    const [header, data] = base64.split(',');
    const mime = header.match(/data:(.*?);/)[1];
    const binary = atob(data);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }
    return new Blob([array], { type: mime });
  }

  detectImageFormat(base64) {
    if (base64.includes('data:image/jpeg')) return 'jpeg';
    if (base64.includes('data:image/png')) return 'png';
    if (base64.includes('data:image/webp')) return 'webp';
    return 'unknown';
  }

  // Use utility methods
  async compressImage(base64Data, maxSize) {
    return FoodRecognitionUtils.compressImage(base64Data, maxSize);
  }

  async extractTextFromImage(base64) {
    return FoodRecognitionUtils.extractTextFromImage(base64);
  }

  extractFoodTermsFromText(text) {
    return FoodRecognitionUtils.extractFoodTermsFromText(text);
  }

  async inferCommonMealItems(imageData, options) {
    return FoodRecognitionUtils.inferCommonMealItems(imageData, options);
  }

  consolidateDetectedItems(items) {
    return FoodRecognitionUtils.consolidateDetectedItems(items);
  }

  isSimilarFoodItem(item1, item2) {
    return FoodRecognitionUtils.isSimilarFoodItem(item1, item2);
  }

  calculateBoundingBoxArea(boundingBox) {
    return FoodRecognitionUtils.calculateBoundingBoxArea(boundingBox);
  }

  getBasePortionSize(category) {
    return FoodRecognitionUtils.getBasePortionSize(category);
  }

  calculateSizeMultiplier(area, category) {
    return FoodRecognitionUtils.calculateSizeMultiplier(area, category);
  }

  estimateVolumeFromWeight(weight, category) {
    return FoodRecognitionUtils.estimateVolumeFromWeight(weight, category);
  }

  getVolumeUnit(category) {
    return FoodRecognitionUtils.getVolumeUnit(category);
  }

  getServingEquivalent(weight, category) {
    return FoodRecognitionUtils.getServingEquivalent(weight, category);
  }

  getDefaultPortion(category) {
    return FoodRecognitionUtils.getDefaultPortion(category);
  }

  calculateMealBalanceScore(categories) {
    return FoodRecognitionUtils.calculateMealBalanceScore(categories);
  }

  getComplexityDescription(level, factors) {
    return FoodRecognitionUtils.getComplexityDescription(level, factors);
  }

  inferPreparationMethod(name, category) {
    return FoodRecognitionUtils.inferPreparationMethod(name, category);
  }

  generateHealthRecommendations(assessment, userProfile) {
    return FoodRecognitionUtils.generateHealthRecommendations(assessment, userProfile);
  }

  isFoodRelated(item) {
    const foodKeywords = [
      'food', 'meal', 'dish', 'cuisine', 'ingredient', 'vegetable', 'fruit',
      'meat', 'protein', 'dairy', 'grain', 'beverage', 'drink', 'snack'
    ];

    const itemLower = item.toLowerCase();
    return foodKeywords.some(keyword => itemLower.includes(keyword)) ||
           Object.values(this.foodCategories).some(category =>
             category.some(food => itemLower.includes(food))
           );
  }

  categorizeFoodItem(itemName) {
    const nameLower = itemName.toLowerCase();

    for (const [category, foods] of Object.entries(this.foodCategories)) {
      if (foods.some(food => nameLower.includes(food))) {
        return category;
      }
    }

    return 'other';
  }

  calculateOverallConfidence(recognitionResults) {
    if (recognitionResults.primary) {
      return recognitionResults.primary.confidence;
    }

    if (recognitionResults.fallback.length > 0) {
      const avgConfidence = recognitionResults.fallback.reduce((sum, result) =>
        sum + result.confidence, 0) / recognitionResults.fallback.length;
      return avgConfidence * 0.8; // Slightly lower confidence for fallback results
    }

    return 0.1;
  }

  calculateAverageConfidence(items) {
    if (!items || items.length === 0) return 0;
    return items.reduce((sum, item) => sum + item.confidence, 0) / items.length;
  }

  // Get trending meals and insights
  async getTrendingMeals(limit = 10) {
    const history = await offlineService.getScanResults(100, 0);
    const mealHistory = history.filter(item => item.type === 'meal_analysis');

    // Analyze trends
    const trends = this.analyzeMealTrends(mealHistory);

    return {
      recentMeals: mealHistory.slice(0, limit),
      trends,
      insights: this.generateTrendInsights(trends)
    };
  }

  analyzeMealTrends(mealHistory) {
    const trends = {
      popularCategories: {},
      frequentComponents: {},
      balanceScores: [],
      complexityLevels: {}
    };

    for (const meal of mealHistory) {
      // Track popular categories
      if (meal.categories?.stats?.categoryDistribution) {
        for (const [category, data] of Object.entries(meal.categories.stats.categoryDistribution)) {
          trends.popularCategories[category] = (trends.popularCategories[category] || 0) + data.count;
        }
      }

      // Track frequent components
      if (meal.components) {
        for (const component of meal.components) {
          trends.frequentComponents[component.name] = (trends.frequentComponents[component.name] || 0) + 1;
        }
      }

      // Track balance scores
      if (meal.categories?.stats?.balanceScore) {
        trends.balanceScores.push(meal.categories.stats.balanceScore);
      }

      // Track complexity levels
      if (meal.complexity?.level) {
        trends.complexityLevels[meal.complexity.level] = (trends.complexityLevels[meal.complexity.level] || 0) + 1;
      }
    }

    return trends;
  }
}

export const foodRecognitionService = new FoodRecognitionService();