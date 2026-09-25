import os
import re
import sys
import json
import time
import zipfile
import urllib.request
import warnings
from pathlib import Path
import numpy as np
import pandas as pd
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
import shap

warnings.filterwarnings("ignore")

BASE_DIR = Path(__file__).parent.resolve()
DATA_DIR = BASE_DIR / "dataset_cache"
ZIP_PATH = DATA_DIR / "11.+Randomized+Battery+Usage+Data+Set.zip"
ROOT_EXTRACT = DATA_DIR / "extracted"
PUBLIC_DATA_DIR = BASE_DIR / "public" / "data"

URL = "https://phm-datasets.s3.amazonaws.com/NASA/11.+Randomized+Battery+Usage+Data+Set.zip"

def download_and_extract():
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not ZIP_PATH.exists():
        print(f"Downloading NASA dataset from {URL} ...")
        def report(count, block_size, total_size):
            pct = count * block_size * 100 / total_size
            if count % 1000 == 0:
                print(f"Downloaded {pct:.1f}% ({count*block_size/(1024*1024):.1f} MB)...", end="\r")
        urllib.request.urlretrieve(URL, ZIP_PATH, reporthook=report)
        print("\nDownload complete.")
    else:
        print(f"Using cached zip at {ZIP_PATH} ({ZIP_PATH.stat().st_size / (1024*1024):.1f} MB)")

    ROOT_EXTRACT.mkdir(exist_ok=True)
    
    # Check if .mat files already extracted
    mat_files = sorted(ROOT_EXTRACT.rglob("*.mat"))
    if not mat_files:
        print("Extracting main ZIP...")
        with zipfile.ZipFile(ZIP_PATH, "r") as z:
            z.extractall(ROOT_EXTRACT)

        nested = list(ROOT_EXTRACT.rglob("*.zip"))
        print(f"Found {len(nested)} nested ZIP files. Extracting...")
        for zpath in nested:
            out = zpath.parent / (zpath.stem + "_extracted")
            out.mkdir(exist_ok=True)
            try:
                with zipfile.ZipFile(zpath, "r") as z:
                    z.extractall(out)
            except zipfile.BadZipFile:
                print("Skipped invalid ZIP:", zpath.name)
        mat_files = sorted(ROOT_EXTRACT.rglob("*.mat"))

    print(f"Total MATLAB files found: {len(mat_files)}")
    return mat_files

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
        f"{prefix}_mean": float(np.nanmean(a)),
        f"{prefix}_std": float(np.nanstd(a)),
        f"{prefix}_min": float(np.nanmin(a)),
        f"{prefix}_max": float(np.nanmax(a)),
        f"{prefix}_range": float(np.nanmax(a) - np.nanmin(a))
    }

