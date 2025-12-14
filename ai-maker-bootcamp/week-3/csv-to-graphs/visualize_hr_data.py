"""
HR Dataset Visualization Script
This script visualizes key trends in the HR dataset including:
- Department distribution
- Salary analysis by department
- Performance metrics
- Employment status
- Demographics
- Recruitment sources
"""

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
from datetime import datetime

# Set style and color palette
sns.set_style("whitegrid")
plt.rcParams['figure.figsize'] = (15, 10)
colors = sns.color_palette("husl", 10)

# Read the CSV file
print("Loading HR dataset...")
df = pd.read_csv('sample_hr_dataset.csv')

# Data cleaning and preparation
print("Preparing data...")

# Clean salary column (remove any commas if present)
df['Salary'] = df['Salary'].astype(float)

# Parse dates
df['DateofHire'] = pd.to_datetime(df['DateofHire'], errors='coerce')
df['DateofTermination'] = pd.to_datetime(df['DateofTermination'], errors='coerce')

# Calculate tenure for active employees
df['Tenure'] = (datetime.now() - df['DateofHire']).dt.days / 365.25
df.loc[df['Termd'] == 1, 'Tenure'] = (
    df.loc[df['Termd'] == 1, 'DateofTermination'] - 
    df.loc[df['Termd'] == 1, 'DateofHire']
).dt.days / 365.25

# Create figure with subplots
fig = plt.figure(figsize=(20, 14))
gs = fig.add_gridspec(3, 3, hspace=0.3, wspace=0.3)

# 1. Department Distribution (Pie Chart)
ax1 = fig.add_subplot(gs[0, 0])
dept_counts = df['Department'].value_counts()
colors_dept = sns.color_palette("Set3", len(dept_counts))
ax1.pie(dept_counts.values, labels=dept_counts.index, autopct='%1.1f%%', 
        colors=colors_dept, startangle=90)
ax1.set_title('Employee Distribution by Department', fontsize=14, fontweight='bold')

# 2. Salary Distribution by Department (Box Plot)
ax2 = fig.add_subplot(gs[0, 1])
dept_order = df.groupby('Department')['Salary'].median().sort_values(ascending=False).index
sns.boxplot(data=df, x='Department', y='Salary', order=dept_order, ax=ax2, 
            palette='viridis', hue='Department', legend=False)
ax2.set_title('Salary Distribution by Department', fontsize=14, fontweight='bold')
ax2.set_xlabel('Department', fontsize=11)
ax2.set_ylabel('Salary ($)', fontsize=11)
ax2.tick_params(axis='x', rotation=45)

# 3. Performance Score Distribution
ax3 = fig.add_subplot(gs[0, 2])
perf_counts = df['PerformanceScore'].value_counts()
perf_order = ['Exceeds', 'Fully Meets', 'Needs Improvement', 'PIP']
perf_counts = perf_counts.reindex([p for p in perf_order if p in perf_counts.index])
colors_perf = ['#2ecc71', '#3498db', '#f39c12', '#e74c3c']
bars = ax3.bar(perf_counts.index, perf_counts.values, color=colors_perf[:len(perf_counts)])
ax3.set_title('Performance Score Distribution', fontsize=14, fontweight='bold')
ax3.set_xlabel('Performance Score', fontsize=11)
ax3.set_ylabel('Number of Employees', fontsize=11)
ax3.tick_params(axis='x', rotation=45)
# Add value labels on bars
for bar in bars:
    height = bar.get_height()
    ax3.text(bar.get_x() + bar.get_width()/2., height,
             f'{int(height)}', ha='center', va='bottom', fontweight='bold')

# 4. Employment Status
ax4 = fig.add_subplot(gs[1, 0])
status_counts = df['EmploymentStatus'].value_counts()
colors_status = ['#27ae60', '#e74c3c', '#95a5a6']
bars = ax4.bar(status_counts.index, status_counts.values, color=colors_status[:len(status_counts)])
ax4.set_title('Employment Status Distribution', fontsize=14, fontweight='bold')
ax4.set_xlabel('Employment Status', fontsize=11)
ax4.set_ylabel('Number of Employees', fontsize=11)
ax4.tick_params(axis='x', rotation=45)
# Add value labels
for bar in bars:
    height = bar.get_height()
    ax4.text(bar.get_x() + bar.get_width()/2., height,
             f'{int(height)}', ha='center', va='bottom', fontweight='bold')

# 5. Gender Distribution
ax5 = fig.add_subplot(gs[1, 1])
gender_counts = df['Sex'].value_counts()
colors_gender = ['#3498db', '#e91e63']
ax5.pie(gender_counts.values, labels=gender_counts.index, autopct='%1.1f%%',
        colors=colors_gender, startangle=90)
ax5.set_title('Gender Distribution', fontsize=14, fontweight='bold')

