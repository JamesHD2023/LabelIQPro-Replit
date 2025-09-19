/**
 * SocialSharingService - Handles social media sharing of scan results
 * Supports multiple platforms with customized content and privacy controls
 */
class SocialSharingService {
  constructor() {
    this.appName = 'IPICIA.COM';
    this.appUrl = 'https://ipicia.com'; // IPICIA.COM domain
    this.hashtags = '#IPICIA #HealthyEating #FoodScanning #Nutrition #AIHealth';

    // Platform-specific configurations
    this.platforms = {
      twitter: {
        name: 'Twitter',
        icon: '🐦',
        color: '#1DA1F2',
        maxLength: 280,
        urlPattern: 'https://twitter.com/intent/tweet?text={text}&hashtags={hashtags}&url={url}'
      },
      facebook: {
        name: 'Facebook',
        icon: '📘',
        color: '#4267B2',
        maxLength: 63206,
        urlPattern: 'https://www.facebook.com/sharer/sharer.php?u={url}&quote={text}'
      },
      linkedin: {
        name: 'LinkedIn',
        icon: '💼',
        color: '#0077B5',
        maxLength: 1300,
        urlPattern: 'https://www.linkedin.com/sharing/share-offsite/?url={url}&summary={text}'
      },
      whatsapp: {
        name: 'WhatsApp',
        icon: '💬',
        color: '#25D366',
        maxLength: 65536,
        urlPattern: 'https://wa.me/?text={text}%20{url}'
      },
      telegram: {
        name: 'Telegram',
        icon: '✈️',
        color: '#0088CC',
        maxLength: 4096,
        urlPattern: 'https://t.me/share/url?url={url}&text={text}'
      },
      reddit: {
        name: 'Reddit',
        icon: '🤖',
        color: '#FF4500',
        maxLength: 40000,
        urlPattern: 'https://reddit.com/submit?url={url}&title={text}'
      }
    };

    // Privacy levels
    this.privacyLevels = {
      public: {
        name: 'Public',
        description: 'Share with detailed results and app promotion',
        includeAppName: true,
        includeResults: true,
        includeScores: true
      },
      limited: {
        name: 'Limited',
        description: 'Share basic results without detailed scores',
        includeAppName: true,
        includeResults: true,
        includeScores: false
      },
      minimal: {
        name: 'Minimal',
        description: 'Share only general discovery without specifics',
        includeAppName: false,
        includeResults: false,
        includeScores: false
      }
    };
  }

  /**
   * Generate share content based on scan result and privacy level
   */
  generateShareContent(scanResult, privacyLevel = 'public') {
    const privacy = this.privacyLevels[privacyLevel];
    const isFood = scanResult.category === 'food';
    const isMeal = scanResult.type === 'meal_analysis';

    let content = {
      title: '',
      description: '',
      hashtags: [],
      emoji: ''
    };

    if (isMeal && privacy.includeResults) {
      // Meal analysis sharing
      content = this.generateMealShareContent(scanResult, privacy);
    } else if (isFood && privacy.includeResults) {
      // Food ingredient sharing
      content = this.generateFoodShareContent(scanResult, privacy);
    } else if (privacy.includeResults) {
      // Other product sharing
      content = this.generateProductShareContent(scanResult, privacy);
    } else {
      // Minimal sharing
      content = this.generateMinimalShareContent(scanResult.category);
    }

    // Add app attribution if enabled
    if (privacy.includeAppName) {
      content.description += ` 📱 Scanned with ${this.appName}`;
      content.hashtags.push('LabelIQPro');
    }

    return content;
  }

  /**
   * Generate meal analysis share content
   */
  generateMealShareContent(scanResult, privacy) {
    const meal = scanResult.mealAnalysis;
    const nutrition = scanResult.nutritionAnalysis;
    const health = scanResult.healthAssessment;

    let title = `🍽️ Just analyzed my meal!`;
    let description = '';
    let hashtags = ['HealthyEating', 'MealAnalysis', 'Nutrition'];

    if (meal.components && meal.components.length > 0) {
      const foodItems = meal.components.slice(0, 3).map(c => c.name).join(', ');
      description += `Found: ${foodItems}`;
      if (meal.components.length > 3) {
        description += ` and ${meal.components.length - 3} more items`;
      }
    }

    if (nutrition && privacy.includeScores) {
      const calories = nutrition.totals?.calories;
      if (calories) {
        description += ` 🔥 ${Math.round(calories)} calories`;
      }

      if (nutrition.totals?.protein) {
        description += `, ${Math.round(nutrition.totals.protein)}g protein`;
      }
    }

    if (health && privacy.includeScores) {
      const score = health.overallHealthScore;
      if (score) {
        description += ` 📊 Health Score: ${score}/100`;

        if (score >= 80) {
          description += ' 🌟';
          hashtags.push('HealthyChoice');
        } else if (score >= 60) {
          description += ' 👍';
          hashtags.push('BalancedMeal');
        } else {
          hashtags.push('FoodAwareness');
        }
      }
    }

    return {
      title,
      description,
      hashtags,
      emoji: '🍽️'
    };
  }

