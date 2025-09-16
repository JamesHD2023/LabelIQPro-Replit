import { offlineService } from './OfflineService';

class APIOrchestrator {
  constructor() {
    this.apiConfig = {
      // Ingredient Intelligence APIs
      ingredients: {
        cosmeticIngredient: {
          url: process.env.REACT_APP_COSMETIC_API_URL,
          key: process.env.REACT_APP_COSMETIC_API_KEY,
          timeout: 3000,
          priority: 1
        },
        pubchem: {
          url: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound',
          timeout: 5000,
          priority: 2,
          rateLimitPerMinute: 5
        },
        epa: {
          url: 'https://comptox.epa.gov/dashboard-api',
          timeout: 4000,
          priority: 3
        },
        openFDA: {
          url: 'https://api.fda.gov',
          timeout: 4000,
          priority: 4
        }
      },

      // AI Expert Systems
      expertAI: {
        anthropic: {
          url: 'https://api.anthropic.com/v1/messages',
          key: process.env.REACT_APP_ANTHROPIC_KEY,
          model: 'claude-3-sonnet-20240229',
          timeout: 10000,
          priority: 1
        },
        openai: {
          url: 'https://api.openai.com/v1/chat/completions',
          key: process.env.REACT_APP_OPENAI_KEY,
          model: 'gpt-4-turbo',
          timeout: 8000,
          priority: 2
        }
      },

      // Nutrition & Food Analysis
      nutrition: {
        usda: {
          url: 'https://api.nal.usda.gov/fdc/v1',
          key: process.env.REACT_APP_USDA_KEY,
          timeout: 3000,
          priority: 1
        },
        edamam: {
          url: 'https://api.edamam.com/api',
          appId: process.env.REACT_APP_EDAMAM_ID,
          key: process.env.REACT_APP_EDAMAM_KEY,
          timeout: 4000,
          priority: 2
        },
        spoonacular: {
          url: 'https://api.spoonacular.com',
          key: process.env.REACT_APP_SPOONACULAR_KEY,
          timeout: 5000,
          priority: 3
        }
      },

      // Food Recognition APIs
      vision: {
        googleVision: {
          url: 'https://vision.googleapis.com/v1',
          key: process.env.REACT_APP_VISION_API_KEY,
          timeout: 6000,
          priority: 1
        },
        clarifai: {
          url: 'https://api.clarifai.com/v2',
          key: process.env.REACT_APP_CLARIFAI_KEY,
          timeout: 5000,
          priority: 2
        },
        logmeal: {
          url: 'https://api.logmeal.es/v2',
          key: process.env.REACT_APP_LOGMEAL_KEY,
          timeout: 4000,
          priority: 3
        }
      },

      // Health Research APIs
      research: {
        pubmed: {
          url: 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils',
          timeout: 5000,
          priority: 1,
          rateLimitPerMinute: 10
        },
        clinicalTrials: {
          url: 'https://clinicaltrials.gov/api',
          timeout: 4000,
          priority: 2
        }
      }
    };

    this.rateLimiters = new Map();
    this.cache = new Map();
    this.failoverTracking = new Map();
  }

