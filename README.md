# LabelIQ PWA 🏷️

A comprehensive Progressive Web App for intelligent food and product label analysis, providing real-time ingredient safety assessment, nutritional analysis, and health scoring with the latest 2025 regulatory data.

![LabelIQ Logo](public/icons/icon-192x192.png)

## 🌟 Features

### Core Functionality
- **📸 Smart Label Scanning**: Advanced OCR technology extracts ingredient lists from product photos
- **🧠 AI-Powered Analysis**: Intelligent ingredient parsing and health assessment using latest AI models
- **🏥 Comprehensive Health Scoring**: Evidence-based safety scores with personalized recommendations
- **🌍 Global Regulatory Awareness**: EU vs US regulatory differences and 2025 updates
- **🥗 Nutrition Analysis**: Complete nutritional breakdown with calorie tracking
- **👤 Personalized Profiles**: Custom analysis based on allergies, diet preferences, and health goals

### Advanced Features
- **📱 Progressive Web App**: Full offline functionality with service worker caching
- **🗄️ Comprehensive E-Numbers Database**: 300+ additives with latest 2025 regulatory data
- **⚖️ Regulatory Compliance**: Real-time tracking of banned/restricted additives
- **📊 Daily Calorie Tracking**: BMR/TDEE calculations with 90-day data retention
- **🔄 Social Sharing**: Share scan results across multiple platforms
- **📈 Health Dashboard**: Track scanning history and health insights
- **🎓 Learning Journey**: Educational content about food additives and nutrition

### PWA Features
- **📱 Installable**: Add to home screen on mobile and desktop
- **🔄 Offline Support**: Works without internet connection
- **📧 Push Notifications**: Smart reminders and updates
- **⚡ Fast Loading**: App shell architecture with instant startup
- **📱 Responsive Design**: Works on all screen sizes
- **🔔 Background Sync**: Sync data when connection is restored

### Technical Features
- **🗄️ Local Database**: IndexedDB for offline ingredient database
- **🔄 Service Worker**: Advanced caching and offline functionality
- **🌐 Multi-language**: Support for 8 languages
- **🎨 Modern UI**: CSS Grid/Flexbox with smooth animations
- **♿ Accessible**: Full keyboard navigation and screen reader support

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Modern web browser with PWA support
- Google Cloud Vision API key (optional for OCR)

### Installation

1. **Navigate to PWA directory**:
   ```bash
   cd pwa/
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment file**:
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**:
   ```bash
   # .env
   REACT_APP_VISION_API_KEY=your-google-vision-api-key
   REACT_APP_VISION_API_URL=https://vision.googleapis.com/v1
   ```

5. **Start development server**:
   ```bash
   npm start
   ```

6. **Build for production**:
   ```bash
   npm run build
   ```

7. **Serve production build**:
   ```bash
   npm run serve
   ```

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 with PWA capabilities
- **State Management**: React Context + Local Storage
- **Database**: IndexedDB with offline-first architecture
- **Styling**: CSS Modules with CSS Variables
- **Icons**: Custom icon system with fallbacks
- **Internationalization**: React i18next for multi-language support

### API Integration Stack
- **OCR**: Google Cloud Vision API (recommended)
- **AI Analysis**: Anthropic Claude 3.5 Sonnet
- **Nutrition Data**: USDA FoodData Central (free) + Edamam (enhanced)
- **Image Recognition**: Google Vision Product Search
- **Cost**: $4,069/month for 300k scans (500 users × 20 scans/day)

## 📁 Project Structure

```
LabelIQ-PWA/
├── public/
│   ├── icons/              # PWA icons (various sizes)
│   ├── manifest.json       # PWA manifest
│   └── sw.js              # Service worker
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── AppShell.js    # Main app shell
│   │   ├── SafetyBadge.js # Safety score display
│   │   ├── IngredientChip.js # Ingredient display
│   │   ├── CalorieTracker.js # Daily calorie tracking
│   │   └── SocialShareButton.js # Social sharing
│   ├── screens/           # Main application screens
│   │   ├── HomeScreen.js  # Landing page
│   │   ├── CameraScreen.js # Product scanning
│   │   ├── ResultsScreen.js # Analysis results
│   │   ├── ProfileScreen.js # User profile
│   │   ├── HistoryScreen.js # Scan history
│   │   └── HealthDashboard.js # Health insights
│   ├── services/          # Business logic and API integration
│   │   ├── APIIntegrationService.js # Central API management
│   │   ├── AdditivesDatabase.js # E-numbers database
│   │   ├── AdditiveAnalysisService.js # Additive analysis
│   │   ├── ScoringService.js # Health scoring engine
│   │   ├── DailyCalorieTracker.js # Calorie tracking
│   │   ├── SocialSharingService.js # Social sharing
│   │   ├── OfflineService.js # Offline functionality
│   │   └── LearningJourneyService.js # Educational content
│   ├── utils/             # Utility functions
│   │   ├── InstallPrompt.js # PWA installation
│   │   ├── imageUtils.js  # Image processing
│   │   └── constants.js   # App constants
│   ├── styles/           # Global styles
│   │   ├── App.css       # Main styles
│   │   └── variables.css # CSS variables
│   ├── locales/          # Internationalization (8 languages)
│   │   ├── en.json       # English translations (default)
│   │   ├── de.json       # German translations (Deutsch)
│   │   ├── fr.json       # French translations (Français)
│   │   ├── es.json       # Spanish translations (Español)
│   │   ├── nl.json       # Dutch translations (Nederlands)
│   │   ├── sv.json       # Swedish translations (Svenska)
│   │   ├── no.json       # Norwegian translations (Norsk)
│   │   └── pt.json       # Portuguese translations (Português)
│   └── tests/            # Test files
│       └── additive-test.js # Additive database tests
├── docs/                 # Documentation
│   └── API-Integration-Analysis.md # Comprehensive API guide
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## 🔍 Key Features Deep Dive

