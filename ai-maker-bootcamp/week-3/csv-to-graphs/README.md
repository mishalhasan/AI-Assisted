# HR Dataset Visualization

This project visualizes key trends in an HR dataset using Python.

## Installation

1. Activate your virtual environment:
```bash
source venv/bin/activate
```

2. Install required packages:
```bash
pip install -r requirements.txt
```

Or install packages individually:
```bash
pip install pandas matplotlib seaborn numpy
```

## Running the Script

Make sure your virtual environment is activated, then run:

```bash
python visualize_hr_data.py
```

The script will:
- Load the HR dataset from `sample_hr_dataset.csv`
- Generate 9 different visualizations showing key trends
- Save the visualizations as `hr_visualizations.png`
- Print summary statistics to the console

## Visualizations Generated

1. **Department Distribution** - Pie chart showing employee distribution across departments
2. **Salary Distribution by Department** - Box plots comparing salaries across departments
3. **Performance Score Distribution** - Bar chart showing performance ratings
4. **Employment Status** - Active vs Terminated employees
5. **Gender Distribution** - Gender breakdown
6. **Average Salary by Performance** - Relationship between performance and compensation
7. **Top Recruitment Sources** - Where employees are being hired from
8. **Salary vs Engagement** - Scatter plot showing correlation (colored by satisfaction)
9. **Termination Reasons** - Analysis of why employees leave

## Output

- `hr_visualizations.png` - High-resolution image with all visualizations
- Console output with key statistics and insights

