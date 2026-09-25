import React from 'react';
import { HelpCircle, CheckCircle2, Shield, AlertTriangle } from 'lucide-react';

export const TheQuestionSection: React.FC = () => {
  return (
    <section id="question" className="relative py-28 px-6 max-w-7xl mx-auto border-t border-[#1B2028]">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left Column: Editorial Heading */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center space-x-2 font-mono text-xs tracking-widest text-[#00F0FF] uppercase">
            <span className="w-4 h-[1px] bg-[#00F0FF]" />
            <span>01 / RESEARCH SCOPE</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#F8FAFC] leading-[1.05]">
            THE<br />
            QUESTION.
          </h2>

          <div className="space-y-4 text-xs font-mono text-[#64748B] pt-4">
            <div className="border-l-2 border-[#1B2028] pl-3 py-1">
              <div className="text-[#94A3B8]">DATASET SCOPE</div>
              <div>NASA Ames PCoE Dataset #11</div>
            </div>
            <div className="border-l-2 border-[#1B2028] pl-3 py-1">
              <div className="text-[#94A3B8]">CELL CHEMISTRY</div>
              <div>18650 Li-ion Cells (LiNiMnCoO2 / Graphite)</div>
            </div>
            <div className="border-l-2 border-[#1B2028] pl-3 py-1">
              <div className="text-[#94A3B8]">OPERATING REGIME</div>
              <div>Random Walk Current Loading (-4.5A to +4.5A)</div>
            </div>
          </div>
        </div>

        {/* Right Column: Editorial Question Statement & Context */}
        <div className="lg:col-span-8 space-y-10">
          
          <div className="border-l-2 border-[#00F0FF] pl-6 sm:pl-8 py-2">
            <p className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-[#F8FAFC] leading-snug">
              “Can measurable characteristics extracted from randomized battery-use history estimate Li-ion battery State of Health (SoH), and can explainable ML identify which operating characteristics contribute most to the estimate?”
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-[#94A3B8] leading-relaxed">
            <div className="space-y-3">
              <h3 className="font-mono text-xs uppercase tracking-wider text-[#F8FAFC] flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-[#00F0FF] rounded-none" />
                <span>Operating Reality</span>
              </h3>
              <p>
                In real-world electric vehicles and renewable grid storage, batteries never experience clean, laboratory-constant discharge cycles. Instead, drivers accelerate, brake regeneratively, idle, and fast-charge in unpredictable, randomized patterns.
              </p>
              <p>
                The NASA dataset mimics this with continuous random-walk current profiles interspersed with periodic standard reference cycles to benchmark true capacity.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-mono text-xs uppercase tracking-wider text-[#F8FAFC] flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-[#00F0FF] rounded-none" />
                <span>The Research Task</span>
              </h3>
              <p>
                Rather than deploying an opaque deep sequence model that requires full second-by-second telemetry, this study tests whether compact statistical descriptors of recent randomized usage can accurately predict subsequent reference health benchmarks.
              </p>
              <p>
                Crucially, we test whether this signal generalizes across distinct batteries and verify what the model actually learned using explainable AI.
              </p>
            </div>
          </div>

          {/* Research Hypothesis & Contribution Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 font-mono text-xs">
            
            <div className="p-5 border border-[#1B2028] bg-[#090A0D]/70 rounded-sm space-y-2">
              <div className="text-[#00F0FF] font-semibold tracking-wider flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>HYPOTHESIS (H1)</span>
              </div>
              <p className="text-[#CBD5E1] text-[11px] leading-relaxed">
                Features derived from randomized operating history contain predictive information about battery SoH, and an ML regression model can estimate SoH better than a simple mean-SoH baseline.
              </p>
            </div>

            <div className="p-5 border border-[#1B2028] bg-[#090A0D]/70 rounded-sm space-y-2">
              <div className="text-[#94A3B8] font-semibold tracking-wider flex items-center space-x-2">
                <Shield className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span>STUDY CONTRIBUTION</span>
              </div>
              <p className="text-[#94A3B8] text-[11px] leading-relaxed">
                A lightweight, reproducible pipeline converting randomized intervals into interpretable operating-history features, evaluating 6 models, testing unseen battery transfer, and combining predictions with model-agnostic explainability.
              </p>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
};
