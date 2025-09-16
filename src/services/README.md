# Food Recognition & Meal Analysis Services

Comprehensive AI-powered food recognition and nutritional analysis services for prepared meal analysis.

## Services Overview

### 1. FoodRecognitionService
- **Purpose**: Recognize food items in prepared meals using multiple AI vision APIs
- **Features**: Multi-API integration, portion estimation, meal component identification, offline fallbacks
- **APIs**: Google Vision, Clarifai, LogMeal with intelligent failover

### 2. MealAnalysisService
- **Purpose**: Analyze nutritional content and health impact of recognized meals
- **Features**: Nutrition calculation, health assessment, dietary compliance, alternative suggestions
- **Data Sources**: USDA FoodData Central, Edamam, local nutrition database

## Quick Start

```javascript
import { foodRecognitionService } from './services/FoodRecognitionService';
import { mealAnalysisService } from './services/MealAnalysisService';

// Basic food recognition
const mealAnalysis = await foodRecognitionService.recognizeMeal(imageBlob, {
  includePortions: true,
  includeNutrition: true,
  learningLevel: 'beginner'
});

// Get nutritional analysis
const nutrition = await mealAnalysisService.calculateNutrition(
  mealAnalysis.components,
  mealAnalysis.portions
);

// Get health impact assessment
const healthAssessment = await mealAnalysisService.assessHealthImpact(
  mealAnalysis.components,
  mealAnalysis.preparationMethod
);
```

## Detailed API Documentation

### FoodRecognitionService API

#### `recognizeMeal(imageInput, options)`

Analyze a prepared meal image to identify food components.

**Parameters:**
- `imageInput` (Blob|File|string): Image data or base64 string
- `options` (Object): Recognition options
  - `includePortions` (boolean): Estimate portion sizes (default: true)
  - `includeNutrition` (boolean): Include basic nutrition info (default: true)
  - `userPreferences` (Object): User dietary preferences and restrictions
  - `learningLevel` (string): 'beginner'|'intermediate'|'advanced' (default: 'beginner')

**Returns:** Promise\<Object>
```javascript
{
  id: "meal_1234567890",
  timestamp: "2024-01-15T12:30:00.000Z",
  image: "data:image/jpeg;base64,...",
  confidence: 0.87,
  components: [
    {
      id: "component_123",
      name: "grilled chicken breast",
      category: "proteins",
      confidence: 0.92,
      boundingBox: {...},
      nutritionInfo: {...},
      healthProfile: {...},
      allergenInfo: {...}
    }
  ],
  portions: {
    "component_123": {
      weight: { value: 150, unit: "g", confidence: 0.8 },
      volume: { value: 150, unit: "ml", confidence: 0.7 },
      servingSize: { servings: 1.8, description: "1.8 servings" }
    }
  },
  categories: {
    categories: {
      proteins: [...],
      vegetables: [...],
      carbohydrates: [...]
    },
    stats: {
      totalComponents: 4,
      balanceScore: 78
    }
  },
  preparationMethod: {
    methods: ["grilled", "steamed"],
    confidence: 0.7
  },
  complexity: {
    level: "moderate",
    score: 45,
    description: "..."
  }
}
```

#### `getTrendingMeals(limit)`

Get meal history and trend analysis.

**Parameters:**
- `limit` (number): Maximum meals to return (default: 10)

**Returns:** Promise\<Object>
```javascript
{
  recentMeals: [...],
  trends: {
    popularCategories: { vegetables: 45, proteins: 32 },
    frequentComponents: { "chicken": 12, "rice": 8 },
    balanceScores: [78, 82, 71],
    complexityLevels: { simple: 5, moderate: 8, complex: 2 }
  },
  insights: [...]
}
```

### MealAnalysisService API

#### `calculateNutrition(mealComponents, portions, userProfile)`

Calculate comprehensive nutritional information for a meal.

**Parameters:**
- `mealComponents` (Array): Food components from recognition
- `portions` (Object): Portion information by component ID
- `userProfile` (Object): User profile for personalized daily values

**Returns:** Promise\<Object>
```javascript
{
  totals: {
    calories: 650,
    protein: 45,
    carbohydrates: 32,
    fat: 18,
    fiber: 8,
    sugar: 12,
    sodium: 890
  },
  components: [
    {
      id: "component_123",
      name: "grilled chicken",
      nutrients: { calories: 250, protein: 28, ... },
      portion: { weight: { value: 150, unit: "g" } },
      confidence: 0.9
    }
  ],
  macroBreakdown: {
    protein: { grams: 45, calories: 180, percentage: 28 },
    carbohydrates: { grams: 32, calories: 128, percentage: 20 },
    fat: { grams: 18, calories: 162, percentage: 25 }
  },
  dailyValuePercentages: {
    calories: { value: 650, dailyValue: 2000, percentage: 33 },
    protein: { value: 45, dailyValue: 56, percentage: 80 }
  },
  micronutrients: {
    vitamins: { vitamin_c: 25, vitamin_a: 15 },
    minerals: { iron: 8, calcium: 120 }
  },
  confidence: 0.85
}
```