# 6. Average Salary by Performance Score
ax6 = fig.add_subplot(gs[1, 2])
perf_salary = df.groupby('PerformanceScore')['Salary'].mean().sort_values(ascending=False)
perf_order = [p for p in ['Exceeds', 'Fully Meets', 'Needs Improvement', 'PIP'] if p in perf_salary.index]
perf_salary = perf_salary.reindex(perf_order)
bars = ax6.bar(perf_salary.index, perf_salary.values, color=colors_perf[:len(perf_salary)])
ax6.set_title('Average Salary by Performance Score', fontsize=14, fontweight='bold')
ax6.set_xlabel('Performance Score', fontsize=11)
ax6.set_ylabel('Average Salary ($)', fontsize=11)
ax6.tick_params(axis='x', rotation=45)
# Format y-axis to show currency
ax6.yaxis.set_major_formatter(plt.FuncFormatter(lambda x, p: f'${x:,.0f}'))
# Add value labels
for bar in bars:
    height = bar.get_height()
    ax6.text(bar.get_x() + bar.get_width()/2., height,
             f'${height:,.0f}', ha='center', va='bottom', fontweight='bold', fontsize=9)

# 7. Recruitment Source Analysis
ax7 = fig.add_subplot(gs[2, 0])
recruit_counts = df['RecruitmentSource'].value_counts().head(8)
colors_recruit = sns.color_palette("coolwarm", len(recruit_counts))
bars = ax7.barh(recruit_counts.index, recruit_counts.values, color=colors_recruit)
ax7.set_title('Top Recruitment Sources', fontsize=14, fontweight='bold')
ax7.set_xlabel('Number of Employees', fontsize=11)
ax7.set_ylabel('Recruitment Source', fontsize=11)
# Add value labels
for i, bar in enumerate(bars):
    width = bar.get_width()
    ax7.text(width, bar.get_y() + bar.get_height()/2.,
             f'{int(width)}', ha='left', va='center', fontweight='bold')

# 8. Salary vs Engagement Survey (Scatter Plot)
ax8 = fig.add_subplot(gs[2, 1])
# Filter out missing values
df_clean = df.dropna(subset=['EngagementSurvey', 'Salary'])
scatter = ax8.scatter(df_clean['EngagementSurvey'], df_clean['Salary'], 
                     c=df_clean['EmpSatisfaction'], cmap='RdYlGn', 
                     alpha=0.6, s=50, edgecolors='black', linewidth=0.5)
ax8.set_title('Salary vs Engagement Survey\n(Color = Employee Satisfaction)', 
              fontsize=14, fontweight='bold')
ax8.set_xlabel('Engagement Survey Score', fontsize=11)
ax8.set_ylabel('Salary ($)', fontsize=11)
ax8.yaxis.set_major_formatter(plt.FuncFormatter(lambda x, p: f'${x:,.0f}'))
plt.colorbar(scatter, ax=ax8, label='Employee Satisfaction')

# 9. Termination Reasons (for terminated employees)
ax9 = fig.add_subplot(gs[2, 2])
terminated = df[df['Termd'] == 1]
if len(terminated) > 0:
    term_reasons = terminated['TermReason'].value_counts().head(6)
    colors_term = sns.color_palette("Reds", len(term_reasons))
    bars = ax9.barh(term_reasons.index, term_reasons.values, color=colors_term)
    ax9.set_title('Top Termination Reasons', fontsize=14, fontweight='bold')
    ax9.set_xlabel('Number of Terminations', fontsize=11)
    ax9.set_ylabel('Termination Reason', fontsize=11)
    # Add value labels
    for bar in bars:
        width = bar.get_width()
        ax9.text(width, bar.get_y() + bar.get_height()/2.,
                 f'{int(width)}', ha='left', va='center', fontweight='bold')
else:
    ax9.text(0.5, 0.5, 'No termination data available', 
             ha='center', va='center', transform=ax9.transAxes, fontsize=12)
    ax9.set_title('Top Termination Reasons', fontsize=14, fontweight='bold')

# Add main title
fig.suptitle('HR Dataset - Key Trends and Insights', 
             fontsize=18, fontweight='bold', y=0.995)

plt.tight_layout(rect=[0, 0, 1, 0.99])
plt.savefig('hr_visualizations.png', dpi=300, bbox_inches='tight')
print("\n✓ Visualizations saved as 'hr_visualizations.png'")

# Print summary statistics
print("\n" + "="*60)
print("KEY INSIGHTS SUMMARY")
print("="*60)

print(f"\n📊 Total Employees: {len(df)}")
print(f"💰 Average Salary: ${df['Salary'].mean():,.2f}")
print(f"📈 Median Salary: ${df['Salary'].median():,.2f}")
print(f"📉 Salary Range: ${df['Salary'].min():,.2f} - ${df['Salary'].max():,.2f}")

print(f"\n🏢 Department Breakdown:")
for dept, count in dept_counts.items():
    pct = (count / len(df)) * 100
    print(f"   {dept}: {count} employees ({pct:.1f}%)")

print(f"\n⭐ Performance Score Distribution:")
for perf, count in perf_counts.items():
    pct = (count / len(df)) * 100
    print(f"   {perf}: {count} employees ({pct:.1f}%)")

print(f"\n👥 Employment Status:")
for status, count in status_counts.items():
    pct = (count / len(df)) * 100
    print(f"   {status}: {count} employees ({pct:.1f}%)")

print(f"\n📅 Average Tenure: {df['Tenure'].mean():.1f} years")
print(f"📊 Average Engagement Score: {df['EngagementSurvey'].mean():.2f}")
print(f"😊 Average Employee Satisfaction: {df['EmpSatisfaction'].mean():.2f}")

print("\n" + "="*60)
print("Visualization complete! Check 'hr_visualizations.png' for detailed charts.")
print("="*60)

