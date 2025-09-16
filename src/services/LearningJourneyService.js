import { offlineService } from './OfflineService';

class LearningJourneyService {
  constructor() {
    this.learningPaths = {
      beginner: {
        level: 'beginner',
        title: 'Ingredient Safety Basics',
        description: 'Learn the fundamentals of ingredient safety and make informed choices',
        focusAreas: ['Basic safety', 'Common allergens', 'Simple swaps'],
        complexity: 'simplified',
        explanations: 'layperson terms',
        requiredScans: 0,
        requiredKnowledge: 0,
        color: '#10b981',
        icon: '🌱'
      },
      intermediate: {
        level: 'intermediate',
        title: 'Ingredient Science',
        description: 'Understand how ingredients work and their effects on health',
        focusAreas: ['Chemical functions', 'Dosage effects', 'Interaction warnings'],
        complexity: 'moderate',
        explanations: 'detailed but accessible',
        requiredScans: 25,
        requiredKnowledge: 15,
        color: '#3b82f6',
        icon: '🧪'
      },
      expert: {
        level: 'expert',
        title: 'Advanced Ingredient Analysis',
        description: 'Deep dive into research, regulations, and manufacturing processes',
        focusAreas: ['Research citations', 'Regulatory differences', 'Manufacturing processes'],
        complexity: 'comprehensive',
        explanations: 'scientific depth',
        requiredScans: 100,
        requiredKnowledge: 50,
        color: '#8b5cf6',
        icon: '🔬'
      }
    };

    this.knowledgeTopics = this.initializeKnowledgeTopics();
    this.dailyLearningCards = this.initializeDailyCards();
  }

  async getUserLearningProfile() {
    try {
      let profile = await offlineService.getSetting('learningProfile');

      if (!profile) {
        profile = {
          currentLevel: 'beginner',
          totalScans: 0,
          knowledgePoints: 0,
          completedTopics: [],
          streakDays: 0,
          lastLearningDate: null,
          preferences: {
            learningStyle: 'visual', // visual, text, interactive
            dailyGoal: 'moderate', // light, moderate, intensive
            notifications: true
          },
          achievements: []
        };
        await offlineService.saveSetting('learningProfile', profile);
      }

      return profile;
    } catch (error) {
      console.error('Failed to load learning profile:', error);
      return this.getDefaultProfile();
    }
  }

  async updateLearningProgress(activity) {
    try {
      const profile = await this.getUserLearningProfile();

      // Update based on activity type
      switch (activity.type) {
        case 'scan_completed':
          profile.totalScans++;
          profile.knowledgePoints += 1;
          break;
        case 'topic_completed':
          if (!profile.completedTopics.includes(activity.topicId)) {
            profile.completedTopics.push(activity.topicId);
            profile.knowledgePoints += activity.points || 5;
          }
          break;
        case 'daily_card_read':
          profile.knowledgePoints += 2;
          this.updateStreak(profile);
          break;
        case 'ingredient_researched':
          profile.knowledgePoints += 3;
          break;
      }

      // Check for level advancement
      const newLevel = this.calculateUserLevel(profile);
      if (newLevel !== profile.currentLevel) {
        profile.currentLevel = newLevel;
        profile.achievements.push({
          type: 'level_up',
          level: newLevel,
          date: new Date().toISOString(),
          title: `Advanced to ${newLevel} level!`
        });
      }

      await offlineService.saveSetting('learningProfile', profile);
      return profile;
    } catch (error) {
      console.error('Failed to update learning progress:', error);
    }
  }

  calculateUserLevel(profile) {
    const { totalScans, knowledgePoints } = profile;

    if (totalScans >= this.learningPaths.expert.requiredScans &&
        knowledgePoints >= this.learningPaths.expert.requiredKnowledge) {
      return 'expert';
    } else if (totalScans >= this.learningPaths.intermediate.requiredScans &&
               knowledgePoints >= this.learningPaths.intermediate.requiredKnowledge) {
      return 'intermediate';
    }
    return 'beginner';
  }

