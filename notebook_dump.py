=== CELL 0 (markdown) ===
# Explainable Machine Learning Approaches for State of Health Estimation of Lithium-Ion Batteries

**Student:** SHLOK VIJ  
**PRN:** 230705211143  
**Semester:** VII | **Section:** B  
**Subject:** Data Science Group A

## Research Question
Can measurable characteristics extracted from randomized battery-use history estimate Li-ion battery State of Health (SoH), and can explainable ML identify which operating characteristics contribute most to the estimate?

## Research Hypothesis
**H1:** Features derived from randomized operating history contain predictive information about battery SoH, and an ML regression model can estimate SoH better than a simple mean-SoH baseline.

## Project-Level Novelty
This project does not claim a new battery-aging algorithm. Its contribution is a lightweight, reproducible pipeline that converts randomized-use intervals into interpretable operating-history features, compares several regression models, tests performance on unseen batteries, and combines prediction quality with model-agnostic explainability. This makes the result useful as a Data Science study rather than only a model-comparison exercise.

The final result is generated directly from the NASA Randomized Battery Usage Data Set; no performance values are hard-coded.


=== CELL 1 (markdown) ===
## Literature Review / Positioning

The final report requires an empirical review table. The studies below are included to position this project; their datasets and evaluation protocols are not identical, so their numerical results should not be treated as a direct leaderboard against this experiment.

| Reference | Method Used | Findings | Reported Results | Limitation / Gap relevant to this project |
|---|---|---|---|---|
| Fan et al. (2020) | GRU-CNN deep learning | Learns temporal information directly from charging curves | Maximum estimation error reported within 4.3% on NASA and Oxford datasets | Uses raw charging-curve sequences and a comparatively complex deep model |
| Wu et al. (2022) | Convolutional/recurrent autoencoders + ensemble GRU | Automatically extracts low-dimensional health features from charging profiles | LOO cross-validation reported RMSE = 1.04% and MAE = 0.77% | More complex sequence/representation learning; explainability is not the main focus |
| Feature engineering and explainable AI for SoH estimation (2026) | Feature engineering + Random Forest / Gradient Boosting + SHAP | Shows that engineered health indicators can make battery predictions interpretable | R² = 0.992 reported for the NASA B0005 dataset | Uses a different NASA battery dataset; result is not directly comparable with this randomized-use experiment |
| Desai et al. (2026) | Bayesian CNN-LSTM | Models randomized-use temporal patterns and predictive uncertainty | R² = 0.932 and RMSE = 0.022 on the NASA randomized battery usage dataset | Deep sequence model; this project instead studies a lightweight feature-based approach and explicit unseen-battery validation |

**Research gap addressed at project scope:** Instead of claiming a new state-of-the-art architecture, this study asks a narrower and reproducible question: *how much SoH information can be recovered from compact statistics of randomized operating history, and do those relationships remain useful when entire batteries are held out?* Explainability is then used to identify the operating-history variables driving the result.


=== CELL 2 (markdown) ===
## 2. Dataset, Tools and Research Workflow

The NASA Randomized Battery Usage Data Set contains batteries operated with randomly generated current profiles and periodic reference charge/discharge cycles used as health benchmarks. The dataset is therefore suitable for asking whether the recent randomized operating history contains information about subsequent battery health.

**Workflow:** raw MATLAB data → reference-cycle segmentation → operating-history feature extraction → SoH target calculation → data cleaning → feature screening → preprocessing → regression models → random-split and unseen-battery evaluation → explainability → research outcome.

**Tools:** Python, pandas, NumPy, SciPy, scikit-learn, Matplotlib, Seaborn and SHAP.


=== CELL 3 (code) ===
# Required libraries
!pip -q install shap scipy scikit-learn pandas matplotlib seaborn openpyxl

import os, zipfile, warnings, re
from pathlib import Path
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

from scipy.io import loadmat
from sklearn.model_selection import train_test_split, GroupShuffleSplit
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, RobustScaler
from sklearn.impute import SimpleImputer
from sklearn.feature_selection import f_regression, mutual_info_regression
from sklearn.linear_model import LinearRegression, Ridge, ElasticNet
from sklearn.ensemble import RandomForestRegressor, ExtraTreesRegressor, GradientBoostingRegressor
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.inspection import permutation_importance