  /**
   * Generate food ingredient share content
   */
  generateFoodShareContent(scanResult, privacy) {
    const ingredients = scanResult.ingredients || [];

    let title = `🔍 Just scanned a food product!`;
    let description = '';
    let hashtags = ['FoodScanning', 'Ingredients', 'HealthyEating'];

    if (ingredients.length > 0) {
      const healthyCount = ingredients.filter(i => i.healthProfile?.isHealthy).length;
      const concernCount = ingredients.filter(i => i.healthProfile?.concerns?.length > 0).length;

      description += `Found ${ingredients.length} ingredients`;

      if (privacy.includeScores) {
        if (healthyCount > 0) {
          description += ` - ${healthyCount} healthy ingredients ✅`;
          hashtags.push('CleanEating');
        }

        if (concernCount > 0) {
          description += ` - ${concernCount} with potential concerns ⚠️`;
          hashtags.push('FoodAwareness');
        } else {
          hashtags.push('HealthyChoice');
        }
      }

      // Highlight interesting ingredients
      const notableIngredients = ingredients
        .filter(i => i.healthProfile?.isHealthy || i.healthProfile?.isSuperfood)
        .slice(0, 2)
        .map(i => i.name);

      if (notableIngredients.length > 0) {
        description += ` 🌟 Including: ${notableIngredients.join(', ')}`;
      }
    }

    return {
      title,
      description,
      hashtags,
      emoji: '🔍'
    };
  }

  /**
   * Generate general product share content
   */
  generateProductShareContent(scanResult, privacy) {
    const category = scanResult.category;
    const categoryNames = {
      cosmetic: 'cosmetic product',
      household: 'household product'
    };

    let title = `🧴 Scanned a ${categoryNames[category] || 'product'}!`;
    let description = `Learning about the ingredients in my ${categoryNames[category] || 'products'}`;
    let hashtags = ['ProductScanning', 'Ingredients'];

    if (category === 'cosmetic') {
      hashtags.push('CleanBeauty', 'Skincare');
      description += ' 💄';
    } else if (category === 'household') {
      hashtags.push('CleanHome', 'SafeProducts');
      description += ' 🏠';
    }

    if (scanResult.ingredients && privacy.includeScores) {
      const safeCount = scanResult.ingredients.filter(i => i.healthProfile?.isHealthy).length;
      if (safeCount > 0) {
        description += ` Found ${safeCount} safe ingredients! ✅`;
        hashtags.push('SafeIngredients');
      }
    }

    return {
      title,
      description,
      hashtags,
      emoji: category === 'cosmetic' ? '💄' : '🧴'
    };
  }

  /**
   * Generate minimal share content (privacy-focused)
   */
  generateMinimalShareContent(category) {
    const messages = {
      food: {
        title: '🍎 Making healthier food choices!',
        description: 'Discovering what\'s in my food',
        hashtags: ['HealthyEating', 'FoodAwareness'],
        emoji: '🍎'
      },
      cosmetic: {
        title: '💄 Choosing safer beauty products!',
        description: 'Being mindful about cosmetic ingredients',
        hashtags: ['CleanBeauty', 'SafeCosmetics'],
        emoji: '💄'
      },
      household: {
        title: '🏠 Creating a cleaner home!',
        description: 'Making informed choices about household products',
        hashtags: ['CleanHome', 'SafeProducts'],
        emoji: '🏠'
      }
    };

    return messages[category] || messages.food;
  }

  /**
   * Create platform-specific share URL
   */
  createShareUrl(platform, content, customUrl = null) {
    const platformConfig = this.platforms[platform];
    if (!platformConfig) {
      throw new Error(`Unsupported platform: ${platform}`);
    }

    // Prepare content
    let text = content.title;
    if (content.description) {
      text += ' ' + content.description;
    }

    // Truncate if necessary
    text = this.truncateText(text, platformConfig.maxLength - 50); // Leave room for URL

    // Prepare hashtags
    const hashtags = content.hashtags.join(',');
    const url = customUrl || this.appUrl;

    // Create share URL
    let shareUrl = platformConfig.urlPattern
      .replace('{text}', encodeURIComponent(text))
      .replace('{hashtags}', encodeURIComponent(hashtags))
      .replace('{url}', encodeURIComponent(url));

    return shareUrl;
  }