  async getIngredientIntelligence(ingredientName, category = 'unknown') {
    const cacheKey = `ingredient_${ingredientName}_${category}`;

    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const intelligence = {
      basicInfo: null,
      safetyData: null,
      regulations: null,
      alternatives: [],
      research: [],
      expertAnalysis: null,
      lastUpdated: new Date().toISOString()
    };

    try {
      // Multi-source data collection with failover
      const [basicInfo, safetyData, expertAnalysis] = await Promise.allSettled([
        this.fetchIngredientBasics(ingredientName),
        this.fetchSafetyData(ingredientName, category),
        this.getExpertAnalysis(ingredientName, category)
      ]);

      intelligence.basicInfo = basicInfo.status === 'fulfilled' ? basicInfo.value : null;
      intelligence.safetyData = safetyData.status === 'fulfilled' ? safetyData.value : null;
      intelligence.expertAnalysis = expertAnalysis.status === 'fulfilled' ? expertAnalysis.value : null;

      // Get recent research if basic info available
      if (intelligence.basicInfo) {
        intelligence.research = await this.fetchRecentResearch(ingredientName);
        intelligence.alternatives = await this.findAlternatives(ingredientName, category);
      }

      // Cache results for 1 hour
      this.cache.set(cacheKey, intelligence);
      setTimeout(() => this.cache.delete(cacheKey), 3600000);

      return intelligence;
    } catch (error) {
      console.error('Failed to get ingredient intelligence:', error);

      // Fallback to local data
      const localData = await offlineService.findIngredient(ingredientName, category);
      if (localData) {
        intelligence.basicInfo = localData;
        intelligence.expertAnalysis = await this.generateLocalExpertAnalysis(localData);
      }

      return intelligence;
    }
  }

  async fetchIngredientBasics(ingredientName) {
    const apis = Object.entries(this.apiConfig.ingredients)
      .sort((a, b) => a[1].priority - b[1].priority);

    for (const [apiName, config] of apis) {
      if (!this.canMakeRequest(apiName)) continue;

      try {
        switch (apiName) {
          case 'pubchem':
            return await this.fetchPubChemData(ingredientName, config);
          case 'cosmeticIngredient':
            return await this.fetchCosmeticDB(ingredientName, config);
          case 'epa':
            return await this.fetchEPAData(ingredientName, config);
          case 'openFDA':
            return await this.fetchFDAData(ingredientName, config);
        }
      } catch (error) {
        console.warn(`${apiName} failed for ${ingredientName}:`, error);
        this.trackFailure(apiName);
        continue;
      }
    }

    throw new Error('All ingredient APIs failed');
  }

  async fetchPubChemData(ingredientName, config) {
    const response = await fetch(
      `${config.url}/name/${encodeURIComponent(ingredientName)}/property/MolecularFormula,MolecularWeight,IUPACName/JSON`,
      {
        timeout: config.timeout,
        headers: { 'Content-Type': 'application/json' }
      }
    );

    if (!response.ok) throw new Error(`PubChem API error: ${response.status}`);

    const data = await response.json();

    return {
      source: 'PubChem',
      molecularFormula: data.PropertyTable?.Properties?.[0]?.MolecularFormula,
      molecularWeight: data.PropertyTable?.Properties?.[0]?.MolecularWeight,
      iupacName: data.PropertyTable?.Properties?.[0]?.IUPACName,
      casNumber: data.PropertyTable?.Properties?.[0]?.CID,
      confidence: 0.95,
      lastUpdated: new Date().toISOString()
    };
  }

  async getExpertAnalysis(ingredientName, category, context = {}) {
    const prompt = this.buildExpertPrompt(ingredientName, category, context);

    const apis = Object.entries(this.apiConfig.expertAI)
      .sort((a, b) => a[1].priority - b[1].priority);

    for (const [apiName, config] of apis) {
      if (!this.canMakeRequest(apiName)) continue;

      try {
        switch (apiName) {
          case 'anthropic':
            return await this.queryAnthropic(prompt, config);
          case 'openai':
            return await this.queryOpenAI(prompt, config);
        }
      } catch (error) {
        console.warn(`${apiName} expert AI failed:`, error);
        continue;
      }
    }

    // Fallback to local analysis
    return this.generateLocalExpertAnalysis({ name: ingredientName, category });
  }

  buildExpertPrompt(ingredientName, category, context) {
    return `As a biochemist and toxicologist expert, provide a comprehensive analysis of the ingredient "${ingredientName}" used in ${category} products.

Context: ${JSON.stringify(context)}

Please provide:
1. Mechanism of action (how it works)
2. Safety profile (immediate and long-term effects)
3. Regulatory status globally
4. Potential health concerns
5. Safer alternatives if concerns exist
6. Latest research findings (2023-2024)
7. Personalized recommendations based on usage patterns

Format the response as a structured JSON object with clear, evidence-based information suitable for consumer education.`;
  }