warnings.filterwarnings("ignore")
pd.set_option("display.max_columns", 100)
sns.set_theme(style="whitegrid")

print("Libraries loaded.")


=== CELL 4 (markdown) ===
## 3. Download and Extract

**Why:** The official NASA source makes the experiment reproducible. The ZIP is cached during the current Colab runtime so it is not downloaded again unnecessarily.


=== CELL 5 (code) ===
import urllib.request

URL = "https://phm-datasets.s3.amazonaws.com/NASA/11.+Randomized+Battery+Usage+Data+Set.zip"
ZIP_PATH = Path("/content/nasa_randomized_battery.zip")
ROOT = Path("/content/nasa_randomized_battery")

if not ZIP_PATH.exists():
    print("Downloading NASA dataset...")
    urllib.request.urlretrieve(URL, ZIP_PATH)
    print("Download complete.")
else:
    print("Using cached NASA ZIP.")

ROOT.mkdir(exist_ok=True)

# Extract outer ZIP
with zipfile.ZipFile(ZIP_PATH, "r") as z:
    z.extractall(ROOT)

# Extract the seven nested ZIP files
nested = list(ROOT.rglob("*.zip"))
print("Nested ZIP files:", len(nested))

for zpath in nested:
    out = zpath.parent / (zpath.stem + "_extracted")
    out.mkdir(exist_ok=True)
    try:
        with zipfile.ZipFile(zpath, "r") as z:
            z.extractall(out)
    except zipfile.BadZipFile:
        print("Skipped invalid ZIP:", zpath.name)

mat_files = sorted(ROOT.rglob("*.mat"))
print("MATLAB files found:", len(mat_files))

if not mat_files:
    raise FileNotFoundError("No .mat files found after extracting the nested ZIPs.")

print("Example:", mat_files[0])


=== CELL 6 (markdown) ===
## 4. Raw Data Inspection

**Why:** The raw files are MATLAB structures rather than normal tabular files, so we inspect one file before parsing it.


=== CELL 7 (code) ===
sample = loadmat(mat_files[0], squeeze_me=True, struct_as_record=False)

print("Top-level variables:",
      [k for k in sample if not k.startswith("__")])

data = sample.get("data")
print("data type:", type(data))
print("data fields:", getattr(data, "_fieldnames", None))

steps = np.atleast_1d(getattr(data, "step", []))
print("Number of steps:", len(steps))

if len(steps):
    print("First step fields:", getattr(steps[0], "_fieldnames", None))


=== CELL 8 (markdown) ===
## 5. Feature Extraction and Feature Generation

**Why:** The raw measurements contain time-series samples. We summarize the randomized-use history between two reference discharges into one learning row. Features include current, voltage, temperature, duration and charge/discharge throughput.

The next reference-discharge capacity becomes the target, so future health information is not used as an input.


=== CELL 9 (code) ===
def text_value(x):
    if x is None:
        return ""
    if isinstance(x, bytes):
        return x.decode(errors="ignore")
    if isinstance(x, str):
        return x
    a = np.asarray(x)
    if a.dtype.kind in "US":
        return "".join(a.astype(str).ravel()).strip()
    return str(x).strip()

def numeric_array(x):
    if x is None:
        return np.array([], dtype=float)
    try:
        a = np.asarray(x, dtype=float).squeeze()
        return a[np.isfinite(a)]
    except Exception:
        return np.array([], dtype=float)

def time_seconds(step):
    t = numeric_array(getattr(step, "relativeTime", None))
    if len(t) >= 2:
        return t
    return numeric_array(getattr(step, "time", None))

def capacity_ah(step):
    t = time_seconds(step)
    i = numeric_array(getattr(step, "current", None))
    n = min(len(t), len(i))
    if n < 2:
        return np.nan
    t, i = t[:n], i[:n]
    order = np.argsort(t)
    t, i = t[order], i[order]
    if np.ptp(t) == 0:
        return np.nan
    return abs(np.trapezoid(i, t)) / 3600.0

def step_arrays(step):
    return (
        time_seconds(step),
        numeric_array(getattr(step, "voltage", None)),
        numeric_array(getattr(step, "current", None)),
        numeric_array(getattr(step, "temperature", None))
    )

