/**
 * Comprehensive Additives Database Service
 * Includes E-numbers, colorings, emulsifiers, preservatives with EU/US regulatory differences
 * Updated with 2025 regulatory changes and controversial additives
 */

class AdditivesDatabase {
  constructor() {
    this.additives = new Map();
    this.initializeDatabase();
  }

  initializeDatabase() {
    // Comprehensive additives database with latest 2025 regulatory information
    const additivesData = [
      // COLORINGS (E100-E199)
      {
        eNumber: 'E100',
        name: 'Curcumin',
        aliases: ['Turmeric Extract', 'Natural Yellow 3'],
        category: 'coloring',
        function: 'Natural yellow coloring',
        sources: ['Turmeric root'],
        safetyScore: 85,
        regulatoryStatus: {
          eu: { approved: true, restrictions: 'None' },
          us: { approved: true, restrictions: 'GRAS status' }
        },
        healthConcerns: [],
        controversies: [],
        allergenInfo: null
      },
      {
        eNumber: 'E102',
        name: 'Tartrazine',
        aliases: ['Yellow 5', 'FD&C Yellow No. 5'],
        category: 'coloring',
        function: 'Synthetic yellow coloring',
        sources: ['Synthetic petroleum derivative'],
        safetyScore: 25,
        regulatoryStatus: {
          eu: { approved: true, restrictions: 'Must be labeled, hyperactivity warning required' },
          us: { approved: false, restrictions: 'Banned in school food as of 2024, phase-out by 2027' }
        },
        healthConcerns: [
          'Hyperactivity in children',
          'Allergic reactions',
          'Asthma triggers',
          'Potential carcinogen'
        ],
        controversies: [
          'EU requires hyperactivity warning labels',
          'Banned in Norway and Austria',
          'California school ban 2024',
          'US federal phase-out announced 2025'
        ],
        allergenInfo: 'May cause allergic reactions in aspirin-sensitive individuals'
      },
      {
        eNumber: 'E104',
        name: 'Quinoline Yellow',
        aliases: ['Yellow 13', 'Quinoline Yellow WS'],
        category: 'coloring',
        function: 'Synthetic yellow coloring',
        sources: ['Synthetic coal tar derivative'],
        safetyScore: 30,
        regulatoryStatus: {
          eu: { approved: true, restrictions: 'Hyperactivity warning required' },
          us: { approved: false, restrictions: 'Not approved for food use' }
        },
        healthConcerns: [
          'Hyperactivity in children',
          'Skin reactions',
          'Respiratory issues'
        ],
        controversies: [
          'Banned in US but approved in EU',
          'Links to ADHD symptoms',
          'Requires warning labels in EU'
        ],
        allergenInfo: 'May cause allergic reactions'
      },
      {
        eNumber: 'E110',
        name: 'Sunset Yellow FCF',
        aliases: ['Yellow 6', 'FD&C Yellow No. 6', 'Orange Yellow S'],
        category: 'coloring',
        function: 'Synthetic orange-yellow coloring',
        sources: ['Synthetic petroleum derivative'],
        safetyScore: 20,
        regulatoryStatus: {
          eu: { approved: true, restrictions: 'Hyperactivity warning required' },
          us: { approved: false, restrictions: 'California school ban 2024, federal phase-out by 2027' }
        },
        healthConcerns: [
          'Hyperactivity in children',
          'Allergic reactions',
          'Potential carcinogen',
          'Kidney tumors in animal studies'
        ],
        controversies: [
          'Southampton Study linked to hyperactivity',
          'Banned in Norway and Finland',
          'US phase-out announced April 2025'
        ],
        allergenInfo: 'Cross-reactivity with aspirin and benzoates'
      },
      {
        eNumber: 'E120',
        name: 'Cochineal',
        aliases: ['Carmine', 'Natural Red 4', 'Crimson Lake'],
        category: 'coloring',
        function: 'Natural red coloring',
        sources: ['Cochineal insects (Dactylopius coccus)'],
        safetyScore: 65,
        regulatoryStatus: {
          eu: { approved: true, restrictions: 'Must declare insect origin' },
          us: { approved: true, restrictions: 'Must be labeled as carmine or cochineal extract' }
        },
        healthConcerns: [
          'Allergic reactions',
          'Anaphylaxis in sensitive individuals'
        ],
        controversies: [
          'Not suitable for vegetarians/vegans',
          'Religious dietary restrictions',
          'Severe allergic reactions reported'
        ],
        allergenInfo: 'Can cause severe allergic reactions, especially in those allergic to insects'
      },
      {
        eNumber: 'E124',
        name: 'Ponceau 4R',
        aliases: ['Red 7', 'Cochineal Red A'],
        category: 'coloring',
        function: 'Synthetic red coloring',
        sources: ['Synthetic azo dye'],
        safetyScore: 25,
        regulatoryStatus: {
          eu: { approved: true, restrictions: 'Hyperactivity warning required' },
          us: { approved: false, restrictions: 'Not approved for food use' }
        },
        healthConcerns: [
          'Hyperactivity in children',
          'Allergic reactions',
          'Potential carcinogen'
        ],
        controversies: [
          'Banned in US but approved in EU',
          'Southampton Study findings',
          'Links to behavioral issues'
        ],
        allergenInfo: 'May cause allergic reactions in aspirin-sensitive individuals'
      },
      {
        eNumber: 'E129',
        name: 'Allura Red AC',
        aliases: ['Red 40', 'FD&C Red No. 40'],
        category: 'coloring',
        function: 'Synthetic red coloring',
        sources: ['Synthetic petroleum derivative'],
        safetyScore: 15,
        regulatoryStatus: {
          eu: { approved: true, restrictions: 'Hyperactivity warning required' },
          us: { approved: false, restrictions: 'California school ban 2024, federal phase-out by 2027' }
        },
        healthConcerns: [
          'Hyperactivity in children',
          'Behavioral problems',
          'Allergic reactions',
          'Potential carcinogen',
          'Immune system effects'
        ],
        controversies: [
          'Most widely used food dye in US',
          'Southampton Study findings',
          'Federal ban announced April 2025',
          'Links to ADHD and behavioral issues'
        ],
        allergenInfo: 'May cause allergic reactions, especially in aspirin-sensitive individuals'
      },
      {
        eNumber: 'E131',
        name: 'Patent Blue V',
        aliases: ['Blue 5'],
        category: 'coloring',
        function: 'Synthetic blue coloring',
        sources: ['Synthetic'],
        safetyScore: 40,
        regulatoryStatus: {
          eu: { approved: true, restrictions: 'Limited use' },
          us: { approved: false, restrictions: 'Not approved for food use' }
        },
        healthConcerns: [
          'Allergic reactions',
          'Blood pressure effects'
        ],
        controversies: [
          'Banned in several countries',
          'Medical procedure complications'
        ],
        allergenInfo: 'May cause allergic reactions'
      },
      {
        eNumber: 'E132',
        name: 'Indigotine',
        aliases: ['Blue 2', 'FD&C Blue No. 2'],
        category: 'coloring',
        function: 'Synthetic blue coloring',
        sources: ['Synthetic'],
        safetyScore: 30,
        regulatoryStatus: {
          eu: { approved: true, restrictions: 'None' },
          us: { approved: false, restrictions: 'California school ban 2024, federal phase-out by 2027' }
        },
        healthConcerns: [
          'Brain tumors in animal studies',
          'Allergic reactions',
          'Hyperactivity potential'
        ],
        controversies: [
          'Animal study concerns',
          'US phase-out announced 2025'
        ],
        allergenInfo: 'May cause allergic reactions'
      },
      {
        eNumber: 'E133',
        name: 'Brilliant Blue FCF',
        aliases: ['Blue 1', 'FD&C Blue No. 1'],
        category: 'coloring',
        function: 'Synthetic blue coloring',
        sources: ['Synthetic'],
        safetyScore: 35,
        regulatoryStatus: {
          eu: { approved: true, restrictions: 'None' },
          us: { approved: false, restrictions: 'California school ban 2024, federal phase-out by 2027' }
        },
        healthConcerns: [
          'Kidney tumors in animal studies',
          'Allergic reactions',
          'Chromosomal damage potential'
        ],
        controversies: [
          'Animal study findings',
          'Federal phase-out announced April 2025'
        ],
        allergenInfo: 'May cause allergic reactions'
      },
      {
        eNumber: 'E142',
        name: 'Green S',
        aliases: ['Green 4', 'FD&C Green No. 3'],
        category: 'coloring',
        function: 'Synthetic green coloring',
        sources: ['Synthetic'],
        safetyScore: 25,
        regulatoryStatus: {
          eu: { approved: true, restrictions: 'Limited use' },
          us: { approved: false, restrictions: 'California school ban 2024, federal phase-out by 2027' }
        },
        healthConcerns: [
          'Bladder tumors in animal studies',
          'Allergic reactions'
        ],
        controversies: [
          'Animal carcinogenicity studies',
          'US federal phase-out 2025'
        ],
        allergenInfo: 'May cause allergic reactions'
      },
      {
        eNumber: 'E171',
        name: 'Titanium Dioxide',
        aliases: ['TiO2', 'White 6'],
        category: 'coloring',
        function: 'White coloring and opacity',
        sources: ['Mineral titanium'],
        safetyScore: 10,
        regulatoryStatus: {
          eu: { approved: false, restrictions: 'Banned as food additive since 2022' },
          us: { approved: true, restrictions: 'Under review, state bans proposed' }
        },
        healthConcerns: [
          'Potential genotoxicity',
          'DNA damage',
          'Inflammatory effects',
          'Possible carcinogen'
        ],
        controversies: [
          'EU ban 2022 due to safety concerns',
          'EFSA concluded not safe for food use',
          'US states proposing bans',
          'Nanoparticle health concerns'
        ],
        allergenInfo: null
      },

      // PRESERVATIVES (E200-E299)
      {
        eNumber: 'E200',
        name: 'Sorbic Acid',
        aliases: ['Sorbic Acid'],
        category: 'preservative',
        function: 'Antimicrobial preservative',
        sources: ['Synthetic, naturally occurring in some berries'],
        safetyScore: 80,
        regulatoryStatus: {
          eu: { approved: true, restrictions: 'ADI: 25 mg/kg body weight' },
          us: { approved: true, restrictions: 'GRAS status' }
        },
        healthConcerns: [
          'Rare allergic reactions'
        ],
        controversies: [],
        allergenInfo: 'Generally well tolerated'
      },
      {
        eNumber: 'E202',
        name: 'Potassium Sorbate',
        aliases: ['Potassium Sorbate'],
        category: 'preservative',
        function: 'Antimicrobial preservative',
        sources: ['Synthetic salt of sorbic acid'],
        safetyScore: 85,
        regulatoryStatus: {
          eu: { approved: true, restrictions: 'ADI: 25 mg/kg body weight' },
          us: { approved: true, restrictions: 'GRAS status' }
        },
        healthConcerns: [
          'Rare skin irritation'
        ],
        controversies: [],
        allergenInfo: 'Generally safe, rare contact allergies'
      },
      {
        eNumber: 'E210',
        name: 'Benzoic Acid',
        aliases: ['Benzoic Acid'],
        category: 'preservative',
        function: 'Antimicrobial preservative',
        sources: ['Synthetic, naturally in cranberries and plums'],
        safetyScore: 70,
        regulatoryStatus: {
          eu: { approved: true, restrictions: 'ADI: 5 mg/kg body weight' },
          us: { approved: true, restrictions: 'GRAS status' }
        },
        healthConcerns: [
          'Allergic reactions',
          'Hyperactivity in children (when combined with colorings)',
          'Asthma triggers'
        ],
        controversies: [
          'Southampton Study - behavioral effects with colorings',
          'Benzene formation risk with vitamin C'
        ],
        allergenInfo: 'May cause allergic reactions in sensitive individuals'
      },
      {
        eNumber: 'E211',
        name: 'Sodium Benzoate',
        aliases: ['Sodium Benzoate'],
        category: 'preservative',
        function: 'Antimicrobial preservative',
        sources: ['Synthetic sodium salt of benzoic acid'],
        safetyScore: 60,
        regulatoryStatus: {
          eu: { approved: true, restrictions: 'ADI: 5 mg/kg body weight' },
          us: { approved: true, restrictions: 'GRAS status' }
        },
        healthConcerns: [
          'Benzene formation with vitamin C',
          'Hyperactivity in children',
          'Allergic reactions',
          'Potential DNA damage'
        ],
        controversies: [
          'Benzene formation in soft drinks',
          'Southampton Study findings',
          'DNA damage studies'
        ],
        allergenInfo: 'May trigger asthma and allergic reactions'
      },
      {
        eNumber: 'E220',
        name: 'Sulfur Dioxide',
        aliases: ['Sulfur Dioxide', 'SO2'],
        category: 'preservative',
        function: 'Antioxidant and preservative',
        sources: ['Synthetic gas'],
        safetyScore: 50,
        regulatoryStatus: {
          eu: { approved: true, restrictions: 'Must be labeled, ADI varies by food' },
          us: { approved: true, restrictions: 'Must be labeled if >10ppm' }
        },
        healthConcerns: [
          'Asthma triggers',
          'Allergic reactions',
          'Respiratory problems',
          'Vitamin B1 destruction'
        ],
        controversies: [
          'Asthmatic reactions',
          'Vitamin destruction concerns'
        ],
        allergenInfo: 'Major allergen - must be declared, dangerous for asthmatics'
      },
      {
        eNumber: 'E250',
        name: 'Sodium Nitrite',
        aliases: ['Sodium Nitrite'],
        category: 'preservative',
        function: 'Preservative and color fixative',
        sources: ['Synthetic'],
        safetyScore: 25,
        regulatoryStatus: {
          eu: { approved: true, restrictions: 'Strict limits, must be labeled' },
          us: { approved: true, restrictions: 'USDA limits in processed meats' }
        },
        healthConcerns: [
          'Nitrosamine formation (carcinogenic)',
          'Colorectal cancer risk',
          'Cardiovascular disease',
          'Methemoglobinemia in infants'
        ],
        controversies: [
          'WHO classified processed meat as carcinogenic',
          'Cancer risk studies',
          'Nitrosamine formation with proteins'
        ],
        allergenInfo: 'Dangerous for infants under 6 months'
      },
      {
        eNumber: 'E251',
        name: 'Sodium Nitrate',
        aliases: ['Sodium Nitrate', 'Chile Saltpeter'],
        category: 'preservative',
        function: 'Preservative',
        sources: ['Synthetic or mined'],
        safetyScore: 30,
        regulatoryStatus: {
          eu: { approved: true, restrictions: 'Strict limits' },
          us: { approved: true, restrictions: 'USDA regulated' }
        },
        healthConcerns: [
          'Converts to nitrite in body',
          'Cancer risk',
          'Cardiovascular effects'
        ],
        controversies: [
          'Processed meat cancer links',
          'Environmental contamination'
        ],
        allergenInfo: null
      },

      // ANTIOXIDANTS (E300-E399)
      {
        eNumber: 'E300',
        name: 'Ascorbic Acid',
        aliases: ['Vitamin C', 'L-Ascorbic Acid'],
        category: 'antioxidant',
        function: 'Antioxidant and vitamin',
        sources: ['Synthetic or natural'],
        safetyScore: 95,
        regulatoryStatus: {
          eu: { approved: true, restrictions: 'None' },
          us: { approved: true, restrictions: 'GRAS status' }
        },
        healthConcerns: [],
        controversies: [],
        allergenInfo: 'Generally safe, essential vitamin'
      },
      {
        eNumber: 'E301',
        name: 'Sodium Ascorbate',
        aliases: ['Sodium Ascorbate', 'Sodium Vitamin C'],
        category: 'antioxidant',
        function: 'Antioxidant',
        sources: ['Synthetic sodium salt of vitamin C'],
        safetyScore: 90,
        regulatoryStatus: {
          eu: { approved: true, restrictions: 'None' },
          us: { approved: true, restrictions: 'GRAS status' }
        },
        healthConcerns: [],
        controversies: [],
        allergenInfo: 'Generally safe'
      },
      {
        eNumber: 'E310',
        name: 'Propyl Gallate',
        aliases: ['Propyl Gallate', 'PG'],
        category: 'antioxidant',
        function: 'Fat-soluble antioxidant',
        sources: ['Synthetic'],
        safetyScore: 40,
        regulatoryStatus: {
          eu: { approved: true, restrictions: 'ADI: 1.4 mg/kg body weight' },
          us: { approved: true, restrictions: 'GRAS status' }
        },
        healthConcerns: [
          'Allergic reactions',
          'Stomach irritation',
          'Potential endocrine disruption'
        ],
        controversies: [
          'Endocrine disruption studies',
          'Contact allergies'
        ],
        allergenInfo: 'May cause allergic skin reactions'
      },
      {
        eNumber: 'E320',
        name: 'Butylated Hydroxyanisole',
        aliases: ['BHA', 'Butylated Hydroxyanisole'],
        category: 'antioxidant',
        function: 'Fat-soluble antioxidant',
        sources: ['Synthetic'],
        safetyScore: 15,
        regulatoryStatus: {
          eu: { approved: true, restrictions: 'Under review, restricted use' },
          us: { approved: true, restrictions: 'Under federal review 2025, state bans proposed' }
        },
        healthConcerns: [
          'Reasonably anticipated human carcinogen (NIH)',
          'Endocrine disruption',
          'Reproductive effects',
          'Immune system effects'
        ],
        controversies: [
          'IARC classified as possible carcinogen',
          'NIH carcinogen classification',
          'State legislation targeting BHA',
          'Consumer advocacy pressure'
        ],
        allergenInfo: 'May cause allergic reactions'
      },
      {
        eNumber: 'E321',
        name: 'Butylated Hydroxytoluene',
        aliases: ['BHT', 'Butylated Hydroxytoluene'],
        category: 'antioxidant',
        function: 'Fat-soluble antioxidant',
        sources: ['Synthetic'],
        safetyScore: 20,
        regulatoryStatus: {
          eu: { approved: true, restrictions: 'Under review' },
          us: { approved: true, restrictions: 'Under federal review 2025, state bans proposed' }
        },
        healthConcerns: [
          'Possible carcinogen',
          'Liver effects',
          'Thyroid hormone disruption',
          'Allergic reactions'
        ],
        controversies: [
          'Conflicting carcinogenicity studies',
          'Endocrine disruption evidence',
          'State-level ban proposals',
          'Industry resistance to removal'
        ],
        allergenInfo: 'May cause allergic skin reactions'
      },

      // EMULSIFIERS (E400-E499)
      {
        eNumber: 'E400',
        name: 'Alginic Acid',
        aliases: ['Alginic Acid', 'Algin'],
        category: 'emulsifier',
        function: 'Thickener and stabilizer',
        sources: ['Brown seaweed'],
        safetyScore: 85,
        regulatoryStatus: {
          eu: { approved: true, restrictions: 'None' },
          us: { approved: true, restrictions: 'GRAS status' }
        },
        healthConcerns: [],
        controversies: [],
        allergenInfo: 'Generally safe, natural seaweed extract'
      },
      {
        eNumber: 'E407',
        name: 'Carrageenan',
        aliases: ['Carrageenan'],
        category: 'emulsifier',
        function: 'Thickener and stabilizer',
        sources: ['Red seaweed'],
        safetyScore: 45,
        regulatoryStatus: {
          eu: { approved: true, restrictions: 'Food grade only' },
          us: { approved: true, restrictions: 'Food grade carrageenan only' }
        },
        healthConcerns: [
          'Digestive inflammation',
          'Gut barrier disruption',
          'Potential carcinogenic degradation products'
        ],
        controversies: [
          'Inflammatory bowel disease concerns',
          'Degraded vs non-degraded forms',
          'Ongoing safety reviews'
        ],
        allergenInfo: 'May cause digestive sensitivities'
      },
      {
        eNumber: 'E410',
        name: 'Locust Bean Gum',
        aliases: ['Carob Gum', 'Locust Bean Gum'],
        category: 'emulsifier',
        function: 'Thickener and stabilizer',
        sources: ['Carob tree seeds'],
        safetyScore: 90,
        regulatoryStatus: {
          eu: { approved: true, restrictions: 'None' },
          us: { approved: true, restrictions: 'GRAS status' }
        },
        healthConcerns: [],
        controversies: [],
        allergenInfo: 'Generally safe, natural plant extract'
      },
      {
        eNumber: 'E412',
        name: 'Guar Gum',
        aliases: ['Guar Gum'],
        category: 'emulsifier',
        function: 'Thickener and stabilizer',
        sources: ['Guar bean'],
        safetyScore: 80,
        regulatoryStatus: {
          eu: { approved: true, restrictions: 'None' },
          us: { approved: true, restrictions: 'GRAS status' }
        },
        healthConcerns: [
          'Digestive upset in large quantities'
        ],
        controversies: [],
        allergenInfo: 'May cause digestive discomfort in sensitive individuals'
      },
      {
        eNumber: 'E415',
        name: 'Xanthan Gum',
        aliases: ['Xanthan Gum'],
        category: 'emulsifier',
        function: 'Thickener and stabilizer',
        sources: ['Bacterial fermentation'],
        safetyScore: 85,
        regulatoryStatus: {
          eu: { approved: true, restrictions: 'None' },
          us: { approved: true, restrictions: 'GRAS status' }
        },
        healthConcerns: [
          'Digestive upset in large quantities'
        ],
        controversies: [],
        allergenInfo: 'Generally safe, may cause digestive issues in sensitive individuals'
      },
      {
        eNumber: 'E433',
        name: 'Polysorbate 80',
        aliases: ['Polysorbate 80', 'Tween 80'],
        category: 'emulsifier',
        function: 'Emulsifier and stabilizer',
        sources: ['Synthetic'],
        safetyScore: 50,
        regulatoryStatus: {
          eu: { approved: true, restrictions: 'ADI: 25 mg/kg body weight' },
          us: { approved: true, restrictions: 'FDA approved' }
        },
        healthConcerns: [
          'Gut microbiome disruption',
          'Intestinal inflammation',
          'Metabolic effects'
        ],
        controversies: [
          'Microbiome research findings',
          'Ultra-processed food concerns'
        ],
        allergenInfo: 'May cause digestive sensitivities'
      },

      // ACIDITY REGULATORS (E500-E599)
      {
        eNumber: 'E500',
        name: 'Sodium Carbonate',
        aliases: ['Sodium Carbonate', 'Soda Ash'],
        category: 'acidity_regulator',
        function: 'Acidity regulator and anti-caking agent',
        sources: ['Synthetic or mineral'],
        safetyScore: 75,
        regulatoryStatus: {
          eu: { approved: true, restrictions: 'None' },
          us: { approved: true, restrictions: 'GRAS status' }
        },
        healthConcerns: [],
        controversies: [],
        allergenInfo: 'Generally safe'
      },
      {
        eNumber: 'E621',
        name: 'Monosodium Glutamate',
        aliases: ['MSG', 'Monosodium Glutamate'],
        category: 'flavor_enhancer',
        function: 'Flavor enhancer',
        sources: ['Fermentation or synthetic'],
        safetyScore: 70,
        regulatoryStatus: {
          eu: { approved: true, restrictions: 'Must be labeled' },
          us: { approved: true, restrictions: 'GRAS status, must be labeled' }
        },
        healthConcerns: [
          'Chinese Restaurant Syndrome (disputed)',
          'Headaches in sensitive individuals',
          'Potential obesity links'
        ],
        controversies: [
          'Safety debated for decades',
          'Racial stereotyping in early studies',
          'Scientific consensus vs public perception'
        ],
        allergenInfo: 'May cause reactions in sensitive individuals'
      },

      // SWEETENERS (E950-E999)
      {
        eNumber: 'E950',
        name: 'Acesulfame Potassium',
        aliases: ['Acesulfame K', 'Ace-K'],
        category: 'sweetener',
        function: 'Artificial sweetener',
        sources: ['Synthetic'],
        safetyScore: 65,
        regulatoryStatus: {
          eu: { approved: true, restrictions: 'ADI: 9 mg/kg body weight' },
          us: { approved: true, restrictions: 'FDA approved' }
        },
        healthConcerns: [
          'Potential carcinogen (disputed)',
          'Gut microbiome effects'
        ],
        controversies: [
          'Limited long-term studies',
          'Microbiome research emerging'
        ],
        allergenInfo: 'Generally well tolerated'
      },
      {
        eNumber: 'E951',
        name: 'Aspartame',
        aliases: ['Aspartame', 'NutraSweet', 'Equal'],
        category: 'sweetener',
        function: 'Artificial sweetener',
        sources: ['Synthetic'],
        safetyScore: 55,
        regulatoryStatus: {
          eu: { approved: true, restrictions: 'ADI: 40 mg/kg body weight, PKU warning' },
          us: { approved: true, restrictions: 'FDA approved, PKU warning required' }
        },
        healthConcerns: [
          'Phenylketonuria risk',
          'Headaches in sensitive individuals',
          'Possible carcinogen (WHO 2023 review)'
        ],
        controversies: [
          'WHO IARC 2023 classification as possible carcinogen',
          'Decades of safety debates',
          'Industry vs independent studies'
        ],
        allergenInfo: 'Dangerous for individuals with phenylketonuria (PKU)'
      }
    ];

    // Initialize the database
    additivesData.forEach(additive => {
      this.additives.set(additive.eNumber, additive);
      // Also index by common names and aliases
      if (additive.aliases) {
        additive.aliases.forEach(alias => {
          this.additives.set(alias.toLowerCase(), additive);
        });
      }
      this.additives.set(additive.name.toLowerCase(), additive);
    });
  }

