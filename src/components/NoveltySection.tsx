import React from 'react';
import { Shield, Sparkles, Check, GitCommit } from 'lucide-react';

export const NoveltySection: React.FC = () => {
  const contributions = [
    {
      num: '01',
      title: 'Compact Operating Descriptors',
      desc: 'Converts chaotic high-frequency randomized current intervals into 23 interpretable physical moments (current, voltage, temperature, throughput, duration).'
    },
    {
      num: '02',
      title: 'Causal Benchmark Target Formulation',
      desc: 'Estimates State of Health strictly from the subsequent standard reference measurement, guaranteeing zero future data leakage.'
    },
    {
      num: '03',
      title: 'Parametric vs Non-linear Comparison',
      desc: 'Rigorously contrasts standard Ordinary Least Squares, Ridge, and Elastic Net with Random Forest, Extra Trees, and Gradient Boosting.'
    },
    {
      num: '04',
      title: 'Strict Battery-Wise Hold-Out',
      desc: 'Evaluates generalization on completely unseen physical cells (GroupShuffleSplit) to test whether learned models transfer across independent battery packs.'
    },
    {
      num: '05',
      title: 'Model-Agnostic Explainability',
      desc: 'Combines prediction accuracy with Permutation Importance and SHAP attribution to identify which operational variables the models relied upon.'
    },
    {
      num: '06',
      title: 'Actionable Data Science Outcome',
      desc: 'Transforms model performance into an interpretable research outcome rather than treating the project merely as an algorithm leaderboard.'
    }
  ];

  return (
    <section className="relative py-28 px-6 max-w-7xl mx-auto border-t border-[#1B2028]">
      
      <div className="space-y-4 max-w-3xl mb-16">
        <div className="flex items-center space-x-2 font-mono text-xs tracking-widest text-[#00F0FF] uppercase">
          <span className="w-4 h-[1px] bg-[#00F0FF]" />
          <span>PROJECT POSITIONING</span>
        </div>

        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#F8FAFC] leading-[1.0]">
          WHAT’S DIFFERENT<br />
          ABOUT THIS STUDY?
        </h2>

        <p className="text-sm text-[#94A3B8] leading-relaxed pt-2">
          This project does not claim a new battery-aging algorithm or an unprecedented deep neural network. Its contribution is a lightweight, reproducible data science methodology.
        </p>
      </div>

      {/* 6 Contribution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
        {contributions.map((c) => (
          <div key={c.num} className="border border-[#1B2028] bg-[#090A0D]/80 p-6 rounded-sm space-y-3 hover:border-[#2C3440] transition-colors">
            <div className="flex items-center justify-between text-[#64748B] text-[10px]">
              <span className="text-[#00F0FF] font-bold">PIPELINE PILLAR {c.num}</span>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <h3 className="text-base font-bold text-[#F8FAFC] font-sans">
              {c.title}
            </h3>
            <p className="text-xs text-[#94A3B8] font-sans leading-relaxed">
              {c.desc}
            </p>
          </div>
        ))}
      </div>

    </section>
  );
};
