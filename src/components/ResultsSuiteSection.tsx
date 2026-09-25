import React, { useState } from 'react';
import { ExperimentResults } from '../types/research';
import { ModelComparisonTable } from './ModelComparisonTable';
import { ActualVsPredictedPlot } from './ActualVsPredictedPlot';
import { BatteryDegradationPlot } from './BatteryDegradationPlot';
import { GeneralizationSection } from './GeneralizationSection';
import { ArrowDownRight, ShieldCheck, Activity, BarChart2, TrendingDown, Target } from 'lucide-react';

interface ResultsSuiteSectionProps {
  results: ExperimentResults | null;
}

export const ResultsSuiteSection: React.FC<ResultsSuiteSectionProps> = ({ results }) => {
  const [activeView, setActiveView] = useState<'degradation' | 'scatter' | 'table' | 'unseen'>('degradation');

  const selectedModel = results?.selected_model || {
    name: 'Gradient Boosting',
    mae: 2.0658,
    rmse: 3.1000,
    r2: 0.9595
  };

  const improvement = results?.improvement || {
    mae_percent: 84.50,
    rmse_percent: 80.76
  };

  const unseenR2 = results?.batterywise?.selected_model?.r2 ?? 0.9311;

  return (
    <section id="results" className="relative py-20 px-6 max-w-7xl mx-auto border-t border-[#1B2028]">
      
      {/* Editorial Results Header */}
      <div className="space-y-4 max-w-4xl mb-12">
        <div className="flex items-center space-x-2 font-mono text-xs tracking-widest text-[#00F0FF] uppercase">
          <span className="w-4 h-[1px] bg-[#00F0FF]" />
          <span>03 / RESEARCH RESULTS & EVIDENCE</span>
        </div>

        <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter text-[#F8FAFC] leading-[0.95]">
          WHAT DID THE MODEL<br />
          ACTUALLY DISCOVER?
        </h2>

        <p className="text-sm sm:text-base text-[#94A3B8] font-light max-w-2xl pt-2">
          Empirical discoveries calculated from the 315 segmented NASA cycles. High predictive fidelity achieved strictly through operational moments.
        </p>
      </div>

      {/* Hero Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 font-mono">
        
        {/* Metric 1 */}
        <div className="border border-[#1B2028] bg-[#090A0D] p-5 rounded-sm space-y-1">
          <div className="text-[10px] tracking-widest text-[#64748B] uppercase">01 / TEST MAE</div>
          <div className="text-3xl font-light text-[#F8FAFC] tracking-tight">
            {selectedModel.mae.toFixed(4)}
            <span className="text-sm text-[#00F0FF] ml-1">%</span>
          </div>
          <p className="text-[11px] text-[#64748B]">Average absolute SoH deviation</p>
        </div>

        {/* Metric 2 */}
        <div className="border border-[#1B2028] bg-[#090A0D] p-5 rounded-sm space-y-1">
          <div className="text-[10px] tracking-widest text-[#64748B] uppercase">02 / TEST RMSE</div>
          <div className="text-3xl font-light text-[#F8FAFC] tracking-tight">
            {selectedModel.rmse.toFixed(4)}
            <span className="text-sm text-[#00F0FF] ml-1">%</span>
          </div>
          <p className="text-[11px] text-[#64748B]">Root mean squared error</p>
        </div>

        {/* Metric 3 */}
        <div className="border border-[#1B2028] bg-[#090A0D] p-5 rounded-sm space-y-1">
          <div className="text-[10px] tracking-widest text-[#64748B] uppercase">03 / EXPLAINED VARIANCE</div>
          <div className="text-3xl font-light text-[#00F0FF] tracking-tight">
            {selectedModel.r2.toFixed(4)}
          </div>
          <p className="text-[11px] text-[#64748B]">95.9% total variance explained</p>
        </div>

        {/* Metric 4 */}
        <div className="border border-[#00F0FF]/30 bg-[#0D0F13] p-5 rounded-sm space-y-1">
          <div className="text-[10px] tracking-widest text-emerald-400 uppercase font-semibold">04 / BASELINE REDUCTION</div>
          <div className="text-3xl font-bold text-emerald-400 tracking-tight">
            -{improvement.rmse_percent.toFixed(1)}%
          </div>
          <p className="text-[11px] text-[#64748B]">Vs. mean-SoH dummy baseline</p>
        </div>

      </div>

      {/* Interactive Visualization Suite Switcher */}
      <div className="border border-[#1B2028] bg-[#090A0D] rounded-sm p-6 sm:p-8 space-y-6">
        
        {/* Navigation Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1B2028] pb-4 font-mono text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'degradation', label: 'BATTERY DEGRADATION CURVES', icon: TrendingDown },
              { id: 'scatter', label: 'ACTUAL VS. PREDICTED', icon: Target },
              { id: 'table', label: '6-MODEL BENCHMARK TABLE', icon: BarChart2 },
              { id: 'unseen', label: 'UNSEEN BATTERIES (HOLD-OUT)', icon: ShieldCheck }
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id as any)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-sm border transition-colors ${
                    isSelected
                      ? 'border-[#00F0FF] bg-[#00F0FF]/15 text-[#00F0FF] font-bold'
                      : 'border-[#1B2028] bg-[#050607] text-[#94A3B8] hover:text-[#CBD5E1]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <span className="text-[10px] text-[#64748B]">
            INTERACTIVE RESEARCH SUITE
          </span>
        </div>

        {/* Dynamic Visualization Component */}
        <div className="pt-2">
          {activeView === 'degradation' && results && (
            <BatteryDegradationPlot
              trajectories={results.trajectories}
              meanTrajectory={results.mean_trajectory}
              meanSlope={results.degradation.mean_slope}
            />
          )}

          {activeView === 'scatter' && results && (
            <ActualVsPredictedPlot
              points={results.actual_vs_predicted}
            />
          )}

          {activeView === 'table' && results && (
            <ModelComparisonTable
              models={results.models}
              selectedModelName={results.selected_model.name}
            />
          )}

          {activeView === 'unseen' && results && (
            <GeneralizationSection
              batterywise={results.batterywise}
              randomSplitModel={results.selected_model}
            />
          )}
        </div>

      </div>

    </section>
  );
};
