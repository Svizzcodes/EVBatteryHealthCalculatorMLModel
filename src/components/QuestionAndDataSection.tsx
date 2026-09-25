import React, { useState } from 'react';
import { Zap, Activity, Thermometer, Clock, Layers, CheckCircle2, Shield, ArrowRight } from 'lucide-react';

export const QuestionAndDataSection: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<string>('current');

  const featureExplanations: Record<string, { title: string; subtitle: string; desc: string; math: string; impact: string }> = {
    current: {
      title: 'CURRENT DYNAMICS',
      subtitle: 'Mean, Std, Min, Max, Range, Absolute Mean',
      desc: 'Captures the severity and variance of randomized electrical loads. Dynamic high current pulses accelerate solid electrolyte interphase (SEI) growth and lithium plating.',
      math: 'I_{mean} = \\frac{1}{N}\\sum I_t, \\quad I_{abs} = \\frac{1}{N}\\sum |I_t|',
      impact: 'Drives internal ohmic heating and mechanical stress inside the electrode matrix.'
    },
    voltage: {
      title: 'VOLTAGE RESPONSES',
      subtitle: 'Mean, Std, Min, Max, Voltage Range',
      desc: 'Reflects terminal cell potential under randomized loading. As the battery ages, increased internal resistance causes deeper voltage sags during discharge and higher overpotentials during charge.',
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
    <section id="data-question" className="relative py-20 px-6 max-w-7xl mx-auto border-t border-[#1B2028]">
      
      {/* 2-Column Top Editorial: The Question & Context */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
        
        {/* Left: Heading & Hypothesis */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center space-x-2 font-mono text-xs tracking-widest text-[#00F0FF] uppercase">
            <span className="w-4 h-[1px] bg-[#00F0FF]" />
            <span>01 / THE RESEARCH QUESTION</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F8FAFC] leading-[1.05]">
            CAN RANDOMIZED USE<br />
            REVEAL BATTERY HEALTH?
          </h2>

          <div className="p-4 border border-[#1B2028] bg-[#090A0D] rounded-sm space-y-2 font-mono text-xs">
            <div className="text-[#00F0FF] font-semibold tracking-wider flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>HYPOTHESIS (H1)</span>
            </div>
            <p className="text-[#CBD5E1] text-[11px] leading-relaxed">
              Features derived from randomized operating history contain predictive information about battery SoH, and an ML regression model can estimate SoH better than a simple mean-SoH baseline.
            </p>
          </div>
        </div>

        {/* Right: Editorial Question Statement & Context */}
        <div className="lg:col-span-7 space-y-6">
          <div className="border-l-2 border-[#00F0FF] pl-6 py-1">
            <p className="text-xl sm:text-2xl font-light tracking-tight text-[#F8FAFC] leading-snug">
              “Can measurable characteristics extracted from randomized battery-use history estimate Li-ion battery State of Health (SoH), and can explainable ML identify which operating characteristics contribute most to the estimate?”
            </p>
          </div>

          <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
            In electric vehicles and renewable energy storage, batteries experience stochastic, unpredictable power demands. The NASA Ames Randomized Battery Usage dataset subjects 18650 cells to continuous random-walk current profiles with periodic standard reference cycles to benchmark true capacity.
          </p>
        </div>

      </div>

      {/* Interactive 5-Axis Physical Data Schematic */}
      <div className="border border-[#1B2028] bg-[#090A0D] rounded-sm p-6 sm:p-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1B2028] pb-4">
          <div>
            <span className="font-mono text-[10px] text-[#00F0FF] tracking-widest uppercase">
              THE BATTERY DOESN’T AGE IN A STRAIGHT LINE
            </span>
            <h3 className="text-lg font-bold text-[#F8FAFC]">
              Physical Operating History → State of Health Pipeline
            </h3>
          </div>
          <div className="font-mono text-xs text-[#64748B]">
            Click any feature axis below to inspect
          </div>
        </div>

        {/* 4 Schematic Flow Stages */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          
          {/* Stage 1 */}
          <div className="border border-[#1B2028] bg-[#050607] p-4 rounded-sm space-y-2">
            <div className="font-mono text-[10px] text-[#64748B] flex justify-between">
              <span>01 / RANDOM USE</span>
              <span className="text-[#00F0FF]">INPUT</span>
            </div>
            <div className="font-bold text-xs text-[#F8FAFC]">
              Dynamic Load History
            </div>
            <p className="text-[11px] text-[#94A3B8] leading-relaxed">
              Random walk current (-4.5A to +4.5A) between reference discharges.
            </p>
          </div>

          {/* Stage 2 (Selector) */}
          <div className="border border-[#00F0FF]/30 bg-[#050607] p-4 rounded-sm space-y-2">
            <div className="font-mono text-[10px] text-[#00F0FF] flex justify-between">
              <span>02 / 5 FEATURE AXES</span>
              <span className="text-[#00F0FF]">SELECT</span>
            </div>
            
            <div className="grid grid-cols-1 gap-1 pt-1">
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
                    className={`flex items-center justify-between px-2.5 py-1.5 text-xs font-mono rounded-sm transition-all text-left ${
                      isSelected
                        ? 'bg-[#00F0FF] text-[#050607] font-bold'
                        : 'bg-[#0D0F13] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#1B2028]'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="w-3 h-3" />
                      <span>{item.label}</span>
                    </div>
                    <span className="text-[9px] opacity-70">SELECT</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stage 3 */}
          <div className="border border-[#1B2028] bg-[#050607] p-4 rounded-sm space-y-2">
            <div className="font-mono text-[10px] text-[#64748B] flex justify-between">
              <span>03 / BENCHMARK</span>
              <span className="text-emerald-400">GROUND TRUTH</span>
            </div>
            <div className="font-bold text-xs text-[#F8FAFC]">
              Reference Discharge
            </div>
            <p className="text-[11px] text-[#94A3B8] leading-relaxed">
              Standard constant-current discharge test measuring available capacity Q<sub>ref</sub> (Ah).
            </p>
          </div>

          {/* Stage 4 */}
          <div className="border border-[#1B2028] bg-[#050607] p-4 rounded-sm space-y-2">
            <div className="font-mono text-[10px] text-[#64748B] flex justify-between">
              <span>04 / TARGET</span>
              <span className="text-[#00F0FF]">SoH (%)</span>
            </div>
            <div className="font-bold text-xs text-[#F8FAFC]">
              State of Health (%)
            </div>
            <p className="text-[11px] text-[#94A3B8] leading-relaxed font-mono">
              SoH = 100 × (Q<sub>ref</sub> / Q<sub>initial</sub>)
            </p>
            <div className="text-[10px] font-mono text-emerald-400 pt-1">
              Zero Future Leakage Rule
            </div>
          </div>

        </div>

        {/* Selected Feature Inspector Panel */}
        <div className="p-4 bg-[#050607] border border-[#1B2028] rounded-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1B2028] pb-2">
            <div>
              <span className="text-sm font-bold text-[#00F0FF]">
                {currentInfo.title}
              </span>
              <span className="text-xs font-mono text-[#64748B] ml-2">
                ({currentInfo.subtitle})
              </span>
            </div>
            <div className="font-mono text-xs text-[#00F0FF] bg-[#0D0F13] px-3 py-1 border border-[#1B2028] rounded">
              {currentInfo.math}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-mono text-[10px] text-[#64748B] uppercase">Physical Mechanism:</span>
              <p className="text-[#CBD5E1] mt-0.5 leading-relaxed">{currentInfo.desc}</p>
            </div>
            <div>
              <span className="font-mono text-[10px] text-[#64748B] uppercase">Electrochemical Degradation Impact:</span>
              <p className="text-[#94A3B8] mt-0.5 leading-relaxed">{currentInfo.impact}</p>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
};
