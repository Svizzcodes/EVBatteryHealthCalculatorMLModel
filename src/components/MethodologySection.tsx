import React, { useState } from 'react';
import { Database, Sliders, Cpu, Binary, Lock, CheckCircle2, ChevronRight, Zap, Activity, Thermometer, Layers, Clock } from 'lucide-react';

export const MethodologySection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'features' | 'models'>('pipeline');
  const [selectedStage, setSelectedStage] = useState<number>(0);
  const [activeFeatureGroup, setActiveFeatureGroup] = useState<string>('current');

  const stages = [
    { step: '01', title: 'RAW MATLAB PARSING', detail: 'Parses 28 .mat structures containing time, current, voltage, temperature, and comments.', code: 'steps = data.step # [relativeTime, voltage, current, temperature]' },
    { step: '02', title: 'REFERENCE SEGMENTATION', detail: 'Accumulates random-walk intervals between reference discharges.', code: 'if "reference discharge" in comment: row = summarize_history(history)' },
    { step: '03', title: 'FEATURE EXTRACTION', detail: 'Extracts 23 statistical moments (mean, std, min, max, range) and Ah throughputs.', code: 'charge_ah = sum(trapezoid(i[i>=0], t[i>=0])) / 3600.0' },
    { step: '04', title: 'SoH TARGET CALCULATION', detail: 'Normalizes capacity against cycle 1 with zero future data leakage.', code: 'df["SoH"] = 100 * df["target_capacity_ah"] / df["initial_capacity_ah"]' },
    { step: '05', title: 'QUALITY & ROBUST SCALING', detail: 'Removes duplicates & infinities; applies RobustScaler and median imputation.', code: 'preprocess = ColumnTransformer([("num", RobustScaler(), features)])' },
    { step: '06', title: 'REGRESSION MODELING', detail: 'Trains 6 models across 80/20 random split and Battery-wise GroupShuffleSplit.', code: 'gss = GroupShuffleSplit(n_splits=1, test_size=0.20, random_state=42)' },
    { step: '07', title: 'EXPLAINABLE ML (XAI)', detail: 'Permutation importance and TreeExplainer SHAP attribution analysis.', code: 'perm = permutation_importance(best_model, X_test, y_test)' },
    { step: '08', title: 'RESEARCH OUTCOME', detail: 'Evaluates baseline reduction, unseen cell transfer, and influential factors.', code: 'rmse_improvement = ((baseline_rmse - model_rmse) / baseline_rmse) * 100' }
  ];

  const featureGroups: Record<string, { title: string; features: string[]; desc: string }> = {
    current: {
      title: 'Current Dynamics (6 Features)',
      features: ['current_mean', 'current_std', 'current_min', 'current_max', 'current_range', 'abs_current_mean'],
      desc: 'Statistical moments capturing the severity, spread, and absolute intensity of random-walk charge and discharge pulses (-4.5A to +4.5A).'
    },
    voltage: {
      title: 'Voltage Responses (5 Features)',
      features: ['voltage_mean', 'voltage_std', 'voltage_min', 'voltage_max', 'voltage_range'],
      desc: 'Terminal cell potential statistics reflecting electrochemical polarization, internal resistance growth, and discharge sags.'
    },
    temperature: {
      title: 'Thermal History (5 Features)',
      features: ['temperature_mean', 'temperature_std', 'temperature_min', 'temperature_max', 'temperature_range'],
      desc: 'Surface thermal statistics measuring operating heat generation, environmental resting temperatures, and thermal dispersion.'
    },
    operational: {
      title: 'Operational & Throughput (7 Features)',
      features: ['rw_steps', 'rw_samples', 'rw_duration_s', 'charge_throughput_ah', 'discharge_throughput_ah', 'cycle_index', 'profile_group'],
      desc: 'Cumulative physical operating duration, total charge pumped/extracted, and sequential life progression indices.'
    }
  };

  const models = [
    { name: 'Gradient Boosting', type: 'Ensemble Boosting', notes: 'Best accuracy; fits non-linear residual gradients.' },
    { name: 'Extra Trees', type: 'Randomized Forests', notes: 'Fast training; draws random cut thresholds.' },
    { name: 'Random Forest', type: 'Ensemble Bagging', notes: '200 decision trees with feature subspace sampling.' },
    { name: 'Ridge Regression', type: 'L2 Linear', notes: 'Mitigates multicollinearity between moments.' },
    { name: 'Linear Regression (OLS)', type: 'Baseline Parametric', notes: 'Analytical Ordinary Least Squares baseline.' },
    { name: 'Elastic Net', type: 'L1/L2 Linear', notes: 'Balances sparse selection with grouping penalties.' }
  ];

  return (
    <section id="methodology" className="relative py-20 px-6 max-w-7xl mx-auto border-t border-[#1B2028]">
      
      {/* Section Header */}
      <div className="space-y-4 max-w-3xl mb-12">
        <div className="flex items-center space-x-2 font-mono text-xs tracking-widest text-[#00F0FF] uppercase">
          <span className="w-4 h-[1px] bg-[#00F0FF]" />
          <span>02 / METHODOLOGY & MODELS</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F8FAFC] leading-[1.05]">
          ENGINEERING PIPELINE<br />
          & MODEL ARCHITECTURES.
        </h2>

        <p className="text-sm text-[#94A3B8] leading-relaxed pt-1">
          A modular, reproducible data science workflow that transforms high-frequency MATLAB structures into 23 physical descriptors and evaluates 6 regression architectures.
        </p>
      </div>

      {/* Main Tab Switcher */}
      <div className="border border-[#1B2028] bg-[#090A0D] rounded-sm p-6 sm:p-8 space-y-6">
        
        {/* Tabs */}
        <div className="flex border-b border-[#1B2028] space-x-6 font-mono text-xs">
          {[
            { id: 'pipeline', label: '8-STAGE RESEARCH PIPELINE' },
            { id: 'features', label: '23-FEATURE MOMENTS CATALOG' },
            { id: 'models', label: '6 REGRESSION ARCHITECTURES' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 font-semibold transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-[#00F0FF] text-[#00F0FF]'
                  : 'border-transparent text-[#64748B] hover:text-[#CBD5E1]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: 8-STAGE PIPELINE */}
        {activeTab === 'pipeline' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 grid grid-cols-2 gap-2 font-mono text-xs">
              {stages.map((st, i) => (
                <button
                  key={st.step}
                  onClick={() => setSelectedStage(i)}
                  className={`p-3 text-left border rounded-sm transition-colors ${
                    selectedStage === i
                      ? 'border-[#00F0FF] bg-[#00F0FF]/10 text-[#00F0FF] font-semibold'
                      : 'border-[#1B2028] bg-[#050607] text-[#94A3B8] hover:text-[#CBD5E1]'
                  }`}
                >
                  <div className="text-[10px] text-[#64748B]">STAGE {st.step}</div>
                  <div className="truncate text-xs font-bold mt-0.5">{st.title}</div>
                </button>
              ))}
            </div>

            <div className="lg:col-span-7 bg-[#050607] border border-[#1B2028] p-5 rounded-sm space-y-4">
              <div className="flex items-center justify-between font-mono text-xs border-b border-[#1B2028] pb-3">
                <span className="text-[#00F0FF] font-bold">STAGE {stages[selectedStage].step}: {stages[selectedStage].title}</span>
                <span className="text-[#64748B]">Python 3.12 / scikit-learn</span>
              </div>
              <p className="text-xs text-[#CBD5E1] font-sans leading-relaxed">
                {stages[selectedStage].detail}
              </p>
              <pre className="p-3 bg-[#090A0D] border border-[#1B2028] rounded font-mono text-xs text-[#00F0FF] overflow-x-auto">
                <code>{stages[selectedStage].code}</code>
              </pre>
            </div>
          </div>
        )}

        {/* TAB 2: 23 FEATURES */}
        {activeTab === 'features' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-mono text-xs">
            <div className="lg:col-span-4 space-y-2">
              {Object.keys(featureGroups).map((gKey) => (
                <button
                  key={gKey}
                  onClick={() => setActiveFeatureGroup(gKey)}
                  className={`w-full p-3 text-left border rounded-sm transition-colors ${
                    activeFeatureGroup === gKey
                      ? 'border-[#00F0FF] bg-[#00F0FF]/10 text-[#00F0FF] font-semibold'
                      : 'border-[#1B2028] bg-[#050607] text-[#94A3B8] hover:text-[#CBD5E1]'
                  }`}
                >
                  {featureGroups[gKey].title}
                </button>
              ))}
            </div>

            <div className="lg:col-span-8 bg-[#050607] border border-[#1B2028] p-5 rounded-sm space-y-4">
              <h4 className="text-sm font-bold text-[#F8FAFC]">
                {featureGroups[activeFeatureGroup].title}
              </h4>
              <p className="text-xs text-[#94A3B8] font-sans leading-relaxed">
                {featureGroups[activeFeatureGroup].desc}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {featureGroups[activeFeatureGroup].features.map((f) => (
                  <span key={f} className="px-3 py-1 bg-[#090A0D] border border-[#1B2028] text-[#CBD5E1] rounded text-[11px]">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: 6 MODELS */}
        {activeTab === 'models' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
            {models.map((m) => (
              <div key={m.name} className="p-4 border border-[#1B2028] bg-[#050607] rounded-sm space-y-2">
                <div className="text-[10px] text-[#00F0FF] font-bold uppercase">{m.type}</div>
                <div className="font-bold text-sm text-[#F8FAFC] font-sans">{m.name}</div>
                <p className="text-xs text-[#94A3B8] font-sans leading-relaxed">{m.notes}</p>
              </div>
            ))}
          </div>
        )}

      </div>

    </section>
  );
};