def stats(a, prefix):
    if not a:
        return {}
    a = np.asarray(a, dtype=float)
    return {
        f"{prefix}_mean": np.nanmean(a),
        f"{prefix}_std": np.nanstd(a),
        f"{prefix}_min": np.nanmin(a),
        f"{prefix}_max": np.nanmax(a),
        f"{prefix}_range": np.nanmax(a) - np.nanmin(a)
    }

def summarize_history(steps):
    voltage, current, temperature = [], [], []
    durations = []
    charge_ah = discharge_ah = 0.0

    for s in steps:
        t, v, i, temp = step_arrays(s)

        if len(t):
            durations.append(np.nanmax(t) - np.nanmin(t))
        if len(v):
            voltage.extend(v)
        if len(i):
            current.extend(i)
        if len(temp):
            temperature.extend(temp)

        if len(t) >= 2 and len(i) >= 2:
            n = min(len(t), len(i))
            q = abs(np.trapezoid(i[:n], t[:n])) / 3600.0
            if np.nanmean(i[:n]) >= 0:
                charge_ah += q
            else:
                discharge_ah += q

    out = {
        "rw_steps": len(steps),
        "rw_samples": len(current),
        "rw_duration_s": np.nansum(durations),
        "charge_throughput_ah": charge_ah,
        "discharge_throughput_ah": discharge_ah,
        "abs_current_mean": np.nanmean(np.abs(current)) if current else np.nan
    }
    out.update(stats(current, "current"))
    out.update(stats(voltage, "voltage"))
    out.update(stats(temperature, "temperature"))
    return out

def parse_battery(mat_path):
    raw = loadmat(mat_path, squeeze_me=True, struct_as_record=False)
    data = raw.get("data")
    if data is None:
        return []

    steps = np.atleast_1d(getattr(data, "step", []))
    history = []
    rows = []

    for s in steps:
        comment = text_value(getattr(s, "comment", "")).lower()

        if "reference discharge" in comment:
            cap = capacity_ah(s)

            if history and np.isfinite(cap):
                row = summarize_history(history)
                row["battery_id"] = mat_path.stem
                row["target_capacity_ah"] = cap
                rows.append(row)

            history = []

        elif "random walk" in comment:
            history.append(s)

    return rows

print("Feature-extraction functions ready.")


=== CELL 10 (markdown) ===
## 6. Build the Cycle-Level Dataset and Calculate SoH

**Why:** SoH is expressed relative to each battery's initial reference capacity. Cycle index is generated within each battery so degradation can be visualized.


=== CELL 11 (code) ===
all_rows = []

for i, path in enumerate(mat_files, 1):
    try:
        all_rows.extend(parse_battery(path))
    except Exception as e:
        print("Skipped:", path.name, "|", e)

df = pd.DataFrame(all_rows)

if df.empty:
    raise ValueError("No cycle-level observations were created. Inspect the MATLAB comments/structure.")

df["initial_capacity_ah"] = df.groupby("battery_id")["target_capacity_ah"].transform("first")
df["SoH"] = 100 * df["target_capacity_ah"] / df["initial_capacity_ah"]
df["cycle_index"] = df.groupby("battery_id").cumcount() + 1

print("Final cycle-level shape:", df.shape)
display(df.head())


=== CELL 12 (markdown) ===
## 7. Missing Values and Duplicates

**Why:** Missing values are reported before modeling and exact duplicates are removed. Remaining numeric missing values are handled inside the training pipeline using median imputation, which avoids using test-set information to calculate the imputation value.


=== CELL 13 (code) ===
# Missing-value report
missing = df.isna().sum().sort_values(ascending=False)
display(missing[missing > 0].to_frame("missing_count"))

# Exact duplicates
before = len(df)
df = df.drop_duplicates().reset_index(drop=True)
print("Duplicate rows removed:", before - len(df))

# Invalid infinities
df = df.replace([np.inf, -np.inf], np.nan)

# A row without target SoH cannot be supervised
df = df.dropna(subset=["SoH"]).reset_index(drop=True)

print("Shape after quality cleanup:", df.shape)


=== CELL 14 (markdown) ===
## 8. Outlier Detection

**Why:** The IQR rule identifies unusual values for inspection. We do not automatically delete them because extreme current, temperature or duration values may represent genuine randomized operating conditions. RobustScaler later reduces the influence of scale differences and extreme values.