  updateStreak(profile) {
    const today = new Date().toDateString();
    const lastDate = profile.lastLearningDate ? new Date(profile.lastLearningDate).toDateString() : null;

    if (lastDate === today) {
      return; // Already learned today
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (lastDate === yesterday.toDateString()) {
      profile.streakDays++;
    } else if (lastDate !== today) {
      profile.streakDays = 1;
    }

    profile.lastLearningDate = new Date().toISOString();
  }

  async getPersonalizedContent(ingredient, userLevel = 'beginner') {
    const levelConfig = this.learningPaths[userLevel];
    const knowledgeBase = this.knowledgeTopics[ingredient.id] || this.getGenericKnowledge(ingredient);

    return {
      basicInfo: this.formatExplanation(knowledgeBase.basic, levelConfig),
      safetyInfo: this.formatSafetyInfo(knowledgeBase.safety, levelConfig),
      recommendations: this.getPersonalizedRecommendations(ingredient, levelConfig),
      learningTips: this.getLearningTips(ingredient, levelConfig),
      nextSteps: this.getNextSteps(ingredient, userLevel)
    };
  }

  formatExplanation(content, levelConfig) {
    switch (levelConfig.complexity) {
      case 'simplified':
        return {
          title: content.simple.title,
          explanation: content.simple.text,
          keyPoints: content.simple.keyPoints.slice(0, 3),
          analogies: content.simple.analogies || []
        };
      case 'moderate':
        return {
          title: content.moderate.title,
          explanation: content.moderate.text,
          keyPoints: content.moderate.keyPoints,
          mechanism: content.moderate.howItWorks,
          dosage: content.moderate.dosageInfo
        };
      case 'comprehensive':
        return {
          title: content.advanced.title,
          explanation: content.advanced.text,
          keyPoints: content.advanced.keyPoints,
          mechanism: content.advanced.detailedMechanism,
          research: content.advanced.researchCitations,
          regulations: content.advanced.regulatoryInfo,
          manufacturing: content.advanced.manufacturingContext
        };
      default:
        return content.simple;
    }
  }

  formatSafetyInfo(safetyData, levelConfig) {
    const baseInfo = {
      riskLevel: safetyData.riskLevel,
      immediateEffects: safetyData.immediateEffects,
      longTermConcerns: safetyData.longTermConcerns
    };

    if (levelConfig.complexity === 'comprehensive') {
      return {
        ...baseInfo,
        studies: safetyData.studies,
        regulatoryStatus: safetyData.regulatoryStatus,
        contraindications: safetyData.contraindications,
        interactionWarnings: safetyData.interactions
      };
    } else if (levelConfig.complexity === 'moderate') {
      return {
        ...baseInfo,
        dosageGuidelines: safetyData.dosageGuidelines,
        sensitivityInfo: safetyData.sensitivityInfo
      };
    }

    return {
      riskLevel: safetyData.riskLevel,
      simpleExplanation: safetyData.simpleExplanation,
      basicTips: safetyData.basicTips
    };
  }

  getPersonalizedRecommendations(ingredient, levelConfig) {
    const recommendations = [];

    if (ingredient.safetyScore < 60) {
      recommendations.push({
        type: 'warning',
        priority: 'high',
        message: levelConfig.complexity === 'simplified'
          ? 'This ingredient may not be the safest choice for daily use'
          : 'Consider alternatives due to potential health concerns',
        actionable: true
      });
    }

    if (levelConfig.focusAreas.includes('Simple swaps') && ingredient.alternatives) {
      recommendations.push({
        type: 'swap',
        priority: 'medium',
        message: 'Here are safer alternatives you might consider',
        alternatives: ingredient.alternatives.slice(0, 3)
      });
    }

    return recommendations;
  }

  getLearningTips(ingredient, levelConfig) {
    const tips = [];

    if (levelConfig.level === 'beginner') {
      tips.push({
        type: 'basic_tip',
        content: 'Start by checking the safety score - green is good, red needs attention'
      });
      tips.push({
        type: 'reading_tip',
        content: 'Ingredients are listed by quantity - the first few are the most important'
      });
    } else if (levelConfig.level === 'intermediate') {
      tips.push({
        type: 'function_tip',
        content: `This ingredient works as a ${ingredient.category} - here's why that matters...`
      });
      tips.push({
        type: 'dosage_tip',
        content: 'The concentration of this ingredient affects its safety profile'
      });
    } else {
      tips.push({
        type: 'research_tip',
        content: 'Check the latest peer-reviewed research on this ingredient\'s long-term effects'
      });
    }

    return tips;
  }

  getNextSteps(ingredient, userLevel) {
    const steps = [];

    if (userLevel === 'beginner') {
      steps.push('Learn about 3 more ingredients to advance your knowledge');
      steps.push('Try scanning a different product category');
    } else if (userLevel === 'intermediate') {
      steps.push('Research the manufacturing process behind this ingredient');
      steps.push('Compare regulatory approaches to this ingredient globally');
    } else {
      steps.push('Dive into the latest research studies');
      steps.push('Contribute to community knowledge by sharing insights');
    }

    return steps;
  }

  async getDailyLearningCard() {
    try {
      const profile = await this.getUserLearningProfile();
      const today = new Date().toDateString();
      const cardKey = `daily_card_${today}`;

      let todayCard = await offlineService.getSetting(cardKey);

      if (!todayCard) {
        const availableCards = this.dailyLearningCards[profile.currentLevel] || this.dailyLearningCards.beginner;
        const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];

        todayCard = {
          ...randomCard,
          date: today,
          level: profile.currentLevel
        };

        await offlineService.saveSetting(cardKey, todayCard);
      }

      return todayCard;
    } catch (error) {
      console.error('Failed to get daily learning card:', error);
      return this.getFallbackCard();
    }
  }