  /**
   * Look up additive information by E-number, name, or alias
   * @param {string} identifier - E-number, name, or alias
   * @returns {Object|null} Additive information or null if not found
   */
  lookup(identifier) {
    if (!identifier) return null;

    const key = identifier.toString().toLowerCase().trim();
    return this.additives.get(key) || null;
  }

  /**
   * Search for additives by category
   * @param {string} category - Category to search for
   * @returns {Array} Array of additives in the category
   */
  getByCategory(category) {
    const results = [];
    for (const [key, additive] of this.additives) {
      if (additive.category === category && key === additive.eNumber) {
        results.push(additive);
      }
    }
    return results.sort((a, b) => a.eNumber.localeCompare(b.eNumber));
  }

  /**
   * Get additives with safety scores below threshold
   * @param {number} threshold - Safety score threshold (default 50)
   * @returns {Array} Array of concerning additives
   */
  getConcerningAdditives(threshold = 50) {
    const results = [];
    for (const [key, additive] of this.additives) {
      if (additive.safetyScore < threshold && key === additive.eNumber) {
        results.push(additive);
      }
    }
    return results.sort((a, b) => a.safetyScore - b.safetyScore);
  }

  /**
   * Get additives with regulatory differences between EU and US
   * @returns {Array} Array of additives with different regulatory status
   */
  getRegulatoryDifferences() {
    const results = [];
    for (const [key, additive] of this.additives) {
      if (key === additive.eNumber) {
        const euApproved = additive.regulatoryStatus.eu.approved;
        const usApproved = additive.regulatoryStatus.us.approved;

        if (euApproved !== usApproved) {
          results.push({
            ...additive,
            difference: euApproved ? 'EU approved, US banned' : 'US approved, EU banned'
          });
        }
      }
    }
    return results;
  }