### Ingredient Analysis Engine

The app uses a sophisticated multi-layer analysis system:

1. **OCR Text Extraction**: Google Cloud Vision API extracts text from product labels
2. **AI-Powered Parsing**: Anthropic Claude analyzes and categorizes ingredients
3. **E-Numbers Database**: Comprehensive database of 300+ food additives with 2025 regulatory data
4. **Health Scoring**: Evidence-based safety scores considering EU/US regulatory differences
5. **Personalization**: Analysis adapted to user allergies, diet preferences, and health goals

### Additive Database Highlights

- **Latest 2025 Regulatory Data**: Including US federal food dye phase-outs and EU titanium dioxide ban
- **Controversial Additives**: BHA, BHT, artificial colors, preservatives with ongoing safety debates
- **Regulatory Differences**: Detailed EU vs US approval status and restrictions
- **Health Concerns**: Comprehensive list of potential health impacts and allergen information

### Progressive Web App Features

- **Offline-First**: Full functionality without internet connection
- **Installable**: Add to home screen on mobile devices
- **Fast Loading**: Service worker caching for instant load times
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Background Sync**: Queue scans when offline, sync when online

## 📊 Cost Analysis

### API Usage Costs (500 users × 20 scans/day = 300,000 scans/month)

| Service | Monthly Cost | Purpose |
|---------|--------------|---------|
| Google Cloud Vision | $450 | OCR and product recognition |
| Anthropic Claude 3.5 | $3,600 | AI ingredient analysis |
| USDA FoodData Central | $0 | Free nutrition database |
| Edamam API | $19 | Enhanced nutrition data |
| **Total** | **$4,069** | **Cost per scan: $0.0136** |

### Revenue Model
- **Freemium**: 5 scans/day free, unlimited for $9.99/month
- **Break-even**: 407 premium users (81% conversion rate)
- **Enterprise**: White-label solutions for food manufacturers

## 🔧 Key Technologies

- **React 18** - UI framework with hooks and concurrent features
- **React Router 6** - Client-side routing
- **IndexedDB (idb)** - Offline database storage
- **Service Workers** - Background sync and caching
- **Web APIs** - Camera, Notifications, File System Access
- **CSS Variables** - Theming and responsive design
- **Google Vision API** - OCR text extraction

## 📱 PWA Features

### Installation
The app can be installed on:
- **Mobile**: Add to Home Screen (iOS Safari, Android Chrome)
- **Desktop**: Install from browser address bar
- **All platforms**: Progressive enhancement

### Offline Functionality
- **Ingredient Database**: 300+ ingredients cached locally
- **Scan History**: Stored in IndexedDB
- **Image Processing**: Basic OCR fallback
- **Background Sync**: Queue operations for when online

### Performance
- **App Shell**: Instant loading with cached shell
- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: Progressive loading and caching
- **Service Worker**: Aggressive caching strategy

## 🛠️ Development

