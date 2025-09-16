/**
 * Voice Service for Speech Recognition and Text-to-Speech
 * Handles medical terminology and expert consultation audio features
 */

class VoiceService {
  constructor() {
    this.recognition = null;
    this.synthesis = null;
    this.isListening = false;
    this.isSpeaking = false;

    // Voice configuration
    this.config = {
      recognition: {
        continuous: false,
        interimResults: true,
        maxAlternatives: 3,
        language: 'en-US'
      },
      synthesis: {
        rate: 0.9,
        pitch: 1.0,
        volume: 0.8,
        voice: null // Will be set to preferred voice
      }
    };

    // Medical terminology for better recognition
    this.medicalTerms = [
      'allergy', 'allergic', 'anaphylaxis', 'dermatitis', 'eczema',
      'gastroenterologist', 'endocrinologist', 'toxicologist',
      'ingredients', 'preservatives', 'additives', 'chemical',
      'reaction', 'sensitivity', 'intolerance', 'inflammation',
      'metabolism', 'hormone', 'thyroid', 'diabetes', 'glucose',
      'carcinogenic', 'mutagenic', 'bioaccumulation'
    ];

    this.initialize();
  }

  /**
   * Initialize voice services
   */
  async initialize() {
    try {
      await this.initializeSpeechRecognition();
      await this.initializeSpeechSynthesis();
      console.log('Voice services initialized successfully');
    } catch (error) {
      console.error('Voice service initialization failed:', error);
    }
  }

  /**
   * Initialize speech recognition
   */
  async initializeSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      throw new Error('Speech recognition not supported');
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();

    // Configure recognition
    Object.assign(this.recognition, this.config.recognition);

    // Set up event handlers
    this.recognition.onstart = () => {
      this.isListening = true;
      this.emit('recognitionStart');
    };

    this.recognition.onresult = (event) => {
      this.handleRecognitionResult(event);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.emit('recognitionEnd');
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      this.emit('recognitionError', event.error);
    };

    this.recognition.onspeechstart = () => {
      this.emit('speechStart');
    };

