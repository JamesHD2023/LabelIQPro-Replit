/**
 * API Integration Service for LabelIQ
 * Centralized service for managing all external API integrations
 * Optimized for cost efficiency and reliability
 */

class APIIntegrationService {
  constructor() {
    this.config = {
      // Google Cloud Vision API
      googleVision: {
        apiKey: process.env.REACT_APP_GOOGLE_VISION_API_KEY,
        endpoint: 'https://vision.googleapis.com/v1/images:annotate',
        features: ['TEXT_DETECTION', 'PRODUCT_SEARCH'],
        maxRetries: 3
      },

      // Anthropic Claude API (recommended for cost/performance)
      anthropic: {
        apiKey: process.env.REACT_APP_ANTHROPIC_API_KEY,
        endpoint: 'https://api.anthropic.com/v1/messages',
        model: 'claude-3-5-sonnet-20241022',
        maxTokens: 1000,
        maxRetries: 3
      },

      // USDA FoodData Central API (free)
      usda: {
        apiKey: process.env.REACT_APP_USDA_API_KEY,
        endpoint: 'https://api.nal.usda.gov/fdc/v1',
        maxRetries: 3
      },

      // Edamam API (supplementary nutrition data)
      edamam: {
        appId: process.env.REACT_APP_EDAMAM_APP_ID,
        appKey: process.env.REACT_APP_EDAMAM_APP_KEY,
        endpoint: 'https://api.edamam.com/api/food-database/v2',
        maxRetries: 3
      }
    };

    this.cache = new Map();
    this.requestQueue = [];
    this.isProcessing = false;
  }

  /**
   * Extract text from ingredient label image using Google Cloud Vision
   * @param {string} imageBase64 - Base64 encoded image
   * @returns {Promise<Object>} Extracted text and confidence scores
   */
  async extractTextFromImage(imageBase64) {
    const cacheKey = `ocr_${this.hashString(imageBase64)}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const requestBody = {
        requests: [{
          image: { content: imageBase64 },
          features: [
            { type: 'TEXT_DETECTION', maxResults: 1 },
            { type: 'PRODUCT_SEARCH', maxResults: 5 }
          ],
          imageContext: {
            languageHints: ['en', 'es', 'fr', 'de', 'it'] // Multi-language support
          }
        }]
      };

      const response = await this.makeAPIRequest(
        `${this.config.googleVision.endpoint}?key=${this.config.googleVision.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        }
      );