=== CELL 15 (code) ===
numeric_cols = df.select_dtypes(include=np.number).columns.tolist()

exclude = ["SoH", "target_capacity_ah", "initial_capacity_ah"]
outlier_features = [c for c in numeric_cols if c not in exclude]

report = []

for c in outlier_features:
    q1, q3 = df[c].quantile([0.25, 0.75])
    iqr = q3 - q1
    lo, hi = q1 - 1.5 * iqr, q3 + 1.5 * iqr
    count = ((df[c] < lo) | (df[c] > hi)).sum()
    report.append([c, count, lo, hi])

outlier_report = pd.DataFrame(
    report,
    columns=["feature", "outlier_count", "lower_bound", "upper_bound"]
).sort_values("outlier_count", ascending=False)

display(outlier_report.head(15))



=== CELL 16 (markdown) ===
## 9. One Essential Exploratory Visualization

The report format asks for graphs and interpretation. Rather than filling the notebook with diagnostic plots, we keep the visualization that directly supports the research question: the degradation trajectory of each battery under randomized usage.


=== CELL 17 (code) ===
# Battery degradation curves — retained because they directly support the research question
plt.figure(figsize=(11, 6))
for bid, g in df.groupby("battery_id"):
    g = g.sort_values("cycle_index")
    plt.plot(g["cycle_index"], g["SoH"], alpha=0.45, linewidth=1)

mean_curve = df.groupby("cycle_index")["SoH"].mean().reset_index()
plt.plot(mean_curve["cycle_index"], mean_curve["SoH"], linewidth=3, label="Mean SoH")
plt.xlabel("Reference Cycle / Randomized-Use Progression")
plt.ylabel("State of Health (%)")
plt.title("Battery Health Degradation Under Randomized Usage")
plt.legend()
plt.grid(alpha=0.3)
plt.tight_layout()
plt.show()



=== CELL 18 (markdown) ===
## 10. Feature Selection

**Why:** Pearson correlation measures linear association, F-score measures univariate regression relevance, and mutual information can detect nonlinear dependence. Their normalized scores are combined only to produce a transparent ranking.


=== CELL 19 (code) ===
target = "SoH"

candidate = [
    c for c in df.columns
    if c not in [
        target, "battery_id",
        "target_capacity_ah", "initial_capacity_ah"
    ]
]

X_fs = df[candidate].copy()
X_fs = X_fs.replace([np.inf, -np.inf], np.nan)
X_fs = X_fs.fillna(X_fs.median(numeric_only=True))
y_fs = df[target]

corr_score = X_fs.corrwith(y_fs).abs()
f_score, _ = f_regression(X_fs, y_fs)
mi_score = mutual_info_regression(X_fs, y_fs, random_state=42)

selection = pd.DataFrame({
    "feature": candidate,
    "correlation": corr_score.values,
    "f_score": f_score,
    "mutual_information": mi_score
})

for c in ["correlation", "f_score", "mutual_information"]:
    selection[c + "_norm"] = (
        (selection[c] - selection[c].min()) /
        (selection[c].max() - selection[c].min() + 1e-12)
    )

selection["combined_score"] = selection[
    ["correlation_norm", "f_score_norm", "mutual_information_norm"]
].mean(axis=1)

selection = selection.sort_values("combined_score", ascending=False)
display(selection.head(15))



=== CELL 20 (markdown) ===
## 11. Feature Encoding and Normalization

**Why:** `profile_group` is categorical, so it is one-hot encoded. Numerical variables have different units, so they are imputed and scaled with RobustScaler. The transformation is learned only from training data through the pipeline.


=== CELL 21 (code) ===
def profile_group(name):
    m = re.search(r"(\d+)", str(name))
    n = int(m.group(1)) if m else 0

    if 1 <= n <= 4: return "Part_1"
    if 5 <= n <= 8: return "Part_2"
    if 9 <= n <= 12: return "Part_3"
    if 13 <= n <= 16: return "Part_4"
    if 17 <= n <= 20: return "Part_5"
    if 21 <= n <= 24: return "Part_6"
    if 25 <= n <= 28: return "Part_7"
    return "Other"

df["profile_group"] = df["battery_id"].apply(profile_group)

selected_features = selection.head(15)["feature"].tolist()
selected_features = [c for c in selected_features if c in df.columns]

