import React, { useState } from 'react';
import { Cpu, Binary, GitFork, Sliders, ChevronRight } from 'lucide-react';

export const ModelShowcaseSection: React.FC = () => {
  const [activeModel, setActiveModel] = useState<number>(0);

  const modelSpecs = [
    {
      name: 'Linear Regression',
      family: 'Parametric / Baseline',
      desc: 'Standard Ordinary Least Squares (OLS) regression assuming linear additive relationships between operating history descriptors and battery SoH.',
      hyperparams: 'Fit intercept: True, Regularization: None',
      strength: 'Fast closed-form analytical solution; provides a transparent linear baseline.',
      weakness: 'Vulnerable to collinear features and fails to capture nonlinear degradation inflection points.'
    },
    {
      name: 'Ridge Regression',
      family: 'Regularized Linear',
      desc: 'L2-regularized linear model that shrinks regression weights toward zero to mitigate multicollinearity between correlated statistical moments.',
      hyperparams: 'Alpha = 1.0, Solver = Auto',
      strength: 'Stabilizes coefficient estimates when current/voltage moments are collinear.',
      weakness: 'Retains all features; remains constrained by linear assumption.'
    },
    {
      name: 'Elastic Net',
      family: 'Regularized Linear',
      desc: 'Convex combination of L1 (Lasso) and L2 (Ridge) penalties, balancing feature selection with group shrinkage.',
      hyperparams: 'Alpha = 0.1, L1-ratio = 0.5',
      strength: 'Selects sparse feature subsets while retaining groups of correlated features.',
      weakness: 'Requires hyperparameter tuning of both penalty scale and mixing ratio.'
    },
    {
      name: 'Random Forest',
      family: 'Ensemble Bagging',
      desc: 'Ensemble of 200 de-correlated decision trees trained via bootstrap aggregation (bagging) with random feature subspace sampling.',
      hyperparams: 'n_estimators = 200, max_depth = 12',
      strength: 'Captures complex high-order feature interactions and nonlinearities without feature scaling.',
      weakness: 'Cannot extrapolate beyond the range of training SoH values.'
    },
    {
      name: 'Extra Trees',
      family: 'Extremely Randomized Trees',
      desc: 'Variant of Random Forest that draws cut-points completely at random for each candidate feature rather than finding the optimal threshold.',
      hyperparams: 'n_estimators = 200, max_depth = 12',
      strength: 'Reduces variance significantly and accelerates training over standard random forests.',
      weakness: 'Slightly higher bias on small datasets.'
    },
    {
      name: 'Gradient Boosting',
      family: 'Sequential Boosting',
      desc: 'Iterative boosting regressor that sequentially trains shallow decision trees on pseudo-residuals of previous ensembles using gradient descent.',
      hyperparams: 'n_estimators = 200, learning_rate = 0.05, max_depth = 4',
      strength: 'Exceptional predictive accuracy on structured tabular features; naturally models subtle battery aging curves.',
      weakness: 'Sensitive to noisy outliers if learning rate is too aggressive.'
    }
  ];

  return (
    <section id="models" className="relative py-28 px-6 max-w-7xl mx-auto border-t border-[#1B2028]">
      
      {/* Section Header */}
      <div className="space-y-4 max-w-3xl mb-16">
        <div className="flex items-center space-x-2 font-mono text-xs tracking-widest text-[#00F0FF] uppercase">
          <span className="w-4 h-[1px] bg-[#00F0FF]" />
          <span>MODEL ARCHITECTURES</span>
        </div>

        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#F8FAFC] leading-[1.0]">
          SIX MODELS.<br />
          ONE QUESTION.
        </h2>

        <p className="text-sm text-[#94A3B8] leading-relaxed pt-2">
          We compare parametric linear models against nonlinear tree ensembles to identify whether complex interaction terms are required to accurately estimate battery State of Health.
        </p>
      </div>

      {/* 6 Models Connected to Same Feature Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: 6 Model Buttons */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {modelSpecs.map((m, idx) => {
            const isSelected = activeModel === idx;
            return (
              <button
                key={m.name}
                onClick={() => setActiveModel(idx)}
                className={`text-left p-5 rounded-sm border transition-all duration-300 flex flex-col justify-between h-36 ${
                  isSelected
                    ? 'border-[#00F0FF] bg-[#0D0F13] shadow-[0_0_20px_rgba(0,240,255,0.1)]'
                    : 'border-[#1B2028] bg-[#090A0D]/70 hover:border-[#2C3440] hover:bg-[#0D0F13]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className={isSelected ? 'text-[#00F0FF]' : 'text-[#64748B]'}>
                      0{idx + 1}
                    </span>
                    <span className="text-[#64748B]">{m.family}</span>
                  </div>
                  <div className={`text-base font-bold tracking-tight mt-2 ${isSelected ? 'text-[#F8FAFC]' : 'text-[#CBD5E1]'}`}>
                    {m.name}
                  </div>
                </div>

                <div className="flex items-center justify-between font-mono text-[10px] pt-2 border-t border-[#1B2028]">
                  <span className={isSelected ? 'text-[#00F0FF]' : 'text-[#475569]'}>
                    INSPECT ARCHITECTURE
                  </span>
                  <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-[#00F0FF]' : 'text-[#475569]'}`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Selected Model Detail & Metrics Explanations */}
        <div className="lg:col-span-6 space-y-6 sticky top-28">
          
          <div className="border border-[#1B2028] bg-[#090A0D] p-6 sm:p-8 rounded-sm space-y-5">
            
            <div className="flex items-center justify-between border-b border-[#1B2028] pb-4 font-mono text-xs">
              <span className="text-[#00F0FF] tracking-wider uppercase">
                {modelSpecs[activeModel].family}
              </span>
              <span className="text-[#64748B]">
                scikit-learn Pipeline
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-[#F8FAFC]">
                {modelSpecs[activeModel].name}
              </h3>
              <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                {modelSpecs[activeModel].desc}
              </p>
            </div>

            <div className="space-y-2.5 font-mono text-xs pt-2">
              <div className="p-3 bg-[#050607] border border-[#1B2028] rounded">
                <span className="text-[#64748B] text-[10px] block">HYPERPARAMETERS</span>
                <span className="text-[#00F0FF]">{modelSpecs[activeModel].hyperparams}</span>
              </div>
              <div className="p-3 bg-[#050607] border border-[#1B2028] rounded">
                <span className="text-[#64748B] text-[10px] block">THEORETICAL STRENGTH</span>
                <span className="text-[#CBD5E1]">{modelSpecs[activeModel].strength}</span>
              </div>
            </div>

          </div>

          {/* Metric Evaluation Definitions */}
          <div className="border border-[#1B2028] bg-[#0D0F13] p-6 rounded-sm space-y-4 font-mono text-xs">
            <div className="text-[#00F0FF] text-[10px] tracking-widest uppercase">
              EVALUATION BENCHMARK METRICS
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-[#050607] border border-[#1B2028] rounded">
                <div className="text-[#F8FAFC] font-bold">MAE</div>
                <div className="text-[10px] text-[#64748B] mt-1">Mean Absolute Error</div>
                <div className="text-[10px] text-[#94A3B8] mt-0.5">Average magnitude of errors in % SoH.</div>
              </div>

              <div className="p-3 bg-[#050607] border border-[#1B2028] rounded">
                <div className="text-[#F8FAFC] font-bold">RMSE</div>
                <div className="text-[10px] text-[#64748B] mt-1">Root Mean Squared</div>
                <div className="text-[10px] text-[#94A3B8] mt-0.5">Penalizes large rare deviations heavily.</div>
              </div>

              <div className="p-3 bg-[#050607] border border-[#1B2028] rounded">
                <div className="text-[#00F0FF] font-bold">R²</div>
                <div className="text-[10px] text-[#64748B] mt-1">Determination</div>
                <div className="text-[10px] text-[#94A3B8] mt-0.5">Fraction of total variance explained.</div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};