  /**
   * Share via Web Share API (mobile)
   */
  async shareViaWebAPI(content, imageBlob = null) {
    if (!navigator.share) {
      throw new Error('Web Share API not supported');
    }

    const shareData = {
      title: content.title,
      text: content.description,
      url: this.appUrl
    };

    // Add image if provided and supported
    if (imageBlob && navigator.canShare && navigator.canShare({ files: [imageBlob] })) {
      shareData.files = [imageBlob];
    }

    try {
      await navigator.share(shareData);
      return { success: true, method: 'webapi' };
    } catch (error) {
      if (error.name === 'AbortError') {
        return { success: false, error: 'User cancelled share' };
      }
      throw error;
    }
  }

  /**
   * Copy share content to clipboard
   */
  async copyToClipboard(content) {
    const text = `${content.title} ${content.description} ${this.appUrl}`;

    try {
      await navigator.clipboard.writeText(text);
      return { success: true, method: 'clipboard' };
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return { success: true, method: 'clipboard-fallback' };
    }
  }

  /**
   * Generate shareable image from scan result
   */
  async generateShareImage(scanResult, content) {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Set canvas size
      canvas.width = 800;
      canvas.height = 600;

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#667eea');
      gradient.addColorStop(1, '#764ba2');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // App logo/title area
      ctx.fillStyle = 'white';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(this.appName, canvas.width / 2, 80);

      // Emoji and title
      ctx.font = '60px Arial';
      ctx.fillText(content.emoji, canvas.width / 2, 180);

      ctx.font = 'bold 36px Arial';
      ctx.fillText(content.title, canvas.width / 2, 240);

      // Description
      ctx.font = '24px Arial';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      this.wrapText(ctx, content.description, canvas.width / 2, 300, canvas.width - 100, 30);

      // Add scan result specifics if available
      if (scanResult.type === 'meal_analysis' && scanResult.nutritionAnalysis) {
        const nutrition = scanResult.nutritionAnalysis.totals;
        if (nutrition.calories) {
          ctx.font = 'bold 28px Arial';
          ctx.fillStyle = '#FFD700';
          ctx.fillText(`🔥 ${Math.round(nutrition.calories)} calories`, canvas.width / 2, 420);
        }
      }

      // App URL at bottom
      ctx.font = '20px Arial';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillText(this.appUrl, canvas.width / 2, canvas.height - 40);

      // Convert to blob
      return new Promise(resolve => {
        canvas.toBlob(resolve, 'image/png', 0.9);
      });

    } catch (error) {
      console.error('Failed to generate share image:', error);
      return null;
    }
  }

  /**
   * Utility: Wrap text in canvas
   */
  wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
  }

  /**
   * Utility: Truncate text to fit platform limits
   */
  truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }

  /**
   * Get available platforms based on device capabilities
   */
  getAvailablePlatforms() {
    const available = Object.keys(this.platforms).map(key => ({
      id: key,
      ...this.platforms[key]
    }));

    // Add Web Share API if available
    if (navigator.share) {
      available.unshift({
        id: 'native',
        name: 'Share',
        icon: '📤',
        color: '#4CAF50',
        isNative: true
      });
    }

    // Add clipboard option
    available.push({
      id: 'clipboard',
      name: 'Copy Link',
      icon: '📋',
      color: '#757575',
      isClipboard: true
    });

    return available;
  }

  /**
   * Track sharing analytics (optional)
   */
  trackShare(platform, scanResultType, privacyLevel) {
    try {
      // This could integrate with analytics services
      const shareEvent = {
        action: 'share',
        platform: platform,
        content_type: scanResultType,
        privacy_level: privacyLevel,
        timestamp: new Date().toISOString()
      };

      console.log('Share tracked:', shareEvent);

      // Could send to analytics service:
      // analyticsService.track('share', shareEvent);

    } catch (error) {
      console.error('Failed to track share:', error);
    }
  }

  /**
   * Main share function
   */
  async share(platform, scanResult, options = {}) {
    try {
      const {
        privacyLevel = 'public',
        customMessage = null,
        includeImage = true
      } = options;

      // Generate content
      const content = customMessage
        ? { title: customMessage, description: '', hashtags: [], emoji: '📱' }
        : this.generateShareContent(scanResult, privacyLevel);

      let result;

      if (platform === 'native' && navigator.share) {
        // Use Web Share API
        const imageBlob = includeImage ? await this.generateShareImage(scanResult, content) : null;
        result = await this.shareViaWebAPI(content, imageBlob);
      } else if (platform === 'clipboard') {
        // Copy to clipboard
        result = await this.copyToClipboard(content);
      } else {
        // Open platform-specific share URL
        const shareUrl = this.createShareUrl(platform, content);
        window.open(shareUrl, '_blank', 'width=600,height=400');
        result = { success: true, method: 'url', url: shareUrl };
      }

      // Track the share
      this.trackShare(platform, scanResult.type, privacyLevel);

      return result;

    } catch (error) {
      console.error('Share failed:', error);
      return { success: false, error: error.message };
    }
  }
}

export const socialSharingService = new SocialSharingService();