    this.recognition.onspeechend = () => {
      this.emit('speechEnd');
    };
  }

  /**
   * Initialize speech synthesis
   */
  async initializeSpeechSynthesis() {
    if (!('speechSynthesis' in window)) {
      throw new Error('Speech synthesis not supported');
    }

    this.synthesis = window.speechSynthesis;

    // Wait for voices to load
    await this.loadVoices();

    // Select best voice for medical terminology
    this.selectOptimalVoice();
  }

  /**
   * Load available voices
   */
  async loadVoices() {
    return new Promise((resolve) => {
      const voices = this.synthesis.getVoices();

      if (voices.length > 0) {
        resolve(voices);
      } else {
        // Wait for voices to load
        this.synthesis.onvoiceschanged = () => {
          resolve(this.synthesis.getVoices());
        };
      }
    });
  }

  /**
   * Select optimal voice for medical content
   */
  selectOptimalVoice() {
    const voices = this.synthesis.getVoices();

    // Preferences: clear, natural-sounding voices
    const preferences = [
      'Google US English',
      'Microsoft Zira - English (United States)',
      'Samantha',
      'Alex'
    ];

    let selectedVoice = null;

    // Try to find preferred voice
    for (const preference of preferences) {
      selectedVoice = voices.find(voice => voice.name.includes(preference));
      if (selectedVoice) break;
    }

    // Fallback: English voice with good quality
    if (!selectedVoice) {
      selectedVoice = voices.find(voice =>
        voice.lang.includes('en') && voice.localService
      );
    }

    // Ultimate fallback: any English voice
    if (!selectedVoice) {
      selectedVoice = voices.find(voice => voice.lang.includes('en'));
    }

    this.config.synthesis.voice = selectedVoice;
    console.log('Selected voice:', selectedVoice?.name || 'Default');
  }

  /**
   * Start listening for speech input
   */
  startListening(options = {}) {
    if (!this.recognition) {
      throw new Error('Speech recognition not available');
    }

    if (this.isListening) {
      return false;
    }

    // Apply temporary options
    if (options.language) {
      this.recognition.lang = options.language;
    }

    if (options.continuous !== undefined) {
      this.recognition.continuous = options.continuous;
    }

    try {
      this.recognition.start();
      return true;
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      return false;
    }
  }

  /**
   * Stop listening
   */
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  /**
   * Handle speech recognition results
   */
  handleRecognitionResult(event) {
    const results = Array.from(event.results);
    const finalResult = results[results.length - 1];

    if (finalResult.isFinal) {
      const transcript = finalResult[0].transcript.trim();
      const confidence = finalResult[0].confidence;

      // Post-process for medical terminology
      const processedTranscript = this.processTranscript(transcript);

      this.emit('recognitionResult', {
        transcript: processedTranscript,
        originalTranscript: transcript,
        confidence,
        alternatives: Array.from(finalResult).map(alt => ({
          transcript: alt.transcript,
          confidence: alt.confidence
        }))
      });
    } else {
      // Interim results
      const transcript = finalResult[0].transcript;
      this.emit('recognitionInterim', { transcript });
    }
  }

  /**
   * Process transcript for medical terminology corrections
   */
  processTranscript(transcript) {
    let processed = transcript.toLowerCase();

    // Common medical term corrections
    const corrections = {
      'ecology': 'allergy',
      'allergic': 'allergic',
      'anna phylaxis': 'anaphylaxis',
      'anna flex is': 'anaphylaxis',
      'derma titus': 'dermatitis',
      'eczema': 'eczema',
      'gasoline enterologist': 'gastroenterologist',
      'and a chronologist': 'endocrinologist',
      'toxicologist': 'toxicologist',
      'in gradients': 'ingredients',
      'preservatives': 'preservatives',
      'additives': 'additives',
      'chemical': 'chemical',
      'reaction': 'reaction',
      'sensitivity': 'sensitivity',
      'in tolerance': 'intolerance',
      'inflammation': 'inflammation',
      'metabolism': 'metabolism',
      'hormone': 'hormone',
      'thyroid': 'thyroid',
      'diabetes': 'diabetes',
      'glucose': 'glucose'
    };

    // Apply corrections
    for (const [wrong, correct] of Object.entries(corrections)) {
      const regex = new RegExp(wrong, 'gi');
      processed = processed.replace(regex, correct);
    }

    // Capitalize first letter
    return processed.charAt(0).toUpperCase() + processed.slice(1);
  }

  /**
   * Speak text using text-to-speech
   */
  speak(text, options = {}) {
    if (!this.synthesis) {
      throw new Error('Speech synthesis not available');
    }

    // Stop any current speech
    this.stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);

    // Apply configuration
    utterance.rate = options.rate || this.config.synthesis.rate;
    utterance.pitch = options.pitch || this.config.synthesis.pitch;
    utterance.volume = options.volume || this.config.synthesis.volume;
    utterance.voice = options.voice || this.config.synthesis.voice;

    // Add emphasis to medical terms
    const processedText = this.addMedicalEmphasis(text);
    utterance.text = processedText;

    // Event handlers
    utterance.onstart = () => {
      this.isSpeaking = true;
      this.emit('speechStart');
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.emit('speechEnd');
    };

    utterance.onerror = (event) => {
      this.isSpeaking = false;
      this.emit('speechError', event.error);
    };

    utterance.onpause = () => {
      this.emit('speechPause');
    };

    utterance.onresume = () => {
      this.emit('speechResume');
    };

    this.synthesis.speak(utterance);
    return utterance;
  }

  /**
   * Add emphasis to medical terminology in speech
   */
  addMedicalEmphasis(text) {
    let processedText = text;

    // Add pauses and emphasis to complex medical terms
    const emphasisTerms = {
      'anaphylaxis': 'an-a-phy-lax-is',
      'gastroenterologist': 'gastro-enterologist',
      'endocrinologist': 'endo-crinologist',
      'dermatitis': 'derma-titis',
      'bioaccumulation': 'bio-accumulation',
      'carcinogenic': 'carcino-genic'
    };

    for (const [term, emphasized] of Object.entries(emphasisTerms)) {
      const regex = new RegExp(term, 'gi');
      processedText = processedText.replace(regex, emphasized);
    }

    return processedText;
  }

  /**
   * Stop current speech
   */
  stopSpeaking() {
    if (this.synthesis && this.isSpeaking) {
      this.synthesis.cancel();
      this.isSpeaking = false;
    }
  }

  /**
   * Pause current speech
   */
  pauseSpeaking() {
    if (this.synthesis && this.isSpeaking) {
      this.synthesis.pause();
    }
  }

  /**
   * Resume paused speech
   */
  resumeSpeaking() {
    if (this.synthesis) {
      this.synthesis.resume();
    }
  }

  /**
   * Check if voice features are supported
   */
  isSupported() {
    return {
      recognition: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
      synthesis: 'speechSynthesis' in window
    };
  }

  /**
   * Get available voices
   */
  getAvailableVoices() {
    return this.synthesis ? this.synthesis.getVoices() : [];
  }

  /**
   * Set voice language
   */
  setLanguage(language) {
    if (this.recognition) {
      this.recognition.lang = language;
    }
  }

  /**
   * Event emitter functionality
   */
  emit(event, data) {
    if (this.listeners && this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  /**
   * Add event listener
   */
  addEventListener(event, callback) {
    if (!this.listeners) {
      this.listeners = {};
    }
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  /**
   * Remove event listener
   */
  removeEventListener(event, callback) {
    if (this.listeners && this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  /**
   * Clean up resources
   */
  cleanup() {
    this.stopListening();
    this.stopSpeaking();
    this.listeners = {};
  }
}

// Export singleton instance
export const voiceService = new VoiceService();
export default VoiceService;