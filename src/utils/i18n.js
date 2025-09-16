import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      app: {
        name: 'LabelIQ',
        subtitle: 'AI-powered ingredient scanner',
        initError: 'Initialization failed'
      },
      navigation: {
        home: 'Home',
        scan: 'Scan',
        learning: 'Learn',
        history: 'History',
        dashboard: 'Dashboard',
        profile: 'Profile'
      },
      status: {
        offline: 'You are offline - some features may be limited'
      },
      loading: {
        initializing: 'Initializing LabelIQ...'
      },
      home: {
        subtitle: 'Scan ingredient labels with AI-powered analysis',
        selectCategory: 'What would you like to scan?',
        selectCategorySubtitle: 'Choose the type of product you want to analyze',
        examples: 'Examples',
        startScan: 'Start Scanning',
        scanOptions: {
          food: {
            title: 'Food Labels',
            subtitle: 'Scan ingredient lists on packaged foods',
            examples: ['Cereals & snacks', 'Beverages', 'Processed foods']
          },
          cosmetic: {
            title: 'Personal Care',
            subtitle: 'Analyze cosmetics and skincare products',
            examples: ['Skincare products', 'Makeup', 'Hair care']
          },
          household: {
            title: 'Household',
            subtitle: 'Check cleaning and household products',
            examples: ['Cleaning supplies', 'Detergents', 'Air fresheners']
          }
        },
        quickActions: {
          history: 'View History',
          insights: 'My Insights'
        }
      },
      camera: {
        title: {
          food: 'Scan Food Label',
          cosmetic: 'Scan Cosmetic Label',
          household: 'Scan Household Product'
        },
        instructions: {
          food: 'Point camera at ingredient list on food packaging',
          cosmetic: 'Focus on ingredient list on cosmetic product',
          household: 'Capture ingredient list on household product'
        },
        retry: 'Try Again',
        processing: 'Analyzing ingredients...',
        errors: {
          initFailed: 'Camera initialization failed',
          captureFailed: 'Failed to capture image',
          processingFailed: 'Image processing failed',
          noTextFound: 'No text found in image',
          noIngredientsFound: 'No ingredients detected'
        }
      },
      results: {
        title: 'Scan Results',
        loading: 'Analyzing results...',
        error: 'Analysis Error',
        backHome: 'Back to Home',
        overallSafety: 'Overall Safety Score',
        scoreCalculating: 'Calculating safety score...',
        warnings: 'Warnings',
        category: 'Category',
        scannedAt: 'Scanned at',
        ingredientCount: 'Ingredients found',
        detectedIngredients: 'Detected Ingredients',
        noIngredients: 'No ingredients were detected in this scan',
        showRawText: 'Show original text',
        saveToHistory: 'Save to History',
        newScan: 'New Scan',
        errors: {
          notFound: 'Scan result not found',
          loadFailed: 'Failed to load scan result'
        },
        ingredientModal: {
          description: 'Description',
          hazardLevel: 'Hazard Level',
          alsoKnownAs: 'Also known as'
        }
      },
      categories: {
        food: 'Food',
        cosmetic: 'Cosmetic',
        household: 'Household',
        unknown: 'Unknown'
      },
      safetyLevels: {
        excellent: 'Excellent',
        good: 'Good',
        fair: 'Fair',
        poor: 'Poor',
        danger: 'Danger'
      },
      hazardLevels: {
        safe: 'Safe',
        low: 'Low Risk',
        medium: 'Medium Risk',
        high: 'High Risk',
        danger: 'Dangerous'
      },
      ingredients: {
        unknown: 'Unknown ingredient',
        clickForDetails: 'Click for details about {{name}}',
        safetyScore: 'Safety score: {{score}}/100'
      },
      install: {
        title: 'Install LabelIQ',
        description: 'Get the full app experience with offline scanning',
        features: {
          offline: 'Works offline',
          camera: 'Full camera access',
          notifications: 'Smart notifications'
        },
        install: 'Install App',
        dismiss: 'Not now'
      },
      learning: {
        title: 'Learning Center',
        loading: 'Loading your learning journey...',
        levels: {
          beginner: {
            title: 'Ingredient Safety Basics',
            description: 'Learn the fundamentals of ingredient safety and make informed choices'
          },
          intermediate: {
            title: 'Ingredient Science',
            description: 'Understand how ingredients work and their effects on health'
          },
          expert: {
            title: 'Advanced Ingredient Analysis',
            description: 'Deep dive into research, regulations, and manufacturing processes'
          }
        },
        tabs: {
          today: 'Today',
          progress: 'Progress',
          library: 'Library'
        },
        dailyCard: {
          title: 'Today\'s Learning',
          subtitle: 'Expand your ingredient knowledge with daily insights'
        },
        stats: {
          dayStreak: 'Day Streak',
          points: 'Knowledge Points',
          scans: 'Total Scans'
        },
        tips: {
          title: 'Learning Tips',
          scanDaily: {
            title: 'Scan Daily',
            description: 'Build your streak by scanning one product each day'
          },
          readCards: {
            title: 'Read Daily Cards',
            description: 'Complete daily learning cards to earn knowledge points'
          },
          research: {
            title: 'Research Ingredients',
            description: 'Tap on ingredients to learn more about their effects'
          }
        },
        progress: {
          scansCompleted: 'Scans Completed',
          knowledgePoints: 'Knowledge Points',
          dayStreak: 'Day Streak',
          nextLevel: 'Next Level: {{level}}',
          viewDetails: 'View Details',
          scansNeeded: 'Scans Progress',
          knowledgeNeeded: 'Knowledge Progress',
          readyToAdvance: 'Ready to Advance!',
          congratulations: 'You\'ve met the requirements for the next level',
          expertAchieved: 'Expert Level Achieved!',
          expertDescription: 'You\'ve mastered ingredient analysis. Keep learning!',
          recentAchievements: 'Recent Achievements'
        },
        library: {
          title: 'Knowledge Library',
          subtitle: 'Browse topics by category and track your learning progress',
          completed: 'completed',
          categories: {
            ingredients: {
              title: 'Common Ingredients',
              description: 'Learn about frequently used ingredients and their effects'
            },
            safety: {
              title: 'Safety Guidelines',
              description: 'Understand safety protocols and risk assessment'
            },
            research: {
              title: 'Latest Research',
              description: 'Stay updated with the latest scientific findings'
            }
          },
          comingSoon: {
            title: 'More Content Coming Soon',
            description: 'We\'re constantly adding new learning materials and courses'
          }
        },
        types: {
          basic_skill: 'Basic Skill',
          safety_awareness: 'Safety Awareness',
          practical_advice: 'Practical Advice',
          science_education: 'Science Education',
          safety_science: 'Safety Science',
          advanced_knowledge: 'Advanced Knowledge'
        },
        tip: 'Tip',
        tryThis: 'Try This',
        keyPoints: 'Key Points',
        examples: 'Examples',
        dismiss: 'Not now',
        markComplete: 'Mark Complete',
        completed: 'Completed',
        motivation: {
          streak: 'Amazing! {{days}} day learning streak! 🔥',
          knowledgeExpert: 'You\'re becoming an ingredient expert! 🧠',
          expertLevel: 'Expert level achieved! You\'re mastering ingredient science! 🎓',
          keepLearning: 'Every scan teaches you something new! Keep it up! 📚'
        }
      },
      common: {
        close: 'Close',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        loading: 'Loading...',
        error: 'Error',
        retry: 'Retry'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;