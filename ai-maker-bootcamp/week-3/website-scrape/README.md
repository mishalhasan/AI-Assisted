# Website Scraping Project

This project scrapes country data from https://www.scrapethissite.com/pages/simple/, saves it to a CSV file, and creates visualizations.

## Setup Instructions

### 1. Activate Virtual Environment

```bash
source venv/bin/activate
```

### 2. Install Required Packages

```bash
pip install -r requirements.txt
```

Or install individually:
```bash
pip install requests beautifulsoup4 pandas matplotlib
```

### 3. Run the Script

```bash
python scrape_and_visualize.py
```

## Output Files

- `countries_data.csv` - CSV file containing all scraped country data
- `countries_visualization.png` - Visualization charts saved as PNG image

## Data Structure

The CSV file contains the following columns:
- **Name**: Country name
- **Capital**: Capital city
- **Population**: Population count
- **Area (sq km)**: Area in square kilometers

## Visualizations

The script creates 4 visualizations:
1. Top 10 Countries by Population
2. Top 10 Countries by Area
3. Population vs Area Scatter Plot
4. Top 10 Countries by Population Density

