import React from 'react';
import { AlertTriangle, ShieldCheck, Scale, Ban } from 'lucide-react';

export const LimitationsSection: React.FC = () => {
  const limitations = [
    {
      title: 'Periodic Rather Than Continuous Ground Truth',
      desc: 'Ground-truth State of Health labels originate from periodic reference discharge capacity tests rather than continuous electrochemical operando tracking.'
    },
    {
      title: 'Aggregated Temporal Dynamics',
      desc: 'Statistical feature summarization intentionally compresses dynamic high-frequency time series, discarding fine-grained sub-second voltage relaxation waveforms.'
    },
    {
      title: 'Single Group-Holdout Realization',
      desc: 'The unseen-battery generalization experiment uses a single GroupShuffleSplit realization; repeated k-fold group splits would offer tighter confidence intervals.'
    },
    {
      title: 'No Algorithmic SOTA Claims',
      desc: 'This study does not claim a new state-of-the-art battery model. Established literature already explores complex Bayesian CNN-LSTM architectures on this dataset.'
    },
    {
      title: 'Dataset and Protocol Specificity',
      desc: 'Results are specific to the NASA 18650 Li-ion cell chemistry, ambient temperature profile, and random-walk current limits (-4.5A to +4.5A).'
    }
  ];

  return (
    <section id="limitations" className="relative py-28 px-6 max-w-7xl mx-auto border-t border-[#1B2028]">
      
      <div className="space-y-4 max-w-3xl mb-16">
        <div className="flex items-center space-x-2 font-mono text-xs tracking-widest text-[#64748B] uppercase">
          <span className="w-4 h-[1px] bg-[#64748B]" />
          <span>ACADEMIC RIGOR & INTEGRITY</span>
        </div>

        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#CBD5E1] leading-[1.0]">
          WHAT THIS STUDY<br />
          DOESN’T CLAIM.
        </h2>

        <p className="text-sm text-[#64748B] leading-relaxed pt-2">
          Transparent boundary conditions are the hallmark of credible data science research. We explicitly declare the operational boundaries of this investigation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
        {limitations.map((lim, idx) => (
          <div key={idx} className="border border-[#14181F] bg-[#050607] p-6 rounded-sm space-y-3">
            <div className="flex items-center space-x-2 text-[#64748B] text-[10px]">
              <span className="text-amber-400/80 font-bold">CONSTRAINT 0{idx + 1}</span>
            </div>
            <h3 className="text-sm font-bold text-[#CBD5E1] font-sans">
              {lim.title}
            </h3>
            <p className="text-xs text-[#64748B] font-sans leading-relaxed">
              {lim.desc}
            </p>
          </div>
        ))}
      </div>

    </section>
  );
};
