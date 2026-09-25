import React, { useState } from 'react';
import { Database, Filter, Code, Cpu, Eye, CheckCircle2, ChevronRight, Binary } from 'lucide-react';

export const PipelineSection: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<number>(0);

  const stages = [
    {
      step: '01',
      title: 'RAW MATLAB PARSING',
      subtitle: '28 .mat Files & Nested ZIPs',
      detail: 'Downloaded directly from NASA Ames PCoE repository. Scans nested structures for operational step records containing relativeTime, current, voltage, temperature, and comment strings.',
      code: 'sample = loadmat(mat_path, squeeze_me=True, struct_as_record=False)\nsteps = data.step # [relativeTime, voltage, current, temperature]'
    },
    {
      step: '02',
      title: 'REFERENCE-CYCLE SEGMENTATION',
      subtitle: 'Dynamic Boundary Partitioning',
      detail: 'Iterates sequentially through operation records. Accumulates "random walk" cycles until a "reference discharge" comment is encountered, bounding the preceding operating history.',
      code: 'if "reference discharge" in comment:\n    row = summarize_history(history)\n    row["target_capacity_ah"] = capacity_ah(s)\n    history = []'
    },
    {
      step: '03',
      title: 'OPERATING-HISTORY FEATURES',
      subtitle: '23 Statistical & Physical Descriptors',
      detail: 'Extracts statistical moments (mean, std, min, max, range) across current, voltage, and temperature series, combined with cumulative Ah charge/discharge throughput and step duration.',
      code: 'charge_ah = sum(trapezoid(i[i>=0], t[i>=0])) / 3600.0\ndischarge_ah = sum(trapezoid(i[i<0], t[i<0])) / 3600.0'
    },
    {
      step: '04',
      title: 'SoH CALCULATION',
      subtitle: 'Normalized Capacity Relative to Cycle 1',
      detail: 'Normalizes each measured reference discharge capacity against the fresh baseline of that specific battery cell. Prevents future data leakage by strictly referencing past intervals.',
      code: 'df["initial_capacity_ah"] = df.groupby("battery_id")["target_capacity_ah"].transform("first")\ndf["SoH"] = 100 * df["target_capacity_ah"] / df["initial_capacity_ah"]'
    },
    {
      step: '05',
      title: 'DATA CLEANING & IQR SCREENING',
      subtitle: 'Duplicate Removal & Robust Scaling',
      detail: 'Drops duplicates and invalid infinities. Evaluates IQR outlier distributions without deleting valid extreme physical load conditions. RobustScaler standardizes features using median and IQR.',
      code: 'preprocess = ColumnTransformer([\n    ("num", Pipeline([("imp", SimpleImputer(strategy="median")), ("scaler", RobustScaler())])),\n    ("cat", OneHotEncoder(drop="first"), ["profile_group"])\n])'
    },
    {
      step: '06',
      title: 'MODEL TRAINING & VALIDATION',
      subtitle: '6 Regression Architectures + GSS',
      detail: 'Trains Linear Regression, Ridge, Elastic Net, Random Forest, Extra Trees, and Gradient Boosting. Evaluated across 80/20 Random Split and Battery-wise GroupShuffleSplit (unseen batteries).',
      code: 'gss = GroupShuffleSplit(n_splits=1, test_size=0.20, random_state=42)\ntrain_idx, test_idx = next(gss.split(X, y, groups=df["battery_id"]))'
    },
    {
      step: '07',
      title: 'MODEL-AGNOSTIC EXPLAINABILITY',
      subtitle: 'Permutation Importance & SHAP Values',
      detail: 'Permutation importance measures drop in prediction RMSE when feature columns are shuffled. TreeExplainer SHAP computes exact additive attribution for individual predictions.',
      code: 'perm = permutation_importance(best_model, X_test, y_test, scoring="neg_root_mean_squared_error")\nshap_values = shap.TreeExplainer(tree_model).shap_values(X_shap)'
    },
    {
      step: '08',
      title: 'RESEARCH OUTCOME',
      subtitle: 'Synthesized Findings & Baseline Improvement',
      detail: 'Quantifies percentage error reduction relative to the training-mean baseline, validates unseen-cell generalizability, and confirms the influential degradation markers.',
      code: 'mae_improvement = ((baseline_mae - model_mae) / baseline_mae) * 100\nrmse_improvement = ((baseline_rmse - model_rmse) / baseline_rmse) * 100'
    }
  ];

  return (
    <section id="pipeline" className="relative py-28 px-6 max-w-7xl mx-auto border-t border-[#1B2028]">
      
      {/* Section Header */}
      <div className="space-y-4 max-w-3xl mb-16">
        <div className="flex items-center space-x-2 font-mono text-xs tracking-widest text-[#00F0FF] uppercase">
          <span className="w-4 h-[1px] bg-[#00F0FF]" />
          <span>03 / DATA SCIENCE PIPELINE</span>
        </div>

        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#F8FAFC] leading-[1.0]">
          THE 8-STAGE<br />
          RESEARCH JOURNEY.
        </h2>

        <p className="text-sm text-[#94A3B8] leading-relaxed pt-2">
          A transparent, reproducible pipeline converting high-frequency battery telemetries into robust, explainable health estimates. Click any stage to inspect execution details and code.
        </p>
      </div>

      {/* 8-Stage Horizontal/Vertical Journey Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left List of 8 Stages */}
        <div className="lg:col-span-6 space-y-2">
          {stages.map((stage, idx) => {
            const isSelected = selectedStage === idx;
            return (
              <div
                key={stage.step}
                onClick={() => setSelectedStage(idx)}
                className={`cursor-pointer p-4 rounded-sm border transition-all duration-300 flex items-center justify-between ${
                  isSelected
                    ? 'border-[#00F0FF] bg-[#0D0F13] shadow-[0_0_20px_rgba(0,240,255,0.08)]'
                    : 'border-[#1B2028] bg-[#090A0D]/60 hover:bg-[#0D0F13] hover:border-[#2C3440]'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <span className={`font-mono text-xs font-bold ${isSelected ? 'text-[#00F0FF]' : 'text-[#64748B]'}`}>
                    {stage.step}
                  </span>
                  <div>
                    <h3 className={`text-sm font-semibold tracking-tight ${isSelected ? 'text-[#F8FAFC]' : 'text-[#CBD5E1]'}`}>
                      {stage.title}
                    </h3>
                    <p className="text-[11px] font-mono text-[#64748B]">
                      {stage.subtitle}
                    </p>
                  </div>
                </div>

                <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-[#00F0FF] translate-x-1' : 'text-[#475569]'}`} />
              </div>
            );
          })}
        </div>

        {/* Right Stage Deep-Dive Card */}
        <div className="lg:col-span-6 sticky top-28">
          <div className="border border-[#1B2028] bg-[#090A0D] p-6 sm:p-8 rounded-sm space-y-6">
            
            <div className="flex items-center justify-between border-b border-[#1B2028] pb-4">
              <div className="font-mono text-xs text-[#00F0FF] tracking-widest uppercase">
                STAGE {stages[selectedStage].step} DEEP DIVE
              </div>
              <div className="font-mono text-[10px] text-[#64748B]">
                REPRODUCIBLE RESEARCH
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold text-[#F8FAFC]">
                {stages[selectedStage].title}
              </h3>
              <div className="font-mono text-xs text-[#00F0FF]">
                {stages[selectedStage].subtitle}
              </div>
              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed pt-2">
                {stages[selectedStage].detail}
              </p>
            </div>

            {/* Python Code Snippet */}
            <div className="space-y-2">
              <div className="flex items-center justify-between font-mono text-[10px] text-[#64748B]">
                <span>PYTHON IMPLEMENTATION</span>
                <span>scikit-learn / scipy</span>
              </div>
              <pre className="p-4 bg-[#050607] border border-[#1B2028] rounded-sm font-mono text-xs text-[#00F0FF] overflow-x-auto leading-relaxed">
                <code>{stages[selectedStage].code}</code>
              </pre>
            </div>

            {/* Stage Progress Bar */}
            <div className="pt-2">
              <div className="flex justify-between font-mono text-[10px] text-[#64748B] mb-1.5">
                <span>PIPELINE PROGRESSION</span>
                <span>{((selectedStage + 1) / stages.length * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full h-1 bg-[#1B2028] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#00F0FF] transition-all duration-500" 
                  style={{ width: `${((selectedStage + 1) / stages.length) * 100}%` }}
                />
              </div>
            </div>

          </div>
        </div>

      </div>

    </section>
  );
};
