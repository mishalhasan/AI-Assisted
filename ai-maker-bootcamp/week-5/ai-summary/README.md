# ExplainAIx - AI-Powered Webpage Summarizer

ExplainAIx is a Chrome extension that uses AI to summarize webpage content with a single click. Built with React, Webpack, and OpenAI's GPT-4o-mini model.

## Features

- 🤖 **AI-Powered Summaries**: Uses OpenAI's GPT-4o-mini model to generate concise, informative summaries
- 🎯 **One-Click Summarization**: Circular button appears on any webpage for instant summarization
- 💾 **Save Summaries**: Save summaries for later reference in the extension popup
- 📋 **Copy & Share**: Copy summaries to clipboard or share using Web Share API
- 🔒 **Secure API Key Storage**: API keys stored locally in Chrome's secure storage
- 🎨 **Modern UI**: Clean, Shadcn-inspired design with Shadow DOM isolation
- 📱 **Responsive**: Works seamlessly on desktop and mobile browsers

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Chrome browser
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-summary/codecademy-chrome-boiler-template
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the extension**
   ```bash
   npm run build
   ```

4. **Load the extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right)
   - Click "Load unpacked"
   - Select the `build` folder from the project directory

5. **Configure API Key**
   - Click the extension icon in Chrome's toolbar
   - Click "Add OpenAI API Key"
   - Enter your OpenAI API key (starts with `sk-`)
   - Click "Save"

## Usage

1. **Generate a Summary**
   - Visit any webpage
   - Click the circular purple button in the top-right corner
   - Wait for the AI to generate the summary
   - View the summary in the dialog

2. **Save a Summary**
   - After generating a summary, click the "Save" button
   - The summary will be saved to your extension popup

3. **View Saved Summaries**
   - Click the extension icon in Chrome's toolbar
   - Browse your saved summaries
   - Click on a summary title to open the original page
   - Click "Remove" to delete a saved summary

4. **Share a Summary**
   - Click the "Share" button in the summary dialog
   - On supported devices/browsers, the native share dialog will appear
   - Otherwise, the summary will be copied to your clipboard

5. **Copy a Summary**
   - Click the "Copy Summary" button
   - The formatted summary will be copied to your clipboard

## Project Structure

```
codecademy-chrome-boiler-template/
├── src/
│   ├── pages/
│   │   ├── Background/        # Background service worker (OpenAI API calls)
│   │   ├── Content/           # Content script (button & dialog injection)
│   │   └── Popup/             # Extension popup UI (React)
│   ├── assets/                # Icons and images
│   └── manifest.json          # Extension manifest
├── build/                     # Built extension files (load this in Chrome)
├── webpack.config.js          # Webpack configuration
└── package.json               # Dependencies and scripts
```

## Technical Details

### Architecture

- **Content Script**: Injects a circular button and dialog into webpages using Shadow DOM for complete isolation
- **Background Script**: Handles OpenAI API calls using the GPT-4o-mini model
- **Popup**: React-based UI for managing API keys and viewing saved summaries
- **Storage**: Uses Chrome's `chrome.storage.local` API for secure data storage

### Key Technologies

- **React 18**: UI framework for the popup
- **Webpack 5**: Module bundler
- **OpenAI SDK**: For AI summarization
- **Shadow DOM**: Ensures UI isolation from host page styles/scripts
- **Chrome Extension Manifest V3**: Latest extension API

### API Model

The extension uses **GPT-4o-mini** for summarization, configured in `src/pages/Background/index.js`. This model provides a good balance between quality and cost-effectiveness.

## Development

### Build Commands

```bash
# Development build with hot reload
npm start

# Production build
npm run build

# Format code
npm run prettier
```

### Development Workflow

1. Make changes to source files in `src/`
2. Run `npm run build` to compile
3. Reload the extension in `chrome://extensions/`
4. Test your changes

## Permissions

The extension requires the following permissions:

- **storage**: To save summaries and API keys locally
- **tabs**: To open original pages from saved summaries

## Browser Compatibility

- Chrome (recommended)
- Edge (Chromium-based)
- Other Chromium-based browsers

## Security

- API keys are stored locally using Chrome's secure storage API
- No data is sent to third-party servers except OpenAI
- All UI elements are isolated using Shadow DOM
- Extension follows Chrome Extension security best practices

## Troubleshooting

### Button Not Appearing
- Ensure the extension is enabled in `chrome://extensions/`
- Reload the extension after building
- Refresh the webpage
- Check browser console for errors (F12)

### API Key Not Working
- Verify your API key is correct and starts with `sk-`
- Ensure you have credits in your OpenAI account
- Check the browser console for API errors
- Try removing and re-adding the API key

### Summaries Not Generating
- Check your OpenAI API key is configured
- Verify you have internet connectivity
- Check browser console for error messages
- Ensure the page has readable text content

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Built on the [Chrome Extension Boilerplate](https://github.com/lxieyang/chrome-extension-boilerplate-react)
- Uses OpenAI's GPT-4o-mini model for summarization
- UI inspired by Shadcn design system

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

**Made with ❤️ for efficient web browsing**

