/**
 * Smart Expert Router Service
 * Intelligently routes user queries to the most appropriate AI expert
 */

class SmartExpertRouter {
  constructor() {
    // Expert specialization mapping
    this.experts = {
      allergist: {
        name: 'AI Allergist Assistant',
        title: 'Allergy & Immunology AI',
        avatar: '🤧',
        specialties: ['allergies', 'immunology', 'cross-reactions', 'anaphylaxis'],
        keywords: [
          'allergy', 'allergic', 'reaction', 'anaphylaxis', 'hives', 'swelling',
          'cross-reaction', 'sensitization', 'immunoglobulin', 'histamine',
          'nuts', 'dairy', 'eggs', 'shellfish', 'latex', 'pollen'
        ],
        confidence: 0.9
      },
      dermatologist: {
        name: 'AI Dermatology Consultant',
        title: 'Skin Health AI',
        avatar: '🧴',
        specialties: ['skin', 'dermatitis', 'cosmetics', 'topical reactions'],
        keywords: [
          'skin', 'rash', 'irritation', 'burning', 'itching', 'dermatitis',
          'eczema', 'contact', 'cosmetic', 'lotion', 'cream', 'sensitive skin',
          'acne', 'breakout', 'patch test', 'topical', 'sunscreen'
        ],
        confidence: 0.85
      },
      gastroenterologist: {
        name: 'AI Digestive Health Advisor',
        title: 'Gut Health AI',
        avatar: '🫃',
        specialties: ['digestive', 'gut health', 'food intolerance', 'IBS'],
        keywords: [
          'stomach', 'digest', 'bloating', 'gas', 'nausea', 'diarrhea',
          'constipation', 'ibs', 'ibd', 'crohns', 'celiac', 'gluten',
          'lactose', 'gut', 'intestinal', 'acid reflux', 'heartburn'
        ],
        confidence: 0.8
      },
      endocrinologist: {
        name: 'AI Metabolic Health Specialist',
        title: 'Hormone & Metabolism AI',
        avatar: '🩸',
        specialties: ['hormones', 'diabetes', 'metabolism', 'blood sugar'],
        keywords: [
          'diabetes', 'blood sugar', 'glucose', 'insulin', 'hormone',
          'thyroid', 'metabolism', 'endocrine', 'glycemic', 'carbohydrate',
          'sugar spike', 'hypoglycemia', 'hyperglycemia'
        ],
        confidence: 0.85
      },
      toxicologist: {
        name: 'AI Chemical Safety Analyst',
        title: 'Toxicology AI',
        avatar: '⚗️',
        specialties: ['chemical safety', 'toxicity', 'interactions', 'exposure'],
        keywords: [
          'toxic', 'poison', 'chemical', 'exposure', 'dose', 'interaction',
          'bioaccumulation', 'carcinogen', 'mutagenic', 'teratogenic',
          'heavy metals', 'pesticides', 'preservatives', 'additives'
        ],
        confidence: 0.75
      },
      nutritionist: {
        name: 'AI Nutrition Advisor',
        title: 'Digital Nutritionist',
        avatar: '🥗',
        specialties: ['nutrition', 'diet', 'wellness', 'supplements'],
        keywords: [
          'nutrition', 'diet', 'vitamin', 'mineral', 'supplement', 'deficiency',
          'macronutrient', 'micronutrient', 'calories', 'protein', 'fiber',
          'healthy eating', 'weight', 'energy', 'wellness'
        ],
        confidence: 0.8
      },
      pediatrician: {
        name: 'AI Child Health Specialist',
        title: 'Pediatric Safety AI',
        avatar: '👶',
        specialties: ['child safety', 'infant nutrition', 'development'],
        keywords: [
          'baby', 'infant', 'child', 'toddler', 'kids', 'pediatric',
          'development', 'growth', 'pregnancy', 'breastfeeding',
          'formula', 'weaning', 'choking hazard'
        ],
        confidence: 0.9
      }
    };

    // Context weight factors
    this.contextWeights = {
      scanResult: 0.4,     // Recent scan ingredients/results
      userProfile: 0.3,    // User allergies/preferences
      queryText: 0.3       // Direct query analysis
    };

    // Confidence thresholds
    this.thresholds = {
      high: 0.8,
      medium: 0.6,
      low: 0.4
    };
  }

