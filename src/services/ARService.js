/**
 * Augmented Reality Service
 * Provides AR overlay functionality for real-time health scanning
 */

import { foodRecognitionService } from './FoodRecognitionService';
import { mealAnalysisService } from './MealAnalysisService';
import { scoringService } from './ScoringService';

class ARService {
  constructor() {
    this.isARSupported = false;
    this.isARActive = false;
    this.videoStream = null;
    this.canvas = null;
    this.context = null;
    this.overlayCanvas = null;
    this.overlayContext = null;
    this.animationFrameId = null;

    // AR detection settings
    this.detectionConfig = {
      scanInterval: 500, // ms between scans
      confidenceThreshold: 0.7,
      stabilityFrames: 3, // frames before showing result
      maxTrackedItems: 10
    };

    // Tracked objects for stability
    this.trackedObjects = new Map();
    this.frameCount = 0;

    // AR overlay styles
    this.overlayStyles = {
      healthScore: {
        excellent: { color: '#4CAF50', background: 'rgba(76, 175, 80, 0.9)' },
        good: { color: '#8BC34A', background: 'rgba(139, 195, 74, 0.9)' },
        fair: { color: '#FFC107', background: 'rgba(255, 193, 7, 0.9)' },
        poor: { color: '#FF5722', background: 'rgba(255, 87, 34, 0.9)' }
      },
      text: {
        fontSize: 14,
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'bold',
        textAlign: 'center'
      },
      box: {
        borderWidth: 2,
        borderRadius: 8,
        padding: 8,
        margin: 4
      }
    };

    this.checkARSupport();
  }

  /**
   * Check if AR features are supported
   */
  checkARSupport() {
    this.isARSupported = !!(
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia &&
      HTMLCanvasElement.prototype.getContext &&
      window.requestAnimationFrame
    );

    console.log('AR Support:', this.isARSupported);
    return this.isARSupported;
  }

  /**
   * Initialize AR scanning mode
   */
  async initializeAR(videoElement, overlayCanvasElement) {
    if (!this.isARSupported) {
      throw new Error('AR not supported on this device');
    }

    try {
      // Get video stream
      this.videoStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      // Set up video element
      videoElement.srcObject = this.videoStream;
      await new Promise((resolve) => {
        videoElement.onloadedmetadata = resolve;
      });

      // Set up canvas for processing
      this.canvas = document.createElement('canvas');
      this.canvas.width = videoElement.videoWidth;
      this.canvas.height = videoElement.videoHeight;
      this.context = this.canvas.getContext('2d');

      // Set up overlay canvas
      this.overlayCanvas = overlayCanvasElement;
      this.overlayCanvas.width = videoElement.videoWidth;
      this.overlayCanvas.height = videoElement.videoHeight;
      this.overlayContext = this.overlayCanvas.getContext('2d');

      console.log('AR initialized successfully');
      return true;

    } catch (error) {
      console.error('AR initialization failed:', error);
      throw error;
    }
  }

  /**
   * Start AR scanning
   */
  startARScanning(mode = 'menu') {
    if (!this.isARSupported || this.isARActive) {
      return false;
    }

    this.isARActive = true;
    this.scanMode = mode; // 'menu' or 'plate'
    this.frameCount = 0;
    this.trackedObjects.clear();

    // Start the AR loop
    this.arScanLoop();

    console.log(`AR scanning started in ${mode} mode`);
    return true;
  }

  /**
   * Stop AR scanning
   */
  stopARScanning() {
    this.isARActive = false;

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.overlayContext) {
      this.overlayContext.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
    }