#### `assessHealthImpact(mealComponents, preparationMethods, userProfile)`

Assess the health impact of a meal.

**Parameters:**
- `mealComponents` (Array): Recognized meal components
- `preparationMethods` (Object): Detected preparation methods
- `userProfile` (Object): User health preferences and restrictions

**Returns:** Promise\<Object>
```javascript
{
  overallHealthScore: 78,
  benefits: [
    "High in lean protein",
    "Good vegetable content",
    "Healthy cooking methods"
  ],
  concerns: [
    "High sodium content",
    "Limited fiber"
  ],
  recommendations: [
    "Add more vegetables for better balance",
    "Consider reducing sodium content"
  ],
  dietaryAlignment: {
    vegetarian: { compatible: false, violations: ["chicken"] },
    "heart-healthy": { compatible: true, compatibilityScore: 85 }
  },
  allergenWarnings: [
    {
      component: "bread",
      allergen: "gluten",
      severity: "medium",
      message: "⚠️ ALLERGEN ALERT: bread contains gluten"
    }
  ],
  preparationImpact: {
    multiplier: 1.1,
    benefits: ["Grilling preserves nutrients"],
    overallPreparationScore: 85
  },
  nutritionalQuality: {
    score: 82,
    factors: {
      diversity: 75,
      processedRatio: 20,
      vegetableRatio: 40
    }
  }
}
```

#### `generateAlternatives(mealAnalysis, preferences)`

Generate healthier and dietary-compliant meal alternatives.

**Parameters:**
- `mealAnalysis` (Object): Complete meal analysis result
- `preferences` (Object): User dietary preferences and health goals

**Returns:** Promise\<Object>
```javascript
{
  alternatives: [
    {
      type: "healthier",
      original: "fried chicken",
      suggested: "grilled chicken",
      reason: "Lower in unhealthy fats",
      healthImpact: "+15 health points",
      priority: "high"
    },
    {
      type: "dietary",
      dietaryRestriction: "vegetarian",
      original: "chicken",
      alternatives: ["tofu", "tempeh", "lentil protein"],
      priority: "high"
    }
  ],
  categories: {
    healthier: 3,
    dietary: 2,
    allergySafe: 1,
    portionOptimized: 2
  }
}
```

## Integration Examples

### Camera Screen Integration

```javascript
import { foodRecognitionService } from '../services/FoodRecognitionService';
import { mealAnalysisService } from '../services/MealAnalysisService';

const processImage = async (imageBlob) => {
  try {
    // For food category, use AI-powered meal recognition
    if (category === 'food') {
      const mealAnalysis = await foodRecognitionService.recognizeMeal(imageBlob, {
        includePortions: true,
        includeNutrition: true,
        learningLevel: userProfile.learningLevel || 'beginner'
      });

      // Get comprehensive nutritional analysis
      const nutrition = await mealAnalysisService.calculateNutrition(
        mealAnalysis.components,
        mealAnalysis.portions,
        userProfile
      );

      // Get health impact assessment
      const healthAssessment = await mealAnalysisService.assessHealthImpact(
        mealAnalysis.components,
        mealAnalysis.preparationMethod,
        userProfile
      );

      // Create comprehensive scan result
      const scanResult = {
        id: mealAnalysis.id,
        type: 'meal_analysis',
        category: 'food',
        mealAnalysis,
        nutrition,
        healthAssessment,
        timestamp: mealAnalysis.timestamp,
        image: imageBlob
      };

      // Navigate to results
      navigate(`/results/${scanResult.id}`, { state: { scanResult } });
    }
  } catch (error) {
    console.error('Meal processing failed:', error);
    setError('Failed to analyze meal. Please try again.');
  }
};
```

### Results Screen Integration

```javascript
const ResultsScreen = () => {
  const { scanResult } = useLocation().state;

  if (scanResult.type === 'meal_analysis') {
    return (
      <div className="meal-results">
        <MealSummary analysis={scanResult.mealAnalysis} />
        <NutritionBreakdown nutrition={scanResult.nutrition} />
        <HealthAssessment assessment={scanResult.healthAssessment} />
        <AlternativeSuggestions alternatives={scanResult.alternatives} />
      </div>
    );
  }
};
```

### Progressive Learning Integration