  /**
   * Analyze query and route to appropriate expert(s)
   * @param {string} query - User's question
   * @param {Object} context - Scan results, user profile, etc.
   * @returns {Object} Expert routing recommendation
   */
  analyze(query, context = {}) {
    const queryLower = query.toLowerCase();
    const expertScores = {};

    // Initialize scores
    Object.keys(this.experts).forEach(expertId => {
      expertScores[expertId] = 0;
    });

    // 1. Analyze query text for keyword matches
    this.analyzeQueryKeywords(queryLower, expertScores);

    // 2. Factor in scan context
    this.analyzeScanContext(context.scanResult, expertScores);

    // 3. Factor in user profile
    this.analyzeUserProfile(context.userProfile, expertScores);

    // 4. Apply emergency escalation rules
    const emergencyLevel = this.assessEmergencyLevel(queryLower, context);

    // 5. Generate recommendations
    return this.generateRecommendations(expertScores, query, emergencyLevel);
  }

  /**
   * Analyze query text for expert keyword matches
   */
  analyzeQueryKeywords(queryLower, expertScores) {
    Object.entries(this.experts).forEach(([expertId, expert]) => {
      let keywordMatches = 0;

      expert.keywords.forEach(keyword => {
        if (queryLower.includes(keyword.toLowerCase())) {
          keywordMatches++;
        }
      });

      // Calculate keyword score (0-1)
      const keywordScore = Math.min(keywordMatches / 3, 1); // Cap at 3 matches
      expertScores[expertId] += keywordScore * this.contextWeights.queryText;
    });
  }

  /**
   * Analyze recent scan results for context
   */
  analyzeScanContext(scanResult, expertScores) {
    if (!scanResult) return;

    // Check for specific ingredient categories or flags
    const { ingredients = [], alerts = [], category = '' } = scanResult;

    ingredients.forEach(ingredient => {
      // Allergen detection
      if (ingredient.allergens?.length > 0) {
        expertScores.allergist += 0.3;
      }

      // Skin sensitizers
      if (ingredient.flags?.includes('skin_sensitizer')) {
        expertScores.dermatologist += 0.2;
      }

      // Digestive concerns
      if (ingredient.flags?.includes('digestive_irritant')) {
        expertScores.gastroenterologist += 0.2;
      }

      // Chemical concerns
      if (ingredient.hazardScore > 7) {
        expertScores.toxicologist += 0.2;
      }
    });

    // Category-based routing
    if (category === 'cosmetics' || category === 'personal_care') {
      expertScores.dermatologist += 0.2;
    }

    // Apply scan context weight
    Object.keys(expertScores).forEach(expertId => {
      expertScores[expertId] *= this.contextWeights.scanResult;
    });
  }

  /**
   * Analyze user profile for personalized routing
   */
  analyzeUserProfile(userProfile, expertScores) {
    if (!userProfile) return;

    const { allergies = [], conditions = [], age = null } = userProfile;

    // Allergy history
    if (allergies.length > 0) {
      expertScores.allergist += 0.3;
    }

    // Medical conditions
    conditions.forEach(condition => {
      const conditionLower = condition.toLowerCase();

      if (conditionLower.includes('diabetes')) {
        expertScores.endocrinologist += 0.4;
      }

      if (conditionLower.includes('ibs') || conditionLower.includes('crohn')) {
        expertScores.gastroenterologist += 0.4;
      }

      if (conditionLower.includes('eczema') || conditionLower.includes('dermatitis')) {
        expertScores.dermatologist += 0.4;
      }
    });

    // Age-based routing
    if (age && age < 18) {
      expertScores.pediatrician += 0.3;
    }

    // Apply user profile weight
    Object.keys(expertScores).forEach(expertId => {
      expertScores[expertId] *= this.contextWeights.userProfile;
    });
  }

  /**
   * Assess if query indicates emergency situation
   */
  assessEmergencyLevel(queryLower, context) {
    const emergencyKeywords = [
      'emergency', 'urgent', 'severe', 'anaphylaxis', 'can\'t breathe',
      'throat closing', 'severe reaction', 'hospital', 'call 911'
    ];

    const hasEmergencyKeywords = emergencyKeywords.some(keyword =>
      queryLower.includes(keyword)
    );

    if (hasEmergencyKeywords) {
      return 'high';
    }

    // Check for concerning symptom combinations
    const symptomCombos = [
      ['swelling', 'difficulty'],
      ['severe', 'reaction'],
      ['can\'t', 'breathe']
    ];

    const hasConcerningSymptoms = symptomCombos.some(combo =>
      combo.every(word => queryLower.includes(word))
    );

    return hasConcerningSymptoms ? 'medium' : 'low';
  }