X = df[selected_features + ["profile_group"]].copy()
y = df["SoH"].copy()
groups = df["battery_id"].copy()

print("Selected numerical features:", selected_features)
print("Categorical feature: profile_group")


=== CELL 22 (markdown) ===
## 12. Train/Test Split and Preprocessing Pipeline

A conventional 80/20 split is used first. Median imputation, one-hot encoding and RobustScaler are placed inside a pipeline so preprocessing is learned from the training data only.


=== CELL 23 (code) ===
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.20, random_state=42
)

numeric_features = [c for c in X.columns if c != "profile_group"]
categorical_features = ["profile_group"]

preprocess = ColumnTransformer([
    (
        "num",
        Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", RobustScaler())
        ]),
        numeric_features
    ),
    (
        "cat",
        Pipeline([
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("encoder", OneHotEncoder(handle_unknown="ignore"))
        ]),
        categorical_features
    )
])

print("Training observations:", len(X_train))
print("Testing observations :", len(X_test))


=== CELL 24 (markdown) ===
## 13. Regression Models

The project compares a simple baseline and regularized linear models with nonlinear ensemble models: **Linear Regression, Ridge, Elastic Net, Random Forest, Extra Trees and Gradient Boosting**.


=== CELL 25 (code) ===
models = {
    "Linear Regression": LinearRegression(),
    "Ridge": Ridge(alpha=1.0),
    "Elastic Net": ElasticNet(
        alpha=0.01, l1_ratio=0.5,
        max_iter=10000, random_state=42
    ),
    "Random Forest": RandomForestRegressor(
        n_estimators=200, random_state=42, n_jobs=-1
    ),
    "Extra Trees": ExtraTreesRegressor(
        n_estimators=200, random_state=42, n_jobs=-1
    ),
    "Gradient Boosting": GradientBoostingRegressor(
        n_estimators=150, learning_rate=0.05,
        max_depth=3, random_state=42
    )
}

results = []
fitted_models = {}

for name, model in models.items():

    pipe = Pipeline([
        ("preprocess", preprocess),
        ("model", model)
    ])

    pipe.fit(X_train, y_train)
    pred = pipe.predict(X_test)

    results.append({
        "Model": name,
        "MAE": mean_absolute_error(y_test, pred),
        "RMSE": np.sqrt(mean_squared_error(y_test, pred)),
        "R2": r2_score(y_test, pred)
    })

    fitted_models[name] = pipe

results_df = pd.DataFrame(results).sort_values("RMSE")
display(results_df.style.format({
    "MAE": "{:.4f}",
    "RMSE": "{:.4f}",
    "R2": "{:.4f}"
}))


=== CELL 26 (markdown) ===
## 14. Model Comparison — Core Result Table

The report requires comparison of approaches. The numerical table is more useful than several separate diagnostic charts: lower MAE/RMSE is better, while higher R² means more explained variation. The selected model is the one with the lowest RMSE on the held-out test set.


=== CELL 27 (code) ===
display(results_df.style.format({
    "MAE": "{:.4f}",
    "RMSE": "{:.4f}",
    "R2": "{:.4f}"
}))



=== CELL 28 (markdown) ===
## 15. Prediction Check

The actual-vs-predicted plot is retained because it directly shows whether predicted SoH follows the measured reference SoH. Residual and error-distribution plots are omitted from the final research notebook to keep the evidence focused.


=== CELL 29 (code) ===
best_name = results_df.iloc[0]["Model"]
best_model = fitted_models[best_name]
y_pred = best_model.predict(X_test)

print("Model selected for explainability:", best_name)

plt.figure(figsize=(7, 7))
plt.scatter(y_test, y_pred, alpha=0.65)
lo = min(y_test.min(), y_pred.min())
hi = max(y_test.max(), y_pred.max())
plt.plot([lo, hi], [lo, hi], "--")
plt.xlabel("Actual SoH (%)")
plt.ylabel("Predicted SoH (%)")
plt.title(f"Actual vs Predicted SoH — {best_name}")
plt.tight_layout()
plt.show()



=== CELL 30 (markdown) ===
## 16. Explainable ML – Permutation Importance

**Why:** Permutation importance is model-agnostic. A large decrease in model performance after shuffling a feature indicates that the feature is useful to the fitted model.


