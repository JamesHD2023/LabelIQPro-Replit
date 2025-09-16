/**
 * Test Script for Additives Database
 * Tests the comprehensive E-numbers database with real ingredient scenarios
 */

import { additiveAnalysisService } from '../services/AdditiveAnalysisService.js';
import { additivesDatabase } from '../services/AdditivesDatabase.js';

// Test ingredient lists from common food products
const testIngredientLists = {
  candyExample: [
    'Sugar',
    'Corn Syrup',
    'Red 40',      // E129 - Controversial US dye
    'Yellow 5',    // E102 - Banned in some EU contexts
    'Blue 1',      // E133 - US phase-out announced
    'Natural Flavoring',
    'Citric Acid'
  ],

  processedFoodExample: [
    'Wheat Flour',
    'Sugar',
    'Palm Oil',
    'BHT',         // E321 - Controversial antioxidant
    'BHA',         // E320 - Possible carcinogen
    'Sodium Benzoate', // E211 - Benzene formation risk
    'Titanium Dioxide', // E171 - Banned in EU
    'MSG',         // E621 - Controversial flavor enhancer
    'Salt'
  ],

  cosmeticExample: [
    'Water',
    'Glycerin',
    'Titanium Dioxide', // E171 - Different regulations cosmetics vs food
    'Iron Oxide',
    'Paraffin',
    'Sodium Benzoate', // E211
    'Propyl Gallate'   // E310
  ],

  cleanLabelExample: [
    'Organic Wheat Flour',
    'Organic Sugar',
    'Organic Vanilla Extract',
    'Sea Salt',
    'Baking Soda',
    'Organic Eggs'
  ]
};

function runAdditiveTests() {
  console.log('🧪 Running Additive Database Tests\n');

  // Test 1: Basic additive lookup
  console.log('📋 Test 1: Basic Additive Lookup');
  console.log('='.repeat(40));

  const testAdditives = ['E129', 'Red 40', 'BHT', 'E171', 'MSG'];
  testAdditives.forEach(additive => {
    const result = additivesDatabase.lookup(additive);
    if (result) {
      console.log(`✅ ${additive}: ${result.name} (Safety: ${result.safetyScore}/100)`);
      console.log(`   EU: ${result.regulatoryStatus.eu.approved ? '✅' : '❌'} | US: ${result.regulatoryStatus.us.approved ? '✅' : '❌'}`);
    } else {
      console.log(`❌ ${additive}: Not found`);
    }
  });

  // Test 2: Regulatory differences
  console.log('\n🌍 Test 2: EU vs US Regulatory Differences');
  console.log('='.repeat(40));

  const differences = additivesDatabase.getRegulatoryDifferences();
  differences.slice(0, 5).forEach(diff => {
    console.log(`⚖️ ${diff.name} (${diff.eNumber}): ${diff.difference}`);
  });

  // Test 3: Controversial additives
  console.log('\n❓ Test 3: Most Controversial Additives');
  console.log('='.repeat(40));

  const controversial = additivesDatabase.getControversialAdditives();
  controversial.slice(0, 5).forEach(additive => {
    console.log(`🚨 ${additive.name} (${additive.eNumber}): Safety ${additive.safetyScore}/100`);
    console.log(`   Controversies: ${additive.controversies.slice(0, 2).join(', ')}`);
  });

  // Test 4: Recent regulatory changes
  console.log('\n📅 Test 4: Recent Regulatory Changes (2025)');
  console.log('='.repeat(40));

  const recentChanges = additivesDatabase.getRecentRegulatoryChanges();
  recentChanges.forEach(change => {
    console.log(`📰 ${change.date}: ${change.change}`);
    console.log(`   ${change.description}`);
    console.log(`   Impact: ${change.impact}\n`);
  });

  // Test 5: Comprehensive ingredient analysis
  console.log('🔬 Test 5: Comprehensive Ingredient Analysis');
  console.log('='.repeat(40));

  Object.entries(testIngredientLists).forEach(([productType, ingredients]) => {
    console.log(`\n📦 ${productType.toUpperCase()}:`);
    console.log(`Ingredients: ${ingredients.join(', ')}`);

    // Convert to ingredient objects (simplified for testing)
    const ingredientObjects = ingredients.map(name => ({ name, id: name.toLowerCase() }));

    const analysis = additiveAnalysisService.analyzeIngredientList(ingredientObjects);

    console.log(`\n📊 Analysis Results:`);
    console.log(`   Total Additives: ${analysis.additiveSummary.totalAdditives}`);
    console.log(`   Overall Additive Score: ${analysis.overallAdditiveScore}/100`);
    console.log(`   Safety Breakdown:`);
    console.log(`     Safe (70+): ${analysis.additiveSummary.safetyBreakdown.safe}`);
    console.log(`     Moderate (40-69): ${analysis.additiveSummary.safetyBreakdown.moderate}`);
    console.log(`     Concerning (<40): ${analysis.additiveSummary.safetyBreakdown.concerning}`);

    if (analysis.additiveSummary.regulatoryIssues.length > 0) {
      console.log(`   🚫 Regulatory Issues: ${analysis.additiveSummary.regulatoryIssues.length}`);
      analysis.additiveSummary.regulatoryIssues.forEach(issue => {
        console.log(`     - ${issue.name}: ${issue.issue}`);
      });
    }

    if (analysis.additiveSummary.controversialAdditives.length > 0) {
      console.log(`   ❓ Controversial: ${analysis.additiveSummary.controversialAdditives.length}`);
    }

    if (analysis.recommendations.length > 0) {
      console.log(`   💡 Recommendations:`);
      analysis.recommendations.slice(0, 3).forEach(rec => {
        console.log(`     ${rec.type.toUpperCase()}: ${rec.message}`);
      });
    }

    console.log(`   ${'─'.repeat(50)}`);
  });

  // Test 6: Category breakdown
  console.log('\n🏷️ Test 6: Additive Categories');
  console.log('='.repeat(40));

  const categories = ['coloring', 'preservative', 'emulsifier', 'sweetener'];
  categories.forEach(category => {
    const additives = additivesDatabase.getByCategory(category);
    const averageScore = additives.reduce((sum, a) => sum + a.safetyScore, 0) / additives.length;
    console.log(`${category.toUpperCase()}: ${additives.length} additives (Avg Safety: ${Math.round(averageScore)}/100)`);
  });

  console.log('\n✅ All tests completed!\n');
}

// Export for potential use in actual test frameworks
export { runAdditiveTests, testIngredientLists };

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
  runAdditiveTests();
}