  /**
   * Generate expert recommendations based on scores
   */
  generateRecommendations(expertScores, originalQuery, emergencyLevel) {
    // Sort experts by score
    const sortedExperts = Object.entries(expertScores)
      .map(([expertId, score]) => ({
        expertId,
        expert: this.experts[expertId],
        score: score * this.experts[expertId].confidence,
        confidence: this.getConfidenceLevel(score)
      }))
      .sort((a, b) => b.score - a.score)
      .filter(item => item.score > this.thresholds.low);

    // Determine primary and secondary experts
    const primary = sortedExperts[0] || null;
    const secondary = sortedExperts.slice(1, 3);

    // Generate response
    const response = {
      query: originalQuery,
      emergencyLevel,
      routing: {
        primary: primary ? {
          expertId: primary.expertId,
          expert: primary.expert,
          confidence: primary.confidence,
          score: primary.score
        } : null,
        secondary: secondary.map(item => ({
          expertId: item.expertId,
          expert: item.expert,
          confidence: item.confidence,
          score: item.score
        })),
        multiExpert: sortedExperts.length > 1 && sortedExperts[0].score - sortedExperts[1].score < 0.2
      },
      suggestions: this.generateSuggestions(primary?.expertId, originalQuery),
      timestamp: new Date().toISOString()
    };

    // Add emergency protocol if needed
    if (emergencyLevel === 'high') {
      response.emergencyProtocol = {
        message: "This appears to be a medical emergency. If you're experiencing severe symptoms, please call emergency services immediately.",
        actions: [
          "Call 911 (US) or local emergency number",
          "Contact your doctor immediately",
          "Use emergency medication if prescribed (EpiPen, inhaler, etc.)",
          "Stay calm and get help"
        ]
      };
    }

    return response;
  }

  /**
   * Get confidence level from score
   */
  getConfidenceLevel(score) {
    if (score >= this.thresholds.high) return 'high';
    if (score >= this.thresholds.medium) return 'medium';
    return 'low';
  }

  /**
   * Generate follow-up suggestions based on expert
   */
  generateSuggestions(expertId, query) {
    const suggestionMap = {
      allergist: [
        "Would you like to know about cross-reactions?",
        "Should we discuss emergency preparedness?",
        "Want to learn about allergy testing options?"
      ],
      dermatologist: [
        "Would you like skin patch testing advice?",
        "Should we discuss ingredient alternatives?",
        "Want to know about sensitive skin care routines?"
      ],
      gastroenterologist: [
        "Would you like dietary modification suggestions?",
        "Should we discuss elimination diet protocols?",
        "Want to learn about gut health optimization?"
      ],
      endocrinologist: [
        "Would you like blood sugar management tips?",
        "Should we discuss carbohydrate counting?",
        "Want to know about glycemic index impacts?"
      ],
      toxicologist: [
        "Would you like exposure limit information?",
        "Should we discuss safety precautions?",
        "Want to know about ingredient interactions?"
      ],
      nutritionist: [
        "Would you like personalized nutrition advice?",
        "Should we discuss supplement interactions?",
        "Want to know about nutrient absorption?"
      ],
      pediatrician: [
        "Would you like age-appropriate safety guidelines?",
        "Should we discuss developmental considerations?",
        "Want to know about child-safe alternatives?"
      ]
    };

    return suggestionMap[expertId] || [
      "Would you like more detailed information?",
      "Should we explore related topics?",
      "Want to discuss prevention strategies?"
    ];
  }

  /**
   * Get expert by ID
   */
  getExpert(expertId) {
    return this.experts[expertId] || null;
  }

  /**
   * Get all available experts
   */
  getAllExperts() {
    return Object.entries(this.experts).map(([id, expert]) => ({
      id,
      ...expert
    }));
  }
}

// Export singleton instance
export const smartExpertRouter = new SmartExpertRouter();
export default SmartExpertRouter;