=== CELL 31 (code) ===
from sklearn.inspection import permutation_importance

print("Calculating permutation importance...")

perm = permutation_importance(
    best_model,
    X_test,
    y_test,
    n_repeats=10,
    random_state=42,
    scoring="neg_root_mean_squared_error"
)

# Permutation is applied to the original X_test columns, so use the original names.
feature_names = X_test.columns.tolist()

perm_df = pd.DataFrame({
    "feature": feature_names,
    "importance": perm.importances_mean
}).sort_values("importance", ascending=False).reset_index(drop=True)

display(perm_df.head(15))

top_perm = perm_df.head(10).sort_values("importance")
plt.figure(figsize=(10, 6))
plt.barh(top_perm["feature"], top_perm["importance"])
plt.xlabel("Mean Permutation Importance")
plt.ylabel("Feature")
plt.title("Most Influential Operating-History Features for SoH")
plt.grid(axis="x", alpha=0.3)
plt.tight_layout()
plt.show()



=== CELL 32 (markdown) ===
## 17. Explainable ML — SHAP

Permutation importance gives a global, model-agnostic ranking. SHAP is retained as a second explanation method for a compatible tree ensemble, allowing the project to inspect not only which variables matter but also the direction and magnitude of their contributions to individual predictions.


=== CELL 33 (code) ===
import shap

if best_name in ["Random Forest", "Extra Trees", "Gradient Boosting"]:

    X_shap_raw = X_test.sample(
        min(500, len(X_test)),
        random_state=42
    )

    prep = best_model.named_steps["preprocess"]
    tree_model = best_model.named_steps["model"]

    X_shap = prep.transform(X_shap_raw)
    feature_names = prep.get_feature_names_out()

    explainer = shap.TreeExplainer(tree_model)
    shap_values = explainer.shap_values(X_shap)

    if hasattr(X_shap, "toarray"):
        X_shap = X_shap.toarray()

    shap.summary_plot(
        shap_values,
        X_shap,
        feature_names=feature_names,
        max_display=15
    )

else:
    print("Selected model is not a tree ensemble; permutation importance is used for explainability.")


=== CELL 34 (markdown) ===
## 18. Battery-Wise Generalization

**Why:** Random splitting can place observations from the same battery in both sets. A battery-wise split keeps complete batteries separated and tests generalization to unseen batteries.


=== CELL 35 (code) ===
gss = GroupShuffleSplit(
    n_splits=1, test_size=0.20, random_state=42
)

train_idx, test_idx = next(
    gss.split(X, y, groups=groups)
)

X_bw_train = X.iloc[train_idx]
X_bw_test = X.iloc[test_idx]
y_bw_train = y.iloc[train_idx]
y_bw_test = y.iloc[test_idx]

batterywise_results = []

for name, model in models.items():
    pipe = Pipeline([
        ("preprocess", preprocess),
        ("model", model)
    ])
    pipe.fit(X_bw_train, y_bw_train)
    pred = pipe.predict(X_bw_test)
    batterywise_results.append({
        "Model": name,
        "MAE": mean_absolute_error(y_bw_test, pred),
        "RMSE": np.sqrt(mean_squared_error(y_bw_test, pred)),
        "R2": r2_score(y_bw_test, pred)
    })

batterywise_df = pd.DataFrame(batterywise_results).sort_values("RMSE")
display(batterywise_df.style.format({
    "MAE": "{:.4f}",
    "RMSE": "{:.4f}",
    "R2": "{:.4f}"
}))



=== CELL 36 (markdown) ===
## 19. Research Outcome — What Did We Actually Find?

This section converts the model outputs into a research finding rather than stopping at algorithm comparison. It answers four questions: (1) does ML beat a simple baseline, (2) how large is the improvement, (3) does the relationship generalize to unseen batteries, and (4) which operating-history variables explain the prediction?

**Important:** every number below is calculated from the executed experiment. No result is manually entered. If a result is weak, that is reported as a finding rather than hidden.


=== CELL 37 (code) ===
# ============================================================
# RESEARCH OUTCOME AND KEY FINDINGS
# ============================================================

print("=" * 78)
print("RESEARCH OUTCOME: EXPLAINABLE SoH ESTIMATION")
print("=" * 78)

