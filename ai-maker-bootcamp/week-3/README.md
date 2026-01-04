# Week 3 Projects - AI Maker Bootcamp

This folder contains the projects completed during Week 3 of the AI Maker Bootcamp, focusing on Python programming, data processing, automation, and game development.

## Projects

### 📊 CSV to Graphs

Visualizes key trends in an HR dataset using Python and data visualization libraries.

**Features:**
- 9 different visualizations showing key HR trends
- Department distribution analysis
- Salary and performance analysis
- Employee engagement insights
- Export visualizations as PNG

**Technologies:** Python, Pandas, Matplotlib, Seaborn, NumPy

**Location:** `csv-to-graphs/`

**Setup:**
```bash
cd csv-to-graphs
source venv/bin/activate
pip install -r requirements.txt
python visualize_hr_data.py
```

**Output:** `hr_visualizations.png` - High-resolution image with all visualizations

---

### 🐦 Flappy Bird Game

A Mario Kart-themed Flappy Bird game built with Python and Pygame.

**Features:**
- Classic Flappy Bird gameplay mechanics
- Mario Kart-themed graphics and sounds
- High score tracking system
- Configurable game settings
- Smooth animations and controls

**Technologies:** Python, Pygame

**Location:** `flappy-bird/`

**Setup:**
```bash
cd flappy-bird
source venv/bin/activate
pip install -r requirements.txt
python main.py
# or use the run script
./run.sh
```

**Game Files:**
- `main.py` - Entry point
- `game.py` - Main game logic
- `config.json` - Game configuration
- `settings.json` - User settings
- `high_score.json` - High score storage
- `asssets/` - Images and sound assets

**Note:** Sound files (.wav) are included for game functionality. Video files are excluded from git tracking.

**Documentation:** See `flappy-bird/README.md` for detailed game instructions, controls, and customization options.

---

### 📈 Multiple to Single CSV

Combines multiple CSV files into a single consolidated file with intelligent header handling.

**Features:**
- Automatically finds all CSV files in directory
- Combines data while preserving structure
- Handles duplicate headers intelligently
- Generates summary statistics
- Filters out output file automatically

**Technologies:** Python, Pandas

**Location:** `multiple-to-single-csv/`

**Setup:**
```bash
cd multiple-to-single-csv
source venv/bin/activate
pip install pandas
python combine_csv.py
```

**Usage:**
Place multiple CSV files in the directory and run the script. The combined output will be saved as `combined_output.csv`.

**Note:** Large CSV files are excluded from git tracking. Sample files are included for demonstration.

**Documentation:** See `multiple-to-single-csv/README.md` for detailed usage examples and customization options.

---

### 📁 Organize Folders Auto

Automatically organizes files by type into separate folders for better file management.

**Features:**
- Categorizes files by extension (images, PDFs, videos, other)
- Creates organized folder structure automatically
- Preserves file integrity during organization
- Handles multiple file types intelligently
- Moves files to appropriate folders

**Technologies:** Python, Pathlib

**Location:** `organize-folders-auto/`

**Setup:**
```bash
cd organize-folders-auto
source venv/bin/activate
pip install -r other/requirements.txt
python organize_files.py
```

**File Categories:**
- **Images:** `.jpg`, `.jpeg`, `.png`, `.gif`, `.bmp`, `.tiff`, `.webp`, `.svg`
- **PDFs:** `.pdf`
- **Videos:** `.mp4`, `.mov`, `.avi`, `.mkv`, `.wmv`, `.flv`, `.webm`, `.m4v`, `.3gp`
- **Other:** All other file types

**Note:** Video files and large media files are excluded from git tracking to keep repository size manageable.

**Documentation:** See `organize-folders-auto/README.md` for detailed usage instructions and customization guide.

---

### 🌐 Website Scrape

Scrapes country data from websites and creates visualizations.

**Features:**
- Web scraping with BeautifulSoup
- Data export to CSV format
- Multiple data visualizations
- Population and area analysis
- Top countries by various metrics

**Technologies:** Python, Requests, BeautifulSoup4, Pandas, Matplotlib

**Location:** `website-scrape/`

**Setup:**
```bash
cd website-scrape
source venv/bin/activate
pip install -r requirements.txt
python scrape_and_visualize.py
```

**Output Files:**
- `countries_data.csv` - CSV file containing all scraped country data
- `countries_visualization.png` - Visualization charts saved as PNG image

**Visualizations:**
1. Top 10 Countries by Population
2. Top 10 Countries by Area
3. Population vs Area Scatter Plot
4. Top 10 Countries by Population Density

---

## Technologies Used

- **Python 3.10+** - Programming language
- **Pandas** - Data manipulation and analysis
- **Matplotlib** - Data visualization
- **Seaborn** - Statistical data visualization
- **BeautifulSoup4** - Web scraping
- **Requests** - HTTP library
- **Pygame** - Game development
- **NumPy** - Numerical computing

## Getting Started

Each project in this folder is self-contained with its own virtual environment and dependencies.

### General Setup Steps:

1. **Navigate to project directory:**
   ```bash
   cd week-3/[project-name]
   ```

2. **Activate virtual environment:**
   ```bash
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the project:**
   ```bash
   python [main-file].py
   ```

## Project Structure

```
week-3/
├── csv-to-graphs/              # HR data visualization
│   ├── visualize_hr_data.py
│   ├── sample_hr_dataset.csv
│   └── requirements.txt
├── flappy-bird/                # Game development
│   ├── main.py
│   ├── game.py
│   ├── config.json
│   └── asssets/
│       ├── images/
│       └── sounds/
├── multiple-to-single-csv/     # Data processing
│   ├── combine_csv.py
│   └── *.csv (sample files)
├── organize-folders-auto/      # File organization
│   ├── organize_files.py
│   ├── images/
│   ├── pdfs/
│   └── videos/
└── website-scrape/             # Web scraping
    ├── scrape_and_visualize.py
    ├── countries_data.csv
    └── requirements.txt
```

## Notes

- **Virtual Environments:** Each project uses its own virtual environment (`venv/`)
- **Large Files:** Video files (`.mp4`, `.mov`) are excluded from git tracking
- **Sound Files:** Small sound files (<1MB) are included for game functionality
- **Data Files:** Large CSV files are excluded; sample files are included
- **Output Files:** Generated visualizations and combined outputs are tracked
- **Python Version:** Projects require Python 3.10 or higher

## File Exclusions

The following file types are excluded from git tracking:
- Video files: `.mp4`, `.mov`, `.avi`, `.mkv`, etc.
- Large sound files: `.wav`, `.mp3` (if >1MB)
- Large data files: Most `.csv` files (except samples)
- Virtual environments: `venv/`, `env/`
- Python cache: `__pycache__/`, `*.pyc`

Check individual project READMEs for detailed setup instructions and specific requirements.