      const result = this.parseGoogleVisionResponse(response);
      this.cache.set(cacheKey, result);
      return result;

    } catch (error) {
      console.error('OCR extraction failed:', error);
      throw new Error('Failed to extract text from image');
    }
  }

  /**
   * Analyze ingredients using AI (Anthropic Claude)
   * @param {string} ingredientText - Raw ingredient text
   * @param {Object} userProfile - User preferences and restrictions
   * @returns {Promise<Object>} Comprehensive ingredient analysis
   */
  async analyzeIngredientsWithAI(ingredientText, userProfile = {}) {
    const cacheKey = `ai_analysis_${this.hashString(ingredientText + JSON.stringify(userProfile))}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const prompt = this.buildIngredientAnalysisPrompt(ingredientText, userProfile);

      const requestBody = {
        model: this.config.anthropic.model,
        max_tokens: this.config.anthropic.maxTokens,
        messages: [{
          role: 'user',
          content: prompt
        }]
      };

      const response = await this.makeAPIRequest(
        this.config.anthropic.endpoint,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.anthropic.apiKey}`,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify(requestBody)
        }
      );

      const result = this.parseAnthropicResponse(response);
      this.cache.set(cacheKey, result);
      return result;

    } catch (error) {
      console.error('AI analysis failed:', error);
      throw new Error('Failed to analyze ingredients with AI');
    }
  }

  /**
   * Get nutrition data from USDA FoodData Central
   * @param {Array} ingredients - List of ingredient names
   * @returns {Promise<Object>} Nutrition information
   */
  async getNutritionData(ingredients) {
    const results = [];

    for (const ingredient of ingredients) {
      const cacheKey = `usda_${this.hashString(ingredient)}`;
      if (this.cache.has(cacheKey)) {
        results.push(this.cache.get(cacheKey));
        continue;
      }

      try {
        const searchParams = new URLSearchParams({
          query: ingredient,
          pageSize: 1,
          api_key: this.config.usda.apiKey
        });

        const response = await this.makeAPIRequest(
          `${this.config.usda.endpoint}/foods/search?${searchParams}`
        );

        const nutritionData = this.parseUSDAResponse(response, ingredient);
        this.cache.set(cacheKey, nutritionData);
        results.push(nutritionData);

        // Rate limiting: USDA allows 1000 requests/hour
        await this.delay(100);

      } catch (error) {
        console.warn(`Failed to get nutrition data for ${ingredient}:`, error);
        results.push({ ingredient, error: 'Nutrition data not found' });
      }
    }

    return results;
  }

  /**
   * Get enhanced nutrition data from Edamam (paid tier)
   * @param {Array} ingredients - List of ingredient names
   * @returns {Promise<Object>} Enhanced nutrition and allergen information
   */
  async getEnhancedNutritionData(ingredients) {
    const results = [];

    for (const ingredient of ingredients) {
      const cacheKey = `edamam_${this.hashString(ingredient)}`;
      if (this.cache.has(cacheKey)) {
        results.push(this.cache.get(cacheKey));
        continue;
      }

      try {
        const searchParams = new URLSearchParams({
          ingr: ingredient,
          app_id: this.config.edamam.appId,
          app_key: this.config.edamam.appKey
        });

        const response = await this.makeAPIRequest(
          `${this.config.edamam.endpoint}/parser?${searchParams}`
        );

        const enhancedData = this.parseEdamamResponse(response, ingredient);
        this.cache.set(cacheKey, enhancedData);
        results.push(enhancedData);

        // Rate limiting: 200 requests/minute
        await this.delay(300);

      } catch (error) {
        console.warn(`Failed to get enhanced data for ${ingredient}:`, error);
        results.push({ ingredient, error: 'Enhanced data not available' });
      }
    }

    return results;
  }

  /**
   * Comprehensive ingredient analysis pipeline
   * @param {string} imageBase64 - Product image
   * @param {Object} userProfile - User preferences
   * @returns {Promise<Object>} Complete analysis results
   */
  async performCompleteAnalysis(imageBase64, userProfile = {}) {
    try {
      // Step 1: Extract text from image
      console.log('🔍 Extracting text from image...');
      const ocrResult = await this.extractTextFromImage(imageBase64);

      if (!ocrResult.text) {
        throw new Error('No ingredient text found in image');
      }

      // Step 2: AI-powered ingredient parsing and analysis
      console.log('🤖 Analyzing ingredients with AI...');
      const aiAnalysis = await this.analyzeIngredientsWithAI(ocrResult.text, userProfile);

      // Step 3: Get nutrition data for identified ingredients
      console.log('🥗 Fetching nutrition data...');
      const nutritionData = await this.getNutritionData(aiAnalysis.ingredients);

      // Step 4: Get enhanced data if available
      let enhancedData = [];
      if (this.config.edamam.appId) {
        console.log('⭐ Fetching enhanced nutrition data...');
        enhancedData = await this.getEnhancedNutritionData(aiAnalysis.ingredients);
      }

      // Step 5: Combine all results
      const completeAnalysis = {
        timestamp: new Date().toISOString(),
        rawText: ocrResult.text,
        confidence: ocrResult.confidence,
        productIdentification: ocrResult.products,
        ingredients: aiAnalysis.ingredients,
        healthAssessment: aiAnalysis.healthAssessment,
        nutritionData: nutritionData,
        enhancedData: enhancedData,
        recommendations: aiAnalysis.recommendations,
        overallScore: aiAnalysis.overallScore,
        processingTime: Date.now() - this.startTime
      };

      console.log('✅ Analysis complete!');
      return completeAnalysis;

    } catch (error) {
      console.error('Complete analysis failed:', error);
      throw error;
    }
  }

  /**
   * Build comprehensive prompt for ingredient analysis
   * @param {string} ingredientText - Raw ingredient text
   * @param {Object} userProfile - User preferences and restrictions
   * @returns {string} Structured prompt for AI analysis
   */
  buildIngredientAnalysisPrompt(ingredientText, userProfile) {
    return `Analyze the following ingredient list and provide a comprehensive health assessment:

INGREDIENT TEXT:
"${ingredientText}"

USER PROFILE:
- Allergies: ${userProfile.allergies?.join(', ') || 'None specified'}
- Dietary Restrictions: ${userProfile.dietaryRestrictions?.join(', ') || 'None specified'}
- Health Goals: ${userProfile.healthGoals?.join(', ') || 'General health'}
- Sensitivity Level: ${userProfile.sensitivityLevel || 'Standard'}

ANALYSIS REQUIREMENTS:
1. Parse and identify individual ingredients
2. Identify E-numbers and food additives
3. Flag controversial or banned substances (EU/US differences)
4. Assess health impact based on user profile
5. Provide overall safety score (0-100)
6. Generate personalized recommendations

RESPONSE FORMAT (JSON):
{
  "ingredients": [
    {
      "name": "ingredient name",
      "category": "additive/natural/processed",
      "eNumber": "E### if applicable",
      "safetyScore": 0-100,
      "concerns": ["health concern 1", "health concern 2"],
      "regulatoryStatus": {"eu": "approved/banned", "us": "approved/banned"}
    }
  ],
  "healthAssessment": {
    "overallHealthScore": 0-100,
    "summary": "brief assessment",
    "warnings": ["warning 1", "warning 2"],
    "positives": ["positive aspect 1", "positive aspect 2"]
  },
  "recommendations": [
    {"type": "warning/info/success", "message": "recommendation text"}
  ],
  "overallScore": 0-100
}

Please analyze thoroughly considering 2025 regulatory changes including US food dye phase-outs and EU titanium dioxide ban.`;
  }

  /**
   * Parse Google Vision API response
   * @param {Object} response - API response
   * @returns {Object} Parsed OCR results
   */
  parseGoogleVisionResponse(response) {
    const textAnnotations = response.responses[0]?.textAnnotations || [];
    const productSearchResults = response.responses[0]?.productSearchResults || {};

    return {
      text: textAnnotations[0]?.description || '',
      confidence: textAnnotations[0]?.confidence || 0,
      products: productSearchResults.results || [],
      boundingBoxes: textAnnotations.map(annotation => annotation.boundingPoly)
    };
  }

  /**
   * Parse Anthropic Claude API response
   * @param {Object} response - API response
   * @returns {Object} Parsed AI analysis
   */
  parseAnthropicResponse(response) {
    try {
      const content = response.content[0]?.text || '';
      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No valid JSON found in AI response');
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return {
        ingredients: [],
        healthAssessment: { overallHealthScore: 50, summary: 'Analysis failed' },
        recommendations: [],
        overallScore: 50
      };
    }
  }

  /**
   * Parse USDA FoodData Central response
   * @param {Object} response - API response
   * @param {string} ingredient - Ingredient name
   * @returns {Object} Parsed nutrition data
   */
  parseUSDAResponse(response, ingredient) {
    const foods = response.foods || [];
    if (foods.length === 0) {
      return { ingredient, nutrients: {}, error: 'No data found' };
    }

    const food = foods[0];
    const nutrients = {};

    food.foodNutrients?.forEach(nutrient => {
      nutrients[nutrient.nutrientName] = {
        amount: nutrient.value,
        unit: nutrient.unitName
      };
    });

    return {
      ingredient,
      foodDescription: food.description,
      nutrients,
      dataType: food.dataType,
      publishedDate: food.publishedDate
    };
  }

  /**
   * Parse Edamam API response
   * @param {Object} response - API response
   * @param {string} ingredient - Ingredient name
   * @returns {Object} Parsed enhanced data
   */
  parseEdamamResponse(response, ingredient) {
    const parsed = response.parsed || [];
    if (parsed.length === 0) {
      return { ingredient, error: 'No enhanced data found' };
    }

    const food = parsed[0].food;
    return {
      ingredient,
      foodId: food.foodId,
      label: food.label,
      nutrients: food.nutrients,
      category: food.category,
      categoryLabel: food.categoryLabel,
      image: food.image
    };
  }

  /**
   * Make API request with retry logic
   * @param {string} url - API endpoint
   * @param {Object} options - Fetch options
   * @returns {Promise<Object>} API response
   */
  async makeAPIRequest(url, options = {}) {
    const maxRetries = options.maxRetries || 3;
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url, {
          timeout: 30000, // 30 second timeout
          ...options
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();

      } catch (error) {
        lastError = error;
        console.warn(`API request attempt ${attempt} failed:`, error.message);

        if (attempt < maxRetries) {
          // Exponential backoff
          await this.delay(Math.pow(2, attempt) * 1000);
        }
      }
    }

    throw new Error(`API request failed after ${maxRetries} attempts: ${lastError.message}`);
  }

  /**
   * Hash string for caching keys
   * @param {string} str - String to hash
   * @returns {string} Hash value
   */
  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  /**
   * Delay execution
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise<void>}
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Clear cache (for memory management)
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Get API usage statistics
   * @returns {Object} Usage stats
   */
  getUsageStats() {
    return {
      cacheSize: this.cache.size,
      queueLength: this.requestQueue.length,
      isProcessing: this.isProcessing
    };
  }
}

// Create singleton instance
export const apiIntegrationService = new APIIntegrationService();
export default apiIntegrationService;