baseline_pred = np.full(len(y_test), y_train.mean())
baseline_mae = mean_absolute_error(y_test, baseline_pred)
baseline_rmse = np.sqrt(mean_squared_error(y_test, baseline_pred))
baseline_r2 = r2_score(y_test, baseline_pred)

model_mae = mean_absolute_error(y_test, y_pred)
model_rmse = np.sqrt(mean_squared_error(y_test, y_pred))
model_r2 = r2_score(y_test, y_pred)

mae_improvement = ((baseline_mae - model_mae) / baseline_mae) * 100
rmse_improvement = ((baseline_rmse - model_rmse) / baseline_rmse) * 100

bw_row = batterywise_df[batterywise_df["Model"] == best_name]
if len(bw_row) > 0:
    bw_mae = bw_row.iloc[0]["MAE"]
    bw_rmse = bw_row.iloc[0]["RMSE"]
    bw_r2 = bw_row.iloc[0]["R2"]
else:
    bw_mae = bw_rmse = bw_r2 = np.nan

degradation_rates = []
for battery_id, group in df.groupby("battery_id"):
    group = group.sort_values("cycle_index")
    if len(group) >= 3:
        degradation_rates.append(np.polyfit(group["cycle_index"], group["SoH"], 1)[0])

mean_degradation_rate = np.mean(degradation_rates) if degradation_rates else np.nan
median_degradation_rate = np.median(degradation_rates) if degradation_rates else np.nan

top_features = []
if "perm_df" in globals():
    top_features = perm_df.head(5)["feature"].tolist()

outcome_table = pd.DataFrame({
    "Metric": [
        "Mean baseline MAE", "Selected ML MAE",
        "Mean baseline RMSE", "Selected ML RMSE",
        "Selected ML R²",
        "MAE improvement over baseline (%)",
        "RMSE improvement over baseline (%)",
        "Unseen-battery MAE", "Unseen-battery RMSE", "Unseen-battery R²",
        "Mean SoH slope per cycle index"
    ],
    "Value": [
        baseline_mae, model_mae, baseline_rmse, model_rmse, model_r2,
        mae_improvement, rmse_improvement, bw_mae, bw_rmse, bw_r2, mean_degradation_rate
    ]
})

display(outcome_table.style.format({"Value": "{:.4f}"}))

# Research-outcome chart 1: baseline vs selected model error
plt.figure(figsize=(8, 5))
plt.bar(["Mean baseline", best_name], [baseline_rmse, model_rmse])
plt.ylabel("RMSE")
plt.title("Prediction Error: Baseline vs Selected ML Model")
plt.tight_layout()
plt.show()

# Research-outcome chart 2: random split vs unseen-battery generalization
plt.figure(figsize=(8, 5))
plt.bar(["Random split", "Unseen batteries"], [model_r2, bw_r2])
plt.ylabel("R²")
plt.title("Generalization of the Selected Model")
plt.tight_layout()
plt.show()

# Research-outcome chart 3: improvement over the baseline
plt.figure(figsize=(8, 5))
plt.bar(["MAE improvement", "RMSE improvement"], [mae_improvement, rmse_improvement])
plt.ylabel("Improvement (%)")
plt.title("Improvement over Mean-SoH Baseline")
plt.axhline(0, linestyle="--")
plt.tight_layout()
plt.show()

print("\n" + "=" * 78)
print("KEY RESEARCH FINDINGS")
print("=" * 78)

print(f"1. The selected model was {best_name}.")
print(f"   Random-split MAE = {model_mae:.4f}, RMSE = {model_rmse:.4f}, R² = {model_r2:.4f}.")
print(f"2. Compared with predicting the training-set mean SoH, MAE changed by {mae_improvement:.2f}% and RMSE changed by {rmse_improvement:.2f}%.")
if not np.isnan(bw_rmse):
    print(f"3. On a stricter unseen-battery split, MAE = {bw_mae:.4f}, RMSE = {bw_rmse:.4f}, R² = {bw_r2:.4f}.")
if not np.isnan(mean_degradation_rate):
    print(f"4. The mean SoH slope across batteries was {mean_degradation_rate:.6f} percentage points per cycle index.")
if top_features:
    print("5. The top operating-history features by permutation importance were:")
    for i, feature in enumerate(top_features, 1):
        print(f"   {i}. {feature}")

