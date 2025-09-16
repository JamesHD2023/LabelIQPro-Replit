import { offlineService } from './OfflineService';

class IngredientParser {
  constructor() {
    this.separators = [',', ';', ':', '、', '，', '；', '\n', '.'];
    this.stopWords = ['and', 'or', 'with', 'contains', 'may contain', 'ingredients', 'ingrédients', 'inhaltsstoffe'];
    this.allergenKeywords = ['contains', 'may contain', 'allergens', 'allergy advice'];
  }

  async parseText(text, category = 'food') {
    try {
      console.log('Parsing text for category:', category);

      // Clean and normalize text
      const cleanedText = this.cleanText(text);

      // Extract potential ingredient lines
      const ingredientLines = this.extractIngredientLines(cleanedText);

      // Parse individual ingredients
      const rawIngredients = this.splitIntoIngredients(ingredientLines);

      // Normalize and validate ingredients
      const normalizedIngredients = await this.normalizeIngredients(rawIngredients, category);

      // Remove duplicates and filter
      const finalIngredients = this.deduplicateIngredients(normalizedIngredients);

      console.log(`Parsed ${finalIngredients.length} ingredients from text`);

      return finalIngredients;
    } catch (error) {
      console.error('Ingredient parsing failed:', error);
      throw error;
    }
  }

