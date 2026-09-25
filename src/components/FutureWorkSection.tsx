import React from 'react';
import { ArrowUpRight, Compass, GitMerge, Cpu, BarChart2, Shield } from 'lucide-react';

export const FutureWorkSection: React.FC = () => {
  const roadmapItems = [
    {
      tag: 'VALIDATION',
      title: 'Repeated GroupKFold & Uncertainty Intervals',
      desc: 'Deploy 5-fold GroupKFold with repeated random initializations to construct rigorous 95% bootstrap confidence intervals across cell populations.'
    },
    {
      tag: 'FEATURES',
      title: 'Differential Voltage (dV/dQ) & Shape Descriptors',
      desc: 'Extract electrochemical differential voltage and incremental capacity peak positions from partial randomized charging windows.'
    },
    {
      tag: 'DEEP LEARNING',
      title: 'Direct Group-Level Sequence Benchmarking',
      desc: 'Compare engineered tree ensembles against raw-sequence CNN-LSTM networks under identical unseen-cell GroupShuffleSplit partitions.'
    },
    {
      tag: 'CONFORMAL PREDICTION',
      title: 'Statistically Guaranteed Prediction Bounds',
      desc: 'Integrate distribution-free conformal prediction to output valid confidence bands around every individual battery health estimation.'
    },
    {
      tag: 'TRANSFER LEARNING',
      title: 'Cross-Chemistry Generalization',
      desc: 'Validate the 23-feature statistical pipeline across independent public datasets (Oxford Battery Degradation & CALCE Battery Data).'
    }
  ];

  return (
    <section className="relative py-28 px-6 max-w-7xl mx-auto border-t border-[#1B2028]">
      
      <div className="space-y-4 max-w-3xl mb-16">
        <div className="flex items-center space-x-2 font-mono text-xs tracking-widest text-[#00F0FF] uppercase">
          <span className="w-4 h-[1px] bg-[#00F0FF]" />
          <span>RESEARCH ROADMAP</span>
        </div>

        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#F8FAFC] leading-[1.0]">
          FUTURE<br />
          DIRECTIONS.
        </h2>

        <p className="text-sm text-[#94A3B8] leading-relaxed pt-2">
          Promising research trajectories to expand lightweight explainable battery intelligence into production onboard Battery Management Systems (BMS).
        </p>
      </div>

      {/* Engineering Roadmap Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
        {roadmapItems.map((item, idx) => (
          <div key={idx} className="border border-[#1B2028] bg-[#090A0D] p-6 rounded-sm space-y-4 hover:border-[#00F0FF]/40 transition-all duration-300">
            <div className="flex items-center justify-between text-[#64748B] text-[10px]">
              <span className="text-[#00F0FF]">{item.tag}</span>
              <span>PHASE 0{idx + 1}</span>
            </div>

            <h3 className="text-base font-bold text-[#F8FAFC] font-sans">
              {item.title}
            </h3>

            <p className="text-xs text-[#94A3B8] font-sans leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

    </section>
  );
};
