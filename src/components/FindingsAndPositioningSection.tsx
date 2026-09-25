import React from 'react';
import { ExperimentResults } from '../types/research';
import { Check, CheckCircle2, HelpCircle, Ban, ArrowUp, Shield } from 'lucide-react';

interface FindingsAndPositioningSectionProps {
  results: ExperimentResults | null;
}

export const FindingsAndPositioningSection: React.FC<FindingsAndPositioningSectionProps> = ({
  results
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const modelName = results?.selected_model.name || 'Gradient Boosting';
  const r2 = results?.selected_model.r2.toFixed(4) || '0.9595';
  const rmse = results?.selected_model.rmse.toFixed(4) || '3.1000';
  const mae = results?.selected_model.mae.toFixed(4) || '2.0658';
  const rmseImp = results?.improvement.rmse_percent.toFixed(2) || '80.76';
  const maeImp = results?.improvement.mae_percent.toFixed(2) || '84.50';
  const unseenR2 = results?.batterywise.selected_model.r2.toFixed(4) || '0.9311';
  const slope = results?.degradation.mean_slope.toFixed(4) || '-1.7566';
  const topFeats = results?.top_features.slice(0, 5).map((f) => f.feature) || [
    'cycle_index',
    'rw_duration_s',
    'temperature_std',
    'temperature_min',
    'current_mean'
  ];

  return (
    <section id="findings" className="relative py-20 px-6 max-w-7xl mx-auto border-t border-[#1B2028] space-y-16">
      
      {/* 5 Core Synthesized Findings */}
      <div className="space-y-8">
        <div className="space-y-3 max-w-3xl">
          <div className="flex items-center space-x-2 font-mono text-xs tracking-widest text-[#00F0FF] uppercase">
            <span className="w-4 h-[1px] bg-[#00F0FF]" />
            <span>05 / SCIENTIFIC SYNTHESIS & FINDINGS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F8FAFC]">
            THE RESULT ISN’T THE MODEL.<br />
            <span className="text-[#94A3B8]">IT’S WHAT THE DATA TELLS US.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
          
          <div className="border border-[#1B2028] bg-[#090A0D] p-5 rounded-sm space-y-2">
            <div className="text-[10px] text-[#00F0FF] uppercase font-bold">01 • BASELINE REDUCTION</div>
            <div className="text-xl font-bold text-[#F8FAFC]">-{rmseImp}% RMSE</div>
            <p className="text-xs text-[#94A3B8] font-sans leading-relaxed">
              ML reduced estimation error relative to the training-mean dummy baseline by <strong className="text-[#F8FAFC]">{rmseImp}%</strong>.
            </p>
          </div>

          <div className="border border-[#1B2028] bg-[#090A0D] p-5 rounded-sm space-y-2">
            <div className="text-[10px] text-[#00F0FF] uppercase font-bold">02 • RANDOM SPLIT</div>
            <div className="text-xl font-bold text-[#F8FAFC]">R² = {r2}</div>
            <p className="text-xs text-[#94A3B8] font-sans leading-relaxed">
              {modelName} achieved R² of {r2} with MAE = {mae}% on the 80/20 test split.
            </p>
          </div>

          <div className="border border-[#1B2028] bg-[#090A0D] p-5 rounded-sm space-y-2">
            <div className="text-[10px] text-[#00F0FF] uppercase font-bold">03 • UNSEEN BATTERIES</div>
            <div className="text-xl font-bold text-[#00F0FF]">R² = {unseenR2}</div>
            <p className="text-xs text-[#94A3B8] font-sans leading-relaxed">
              Maintained R² of {unseenR2} on completely held-out physical cells (RW1, RW7, RW8).
            </p>
          </div>

          <div className="border border-[#1B2028] bg-[#090A0D] p-5 rounded-sm space-y-2">
            <div className="text-[10px] text-[#00F0FF] uppercase font-bold">04 • DEGRADATION SLOPE</div>
            <div className="text-xl font-bold text-rose-400">{slope} % / cycle</div>
            <p className="text-xs text-[#94A3B8] font-sans leading-relaxed">
              Empirical degradation across 18650 cells averaged {slope} % SoH per cycle index.
            </p>
          </div>

          <div className="border border-[#00F0FF]/30 bg-[#0D0F13] p-5 rounded-sm space-y-2 lg:col-span-2">
            <div className="text-[10px] text-[#00F0FF] uppercase font-bold">05 • TOP INFLUENTIAL DRIVERS</div>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {topFeats.map((feat, idx) => (
                <span key={feat} className="px-2.5 py-1 bg-[#050607] border border-[#1B2028] text-[#00F0FF] rounded-sm text-[11px]">
                  #{idx + 1} {feat}
                </span>
              ))}
            </div>
            <p className="text-xs text-[#94A3B8] font-sans leading-relaxed pt-1">
              Cumulative operating duration and thermal dispersion are the primary physical factors alongside sequential life progression.
            </p>
          </div>

        </div>
      </div>

      {/* Novelty vs Limitations 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
        
        {/* Left: Study Novelty Pillars */}
        <div className="border border-[#1B2028] bg-[#090A0D] p-6 rounded-sm space-y-4">
          <div className="flex items-center space-x-2 text-[#00F0FF] font-bold text-xs uppercase">
            <Shield className="w-4 h-4" />
            <span>STUDY NOVELTY & POSITIONING</span>
          </div>
          <p className="text-[#94A3B8] font-sans text-xs leading-relaxed">
            This study does not claim a new battery algorithm. Its contribution is a lightweight, reproducible pipeline that:
          </p>
          <ul className="space-y-1.5 text-xs text-[#CBD5E1] font-sans">
            <li>1. Converts randomized intervals into compact 23-feature moments.</li>
            <li>2. Estimates SoH strictly from the subsequent benchmark (zero leakage).</li>
            <li>3. Compares linear parametric vs non-linear ensemble models.</li>
            <li>4. Evaluates generalization on unseen physical battery packs.</li>
            <li>5. Employs model-agnostic explainability (Permutation & SHAP).</li>
          </ul>
        </div>

        {/* Right: Academic Limitations */}
        <div className="border border-[#1B2028] bg-[#090A0D] p-6 rounded-sm space-y-4">
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase">
            <Ban className="w-4 h-4" />
            <span>WHAT THIS STUDY DOESN’T CLAIM</span>
          </div>
          <p className="text-[#64748B] font-sans text-xs leading-relaxed">
            Transparent scientific constraints acknowledged in the final report:
          </p>
          <ul className="space-y-1.5 text-xs text-[#94A3B8] font-sans">
            <li>• Labels come from periodic discharge tests, not continuous real-time SoH.</li>
            <li>• Feature summarization intentionally discards microsecond waveforms.</li>
            <li>• Evaluated via single group-holdout realization on NASA 18650 dataset.</li>
            <li>• Does not claim a universal or electrochemical state-of-the-art model.</li>
            <li>• Feature attributions represent model reliance, not direct causation.</li>
          </ul>
        </div>

      </div>

      {/* 3 Pillars: Observed vs Interpreted vs Not Claimed */}
      <div className="border border-[#1B2028] bg-[#050607] p-6 sm:p-8 rounded-sm space-y-6 font-mono text-xs">
        <h3 className="text-lg font-bold text-[#F8FAFC] font-sans">
          WHAT WE LEARNED
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <span className="text-emerald-400 font-bold text-[10px] uppercase">OBSERVED (MEASURED)</span>
            <p className="text-xs text-[#CBD5E1] font-sans leading-relaxed">
              {modelName} reduced RMSE by {rmseImp}% over dummy mean, achieved R² = {r2} (test) and R² = {unseenR2} (unseen cells), with degradation rate of {slope}% / cycle.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-[#00F0FF] font-bold text-[10px] uppercase">INTERPRETED (SUGGESTED)</span>
            <p className="text-xs text-[#CBD5E1] font-sans leading-relaxed">
              Statistical moments of randomized load contain strong degradation signals; non-linear models bridge cell-to-cell variations where linear models fail.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-[#64748B] font-bold text-[10px] uppercase">NOT CLAIMED (LIMITS)</span>
            <p className="text-xs text-[#64748B] font-sans leading-relaxed">
              Does not establish electrochemical aging physics or universal transfer across different battery chemistries without recalibration.
            </p>
          </div>
        </div>
      </div>

      {/* Academic Signature */}
      <div className="border-t border-[#1B2028] pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 font-mono text-xs">
        <div className="space-y-1">
          <div className="text-base font-bold text-[#F8FAFC] font-sans">
            SHLOK VIJ
          </div>
          <div className="text-[#64748B] text-xs">
            PRN: <span className="text-[#CBD5E1]">230705211143</span> • Semester VII, Section B • Data Science Group A
          </div>
          <div className="text-[#64748B] text-xs">
            Symbiosis Institute of Technology, Nagpur
          </div>
        </div>

        <button
          onClick={scrollToTop}
          className="flex items-center space-x-2 px-4 py-2 border border-[#1B2028] hover:border-[#00F0FF]/40 text-[#94A3B8] hover:text-[#F8FAFC] rounded-sm bg-[#090A0D] transition-colors"
        >
          <span>BACK TO TOP</span>
          <ArrowUp className="w-3.5 h-3.5 text-[#00F0FF]" />
        </button>
      </div>

    </section>
  );
};