  cleanText(text) {
    return text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/[^\w\s,;.:()\-\n\/]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  extractIngredientLines(text) {
    const lines = text.split('\n');
    const ingredientLines = [];

    let foundIngredients = false;
    let allergenSection = false;

    for (const line of lines) {
      const normalizedLine = line.toLowerCase().trim();

      // Skip empty lines
      if (!normalizedLine) continue;

      // Check if we've reached allergen section
      if (this.allergenKeywords.some(keyword => normalizedLine.includes(keyword))) {
        allergenSection = true;
        continue;
      }

      // Check if this line contains ingredients marker
      if (normalizedLine.includes('ingredient') || normalizedLine.includes('ingrédient')) {
        foundIngredients = true;
        // Extract text after ingredients marker
        const match = line.match(/ingredient[s]?[:\-\s]+(.*)/i);
        if (match && match[1].trim()) {
          ingredientLines.push(match[1].trim());
        }
        continue;
      }

      // If we found ingredients marker, collect following lines
      if (foundIngredients && !allergenSection) {
        // Skip lines that look like nutritional info or other non-ingredient content
        if (this.looksLikeIngredientLine(normalizedLine)) {
          ingredientLines.push(line.trim());
        }
      }

      // If no ingredients marker found, try to detect ingredient-like lines
      if (!foundIngredients && this.looksLikeIngredientLine(normalizedLine)) {
        ingredientLines.push(line.trim());
      }
    }

    return ingredientLines.join(' ');
  }

  looksLikeIngredientLine(line) {
    // Skip lines that look like nutritional information
    const nutritionKeywords = ['calories', 'protein', 'fat', 'carb', 'sugar', 'sodium', 'vitamin', '%', 'mg', 'g'];
    if (nutritionKeywords.some(keyword => line.includes(keyword))) {
      return false;
    }

    // Skip lines that look like instructions
    const instructionKeywords = ['store', 'keep', 'refrigerate', 'use by', 'best before', 'consume'];
    if (instructionKeywords.some(keyword => line.includes(keyword))) {
      return false;
    }

    // Skip lines that are too short (likely not ingredients)
    if (line.length < 3) {
      return false;
    }

    // Must contain at least one comma or common ingredient word
    const commonIngredients = ['water', 'sugar', 'salt', 'oil', 'flour', 'milk', 'egg', 'acid', 'sodium'];
    return line.includes(',') || commonIngredients.some(ing => line.includes(ing));
  }

  splitIntoIngredients(text) {
    if (!text) return [];

    let ingredients = [text];

    // Split by separators, prioritizing commas
    for (const separator of this.separators) {
      const newIngredients = [];
      for (const ingredient of ingredients) {
        newIngredients.push(...ingredient.split(separator));
      }
      ingredients = newIngredients;
    }

    return ingredients
      .map(ing => ing.trim())
      .filter(ing => ing.length > 2)
      .filter(ing => !this.stopWords.some(word => ing.toLowerCase() === word.toLowerCase()));
  }

  async normalizeIngredients(rawIngredients, category) {
    const normalized = [];

    for (const rawIngredient of rawIngredients) {
      try {
        const ingredient = await this.normalizeIngredient(rawIngredient, category);
        if (ingredient) {
          normalized.push(ingredient);
        }
      } catch (error) {
        console.warn('Failed to normalize ingredient:', rawIngredient, error);
        // Add as unknown ingredient
        normalized.push({
          id: `unknown_${Date.now()}_${Math.random()}`,
          name: rawIngredient,
          normalizedName: rawIngredient.toLowerCase(),
          category: 'unknown',
          isKnown: false,
          safetyScore: 50, // Neutral score for unknown ingredients
          rawText: rawIngredient
        });
      }
    }

    return normalized;
  }

  async normalizeIngredient(rawText, category) {
    // Clean the ingredient text
    const cleaned = this.cleanIngredientText(rawText);
    if (!cleaned) return null;

    // Try to find in local database
    let ingredientData = await offlineService.findIngredient(cleaned, category);

    if (!ingredientData) {
      // Try common variations
      const variations = this.generateVariations(cleaned);
      for (const variation of variations) {
        ingredientData = await offlineService.findIngredient(variation, category);
        if (ingredientData) break;
      }
    }

    if (ingredientData) {
      return {
        id: ingredientData.id,
        name: ingredientData.name,
        normalizedName: ingredientData.name.toLowerCase(),
        category: ingredientData.category || category,
        isKnown: true,
        safetyScore: ingredientData.safetyScore || 50,
        hazardLevel: ingredientData.hazardLevel || 'unknown',
        description: ingredientData.description,
        synonyms: ingredientData.synonyms || [],
        rawText: rawText
      };
    }

    // Return as unknown ingredient
    return {
      id: `unknown_${cleaned.toLowerCase().replace(/\s+/g, '_')}`,
      name: cleaned,
      normalizedName: cleaned.toLowerCase(),
      category: 'unknown',
      isKnown: false,
      safetyScore: 50,
      hazardLevel: 'unknown',
      rawText: rawText
    };
  }

  cleanIngredientText(text) {
    return text
      .replace(/\([^)]*\)/g, '') // Remove parentheses and content
      .replace(/\[[^\]]*\]/g, '') // Remove brackets and content
      .replace(/[0-9]+%?/g, '') // Remove percentages and numbers
      .replace(/[^\w\s\-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  generateVariations(text) {
    const variations = [text];

    // Add plural/singular variations
    if (text.endsWith('s')) {
      variations.push(text.slice(0, -1));
    } else {
      variations.push(text + 's');
    }

    // Add common suffixes/prefixes variations
    const prefixes = ['sodium ', 'calcium ', 'potassium ', 'mono', 'di', 'tri'];
    const suffixes = [' acid', ' extract', ' oil', ' powder'];

    for (const prefix of prefixes) {
      if (text.startsWith(prefix)) {
        variations.push(text.substring(prefix.length));
      }
    }

    for (const suffix of suffixes) {
      if (text.endsWith(suffix)) {
        variations.push(text.substring(0, text.length - suffix.length));
      }
    }

    return [...new Set(variations)];
  }

  deduplicateIngredients(ingredients) {
    const seen = new Set();
    const unique = [];

    for (const ingredient of ingredients) {
      const key = ingredient.normalizedName || ingredient.name.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(ingredient);
      }
    }

    return unique;
  }
}

export const ingredientParser = new IngredientParser();