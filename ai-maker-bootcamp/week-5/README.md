# Week 5 Projects - AI Maker Bootcamp

This folder contains the projects completed during Week 5 of the AI Maker Bootcamp, focusing on Chrome extension development with React and modern web technologies.

## Projects

### 🎈 AI Bubbles

A fun and interactive Chrome extension that adds animated, colorful bubbles to any webpage.

**Features:**
- **Animated Bubbles** - Creates 15 colorful bubbles that float up from the bottom
- **Interactive Popup** - Click the extension icon to trigger bubbles from popup interface
- **Floating Button** - Convenient floating button appears on web pages for quick access
- **12 Vibrant Colors** - Each bubble randomly colored from a palette of 12 beautiful colors
- **Smooth Animations** - Randomized sizes, speeds, and delays for natural movement
- **Non-Intrusive** - Bubbles automatically clean up after animation completes

**Technologies:** React 18, Webpack 5, Chrome Extension Manifest V3, CSS Animations

**Location:** `ai-bubbles/`

**Setup:**
```bash
cd ai-bubbles/codecademy-chrome-boiler-template
npm install
npm start
```

**Installation:**
1. Build the extension: `npm run build`
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right)
4. Click "Load unpacked"
5. Select the `build` folder from the project directory
6. Click the extension icon or floating button to create bubbles!

**Project Structure:**
- `src/pages/Popup/` - React-based popup interface
- `src/pages/Content/` - Content script that injects bubbles on web pages
- `src/pages/Background/` - Background service worker
- `build/` - Compiled extension files (load this in Chrome)

---

### 🤖 AI Summary (ExplainAIx)

An AI-powered Chrome extension that summarizes webpage content with a single click using OpenAI's GPT-4o-mini model.

**Features:**
- **AI-Powered Summaries** - Uses GPT-4o-mini to generate concise, informative summaries
- **One-Click Summarization** - Circular button appears on any webpage for instant summarization
- **Save Summaries** - Save summaries for later reference in the extension popup
- **Copy & Share** - Copy summaries to clipboard or share using Web Share API
- **Secure API Key Storage** - API keys stored locally in Chrome's secure storage
- **Modern UI** - Clean, Shadcn-inspired design with Shadow DOM isolation
- **Responsive** - Works seamlessly on desktop and mobile browsers

**Technologies:** React 18, Webpack 5, OpenAI API, Chrome Extension Manifest V3, Shadow DOM

**Location:** `ai-summary/`

**Setup:**
```bash
cd ai-summary/codecademy-chrome-boiler-template
npm install
npm run build
```

**Installation:**
1. Build the extension: `npm run build`
2. Load `build` folder in Chrome via `chrome://extensions/`
3. Click the extension icon and configure your OpenAI API key
4. Visit any webpage and click the circular purple button to generate a summary

**API Key Setup:**
- Get an API key from [OpenAI Platform](https://platform.openai.com/api-keys)
- Enter the key in the extension popup (starts with `sk-`)
- The key is stored securely using Chrome's storage API

**Usage:**
- Click the circular button on any webpage to generate a summary
- Save summaries for later reference
- Copy or share summaries with one click
- View all saved summaries in the extension popup

**Project Structure:**
- `src/pages/Popup/` - React-based popup UI for managing API keys and saved summaries
- `src/pages/Content/` - Content script that injects button and dialog using Shadow DOM
- `src/pages/Background/` - Background service worker handling OpenAI API calls
- `src/pages/Dialog/` - Summary dialog component

---

## Technologies Used

- **React 18** - Modern React with hooks for UI components
- **Webpack 5** - Module bundling and build tool
- **Chrome Extension Manifest V3** - Latest Chrome extension API
- **OpenAI API** - AI-powered summarization (for AI Summary project)
- **CSS Animations** - Smooth animations and transitions
- **Shadow DOM** - UI isolation from host page styles/scripts
- **Chrome Storage API** - Secure local data storage

## Getting Started

Each project in this folder is a Chrome extension built with React and Webpack.

### General Setup Steps:

1. **Navigate to project directory:**
   ```bash
   cd week-5/[project-name]/codecademy-chrome-boiler-template
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the extension:**
   ```bash
   npm run build
   ```

4. **Load in Chrome:**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right)
   - Click "Load unpacked"
   - Select the `build` folder from the project directory

5. **Test the extension:**
   - Click the extension icon in Chrome's toolbar
   - Visit any webpage and interact with the extension

### Development Workflow

For development with hot reload:
```bash
npm start
```

This watches for file changes and automatically rebuilds the extension. Reload the extension in `chrome://extensions/` after changes.

## Project Structure

```
week-5/
├── ai-bubbles/
│   └── codecademy-chrome-boiler-template/
│       ├── src/
│       │   ├── pages/
│       │   │   ├── Popup/        # React popup interface
│       │   │   ├── Content/       # Content script (bubble injection)
│       │   │   └── Background/    # Background service worker
│       │   └── manifest.json      # Extension manifest
│       └── build/                 # Compiled extension (load this)
└── ai-summary/
    └── codecademy-chrome-boiler-template/
        ├── src/
        │   ├── pages/
        │   │   ├── Popup/        # React popup UI
        │   │   ├── Content/      # Content script (button & dialog)
        │   │   ├── Dialog/       # Summary dialog component
        │   │   └── Background/   # OpenAI API calls
        │   └── manifest.json     # Extension manifest
        └── build/                 # Compiled extension (load this)
```

## Notes

- **Build Output**: Always load the `build` folder in Chrome, not the `src` folder
- **Developer Mode**: Must be enabled in Chrome to load unpacked extensions
- **API Keys**: AI Summary requires an OpenAI API key (get one at platform.openai.com)
- **Permissions**: Extensions may require specific permissions (storage, tabs, etc.)
- **Hot Reload**: Use `npm start` for development, then reload extension after changes
- **Production Build**: Use `npm run build` for production-ready builds

## Browser Compatibility

- **Chrome** (recommended)
- **Edge** (Chromium-based)
- **Other Chromium-based browsers**

## Troubleshooting

### Extension Not Loading
- Ensure you're loading the `build` folder, not `src`
- Check that Developer mode is enabled
- Verify all dependencies are installed (`npm install`)

### Build Errors
- Ensure Node.js version is >= 18
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check for syntax errors in source files

### Extension Not Working
- Reload the extension in `chrome://extensions/`
- Refresh the webpage
- Check browser console (F12) for errors
- Verify extension is enabled

### API Key Issues (AI Summary)
- Verify API key is correct and starts with `sk-`
- Ensure you have credits in your OpenAI account
- Check browser console for API errors
- Try removing and re-adding the API key

## Security

- API keys are stored locally using Chrome's secure storage API
- No data is sent to third-party servers except OpenAI (for AI Summary)
- All UI elements are isolated using Shadow DOM
- Extensions follow Chrome Extension security best practices

Check individual project READMEs for detailed setup instructions and specific requirements.

