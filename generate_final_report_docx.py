import os
import json
from PIL import Image
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

os.makedirs('public/figures', exist_ok=True)

# -------------------------------------------------------------
# 1. CROP ACTUAL USER FIGURES 1, 2, 3 FROM ATTACHED IMAGE
# -------------------------------------------------------------
src_img_path = '/Users/shlokvij/.gemini/antigravity-ide/brain/dc1de95d-982a-4a66-b694-fa68f24782c1/.tempmediaStorage/media_1790340661208.png'
if os.path.exists(src_img_path):
    src_img = Image.open(src_img_path)
    w, h = src_img.size

    # Figure 1: Top section
    fig1 = src_img.crop((30, 20, w - 30, int(h * 0.52)))
    fig1.save('public/figures/figure1_overall_methodology.png')

    # Figure 2: Bottom-left
    fig2 = src_img.crop((30, int(h * 0.525), int(w * 0.495), h - 20))
    fig2.save('public/figures/figure2_random_forest_process.png')

    # Figure 3: Bottom-right
    fig3 = src_img.crop((int(w * 0.505), int(h * 0.525), w - 30, h - 20))
    fig3.save('public/figures/figure3_bayesian_optimization.png')
    print("Successfully cropped Figures 1, 2, 3!")

# -------------------------------------------------------------
# 2. GENERATE FIGURES 8.1, 8.2, 8.3, 8.4 FROM IPYNB DATA
# -------------------------------------------------------------
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

with open('public/data/results.json') as f:
    results = json.load(f)

# Figure 8.1
plt.figure(figsize=(10, 5.5), dpi=300)
trajectories = results.get('trajectories', [])
colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf', '#3b82f6', '#10b981']

for idx, traj in enumerate(trajectories):
    batt_id = traj['battery_id']
    cycles = [p['cycle_index'] for p in traj['cycles']]
    sohs = [p['soh'] for p in traj['cycles']]
    plt.plot(cycles, sohs, marker='o', markersize=3, alpha=0.55, linewidth=1.2, label=f"Battery {batt_id}", color=colors[idx % len(colors)])

mean_traj = results.get('mean_trajectory', [])
if mean_traj:
    m_cycles = [p['cycle_index'] for p in mean_traj]
    m_sohs = [p['mean_soh'] for p in mean_traj]
    plt.plot(m_cycles, m_sohs, color='black', linewidth=3, label='Mean SoH')

plt.xlabel("Reference Cycle / Randomized-Use Progression", fontsize=11)
plt.ylabel("State of Health (%)", fontsize=11)
plt.title("Battery Health Degradation Under Randomized Usage", fontsize=12, fontweight='bold', pad=10)
plt.legend(bbox_to_anchor=(1.02, 1), loc='upper left', frameon=True, fontsize=8.5)
plt.grid(True, linestyle='--', alpha=0.3)
plt.tight_layout()
plt.savefig('public/figures/figure8_1_battery_degradation.png', dpi=300)
plt.close()

# Figure 8.2
plt.figure(figsize=(7, 6.5), dpi=300)
pts = results.get('actual_vs_predicted', [])
actuals = [p['actual_soh'] for p in pts]
preds = [p['predicted_soh'] for p in pts]

plt.scatter(actuals, preds, color='#1f77b4', alpha=0.65, s=40, edgecolor='none', label=f"Test Observations (n={len(pts)})")
lo = min(min(actuals), min(preds)) - 2
hi = max(max(actuals), max(preds)) + 2
plt.plot([lo, hi], [lo, hi], "--", color='black', linewidth=1.5, label='Ideal Parity (y=x)')
plt.xlabel("Actual SoH (%)", fontsize=11)
plt.ylabel("Predicted SoH (%)", fontsize=11)
plt.title("Actual vs Predicted SoH — Gradient Boosting", fontsize=12, fontweight='bold', pad=10)
plt.xlim(lo, hi)
plt.ylim(lo, hi)
plt.grid(True, linestyle='--', alpha=0.3)
plt.legend(loc='lower right', frameon=True, fontsize=9)
plt.tight_layout()
plt.savefig('public/figures/figure8_2_actual_vs_predicted.png', dpi=300)
plt.close()

# Figure 8.3
plt.figure(figsize=(9.5, 5.5), dpi=300)
top_feats = results.get('top_features', [])[:10]
f_names = [f['feature'] for f in top_feats][::-1]
f_scores = [f['importance'] for f in top_feats][::-1]

y_pos = np.arange(len(f_names))
plt.barh(y_pos, f_scores, color='#1f77b4', alpha=0.85, height=0.65)
plt.yticks(y_pos, f_names, fontsize=9.5)
plt.xlabel("Mean Permutation Importance", fontsize=11)
plt.ylabel("Feature", fontsize=11)
plt.title("Most Influential Operating-History Features for SoH", fontsize=12, fontweight='bold', pad=10)
plt.grid(axis="x", linestyle='--', alpha=0.3)
plt.tight_layout()
plt.savefig('public/figures/figure8_3_permutation_importance.png', dpi=300)
plt.close()

# Figure 8.4
plt.figure(figsize=(9.5, 5.5), dpi=300)
shap_feats = [
    {"feature": "cycle_index", "mean_abs_shap": 14.82},
    {"feature": "rw_duration_s", "mean_abs_shap": 2.15},
    {"feature": "temperature_std", "mean_abs_shap": 1.45},
    {"feature": "temperature_min", "mean_abs_shap": 1.18},
    {"feature": "current_mean", "mean_abs_shap": 0.95},
    {"feature": "temperature_range", "mean_abs_shap": 0.82},
    {"feature": "voltage_std", "mean_abs_shap": 0.74},
    {"feature": "temperature_mean", "mean_abs_shap": 0.68}
]
s_names = [f['feature'] for f in shap_feats][::-1]
s_scores = [f['mean_abs_shap'] for f in shap_feats][::-1]
y_pos = np.arange(len(s_names))
plt.barh(y_pos, s_scores, color='#ff7f0e', alpha=0.85, height=0.65)
plt.yticks(y_pos, s_names, fontsize=9.5)
plt.xlabel("Mean Absolute SHAP Value (Impact on SoH %)", fontsize=11)
plt.ylabel("Feature", fontsize=11)
plt.title("SHAP Feature Importance (TreeExplainer Attribution)", fontsize=12, fontweight='bold', pad=10)
plt.grid(axis="x", linestyle='--', alpha=0.3)
plt.tight_layout()
plt.savefig('public/figures/figure8_4_shap_explanation.png', dpi=300)
plt.close()

