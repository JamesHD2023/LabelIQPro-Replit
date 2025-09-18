import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cameraService } from '../services/CameraService';
import { ocrService } from '../services/OCRService';
import { ingredientParser } from '../services/IngredientParser';
import { foodRecognitionService } from '../services/FoodRecognitionService';
import { mealAnalysisService } from '../services/MealAnalysisService';
import { arService } from '../services/ARService';
import { dailyCalorieTracker } from '../services/DailyCalorieTracker';
import AROverlay from '../components/AROverlay';
import './CameraScreen.css';

const CameraScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const [isInitialized, setIsInitialized] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [facingMode, setFacingMode] = useState('environment');
  const [scanningMode, setScanningMode] = useState('ingredient-list'); // 'ingredient-list' or 'prepared-meal'
  const [isARMode, setIsARMode] = useState(false); // AR overlay mode
  const [arScanMode, setArScanMode] = useState('menu'); // 'menu' or 'plate'
  const [processingStep, setProcessingStep] = useState(''); // For real-time feedback
  const [processingProgress, setProcessingProgress] = useState(0);
  const [arSupported, setArSupported] = useState(false);

  const category = searchParams.get('category') || 'food';

  useEffect(() => {
    initializeCamera();
    checkARSupport();
    return () => {
      cleanup();
    };
  }, [facingMode]);

  useEffect(() => {
    // Handle AR mode changes
    if (isARMode && videoRef.current && overlayCanvasRef.current) {
      initializeAR();
    } else if (!isARMode) {
      stopAR();
    }
  }, [isARMode, arScanMode]);

  const initializeCamera = async () => {
    try {
      setError(null);
      const stream = await cameraService.startCamera(facingMode);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsInitialized(true);
      }
    } catch (err) {
      console.error('Camera initialization failed:', err);
      setError(t('camera.errors.initFailed'));
    }
  };

  /**
   * Check AR support
   */
  const checkARSupport = () => {
    const supported = arService.checkARSupport();
    setArSupported(supported);
    console.log('AR Support:', supported);
  };

  /**
   * Initialize AR mode
   */
  const initializeAR = async () => {
    try {
      await arService.initializeAR(videoRef.current, overlayCanvasRef.current);
      arService.startARScanning(arScanMode);
      console.log('AR mode initialized');
    } catch (error) {
      console.error('AR initialization failed:', error);
      setError('AR mode not available on this device');
      setIsARMode(false);
    }
  };

  /**
   * Stop AR mode
   */
  const stopAR = () => {
    arService.stopARScanning();
    console.log('AR mode stopped');
  };

  /**
   * Toggle AR mode
   */
  const toggleARMode = () => {
    if (!arSupported) {
      setError('AR not supported on this device');
      return;
    }
    setIsARMode(!isARMode);
  };

  /**
   * Switch AR scan mode
   */
  const switchARScanMode = (mode) => {
    setArScanMode(mode);
    if (isARMode) {
      stopAR();
      // Will be reinitialized by useEffect
    }
  };

  /**
   * Handle AR detection results
   */
  const handleARDetection = (detectedObjects) => {
    // Process AR detection results
    console.log('AR Detection:', detectedObjects);

    // Could trigger notifications, save results, etc.
    if (detectedObjects.length > 0) {
      const firstObject = detectedObjects[0];
      if (firstObject.type === 'plate_summary' && firstObject.nutrition) {
        // Auto-save plate analysis or show quick results
        console.log('Plate nutrition detected:', firstObject.nutrition);
      }
    }
  };

  const cleanup = () => {
    cameraService.stopCamera();
    arService.cleanup();
  };

  const handleCapture = async () => {
    if (!videoRef.current || isProcessing) return;

    setIsCapturing(true);
    setIsProcessing(true);

    try {
      // Capture image from video stream
      const canvas = canvasRef.current;
      const video = videoRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);

      const imageBlob = await new Promise(resolve => {
        canvas.toBlob(resolve, 'image/jpeg', 0.9);
      });

      // Process the captured image
      await processImage(imageBlob);

    } catch (err) {
      console.error('Capture failed:', err);
      setError(t('camera.errors.captureFailed'));
    } finally {
      setIsCapturing(false);
      setIsProcessing(false);
      setProcessingStep('');
      setProcessingProgress(0);
    }
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsProcessing(true);

    try {
      await processImage(file);
    } catch (err) {
      console.error('File processing failed:', err);
      setError(t('camera.errors.processingFailed'));
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
      setProcessingProgress(0);
    }
  };

  const processImage = async (imageBlob) => {
    try {
      setProcessingStep(t('camera.processing.preparing') || 'Preparing image...');
      setProcessingProgress(10);

      // Convert to base64 for processing
      const base64Image = await blobToBase64(imageBlob);

      let scanResult;

      if (category === 'food') {
        if (scanningMode === 'prepared-meal') {
          // Use AI-powered food recognition for prepared meals
          setProcessingStep(t('camera.processing.analyzing') || 'Analyzing meal...');
          setProcessingProgress(30);

          const mealAnalysis = await foodRecognitionService.recognizeMeal(base64Image, {
            includePortions: true,
            includeNutrition: true,
            learningLevel: 'beginner' // Could be from user profile
          });

          if (mealAnalysis.components.length === 0 && !mealAnalysis.fallback) {
            setError(t('camera.errors.noFoodFound') || 'No food items detected in image');
            return;
          }

          setProcessingStep(t('camera.processing.nutrition') || 'Calculating nutrition...');
          setProcessingProgress(60);

          // Get nutritional analysis
          const nutritionAnalysis = await mealAnalysisService.calculateNutrition(
            mealAnalysis.components,
            mealAnalysis.portions
          );

          setProcessingStep(t('camera.processing.health') || 'Assessing health impact...');
          setProcessingProgress(80);

          // Get health impact assessment
          const healthAssessment = await mealAnalysisService.assessHealthImpact(
            mealAnalysis.components,
            mealAnalysis.preparationMethod
          );

          scanResult = {
            id: mealAnalysis.id,
            timestamp: mealAnalysis.timestamp,
            category: 'food',
            type: 'meal_analysis',
            scanningMode: 'prepared-meal',
            image: base64Image,
            confidence: mealAnalysis.confidence,

            // Meal-specific data
            mealAnalysis,
            nutritionAnalysis,
            healthAssessment,

            // For compatibility with existing results screen
            ingredients: mealAnalysis.components.map(comp => ({
              name: comp.name,
              category: comp.category,
              confidence: comp.confidence,
              healthProfile: comp.healthProfile
            }))
          };
        } else {
          // Use OCR for ingredient lists (existing functionality)
          setProcessingStep(t('camera.processing.extracting') || 'Extracting text...');
          setProcessingProgress(40);

          const ocrResult = await ocrService.extractText(base64Image);

          if (!ocrResult.text || ocrResult.text.trim().length === 0) {
            setError(t('camera.errors.noTextFound'));
            return;
          }

          setProcessingStep(t('camera.processing.parsing') || 'Parsing ingredients...');
          setProcessingProgress(70);

          // Parse ingredients
          const parsedIngredients = await ingredientParser.parseText(
            ocrResult.text,
            category
          );

          if (!parsedIngredients || parsedIngredients.length === 0) {
            setError(t('camera.errors.noIngredientsFound'));
            return;
          }

          scanResult = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            category: 'food',
            type: 'ingredient_analysis',
            scanningMode: 'ingredient-list',
            rawText: ocrResult.text,
            ingredients: parsedIngredients,
            image: base64Image,
            confidence: ocrResult.confidence
          };
        }
      } else {
        // Use OCR for ingredient lists (cosmetics, household products)
        setProcessingStep(t('camera.processing.extracting') || 'Extracting text...');
        setProcessingProgress(40);

        const ocrResult = await ocrService.extractText(base64Image);

        if (!ocrResult.text || ocrResult.text.trim().length === 0) {
          setError(t('camera.errors.noTextFound'));
          return;
        }

        setProcessingStep(t('camera.processing.parsing') || 'Parsing ingredients...');
        setProcessingProgress(70);

        // Parse ingredients
        const parsedIngredients = await ingredientParser.parseText(
          ocrResult.text,
          category
        );

        if (!parsedIngredients || parsedIngredients.length === 0) {
          setError(t('camera.errors.noIngredientsFound'));
          return;
        }

        scanResult = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          category,
          type: 'ingredient_analysis',
          scanningMode: 'ingredient-list',
          rawText: ocrResult.text,
          ingredients: parsedIngredients,
          image: base64Image,
          confidence: ocrResult.confidence
        };
      }

      setProcessingStep(t('camera.processing.complete') || 'Complete!');
      setProcessingProgress(100);

      // Add to calorie tracking if it's a meal scan
      if (category === 'food' && scanningMode === 'prepared-meal' && scanResult.nutritionAnalysis) {
        try {
          setProcessingStep('Adding to calorie tracker...');
          await dailyCalorieTracker.addCalorieEntry({
            ...scanResult,
            components: scanResult.mealAnalysis?.components || [],
            nutrition: scanResult.nutritionAnalysis,
            confidence: scanResult.confidence
          });
          console.log('Added meal to calorie tracker');
        } catch (error) {
          console.error('Failed to add meal to calorie tracker:', error);
          // Don't fail the whole process, just log the error
        }
      }

      // Brief delay to show completion before navigation
      await new Promise(resolve => setTimeout(resolve, 500));

      // Navigate to results screen
      navigate(`/results/${scanResult.id}`, {
        state: { scanResult }
      });

    } catch (err) {
      console.error('Image processing error:', err);

      // Enhanced error handling for vision API failures
      if (err.message.includes('vision') || err.message.includes('API')) {
        if (category === 'food' && scanningMode === 'prepared-meal') {
          setError(t('camera.errors.visionApiFailed') || 'AI food recognition failed. Try taking a clearer photo or switch to ingredient list mode.');
        } else {
          setError(t('camera.errors.ocrFailed') || 'Text extraction failed. Try taking a clearer photo.');
        }
      } else {
        setError(t('camera.errors.processingFailed'));
      }

      // Reset processing state
      setProcessingStep('');
      setProcessingProgress(0);
    }
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const toggleCamera = () => {
    setFacingMode(prevMode => prevMode === 'user' ? 'environment' : 'user');
  };

  const handleClose = () => {
    navigate(-1);
  };

  const toggleScanningMode = () => {
    if (category === 'food') {
      setScanningMode(prev =>
        prev === 'ingredient-list' ? 'prepared-meal' : 'ingredient-list'
      );
    }
  };

  const getScanningModeConfig = () => {
    if (category !== 'food') {
      return {
        icon: '📝',
        title: t('camera.mode.ingredientList.title') || 'Ingredient List',
        description: t('camera.mode.ingredientList.description') || 'Scan text from product labels'
      };
    }

    return scanningMode === 'ingredient-list'
      ? {
          icon: '📝',
          title: t('camera.mode.ingredientList.title') || 'Ingredient List',
          description: t('camera.mode.ingredientList.description') || 'Scan text from food labels'
        }
      : {
          icon: '🍽️',
          title: t('camera.mode.preparedMeal.title') || 'Prepared Meal',
          description: t('camera.mode.preparedMeal.description') || 'Analyze prepared meals with AI'
        };
  };

  return (
    <div className="camera-screen">
      <div className="camera-header">
        <button className="close-button" onClick={handleClose}>
          <span className="close-icon">✕</span>
        </button>
        <div className="header-content">
          <h2>{t(`camera.title.${category}`)}</h2>
          {category === 'food' && (
            <div className="mode-selector">
              <button
                className="mode-toggle-button"
                onClick={toggleScanningMode}
                disabled={isProcessing}
              >
                <span className="mode-icon">{getScanningModeConfig().icon}</span>
                <div className="mode-text">
                  <span className="mode-title">{getScanningModeConfig().title}</span>
                  <span className="mode-description">{getScanningModeConfig().description}</span>
                </div>
                <span className="toggle-arrow">⇄</span>
              </button>
            </div>

{/* AR Mode Controls - temporarily disabled for testing */}
          )}
        </div>
        <button className="flip-button" onClick={toggleCamera}>
          <span className="flip-icon">🔄</span>
        </button>
      </div>

      <div className="camera-container">
        {error ? (
          <div className="error-container">
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <p>{error}</p>
            </div>
            <button
              className="retry-button"
              onClick={initializeCamera}
            >
              {t('camera.retry')}
            </button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              className={`camera-video ${!isInitialized ? 'loading' : ''}`}
              autoPlay
              playsInline
              muted
            />
            <canvas
              ref={canvasRef}
              className="capture-canvas"
              style={{ display: 'none' }}
            />

            {/* AR Overlay Canvas */}
            <canvas
              ref={overlayCanvasRef}
              className={`ar-overlay-canvas ${isARMode ? 'active' : ''}`}
              style={{
                display: isARMode ? 'block' : 'none',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 10
              }}
            />

            {isInitialized && (
              <div className="camera-overlay">
                <div className="scan-frame">
                  <div className="corner top-left"></div>
                  <div className="corner top-right"></div>
                  <div className="corner bottom-left"></div>
                  <div className="corner bottom-right"></div>
                </div>

                <div className="scan-instructions">
                  <p>
                    {category === 'food'
                      ? t(`camera.instructions.${scanningMode}`) || getScanningModeConfig().description
                      : t(`camera.instructions.${category}`)
                    }
                  </p>
                </div>
              </div>
            )}

            {/* AR Overlay Component */}
            <AROverlay
              isActive={isARMode && isInitialized}
              mode={arScanMode}
              onDetection={handleARDetection}
            />
          </>
        )}
      </div>

      <div className="camera-controls">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        <button
          className="gallery-button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
        >
          <span className="button-icon">🖼️</span>
        </button>

        <button
          className={`capture-button ${isCapturing ? 'capturing' : ''}`}
          onClick={handleCapture}
          disabled={!isInitialized || isProcessing}
        >
          {isProcessing ? (
            <div className="processing-spinner"></div>
          ) : (
            <div className="capture-ring">
              <div className="capture-dot"></div>
            </div>
          )}
        </button>

        <button
          className="settings-button"
          onClick={() => navigate('/camera-settings')}
          disabled={isProcessing}
        >
          <span className="button-icon">⚙️</span>
        </button>
      </div>

      {isProcessing && (
        <div className="processing-overlay">
          <div className="processing-content">
            <div className="processing-spinner large"></div>
            <div className="processing-info">
              <p className="processing-step">
                {processingStep || t('camera.processing')}
              </p>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${processingProgress}%` }}
                ></div>
              </div>
              <p className="progress-text">{processingProgress}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraScreen;