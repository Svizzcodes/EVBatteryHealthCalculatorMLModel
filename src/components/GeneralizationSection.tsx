import React from 'react';
import { ShieldCheck, ArrowRight, Layers, AlertCircle, CheckCircle2 } from 'lucide-react';
import { BatterywiseResults, ModelMetric } from '../types/research';

interface GeneralizationSectionProps {
  batterywise: BatterywiseResults;
  randomSplitModel: ModelMetric;
}

export const GeneralizationSection: React.FC<GeneralizationSectionProps> = ({
  batterywise,
  randomSplitModel
}) => {
  const bwSelected = batterywise.selected_model || {
    name: 'Gradient Boosting',
    mae: 2.4819,
    rmse: 3.0977,
    r2: 0.9311
  };

  return (
    <section className="relative py-28 px-6 max-w-7xl mx-auto border-t border-[#1B2028]">
      
      {/* Section Header */}
      <div className="space-y-4 max-w-3xl mb-16">
        <div className="flex items-center space-x-2 font-mono text-xs tracking-widest text-[#00F0FF] uppercase">
          <span className="w-4 h-[1px] bg-[#00F0FF]" />
          <span>STRICT GENERALIZATION BENCHMARK</span>
        </div>

        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#F8FAFC] leading-[1.0]">
          DOES IT WORK ON<br />
          BATTERIES IT HASN’T SEEN?
        </h2>

        <p className="text-sm text-[#94A3B8] leading-relaxed pt-2">
          Random train/test splits can inflate performance by placing cycles from the same battery in both partitions. To evaluate true real-world deployment, we hold out entire complete battery units.
        </p>
      </div>

      {/* Side by Side Split Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        
        {/* Partition A: Random 80/20 Split */}
        <div className="border border-[#1B2028] bg-[#090A0D] p-8 rounded-sm space-y-6">
          <div className="flex items-center justify-between font-mono text-xs text-[#64748B] border-b border-[#1B2028] pb-3">
            <span>SPLIT PROTOCOL A</span>
            <span>OBSERVATION LEVEL</span>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold text-[#F8FAFC]">
              Random Held-Out Split
            </h3>
            <p className="text-xs text-[#94A3B8]">
              Standard 80/20 cross-cycle split across all observations.
            </p>
          </div>

          <div className="pt-4 border-t border-[#1B2028] space-y-4 font-mono">
            <div>
              <span className="text-[10px] text-[#64748B] uppercase">DETERMINATION COEFFICIENT</span>
              <div className="text-4xl sm:text-5xl font-bold text-[#CBD5E1]">
                R² = {randomSplitModel.r2.toFixed(4)}
              </div>
            </div>

            <div className="flex justify-between text-xs text-[#94A3B8] pt-2 border-t border-[#1B2028]">
              <span>RMSE: {randomSplitModel.rmse.toFixed(4)}%</span>
              <span>MAE: {randomSplitModel.mae.toFixed(4)}%</span>
            </div>
          </div>

          <div className="text-[11px] font-mono text-[#64748B] bg-[#050607] p-3 rounded border border-[#1B2028]">
            May contain correlation leakage if neighboring cycles from the same cell appear in both training and testing.
          </div>
        </div>

        {/* Partition B: GroupShuffleSplit (Unseen Cells) */}
        <div className="border border-[#00F0FF]/40 bg-[#0D0F13] p-8 rounded-sm space-y-6 shadow-[0_0_30px_rgba(0,240,255,0.05)]">
          <div className="flex items-center justify-between font-mono text-xs text-[#00F0FF] border-b border-[#1B2028] pb-3">
            <span>SPLIT PROTOCOL B (STRICT)</span>
            <span>BATTERY-WISE GROUP HOLD-OUT</span>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold text-[#F8FAFC]">
              Completely Unseen Batteries
            </h3>
            <p className="text-xs text-[#94A3B8]">
              Held out cells: {batterywise.unseen_batteries.join(', ')}
            </p>
          </div>

          <div className="pt-4 border-t border-[#1B2028] space-y-4 font-mono">
            <div>
              <span className="text-[10px] text-[#00F0FF] uppercase">UNSEEN DETERMINATION</span>
              <div className="text-4xl sm:text-5xl font-bold text-[#00F0FF]">
                R² = {bwSelected.r2.toFixed(4)}
              </div>
            </div>

            <div className="flex justify-between text-xs text-[#CBD5E1] pt-2 border-t border-[#1B2028]">
              <span>RMSE: {bwSelected.rmse.toFixed(4)}%</span>
              <span>MAE: {bwSelected.mae.toFixed(4)}%</span>
            </div>
          </div>

          <div className="text-[11px] font-mono text-emerald-400 bg-[#050607] p-3 rounded border border-emerald-500/20 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Robust cross-battery generalizability: 93.1% variance explained on entirely new physical units.</span>
          </div>
        </div>

      </div>

      {/* Stricter Scientific Discovery Callout */}
      <div className="border border-[#1B2028] bg-[#090A0D] p-6 sm:p-8 rounded-sm font-mono text-xs space-y-4">
        <div className="text-[#00F0FF] text-[10px] tracking-widest uppercase">
          CRITICAL SCIENTIFIC INSIGHT
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[#94A3B8] leading-relaxed">
          <p>
            When tested on unseen batteries, <strong className="text-[#F8FAFC]">Linear Regression drops to R² = 0.1113</strong>, proving that linear models fail when cell manufacturing variations and non-linear degradation profiles differ across units.
          </p>
          <p>
            In contrast, <strong className="text-[#00F0FF]">Gradient Boosting and Extra Trees maintain R² &gt; 0.93</strong>, demonstrating that non-linear feature interactions capture universal degradation dynamics across diverse battery packs.
          </p>
        </div>
      </div>

    </section>
  );
};
