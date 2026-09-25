import React, { useState } from 'react';
import { Zap, Activity, Thermometer, Clock, ArrowRight, Layers, HelpCircle } from 'lucide-react';

export const TheDataSection: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<string>('current');

  const featureExplanations: Record<string, { title: string; subtitle: string; desc: string; math: string; impact: string }> = {
    current: {
      title: 'CURRENT DYNAMICS',
      subtitle: 'Mean, Std, Min, Max, Range, Absolute Mean',
      desc: 'Captures the severity and variance of randomized electrical loads. Higher absolute discharge rates accelerate solid electrolyte interphase (SEI) growth and lithium plating.',
      math: 'I_{mean} = \\frac{1}{N}\\sum I_t, \\quad I_{abs} = \\frac{1}{N}\\sum |I_t|',
      impact: 'Drives internal ohmic heating and mechanical stress inside the electrode matrix.'
    },
    voltage: {
      title: 'VOLTAGE RESPONSES',
      subtitle: 'Mean, Std, Min, Max, Voltage Range',
      desc: 'Reflects terminal cell potential under randomized loading. As the battery ages, increased internal resistance causes deeper voltage sags during discharge and higher overpotential during charge.',
      math: 'V_t = OCV(SoC) - I_t \\cdot R_{int}',
      impact: 'Directly mirrors electrochemical polarization and loss of active lithium inventory.'
    },
    temperature: {
      title: 'THERMAL HISTORY',
      subtitle: 'Mean, Std, Min, Max, Temperature Range',
      desc: 'Measures surface thermal stress throughout randomized intervals. Elevated operating temperatures accelerate Arrhenius chemical degradation reactions.',
      math: 'k = A \\exp(-E_a / (R \\cdot T))',
      impact: 'Strong empirical predictor of capacity loss rate; high standard deviations indicate uneven thermal stress.'
    },
    duration: {
      title: 'INTERVAL DURATION',
      subtitle: 'Total Elapsed Random-Walk Time (Seconds)',
      desc: 'Tracks the cumulative time elapsed between consecutive reference cycles during which the battery endured continuous randomized cycling.',
      math: '\\Delta t_{rw} = \\sum_{s \\in \\text{steps}} (t_{max} - t_{min})_s',
      impact: 'Quantifies temporal calendar and dynamic aging exposure before health is re-benchmarked.'
    },
    throughput: {
      title: 'AH THROUGHPUT',
      subtitle: 'Charge Throughput (Ah) & Discharge Throughput (Ah)',
      desc: 'Calculated via trapezoidal integration of current over time. Quantifies the total charge quantity pumped into and drawn from the electrochemical cell.',
      math: 'Q_{throughput} = \\int |I(t)| dt / 3600',
      impact: 'Standard physical metric for cumulative cycle aging, tracking active material wear.'
    }
  };

  const currentInfo = featureExplanations[activeFeature];

  return (
    <section id="data" className="relative py-28 px-6 max-w-7xl mx-auto border-t border-[#1B2028]">
      
      {/* Section Header */}
      <div className="space-y-4 max-w-3xl mb-16">
        <div className="flex items-center space-x-2 font-mono text-xs tracking-widest text-[#00F0FF] uppercase">
          <span className="w-4 h-[1px] bg-[#00F0FF]" />
          <span>02 / DATASET ARCHITECTURE</span>
        </div>

        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#F8FAFC] leading-[1.0]">
          THE BATTERY DOESN’T<br />
          AGE IN A STRAIGHT LINE.
        </h2>

        <p className="text-sm text-[#94A3B8] leading-relaxed pt-2">
          Randomized current profiles introduce non-linear electrochemical stress. To convert raw second-by-second MATLAB structures into supervised training samples, each randomized interval is summarized into physical operating-history features.
        </p>
      </div>

      {/* Interactive Engineering Schematic Flow */}
      <div className="border border-[#1B2028] bg-[#090A0D]/90 rounded-sm p-6 sm:p-10 relative overflow-hidden">
        
        {/* Subtle background circuit traces */}
        <div className="absolute inset-0 bg-tech-grid opacity-30 pointer-events-none" />

        {/* Schematic Flow Steps */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
          
          {/* Step 1: Raw Operating Interval */}
          <div className="border border-[#1B2028] bg-[#0D0F13] p-5 rounded-sm space-y-3">
            <div className="flex items-center justify-between font-mono text-[10px] text-[#64748B]">
              <span>STAGE 01</span>
              <span className="text-[#00F0FF]">RANDOM WALK</span>
            </div>
            <div className="font-semibold text-sm text-[#F8FAFC]">
              Randomized Operating Interval
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Uncontrolled dynamic current profiles (-4.5A to +4.5A) simulating chaotic real-world usage.
            </p>
            <div className="font-mono text-[10px] text-[#00F0FF] bg-[#050607] p-2 rounded border border-[#1B2028]">
              ~10 to 50 random steps per cycle
            </div>
          </div>

          {/* Step 2: Feature Matrix (Interactive Selector) */}
          <div className="border border-[#00F0FF]/30 bg-[#0D0F13] p-5 rounded-sm space-y-3 relative">
            <div className="flex items-center justify-between font-mono text-[10px] text-[#64748B]">
              <span>STAGE 02</span>
              <span className="text-[#00F0FF]">5 FEATURE AXES</span>
            </div>
            <div className="font-semibold text-sm text-[#F8FAFC]">
              Statistical Summarization
            </div>
            
            <div className="space-y-1.5 pt-1">
              {[
                { id: 'current', label: 'CURRENT', icon: Zap },
                { id: 'voltage', label: 'VOLTAGE', icon: Activity },
                { id: 'temperature', label: 'TEMPERATURE', icon: Thermometer },
                { id: 'duration', label: 'DURATION', icon: Clock },
                { id: 'throughput', label: 'THROUGHPUT', icon: Layers }
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = activeFeature === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveFeature(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-mono rounded-sm transition-all text-left ${
                      isSelected
                        ? 'bg-[#00F0FF] text-[#050607] font-semibold shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                        : 'bg-[#090A0D] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#1B2028] hover:border-[#2C3440]'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </div>
                    <span className="text-[10px] opacity-70">SELECT</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Reference Discharge Benchmark */}
          <div className="border border-[#1B2028] bg-[#0D0F13] p-5 rounded-sm space-y-3">
            <div className="flex items-center justify-between font-mono text-[10px] text-[#64748B]">
              <span>STAGE 03</span>
              <span className="text-[#00F0FF]">BENCHMARK</span>
            </div>
            <div className="font-semibold text-sm text-[#F8FAFC]">
              Reference Discharge
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Standardized constant-current discharge step to evaluate true available capacity Q<sub>ref</sub>.
            </p>
            <div className="font-mono text-[10px] text-emerald-400 bg-[#050607] p-2 rounded border border-[#1B2028]">
              Target: Next Reference Cycle Ah
            </div>
          </div>

          {/* Step 4: State of Health Target */}
          <div className="border border-[#1B2028] bg-[#0D0F13] p-5 rounded-sm space-y-3">
            <div className="flex items-center justify-between font-mono text-[10px] text-[#64748B]">
              <span>STAGE 04</span>
              <span className="text-[#00F0FF]">SUPERVISED LABEL</span>
            </div>
            <div className="font-semibold text-sm text-[#F8FAFC]">
              State of Health (%)
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Calculated as 100 × (Q<sub>ref</sub> / Q<sub>initial</sub>). 100% represents fresh cell capacity.
            </p>
            <div className="font-mono text-[10px] text-[#00F0FF] bg-[#050607] p-2 rounded border border-[#1B2028]">
              Ground-Truth Supervision Target
            </div>
          </div>

        </div>

        {/* Detailed Feature Explainer Box */}
        <div className="mt-8 pt-8 border-t border-[#1B2028] relative z-10">
          <div className="bg-[#050607] border border-[#1B2028] p-6 rounded-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1B2028] pb-4">
              <div>
                <span className="font-mono text-[10px] tracking-widest text-[#00F0FF] uppercase">
                  ACTIVE FEATURE AXIS EXPLANATION
                </span>
                <h3 className="text-lg font-bold text-[#F8FAFC] tracking-tight">
                  {currentInfo.title}
                </h3>
                <p className="text-xs font-mono text-[#64748B]">
                  {currentInfo.subtitle}
                </p>
              </div>

              <div className="font-mono text-xs bg-[#0D0F13] px-4 py-2 border border-[#1B2028] rounded text-[#00F0FF]">
                {currentInfo.math}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 text-xs">
              <div>
                <span className="font-mono text-[10px] uppercase text-[#94A3B8]">Physical Mechanism:</span>
                <p className="text-[#CBD5E1] mt-1 leading-relaxed">{currentInfo.desc}</p>
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase text-[#94A3B8]">Electrochemical Impact:</span>
                <p className="text-[#94A3B8] mt-1 leading-relaxed">{currentInfo.impact}</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
};