  initializeKnowledgeTopics() {
    return {
      'parabens': {
        basic: {
          simple: {
            title: 'Parabens: Preservatives in Your Products',
            text: 'Parabens are chemicals that prevent bacteria and mold from growing in your skincare and makeup products. Think of them like the preservatives that keep your food fresh, but for cosmetics.',
            keyPoints: [
              'Keep products fresh and safe from harmful bacteria',
              'Found in most skincare, makeup, and personal care items',
              'Some people worry about their long-term health effects'
            ],
            analogies: [
              'Like preservatives in food, they prevent spoilage',
              'Work like tiny security guards protecting your products'
            ]
          },
          moderate: {
            title: 'Understanding Parabens: Function and Concerns',
            text: 'Parabens are a family of synthetic preservatives that work by disrupting the cellular processes of microorganisms. While effective at preventing contamination, they have raised concerns due to their ability to mimic estrogen in the body.',
            keyPoints: [
              'Antimicrobial agents that extend product shelf life',
              'Weak estrogenic activity detected in laboratory studies',
              'Absorption through skin varies by molecular size and formulation',
              'Most commonly used: methylparaben, propylparaben, butylparaben'
            ],
            howItWorks: 'Parabens penetrate bacterial cell walls and disrupt essential metabolic processes',
            dosageInfo: 'EU limits parabens to 0.4% for single esters, 0.8% for mixtures'
          },
          advanced: {
            title: 'Parabens: Molecular Structure, Bioaccumulation, and Regulatory Science',
            text: 'Parabens (para-hydroxybenzoic acid esters) demonstrate varying degrees of estrogenic potency inversely related to their molecular weight. Recent pharmacokinetic studies reveal tissue-specific accumulation patterns with implications for chronic exposure assessment.',
            keyPoints: [
              'Molecular structure affects both efficacy and hormonal activity',
              'Bioaccumulation evidence found in human breast tissue samples',
              'Metabolic clearance varies significantly between individuals',
              'Synergistic effects possible with other endocrine disruptors'
            ],
            detailedMechanism: 'Parabens bind to estrogen receptors ERα and ERβ with varying affinity, potentially disrupting normal hormonal signaling cascades',
            researchCitations: [
              'Darbre, P.D. (2019). Overview of potential human health effects of parabens. Current Opinion in Toxicology',
              'Nowak, K. (2018). Parabens and their effects on the endocrine system. Molecular and Cellular Endocrinology'
            ],
            regulatoryInfo: 'FDA considers parabens GRAS; EU banned propyl- and butylparaben in leave-on products for children under 3',
            manufacturingContext: 'Synthetic production via esterification of para-hydroxybenzoic acid with corresponding alcohols'
          }
        },
        safety: {
          riskLevel: 'moderate',
          immediateEffects: ['Rare allergic reactions', 'Possible skin sensitivity'],
          longTermConcerns: ['Potential hormonal disruption', 'Bioaccumulation in tissues'],
          simpleExplanation: 'Generally safe for most people, but some prefer to avoid them due to hormone concerns',
          basicTips: ['Look for "paraben-free" labels if concerned', 'Patch test new products'],
          studies: ['Multiple studies on estrogenic activity', 'Bioaccumulation research ongoing'],
          regulatoryStatus: 'Approved by FDA, restricted by EU for children',
          contraindications: ['Known paraben sensitivity', 'Pregnancy (precautionary)'],
          interactions: ['May interact with other endocrine disruptors']
        }
      }
      // Add more ingredients as needed
    };
  }

