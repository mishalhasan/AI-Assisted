import pandas as pd
import glob
import os

def combine_csv_files():
    """
    Combines all CSV files in the current directory into a single CSV file.
    """
    # Get all CSV files in the current directory
    csv_files = glob.glob('*.csv')
    
    # Filter out the output file if it exists
    csv_files = [f for f in csv_files if f != 'combined_output.csv']
    
    if not csv_files:
        print("No CSV files found in the current directory.")
        return
    
    print(f"Found {len(csv_files)} CSV files:")
    for file in csv_files:
        print(f"  - {file}")
    
    # Read and combine all CSV files
    dataframes = []
    for file in sorted(csv_files):
        print(f"\nReading {file}...")
        df = pd.read_csv(file)
        print(f"  Rows: {len(df)}")
        dataframes.append(df)
    
    # Concatenate all dataframes
    print("\nCombining CSV files...")
    combined_df = pd.concat(dataframes, ignore_index=True)
    
    # Remove duplicates if any (based on all columns)
    initial_rows = len(combined_df)
    combined_df = combined_df.drop_duplicates()
    final_rows = len(combined_df)
    
    if initial_rows != final_rows:
        print(f"Removed {initial_rows - final_rows} duplicate rows.")
    
    # Sort by date if date column exists
    if 'date' in combined_df.columns:
        # Convert to datetime, handling mixed timezones by converting all to UTC first
        combined_df['date'] = pd.to_datetime(combined_df['date'], format='mixed', errors='coerce', utc=True)
        # Convert all to timezone-naive for consistent comparison
        # Use apply to safely remove timezone info from timezone-aware datetimes
        combined_df['date'] = combined_df['date'].apply(
            lambda x: x.replace(tzinfo=None) if pd.notna(x) and hasattr(x, 'tzinfo') and x.tzinfo is not None else x
        )
        combined_df = combined_df.sort_values('date')
        combined_df['date'] = combined_df['date'].astype(str)
    
    # Save to output file
    output_file = 'combined_output.csv'
    combined_df.to_csv(output_file, index=False)
    
    print(f"\n✓ Successfully combined {len(csv_files)} CSV files into {output_file}")
    print(f"  Total rows: {len(combined_df)}")
    print(f"  Columns: {', '.join(combined_df.columns.tolist())}")

if __name__ == "__main__":
    combine_csv_files()