```javascript
// Adjust complexity and detail based on user learning level
const getLearningAppropriateResults = (results, learningLevel) => {
  switch (learningLevel) {
    case 'beginner':
      return {
        ...results,
        components: results.components.slice(0, 5), // Limit complexity
        focusAreas: ['basic nutrition', 'portion awareness'],
        explanations: 'simplified'
      };

    case 'intermediate':
      return {
        ...results,
        focusAreas: ['macro balance', 'preparation methods'],
        explanations: 'moderate'
      };

    case 'advanced':
      return {
        ...results,
        focusAreas: ['micronutrients', 'bioavailability', 'meal timing'],
        explanations: 'detailed'
      };
  }
};
```

## Error Handling & Offline Support

### Graceful Degradation
```javascript
// The services automatically handle failures gracefully:

// 1. API fallback chain
// Google Vision -> Clarifai -> LogMeal -> Offline recognition

// 2. Offline nutrition data
// USDA API -> Edamam -> Local database -> Generic estimates

// 3. Progressive enhancement
// Full analysis -> Basic analysis -> Manual entry prompts
```

### Offline Storage
```javascript
// All results are automatically stored offline via OfflineService
await offlineService.saveScanResult({
  ...mealAnalysis,
  type: 'meal_analysis',
  category: 'food'
});

// Retrieve meal history
const mealHistory = await offlineService.getScanResults(50, 0);
const mealAnalyses = mealHistory.filter(item => item.type === 'meal_analysis');
```

## Configuration

### Environment Variables
```bash
# Required for full functionality
REACT_APP_VISION_API_KEY=your_google_vision_key
REACT_APP_CLARIFAI_KEY=your_clarifai_key
REACT_APP_LOGMEAL_KEY=your_logmeal_key
REACT_APP_USDA_KEY=your_usda_key
REACT_APP_EDAMAM_ID=your_edamam_id
REACT_APP_EDAMAM_KEY=your_edamam_key

# Optional for enhanced AI analysis
REACT_APP_ANTHROPIC_KEY=your_anthropic_key
REACT_APP_OPENAI_KEY=your_openai_key
```

### Service Configuration
```javascript
// Customize recognition thresholds
foodRecognitionService.confidenceThresholds = {
  high: 0.9,    // Very confident
  medium: 0.7,  // Moderately confident
  low: 0.5      // Low confidence threshold
};

// Customize API priorities
foodRecognitionService.visionAPIs.googleVision.priority = 1;
foodRecognitionService.visionAPIs.clarifai.priority = 2;
```

## Performance Considerations

### Caching Strategy
- Recognition results cached for 1 hour
- Nutrition data cached for 30 minutes
- Health profiles cached per session
- Trending data updated daily

### Image Optimization
- Automatic compression for large images
- Format detection and optimization
- Size limits per API provider
- Progressive quality reduction

### Rate Limiting
- Built-in rate limiting for external APIs
- Automatic backoff on API failures
- Fair usage across API providers
- Offline fallbacks when limits exceeded

## Testing & Validation

### Unit Testing
```bash
npm test -- --testPathPattern=FoodRecognition
npm test -- --testPathPattern=MealAnalysis
```

### Integration Testing
```javascript
// Test complete workflow
describe('Meal Recognition Workflow', () => {
  it('should recognize meal and provide nutrition analysis', async () => {
    const imageBlob = createTestMealImage();
    const result = await foodRecognitionService.recognizeMeal(imageBlob);
    expect(result.components).toHaveLength(greaterThan(0));

    const nutrition = await mealAnalysisService.calculateNutrition(
      result.components,
      result.portions
    );
    expect(nutrition.totals.calories).toBeGreaterThan(0);
  });
});
```

## Troubleshooting

### Common Issues

1. **Low Recognition Confidence**
   - Ensure good lighting and clear food visibility
   - Try multiple API providers via fallback chain
   - Check image quality and format

2. **API Rate Limits**
   - Services automatically handle rate limiting
   - Falls back to offline recognition
   - Consider upgrading API plans for high usage

3. **Nutrition Data Accuracy**
   - Verify portion estimations
   - Cross-reference with multiple data sources
   - Use manual adjustments when needed

4. **Performance Issues**
   - Enable image compression
   - Reduce recognition complexity for beginners
   - Use caching effectively

### Debug Mode
```javascript
// Enable detailed logging
localStorage.setItem('debug_food_recognition', 'true');
localStorage.setItem('debug_meal_analysis', 'true');
```

## Roadmap

### Planned Features
- [ ] Real-time meal tracking
- [ ] Meal planning integration
- [ ] Recipe suggestions
- [ ] Barcode scanning for packaged foods
- [ ] Voice-guided portion estimation
- [ ] AR overlay for food identification
- [ ] Integration with fitness trackers
- [ ] Social meal sharing

### API Expansions
- [ ] Additional vision API providers
- [ ] Enhanced nutrition databases
- [ ] Restaurant menu integration
- [ ] Cultural cuisine specialization
- [ ] Ingredient substitution engine

---

For technical support or feature requests, please refer to the main project documentation or create an issue in the project repository.