### Available Scripts
- `npm start` - Development server with hot reload
- `npm run build` - Production build
- `npm run serve` - Serve production build locally
- `npm test` - Run test suite
- `npm run lint` - ESLint code analysis

### Environment Configuration

Create `.env` file with:
```bash
# API Configuration
REACT_APP_VISION_API_KEY=your-google-vision-api-key
REACT_APP_VISION_API_URL=https://vision.googleapis.com/v1

# App Configuration
REACT_APP_APP_NAME=LabelIQ
REACT_APP_VERSION=1.0.0

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_ENABLE_SENTRY=false
```

### Testing PWA Features

1. **Service Worker**: Check Application tab in DevTools
2. **Offline Mode**: Use Network tab to simulate offline
3. **Installation**: Test on mobile and desktop browsers
4. **Performance**: Use Lighthouse PWA audit
5. **Notifications**: Test push notification delivery

## 🚀 Deployment

### Static Hosting (Recommended)
Deploy to any static hosting service:

1. **Netlify**:
   ```bash
   npm run build
   # Deploy dist folder to Netlify
   ```

2. **Vercel**:
   ```bash
   npm run build
   # Deploy with Vercel CLI
   ```

3. **GitHub Pages**:
   ```bash
   npm run build
   # Push build folder to gh-pages branch
   ```

### PWA Requirements for Production
- **HTTPS**: Required for service workers
- **Valid SSL Certificate**: For secure contexts
- **Proper MIME Types**: Ensure .json files served correctly
- **Cache Headers**: Configure for optimal performance

## 🔒 Security & Privacy

### Data Storage
- **Local Only**: All data stored on device
- **No Server**: No backend required
- **Privacy First**: No tracking or analytics by default
- **User Control**: Clear data functionality

### API Security
- **API Keys**: Store in environment variables
- **CORS**: Configure allowed origins
- **Rate Limiting**: Implement on API endpoints
- **Image Processing**: Client-side only

## 🌍 Internationalization

### Supported Languages (8 Total)
- **English** (en) - Default language with comprehensive translations
- **German** (de) - Deutsch - Full European market support
- **French** (fr) - Français - Complete localization
- **Spanish** (es) - Español - Global Spanish-speaking markets
- **Dutch** (nl) - Nederlands - Netherlands/Belgium support
- **Swedish** (sv) - Svenska - Nordic market coverage
- **Norwegian** (no) - Norsk - Complete Norwegian localization
- **Portuguese** (pt) - Português - Brazil/Portugal markets

### Implementation Features
- **Automatic Language Detection**: Browser language auto-detection with English fallback
- **Comprehensive Coverage**: All app sections fully translated including UI, safety scores, and additive database
- **Modular Architecture**: Separate JSON files for each language in `/src/locales/` directory
- **Development Support**: Debug mode for translation testing
- **Smart Fallbacks**: Graceful degradation to English for unsupported languages

### Adding New Languages
1. Create new translation file in `src/locales/[lang].json` following existing structure
2. Import the translation file in `src/utils/i18n.js`
3. Add language entry to `supportedLanguages` object with display names
4. Update language selector in ProfileScreen component
5. Test language switching and fallback behavior
6. For RTL languages, add CSS direction support

## 📊 Analytics & Monitoring

### Web Vitals
- **Core Web Vitals**: LCP, FID, CLS tracking
- **PWA Metrics**: Installation rates, offline usage
- **Performance**: Bundle size analysis
- **User Experience**: Error tracking

### Optional Integrations
- Google Analytics 4
- Sentry Error Monitoring
- Performance monitoring
- User feedback collection

## 👥 Development Team

**James Harvey Media** - Proprietary Software Development

This is a private, commercial software project developed by James Harvey Media for the intelligent food label analysis market.

## 📄 License

**PROPRIETARY SOFTWARE** - All Rights Reserved

Copyright (c) 2025 James Harvey Media. This software is proprietary and confidential.
Unauthorized reproduction, distribution, or use is strictly prohibited.

See LICENSE file for complete terms and restrictions.

## 🆘 Support

### Internal Documentation
- [API Integration Guide](docs/API-Integration-Analysis.md)
- [Additive Database Schema](src/services/AdditivesDatabase.js)

### Development Support
For development support and technical inquiries, contact James Harvey Media development team.

### Commercial Inquiries
For licensing and commercial partnership opportunities, contact James Harvey Media.

---

**LabelIQ PWA - Intelligent Food Analysis Technology**
**Developed by James Harvey Media**
**Proprietary & Confidential Software**