    this.trackedObjects.clear();
    console.log('AR scanning stopped');
  }

  /**
   * Main AR scanning loop
   */
  arScanLoop() {
    if (!this.isARActive) return;

    this.frameCount++;

    // Capture frame and process every scanInterval
    if (this.frameCount % Math.floor(this.detectionConfig.scanInterval / 16) === 0) {
      this.processCurrentFrame();
    }

    // Update overlay
    this.updateAROverlay();

    // Continue loop
    this.animationFrameId = requestAnimationFrame(() => this.arScanLoop());
  }

  /**
   * Process current video frame for object detection
   */
  async processCurrentFrame() {
    if (!this.context || !this.canvas) return;

    try {
      // Capture current frame
      const videoElement = this.videoStream.getTracks()[0];
      const imageCapture = new ImageCapture(videoElement);
      const bitmap = await imageCapture.grabFrame();

      // Draw to canvas
      this.context.drawImage(bitmap, 0, 0, this.canvas.width, this.canvas.height);

      // Convert to blob for analysis
      const blob = await new Promise(resolve => {
        this.canvas.toBlob(resolve, 'image/jpeg', 0.8);
      });

      // Analyze based on mode
      if (this.scanMode === 'menu') {
        await this.analyzeMenuItems(blob);
      } else if (this.scanMode === 'plate') {
        await this.analyzePlateContents(blob);
      }

    } catch (error) {
      console.error('Frame processing error:', error);
    }
  }

  /**
   * Analyze menu items for health scores
   */
  async analyzeMenuItems(imageBlob) {
    try {
      // Use OCR to extract menu text
      const ocrResult = await this.extractMenuText(imageBlob);

      if (ocrResult.menuItems.length === 0) return;

      // Analyze each menu item
      for (const item of ocrResult.menuItems) {
        const healthScore = await this.calculateMenuItemScore(item);

        // Update tracked objects
        const objectId = `menu_${item.id}`;
        this.updateTrackedObject(objectId, {
          type: 'menu_item',
          name: item.name,
          description: item.description,
          healthScore: healthScore.overall,
          trafficLight: healthScore.trafficLight,
          position: item.boundingBox,
          confidence: item.confidence,
          lastSeen: Date.now()
        });
      }

    } catch (error) {
      console.error('Menu analysis error:', error);
    }
  }

  /**
   * Analyze plate contents for nutrition breakdown
   */
  async analyzePlateContents(imageBlob) {
    try {
      // Use food recognition to identify plate contents
      const foodRecognition = await foodRecognitionService.recognizeMeal(imageBlob, {
        includePortions: true,
        includeNutrition: true,
        mode: 'plate_analysis'
      });

      if (foodRecognition.components.length === 0) return;

      // Calculate nutrition for each component
      for (const component of foodRecognition.components) {
        const nutrition = await mealAnalysisService.calculateNutrition(
          [component],
          component.portion
        );

        // Update tracked objects
        const objectId = `food_${component.id}`;
        this.updateTrackedObject(objectId, {
          type: 'food_item',
          name: component.name,
          category: component.category,
          nutrition: nutrition,
          portion: component.portion,
          position: component.boundingBox,
          confidence: component.confidence,
          lastSeen: Date.now()
        });
      }

      // Calculate overall plate nutrition
      const plateNutrition = await mealAnalysisService.calculateNutrition(
        foodRecognition.components,
        foodRecognition.totalPortion
      );

      this.updateTrackedObject('plate_total', {
        type: 'plate_summary',
        nutrition: plateNutrition,
        healthScore: plateNutrition.healthScore,
        trafficLight: plateNutrition.trafficLight,
        position: { x: 50, y: 50, width: 200, height: 100 }, // Top overlay
        confidence: 1.0,
        lastSeen: Date.now()
      });

    } catch (error) {
      console.error('Plate analysis error:', error);
    }
  }

  /**
   * Extract menu text using OCR
   */
  async extractMenuText(imageBlob) {
    // Simplified menu extraction - in production, use specialized menu OCR
    const mockMenuItems = [
      {
        id: 'item1',
        name: 'Grilled Salmon',
        description: 'Atlantic salmon with herbs',
        boundingBox: { x: 100, y: 200, width: 300, height: 50 },
        confidence: 0.9
      },
      {
        id: 'item2',
        name: 'Caesar Salad',
        description: 'Romaine lettuce, parmesan, croutons',
        boundingBox: { x: 100, y: 280, width: 280, height: 50 },
        confidence: 0.85
      }
    ];

    return { menuItems: mockMenuItems };
  }

  /**
   * Calculate health score for menu item
   */
  async calculateMenuItemScore(menuItem) {
    // Simplified scoring - in production, use comprehensive ingredient analysis
    const baseScore = Math.random() * 40 + 60; // 60-100 range for demo

    // Adjust based on keywords
    let score = baseScore;
    const healthyKeywords = ['grilled', 'steamed', 'fresh', 'organic', 'salad'];
    const unhealthyKeywords = ['fried', 'crispy', 'loaded', 'smothered'];

    const text = (menuItem.name + ' ' + menuItem.description).toLowerCase();

    healthyKeywords.forEach(keyword => {
      if (text.includes(keyword)) score += 5;
    });

    unhealthyKeywords.forEach(keyword => {
      if (text.includes(keyword)) score -= 10;
    });

    score = Math.max(0, Math.min(100, score));

    return {
      overall: Math.round(score),
      trafficLight: score >= 80 ? 'green' : score >= 60 ? 'yellow' : 'red'
    };
  }

  /**
   * Update tracked object with stability checking
   */
  updateTrackedObject(objectId, data) {
    if (!this.trackedObjects.has(objectId)) {
      this.trackedObjects.set(objectId, {
        ...data,
        framesSeen: 1,
        isStable: false
      });
    } else {
      const existing = this.trackedObjects.get(objectId);
      existing.framesSeen++;
      existing.lastSeen = data.lastSeen;

      // Update data if confidence is higher
      if (data.confidence > existing.confidence) {
        Object.assign(existing, data);
      }

      // Mark as stable if seen enough frames
      if (existing.framesSeen >= this.detectionConfig.stabilityFrames) {
        existing.isStable = true;
      }
    }

    // Clean up old objects
    this.cleanupOldObjects();
  }

  /**
   * Clean up objects not seen recently
   */
  cleanupOldObjects() {
    const now = Date.now();
    const maxAge = 3000; // 3 seconds

    for (const [objectId, obj] of this.trackedObjects.entries()) {
      if (now - obj.lastSeen > maxAge) {
        this.trackedObjects.delete(objectId);
      }
    }
  }

  /**
   * Update AR overlay with detected objects
   */
  updateAROverlay() {
    if (!this.overlayContext) return;

    // Clear overlay
    this.overlayContext.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);

    // Draw stable objects
    for (const [objectId, obj] of this.trackedObjects.entries()) {
      if (obj.isStable && obj.confidence > this.detectionConfig.confidenceThreshold) {
        this.drawObjectOverlay(obj);
      }
    }
  }

  /**
   * Draw overlay for detected object
   */
  drawObjectOverlay(obj) {
    const ctx = this.overlayContext;
    const pos = obj.position;

    // Set up drawing style
    ctx.save();
    ctx.font = `${this.overlayStyles.text.fontWeight} ${this.overlayStyles.text.fontSize}px ${this.overlayStyles.text.fontFamily}`;
    ctx.textAlign = this.overlayStyles.text.textAlign;

    if (obj.type === 'menu_item') {
      this.drawMenuItemOverlay(ctx, obj, pos);
    } else if (obj.type === 'food_item') {
      this.drawFoodItemOverlay(ctx, obj, pos);
    } else if (obj.type === 'plate_summary') {
      this.drawPlateSummaryOverlay(ctx, obj, pos);
    }

    ctx.restore();
  }

  /**
   * Draw menu item overlay
   */
  drawMenuItemOverlay(ctx, obj, pos) {
    const style = this.getHealthScoreStyle(obj.healthScore);

    // Draw background box
    ctx.fillStyle = style.background;
    ctx.strokeStyle = style.color;
    ctx.lineWidth = this.overlayStyles.box.borderWidth;

    const boxHeight = 40;
    const boxY = pos.y + pos.height + 5;

    ctx.fillRect(pos.x, boxY, pos.width, boxHeight);
    ctx.strokeRect(pos.x, boxY, pos.width, boxHeight);

    // Draw health score
    ctx.fillStyle = '#fff';
    ctx.fillText(
      `Health Score: ${obj.healthScore}`,
      pos.x + pos.width / 2,
      boxY + 25
    );

    // Draw traffic light indicator
    this.drawTrafficLight(ctx, obj.trafficLight, pos.x + pos.width - 30, boxY + 10);
  }

  /**
   * Draw food item overlay
   */
  drawFoodItemOverlay(ctx, obj, pos) {
    // Draw bounding box
    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 2;
    ctx.strokeRect(pos.x, pos.y, pos.width, pos.height);

    // Draw nutrition info
    const nutrition = obj.nutrition;
    const infoText = `${obj.name}\n${nutrition.calories}cal | ${nutrition.protein}g protein`;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(pos.x, pos.y - 50, 200, 45);

    ctx.fillStyle = '#fff';
    ctx.fillText(obj.name, pos.x + 100, pos.y - 30);
    ctx.fillText(`${nutrition.calories}cal`, pos.x + 100, pos.y - 10);
  }

  /**
   * Draw plate summary overlay
   */
  drawPlateSummaryOverlay(ctx, obj, pos) {
    const nutrition = obj.nutrition;

    // Draw summary box
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(pos.x, pos.y, pos.width, pos.height);

    ctx.fillStyle = '#fff';
    ctx.fillText('Plate Analysis', pos.x + pos.width / 2, pos.y + 20);
    ctx.fillText(`${nutrition.totalCalories} calories`, pos.x + pos.width / 2, pos.y + 40);
    ctx.fillText(`P: ${nutrition.protein}g | C: ${nutrition.carbs}g | F: ${nutrition.fat}g`, pos.x + pos.width / 2, pos.y + 60);

    // Health score
    const style = this.getHealthScoreStyle(obj.healthScore);
    ctx.fillStyle = style.color;
    ctx.fillText(`Health Score: ${obj.healthScore}`, pos.x + pos.width / 2, pos.y + 80);
  }

  /**
   * Draw traffic light indicator
   */
  drawTrafficLight(ctx, trafficLight, x, y) {
    const colors = {
      green: '#4CAF50',
      yellow: '#FFC107',
      red: '#F44336'
    };

    ctx.fillStyle = colors[trafficLight] || colors.yellow;
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, 2 * Math.PI);
    ctx.fill();
  }

  /**
   * Get health score styling
   */
  getHealthScoreStyle(score) {
    if (score >= 80) return this.overlayStyles.healthScore.excellent;
    if (score >= 70) return this.overlayStyles.healthScore.good;
    if (score >= 60) return this.overlayStyles.healthScore.fair;
    return this.overlayStyles.healthScore.poor;
  }

  /**
   * Cleanup AR resources
   */
  cleanup() {
    this.stopARScanning();

    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop());
      this.videoStream = null;
    }

    this.canvas = null;
    this.context = null;
    this.overlayCanvas = null;
    this.overlayContext = null;
    this.trackedObjects.clear();
  }

  /**
   * Check if AR is currently active
   */
  isActive() {
    return this.isARActive;
  }

  /**
   * Get current tracked objects
   */
  getTrackedObjects() {
    return Array.from(this.trackedObjects.values())
      .filter(obj => obj.isStable);
  }
}

// Export singleton instance
export const arService = new ARService();
export default ARService;