class OCRService {
  constructor() {
    this.baseUrl = process.env.REACT_APP_VISION_API_URL || 'https://vision.googleapis.com/v1';
    this.apiKey = process.env.REACT_APP_VISION_API_KEY;
  }

  async extractText(base64Image, language = 'en') {
    try {
      // Remove data URL prefix if present
      const cleanBase64 = base64Image.replace(/^data:image\/[a-z]+;base64,/, '');

      const requestBody = {
        requests: [
          {
            image: {
              content: cleanBase64
            },
            features: [
              {
                type: 'TEXT_DETECTION',
                maxResults: 1
              }
            ],
            imageContext: {
              languageHints: [language]
            }
          }
        ]
      };

      const response = await fetch(`${this.baseUrl}/images:annotate?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`OCR API request failed: ${response.status}`);
      }

      const data = await response.json();

      if (data.responses?.[0]?.error) {
        throw new Error(data.responses[0].error.message);
      }

      const textAnnotations = data.responses?.[0]?.textAnnotations;

      if (!textAnnotations || textAnnotations.length === 0) {
        return {
          text: '',
          confidence: 0,
          words: []
        };
      }

      // First annotation contains the full text
      const fullText = textAnnotations[0];

      // Extract individual words with their confidence scores
      const words = textAnnotations.slice(1).map(annotation => ({
        text: annotation.description,
        confidence: annotation.confidence || 0.8,
        boundingBox: annotation.boundingPoly
      }));

      return {
        text: fullText.description,
        confidence: this.calculateOverallConfidence(words),
        words: words,
        rawResponse: data.responses[0]
      };

    } catch (error) {
      console.error('OCR extraction failed:', error);

      // Fallback to browser-based OCR if available
      if (window.Tesseract) {
        return this.fallbackOCR(base64Image, language);
      }

      throw error;
    }
  }

  calculateOverallConfidence(words) {
    if (!words || words.length === 0) return 0;

    const totalConfidence = words.reduce((sum, word) => sum + word.confidence, 0);
    return totalConfidence / words.length;
  }

  async fallbackOCR(base64Image, language) {
    try {
      console.log('Using fallback OCR...');

      // Use Tesseract.js as fallback
      const { createWorker } = window.Tesseract;
      const worker = createWorker();

      await worker.load();
      await worker.loadLanguage(language);
      await worker.initialize(language);

      const { data } = await worker.recognize(base64Image);
      await worker.terminate();

      return {
        text: data.text,
        confidence: data.confidence / 100,
        words: data.words?.map(word => ({
          text: word.text,
          confidence: word.confidence / 100,
          boundingBox: word.bbox
        })) || []
      };

    } catch (error) {
      console.error('Fallback OCR failed:', error);
      throw error;
    }
  }

  // Preprocess image to improve OCR accuracy
  preprocessImage(canvas) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Convert to grayscale and increase contrast
    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];

      // Increase contrast
      const contrast = 1.5;
      const factor = (259 * (contrast * 255 + 255)) / (255 * (259 - contrast * 255));
      const enhancedGray = factor * (gray - 128) + 128;

      data[i] = enhancedGray;     // Red
      data[i + 1] = enhancedGray; // Green
      data[i + 2] = enhancedGray; // Blue
      // Alpha channel remains unchanged
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }
}

export const ocrService = new OCRService();