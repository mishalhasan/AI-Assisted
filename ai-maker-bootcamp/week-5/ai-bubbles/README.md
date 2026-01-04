# AI Bubbles Chrome Extension

A fun and interactive Chrome extension that adds animated, colorful bubbles to any webpage! Click the extension icon or use the floating button on web pages to create beautiful bubble animations.

## 🎈 Features

- **Animated Bubbles**: Creates 15 colorful bubbles that float up from the bottom of the page
- **Interactive Popup**: Click the extension icon to trigger bubbles from the popup interface
- **Floating Button**: A convenient floating button appears on web pages for quick bubble access
- **12 Vibrant Colors**: Each bubble is randomly colored from a palette of 12 beautiful colors
- **Smooth Animations**: Bubbles have randomized sizes, speeds, and delays for natural movement
- **Non-Intrusive**: Bubbles automatically clean up after animation completes

## 🚀 Getting Started

### Prerequisites

- Node.js version >= 18
- Chrome browser (or any Chromium-based browser)

### Installation

1. Clone or download this repository
2. Navigate to the project directory:
   ```bash
   cd codecademy-chrome-boiler-template
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Development

1. Start the development server:
   ```bash
   npm start
   ```
   This will watch for file changes and automatically rebuild the extension.

2. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in the top right)
   - Click "Load unpacked"
   - Select the `build` folder from the project directory

3. Test the extension:
   - Click the extension icon in your Chrome toolbar
   - Click the "Pop!" button in the popup
   - Visit any webpage and look for the floating "🎈 Pop!" button
   - Click it to create bubbles on the page!

### Building for Production

To create a production-ready build:

```bash
NODE_ENV=production npm run build
```

The `build` folder will contain the extension ready for distribution or submission to the Chrome Web Store.

## 📁 Project Structure

```
codecademy-chrome-boiler-template/
├── src/
│   ├── assets/img/          # Extension icons and logos
│   ├── containers/          # React components
│   │   └── Greetings/
│   ├── pages/
│   │   ├── Background/      # Background script
│   │   ├── Content/         # Content script (injects bubbles on web pages)
│   │   └── Popup/           # Popup interface
│   └── manifest.json        # Chrome extension manifest
├── build/                   # Compiled extension (generated)
├── utils/                   # Build and development utilities
└── webpack.config.js        # Webpack configuration
```

## 🎨 How It Works

1. **Popup Component** (`src/pages/Popup/Popup.jsx`):
   - Displays a React-based popup interface
   - Contains a "Pop!" button that triggers bubble creation
   - Sends messages to the content script to create bubbles on the active tab

2. **Content Script** (`src/pages/Content/index.js`):
   - Injected into web pages
   - Creates animated bubble elements dynamically
   - Adds a floating button to web pages for easy access
   - Listens for messages from the popup to trigger bubbles

3. **Bubble Animation**:
   - Each bubble has randomized properties:
     - Size: 15-55px
     - Position: Random horizontal position
     - Duration: 2-4 seconds
     - Delay: 0-0.3 seconds
     - Color: Random selection from 12 vibrant colors

## 🛠️ Technologies Used

- **React 18**: Modern React with hooks
- **Webpack 5**: Module bundling and build tool
- **Chrome Extension Manifest V3**: Latest Chrome extension API
- **CSS Animations**: Smooth bubble floating animations
- **JavaScript ES6+**: Modern JavaScript features

## 📝 Customization

### Changing Bubble Colors

Edit the `colors` array in:
- `src/pages/Popup/Popup.jsx` (for popup bubbles)
- `src/pages/Content/index.js` (for webpage bubbles)

### Adjusting Bubble Count

Change the `bubbleCount` variable in both files (default is 15).

### Modifying Animation Speed

Adjust the `duration` calculation in the bubble creation functions.

## 🐛 Troubleshooting

- **Bubbles not appearing**: Make sure the extension is loaded and the page has finished loading
- **Build errors**: Ensure Node.js version is >= 18 and all dependencies are installed
- **Extension not loading**: Check that you're loading the `build` folder, not the `src` folder

## 📄 License

This project is part of the AI Maker Bootcamp Week 5 assignment.

## 🙏 Acknowledgments

Built using the [Chrome Extension Boilerplate with React](https://github.com/lxieyang/chrome-extension-boilerplate-react) as a foundation.

---

**Enjoy popping bubbles! 🎈✨**