def summarize_history(steps):
    voltage, current, temperature = [], [], []
    durations = []
    charge_ah = discharge_ah = 0.0

    for s in steps:
        t, v, i, temp = step_arrays(s)
        if len(t):
            durations.append(float(np.nanmax(t) - np.nanmin(t)))
        if len(v):
            voltage.extend(v)
        if len(i):
            current.extend(i)
        if len(temp):
            temperature.extend(temp)

        if len(t) >= 2 and len(i) >= 2:
            n = min(len(t), len(i))
            q = float(abs(np.trapezoid(i[:n], t[:n])) / 3600.0)
            if np.nanmean(i[:n]) >= 0:
                charge_ah += q
            else:
                discharge_ah += q

    out = {
        "rw_steps": len(steps),
        "rw_samples": len(current),
        "rw_duration_s": float(np.nansum(durations)),
        "charge_throughput_ah": float(charge_ah),
        "discharge_throughput_ah": float(discharge_ah),
        "abs_current_mean": float(np.nanmean(np.abs(current))) if current else np.nan
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
                row["target_capacity_ah"] = float(cap)
                rows.append(row)
            history = []
        elif "random walk" in comment:
            history.append(s)

    return rows

def profile_group(name):
    m = re.search(r"(\d+)", str(name))
    n = int(m.group(1)) if m else 0
    if 1 <= n <= 4:
        return "Group_1_4"
    if 5 <= n <= 8:
        return "Group_5_8"
    if 9 <= n <= 12:
        return "Group_9_12"
    return "Group_Other"

def main():
    print("=== STARTING NASA BATTERY SoH RESEARCH PIPELINE ===")
    mat_files = download_and_extract()
    
    print("Parsing MATLAB files and extracting cycle-level features...")
    all_rows = []
    for i, path in enumerate(mat_files, 1):
        try:
            battery_rows = parse_battery(path)
            all_rows.extend(battery_rows)
            print(f"[{i}/{len(mat_files)}] Parsed {path.name}: {len(battery_rows)} reference cycles")
        except Exception as e:
            print(f"Skipped {path.name} | {e}")

    df = pd.DataFrame(all_rows)
    print(f"Raw cycle-level dataset shape: {df.shape}")

    if df.empty:
        raise ValueError("No cycle rows extracted!")

    # Calculate initial capacity, SoH, and cycle index
    df["initial_capacity_ah"] = df.groupby("battery_id")["target_capacity_ah"].transform("first")
    df["SoH"] = 100.0 * df["target_capacity_ah"] / df["initial_capacity_ah"]
    df["cycle_index"] = df.groupby("battery_id").cumcount() + 1

    # Data Quality: drop duplicates, infinities, dropna on target
    before_len = len(df)
    df = df.drop_duplicates().reset_index(drop=True)
    df = df.replace([np.inf, -np.inf], np.nan)
    df = df.dropna(subset=["SoH"]).reset_index(drop=True)
    print(f"After quality cleanup: {len(df)} rows (removed {before_len - len(df)} rows)")

    # Outlier detection
    numeric_cols = df.select_dtypes(include=np.number).columns.tolist()
    exclude = ["SoH", "target_capacity_ah", "initial_capacity_ah"]
    outlier_features = [c for c in numeric_cols if c not in exclude]
    outlier_list = []
    for c in outlier_features:
        q1, q3 = df[c].quantile([0.25, 0.75])
        iqr = q3 - q1
        lo, hi = q1 - 1.5 * iqr, q3 + 1.5 * iqr
        cnt = int(((df[c] < lo) | (df[c] > hi)).sum())
        outlier_list.append({
            "feature": c,
            "outlier_count": cnt,
            "lower_bound": float(lo),
            "upper_bound": float(hi)
        })

    # Feature screening: Pearson, F-statistic, Mutual Information
    target = "SoH"
    candidate_features = [c for c in df.columns if c not in [target, "battery_id", "target_capacity_ah", "initial_capacity_ah"]]
    
    screening_df = df[candidate_features + [target]].dropna()
    X_screen = screening_df[candidate_features]
    y_screen = screening_df[target]

    pearson_corr = X_screen.apply(lambda col: col.corr(y_screen))
    f_vals, _ = f_regression(X_screen, y_screen)
    mi_vals = mutual_info_regression(X_screen, y_screen, random_state=42)

    def normalize(s):
        s = pd.Series(s).fillna(0)
        rng = s.max() - s.min()
        return (s - s.min()) / rng if rng != 0 else pd.Series(0, index=s.index)

    screen_summary = pd.DataFrame({
        "feature": candidate_features,
        "pearson_abs": pearson_corr.abs().values,
        "f_score": f_vals,
        "mutual_info": mi_vals
    })
    screen_summary["composite_score"] = (
        normalize(screen_summary["pearson_abs"]) +
        normalize(screen_summary["f_score"]) +
        normalize(screen_summary["mutual_info"])
    ) / 3.0
    screen_summary = screen_summary.sort_values("composite_score", ascending=False).reset_index(drop=True)

    # Prepare features for modeling
    df["profile_group"] = df["battery_id"].apply(profile_group)
    model_features = candidate_features + ["profile_group"]
    X = df[model_features]
    y = df[target]
    groups = df["battery_id"]

    # Preprocessor
    numeric_features = candidate_features
    categorical_features = ["profile_group"]

    preprocess = ColumnTransformer([
        ("num", Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", RobustScaler())
        ]), numeric_features),
        ("cat", OneHotEncoder(drop="first", sparse_output=False, handle_unknown="ignore"), categorical_features)
    ])

    # 80/20 Random Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=42)

    models = {
        "Linear Regression": LinearRegression(),
        "Ridge": Ridge(alpha=1.0),
        "Elastic Net": ElasticNet(alpha=0.1, l1_ratio=0.5, random_state=42),
        "Random Forest": RandomForestRegressor(n_estimators=200, max_depth=12, random_state=42),
        "Extra Trees": ExtraTreesRegressor(n_estimators=200, max_depth=12, random_state=42),
        "Gradient Boosting": GradientBoostingRegressor(n_estimators=200, learning_rate=0.05, max_depth=4, random_state=42)
    }

    random_split_results = []
    fitted_models = {}
    predictions_map = {}

    for name, model in models.items():
        pipe = Pipeline([
            ("preprocess", preprocess),
            ("model", model)
        ])
        pipe.fit(X_train, y_train)
        pred = pipe.predict(X_test)
        
        mae = float(mean_absolute_error(y_test, pred))
        rmse = float(np.sqrt(mean_squared_error(y_test, pred)))
        r2 = float(r2_score(y_test, pred))
        
        fitted_models[name] = pipe
        predictions_map[name] = pred
        random_split_results.append({
            "name": name,
            "mae": mae,
            "rmse": rmse,
            "r2": r2
        })

    results_df = pd.DataFrame(random_split_results).sort_values("rmse").reset_index(drop=True)
    best_model_name = results_df.iloc[0]["name"]
    best_model = fitted_models[best_model_name]
    best_pred = predictions_map[best_model_name]

    print(f"Best model on random split: {best_model_name} (RMSE: {results_df.iloc[0]['rmse']:.4f}, R2: {results_df.iloc[0]['r2']:.4f})")

    # Baseline calculations
    baseline_pred = np.full(len(y_test), y_train.mean())
    baseline_mae = float(mean_absolute_error(y_test, baseline_pred))
    baseline_rmse = float(np.sqrt(mean_squared_error(y_test, baseline_pred)))
    baseline_r2 = float(r2_score(y_test, baseline_pred))

    model_mae = float(mean_absolute_error(y_test, best_pred))
    model_rmse = float(np.sqrt(mean_squared_error(y_test, best_pred)))
    model_r2 = float(r2_score(y_test, best_pred))

    mae_improvement = float(((baseline_mae - model_mae) / baseline_mae) * 100)
    rmse_improvement = float(((baseline_rmse - model_rmse) / baseline_rmse) * 100)

    # Battery-Wise GroupSplit (Unseen batteries)
    gss = GroupShuffleSplit(n_splits=1, test_size=0.20, random_state=42)
    train_idx, test_idx = next(gss.split(X, y, groups=groups))

    X_bw_train, X_bw_test = X.iloc[train_idx], X.iloc[test_idx]
    y_bw_train, y_bw_test = y.iloc[train_idx], y.iloc[test_idx]
    unseen_batteries = list(groups.iloc[test_idx].unique())

    batterywise_results = []
    for name, model in models.items():
        pipe = Pipeline([
            ("preprocess", preprocess),
            ("model", model)
        ])
        pipe.fit(X_bw_train, y_bw_train)
        pred = pipe.predict(X_bw_test)
        batterywise_results.append({
            "name": name,
            "mae": float(mean_absolute_error(y_bw_test, pred)),
            "rmse": float(np.sqrt(mean_squared_error(y_bw_test, pred))),
            "r2": float(r2_score(y_bw_test, pred))
        })

    bw_df = pd.DataFrame(batterywise_results).sort_values("rmse").reset_index(drop=True)
    best_bw_row = [r for r in batterywise_results if r["name"] == best_model_name][0]

    # Permutation Importance
    print("Computing Permutation Importance...")
    perm = permutation_importance(
        best_model,
        X_test,
        y_test,
        n_repeats=10,
        random_state=42,
        scoring="neg_root_mean_squared_error"
    )
    perm_list = []
    for feat_name, imp_val in zip(X_test.columns.tolist(), perm.importances_mean):
        perm_list.append({
            "feature": feat_name,
            "importance": float(imp_val)
        })
    perm_list = sorted(perm_list, key=lambda x: x["importance"], reverse=True)

    # SHAP analysis
    print("Computing SHAP values...")
    shap_data = []
    try:
        X_shap_raw = X_test.sample(min(200, len(X_test)), random_state=42)
        prep_transformer = best_model.named_steps["preprocess"]
        tree_submodel = best_model.named_steps["model"]

        X_shap_transformed = prep_transformer.transform(X_shap_raw)
        trans_feature_names = prep_transformer.get_feature_names_out()

        explainer = shap.TreeExplainer(tree_submodel)
        shap_vals = explainer.shap_values(X_shap_transformed)
        if hasattr(X_shap_transformed, "toarray"):
            X_shap_transformed = X_shap_transformed.toarray()

        mean_abs_shap = np.mean(np.abs(shap_vals), axis=0)
        for fname, val in zip(trans_feature_names, mean_abs_shap):
            clean_name = fname.replace("num__", "").replace("cat__", "")
            shap_data.append({
                "feature": clean_name,
                "mean_abs_shap": float(val)
            })
        shap_data = sorted(shap_data, key=lambda x: x["mean_abs_shap"], reverse=True)
    except Exception as e:
        print("SHAP computation note:", e)

    # Degradation slopes per battery
    battery_degradation_trajectories = []
    degradation_rates = []

    for bid, group in df.groupby("battery_id"):
        group = group.sort_values("cycle_index")
        cycles = []
        for _, row in group.iterrows():
            cycles.append({
                "cycle_index": int(row["cycle_index"]),
                "soh": float(row["SoH"]),
                "capacity_ah": float(row["target_capacity_ah"]),
                "duration_s": float(row["rw_duration_s"]),
                "temp_mean": float(row["temperature_mean"]) if "temperature_mean" in row and pd.notna(row["temperature_mean"]) else None
            })
        
        slope = None
        if len(group) >= 3:
            slope = float(np.polyfit(group["cycle_index"], group["SoH"], 1)[0])
            degradation_rates.append(slope)

        battery_degradation_trajectories.append({
            "battery_id": bid,
            "profile_group": profile_group(bid),
            "cycles_count": len(group),
            "initial_capacity_ah": float(group["initial_capacity_ah"].iloc[0]),
            "final_soh": float(group["SoH"].iloc[-1]),
            "slope": slope,
            "cycles": cycles
        })

    mean_degradation_slope = float(np.mean(degradation_rates)) if degradation_rates else 0.0
    median_degradation_slope = float(np.median(degradation_rates)) if degradation_rates else 0.0

    # Mean trajectory across all batteries
    mean_trajectory = []
    max_cycles = int(df["cycle_index"].max())
    for c in range(1, max_cycles + 1):
        c_rows = df[df["cycle_index"] == c]
        if len(c_rows) > 0:
            mean_trajectory.append({
                "cycle_index": c,
                "mean_soh": float(c_rows["SoH"].mean()),
                "min_soh": float(c_rows["SoH"].min()),
                "max_soh": float(c_rows["SoH"].max()),
                "battery_count": len(c_rows)
            })

    # Actual vs Predicted points for test set
    test_indices = y_test.index
    actual_vs_predicted = []
    for idx, (actual, pred) in enumerate(zip(y_test.values, best_pred)):
        orig_row = df.loc[test_indices[idx]]
        actual_vs_predicted.append({
            "battery_id": str(orig_row["battery_id"]),
            "cycle_index": int(orig_row["cycle_index"]),
            "actual_soh": float(actual),
            "predicted_soh": float(pred),
            "error": float(pred - actual),
            "abs_error": float(abs(pred - actual))
        })

    # Assemble complete results JSON
    results = {
        "metadata": {
            "project_title": "Explainable Machine Learning Approaches for State of Health Estimation of Lithium-Ion Batteries",
            "student": {
                "name": "SHLOK VIJ",
                "prn": "230705211143",
                "semester": "Semester VII",
                "section": "Section B",
                "subject": "Data Science Group A",
                "institution": "Symbiosis Institute of Technology, Nagpur"
            },
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime()),
            "status": "COMPLETED_EXPERIMENT"
        },
        "dataset": {
            "name": "NASA Randomized Battery Usage Data Set",
            "source": "NASA Ames Prognostics Center of Excellence (PCoE) / AWS S3",
            "dataset_number": 11,
            "observations": int(len(df)),
            "batteries_count": int(df["battery_id"].nunique()),
            "batteries": sorted(df["battery_id"].unique().tolist()),
            "features_count": len(model_features),
            "raw_files_count": len(mat_files)
        },
        "models": results_df.to_dict(orient="records"),
        "selected_model": {
            "name": best_model_name,
            "mae": model_mae,
            "rmse": model_rmse,
            "r2": model_r2
        },
        "baseline": {
            "name": "Mean-SoH Training Baseline",
            "mae": baseline_mae,
            "rmse": baseline_rmse,
            "r2": baseline_r2
        },
        "improvement": {
            "mae_percent": mae_improvement,
            "rmse_percent": rmse_improvement
        },
        "batterywise": {
            "unseen_batteries": unseen_batteries,
            "models": batterywise_results,
            "selected_model": best_bw_row
        },
        "degradation": {
            "mean_slope": mean_degradation_slope,
            "median_slope": median_degradation_slope,
            "unit": "% SoH per reference cycle index"
        },
        "top_features": perm_list[:15],
        "shap_features": shap_data[:15],
        "feature_screening": screen_summary.to_dict(orient="records"),
        "outliers": outlier_list[:15],
        "trajectories": battery_degradation_trajectories,
        "mean_trajectory": mean_trajectory,
        "actual_vs_predicted": actual_vs_predicted
    }

    PUBLIC_DATA_DIR.mkdir(parents=True, exist_ok=True)
    out_file = PUBLIC_DATA_DIR / "results.json"
    with open(out_file, "w") as f:
        json.dump(results, f, indent=2)

    # Also save CSV files
    df.to_csv(PUBLIC_DATA_DIR / "battery_soh_cleaned.csv", index=False)
    results_df.to_csv(PUBLIC_DATA_DIR / "python_model_results_random_split.csv", index=False)
    bw_df.to_csv(PUBLIC_DATA_DIR / "python_model_results_batterywise.csv", index=False)
    pd.DataFrame(perm_list).to_csv(PUBLIC_DATA_DIR / "python_permutation_importance.csv", index=False)

    print(f"\nSuccessfully generated {out_file} ({out_file.stat().st_size / 1024:.1f} KB)")
    print("=== PIPELINE EXECUTION FINISHED ===")

if __name__ == "__main__":
    main()
