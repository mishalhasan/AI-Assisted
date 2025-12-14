import requests
from bs4 import BeautifulSoup
import pandas as pd
import matplotlib.pyplot as plt

def scrape_countries_data():
    """Scrape country data from scrapethissite.com"""
    url = 'https://www.scrapethissite.com/pages/simple/'
    
    print("Fetching data from the website...")
    response = requests.get(url)
    response.raise_for_status()  # Raise an error if the request failed
    
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Extract country data
    countries = []
    country_divs = soup.find_all('div', class_='col-md-4 country')
    
    print(f"Found {len(country_divs)} countries")
    
    for country_div in country_divs:
        try:
            name = country_div.find('h3', class_='country-name').get_text(strip=True)
            capital = country_div.find('span', class_='country-capital').get_text(strip=True)
            population_text = country_div.find('span', class_='country-population').get_text(strip=True)
            area_text = country_div.find('span', class_='country-area').get_text(strip=True)
            
            # Clean and convert population and area
            population = int(population_text.replace(',', ''))
            area = float(area_text.replace(',', ''))
            
            countries.append({
                'Name': name,
                'Capital': capital,
                'Population': population,
                'Area (sq km)': area
            })
        except Exception as e:
            print(f"Error processing a country: {e}")
            continue
    
    return countries

def save_to_csv(data, filename='countries_data.csv'):
    """Save data to CSV file"""
    df = pd.DataFrame(data)
    df.to_csv(filename, index=False)
    print(f"\nData saved to {filename}")
    print(f"Total records: {len(df)}")
    return df

def create_visualizations(df):
    """Create visualizations from the data"""
    # Create figure with subplots
    fig, axes = plt.subplots(2, 2, figsize=(15, 12))
    fig.suptitle('Country Data Visualizations', fontsize=16, fontweight='bold')
    
    # 1. Top 10 countries by population
    top_pop = df.nlargest(10, 'Population')
    axes[0, 0].barh(top_pop['Name'], top_pop['Population'] / 1e6, color='steelblue')
    axes[0, 0].set_xlabel('Population (millions)')
    axes[0, 0].set_title('Top 10 Countries by Population')
    axes[0, 0].invert_yaxis()
    axes[0, 0].grid(axis='x', alpha=0.3)
    
    # 2. Top 10 countries by area
    top_area = df.nlargest(10, 'Area (sq km)')
    axes[0, 1].barh(top_area['Name'], top_area['Area (sq km)'] / 1e6, color='forestgreen')
    axes[0, 1].set_xlabel('Area (million sq km)')
    axes[0, 1].set_title('Top 10 Countries by Area')
    axes[0, 1].invert_yaxis()
    axes[0, 1].grid(axis='x', alpha=0.3)
    
    # 3. Population vs Area scatter plot
    axes[1, 0].scatter(df['Area (sq km)'], df['Population'], alpha=0.6, s=50, color='coral')
    axes[1, 0].set_xlabel('Area (sq km)')
    axes[1, 0].set_ylabel('Population')
    axes[1, 0].set_title('Population vs Area')
    axes[1, 0].set_xscale('log')
    axes[1, 0].set_yscale('log')
    axes[1, 0].grid(True, alpha=0.3)
    
    # 4. Population density (calculated)
    df['Density'] = df['Population'] / df['Area (sq km)']
    top_density = df.nlargest(10, 'Density')
    axes[1, 1].barh(top_density['Name'], top_density['Density'], color='purple')
    axes[1, 1].set_xlabel('Population Density (people/sq km)')
    axes[1, 1].set_title('Top 10 Countries by Population Density')
    axes[1, 1].invert_yaxis()
    axes[1, 1].grid(axis='x', alpha=0.3)
    
    plt.tight_layout()
    plt.savefig('countries_visualization.png', dpi=300, bbox_inches='tight')
    print("\nVisualization saved to countries_visualization.png")
    plt.show()

def main():
    """Main function to orchestrate the scraping and visualization"""
    try:
        # Scrape data
        countries_data = scrape_countries_data()
        
        # Save to CSV
        df = save_to_csv(countries_data)
        
        # Display first few rows
        print("\nFirst 5 rows of data:")
        print(df.head())
        
        # Create visualizations
        create_visualizations(df)
        
        print("\nProcess completed successfully!")
        
    except Exception as e:
        print(f"An error occurred: {e}")
        raise

if __name__ == "__main__":
    main()