print("\nInterpretation:")
print("The experiment supports the research question only to the extent indicated by the measured baseline improvement and unseen-battery metrics above. The degradation plot establishes the observed health trend, while permutation importance and SHAP identify which engineered operating-history variables the fitted model relied on.")



=== CELL 38 (markdown) ===
## 20. Conclusion, Limitations and Future Work

### Conclusion
The study tests whether randomized operating history can be converted into interpretable features for Li-ion battery SoH estimation. The final evidence is the combination of the baseline comparison, regression metrics, unseen-battery evaluation, degradation trend and explainability analysis. The exact numerical findings must be taken from the Research Outcome table generated above.

The practical outcome is therefore not simply that one algorithm performed best. The study asks whether the operating history contains a measurable signal of degradation, whether that signal transfers to batteries not used for training, and which operating characteristics are most influential.

### Limitations
- The labels are based on periodic reference discharge measurements rather than continuous real-time SoH ground truth.
- The feature representation summarizes randomized-use intervals, so fine-grained temporal information is intentionally discarded.
- A single group holdout is used for the unseen-battery experiment; repeated group cross-validation would give a more stable estimate.
- This project does not claim a new state-of-the-art battery model. Recent literature already contains deep-learning and explainable feature-engineering studies on the NASA randomized dataset.

### Future Work
- Use repeated GroupKFold validation and confidence intervals.
- Add time-series features, voltage-shape descriptors and physically motivated health indicators.
- Compare against sequence models such as LSTM/CNN-LSTM under the same battery-wise split.
- Add uncertainty estimation so the system can report when a prediction is less reliable.
- Validate the feature set on an independent battery dataset.


=== CELL 39 (markdown) ===
## 21. Export for Weka and Report

The cleaned cycle-level data, model comparison, unseen-battery results and permutation-importance results are exported for Weka and for the final report tables.


=== CELL 40 (code) ===
df.to_csv("/content/battery_soh_cleaned.csv", index=False)
results_df.to_csv("/content/python_model_results_random_split.csv", index=False)
batterywise_df.to_csv("/content/python_model_results_batterywise.csv", index=False)
perm_df.to_csv("/content/python_permutation_importance.csv", index=False)

print("Exported:")
print("1. /content/battery_soh_cleaned.csv")
print("2. /content/python_model_results_random_split.csv")
print("3. /content/python_model_results_batterywise.csv")
print("4. /content/python_permutation_importance.csv")


=== CELL 41 (markdown) ===
## 22. Final Notebook Summary

The streamlined notebook keeps only the visual evidence that directly supports the research story: battery degradation, actual-vs-predicted performance, feature importance, and three research-outcome comparisons. Diagnostic plots that do not materially answer the research question have been removed.

The final report should use the generated Research Outcome table and Key Research Findings as the source for numerical claims.


=== CELL 42 (markdown) ===
## References

1. B. Bole, C. Kulkarni, and M. Daigle, **Randomized Battery Usage Data Set**, NASA Prognostics Data Repository, NASA Ames Research Center.
2. B. Bole, C. Kulkarni, and M. Daigle, **Adaptation of an Electrochemistry-based Li-Ion Battery Model to Account for Deterioration Observed Under Randomized Use**, Annual Conference of the Prognostics and Health Management Society, 2014.
3. Y. Fan, F. Xiao, C. Li, G. Yang, and X. Tang, **A novel deep learning framework for state of health estimation of lithium-ion battery**, Journal of Energy Storage, vol. 32, 101741, 2020. DOI: 10.1016/j.est.2020.101741.
4. J. Wu, J. Chen, X. Feng, and H. Xiang, **State of health estimation of lithium-ion batteries using Autoencoders and Ensemble Learning**, Journal of Energy Storage, vol. 55, 105708, 2022. DOI: 10.1016/j.est.2022.105708.
5. S. J. Desai, M. Ramanujam, and V. Runkana, **Bayesian CNN-LSTM for Battery State of Health (SoH) Estimation under Randomized Usage Conditions**, International Journal of Prognostics and Health Management, 2026. DOI: 10.36001/ijphm.2026.v17i2.4743.
6. **Feature engineering and explainable artificial intelligence for state of health estimation of Lithium-ion batteries**, Journal of Energy Storage, vol. 144, 119873, 2026. DOI: 10.1016/j.est.2025.119873.