  async queryAnthropic(prompt, config) {
    const response = await fetch(config.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.key,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }]
      }),
      timeout: config.timeout
    });

    if (!response.ok) throw new Error(`Anthropic API error: ${response.status}`);

    const data = await response.json();

    return {
      source: 'Anthropic Claude',
      analysis: data.content[0].text,
      confidence: 0.9,
      timestamp: new Date().toISOString()
    };
  }

  canMakeRequest(apiName) {
    const rateLimiter = this.rateLimiters.get(apiName);
    if (!rateLimiter) return true;

    const now = Date.now();
    const windowStart = now - 60000; // 1 minute window

    // Clean old requests
    rateLimiter.requests = rateLimiter.requests.filter(time => time > windowStart);

    return rateLimiter.requests.length < rateLimiter.limit;
  }

  trackFailure(apiName) {
    const failures = this.failoverTracking.get(apiName) || { count: 0, lastFailure: null };
    failures.count++;
    failures.lastFailure = Date.now();
    this.failoverTracking.set(apiName, failures);
  }

  async fetchRecentResearch(ingredientName, limit = 5) {
    try {
      const query = encodeURIComponent(`${ingredientName} safety toxicity health effects`);
      const response = await fetch(
        `${this.apiConfig.research.pubmed.url}/esearch.fcgi?db=pubmed&term=${query}&retmax=${limit}&retmode=json&sort=date`,
        { timeout: this.apiConfig.research.pubmed.timeout }
      );

      if (!response.ok) return [];

      const data = await response.json();
      const ids = data.esearchresult?.idlist || [];

      if (ids.length === 0) return [];

      // Fetch details for found articles
      const detailsResponse = await fetch(
        `${this.apiConfig.research.pubmed.url}/esummary.fcgi?db=pubmed&id=${ids.join(',')}&retmode=json`
      );

      if (!detailsResponse.ok) return [];

      const details = await detailsResponse.json();

      return Object.values(details.result || {})
        .filter(item => item.uid)
        .map(article => ({
          title: article.title,
          authors: article.authors?.slice(0, 3).map(a => a.name).join(', '),
          journal: article.source,
          date: article.pubdate,
          pmid: article.uid,
          url: `https://pubmed.ncbi.nlm.nih.gov/${article.uid}/`
        }));
    } catch (error) {
      console.error('Failed to fetch research:', error);
      return [];
    }
  }

  generateLocalExpertAnalysis(ingredient) {
    const riskFactors = this.assessRiskFactors(ingredient);

    return {
      source: 'Local Analysis',
      analysis: {
        mechanism: this.explainMechanism(ingredient),
        safetyProfile: this.generateSafetyProfile(ingredient, riskFactors),
        recommendations: this.generateRecommendations(ingredient, riskFactors),
        alternatives: this.suggestAlternatives(ingredient)
      },
      confidence: 0.7,
      timestamp: new Date().toISOString()
    };
  }

  assessRiskFactors(ingredient) {
    const risk = { level: 'low', factors: [] };

    // Analyze ingredient name for risk indicators
    const highRiskKeywords = ['sulfate', 'paraben', 'phthalate', 'formaldehyde', 'benzene'];
    const moderateRiskKeywords = ['alcohol', 'acid', 'peroxide', 'chloride'];

    const name = ingredient.name.toLowerCase();

    if (highRiskKeywords.some(keyword => name.includes(keyword))) {
      risk.level = 'high';
      risk.factors.push('Contains potentially hazardous chemical compound');
    } else if (moderateRiskKeywords.some(keyword => name.includes(keyword))) {
      risk.level = 'moderate';
      risk.factors.push('May cause irritation in sensitive individuals');
    }

    // Check safety score if available
    if (ingredient.safetyScore < 40) {
      risk.level = 'high';
      risk.factors.push('Low safety score indicates potential concerns');
    } else if (ingredient.safetyScore < 70) {
      risk.level = 'moderate';
      risk.factors.push('Moderate safety concerns noted');
    }

    return risk;
  }

  explainMechanism(ingredient) {
    const mechanisms = {
      'preservative': 'Prevents microbial growth by disrupting bacterial cell walls and metabolic processes',
      'surfactant': 'Reduces surface tension between liquids, enabling mixing and cleaning action',
      'emulsifier': 'Allows oil and water to mix by reducing interfacial tension',
      'antioxidant': 'Prevents oxidative damage by neutralizing free radicals',
      'colorant': 'Provides color through light absorption and reflection properties',
      'fragrance': 'Interacts with olfactory receptors to produce scent perception'
    };

    return mechanisms[ingredient.category] ||
           `Functions as a ${ingredient.category} through specific molecular interactions`;
  }

  generateSafetyProfile(ingredient, riskFactors) {
    return {
      riskLevel: riskFactors.level,
      immediateEffects: this.getImmediateEffects(ingredient, riskFactors),
      longTermConcerns: this.getLongTermConcerns(ingredient, riskFactors),
      sensitivePopulations: this.getSensitivePopulations(ingredient),
      usageGuidelines: this.getUsageGuidelines(ingredient)
    };
  }

  getImmediateEffects(ingredient, riskFactors) {
    const effects = [];

    if (riskFactors.level === 'high') {
      effects.push('Possible skin or eye irritation');
      effects.push('May cause allergic reactions in sensitive individuals');
    } else if (riskFactors.level === 'moderate') {
      effects.push('Mild irritation possible with direct contact');
    }

    if (ingredient.category === 'fragrance') {
      effects.push('May trigger headaches or respiratory sensitivity');
    }

    return effects.length > 0 ? effects : ['Generally well tolerated'];
  }

  getLongTermConcerns(ingredient, riskFactors) {
    const concerns = [];

    if (riskFactors.level === 'high') {
      concerns.push('Potential for bioaccumulation with repeated exposure');
      concerns.push('May contribute to sensitization over time');
    }

    if (ingredient.name.toLowerCase().includes('paraben')) {
      concerns.push('Potential endocrine disruption with chronic exposure');
    }

    return concerns;
  }

  getSensitivePopulations(ingredient) {
    return [
      'Individuals with sensitive skin',
      'Those with known allergies to similar compounds',
      'Pregnant and breastfeeding women (precautionary)',
      'Children under 3 years old'
    ];
  }

  getUsageGuidelines(ingredient) {
    return [
      'Patch test new products containing this ingredient',
      'Follow product usage instructions carefully',
      'Discontinue use if irritation occurs',
      'Consult healthcare provider for persistent reactions'
    ];
  }

  generateRecommendations(ingredient, riskFactors) {
    const recommendations = [];

    if (riskFactors.level === 'high') {
      recommendations.push('Consider safer alternatives when available');
      recommendations.push('Limit frequency of use');
      recommendations.push('Use only as directed on product labels');
    } else {
      recommendations.push('Generally safe for intended use');
      recommendations.push('Monitor for any unexpected reactions');
    }

    return recommendations;
  }

  suggestAlternatives(ingredient) {
    const alternatives = {
      'sodium lauryl sulfate': ['Cocamidopropyl betaine', 'Sodium cocoyl isethionate'],
      'parabens': ['Phenoxyethanol', 'Benzyl alcohol', 'Natural preservatives'],
      'synthetic fragrance': ['Essential oils', 'Natural fragrance', 'Fragrance-free options'],
      'artificial colors': ['Natural colorants', 'Plant-based dyes', 'Color-free formulations']
    };

    const name = ingredient.name.toLowerCase();

    for (const [key, alts] of Object.entries(alternatives)) {
      if (name.includes(key)) {
        return alts.map(alt => ({ name: alt, safetyScore: 85 }));
      }
    }

    return [];
  }
}

export const apiOrchestrator = new APIOrchestrator();