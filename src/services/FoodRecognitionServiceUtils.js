/**
 * Utility methods for FoodRecognitionService
 * Contains helper functions that were referenced but not fully implemented
 */

export class FoodRecognitionUtils {
  /**
   * Compress image to fit within size limits
   */
  static async compressImage(base64Data, maxSize) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions to reduce file size
        let { width, height } = img;
        const ratio = Math.min(1, Math.sqrt(maxSize / (base64Data.length * 0.75)));

        width *= ratio;
        height *= ratio;

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        // Try different quality settings to meet size requirement
        let quality = 0.8;
        let compressed = canvas.toDataURL('image/jpeg', quality);

        while (compressed.length > maxSize && quality > 0.1) {
          quality -= 0.1;
          compressed = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(compressed);
      };

      img.src = base64Data;
    });
  }

  /**
   * Extract text from image using basic OCR fallback
   */
  static async extractTextFromImage(base64) {
    // This is a placeholder for basic text extraction
    // In a real implementation, you might use Tesseract.js or similar
    return '';
  }

  /**
   * Extract food terms from text content
   */
  static extractFoodTermsFromText(text) {
    const foodKeywords = [
      'chicken', 'beef', 'pork', 'fish', 'rice', 'bread', 'pasta',
      'tomato', 'lettuce', 'onion', 'cheese', 'milk', 'egg',
      'apple', 'banana', 'orange', 'potato', 'carrot'
    ];

    const words = text.toLowerCase().split(/\s+/);
    return words.filter(word =>
      foodKeywords.some(keyword =>
        word.includes(keyword) || keyword.includes(word)
      )
    ).slice(0, 5); // Limit to 5 terms
  }

  /**
   * Infer common meal items based on image characteristics
   */
  static async inferCommonMealItems(imageData, options) {
    // This is a fallback method that makes educated guesses
    // based on common meal patterns

    const commonItems = [];

    // Time-based inference
    const hour = new Date().getHours();

    if (hour >= 6 && hour <= 10) {
      // Breakfast items
      commonItems.push(
        { name: 'toast', confidence: 0.3, category: 'carbohydrates', source: 'time_inference' },
        { name: 'coffee', confidence: 0.2, category: 'beverages', source: 'time_inference' }
      );
    } else if (hour >= 12 && hour <= 14) {
      // Lunch items
      commonItems.push(
        { name: 'sandwich', confidence: 0.3, category: 'processed', source: 'time_inference' },
        { name: 'salad', confidence: 0.25, category: 'vegetables', source: 'time_inference' }
      );
    } else if (hour >= 18 && hour <= 21) {
      // Dinner items
      commonItems.push(
        { name: 'meat', confidence: 0.3, category: 'proteins', source: 'time_inference' },
        { name: 'vegetables', confidence: 0.3, category: 'vegetables', source: 'time_inference' },
        { name: 'rice', confidence: 0.25, category: 'carbohydrates', source: 'time_inference' }
      );
    }

    return commonItems;
  }

  /**
   * Consolidate similar detected items
   */
  static consolidateDetectedItems(items) {
    const consolidated = [];
    const processed = new Set();

    for (const item of items) {
      if (processed.has(item.name)) continue;

      const similar = items.filter(other =>
        !processed.has(other.name) &&
        this.isSimilarFoodItem(item.name, other.name)
      );

      if (similar.length > 1) {
        // Merge similar items, keeping highest confidence
        const best = similar.reduce((prev, current) =>
          current.confidence > prev.confidence ? current : prev
        );

        consolidated.push({
          ...best,
          confidence: Math.min(0.95, best.confidence + (similar.length - 1) * 0.05)
        });

        similar.forEach(s => processed.add(s.name));
      } else {
        consolidated.push(item);
        processed.add(item.name);
      }
    }

    return consolidated;
  }

  /**
   * Check if two food items are similar
   */
  static isSimilarFoodItem(item1, item2) {
    const name1 = item1.toLowerCase();
    const name2 = item2.toLowerCase();

    // Exact match
    if (name1 === name2) return true;

    // One contains the other
    if (name1.includes(name2) || name2.includes(name1)) return true;

    // Similar base words
    const words1 = name1.split(' ');
    const words2 = name2.split(' ');

    return words1.some(word => words2.includes(word)) ||
           words2.some(word => words1.includes(word));
  }

  /**
   * Calculate bounding box area
   */
  static calculateBoundingBoxArea(boundingBox) {
    if (!boundingBox || !boundingBox.normalizedVertices) return 0.1;

    const vertices = boundingBox.normalizedVertices;
    if (vertices.length < 4) return 0.1;

    const width = Math.abs(vertices[1].x - vertices[0].x);
    const height = Math.abs(vertices[2].y - vertices[0].y);

    return width * height;
  }

  /**
   * Get base portion size by category (in grams)
   */
  static getBasePortionSize(category) {
    const baseSizes = {
      proteins: 100,
      carbohydrates: 150,
      vegetables: 80,
      fruits: 120,
      dairy: 100,
      fats: 15,
      beverages: 250,
      processed: 100,
      other: 100
    };

    return baseSizes[category] || 100;
  }

  /**
   * Calculate size multiplier based on visual area
   */
  static calculateSizeMultiplier(area, category) {
    // Area is normalized (0-1), convert to size multiplier
    const baseMultiplier = Math.max(0.3, Math.min(3.0, area * 5));

    // Category-specific adjustments
    const adjustments = {
      beverages: 1.5, // Drinks often appear larger
      fats: 0.7,      // Fats/oils appear in smaller quantities
      vegetables: 1.2  // Vegetables often fill more visual space
    };

    return baseMultiplier * (adjustments[category] || 1.0);
  }

  /**
   * Estimate volume from weight
   */
  static estimateVolumeFromWeight(weight, category) {
    // Rough density estimates (g/ml)
    const densities = {
      proteins: 1.0,
      carbohydrates: 0.8,
      vegetables: 0.9,
      fruits: 0.9,
      dairy: 1.0,
      fats: 0.9,
      beverages: 1.0,
      processed: 0.7
    };

    const density = densities[category] || 0.8;
    return weight / density;
  }

  /**
   * Get appropriate volume unit by category
   */
  static getVolumeUnit(category) {
    const units = {
      beverages: 'ml',
      dairy: 'ml',
      fats: 'ml'
    };

    return units[category] || 'ml';
  }

  /**
   * Get serving equivalent
   */
  static getServingEquivalent(weight, category) {
    const servingSizes = {
      proteins: { size: 85, unit: 'oz', description: '3 oz serving' },
      carbohydrates: { size: 150, unit: 'cup', description: '1 cup cooked' },
      vegetables: { size: 85, unit: 'cup', description: '1/2 cup' },
      fruits: { size: 150, unit: 'piece', description: '1 medium piece' },
      dairy: { size: 240, unit: 'cup', description: '1 cup' }
    };

    const serving = servingSizes[category];
    if (!serving) return { servings: 1, description: '1 serving' };

    const servings = Math.round((weight / serving.size) * 10) / 10;
    return {
      servings,
      description: `${servings} ${serving.unit}${servings !== 1 ? 's' : ''}`
    };
  }

  /**
   * Get default portion when estimation fails
   */
  static getDefaultPortion(category) {
    return {
      weight: {
        value: this.getBasePortionSize(category),
        unit: 'g',
        confidence: 0.3
      },
      volume: {
        value: this.estimateVolumeFromWeight(this.getBasePortionSize(category), category),
        unit: this.getVolumeUnit(category),
        confidence: 0.3
      },
      servingSize: this.getServingEquivalent(this.getBasePortionSize(category), category),
      method: 'default_estimate'
    };
  }

  /**
   * Calculate meal balance score
   */
  static calculateMealBalanceScore(categories) {
    let score = 0;

    // Ideal percentages for a balanced meal
    const idealDistribution = {
      vegetables: 0.4,  // 40% vegetables
      proteins: 0.25,   // 25% protein
      carbohydrates: 0.25, // 25% healthy carbs
      fruits: 0.1       // 10% fruits
    };

    const total = Object.values(categories).reduce((sum, items) => sum + items.length, 0);

    if (total === 0) return 0;

    // Calculate actual distribution
    for (const [category, items] of Object.entries(categories)) {
      const actualPercentage = items.length / total;
      const idealPercentage = idealDistribution[category] || 0;

      if (idealPercentage > 0) {
        // Score based on how close to ideal
        const difference = Math.abs(actualPercentage - idealPercentage);
        const categoryScore = Math.max(0, 100 - (difference * 200)); // Penalize deviation
        score += categoryScore * idealPercentage; // Weight by importance
      }
    }

    // Bonus for having multiple categories
    const categoryCount = Object.values(categories).filter(items => items.length > 0).length;
    const diversityBonus = Math.min(20, categoryCount * 5);

    return Math.min(100, score + diversityBonus);
  }

  /**
   * Get complexity description
   */
  static getComplexityDescription(level, factors) {
    const descriptions = {
      simple: `Simple meal with ${factors.componentCount} easily identifiable components. Great for beginners to practice food recognition.`,
      moderate: `Moderately complex meal with ${factors.componentCount} components across ${factors.categoryDiversity} food categories. Good for intermediate learning.`,
      complex: `Complex meal with ${factors.componentCount} diverse components. Advanced meal composition that challenges food identification skills.`
    };

    return descriptions[level] || descriptions.simple;
  }

  /**
   * Infer preparation method from component name and category
   */
  static inferPreparationMethod(name, category) {
    const nameLower = name.toLowerCase();

    const methodKeywords = {
      'fried': ['fried', 'crispy', 'golden'],
      'grilled': ['grilled', 'bbq', 'barbecue', 'char'],
      'baked': ['baked', 'roasted'],
      'steamed': ['steamed'],
      'boiled': ['boiled', 'soup'],
      'raw': ['fresh', 'salad', 'raw']
    };

    for (const [method, keywords] of Object.entries(methodKeywords)) {
      if (keywords.some(keyword => nameLower.includes(keyword))) {
        return method;
      }
    }

    // Category-based inference
    if (category === 'vegetables' && !nameLower.includes('fried')) {
      return Math.random() > 0.5 ? 'steamed' : 'raw';
    }

    if (category === 'proteins') {
      return Math.random() > 0.5 ? 'grilled' : 'baked';
    }

    return null;
  }

  /**
   * Generate health recommendations based on assessment
   */
  static generateHealthRecommendations(assessment, userProfile) {
    const recommendations = [];

    // Score-based recommendations
    if (assessment.overallHealthScore < 40) {
      recommendations.push('Consider adding more vegetables and reducing processed foods');
      recommendations.push('Look for healthier cooking methods like grilling or steaming');
    } else if (assessment.overallHealthScore < 60) {
      recommendations.push('This meal is moderately healthy - try adding more vegetables');
      recommendations.push('Consider reducing portion sizes of high-calorie components');
    } else if (assessment.overallHealthScore >= 80) {
      recommendations.push('Excellent healthy meal choice!');
      recommendations.push('Great balance of nutrients and cooking methods');
    }

    // Preparation-based recommendations
    if (assessment.preparationImpact?.concerns?.length > 0) {
      recommendations.push('Try healthier cooking methods to improve nutritional value');
    }

    // User-specific recommendations
    if (userProfile?.healthGoals) {
      if (userProfile.healthGoals.includes('weight_loss')) {
        recommendations.push('For weight loss, focus on vegetables and lean proteins');
      }
      if (userProfile.healthGoals.includes('muscle_gain')) {
        recommendations.push('Good protein content for muscle building goals');
      }
    }

    return recommendations.slice(0, 5); // Limit to top 5
  }
}