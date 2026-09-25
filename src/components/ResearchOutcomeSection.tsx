import React from 'react';
import { ExperimentResults } from '../types/research';
import { CheckCircle2, ArrowRight, BookOpen, Layers } from 'lucide-react';

interface ResearchOutcomeSectionProps {
  results: ExperimentResults | null;
}

export const ResearchOutcomeSection: React.FC<ResearchOutcomeSectionProps> = ({ results }) => {
  const modelName = results?.selected_model.name || 'Gradient Boosting';
  const r2 = results?.selected_model.r2.toFixed(4) || '0.9595';
  const rmse = results?.selected_model.rmse.toFixed(4) || '3.1000';
  const mae = results?.selected_model.mae.toFixed(4) || '2.0658';
  const rmseImp = results?.improvement.rmse_percent.toFixed(2) || '80.76';
  const maeImp = results?.improvement.mae_percent.toFixed(2) || '84.50';
  const unseenR2 = results?.batterywise.selected_model.r2.toFixed(4) || '0.9311';
  const unseenRmse = results?.batterywise.selected_model.rmse.toFixed(4) || '3.0977';
  const slope = results?.degradation.mean_slope.toFixed(4) || '-1.7566';
  const topFeats = results?.top_features.slice(0, 5).map((f) => f.feature) || [
    'cycle_index',
    'rw_duration_s',
    'temperature_std',
    'temperature_min',
    'current_mean'
  ];

  return (
    <section id="outcome" className="relative py-28 px-6 max-w-7xl mx-auto border-t border-[#1B2028]">
      
      {/* Editorial Climax Header */}
      <div className="space-y-4 max-w-4xl mb-16">
        <div className="flex items-center space-x-2 font-mono text-xs tracking-widest text-[#00F0FF] uppercase">
          <span className="w-4 h-[1px] bg-[#00F0FF]" />
          <span>06 / SCIENTIFIC SYNTHESIS</span>
        </div>

        <h2 className="text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tighter text-[#F8FAFC] leading-[0.92]">
          THE RESULT<br />
          ISN’T THE MODEL.<br />
          <span className="text-[#94A3B8]">IT’S WHAT THE DATA TELLS US.</span>
        </h2>

        <p className="text-sm sm:text-base text-[#CBD5E1] font-light max-w-2xl pt-4">
          Machine learning algorithms are simply the lens. The true scientific discovery is the quantified degradation behavior extracted from real lithium-ion battery physics.
        </p>
      </div>

      {/* 5 Core Synthesized Findings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
        
        {/* Finding 1 */}
        <div className="border border-[#1B2028] bg-[#090A0D] p-6 rounded-sm space-y-3 relative overflow-hidden">
          <div className="text-[10px] text-[#00F0FF] uppercase font-bold tracking-widest">
            FINDING 01 • BASELINE REDUCTION
          </div>
          <div className="text-2xl font-extrabold text-[#F8FAFC]">
            -{rmseImp}% RMSE
          </div>
          <p className="text-xs text-[#94A3B8] font-sans leading-relaxed">
            Machine learning reduced estimation RMSE relative to the mean-SoH baseline by <strong className="text-[#F8FAFC]">{rmseImp}%</strong> and MAE by <strong className="text-[#F8FAFC]">{maeImp}%</strong>, confirming that randomized operating history contains predictive health information.
          </p>
        </div>

        {/* Finding 2 */}
        <div className="border border-[#1B2028] bg-[#090A0D] p-6 rounded-sm space-y-3 relative overflow-hidden">
          <div className="text-[10px] text-[#00F0FF] uppercase font-bold tracking-widest">
            FINDING 02 • RANDOM TEST SET
          </div>
          <div className="text-2xl font-extrabold text-[#F8FAFC]">
            R² = {r2}
          </div>
          <p className="text-xs text-[#94A3B8] font-sans leading-relaxed">
            The selected model (<strong className="text-[#00F0FF]">{modelName}</strong>) achieved an <strong className="text-[#F8FAFC]">R² of {r2}</strong> with an MAE of <strong className="text-[#F8FAFC]">{mae}%</strong> on the random held-out test partition.
          </p>
        </div>

        {/* Finding 3 */}
        <div className="border border-[#1B2028] bg-[#090A0D] p-6 rounded-sm space-y-3 relative overflow-hidden">
          <div className="text-[10px] text-[#00F0FF] uppercase font-bold tracking-widest">
            FINDING 03 • UNSEEN BATTERIES
          </div>
          <div className="text-2xl font-extrabold text-[#00F0FF]">
            R² = {unseenR2}
          </div>
          <p className="text-xs text-[#94A3B8] font-sans leading-relaxed">
            On completely unseen physical batteries held out via GroupShuffleSplit, the model maintained an <strong className="text-[#F8FAFC]">R² of {unseenR2}</strong> (RMSE: {unseenRmse}%), demonstrating cross-cell transferability.
          </p>
        </div>

        {/* Finding 4 */}
        <div className="border border-[#1B2028] bg-[#090A0D] p-6 rounded-sm space-y-3 relative overflow-hidden">
          <div className="text-[10px] text-[#00F0FF] uppercase font-bold tracking-widest">
            FINDING 04 • DEGRADATION KINETICS
          </div>
          <div className="text-2xl font-extrabold text-rose-400">
            {slope} % / cycle
          </div>
          <p className="text-xs text-[#94A3B8] font-sans leading-relaxed">
            The average State of Health trajectory across the NASA 18650 cell fleet exhibited an empirical degradation slope of <strong className="text-[#F8FAFC]">{slope} percentage points</strong> per reference cycle index.
          </p>
        </div>

        {/* Finding 5: Top Variables */}
        <div className="border border-[#00F0FF]/30 bg-[#0D0F13] p-6 rounded-sm space-y-3 lg:col-span-2 relative overflow-hidden">
          <div className="text-[10px] text-[#00F0FF] uppercase font-bold tracking-widest">
            FINDING 05 • INFLUENTIAL OPERATIONAL DRIVERS
          </div>
          <div className="text-lg font-bold text-[#F8FAFC]">
            Top 5 Operating-History Variables:
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {topFeats.map((feat, idx) => (
              <span
                key={feat}
                className="px-3 py-1.5 bg-[#050607] border border-[#1B2028] text-[#00F0FF] rounded-sm font-mono text-xs flex items-center space-x-1.5"
              >
                <span className="text-[#64748B]">#{idx + 1}</span>
                <span>{feat}</span>
              </span>
            ))}
          </div>
          <p className="text-xs text-[#94A3B8] font-sans leading-relaxed pt-1">
            Permutation importance and SHAP confirm that cumulative duration and thermal dispersion metrics are the most informative features alongside sequential life progression.
          </p>
        </div>

      </div>

    </section>
  );
};
