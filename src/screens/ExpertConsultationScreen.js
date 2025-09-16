import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { smartExpertRouter } from '../services/SmartExpertRouter';
import { offlineService } from '../services/OfflineService';
import './ExpertConsultationScreen.css';

const ExpertConsultationScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();

  // State management
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [expertRecommendations, setExpertRecommendations] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);

  // Refs
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);
  const conversationEndRef = useRef(null);
  const inputRef = useRef(null);

  // Get context from URL params
  const contextScanId = searchParams.get('scanId');
  const contextQuery = searchParams.get('q');

  useEffect(() => {
    initializeVoice();
    loadContext();
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom on new messages
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  useEffect(() => {
    // Pre-populate query if provided
    if (contextQuery) {
      setQuery(contextQuery);
      handleQuerySubmit(contextQuery);
    }
  }, [contextQuery]);

  /**
   * Initialize voice recognition and synthesis
   */
  const initializeVoice = () => {
    // Check for Web Speech API support
    const hasWebSpeech = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    const hasSynthesis = 'speechSynthesis' in window;

    setVoiceSupported(hasWebSpeech && hasSynthesis);

    if (hasWebSpeech) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();

      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');

        setQuery(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }

    if (hasSynthesis) {
      synthesisRef.current = window.speechSynthesis;
    }
  };

  /**
   * Load context from scan results or user profile
   */
  const loadContext = async () => {
    let scanContext = null;
    let userProfile = null;

    try {
      // Load scan context if provided
      if (contextScanId) {
        scanContext = await offlineService.getScanResult(contextScanId);
      }

      // Load user profile
      userProfile = await offlineService.getUserProfile();

      // Store context for expert routing
      setExpertRecommendations({ scanContext, userProfile });
    } catch (error) {
      console.error('Failed to load context:', error);
    }
  };

  /**
   * Handle voice input toggle
   */
  const toggleVoiceInput = () => {
    if (!voiceSupported) {
      alert('Voice input not supported in this browser');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };

  /**
   * Handle query submission
   */
  const handleQuerySubmit = async (queryText = query) => {
    if (!queryText.trim() || isProcessing) return;

    setIsProcessing(true);

    // Add user message to conversation
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: queryText,
      timestamp: new Date().toISOString()
    };

    setConversation(prev => [...prev, userMessage]);
    setQuery('');

    try {
      // Get expert routing recommendations
      const context = {
        scanResult: expertRecommendations?.scanContext,
        userProfile: expertRecommendations?.userProfile
      };

      const routing = smartExpertRouter.analyze(queryText, context);

      // Show expert selection if multiple experts recommended
      if (routing.routing.multiExpert) {
        const expertSelectionMessage = {
          id: Date.now() + 1,
          type: 'expert-selection',
          content: 'I found multiple experts who can help with your question. Which would you prefer?',
          routing: routing,
          timestamp: new Date().toISOString()
        };

        setConversation(prev => [...prev, expertSelectionMessage]);
      } else if (routing.routing.primary) {
        // Direct to primary expert
        await consultExpert(routing.routing.primary, queryText, routing);
      } else {
        // No clear expert match
        const fallbackMessage = {
          id: Date.now() + 1,
          type: 'system',
          content: "I'm not sure which expert would be best for your question. Could you provide more details or choose an expert from the list below?",
          experts: smartExpertRouter.getAllExperts(),
          timestamp: new Date().toISOString()
        };

        setConversation(prev => [...prev, fallbackMessage]);
      }

    } catch (error) {
      console.error('Expert routing failed:', error);

      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        content: 'Sorry, I encountered an error processing your question. Please try again.',
        timestamp: new Date().toISOString()
      };

      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Consult with specific expert
   */
  const consultExpert = async (expertInfo, queryText, routing) => {
    setSelectedExpert(expertInfo);
    setIsTyping(true);

    // Simulate expert typing delay
    setTimeout(async () => {
      try {
        // Generate expert response (this would call actual AI service)
        const response = await generateExpertResponse(expertInfo, queryText, routing);

        const expertMessage = {
          id: Date.now() + 2,
          type: 'expert',
          expert: expertInfo,
          content: response.content,
          suggestions: response.suggestions,
          followUps: routing.suggestions,
          timestamp: new Date().toISOString()
        };

        setConversation(prev => [...prev, expertMessage]);

        // Text-to-speech for expert response
        if (voiceSupported && synthesisRef.current) {
          const utterance = new SpeechSynthesisUtterance(response.content);
          utterance.rate = 0.9;
          utterance.pitch = 1.0;
          synthesisRef.current.speak(utterance);
        }

      } catch (error) {
        console.error('Expert consultation failed:', error);

        const errorMessage = {
          id: Date.now() + 2,
          type: 'error',
          content: 'The expert is currently unavailable. Please try again later.',
          timestamp: new Date().toISOString()
        };

        setConversation(prev => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
      }
    }, 1500);
  };

  /**
   * Generate expert response (placeholder for AI integration)
   */
  const generateExpertResponse = async (expertInfo, query, routing) => {
    // This would integrate with actual AI service
    // For now, return contextual response based on expert type

    const responses = {
      allergist: {
        content: `As an AI Allergist Assistant, I can provide information about potential allergic reactions. Based on your question about "${query}", I'd recommend checking for common allergens and cross-reactions. If you're experiencing symptoms, please consult with a healthcare professional and monitor them closely. Have emergency medication ready if prescribed by your doctor.

*Disclaimer: This is AI-generated information for educational purposes only and does not replace professional medical advice.*`,
        suggestions: [
          "Check ingredient labels carefully",
          "Consider allergy testing if symptoms persist",
          "Keep a symptom diary"
        ]
      },
      dermatologist: {
        content: `As an AI Dermatology Consultant, I can provide information about skin health and ingredient safety. Regarding "${query}", skin reactions can vary greatly between individuals. I'd suggest patch testing new products and avoiding known irritants. If you're experiencing persistent skin issues, please consult with a dermatologist.

*Disclaimer: This is AI-generated information for educational purposes only and does not replace professional medical advice.*`,
        suggestions: [
          "Perform patch tests before full use",
          "Use fragrance-free alternatives",
          "Maintain a skincare diary"
        ]
      },
      gastroenterologist: {
        content: `As an AI Digestive Health Advisor, I can provide information about gut health and food sensitivities. Regarding your concerns about "${query}", the digestive system can be sensitive to various food ingredients. I recommend keeping a food diary to identify triggers and eating smaller, more frequent meals. For persistent symptoms, please consult with a gastroenterologist or healthcare provider.

*Disclaimer: This is AI-generated information for educational purposes only and does not replace professional medical advice.*`,
        suggestions: [
          "Keep a detailed food diary",
          "Try elimination diets under medical guidance",
          "Consider probiotics with healthcare approval"
        ]
      },
      // Add other expert responses...
    };

    const defaultResponse = {
      content: `Thank you for your question about "${query}". As an AI Health Assistant, I'd recommend taking a cautious approach and consulting with healthcare professionals for personalized advice. Here are some general guidelines that might help.

*Disclaimer: This is AI-generated information for educational purposes only and does not replace professional medical advice.*`,
      suggestions: [
        "Consult with healthcare professionals",
        "Research reputable medical sources",
        "Keep detailed records"
      ]
    };

    return responses[expertInfo.expertId] || defaultResponse;
  };

  /**
   * Handle expert selection from multiple options
   */
  const handleExpertSelection = (expertInfo) => {
    const lastUserMessage = conversation
      .filter(msg => msg.type === 'user')
      .pop();

    if (lastUserMessage) {
      consultExpert(expertInfo, lastUserMessage.content, { suggestions: [] });
    }
  };

  /**
   * Handle follow-up questions
   */
  const handleFollowUp = (followUpText) => {
    setQuery(followUpText);
    inputRef.current?.focus();
  };

  /**
   * Clear conversation
   */
  const clearConversation = () => {
    setConversation([]);
    setSelectedExpert(null);
    setExpertRecommendations(null);
  };

  return (
    <div className="expert-consultation">
      <div className="expert-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ←
        </button>
        <div className="header-content">
          <h1 className="header-title">🩺 Ask Expert</h1>
          {selectedExpert && (
            <div className="selected-expert">
              <span className="expert-avatar">{selectedExpert.expert.avatar}</span>
              <div className="expert-info">
                <span className="expert-name">{selectedExpert.expert.name}</span>
                <span className="expert-title">{selectedExpert.expert.title}</span>
              </div>
            </div>
          )}
        </div>
        {conversation.length > 0 && (
          <button className="clear-button" onClick={clearConversation}>
            🗑️
          </button>
        )}
      </div>

      <div className="conversation-container">
        {conversation.length === 0 ? (
          <div className="welcome-screen">
            <div className="welcome-content">
              <div className="welcome-icon">🩺</div>
              <h2>Ask Our Medical Experts</h2>
              <p>Get personalized advice from AI specialists about ingredient safety, health effects, and more.</p>

              <div className="expert-grid">
                {smartExpertRouter.getAllExperts().map(expert => (
                  <div
                    key={expert.id}
                    className="expert-card"
                    onClick={() => setSelectedExpert({ expert, expertId: expert.id })}
                  >
                    <span className="expert-avatar">{expert.avatar}</span>
                    <span className="expert-name">{expert.name}</span>
                    <span className="expert-title">{expert.title}</span>
                  </div>
                ))}
              </div>

              <div className="quick-questions">
                <h3>Quick Questions</h3>
                <button onClick={() => handleFollowUp("Is this ingredient safe for sensitive skin?")}>
                  Is this ingredient safe for sensitive skin?
                </button>
                <button onClick={() => handleFollowUp("What are the allergy risks?")}>
                  What are the allergy risks?
                </button>
                <button onClick={() => handleFollowUp("Could this cause digestive issues?")}>
                  Could this cause digestive issues?
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="conversation">
            {conversation.map(message => (
              <div key={message.id} className={`message ${message.type}`}>
                {message.type === 'user' && (
                  <div className="user-message">
                    <div className="message-avatar">👤</div>
                    <div className="message-content">{message.content}</div>
                  </div>
                )}

                {message.type === 'expert' && (
                  <div className="expert-message">
                    <div className="message-avatar">{message.expert.expert.avatar}</div>
                    <div className="message-content">
                      <div className="expert-name">{message.expert.expert.name}</div>
                      <div className="content">{message.content}</div>
                      {message.suggestions && (
                        <div className="suggestions">
                          <h4>Recommendations:</h4>
                          <ul>
                            {message.suggestions.map((suggestion, index) => (
                              <li key={index}>{suggestion}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {message.followUps && (
                        <div className="follow-ups">
                          {message.followUps.map((followUp, index) => (
                            <button
                              key={index}
                              className="follow-up-button"
                              onClick={() => handleFollowUp(followUp)}
                            >
                              {followUp}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {message.type === 'expert-selection' && (
                  <div className="expert-selection-message">
                    <div className="message-content">
                      <p>{message.content}</p>
                      <div className="expert-options">
                        {message.routing.routing.primary && (
                          <button
                            className="expert-option primary"
                            onClick={() => handleExpertSelection(message.routing.routing.primary)}
                          >
                            <span className="expert-avatar">{message.routing.routing.primary.expert.avatar}</span>
                            <div>
                              <span className="expert-name">{message.routing.routing.primary.expert.name}</span>
                              <span className="expert-title">{message.routing.routing.primary.expert.title}</span>
                              <span className="confidence">Recommended ({message.routing.routing.primary.confidence})</span>
                            </div>
                          </button>
                        )}
                        {message.routing.routing.secondary.map(expert => (
                          <button
                            key={expert.expertId}
                            className="expert-option"
                            onClick={() => handleExpertSelection(expert)}
                          >
                            <span className="expert-avatar">{expert.expert.avatar}</span>
                            <div>
                              <span className="expert-name">{expert.expert.name}</span>
                              <span className="expert-title">{expert.expert.title}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {message.type === 'system' && (
                  <div className="system-message">
                    <div className="message-content">{message.content}</div>
                    {message.experts && (
                      <div className="expert-list">
                        {message.experts.map(expert => (
                          <button
                            key={expert.id}
                            className="expert-option"
                            onClick={() => handleExpertSelection({ expert, expertId: expert.id })}
                          >
                            <span className="expert-avatar">{expert.avatar}</span>
                            <span className="expert-name">{expert.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {message.type === 'error' && (
                  <div className="error-message">
                    <div className="message-content">⚠️ {message.content}</div>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="typing-indicator">
                <div className="message-avatar">
                  {selectedExpert?.expert.avatar || '🩺'}
                </div>
                <div className="typing-animation">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            <div ref={conversationEndRef} />
          </div>
        )}
      </div>

      <div className="input-container">
        <div className="input-wrapper">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleQuerySubmit()}
            placeholder="Ask about ingredient safety, health effects, or get expert advice..."
            disabled={isProcessing}
            className="query-input"
          />

          {voiceSupported && (
            <button
              className={`voice-button ${isListening ? 'listening' : ''}`}
              onClick={toggleVoiceInput}
              disabled={isProcessing}
              title="Voice input"
            >
              🎤
            </button>
          )}

          <button
            className="send-button"
            onClick={() => handleQuerySubmit()}
            disabled={!query.trim() || isProcessing}
            title="Send message"
          >
            {isProcessing ? '⏳' : '➤'}
          </button>
        </div>

        {isListening && (
          <div className="voice-indicator">
            🎤 Listening... Speak your question
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpertConsultationScreen;