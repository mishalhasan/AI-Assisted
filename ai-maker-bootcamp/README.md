# AI Maker Bootcamp

Welcome to the AI Maker Bootcamp repository! This repository contains all projects completed during the bootcamp, organized by week. Each project demonstrates different skills and technologies learned throughout the program.

## 📚 Table of Contents

- [Week 1: Frontend Fundamentals](#week-1-frontend-fundamentals)
- [Week 2: Full-Stack Development](#week-2-full-stack-development)
- [Week 3: Python & Data Processing](#week-3-python--data-processing)
- [Week 4: AI Agents & Microservices](#week-4-ai-agents--microservices)
- [Week 5: Chrome Extensions](#week-5-chrome-extensions)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)

---

## Week 1: Frontend Fundamentals

Projects focused on HTML, CSS, and vanilla JavaScript fundamentals.

### 📱 Calculator
A fashion-themed calculator application with a modern UI and style recommendations feature.

**Features:**
- Basic arithmetic operations
- Fashion-themed design with multiple background themes
- Style recommendation feature ("Style Me")
- Responsive design

**Location:** `week-1/calculator/`

**Tech Stack:** HTML5, CSS3, JavaScript (Vanilla)

---

### 🎓 Codecademy Clone
A clone of the Codecademy landing page showcasing AI bootcamp courses.

**Features:**
- Responsive navigation bar
- Hero section with call-to-action
- Course cards and features section
- Modern UI design matching Codecademy's style

**Location:** `week-1/codecademy-clone/`

**Tech Stack:** HTML5, CSS3, JavaScript (Vanilla)

---

### 🖼️ Image Gallery
A beautiful image gallery with filtering capabilities.

**Features:**
- Filter images by category (All, Portrait, Street, Editorial)
- Responsive grid layout
- Smooth transitions and animations
- Modern, minimal design

**Location:** `week-1/image-gallery/`

**Tech Stack:** HTML5, CSS3, JavaScript (Vanilla)

---

## Week 2: Full-Stack Development

Projects focused on building full-stack applications with modern frameworks.

### 📝 AI Note Taker
A full-stack note-taking application with AI integration, authentication, and rich text editing.

**Features:**
- User authentication with Clerk
- AI-powered note generation and summarization
- Rich text editing capabilities
- Speech-to-text functionality
- Section-based organization
- Dashboard with note management
- Admin panel for user management

**Location:** `week-2/ai-note-taker/`

**Tech Stack:** Next.js, TypeScript, Prisma, Clerk, OpenAI API

**Setup:**
```bash
cd week-2/ai-note-taker
npm install
npm run dev
```

---

## Week 3: Python & Data Processing

Projects focused on Python programming, data manipulation, and automation.

### 📊 CSV to Graphs
Visualizes key trends in an HR dataset using Python.

**Features:**
- 9 different visualizations showing key HR trends
- Department distribution analysis
- Salary and performance analysis
- Employee engagement insights

**Location:** `week-3/csv-to-graphs/`

**Tech Stack:** Python, Pandas, Matplotlib, Seaborn

**Setup:**
```bash
cd week-3/csv-to-graphs
source venv/bin/activate
pip install -r requirements.txt
python visualize_hr_data.py
```

---

### 🐦 Flappy Bird Game
A Mario Kart-themed Flappy Bird game built with Python and Pygame.

**Features:**
- Classic Flappy Bird gameplay
- Mario Kart-themed graphics and sounds
- High score tracking
- Configurable game settings

**Location:** `week-3/flappy-bird/`

**Tech Stack:** Python, Pygame

**Setup:**
```bash
cd week-3/flappy-bird
source venv/bin/activate
pip install -r requirements.txt
python main.py
# or use the run script
./run.sh
```

---

### 📈 Multiple to Single CSV
Combines multiple CSV files into a single consolidated file.

**Features:**
- Automatically finds all CSV files in directory
- Combines data while preserving structure
- Handles duplicate headers intelligently
- Generates summary statistics

**Location:** `week-3/multiple-to-single-csv/`

**Tech Stack:** Python, Pandas

**Setup:**
```bash
cd week-3/multiple-to-single-csv
source venv/bin/activate
pip install pandas
python combine_csv.py
```

---

### 📁 Organize Folders Auto
Automatically organizes files by type into separate folders.

**Features:**
- Categorizes files by extension (images, PDFs, videos, other)
- Creates organized folder structure
- Preserves file integrity
- Handles multiple file types

**Location:** `week-3/organize-folders-auto/`

**Tech Stack:** Python

**Setup:**
```bash
cd week-3/organize-folders-auto
source venv/bin/activate
pip install -r other/requirements.txt
python organize_files.py
```

---

### 🌐 Website Scrape
Scrapes country data from websites and creates visualizations.

**Features:**
- Web scraping with BeautifulSoup
- Data export to CSV
- Multiple data visualizations
- Population and area analysis

**Location:** `week-3/website-scrape/`

**Tech Stack:** Python, Requests, BeautifulSoup4, Pandas, Matplotlib

**Setup:**
```bash
cd week-3/website-scrape
source venv/bin/activate
pip install -r requirements.txt
python scrape_and_visualize.py
```

---

## Week 4: AI Agents & Microservices

Projects focused on AI agents, microservices architecture, and containerization.

### 🤖 Newsletter Crew
A multi-agent AI system using CrewAI to generate newsletters.

**Features:**
- Multi-agent collaboration
- Automated newsletter generation
- Research and content creation
- Configurable agents and tasks

**Location:** `week-4/agents/newsletter_crew/`

**Tech Stack:** Python, CrewAI, OpenAI API, UV

**Setup:**
```bash
cd week-4/agents/newsletter_crew
crewai install
crewai run
```

**Note:** Requires `OPENAI_API_KEY` in `.env` file

---

### 🎭 Joke API Microservice
A FastAPI microservice that serves random jokes via HTTP API.

**Features:**
- RESTful API endpoints
- Random joke generation
- Health check endpoint
- Interactive API documentation (Swagger UI)
- Dockerized for easy deployment

**Location:** `week-4/microservice/`

**Tech Stack:** Python, FastAPI, Docker

**Setup with Docker:**
```bash
cd week-4/microservice
docker compose up --build
```

**Setup with Python:**
```bash
cd week-4/microservice
source venv/bin/activate
pip install -r requirements.txt
python joke.py
```

**API Endpoints:**
- `GET /joke` - Get a random joke
- `GET /jokes` - Get all available jokes
- `GET /health` - Health check
- `GET /docs` - Interactive API documentation

---

## Week 5: Chrome Extensions

Projects focused on building browser extensions with React and modern web technologies.

### 🎈 AI Bubbles
A fun and interactive Chrome extension that adds animated, colorful bubbles to any webpage.

**Features:**
- Animated bubbles with 12 vibrant colors
- Interactive popup interface
- Floating button on web pages
- Smooth animations with randomized properties
- Non-intrusive design

**Location:** `week-5/ai-bubbles/`

**Tech Stack:** React, Webpack, Chrome Extension Manifest V3, CSS Animations

**Setup:**
```bash
cd week-5/ai-bubbles/codecademy-chrome-boiler-template
npm install
npm start
```

**Installation:**
1. Build the extension: `npm run build`
2. Load `build` folder in Chrome via `chrome://extensions/`
3. Click extension icon or floating button to create bubbles

---

### 🤖 AI Summary (ExplainAIx)
An AI-powered Chrome extension that summarizes webpage content with a single click.

**Features:**
- AI-powered summaries using GPT-4o-mini
- One-click summarization
- Save summaries for later reference
- Copy & share functionality
- Secure API key storage
- Modern UI with Shadow DOM isolation

**Location:** `week-5/ai-summary/`

**Tech Stack:** React, Webpack, OpenAI API, Chrome Extension Manifest V3

**Setup:**
```bash
cd week-5/ai-summary/codecademy-chrome-boiler-template
npm install
npm run build
```

**Installation:**
1. Build the extension: `npm run build`
2. Load `build` folder in Chrome via `chrome://extensions/`
3. Configure OpenAI API key in extension popup
4. Click circular button on any webpage to generate summary

**Note:** Requires OpenAI API key (get one at [platform.openai.com](https://platform.openai.com/api-keys))

---

## Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla)
- Next.js
- TypeScript
- React

### Backend
- Node.js
- Python
- FastAPI
- Prisma ORM

### Data & AI
- Pandas
- Matplotlib
- Seaborn
- OpenAI API
- CrewAI

### Tools & Services
- Git & GitHub
- Docker
- Clerk (Authentication)
- BeautifulSoup4
- Pygame
- Webpack
- Chrome Extension APIs

---

## Getting Started

### Prerequisites

- **Node.js** (v18+ for Next.js projects)
- **Python** (v3.10+)
- **Git**
- **Docker** (optional, for microservices)

### Running Projects

1. **Frontend Projects (Week 1):**
   ```bash
   cd week-1/[project-name]
   open index.html
   ```

2. **Full-Stack Projects (Week 2):**
   ```bash
   cd week-2/[project-name]
   npm install
   npm run dev
   ```

3. **Python Projects (Week 3 & 4):**
   ```bash
   cd week-[n]/[project-name]
   source venv/bin/activate
   pip install -r requirements.txt
   python [main-file].py
   ```

4. **Chrome Extension Projects (Week 5):**
   ```bash
   cd week-5/[project-name]/codecademy-chrome-boiler-template
   npm install
   npm run build
   # Then load the 'build' folder in Chrome via chrome://extensions/
   ```

### Project Structure

```
ai-maker-bootcamp/
├── week-1/              # Frontend fundamentals
│   ├── calculator/
│   ├── codecademy-clone/
│   └── image-gallery/
├── week-2/              # Full-stack development
│   └── ai-note-taker/
├── week-3/              # Python & data processing
│   ├── csv-to-graphs/
│   ├── flappy-bird/
│   ├── multiple-to-single-csv/
│   ├── organize-folders-auto/
│   └── website-scrape/
├── week-4/              # AI agents & microservices
│   ├── agents/
│   │   └── newsletter_crew/
│   └── microservice/
└── week-5/              # Chrome extensions
    ├── ai-bubbles/
    └── ai-summary/
```

---

## 📝 Notes

- Each project is self-contained with its own dependencies
- Virtual environments are used for Python projects
- Large media files (videos) are excluded from git tracking
- Check individual project READMEs for detailed setup instructions

---

## 🚀 Future Projects

This repository will continue to be updated as new projects are completed during the bootcamp.

---

## 📄 License

This repository contains educational projects completed during the AI Maker Bootcamp.

---

## 👤 Author

Created as part of the AI Maker Bootcamp program.