  /**
   * Get controversial additives
   * @returns {Array} Array of additives with controversies
   */
  getControversialAdditives() {
    const results = [];
    for (const [key, additive] of this.additives) {
      if (key === additive.eNumber && additive.controversies && additive.controversies.length > 0) {
        results.push(additive);
      }
    }
    return results.sort((a, b) => a.safetyScore - b.safetyScore);
  }

  /**
   * Analyze a list of ingredients for additive concerns
   * @param {Array} ingredientsList - Array of ingredient names
   * @returns {Object} Analysis results
   */
  analyzeIngredients(ingredientsList) {
    const results = {
      additives: [],
      concerns: [],
      regulatory_differences: [],
      controversial: [],
      safety_summary: {
        safe_count: 0,
        concerning_count: 0,
        unknown_count: 0,
        overall_score: 0
      }
    };

    let totalScore = 0;
    let scoredCount = 0;

    ingredientsList.forEach(ingredient => {
      const additive = this.lookup(ingredient);

      if (additive) {
        results.additives.push({
          ingredient,
          additive_info: additive
        });

        // Safety analysis
        if (additive.safetyScore >= 70) {
          results.safety_summary.safe_count++;
        } else {
          results.safety_summary.concerning_count++;
          results.concerns.push({
            ingredient,
            concerns: additive.healthConcerns,
            safety_score: additive.safetyScore
          });
        }

        // Check regulatory differences
        if (additive.regulatoryStatus.eu.approved !== additive.regulatoryStatus.us.approved) {
          results.regulatory_differences.push({
            ingredient,
            eu_status: additive.regulatoryStatus.eu,
            us_status: additive.regulatoryStatus.us
          });
        }

        // Check controversies
        if (additive.controversies && additive.controversies.length > 0) {
          results.controversial.push({
            ingredient,
            controversies: additive.controversies
          });
        }

        totalScore += additive.safetyScore;
        scoredCount++;
      } else {
        results.safety_summary.unknown_count++;
      }
    });

    // Calculate overall score
    if (scoredCount > 0) {
      results.safety_summary.overall_score = Math.round(totalScore / scoredCount);
    }

    return results;
  }

