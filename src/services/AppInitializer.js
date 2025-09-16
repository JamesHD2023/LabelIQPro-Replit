import { offlineService } from './OfflineService';

// Sample ingredient database for offline functionality
const SAMPLE_INGREDIENTS = [
  {
    id: 'water',
    name: 'Water',
    category: 'base',
    safetyScore: 95,
    hazardLevel: 'safe',
    description: 'Pure water, essential for life and generally safe in all applications.',
    synonyms: ['aqua', 'h2o', 'purified water']
  },
  {
    id: 'sodium_chloride',
    name: 'Sodium Chloride',
    category: 'preservative',
    safetyScore: 85,
    hazardLevel: 'safe',
    description: 'Common salt, generally safe but high amounts may contribute to hypertension.',
    synonyms: ['salt', 'table salt', 'sea salt', 'rock salt']
  },
  {
    id: 'citric_acid',
    name: 'Citric Acid',
    category: 'preservative',
    safetyScore: 90,
    hazardLevel: 'safe',
    description: 'Natural preservative found in citrus fruits, generally safe.',
    synonyms: ['e330']
  },
  {
    id: 'sodium_benzoate',
    name: 'Sodium Benzoate',
    category: 'preservative',
    safetyScore: 65,
    hazardLevel: 'low',
    description: 'Common preservative, may form benzene when combined with vitamin C.',
    synonyms: ['e211']
  },
  {
    id: 'high_fructose_corn_syrup',
    name: 'High Fructose Corn Syrup',
    category: 'sweetener',
    safetyScore: 45,
    hazardLevel: 'medium',
    description: 'Processed sweetener linked to obesity and metabolic issues when consumed in excess.',
    synonyms: ['hfcs', 'corn syrup']
  },
  {
    id: 'artificial_colors',
    name: 'Artificial Food Coloring',
    category: 'colorant',
    safetyScore: 40,
    hazardLevel: 'medium',
    description: 'Synthetic dyes that may cause hyperactivity in children and allergic reactions.',
    synonyms: ['red 40', 'yellow 5', 'blue 1', 'food dye']
  },
  // Cosmetic ingredients
  {
    id: 'parabens',
    name: 'Parabens',
    category: 'preservative',
    safetyScore: 35,
    hazardLevel: 'medium',
    description: 'Preservatives that may disrupt hormones and cause skin irritation.',
    synonyms: ['methylparaben', 'propylparaben', 'butylparaben']
  },
  {
    id: 'sulfates',
    name: 'Sulfates',
    category: 'surfactant',
    safetyScore: 55,
    hazardLevel: 'low',
    description: 'Cleaning agents that can strip natural oils and cause dryness.',
    synonyms: ['sodium lauryl sulfate', 'sls', 'sodium laureth sulfate']
  },
  {
    id: 'fragrance',
    name: 'Fragrance',
    category: 'fragrance',
    safetyScore: 50,
    hazardLevel: 'low',
    description: 'Synthetic scents that may cause allergic reactions and skin sensitivity.',
    synonyms: ['parfum', 'perfume']
  },
  // Household product ingredients
  {
    id: 'ammonia',
    name: 'Ammonia',
    category: 'solvent',
    safetyScore: 25,
    hazardLevel: 'high',
    description: 'Strong cleaning agent that can cause respiratory irritation and burns.',
    synonyms: ['ammonium hydroxide']
  },
  {
    id: 'bleach',
    name: 'Sodium Hypochlorite',
    category: 'bleach',
    safetyScore: 20,
    hazardLevel: 'high',
    description: 'Powerful disinfectant that can cause burns and respiratory issues.',
    synonyms: ['bleach', 'chlorine bleach']
  }
];

export async function initializeApp() {
  try {
    console.log('Initializing PWA services...');

    // Initialize offline service
    await offlineService.initialize();
    console.log('Offline service initialized');

    // Cache sample ingredients
    await offlineService.cacheIngredients(SAMPLE_INGREDIENTS);
    console.log('Ingredient database cached');

    // Initialize user profile if not exists
    const existingProfile = await offlineService.getUserProfile();
    if (!existingProfile) {
      await offlineService.saveUserProfile({
        id: 'current',
        allergies: [],
        sensitivities: [],
        dietaryPreferences: [],
        language: 'en',
        notifications: true,
        createdAt: new Date().toISOString()
      });
      console.log('Default user profile created');
    }

    // Set default app settings
    const theme = await offlineService.getSetting('theme', 'auto');
    if (theme !== 'auto') {
      document.documentElement.setAttribute('data-theme', theme);
    }

    console.log('PWA initialization complete');

    return { success: true };
  } catch (error) {
    console.error('PWA initialization failed:', error);
    throw error;
  }
}