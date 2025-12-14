# 📈 Multiple to Single CSV Combiner

A Python script that combines multiple CSV files into a single consolidated CSV file. Perfect for merging data from multiple sources, consolidating reports, or combining time-series data.

## ✨ Features

- **Automatic File Detection** - Finds all CSV files in the directory
- **Intelligent Header Handling** - Merges files with duplicate headers seamlessly
- **Duplicate Removal** - Automatically removes duplicate rows
- **Date Sorting** - Sorts combined data by date if a date column exists
- **Progress Reporting** - Shows detailed progress during combination
- **Summary Statistics** - Displays total rows, columns, and file count

## 📋 Requirements

- Python 3.10 or higher
- Pandas library

## 🚀 Installation

1. **Navigate to the project directory:**
   ```bash
   cd week-3/multiple-to-single-csv
   ```

2. **Create and activate a virtual environment (recommended):**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install pandas
   ```

   Or install from requirements (if available):
   ```bash
   pip install -r requirements.txt
   ```

## 💻 Usage

### Basic Usage

1. **Place your CSV files in the project directory:**
   ```
   multiple-to-single-csv/
   ├── file1.csv
   ├── file2.csv
   ├── file3.csv
   └── combine_csv.py
   ```

2. **Run the script:**
   ```bash
   python combine_csv.py
   ```

3. **Find the output:**
   The combined file will be saved as `combined_output.csv` in the same directory.

### Example

```bash
$ python combine_csv.py

Found 4 CSV files:
  - AMZN_2012-05-19_2025-04-06.csv
  - AMZN_2012-05-19_2025-04-17.csv
  - AMZN_2012-05-19_2025-05-12.csv
  - AMZN_2012-05-19_2025-07-14.csv

Reading AMZN_2012-05-19_2025-04-06.csv...
  Rows: 150

Reading AMZN_2012-05-19_2025-04-17.csv...
  Rows: 200

Reading AMZN_2012-05-19_2025-04-17.csv...
  Rows: 180

Reading AMZN_2012-05-19_2025-07-14.csv...
  Rows: 220

Combining CSV files...
Removed 5 duplicate rows.

✓ Successfully combined 4 CSV files into combined_output.csv
  Total rows: 745
  Columns: date, open, high, low, close, volume
```

## 📁 Project Structure

```
multiple-to-single-csv/
├── combine_csv.py          # Main script
├── combined_output.csv    # Output file (generated)
├── *.csv                  # Input CSV files
├── requirements.txt       # Dependencies (optional)
└── README.md             # This file
```

## 🔧 How It Works

1. **File Discovery**: The script scans the current directory for all `.csv` files
2. **Filtering**: Automatically excludes `combined_output.csv` to prevent recursion
3. **Reading**: Reads each CSV file using Pandas
4. **Combining**: Concatenates all dataframes while preserving structure
5. **Deduplication**: Removes duplicate rows based on all columns
6. **Sorting**: If a date column exists, sorts the data chronologically
7. **Export**: Saves the combined data to `combined_output.csv`

## 📊 Supported CSV Formats

The script works with any CSV format, including:
- Standard CSV files with headers
- Files with different column orders (automatically aligned)
- Files with missing columns (filled with NaN)
- Time-series data (automatically sorted by date)

## ⚙️ Configuration

### Customizing Output File Name

Edit `combine_csv.py` and change the `output_file` variable:

```python
output_file = 'my_custom_name.csv'  # Change this line
```

### Excluding Specific Files

Modify the filtering logic in `combine_csv.py`:

```python
# Filter out the output file if it exists
csv_files = [f for f in csv_files if f != 'combined_output.csv']
csv_files = [f for f in csv_files if f not in ['exclude1.csv', 'exclude2.csv']]  # Add exclusions
```

## 🎯 Use Cases

- **Data Consolidation**: Merge multiple data exports into one file
- **Time-Series Merging**: Combine historical data from different periods
- **Report Aggregation**: Combine multiple reports into a single dataset
- **Data Migration**: Merge data from different sources
- **Backup Consolidation**: Combine backup files into one archive

## 📝 Notes

- **Large Files**: Very large CSV files (>100MB) may take time to process
- **Memory Usage**: The script loads all files into memory, so ensure sufficient RAM
- **Date Format**: The script handles various date formats automatically
- **Encoding**: Supports UTF-8 encoded CSV files (standard)
- **Output File**: The output file is overwritten if it already exists

## 🐛 Troubleshooting

### No CSV files found
- Ensure CSV files are in the same directory as the script
- Check file extensions are `.csv` (lowercase)
- Verify file permissions allow reading

### Memory errors
- Process files in smaller batches
- Close other applications to free memory
- Consider processing files one at a time

### Date sorting issues
- Ensure date column is named 'date' (case-sensitive)
- Check date format is recognizable by Pandas
- Mixed timezones are automatically converted to UTC

### Duplicate detection
- Duplicates are identified by comparing all columns
- If you need custom duplicate logic, modify the `drop_duplicates()` call

## 🔄 Example Workflow

```bash
# 1. Place your CSV files in the directory
ls *.csv
# file1.csv  file2.csv  file3.csv

# 2. Run the combiner
python combine_csv.py

# 3. Check the output
cat combined_output.csv | head -20

# 4. Verify row count
wc -l combined_output.csv
```

## 📄 License

This project is part of the AI Maker Bootcamp educational program.

## 👤 Author

Created as part of Week 3 of the AI Maker Bootcamp.

---

**Happy data combining! 📊**

