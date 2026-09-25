import React, { useState } from 'react';
import { Database, Binary, Cpu, Eye, ChevronRight, ChevronDown, CheckCircle2 } from 'lucide-react';

export const CompactHowItWorks: React.FC<{ onOpenReport: () => void }> = ({ onOpenReport }) => {
  const [activeItem, setActiveItem] = useState<number | null>(0);

  const pillars = [
    {
      step: '01',
      title: 'NASA RANDOMIZED USE DATASET',
      desc: 'Dataset #11 from NASA Ames Prognostics Center of Excellence (PCoE). 18650 Li-ion cells subjected to randomized walk discharge and charge profiles (-4.5A to +4.5A) with periodic standard reference cycles.',
      icon: Database
    },
    {
      step: '02',
      title: '23 PHYSICAL STATISTICAL MOMENTS',
      desc: 'Raw second-by-second time-series are compressed into statistical moments (mean, std, min, max, range for current, voltage, temperature) plus cumulative Ah charge/discharge throughput and duration.',
      icon: Binary
    },
    {
      step: '03',
      title: '6 REGRESSION ARCHITECTURES',
      desc: 'Ordinary Least Squares, Ridge, and Elastic Net compared against Random Forest, Extra Trees, and Gradient Boosting. Gradient Boosting achieved R² = 0.9595 with -80.76% RMSE reduction over the mean baseline.',
      icon: Cpu
    },
    {
      step: '04',
      title: 'MODEL-AGNOSTIC EXPLAINABILITY',
      desc: 'Permutation Importance and TreeExplainer SHAP reveal which operational variables the models prioritize, identifying cumulative operating duration and thermal volatility as key indicators.',
      icon: Eye
    }
  ];

  return (
    <section id="how-it-works" className="relative py-16 px-6 max-w-7xl mx-auto border-t border-[#1B2028]">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center space-x-2 font-mono text-xs tracking-widest text-[#00F0FF] uppercase">
            <span className="w-4 h-[1px] bg-[#00F0FF]" />
            <span>HOW IT WORKS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F8FAFC]">
            UNDER THE HOOD.
          </h2>

          <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
            The mathematical and experimental foundation quietly powering our State of Health estimator.
          </p>
        </div>

        <button
          onClick={onOpenReport}
          className="self-start md:self-auto px-4 py-2 border border-[#1B2028] hover:border-[#00F0FF]/40 text-[#CBD5E1] hover:text-[#F8FAFC] font-mono text-xs rounded-sm bg-[#090A0D] transition-colors flex items-center space-x-2"
        >
          <span>VIEW FULL RESEARCH PAPER</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#00F0FF]" />
        </button>
      </div>

      {/* 4 Compact Expandable Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        {pillars.map((p, idx) => {
          const Icon = p.icon;
          const isOpen = activeItem === idx;

          return (
            <div
              key={p.step}
              onClick={() => setActiveItem(isOpen ? null : idx)}
              className={`p-5 border rounded-sm transition-all cursor-pointer ${
                isOpen
                  ? 'border-[#00F0FF] bg-[#0D0F13] shadow-[0_0_20px_rgba(0,240,255,0.06)]'
                  : 'border-[#1B2028] bg-[#090A0D]/70 hover:border-[#2C3440]'
              }`}
            >
              <div className="flex items-center justify-between text-[#64748B] text-[10px] mb-3">
                <span className={isOpen ? 'text-[#00F0FF] font-bold' : ''}>STEP {p.step}</span>
                <Icon className={`w-4 h-4 ${isOpen ? 'text-[#00F0FF]' : 'text-[#64748B]'}`} />
              </div>

              <h3 className={`text-sm font-bold tracking-tight font-sans ${isOpen ? 'text-[#F8FAFC]' : 'text-[#CBD5E1]'}`}>
                {p.title}
              </h3>

              <p className="text-xs text-[#94A3B8] font-sans leading-relaxed pt-2">
                {p.desc}
              </p>
            </div>
          );
        })}
      </div>

    </section>
  );
};