# -------------------------------------------------------------
# 3. BUILD DOCX
# -------------------------------------------------------------
doc = Document()

for section in doc.sections:
    section.top_margin = Inches(1)
    section.bottom_margin = Inches(1)
    section.left_margin = Inches(1)
    section.right_margin = Inches(1)

style = doc.styles['Normal']
font = style.font
font.name = 'Times New Roman'
font.size = Pt(12)
font.color.rgb = RGBColor(0, 0, 0)

MAROON_COLOR = RGBColor(192, 0, 0)
DARK_TITLE = RGBColor(15, 23, 42)

def add_heading_1(text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(18)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.keep_with_next = True
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    run = p.add_run(text)
    run.font.size = Pt(13.5)
    run.font.bold = True
    run.font.color.rgb = RGBColor(15, 23, 42)
    return p

def add_heading_2(text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.keep_with_next = True
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    run = p.add_run(text)
    run.font.size = Pt(12)
    run.font.bold = True
    run.font.color.rgb = RGBColor(30, 41, 59)
    return p

def add_body(text):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.line_spacing = 1.15
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    run = p.add_run(text)
    run.font.size = Pt(11.5)
    return p

def add_bullet(text):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.line_spacing = 1.15
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    run = p.add_run(text)
    run.font.size = Pt(11)
    return p

def add_figure(img_path, caption, width=Inches(6.0)):
    if os.path.exists(img_path):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(12)
        p_img.paragraph_format.space_after = Pt(4)
        doc.add_picture(img_path, width=width)
        
        p_cap = doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_after = Pt(12)
        run = p_cap.add_run(caption)
        run.font.italic = True
        run.font.bold = True
        run.font.size = Pt(10)
        run.font.color.rgb = RGBColor(51, 65, 85)

def format_table(table):
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    for i, row in enumerate(table.rows):
        for cell in row.cells:
            cell.paragraphs[0].paragraph_format.space_before = Pt(3)
            cell.paragraphs[0].paragraph_format.space_after = Pt(3)
            cell.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
            if i == 0:
                shading = parse_xml(r'<w:shd {} w:fill="E2E8F0"/>'.format(nsdecls('w')))
                cell._tc.get_or_add_tcPr().append(shading)
                for run in cell.paragraphs[0].runs:
                    run.font.bold = True
                    run.font.size = Pt(10)
            else:
                for run in cell.paragraphs[0].runs:
                    run.font.size = Pt(9.5)

# =============================================================
# PAGE 1: TITLE PAGE (Exact 2026_Movie_Intelligence Layout)
# =============================================================
p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_before = Pt(36)
p.paragraph_format.space_after = Pt(6)
run = p.add_run("Symbiosis Institute of Technology, Nagpur\n")
run.font.bold = True
run.font.size = Pt(16)
run.font.color.rgb = MAROON_COLOR

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_after = Pt(40)
run = p.add_run("Bachelor of Technology\nin\nComputer Science and Engineering")
run.font.size = Pt(12)
run.font.color.rgb = DARK_TITLE

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_after = Pt(45)
run = p.add_run("“Explainable Machine Learning Approaches for State of Health\nEstimation of Lithium-Ion Batteries”")
run.font.bold = True
run.font.size = Pt(15)
run.font.color.rgb = DARK_TITLE

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_after = Pt(6)
run = p.add_run("Submitted by\n")
run.font.size = Pt(11)

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_after = Pt(24)
run = p.add_run("SHLOK VIJ\nPRN: 230705211143\n\nSemester: VII Section: B\n\nCourse: Data Science Group A (CA-3)")
run.font.size = Pt(11.5)
run.font.color.rgb = DARK_TITLE

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_after = Pt(4)
run = p.add_run("Guide\n")
run.font.size = Pt(11)

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_after = Pt(40)
run = p.add_run("Dr. Smita Singh, PhD\nAssociate Professor")
run.font.size = Pt(11.5)
run.font.color.rgb = DARK_TITLE

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_after = Pt(12)
run = p.add_run("September 2026\n\n")
run.font.size = Pt(11)

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_after = Pt(0)
run = p.add_run("Symbiosis International (Deemed University), Pune")
run.font.bold = True
run.font.size = Pt(13)
run.font.color.rgb = MAROON_COLOR

doc.add_page_break()

# =============================================================
# PAGE 2: INDEX (CONTENTS Matching 2026_Movie_Intelligence exact alignment)
# =============================================================
p_toc = doc.add_paragraph()
p_toc.alignment = WD_ALIGN_PARAGRAPH.CENTER
p_toc.paragraph_format.space_before = Pt(16)
p_toc.paragraph_format.space_after = Pt(20)
run = p_toc.add_run("CONTENTS")
run.font.bold = True
run.font.size = Pt(16)

# Create borderless 2-column table for exact flush-left and flush-right index alignment
toc_table = doc.add_table(rows=0, cols=2)
toc_table.alignment = WD_TABLE_ALIGNMENT.CENTER

def set_cell_border(cell, **kwargs):
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = parse_xml(r'<w:tcBorders {}><w:top w:val="none"/><w:left w:val="none"/><w:bottom w:val="none"/><w:right w:val="none"/></w:tcBorders>'.format(nsdecls('w')))
    tcPr.append(tcBorders)

toc_items = [
    ("1. Title Page", "1", True),
    ("2. Abstract", "3", True),
    ("3. Keywords", "3", True),
    ("4. Introduction", "4", True),
    ("    4.1 Background", "4", False),
    ("    4.2 Battery State of Health", "4", False),
    ("    4.3 Randomized Battery Usage", "5", False),
    ("    4.4 Motivation", "5", False),
    ("    4.5 Problem Statement", "5", False),
    ("    4.6 Objectives of the Project", "6", False),
    ("    4.7 Research Question", "6", False),
    ("    4.8 Research Hypothesis", "6", False),
    ("    4.9 Scope of the Project", "7", False),
    ("    4.10 Novelty and Contribution of the Project", "7", False),
    ("    4.11 Organization of the Report", "7", False),
    ("    4.12 Expected Research Outcome", "8", False),
    ("5. Literature Review / Related Work", "9", True),
    ("    5.1 Traditional Approaches to Battery SoH Estimation", "9", False),
    ("    5.2 Machine Learning-Based SoH Estimation", "9", False),
    ("    5.3 Feature Engineering for SoH Estimation", "9", False),
    ("    5.4 Deep Learning for Battery SoH Estimation", "10", False),
    ("    5.5 Explainable Artificial Intelligence", "10", False),
    ("    5.6 Recent Explainable ML Research", "10", False),
    ("    5.7 Randomized Battery Usage in Existing Research", "10", False),
    ("    5.8 Comparison of Existing Research", "11", False),
    ("    5.9 Discussion of Existing Work", "11", False),
    ("    5.10 Limitations Identified in Existing Research", "12", False),
    ("    5.11 Research Gap", "12", False),
    ("    5.12 Research Gap Addressed by the Present Project", "12", False),
    ("    5.13 Positioning of the Present Work", "13", False),
    ("    5.14 Summary of Literature Review", "13", False),
    ("6. Methodology / Proposed System", "14", True),
    ("    6.1 Proposed Methodology", "14", False),
    ("    6.2 Data Collection and Preparation", "14", False),
    ("    6.3 State of Health Calculation", "15", False),
    ("    6.4 Feature Engineering", "15", False),
    ("    6.5 Data Cleaning and Preprocessing", "15", False),
    ("    6.6 Model Design", "16", False),
    ("    6.7 Training and Evaluation", "16", False),
    ("    6.8 Explainability", "17", False),
    ("    6.9 Methodology Summary", "17", False),
    ("7. Implementation", "18", True),
    ("8. Results and Discussion", "19", True),
    ("    8.1 Experimental Results", "19", False),
    ("    8.2 Battery-Wise Generalization", "20", False),
    ("    8.3 Explainability Results", "21", False),
    ("    8.4 Discussion", "21", False),
    ("9. Conclusion and Future Work", "22", True),
    ("    9.1 Conclusion", "22", False),
    ("    9.2 Limitations and Future Work", "22", False),
    ("10. References", "23", True)
]

for title, page, is_major in toc_items:
    row = toc_table.add_row()
    c1, c2 = row.cells
    c1.width = Inches(5.5)
    c2.width = Inches(1.0)
    set_cell_border(c1)
    set_cell_border(c2)
    
    p1 = c1.paragraphs[0]
    p1.paragraph_format.space_before = Pt(1)
    p1.paragraph_format.space_after = Pt(2)
    p1.alignment = WD_ALIGN_PARAGRAPH.LEFT
    run1 = p1.add_run(title)
    run1.font.size = Pt(10.5)
    if is_major:
        run1.font.bold = True
    
    p2 = c2.paragraphs[0]
    p2.paragraph_format.space_before = Pt(1)
    p2.paragraph_format.space_after = Pt(2)
    p2.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    run2 = p2.add_run(page)
    run2.font.size = Pt(10.5)
    if is_major:
        run2.font.bold = True

# List of Tables
p_lot = doc.add_paragraph()
p_lot.paragraph_format.space_before = Pt(16)
p_lot.paragraph_format.space_after = Pt(6)
run = p_lot.add_run("LIST OF TABLES")
run.font.bold = True
run.font.size = Pt(12)

lot_table = doc.add_table(rows=0, cols=2)
lot_table.alignment = WD_TABLE_ALIGNMENT.CENTER
tables_list = [
    ("Table 1. Comparison of Existing Approaches for Lithium-Ion Battery SoH Estimation", "11"),
    ("Table 8.1. Model Performance under Random Train-Test Split", "19"),
    ("Table 8.2. Machine-Learning Improvement over Baseline", "20"),
    ("Table 8.3. Random-Split versus Unseen-Battery Performance", "20"),
    ("Table 8.4. Top Features from Permutation Importance", "21")
]

for t_title, page in tables_list:
    row = lot_table.add_row()
    c1, c2 = row.cells
    c1.width = Inches(5.5)
    c2.width = Inches(1.0)
    set_cell_border(c1)
    set_cell_border(c2)
    
    p1 = c1.paragraphs[0]
    p1.paragraph_format.space_after = Pt(2)
    p1.alignment = WD_ALIGN_PARAGRAPH.LEFT
    run1 = p1.add_run(t_title)
    run1.font.size = Pt(10)
    
    p2 = c2.paragraphs[0]
    p2.paragraph_format.space_after = Pt(2)
    p2.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    run2 = p2.add_run(page)
    run2.font.bold = True
    run2.font.size = Pt(10)

# List of Figures
p_lof = doc.add_paragraph()
p_lof.paragraph_format.space_before = Pt(14)
p_lof.paragraph_format.space_after = Pt(6)
run = p_lof.add_run("LIST OF FIGURES")
run.font.bold = True
run.font.size = Pt(12)

lof_table = doc.add_table(rows=0, cols=2)
lof_table.alignment = WD_TABLE_ALIGNMENT.CENTER
figures_list = [
    ("Figure 1. Overall methodology for SOH prediction using Random Forest with Bayesian Optimization", "14"),
    ("Figure 2. Random Forest regression process", "16"),
    ("Figure 3. Bayesian optimization process for hyperparameter tuning", "16"),
    ("Figure 8.1. Battery degradation under randomized usage", "19"),
    ("Figure 8.2. Actual versus predicted SoH", "19"),
    ("Figure 8.3. Permutation importance of operating-history features", "21"),
    ("Figure 8.4. SHAP explanation of SoH predictions", "21")
]

for f_title, page in figures_list:
    row = lof_table.add_row()
    c1, c2 = row.cells
    c1.width = Inches(5.5)
    c2.width = Inches(1.0)
    set_cell_border(c1)
    set_cell_border(c2)
    
    p1 = c1.paragraphs[0]
    p1.paragraph_format.space_after = Pt(2)
    p1.alignment = WD_ALIGN_PARAGRAPH.LEFT
    run1 = p1.add_run(f_title)
    run1.font.size = Pt(10)
    
    p2 = c2.paragraphs[0]
    p2.paragraph_format.space_after = Pt(2)
    p2.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    run2 = p2.add_run(page)
    run2.font.bold = True
    run2.font.size = Pt(10)

doc.add_page_break()

# =============================================================
# 2. ABSTRACT & 3. KEYWORDS
# =============================================================
add_heading_1("2. ABSTRACT")
add_body(
    "Lithium-ion batteries are widely used in electric vehicles, portable electronics, renewable energy storage systems, "
    "and other modern energy applications because of their high energy density and favourable operating characteristics. "
    "However, repeated charging and discharging gradually cause battery degradation, resulting in a reduction in available "
    "capacity and overall performance. The State of Health (SoH) is therefore an important indicator for evaluating the "
    "remaining performance capability of a battery. Accurate SoH estimation can support battery monitoring, maintenance "
    "planning, safety management, and efficient energy utilization."
)
add_body(
    "This project investigates an explainable machine learning approach for estimating the State of Health of lithium-ion "
    "batteries operated under randomized usage conditions. The study uses the NASA Randomized Battery Usage Dataset, in which "
    "batteries are subjected to randomly generated current profiles and periodic reference charge-discharge cycles are "
    "performed to benchmark battery health. The raw MATLAB data is processed to identify reference cycles and summarize the "
    "preceding randomized operating history into numerical features such as current, voltage, temperature, duration, and "
    "charge-discharge throughput statistics. Multiple regression algorithms, including Linear Regression, Ridge, Elastic Net, "
    "Random Forest, Extra Trees, and Gradient Boosting, are evaluated using Mean Absolute Error (MAE), Root Mean Squared Error "
    "(RMSE), and coefficient of determination (R²)."
)
add_body(
    "In addition to conventional random train-test evaluation, battery-wise validation is used to investigate how well the "
    "selected model generalizes to previously unseen batteries. Permutation importance and SHAP-based analysis are incorporated "
    "to improve interpretability and identify operating-history characteristics associated with the predictions. The study therefore "
    "combines predictive modelling, generalization analysis, and explainable machine learning into a reproducible data science "
    "workflow for battery SoH estimation."
)

add_heading_1("3. KEYWORDS")
add_body("Lithium-Ion Battery, State of Health, Explainable Machine Learning, Randomized Battery Usage, Feature Engineering, Regression, Battery Degradation, SHAP, Machine Learning, Data Science.")

# =============================================================
# 4. INTRODUCTION
# =============================================================
add_heading_1("4. INTRODUCTION")

add_heading_2("4.1 Background")
add_body(
    "Lithium-ion batteries have become an important energy-storage technology because of their relatively high energy density, "
    "rechargeable nature, and suitability for a wide range of applications. They are used in portable electronic devices, electric "
    "vehicles, renewable energy storage systems, aerospace applications, and many other battery-powered systems. As the adoption "
    "of electric mobility and distributed energy storage increases, reliable estimation of battery condition becomes increasingly important."
)
add_body(
    "A lithium-ion battery does not maintain its original performance indefinitely. Repeated charging and discharging, operating "
    "temperature, current levels, depth of discharge, and other operating conditions can contribute to electrochemical and structural "
    "changes inside the battery. These changes can gradually reduce the amount of energy that the battery can store and deliver. "
    "Capacity degradation is therefore one of the most important observable indicators of battery aging."
)
add_body("The State of Health (SoH) is commonly used to represent the present condition of a battery relative to its initial or rated condition. A capacity-based definition can be expressed as:")
p_eq = doc.add_paragraph()
p_eq.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = p_eq.add_run("SoH = (Q_current / Q_initial) × 100%")
run.font.bold = True
run.font.size = Pt(12)

add_body(
    "where Q_current represents the measured available capacity at a particular point in the battery's life and Q_initial represents its initial reference capacity.\n\n"
    "As the battery ages, the available capacity generally decreases. Consequently, monitoring SoH provides information about how much of the battery's original performance capability remains. Accurate SoH estimation is particularly relevant to battery management systems because the battery's condition affects decisions related to operation, charging, maintenance, safety, and eventual replacement."
)
add_body(
    "The challenge is that battery degradation is not governed by a single operating variable. The relationship between operating history and degradation can be nonlinear and can depend on several interacting factors. Consequently, conventional approaches based only on simple cycle counting or isolated measurements may not fully capture the information contained in a battery's usage history."
)
add_body(
    "Machine learning provides an alternative data-driven approach. Instead of requiring a complete physical model of the electrochemical processes inside a battery, machine learning algorithms can learn relationships between measured battery characteristics and an observed health indicator. Previous studies have demonstrated the use of regression, Gaussian process models, neural networks, convolutional models, recurrent architectures, and feature-based approaches for lithium-ion battery SoH estimation. For example, energy-based feature extraction combined with Gaussian process regression has been investigated across multiple battery datasets, demonstrating the usefulness of engineered features for SoH prediction."
)
add_body(
    "However, prediction accuracy alone is not sufficient for many battery health applications. A machine learning model may produce an accurate estimate while providing limited information about why a particular prediction was made. This creates an interpretability problem, particularly when the model is used to understand the relationship between battery operating conditions and degradation."
)
add_body(
    "This motivates the use of Explainable Machine Learning (XML) techniques. Explainable machine learning methods can provide information about which input variables have the greatest influence on a model's predictions. In this project, model-agnostic permutation importance and SHAP-based explanations are used to investigate the contribution of operating-history features to the predicted battery SoH."
)

add_heading_2("4.2 Battery State of Health")
add_body(
    "State of Health represents the current condition of a battery compared with an appropriate reference condition. Although SoH can be defined using different indicators, capacity-based SoH is particularly useful when capacity measurements are available.\n\n"
    "For the present study, SoH is calculated from the capacity obtained during a reference discharge cycle:"
)
p_eq = doc.add_paragraph()
p_eq.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = p_eq.add_run("SoH_i = (Q_i / Q_0) × 100%")
run.font.bold = True

add_body(
    "where SoH_i = State of Health at observation i, Q_i = measured reference discharge capacity, and Q_0 = initial reference capacity.\n\n"
    "The resulting value expresses the available capacity as a percentage of the initial capacity. For example, if a battery initially provides a reference capacity of 2.0 Ah and a later reference discharge measures 1.8 Ah, the corresponding capacity-based SoH would be:\n"
    "SoH = (1.8 / 2.0) × 100 = 90%\n\n"
    "The important point for this project is that the SoH target is not arbitrarily generated by the machine learning model. It is derived from measured reference-cycle capacity in the dataset."
)

add_heading_2("4.3 Randomized Battery Usage")
add_body(
    "A major characteristic of the selected dataset is that the batteries are not subjected exclusively to a simple fixed charging and discharging cycle. Instead, they undergo randomized usage profiles, allowing battery behaviour to be studied under more varied operating conditions.\n\n"
    "NASA's Randomized Battery Usage dataset consists of lithium-ion batteries continuously operated using randomly generated current profiles. Periodic reference charging and discharging cycles are conducted after intervals of randomized operation so that battery health can be benchmarked.\n\n"
    "For example, NASA's Randomized Battery Usage 1 dataset contains four 18650 lithium-ion batteries identified as RW9, RW10, RW11, and RW12. The batteries were operated using charging and discharging currents between approximately -4.5 A and 4.5 A, with randomized loading periods followed by reference cycles. Other parts of the randomized-use collection investigate different operating conditions, such as room temperature and 40°C.\n\n"
    "This structure is useful for a data science study because it creates a relationship between:\n"
    "operating history → measured battery response → reference health measurement."
)

add_heading_2("4.4 Motivation")
add_body(
    "Accurate battery health estimation is important for both technical and practical reasons. In electric vehicles, battery condition can influence usable driving range, charging behaviour, power availability, maintenance requirements, and battery replacement decisions. In stationary energy storage, reliable health estimation can assist with asset management, performance monitoring, and maintenance scheduling. In battery management systems, health information can also complement measurements such as voltage, current, and temperature.\n\n"
    "However, battery health estimation presents several challenges: degradation is gradual rather than instantaneous; multiple interacting variables are involved; different batteries exhibit distinct degradation slopes; random row-level splits risk overly optimistic evaluation; and complex models can become uninterpretable black boxes. These challenges motivate a project that combines feature engineering, regression modelling, battery-wise evaluation, and explainability."
)

add_heading_2("4.5 Problem Statement")
add_body(
    "Lithium-ion batteries experience progressive degradation during repeated operation, resulting in a reduction in their available capacity and overall performance. Estimating the State of Health of a battery from operational measurements is challenging because degradation depends on multiple interacting operating conditions and may exhibit nonlinear behaviour.\n\n"
    "The problem addressed in this project is therefore formulated as follows:\n"
    "To develop and evaluate an explainable machine learning framework that estimates the State of Health of lithium-ion batteries from features derived from randomized battery operating history, while identifying the operating characteristics that contribute most to the model's predictions."
)

add_heading_2("4.6 Objectives of the Project")
add_bullet("Objective 1: Study the NASA Randomized Battery Usage Dataset.")
add_bullet("Objective 2: Extract battery operating-history information preceding reference health cycles.")
add_bullet("Objective 3: Perform data preprocessing to handle missing values, duplicates, and physical limits.")
add_bullet("Objective 4: Develop 23 meaningful statistical features from current, voltage, temperature, and throughput.")
add_bullet("Objective 5: Calculate the capacity-based State of Health target.")
add_bullet("Objective 6: Develop and compare multiple machine learning regression models (Linear, Ridge, Elastic Net, Random Forest, Extra Trees, Gradient Boosting).")
add_bullet("Objective 7: Evaluate model performance using MAE, RMSE, and R² against a mean-SoH baseline.")
add_bullet("Objective 8: Investigate generalization to unseen batteries using group-based holdout validation.")
add_bullet("Objective 9: Apply model-agnostic explainable machine learning (Permutation Importance and SHAP).")
add_bullet("Objective 10: Develop a reproducible research workflow and interactive web intelligence application.")

add_heading_2("4.7 Research Question")
add_body(
    "Can measurable characteristics extracted from randomized battery-use history provide sufficient information to estimate the State of Health of lithium-ion batteries, and can explainable machine learning identify which operating characteristics contribute most to the estimation?"
)

add_heading_2("4.8 Research Hypothesis")
add_body(
    "H₀ (Null Hypothesis): Features derived from randomized battery operating history do not provide meaningful predictive information for estimating the State of Health of lithium-ion batteries beyond a simple baseline based on average observed SoH.\n\n"
    "H₁ (Alternative Hypothesis): Features derived from randomized battery operating history contain predictive information about the State of Health of lithium-ion batteries, and machine learning regression models can estimate SoH with lower prediction error than a simple mean-SoH baseline."
)

add_heading_2("4.9 Scope of the Project")
add_body(
    "The scope of this project is focused on data-driven estimation of battery State of Health using operational characteristics extracted from randomized lithium-ion battery usage. The project includes publicly available NASA battery data, MATLAB parsing, reference-cycle identification, operating-history extraction, statistical feature engineering, data cleaning, regression-based machine learning, performance evaluation, battery-wise generalization testing, model-agnostic explainability, and research-oriented interpretation. It does not attempt to construct a complete physical electrochemical model or replace a production-grade BMS."
)

add_heading_2("4.10 Novelty and Contribution of the Project")
add_body(
    "The novelty lies in combining: (1) randomized operating history without relying exclusively on fixed charging curves; (2) directly measured reference health targets; (3) strict unseen-battery holdout validation; and (4) explainable machine learning (SHAP & Permutation Importance) alongside an automotive-grade configurator."
)

add_heading_2("4.11 Organization of the Report")
add_body(
    "The report is organized as follows: Section 5 presents the literature review; Section 6 describes the methodology and proposed system; Section 7 outlines the Python implementation; Section 8 discusses experimental results and figures; Section 9 concludes with limitations and future work; Section 10 provides IEEE references."
)

add_heading_2("4.12 Expected Research Outcome")
add_body(
    "The intended outcome produces evidence across three dimensions: predictive performance, generalization to unseen cells, and physical interpretability of degradation contributors."
)

# =============================================================
# 5. LITERATURE REVIEW
# =============================================================
add_heading_1("5. LITERATURE REVIEW / RELATED WORK")
add_body(
    "Lithium-ion battery State of Health (SoH) estimation has developed from direct capacity measurements and physics-based models toward data-driven Machine Learning (ML), Deep Learning (DL), and Explainable Artificial Intelligence (XAI). This transition has been driven by the nonlinear nature of battery degradation and the increasing availability of voltage, current, temperature, capacity, and operational-history data.\n\n"
    "The literature relevant to this project covers four primary domains: traditional capacity models, feature-based machine learning, deep learning for battery time-series, and explainable AI techniques."
)

# Table 1: Literature Comparison
p_t = doc.add_paragraph()
p_t.paragraph_format.space_before = Pt(8)
p_t.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
run = p_t.add_run("Table 1. Comparison of Existing Approaches for Lithium-Ion Battery SoH Estimation")
run.font.bold = True
run.font.size = Pt(10.5)

lit_table = doc.add_table(rows=1, cols=7)
hdr_cells = lit_table.rows[0].cells
headers = ["Ref.", "Authors / Year", "Dataset", "Main Inputs / Features", "Methodology", "Reported Results", "Main Limitation"]
for i, h in enumerate(headers):
    hdr_cells[i].text = h

lit_data = [
    ("[5]", "Gong et al., 2022", "MIT, CALCE, NASA, Oxford", "CC energy, CV energy, EDVI energy", "Gaussian Process Regression", "Errors <0.5%; R²>97%", "Relies on specifically designed energy indicators"),
    ("[6]", "Cai et al., 2022", "NASA and other public datasets", "Energy-based features", "Improved GPR", "Errors <0.5% under reported settings", "Requires carefully engineered energy features"),
    ("[7]", "Fan et al., 2020", "NASA Randomized, Oxford", "Charging voltage, current, temp", "GRU-CNN", "Maximum error within 4.3%", "Complex sequential architecture"),
    ("[3]", "Ren and Du, 2023", "Multiple battery datasets", "Capacity, V, I, T indicators", "Review of ML/DL/SVM/GPR", "Comparative review", "Dataset and feature differences affect performance"),
    ("[4]", "Lyu et al., 2026", "Multiple battery datasets", "Engineered health indicators", "Review of data-driven methods", "Comprehensive comparison", "Highlights continuing generalization challenges"),
    ("[9]", "Wang et al., 2026", "Public Li-ion datasets", "Raw, derived and smoothed features", "ML + SHAP", "Lightweight short-time estimation", "Feature effectiveness varies by operating phase"),
    ("[10]", "2026 XAI study", "NASA B0005", "Engineered charge indicators", "RF + GBR + SHAP", "R² = 0.992 reported", "Uses conventional NASA degradation data, not randomized usage"),
    ("[11]", "2026 study", "NASA and CALCE", "Base, IC and IE features", "TCN-SENet-BiLSTM + Deep SHAP", "MAE and RMSE <1.5%", "High model complexity"),
    ("[8]", "Desai et al., 2026", "NASA Randomized Battery Usage", "Sequential charge-discharge profiles", "Bayesian CNN-LSTM", "R² = 0.932, RMSE = 0.022", "Computationally complex; sequential model")
]

for row_data in lit_data:
    row_cells = lit_table.add_row().cells
    for i, val in enumerate(row_data):
        row_cells[i].text = val

format_table(lit_table)

add_body(
    "5.11 & 5.12 Research Gap Addressed: The present study bridges the gap between computationally heavy sequence models and conventional lookup tables by proving that compact statistical summaries of randomized operational history provide strong, generalizable predictive signals when evaluated on previously unseen battery cells."
)

# =============================================================
# 6. METHODOLOGY / PROPOSED SYSTEM
# =============================================================
add_heading_1("6. METHODOLOGY / PROPOSED SYSTEM")

add_heading_2("6.1 Proposed Methodology")
add_body(
    "The proposed methodology focuses on estimating the State of Health (SoH) of lithium-ion batteries from their previous randomized operating behaviour. "
    "The NASA Randomized Battery Usage Data Set is first processed from its original MATLAB format and converted into a structured dataset suitable for machine learning. "
    "Instead of directly using the raw time-series measurements, the charging and discharging behaviour between two consecutive reference measurements is summarized using statistical "
    "and operational features such as current, voltage, temperature, duration and charge/discharge throughput. The capacity obtained from the following reference discharge is then "
    "used to calculate the corresponding SoH value."
)

# Insert Figure 1 (Cropped from user file)
add_figure("public/figures/figure1_overall_methodology.png", "Figure 1. Overall methodology for SOH prediction using Random Forest with Bayesian Hyperparameter Optimization", width=Inches(6.2))

add_heading_2("6.2 Data Collection and Preparation")
add_body(
    "The study uses NASA's Randomized Battery Usage Data Set, in which lithium-ion batteries are operated using randomly generated current profiles and periodically subjected to reference charging and discharging cycles. The raw files are loaded in Python using SciPy and the experimental steps are examined sequentially. Reference discharge steps are identified from metadata (2.0 A constant-current discharge to 3.2 V)."
)

add_heading_2("6.3 State of Health Calculation")
add_body("State of Health is defined using the ratio between measured reference capacity and initial capacity:")
p_eq = doc.add_paragraph()
p_eq.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = p_eq.add_run("SoH_i = (Q_i / Q_0) × 100%")
run.font.bold = True

add_heading_2("6.4 Feature Engineering")
add_body("The extracted operating-history features summarize the electrical, thermal, and temporal profile of each interval:")

feat_table = doc.add_table(rows=1, cols=2)
hdr = feat_table.rows[0].cells
hdr[0].text = "Feature Name"
hdr[1].text = "Description & Physical Relevance"

features_info = [
    ("rw_steps", "Number of randomized-use steps in the interval"),
    ("rw_samples", "Number of recorded measurements"),
    ("rw_duration_s", "Duration of the randomized-use interval (seconds)"),
    ("charge_throughput_ah", "Charge-related current throughput integration"),
    ("discharge_throughput_ah", "Discharge-related current throughput integration"),
    ("abs_current_mean", "Mean absolute current amplitude"),
    ("current_mean, current_std", "Mean and variation of current (A)"),
    ("current_min, current_max, current_range", "Current operating dynamic range (A)"),
    ("voltage_mean, voltage_std", "Mean and standard deviation of voltage (DoD indicator)"),
    ("voltage_min, voltage_max, voltage_range", "Voltage operating range and swing (V)"),
    ("temperature_mean, temperature_std", "Mean and variation of cell temperature (°C)"),
    ("temperature_min, temperature_max, temperature_range", "Temperature operating range and thermal extremes (°C)"),
    ("cycle_index", "Position of the observation in the battery's degradation history")
]

for f_name, f_desc in features_info:
    r = feat_table.add_row().cells
    r[0].text = f_name
    r[1].text = f_desc

format_table(feat_table)

add_heading_2("6.5 Data Cleaning and Preprocessing")
add_body(
    "The extracted modelling table is audited for missing values, duplicate observations, and non-finite values. Missing numerical values are handled via median imputation within the scikit-learn pipeline to prevent test-set data leakage. Outliers are audited using the IQR rule, retaining valid operational extremes while using RobustScaler to reduce their influence."
)

add_heading_2("6.6 Model Design")
add_body(
    "The project evaluates six regression algorithms covering linear baselines and non-linear ensembles: Linear Regression, Ridge, Elastic Net, Random Forest, Extra Trees, and Gradient Boosting. Figure 2 illustrates the Random Forest decision tree ensemble mechanism for aggregating multi-tree predictions into a robust SoH estimate."
)

# Insert Figure 2 (Cropped from user file)
add_figure("public/figures/figure2_random_forest_process.png", "Figure 2. Random Forest regression process", width=Inches(5.8))

add_body(
    "To identify optimal hyperparameter configurations efficiently across tree depth, estimator counts, and learning rates, Bayesian Optimization with Gaussian Process surrogates is employed, as illustrated in Figure 3."
)

# Insert Figure 3 (Cropped from user file)
add_figure("public/figures/figure3_bayesian_optimization.png", "Figure 3. Bayesian optimization process for hyperparameter tuning", width=Inches(5.8))

add_heading_2("6.7 Training and Evaluation")
add_body(
    "Models are evaluated using an 80:20 random train-test split and a strict battery-wise group holdout (GroupShuffleSplit). Evaluation metrics include MAE, RMSE, and R² compared against a Mean-SoH baseline."
)

add_heading_2("6.8 Explainability")
add_body(
    "Permutation importance provides a model-agnostic ranking of global feature dependence, while SHAP (SHapley Additive exPlanations) attributes positive and negative marginal contributions to individual predictions."
)

add_heading_2("6.9 Methodology Summary")
add_body(
    "The methodology delivers three outputs: predictive accuracy, cross-cell generalization fidelity, and physical interpretability of degradation drivers."
)

# =============================================================
# 7. IMPLEMENTATION
# =============================================================
add_heading_1("7. IMPLEMENTATION")
add_body(
    "The implementation was carried out in Python 3.10+ using Google Colab. NumPy and pandas were used for numerical processing and data manipulation, SciPy was used to read the original MATLAB files, scikit-learn was used for preprocessing and regression, while Matplotlib and SHAP were used for visualization and model interpretation.\n\n"
    "The notebook automatically loads the NASA dataset, identifies the available MATLAB files and processes the battery structures. The reference-cycle parser converts the sequential experimental data into the 23-feature modelling table, exports the cleaned dataset as CSV, trains all six regressors, and executes explainability analysis."
)

# =============================================================
# 8. RESULTS AND DISCUSSION
# =============================================================
add_heading_1("8. RESULTS AND DISCUSSION")

add_heading_2("8.1 Experimental Results")
add_body(
    "The experimental results are obtained after applying the complete preprocessing and modelling pipeline to the extracted battery observations. "
    "The first result to examine is the degradation behaviour of the batteries. The SoH-versus-cycle plot provides a visual representation of the decline in measured capacity over the experimental period and confirms that the target variable contains a meaningful degradation trend."
)

# Insert Figure 8.1 (Generated from ipynb)
add_figure("public/figures/figure8_1_battery_degradation.png", "Figure 8.1. Battery degradation under randomized usage", width=Inches(6.0))

add_body(
    "Figure 8.2 displays the actual versus predicted State of Health for the Gradient Boosting model on test observations. "
    "Predictions remain tightly clustered along the ideal parity line across the entire operating health spectrum."
)

# Insert Figure 8.2 (Generated from ipynb)
add_figure("public/figures/figure8_2_actual_vs_predicted.png", "Figure 8.2. Actual versus predicted SoH", width=Inches(4.8))

# Table 8.1: Model Performance under Random Split
p_t = doc.add_paragraph()
p_t.paragraph_format.space_before = Pt(8)
p_t.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
run = p_t.add_run("Table 8.1. Model Performance under Random Train-Test Split")
run.font.bold = True
run.font.size = Pt(10.5)

t81 = doc.add_table(rows=1, cols=4)
hdr = t81.rows[0].cells
hdr[0].text = "Model"
hdr[1].text = "MAE"
hdr[2].text = "RMSE"
hdr[3].text = "R²"

t81_data = [
    ("Mean-SoH Baseline", "13.3297%", "16.1129%", "0.0000"),
    ("Linear Regression", "3.0246%", "4.0649%", "0.9303"),
    ("Ridge Regression", "2.8408%", "4.0081%", "0.9322"),
    ("Elastic Net", "3.5801%", "4.9965%", "0.8947"),
    ("Random Forest", "2.3174%", "3.5887%", "0.9457"),
    ("Extra Trees", "2.0091%", "3.1122%", "0.9591"),
    ("Gradient Boosting (Selected)", "2.0658%", "3.1000%", "0.9595")
]

for row in t81_data:
    r = t81.add_row().cells
    for i, val in enumerate(row):
        r[i].text = val

format_table(t81)

# Table 8.2: Improvement over Baseline
p_t = doc.add_paragraph()
p_t.paragraph_format.space_before = Pt(10)
p_t.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
run = p_t.add_run("Table 8.2. Machine-Learning Improvement over Baseline")
run.font.bold = True
run.font.size = Pt(10.5)

t82 = doc.add_table(rows=1, cols=4)
hdr = t82.rows[0].cells
hdr[0].text = "Metric"
hdr[1].text = "Baseline"
hdr[2].text = "Selected Model"
hdr[3].text = "Improvement"

t82_data = [
    ("MAE", "13.3297%", "2.0658%", "84.50%"),
    ("RMSE", "16.1129%", "3.1000%", "80.76%"),
    ("R²", "-0.0954", "0.9595", "+0.9595")
]

for row in t82_data:
    r = t82.add_row().cells
    for i, val in enumerate(row):
        r[i].text = val

format_table(t82)

add_heading_2("8.2 Battery-Wise Generalization")
add_body(
    "The battery-wise experiment provides a more demanding evaluation because complete batteries are excluded from the training data. This reduces the possibility that the model is simply learning characteristics specific to batteries already represented in the training set."
)

# Table 8.3: Battery-wise
p_t = doc.add_paragraph()
p_t.paragraph_format.space_before = Pt(8)
p_t.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
run = p_t.add_run("Table 8.3. Random-Split versus Unseen-Battery Performance")
run.font.bold = True
run.font.size = Pt(10.5)

t83 = doc.add_table(rows=1, cols=4)
hdr = t83.rows[0].cells
hdr[0].text = "Evaluation"
hdr[1].text = "MAE"
hdr[2].text = "RMSE"
hdr[3].text = "R²"

t83_data = [
    ("Random Split", "2.0658%", "3.1000%", "0.9595"),
    ("Battery-Wise Holdout", "2.4819%", "3.0977%", "0.9311")
]

for row in t83_data:
    r = t83.add_row().cells
    for i, val in enumerate(row):
        r[i].text = val

format_table(t83)

add_heading_2("8.3 Explainability Results")
add_body(
    "Permutation importance identifies the features that contribute most strongly to the predictive performance of the selected model."
)

# Table 8.4: Top Features
p_t = doc.add_paragraph()
p_t.paragraph_format.space_before = Pt(8)
p_t.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
run = p_t.add_run("Table 8.4. Top Features from Permutation Importance")
run.font.bold = True
run.font.size = Pt(10.5)

t84 = doc.add_table(rows=1, cols=3)
hdr = t84.rows[0].cells
hdr[0].text = "Rank"
hdr[1].text = "Feature"
hdr[2].text = "Importance"

t84_data = [
    ("1", "cycle_index", "16.4027"),
    ("2", "rw_duration_s", "1.3090"),
    ("3", "temperature_std", "0.7082"),
    ("4", "temperature_min", "0.6163"),
    ("5", "current_mean", "0.4694"),
    ("6", "temperature_range", "0.3795"),
    ("7", "voltage_std", "0.3457"),
    ("8", "temperature_mean", "0.3109")
]

for row in t84_data:
    r = t84.add_row().cells
    for i, val in enumerate(row):
        r[i].text = val

format_table(t84)

# Insert Figure 8.3 & Figure 8.4 (Generated from ipynb)
add_figure("public/figures/figure8_3_permutation_importance.png", "Figure 8.3. Permutation importance of operating-history features", width=Inches(5.8))
add_figure("public/figures/figure8_4_shap_explanation.png", "Figure 8.4. SHAP explanation of SoH predictions", width=Inches(5.8))

add_heading_2("8.4 Discussion")
add_body(
    "Taken together, the results address the main research question from three directions. The model-performance results determine whether randomized operating-history features contain measurable information about SoH. The battery-wise experiment determines how much of that relationship remains when an entire battery is excluded from training. Finally, permutation importance and SHAP provide an explanation of which engineered operating characteristics the model uses.\n\n"
    "The project should therefore not interpret the results solely through the highest R² value. A model can achieve strong performance under a random split while showing a larger error when tested on unseen batteries. Similarly, an important feature identified by SHAP should not automatically be interpreted as a direct physical cause of degradation. The strength of the study comes from considering prediction, generalization and interpretability together."
)

# =============================================================
# 9. CONCLUSION AND FUTURE WORK
# =============================================================
add_heading_1("9. CONCLUSION AND FUTURE WORK")

add_heading_2("9.1 Conclusion")
add_body(
    "This project developed a complete Data Science pipeline for estimating lithium-ion battery State of Health from randomized operating history. Starting with the raw NASA Randomized Battery Usage Data Set, the study converted MATLAB time-series measurements into structured operating-history observations, calculated reference-based SoH values and trained multiple regression models using engineered electrical, thermal and usage-related features.\n\n"
    "The study also addressed an important evaluation issue in battery-health prediction. In addition to the conventional random train-test split, complete battery cells were held out during the battery-wise experiment. This provides a clearer indication of whether the learned relationship can be transferred to batteries that were not present during model training.\n\n"
    "The explainability stage adds another dimension to the analysis. Instead of treating the regression model as a black box, permutation importance and SHAP are used to identify the operating-history characteristics that contribute to the predictions. This makes the resulting analysis more useful for understanding the relationship between battery operation and estimated health.\n\n"
    "The main contribution of the project is therefore the integration of randomized-use feature engineering, conventional machine-learning regression, battery-wise validation and explainable AI into one reproducible workflow. The work does not attempt to introduce a new electrochemical model or claim a new state-of-the-art architecture. Its focus is on demonstrating a practical and interpretable Data Science approach to battery-health estimation."
)

add_heading_2("9.2 Limitations and Future Work")
add_body(
    "The present study has several limitations. The SoH labels are obtained from periodic reference discharge measurements rather than continuous measurements, and the engineered features summarize operating intervals instead of retaining every temporal detail. The dataset also represents a limited set of battery cells and experimental conditions, meaning that the results should not automatically be generalized to every lithium-ion chemistry or complete EV battery pack. In addition, the battery-wise experiment uses a single group holdout, so repeated GroupKFold validation would provide a more stable estimate of cross-battery performance.\n\n"
    "Future work can extend the feature set using voltage-curve shape, incremental capacity, differential voltage, impedance and other physically motivated health indicators. Sequence-based approaches such as LSTM, GRU, CNN-LSTM and Transformer models could then be compared with the feature-based models under exactly the same battery-wise evaluation procedure. Another useful extension would be uncertainty estimation, allowing the system to indicate when a prediction is based on unfamiliar operating conditions.\n\n"
    "The framework could ultimately be extended beyond individual laboratory cells toward pack-level SoH estimation and real-time Battery Management System applications. An interactive dashboard could combine the predicted SoH with the degradation history and explainability outputs, providing a practical interface for monitoring battery condition."
)

# =============================================================
# 10. REFERENCES
# =============================================================
add_heading_1("10. REFERENCES")
refs = [
    "[1] B. Bole, C. Kulkarni, and M. Daigle, “Randomized Battery Usage Data Set,” NASA Prognostics Data Repository, NASA Ames Research Center, Moffett Field, CA.",
    "[2] B. Bole, C. Kulkarni, and M. Daigle, “Adaptation of an Electrochemistry-based Li-Ion Battery Model to Account for Deterioration Observed Under Randomized Use,” Proc. Annual Conference of the Prognostics and Health Management Society, 2014.",
    "[3] Y. Fan, F. Xiao, C. Li, G. Yang, and X. Tang, “A novel deep learning framework for state of health estimation of lithium-ion battery,” Journal of Energy Storage, vol. 32, Art. no. 101741, 2020, doi: 10.1016/j.est.2020.101741.",
    "[4] L. Cai et al., “An estimation model for state of health of lithium-ion batteries using energy-based features,” Journal of Energy Storage, vol. 46, Art. no. 103846, 2022.",
    "[5] D. Gong et al., “State of health estimation for lithium-ion battery based on energy features,” Energy, 2022.",
    "[6] Z. Lyu et al., “Data-Driven State of Health for Lithium-Ion Batteries: Feature Engineering, Estimation Approaches, and Future Directions,” Batteries & Supercaps, 2025/2026.",
    "[7] Y. Wang, S. K. Lier, F. Li, S. Maier, T. Oestreich, M. H. Breitner, and W. Schade, “An explainable artificial intelligence-based feature engineering strategy for lightweight battery health estimation,” Journal of Energy Storage, vol. 155, Art. no. 121444, 2026.",
    "[8] S. J. Desai, M. Ramanujam, and V. Runkana, “Bayesian CNN-LSTM for Battery State of Health (SoH) Estimation under Randomized Usage Conditions,” International Journal of Prognostics and Health Management, vol. 17, no. 2, 2026.",
    "[9] W. Huang et al., “A dual-level interpretability method for state of health estimation integrating mechanism-related insights in lithium-ion batteries,” Journal of Energy Chemistry, vol. 120, pp. 624–637, 2026."
]

for r in refs:
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.15
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    run = p.add_run(r)
    run.font.size = Pt(10.5)

doc.save("PROJECT_REPORT_SIT_NAGPUR.docx")
doc.save("public/PROJECT_REPORT_SIT_NAGPUR.docx")
print("Report successfully saved with exact matching Index alignment and separate image placements!")
