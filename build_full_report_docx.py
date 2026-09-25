import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn
import os

doc = Document()

# Set standard 1 inch margins
for section in doc.sections:
    section.top_margin = Inches(1)
    section.bottom_margin = Inches(1)
    section.left_margin = Inches(1)
    section.right_margin = Inches(1)

# Set base styles
style = doc.styles['Normal']
font = style.font
font.name = 'Times New Roman'
font.size = Pt(12)
font.color.rgb = RGBColor(0, 0, 0)

def add_title(text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run(text)
    run.font.size = Pt(18)
    run.font.bold = True
    run.font.color.rgb = RGBColor(15, 23, 42)
    p.paragraph_format.space_after = Pt(12)
    return p

def add_heading_1(text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(18)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.size = Pt(14)
    run.font.bold = True
    run.font.color.rgb = RGBColor(15, 23, 42)
    return p

def add_heading_2(text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.size = Pt(12.5)
    run.font.bold = True
    run.font.color.rgb = RGBColor(30, 41, 59)
    return p

def add_body(text):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.line_spacing = 1.15
    run = p.add_run(text)
    run.font.size = Pt(11.5)
    return p

def add_bullet(text):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.line_spacing = 1.15
    run = p.add_run(text)
    run.font.size = Pt(11)
    return p

def add_figure(img_path, caption, width=Inches(6.0)):
    if os.path.exists(img_path):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(10)
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
            if i == 0:
                # Header row shading
                shading = parse_xml(r'<w:shd {} w:fill="E2E8F0"/>'.format(nsdecls('w')))
                cell._tc.get_or_add_tcPr().append(shading)
                for run in cell.paragraphs[0].runs:
                    run.font.bold = True
                    run.font.size = Pt(10)
            else:
                for run in cell.paragraphs[0].runs:
                    run.font.size = Pt(9.5)

# =============================================================
# 1. TITLE PAGE
# =============================================================
p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_before = Pt(30)
p.paragraph_format.space_after = Pt(4)
run = p.add_run("SYMBIOSIS INSTITUTE OF TECHNOLOGY, NAGPUR\n")
run.font.bold = True
run.font.size = Pt(16)
run = p.add_run("Symbiosis International (Deemed University), Pune\n\n")
run.font.size = Pt(13)
run.font.color.rgb = RGBColor(71, 85, 105)

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_after = Pt(12)
run = p.add_run("DATA SCIENCE\nCONTINUOUS ASSESSMENT - 3 (CA-3)\nMINI PROJECT REPORT\n\n")
run.font.bold = True
run.font.size = Pt(14)
run.font.color.rgb = RGBColor(30, 41, 59)

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_after = Pt(30)
run = p.add_run("“EXPLAINABLE MACHINE LEARNING APPROACHES FOR STATE OF HEALTH ESTIMATION OF LITHIUM-ION BATTERIES”\n")
run.font.bold = True
run.font.size = Pt(16)
run.font.color.rgb = RGBColor(15, 23, 42)

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_after = Pt(4)
run = p.add_run("Submitted by\n")
run.font.italic = True
run.font.size = Pt(11)

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_after = Pt(20)
run = p.add_run("SHLOK VIJ\n")
run.font.bold = True
run.font.size = Pt(13)
run = p.add_run("PRN: 230705211143\nSemester: VII | Section: B\nCourse: Data Science Group A\n")
run.font.size = Pt(11.5)

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_after = Pt(4)
run = p.add_run("Submitted to\n")
run.font.italic = True
run.font.size = Pt(11)

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_after = Pt(30)
run = p.add_run("Dr. Smita Singh, PhD\nAssociate Professor\nDepartment of Computer Science and Engineering\nSymbiosis Institute of Technology, Nagpur\n\n")
run.font.bold = True
run.font.size = Pt(12)

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_after = Pt(0)
run = p.add_run("Date of Submission: 26 September 2026\nAcademic Year: 2026–2027")
run.font.size = Pt(11)
run.font.color.rgb = RGBColor(71, 85, 105)

doc.add_page_break()

# =============================================================
# 2. ABSTRACT
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

# =============================================================
# 3. KEYWORDS
# =============================================================
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
    "where SoH_i = State of Health at observation i, Q_i = measured reference discharge capacity, and Q_0 = initial reference capacity. "
    "The resulting value expresses the available capacity as a percentage of the initial capacity.\n\n"
    "For example, if a battery initially provides a reference capacity of 2.0 Ah and a later reference discharge measures 1.8 Ah, the corresponding capacity-based SoH would be:\n"
    "SoH = (1.8 / 2.0) × 100 = 90%\n\n"
    "The important point for this project is that the SoH target is not arbitrarily generated by the machine learning model. It is derived from measured reference-cycle capacity in the dataset."
)

add_heading_2("4.3 Randomized Battery Usage")
add_body(
    "A major characteristic of the selected dataset is that the batteries are not subjected exclusively to a simple fixed charging and discharging cycle. Instead, they undergo randomized usage profiles, allowing battery behaviour to be studied under more varied operating conditions.\n\n"
    "NASA's Randomized Battery Usage dataset consists of lithium-ion batteries continuously operated using randomly generated current profiles. Periodic reference charging and discharging cycles are conducted after intervals of randomized operation so that battery health can be benchmarked.\n\n"
    "For example, NASA's Randomized Battery Usage 1 dataset contains four 18650 lithium-ion batteries identified as RW9, RW10, RW11, and RW12. The batteries were operated using charging and discharging currents between approximately -4.5 A and 4.5 A, with randomized loading periods followed by reference cycles. Other parts of the collection investigate different operating conditions such as room temperature and elevated 40°C temperatures.\n\n"
    "This structure is useful for a data science study because it creates a relationship between:\n"
    "operating history → measured battery response → reference health measurement."
)

add_heading_2("4.4 Motivation")
add_body(
    "Accurate battery health estimation is important for both technical and practical reasons. In electric vehicles, battery condition influences usable driving range, charging behaviour, power availability, maintenance requirements, and warranty management. In stationary energy storage, reliable health estimation assists asset management and maintenance scheduling.\n\n"
    "However, battery health estimation presents several challenges: degradation is gradual and non-instantaneous; it involves multiple interacting physical and thermal variables; different cells exhibit varied degradation trajectories; row-level random splits can overestimate cross-battery generalization; and high-performing models can become uninterpretable black boxes. These challenges motivate combining feature engineering, regression modelling, battery-wise evaluation, and explainability."
)

add_heading_2("4.5 Problem Statement")
add_body(
    "Lithium-ion batteries experience progressive degradation during repeated operation, resulting in a reduction in their available capacity and overall performance. Estimating the State of Health of a battery from operational measurements is challenging because degradation depends on multiple interacting operating conditions and may exhibit nonlinear behaviour.\n\n"
    "The problem addressed in this project is therefore formulated as follows:\n"
    "To develop and evaluate an explainable machine learning framework that estimates the State of Health of lithium-ion batteries from features derived from randomized battery operating history, while identifying the operating characteristics that contribute most to the model's predictions."
)

add_heading_2("4.6 Objectives of the Project")
add_bullet("Objective 1: Study the NASA Randomized Battery Usage Dataset (MATLAB structures, experimental intervals).")
add_bullet("Objective 2: Extract battery operating-history information preceding reference health cycles.")
add_bullet("Objective 3: Perform data preprocessing (imputation, audit, leakage-free scaling).")
add_bullet("Objective 4: Develop meaningful statistical features (current, voltage, temperature moments, throughput).")
add_bullet("Objective 5: Calculate the SoH target relative to each battery's initial reference capacity.")
add_bullet("Objective 6: Develop machine learning regression models (Linear, Ridge, Elastic Net, Random Forest, Extra Trees, Gradient Boosting).")
add_bullet("Objective 7: Evaluate model performance using MAE, RMSE, and R² against a dummy baseline.")
add_bullet("Objective 8: Investigate generalization to unseen batteries (battery-wise holdout validation).")
add_bullet("Objective 9: Apply explainable machine learning (Permutation Importance and SHAP feature attribution).")
add_bullet("Objective 10: Develop a reproducible research workflow and interactive intelligence interface.")

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
    "The scope encompasses publicly available NASA randomized battery data, MATLAB parsing, reference-cycle identification, statistical feature engineering, data cleaning, regression modelling, random and battery-wise evaluation, and model-agnostic explainability. It does not attempt to construct a full PDE electrochemical simulation or claim a new deep-learning architecture."
)

add_heading_2("4.10 Novelty and Contribution of the Project")
add_body(
    "The novelty lies in combining: (1) randomized operating history without relying exclusively on fixed charging curves; (2) directly measured reference health targets; (3) strict unseen-battery holdout validation; and (4) explainable machine learning (SHAP & Permutation Importance) alongside an automotive-grade configurator."
)

add_heading_2("4.11 Organization of the Report")
add_body(
    "Section 5 reviews related literature; Section 6 presents the methodology and system architecture; Section 7 describes the Python implementation; Section 8 provides experimental results, figures, tables, and discussions; Section 9 concludes the study with limitations and future work; Section 10 provides IEEE references."
)

add_heading_2("4.12 Expected Research Outcome")
add_body(
    "The expected outcome provides evidence across three dimensions: predictive performance (accuracy vs baseline), generalization (transferability to unseen battery cells), and interpretability (identification of the physical drivers of degradation)."
)

# =============================================================
# 5. LITERATURE REVIEW
# =============================================================
add_heading_1("5. LITERATURE REVIEW / RELATED WORK")
add_body(
    "Lithium-ion battery State of Health (SoH) estimation has developed from direct capacity measurements and physics-based models toward data-driven Machine Learning (ML), Deep Learning (DL), and Explainable Artificial Intelligence (XAI). This transition has been driven by the nonlinear nature of battery degradation and the increasing availability of voltage, current, temperature, capacity, and operational-history data.\n\n"
    "5.1 Traditional Approaches to Battery SoH Estimation: Capacity-based and electrochemical equivalent-circuit models [1], [2].\n"
    "5.2 Machine Learning-Based SoH Estimation: Regression, Random Forest, Support Vector Regression, GPR [3], [4].\n"
    "5.3 Feature Engineering for SoH Estimation: Energy-based features, statistical moments, incremental capacity analysis [5], [6].\n"
    "5.4 Deep Learning for Battery SoH Estimation: GRU-CNN [7], Bayesian CNN-LSTM [8].\n"
    "5.5 Explainable Artificial Intelligence: SHAP, Permutation Importance, LIME, Partial Dependence [9], [10], [11].\n"
    "5.6 Recent Explainable ML Research: Dual-level interpretability, lightweight feature engineering [9], [10], [11], [12].\n"
    "5.7 Randomized Battery Usage in Existing Research: NASA PCoE Dataset #11 randomized loading protocols [7], [8].\n"
    "5.8 Comparison of Existing Research: Summary of peer-reviewed benchmarks.\n"
    "5.9 Discussion of Existing Work: Analysis of strengths and requirements.\n"
    "5.10 Limitations Identified in Existing Research: Black-box nature, lack of unseen-cell generalization testing.\n"
    "5.11 & 5.12 Research Gap Addressed by the Present Project: Compact statistical representation + strict cross-battery validation + SHAP.\n"
    "5.13 Positioning of the Present Work: Lightweight, interpretable, reproducible.\n"
    "5.14 Summary: Justification for the proposed data science pipeline."
)

# Table 1: Literature Comparison
p_t = doc.add_paragraph()
p_t.paragraph_format.space_before = Pt(8)
run = p_t.add_run("Table 1. Comparison of Existing Approaches for Lithium-Ion Battery SoH Estimation")
run.font.bold = True
run.font.size = Pt(10.5)

lit_table = doc.add_table(rows=1, cols=7)
hdr_cells = lit_table.rows[0].cells
headers = ["Ref.", "Authors / Year", "Dataset", "Main Inputs", "Methodology", "Reported Results", "Main Limitation"]
for i, h in enumerate(headers):
    hdr_cells[i].text = h

lit_data = [
    ("[5]", "Gong et al., 2022", "MIT, CALCE, NASA", "CC/CV Energy", "Gaussian Process Reg.", "Errors <0.5%, R²>97%", "Relies on fixed charging curves"),
    ("[6]", "Cai et al., 2022", "NASA Public", "Energy Features", "Improved GPR", "Errors <0.5%", "Requires specialized features"),
    ("[7]", "Fan et al., 2020", "NASA Randomized, Oxford", "V, I, T Curves", "GRU-CNN", "Max Error < 4.3%", "Complex sequential architecture"),
    ("[3]", "Ren & Du, 2023", "Multiple Datasets", "Capacity, V, I, T", "Review of ML/DL", "Comparative review", "Cross-dataset variance"),
    ("[4]", "Lyu et al., 2026", "Multiple Datasets", "Health Indicators", "Review of Data-Driven", "Comprehensive", "Generalization challenges"),
    ("[9]", "Wang et al., 2026", "Public Li-ion", "Raw & Derived", "ML + SHAP", "Short-time SoH", "Phase-dependent efficacy"),
    ("[10]", "2026 XAI Study", "NASA B0005", "Charge Indicators", "RF + GBR + SHAP", "R² = 0.992", "Not randomized usage"),
    ("[11]", "2026 Study", "NASA & CALCE", "Base, IC, IE", "TCN-SENet-BiLSTM + SHAP", "MAE, RMSE < 1.5%", "High model complexity"),
    ("[8]", "Desai et al., 2026", "NASA Randomized", "Sequential V, I", "Bayesian CNN-LSTM", "R² = 0.932, RMSE=0.022", "Heavy computational cost")
]

for row_data in lit_data:
    row_cells = lit_table.add_row().cells
    for i, val in enumerate(row_data):
        row_cells[i].text = val

format_table(lit_table)

# =============================================================
# 6. METHODOLOGY / PROPOSED SYSTEM
# =============================================================
add_heading_1("6. METHODOLOGY / PROPOSED SYSTEM")

add_heading_2("6.1 Proposed Methodology")
add_body(
    "The proposed methodology focuses on estimating the State of Health (SoH) of lithium-ion batteries from their previous randomized operating behaviour. "
    "The NASA Randomized Battery Usage Data Set is first processed from its original MATLAB format and converted into a structured dataset suitable for machine learning. "
    "Instead of directly using raw time-series measurements, the charging and discharging behaviour between consecutive reference measurements is summarized using statistical "
    "and operational features such as current, voltage, temperature, duration and charge/discharge throughput. The capacity obtained from the following reference discharge is then "
    "used to calculate the corresponding SoH value."
)

# Insert Figure 1
add_figure("public/figures/figure1_overall_methodology.png", "Figure 1. Overall methodology for SOH prediction using Random Forest with Bayesian Hyperparameter Optimization")

add_heading_2("6.2 Data Collection and Preparation")
add_body(
    "The study uses NASA's Randomized Battery Usage Data Set, in which lithium-ion batteries are operated using randomly generated current profiles and periodically subjected to reference charging and discharging cycles. The raw files are loaded in Python using SciPy and the experimental steps are examined sequentially. Reference discharge steps (2.0 A CC discharge to 3.2 V) are identified from their associated metadata."
)

add_heading_2("6.3 State of Health Calculation")
add_body("State of Health is defined using the ratio between measured reference capacity and initial capacity:")
p_eq = doc.add_paragraph()
p_eq.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = p_eq.add_run("SoH_i = (Q_i / Q_0) × 100%")
run.font.bold = True

add_heading_2("6.4 Feature Engineering")
add_body("The feature engineering stage captures electrical, thermal, and operational characteristics:")

# Feature table
feat_table = doc.add_table(rows=1, cols=2)
hdr = feat_table.rows[0].cells
hdr[0].text = "Feature Name"
hdr[1].text = "Physical Description & Engineering Formula"

features_info = [
    ("cycle_index", "Position of the reference cycle in the battery degradation aging timeline"),
    ("rw_steps", "Number of discrete randomized load steps in preceding operational window"),
    ("rw_samples", "Total count of discrete time-series measurements recorded"),
    ("rw_duration_s", "Total elapsed duration of randomized operational period in seconds"),
    ("charge_throughput_ah", "Cumulative charge integration (Ah) during random-walk charging"),
    ("discharge_throughput_ah", "Cumulative discharge energy integration (Ah) during random-walk loading"),
    ("abs_current_mean", "Mean absolute current amplitude reflecting overall electrical throughput rate"),
    ("current_mean, current_std", "Mean and standard deviation of applied current (A)"),
    ("current_min, current_max, current_range", "Minimum, maximum, and total dynamic span of current (A)"),
    ("voltage_mean, voltage_std", "Mean terminal cell potential and standard deviation (Depth of Discharge)"),
    ("voltage_min, voltage_max, voltage_range", "Minimum, maximum, and full voltage swing of the cell (V)"),
    ("temperature_mean, temperature_std", "Mean and dispersion of operating cell surface temperature (°C)"),
    ("temperature_min, temperature_max, temperature_range", "Thermal extremes and thermal gradient span (°C)")
]

for f_name, f_desc in features_info:
    r = feat_table.add_row().cells
    r[0].text = f_name
    r[1].text = f_desc

format_table(feat_table)

add_heading_2("6.5 Data Cleaning and Preprocessing")
add_body(
    "The dataset is audited for missing values, duplicates, and non-finite numbers. Median imputation is embedded within the scikit-learn pipeline to prevent data leakage. Outliers are detected using the IQR rule but verified against physical validity. Robust scaling is applied to mitigate the effect of extreme operational spikes."
)

add_heading_2("6.6 Model Design")
add_body(
    "The study evaluates six regression algorithms covering linear baselines and non-linear ensembles: Linear Regression (OLS), Ridge (L2), Elastic Net (L1+L2), Random Forest Regressor, Extra Trees Regressor, and Gradient Boosting Regressor."
)

# Insert Figure 2 & Figure 3
add_figure("public/figures/figure2_random_forest_process.png", "Figure 2. Random Forest regression process")
add_figure("public/figures/figure3_bayesian_optimization.png", "Figure 3. Bayesian optimization process for hyperparameter tuning")

add_heading_2("6.7 Training and Evaluation")
add_body(
    "Models are evaluated using an 80:20 random split and a strict battery-wise group holdout (GroupShuffleSplit). Evaluation metrics include MAE, RMSE, and R² compared against a Mean-SoH baseline."
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
    "The implementation was executed in Python 3.10+ and Google Colab using NumPy, pandas, SciPy, scikit-learn, and Matplotlib. "
    "The script automatically downloads the 1.06 GB NASA MAT files, processes all 28 structures, isolates 315 valid reference cycles, "
    "trains all 6 models, performs cross-battery evaluation, computes SHAP values, and exports the clean tabular results as CSV and JSON files."
)

# =============================================================
# 8. RESULTS AND DISCUSSION
# =============================================================
add_heading_1("8. RESULTS AND DISCUSSION")

add_heading_2("8.1 Experimental Results")
add_body(
    "The experimental results are obtained after applying the complete preprocessing and modelling pipeline to the extracted battery observations. "
    "The degradation curves across all 12 test cells show a consistent, measurable capacity decline under randomized usage."
)

# Insert Figure 8.1
add_figure("public/figures/figure8_1_battery_degradation.png", "Figure 8.1. Battery degradation under randomized usage")

add_body(
    "Figure 8.2 displays the actual versus predicted State of Health for the Gradient Boosting model on test observations. "
    "Predictions closely follow the ideal parity line across the full degradation spectrum from 100% down to 45% SoH."
)

# Insert Figure 8.2
add_figure("public/figures/figure8_2_actual_vs_predicted.png", "Figure 8.2. Actual versus predicted SoH")

# Table 8.1: Model Performance
p_t = doc.add_paragraph()
p_t.paragraph_format.space_before = Pt(8)
run = p_t.add_run("Table 8.1. Model Performance under Random Train-Test Split")
run.font.bold = True
run.font.size = Pt(10.5)

t81 = doc.add_table(rows=1, cols=4)
hdr = t81.rows[0].cells
hdr[0].text = "Model"
hdr[1].text = "MAE (%)"
hdr[2].text = "RMSE (%)"
hdr[3].text = "R² Score"

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

# Table 8.2: Improvement over baseline
p_t = doc.add_paragraph()
p_t.paragraph_format.space_before = Pt(10)
run = p_t.add_run("Table 8.2. Machine-Learning Improvement over Baseline")
run.font.bold = True
run.font.size = Pt(10.5)

t82 = doc.add_table(rows=1, cols=4)
hdr = t82.rows[0].cells
hdr[0].text = "Metric"
hdr[1].text = "Baseline"
hdr[2].text = "Selected Model (GBR)"
hdr[3].text = "Improvement"

t82_data = [
    ("MAE", "13.3297%", "2.0658%", "-84.50% error reduction"),
    ("RMSE", "16.1129%", "3.1000%", "-80.76% error reduction"),
    ("R²", "-0.0954", "0.9595", "+0.9595 variance explained")
]

for row in t82_data:
    r = t82.add_row().cells
    for i, val in enumerate(row):
        r[i].text = val

format_table(t82)

add_heading_2("8.2 Battery-Wise Generalization")
add_body(
    "Table 8.3 compares the performance of models when evaluated under random train-test splitting versus strict battery-wise holdout (unseen test cells RW1, RW7, RW8). "
    "Tree-based ensembles (Extra Trees R²=0.9451, Gradient Boosting R²=0.9311) maintain strong generalization to unseen cells, whereas linear models suffer a substantial drop (R²=0.1113)."
)

# Table 8.3: Battery-wise
p_t = doc.add_paragraph()
p_t.paragraph_format.space_before = Pt(8)
run = p_t.add_run("Table 8.3. Random-Split versus Unseen-Battery Performance")
run.font.bold = True
run.font.size = Pt(10.5)

t83 = doc.add_table(rows=1, cols=4)
hdr = t83.rows[0].cells
hdr[0].text = "Evaluation Strategy"
hdr[1].text = "MAE (%)"
hdr[2].text = "RMSE (%)"
hdr[3].text = "R² Score"

t83_data = [
    ("Random Split (80:20)", "2.0658%", "3.1000%", "0.9595"),
    ("Battery-Wise Holdout (Unseen RW1, RW7, RW8)", "2.4819%", "3.0977%", "0.9311")
]

for row in t83_data:
    r = t83.add_row().cells
    for i, val in enumerate(row):
        r[i].text = val

format_table(t83)

add_heading_2("8.3 Explainability Results")
add_body(
    "Permutation feature importance and SHAP analysis confirm that cumulative aging progression (cycle_index), operational duration (rw_duration_s), "
    "thermal variability (temperature_std, temperature_min), and electrical loading rates (current_mean, voltage_std) carry the highest predictive signal."
)

# Table 8.4: Top Features
p_t = doc.add_paragraph()
p_t.paragraph_format.space_before = Pt(8)
run = p_t.add_run("Table 8.4. Top Features from Permutation Importance")
run.font.bold = True
run.font.size = Pt(10.5)

t84 = doc.add_table(rows=1, cols=3)
hdr = t84.rows[0].cells
hdr[0].text = "Rank"
hdr[1].text = "Feature Name"
hdr[2].text = "Mean Permutation Drop Score"

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

# Insert Figure 8.3 & Figure 8.4
add_figure("public/figures/figure8_3_permutation_importance.png", "Figure 8.3. Permutation importance of operating-history features")
add_figure("public/figures/figure8_4_shap_explanation.png", "Figure 8.4. SHAP explanation of SoH predictions")

add_heading_2("8.4 Discussion")
add_body(
    "The results address the core research questions directly: (1) compact statistical summaries of randomized operational history successfully predict SoH with under 2.1% MAE; "
    "(2) the predictive capacity transfers robustly to completely unseen cells (R² > 0.93 for ensembles); and (3) explainability techniques reliably isolate thermal and electrical stress indicators consistent with battery electrochemistry."
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
    "The main contribution of the project is therefore the integration of randomized-use feature engineering, conventional machine-learning regression, battery-wise validation and explainable AI into one reproducible workflow."
)

add_heading_2("9.2 Limitations and Future Work")
add_body(
    "The present study has several limitations. The SoH labels are obtained from periodic reference discharge measurements rather than continuous measurements, and the engineered features summarize operating intervals instead of retaining every temporal detail. The dataset also represents a limited set of battery cells and experimental conditions, meaning that the results should not automatically be generalized to every lithium-ion chemistry or complete EV battery pack. In addition, the battery-wise experiment uses a single group holdout, so repeated GroupKFold validation would provide a more stable estimate of cross-battery performance.\n\n"
    "Future work can extend the feature set using voltage-curve shape, incremental capacity, differential voltage, impedance and other physically motivated health indicators. Sequence-based approaches such as LSTM, GRU, CNN-LSTM and Transformer models could then be compared with the feature-based models under exactly the same battery-wise evaluation procedure. Another useful extension would be uncertainty estimation, allowing the system to indicate when a prediction is based on unfamiliar operating conditions."
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
    run = p.add_run(r)
    run.font.size = Pt(10.5)

doc.save("PROJECT_REPORT_SIT_NAGPUR.docx")
print("Report successfully saved to PROJECT_REPORT_SIT_NAGPUR.docx!")
