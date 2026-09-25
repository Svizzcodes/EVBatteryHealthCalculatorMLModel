import React from 'react';
import { ShieldCheck, Check, HelpCircle, Ban, ArrowUp } from 'lucide-react';
import { ExperimentResults } from '../types/research';

interface ConclusionSectionProps {
  results: ExperimentResults | null;
}

export const ConclusionSection: React.FC<ConclusionSectionProps> = ({ results }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const modelName = results?.selected_model.name || 'Gradient Boosting';
  const r2 = results?.selected_model.r2.toFixed(4) || '0.9595';
  const unseenR2 = results?.batterywise.selected_model.r2.toFixed(4) || '0.9311';
  const rmseReduction = results?.improvement.rmse_percent.toFixed(2) || '80.76';
  const degradationSlope = results?.degradation.mean_slope.toFixed(4) || '-1.7566';

  return (
    <footer className="relative py-28 px-6 max-w-7xl mx-auto border-t border-[#1B2028]">
      
      {/* Climax Heading */}
      <div className="space-y-4 max-w-3xl mb-16">
        <div className="flex items-center space-x-2 font-mono text-xs tracking-widest text-[#00F0FF] uppercase">
          <span className="w-4 h-[1px] bg-[#00F0FF]" />
          <span>FINAL SCIENTIFIC POSITION</span>
        </div>

        <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#F8FAFC] leading-[1.0]">
          WHAT WE<br />
          LEARNED.
        </h2>
      </div>

      {/* 3 Pillars: Observed vs Interpreted vs Not Claimed */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs mb-20">
        
        {/* Pillar 1: Observed */}
        <div className="border border-[#1B2028] bg-[#090A0D] p-6 rounded-sm space-y-4">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold tracking-widest uppercase text-[10px]">
            <Check className="w-4 h-4" />
            <span>01 / OBSERVED (MEASURED)</span>
          </div>
          <p className="text-xs text-[#CBD5E1] font-sans leading-relaxed">
            What the experiment directly quantified:
          </p>
          <ul className="space-y-2 text-[#94A3B8] font-sans text-xs">
            <li>• {modelName} reduced RMSE by {rmseReduction}% compared to the training-mean baseline.</li>
            <li>• Reached R² of {r2} on random test split and R² of {unseenR2} on unseen physical cells.</li>
            <li>• Empirical degradation rate averaged {degradationSlope}% SoH per reference cycle.</li>
          </ul>
        </div>

        {/* Pillar 2: Interpreted */}
        <div className="border border-[#00F0FF]/30 bg-[#0D0F13] p-6 rounded-sm space-y-4">
          <div className="flex items-center space-x-2 text-[#00F0FF] font-bold tracking-widest uppercase text-[10px]">
            <HelpCircle className="w-4 h-4" />
            <span>02 / INTERPRETED (SUGGESTED)</span>
          </div>
          <p className="text-xs text-[#CBD5E1] font-sans leading-relaxed">
            What the evidence indicates:
          </p>
          <ul className="space-y-2 text-[#94A3B8] font-sans text-xs">
            <li>• Statistical feature moments from randomized loads retain strong predictive battery health signals.</li>
            <li>• Non-linear tree ensembles generalize across cell manufacturing variance where linear models fail.</li>
            <li>• Operating duration and thermal volatility are critical drivers for state of health tracking.</li>
          </ul>
        </div>

        {/* Pillar 3: Not Claimed */}
        <div className="border border-[#1B2028] bg-[#090A0D] p-6 rounded-sm space-y-4">
          <div className="flex items-center space-x-2 text-[#64748B] font-bold tracking-widest uppercase text-[10px]">
            <Ban className="w-4 h-4" />
            <span>03 / NOT CLAIMED (BOUNDARIES)</span>
          </div>
          <p className="text-xs text-[#CBD5E1] font-sans leading-relaxed">
            What the study cannot establish:
          </p>
          <ul className="space-y-2 text-[#64748B] font-sans text-xs">
            <li>• Does not claim a new electrochemical physical battery aging law or universal SOTA.</li>
            <li>• Permutation/SHAP attributions do not imply isolated physical causation.</li>
            <li>• Findings apply specifically to the NASA randomized 18650 cell evaluation protocol.</li>
          </ul>
        </div>

      </div>

      {/* Student & Institution Academic Signature */}
      <div className="border-t border-[#1B2028] pt-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 font-mono text-xs">
        
        <div className="space-y-2">
          <div className="text-lg font-bold text-[#F8FAFC] tracking-tight font-sans">
            SHLOK VIJ
          </div>
          <div className="text-[#64748B] text-xs space-y-0.5">
            <div>PRN: <span className="text-[#CBD5E1]">230705211143</span> • Semester VII, Section B</div>
            <div>Subject: <span className="text-[#CBD5E1]">Data Science Group A (Mini-Project CA3)</span></div>
            <div>Symbiosis Institute of Technology, Nagpur</div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={scrollToTop}
            className="flex items-center space-x-2 px-4 py-2 border border-[#1B2028] hover:border-[#00F0FF]/40 text-[#94A3B8] hover:text-[#F8FAFC] rounded-sm bg-[#090A0D] transition-colors"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#00F0FF]" />
          </button>
        </div>

      </div>

    </footer>
  );
};
