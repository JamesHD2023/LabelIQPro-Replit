# IPICIA.COM PWA

## Overview

IPICIA.COM is a comprehensive Progressive Web App that provides intelligent food and product label analysis using AI-powered ingredient recognition and health assessment. "Scan it - every choice matters!" - Ingredient & Product Intelligence: Consumed, Ingested, or Applied. The application enables users to scan product labels through their camera, extract ingredient lists using OCR technology, and receive detailed health scoring, nutritional analysis, and personalized recommendations. The PWA architecture ensures full offline functionality with service worker caching, making it accessible even without internet connectivity.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18** with functional components and hooks for modern UI development
- **Progressive Web App (PWA)** implementation with full offline support via service workers
- **React Router DOM** for client-side navigation between scanning, results, history, and profile screens
- **Framer Motion** for smooth animations and enhanced user experience
- **CSS Grid/Flexbox** responsive design system with IPICIA brand gradient theming (cyan-to-green color scheme)
- **Internationalization (i18n)** supporting 8 languages (English, German, French, Spanish, Portuguese, Dutch, Norwegian, Swedish)

### Camera and Image Processing
- **Camera Service** manages device camera access with support for front/back camera switching
- **OCR Service** extracts text from product label images using computer vision
- **Image optimization** with automatic compression to meet API size limitations
- **AR Overlay Service** provides augmented reality features for real-time meal analysis

### AI and Data Processing
- **Ingredient Parser** processes extracted text to identify and normalize ingredient lists
- **Food Recognition Service** uses computer vision APIs to identify prepared meals and food components
- **Meal Analysis Service** provides comprehensive nutritional breakdown and health assessment
- **Smart Expert Router** routes health questions to appropriate AI expert systems
- **Scoring Service** calculates safety scores and health impact ratings

### Data Storage and Offline Support
- **IndexedDB** local database for offline ingredient information and user data
- **LocalForage** for enhanced local storage with automatic fallbacks
- **Service Worker** with advanced caching strategies (Network First for APIs, Cache First for static assets)
- **Background Sync** to synchronize data when connection is restored
- **90-day data retention** for scan history and calorie tracking

### Health and Analytics
- **Daily Calorie Tracker** with BMR/TDEE calculations and personalized recommendations
- **Health Analytics Service** for trend analysis and progress tracking
- **Learning Journey Service** provides educational content based on user expertise level
- **Additive Analysis Service** with comprehensive E-numbers database including 2025 regulatory updates

### Performance and Reliability
- **App Shell Architecture** for instant loading and perceived performance
- **Critical CSS** inlined for fast initial paint
- **Resource preloading** for essential assets and API endpoints
- **Error boundaries** and graceful degradation for robust user experience
- **Web Vitals** monitoring for performance optimization

## External Dependencies

### Core Framework
- **React 18.2.0** - Main UI framework with concurrent features
- **React DOM 18.2.0** - DOM rendering and hydration
- **React Router DOM 6.8.0** - Client-side routing and navigation
- **React Scripts 5.0.1** - Build tooling and development server

### PWA and Offline Support
- **Workbox Webpack Plugin 6.5.4** - Service worker generation and caching strategies
- **Workbox Window 6.5.4** - Service worker lifecycle management
- **IDB 7.1.1** - IndexedDB wrapper for local database operations
- **LocalForage 1.10.0** - Enhanced local storage with automatic fallbacks

### Internationalization and UX
- **i18next 23.7.6** - Internationalization framework
- **React i18next 13.5.0** - React bindings for i18n
- **Framer Motion 12.23.13** - Animation library for enhanced interactions

### Testing and Quality
- **Testing Library suite** (Jest DOM, React, User Event) - Comprehensive testing utilities
- **Web Vitals 2.1.4** - Performance monitoring and optimization

### Planned External APIs
- **Google Cloud Vision API** - OCR text extraction from product labels
- **OpenAI GPT-4/Anthropic Claude** - AI-powered ingredient analysis and health assessment
- **USDA FoodData Central** - Comprehensive nutrition database (free tier)
- **Custom Additives Database** - 300+ E-numbers with 2025 regulatory compliance data

### Browser APIs and Standards
- **Camera API** (getUserMedia) - Device camera access for scanning
- **Service Worker API** - Offline functionality and background sync
- **Web App Manifest** - PWA installation and app-like behavior
- **Push Notifications API** - User engagement and reminders
- **Web Storage APIs** - Local data persistence