  /**
   * Get latest regulatory updates and changes
   * @returns {Array} Recent regulatory changes
   */
  getRecentRegulatoryChanges() {
    return [
      {
        date: '2025-04-22',
        change: 'US Federal Phase-out Announcement',
        description: 'FDA announced phase-out of 6 petroleum-based food dyes (Red 40, Yellow 5, Yellow 6, Blue 1, Blue 2, Green 3) by end of 2027',
        affected_additives: ['E129', 'E102', 'E110', 'E133', 'E132', 'E142'],
        impact: 'Major reformulation required for US food manufacturers'
      },
      {
        date: '2024-12-18',
        change: 'EU Steviol Glycosides Update',
        description: 'E960b steviol glycosides from fermentation added to approved additives list',
        affected_additives: ['E960b'],
        impact: 'New natural sweetener option approved in EU'
      },
      {
        date: '2024-07-01',
        change: 'California School Food Safety Act',
        description: 'Banned Red Dye No. 40, Yellow Dye No. 5, Yellow Dye No. 6, Blue Dye No. 1, Blue Dye No. 2, Green Dye No. 3 from public school food',
        affected_additives: ['E129', 'E102', 'E110', 'E133', 'E132', 'E142'],
        impact: 'School food programs required reformulation'
      },
      {
        date: '2022-01-01',
        change: 'EU Titanium Dioxide Ban',
        description: 'Titanium dioxide (E171) banned as food additive in EU due to genotoxicity concerns',
        affected_additives: ['E171'],
        impact: 'Major reformulation required for white/opaque foods in EU'
      }
    ];
  }
}

// Create singleton instance
export const additivesDatabase = new AdditivesDatabase();
export default additivesDatabase;