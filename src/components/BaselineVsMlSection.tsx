import React from 'react';
import { TrendingDown, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { ModelMetric, ImprovementMetrics } from '../types/research';

interface BaselineVsMlSectionProps {
  baseline: ModelMetric;
  selectedModel: ModelMetric;
  improvement: ImprovementMetrics;
}

export const BaselineVsMlSection: React.FC<BaselineVsMlSectionProps> = ({
  baseline,
  selectedModel,
  improvement
}) => {
  return (
    <section className="relative py-28 px-6 max-w-7xl mx-auto border-t border-[#1B2028]">
      
      <div className="space-y-4 max-w-3xl mb-16">
        <div className="flex items-center space-x-2 font-mono text-xs tracking-widest text-[#00F0FF] uppercase">
          <span className="w-4 h-[1px] bg-[#00F0FF]" />
          <span>HYPOTHESIS H1 VALIDATION</span>
        </div>

        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#F8FAFC] leading-[1.0]">
          BASELINE VS.<br />
          MACHINE LEARNING.
        </h2>

        <p className="text-sm text-[#94A3B8] leading-relaxed pt-2">
          An ML model is scientifically meaningful only if it demonstrably outperforms a trivial mean prediction. We benchmark against a dummy regressor predicting training-set mean SoH.
        </p>
      </div>

      {/* Side by Side Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left: Direct Comparison Cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Baseline Dummy Predictor */}
          <div className="border border-[#1B2028] bg-[#090A0D] p-6 rounded-sm space-y-4">
            <div className="font-mono text-[10px] text-[#64748B] uppercase tracking-wider">
              NULL BENCHMARK
            </div>
            <div className="text-lg font-bold text-[#CBD5E1]">
              Mean-SoH Baseline
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Predicts the constant historical training mean (ȳ) for every test sample.
            </p>

            <div className="pt-4 border-t border-[#1B2028] space-y-2 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-[#64748B]">RMSE ERROR:</span>
                <span className="text-rose-400 font-bold">{baseline.rmse.toFixed(4)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">MAE ERROR:</span>
                <span className="text-[#CBD5E1]">{baseline.mae.toFixed(4)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">R² DETERMINATION:</span>
                <span className="text-[#64748B]">{baseline.r2.toFixed(4)}</span>
              </div>
            </div>
          </div>

          {/* Selected ML Model */}
          <div className="border border-[#00F0FF]/40 bg-[#0D0F13] p-6 rounded-sm space-y-4 shadow-[0_0_30px_rgba(0,240,255,0.06)]">
            <div className="font-mono text-[10px] text-[#00F0FF] uppercase tracking-wider flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse" />
              <span>RESEARCH OUTCOME</span>
            </div>
            <div className="text-lg font-bold text-[#F8FAFC]">
              {selectedModel.name}
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Extracts 23 operating-history features to estimate degradation trajectories.
            </p>

            <div className="pt-4 border-t border-[#1B2028] space-y-2 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-[#64748B]">RMSE ERROR:</span>
                <span className="text-[#00F0FF] font-bold">{selectedModel.rmse.toFixed(4)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">MAE ERROR:</span>
                <span className="text-[#CBD5E1] font-semibold">{selectedModel.mae.toFixed(4)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">R² DETERMINATION:</span>
                <span className="text-emerald-400 font-bold">{selectedModel.r2.toFixed(4)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right: Massive Error Reduction Callout */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border border-[#1B2028] bg-[#050607] p-8 rounded-sm space-y-6">
            
            <div className="font-mono text-xs text-[#00F0FF] tracking-widest uppercase">
              MEASURED ERROR REDUCTION
            </div>

            <div className="space-y-1">
              <div className="text-6xl sm:text-7xl font-extrabold text-[#F8FAFC] tracking-tighter">
                -{improvement.rmse_percent.toFixed(2)}%
              </div>
              <div className="text-xs font-mono text-emerald-400 tracking-wider uppercase font-semibold">
                RMSE REDUCTION VS. MEAN BASELINE
              </div>
            </div>

            <div className="text-xs text-[#94A3B8] leading-relaxed border-t border-[#1B2028] pt-4">
              “The baseline predicts the mean SoH observed in the training set for every test observation. The ML model is useful only to the extent that it improves on this simple reference.”
            </div>

            <div className="p-3 bg-[#0D0F13] border border-emerald-500/20 text-emerald-400 font-mono text-[11px] rounded flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Hypothesis H1 is strongly supported by the experimental data.</span>
            </div>

          </div>
        </div>

      </div>

    </section>
  );
};
