# Explainable Machine Learning Approaches for State of Health (SoH) Estimation of Lithium-Ion Batteries

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![Scikit-Learn](https://img.shields.io/badge/scikit--learn-1.x-F7931E?logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Academic Coursework**: Data Science Mini-Project CA3 (Group A)  
> **Institution**: Symbiosis Institute of Technology (SIT), Nagpur  
> **Student**: Shlok Vij (PRN: `230705211143`, Semester VII, Section B)  
> **Faculty Guide / Reviewer**: Department of Computer Science & Engineering

---

## ⚡ Executive Summary

Accurate estimation of **State of Health (SoH)** in Lithium-ion batteries is critical for electric vehicles (EVs) and energy storage systems to prevent sudden failure, optimize charging strategies, and ensure safe end-of-life repurposing.

This repository provides an **end-to-end, research-grade predictive intelligence system** trained on the official **NASA Ames Prognostics Center of Excellence (PCoE) Randomized Battery Dataset #11** (18650 LiNiMnCoO2 cells, 315 segmented reference cycles across 12 distinct cells).

Unlike typical black-box models or generic dashboard mockups, this project combines **rigorous data science benchmarks** (Gradient Boosting, Extra Trees, Random Forest, Ridge, Linear Regression, Elastic Net) with an **automotive-grade, interactive web application** featuring explainable AI (SHAP & Permutation Importance), real-time "What If?" degradation simulations, actionable battery health preservation tips, and automated PDF diagnostic report generation.

---

## 🏎️ Key Features & System Capabilities

### 1. Interactive Battery Intelligence Configurator
- **Macroscopic to Microscopic Feature Mapping**: Transforms real-world EV usage metrics (nominal pack kWh, odometer mileage, battery age, starting SoC, target SoC ceiling, DC fast-charging frequency, and operating temperature) into the 23 statistical moments expected by the NASA cell degradation pipeline.
- **Real-Time Predictive Inference**: Instantly computes estimated battery State of Health with model confidence intervals.

### 2. Explainable AI (XAI) Feature Attribution
- **SHAP & Permutation Importance**: Transparently displays the mathematical factors driving degradation (e.g., cumulative driving cycles, ambient thermal stress, DC fast charging C-rate strain, and high-voltage saturation holding).

### 3. Live "What If?" Scenario Simulator
- **Interactive Recovery Estimation**: Re-executes the machine learning inference model in real-time as users adjust charging ceilings (e.g., 100% vs 80%) or fast charging frequency, calculating exact percentage SoH recovery and extended cell lifetime.

### 4. Actionable Battery Health Preservation Protocol
- Contextual engineering guidelines based on electrochemistry:
  - **The 20%–80% Optimal Cycling Window**: Mitigates high-voltage cathode oxidation and copper dissolution risks.
  - **Thermal Management & Preconditioning**: Prevents Arrhenius-accelerated solid electrolyte interphase (SEI) growth in hot climates.
  - **AC Level 2 vs. DC Fast Charging Ratio**: Minimizes localized lithium plating and micro-cracking.
  - **Overnight Saturation Soak Prevention**: Eliminates calendar degradation from holding cells at 100% SoC.

### 5. Automated PDF Diagnostic Certificate & Report Generator
- Produces a print-ready, formatted diagnostic certificate containing full vehicle telemetry, degradation attribution, actionable preservation tips, and official academic research credentials.

### 6. Full Research Performance & Generalization Suite
- **Degradation Trajectories**: Capacity fade curves across all 12 NASA test cells.
- **Actual vs. Predicted Parity Scatter**: Visual validation of model accuracy ($R^2 = 0.9595$).
- **Multi-Model Benchmark Table**: Comprehensive comparison of 6 regressors against dummy baseline.
- **Battery-Wise Cross-Validation (`GroupShuffleSplit`)**: Generalization testing on completely unseen cells (`RW1`, `RW7`, `RW8`).

---

## 📊 Benchmark Results on NASA Ames Dataset #11

### 80/20 Random Train/Test Split Benchmark

| Model | MAE (%) | RMSE (%) | $R^2$ Score | Error Reduction vs Baseline |
|---|---|---|---|---|
| **Gradient Boosting** (Selected) | **2.0658%** | **3.1000%** | **0.9595** | **-80.76%** |
| **Extra Trees Regressor** | **2.0091%** | **3.1122%** | **0.9591** | **-80.69%** |
| **Random Forest Regressor** | 2.3174% | 3.5887% | 0.9457 | -77.73% |
| **Ridge Regression** | 2.8408% | 4.0081% | 0.9322 | -75.13% |
| **Linear Regression (OLS)** | 3.0246% | 4.0649% | 0.9303 | -74.77% |
| **Elastic Net** | 3.5801% | 4.9965% | 0.8947 | -68.99% |
| *Mean Dummy Baseline* | *13.3297%* | *16.1129%* | *0.0000* | *0.00%* |

### Unseen Battery Cell Holdout (`GroupShuffleSplit`)
To evaluate true zero-leakage transfer capability, models were evaluated on unseen cells (`RW1`, `RW7`, `RW8`):
- **Gradient Boosting**: Maintained robust generalization ($R^2 = 0.9311$, $\text{RMSE} = 3.99\%$).
- **Extra Trees**: Highest transfer fidelity ($R^2 = 0.9451$, $\text{RMSE} = 3.56\%$).
- **Linear Models**: Collapsed to $R^2 = 0.1113$, demonstrating that **non-linear feature interactions are essential** for cross-battery health transfer.

---

## 🗂️ Repository File Structure

```
├── public/
│   ├── data/
│   │   ├── battery_soh_cleaned.csv                  # Cleaned reference cycles (315 cycles, 23 features)
│   │   ├── feature_stats.json                       # Feature distribution statistics
│   │   ├── python_model_results_random_split.csv    # 6-model random split metrics
│   │   ├── python_model_results_batterywise.csv     # 6-model GroupShuffleSplit metrics
│   │   ├── python_permutation_importance.csv        # Permutation feature importance weights
│   │   └── results.json                             # Unified research & benchmark data
│   └── favicon.svg                                  # Application icon
├── src/
│   ├── components/
│   │   ├── BatteryHealthEstimator.tsx               # 2-step EV configurator & inference engine
│   │   ├── DiagnosticReportModal.tsx                # Printable / PDF battery diagnostic certificate
│   │   ├── OpeningSequence.tsx                      # Luminous automotive boot animation
│   │   ├── HeroSection.tsx                          # Product hero section & canvas container
│   │   ├── HeroCanvas.tsx                           # Contained canvas visualization
│   │   ├── Navigation.tsx                           # Top telemetry header
│   │   ├── CompactHowItWorks.tsx                    # 4-pillar compact engineering pipeline
│   │   ├── ResultsSuiteSection.tsx                  # Tabbed model benchmarks & degradation plots
│   │   ├── FindingsAndPositioningSection.tsx        # Novelty, limitations & academic findings
│   │   ├── LiveExperimentModal.tsx                  # Live experiment runner modal
│   │   ├── MethodologyDrawer.tsx                    # Data cleaning & feature screening drawer
│   │   └── UniversityReportModal.tsx                # 24-chapter full academic report
│   ├── types/
│   │   └── research.ts                              # TypeScript schema definitions
│   ├── utils/
│   │   └── modelInference.ts                        # Transformation layer & prediction formulas
│   ├── App.tsx                                      # Main React root component
│   ├── main.tsx                                     # Application entry point
│   └── index.css                                    # Tailwind design system & print styling
├── Explainable_ML_Battery_SoH_Colab_RESEARCH.ipynb  # Interactive Google Colab research notebook
├── run_experiment.py                                # End-to-end Python ML pipeline & data exporter
├── index.html                                       # HTML template
├── package.json                                     # NPM dependencies & scripts
├── tsconfig.json                                    # TypeScript configuration
├── tailwind.config.js                               # Tailwind styling rules
├── vite.config.ts                                   # Vite configuration
└── README.md                                        # Project documentation
```

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/Svizzcodes/EVBatteryHealthCalculatorMLModel.git
cd EVBatteryHealthCalculatorMLModel
```

### 2. Launch the Web Application
```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. (Optional) Re-Run the Machine Learning Pipeline
To re-download the NASA Ames Dataset #11, extract all reference cycles, train all 6 models, compute SHAP/Permutation importance, and export `results.json`:
```bash
# Create Python environment
python3 -m venv venv
source venv/bin/activate

# Install required Python packages
pip install numpy pandas scipy scikit-learn matplotlib seaborn requests

# Run experiment
python run_experiment.py
```

---

## 🔬 Methodology & Feature Engineering

The NASA Ames Prognostics Center of Excellence Dataset #11 contains 28 MAT files spanning 12 lithium-ion 18650 cells cycled under randomized usage profiles at 25°C and 40°C. 

Our pipeline isolates **315 benchmark reference discharge cycles** ($2.0\text{A}$ discharge to $3.2\text{V}$) and extracts **23 statistical and physical features**:
1. **Cycle Index**: Normalized aging progression.
2. **Thermal Dynamics**: Mean, standard deviation, minimum, maximum, and range of temperature during cycling.
3. **Current & C-Rate Dynamics**: Mean, absolute mean, standard deviation, and extremes of charge/discharge current.
4. **Voltage Moments (Depth of Discharge)**: Mean, standard deviation, minimum, and maximum terminal voltages.
5. **Operational Profiles**: Cumulative charge/discharge throughput (Ah) and duration of random-walk periods.

---

## 📜 Academic Integrity & Citation

This project is submitted in fulfillment of the **Data Science Mini-Project CA3 (Group A)** requirement at **Symbiosis Institute of Technology (SIT), Nagpur**.

- **Dataset Credit**: NASA Ames Prognostics Center of Excellence (PCoE) Randomized Battery Usage Data Set (B. Saha, K. Goebel).
- **Author**: Shlok Vij (PRN: `230705211143`)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