  initializeDailyCards() {
    return {
      beginner: [
        {
          id: 'reading_labels_101',
          type: 'basic_skill',
          title: 'Reading Labels Like a Pro',
          content: 'Ingredients are listed in order of quantity. The first 5 ingredients make up about 80% of the product!',
          tip: 'Focus on the first few ingredients - they have the biggest impact',
          actionable: 'Next time you scan, pay special attention to the top 3 ingredients',
          estimatedTime: '2 min read'
        },
        {
          id: 'common_allergens',
          type: 'safety_awareness',
          title: 'Top 5 Skin Allergens to Watch',
          content: 'Fragrance, preservatives, dyes, lanolin, and formaldehyde-releasers cause 90% of cosmetic allergies.',
          tip: 'If you have sensitive skin, these are your main ingredients to avoid',
          actionable: 'Check your current products for these common irritants',
          estimatedTime: '3 min read'
        },
        {
          id: 'simple_swaps',
          type: 'practical_advice',
          title: 'Easy Product Swaps for Better Health',
          content: 'Small changes make big differences: fragrance-free moisturizers, sulfate-free shampoos, and aluminum-free deodorants.',
          tip: 'Start with one category - like switching to a gentler shampoo',
          actionable: 'Try one swap this week and see how your skin responds',
          estimatedTime: '2 min read'
        }
      ],
      intermediate: [
        {
          id: 'chemical_functions',
          type: 'science_education',
          title: 'Why Ingredients Do What They Do',
          content: 'Every ingredient has a job: emulsifiers blend oil and water, humectants attract moisture, preservatives prevent spoilage.',
          tip: 'Understanding function helps you make better ingredient choices',
          actionable: 'Next scan: identify what job each main ingredient is doing',
          estimatedTime: '4 min read'
        },
        {
          id: 'dosage_matters',
          type: 'safety_science',
          title: 'The Dose Makes the Poison',
          content: 'Concentration matters more than presence. 0.1% salicylic acid is gentle; 2% is strong. Context is everything.',
          tip: 'Look for percentages on active ingredients to understand potency',
          actionable: 'Compare concentrations in similar products you own',
          estimatedTime: '5 min read'
        }
      ],
      expert: [
        {
          id: 'regulatory_differences',
          type: 'advanced_knowledge',
          title: 'Global Ingredient Regulations Vary Widely',
          content: 'The EU bans 1,300+ cosmetic ingredients; the US bans only 11. Understanding these differences helps interpret safety data.',
          tip: 'Consider the regulatory context when evaluating ingredient safety',
          actionable: 'Research the regulatory status of an ingredient you use frequently',
          estimatedTime: '7 min read'
        }
      ]
    };
  }

  getGenericKnowledge(ingredient) {
    return {
      basic: {
        simple: {
          title: `Understanding ${ingredient.name}`,
          text: `${ingredient.name} is commonly used in ${ingredient.category} products. Let's learn about its safety and function.`,
          keyPoints: [
            `Used as a ${ingredient.category} in many products`,
            `Safety score: ${ingredient.safetyScore}/100`,
            ingredient.isKnown ? 'Well-studied ingredient' : 'Limited safety data available'
          ]
        }
      },
      safety: {
        riskLevel: ingredient.hazardLevel || 'unknown',
        simpleExplanation: `This ingredient has a safety score of ${ingredient.safetyScore}/100`,
        basicTips: ['Monitor for any reactions when using', 'Consider alternatives if sensitive']
      }
    };
  }

  getDefaultProfile() {
    return {
      currentLevel: 'beginner',
      totalScans: 0,
      knowledgePoints: 0,
      completedTopics: [],
      streakDays: 0,
      lastLearningDate: null,
      preferences: {
        learningStyle: 'visual',
        dailyGoal: 'moderate',
        notifications: true
      },
      achievements: []
    };
  }

  getFallbackCard() {
    return {
      id: 'fallback',
      type: 'basic_skill',
      title: 'Welcome to LabelIQ Learning!',
      content: 'Every ingredient you scan is a step toward better understanding what you put on and in your body.',
      tip: 'Knowledge is power - start with one ingredient at a time',
      actionable: 'Scan your first product to begin your learning journey',
      estimatedTime: '1 min read'
    };
  }
}

export const learningJourneyService = new LearningJourneyService();