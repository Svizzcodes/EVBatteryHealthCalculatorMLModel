import React from 'react';
import { ShieldAlert, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';

export const SohFormulaSection: React.FC = () => {
  return (
    <section className="relative py-28 px-6 max-w-7xl mx-auto border-t border-[#1B2028]">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left: Scientific Equation & Flow */}
        <div className="lg:col-span-7 space-y-8">
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2 font-mono text-xs tracking-widest text-[#00F0FF] uppercase">
              <span className="w-4 h-[1px] bg-[#00F0FF]" />
              <span>MATHEMATICAL TARGET FORMULATION</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F8FAFC]">
              STATE OF HEALTH<br />
              CALCULATION.
            </h2>
          </div>

          {/* Animated Equation Display */}
          <div className="border border-[#1B2028] bg-[#090A0D] p-8 rounded-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00F0FF]/5 rounded-full blur-2xl pointer-events-none" />

            <div className="font-mono text-center space-y-4 py-4">
              <div className="text-3xl sm:text-5xl font-light tracking-tight text-[#F8FAFC] flex items-center justify-center space-x-3">
                <span className="text-[#00F0FF] font-medium">SoH</span>
                <span className="text-[#64748B]">=</span>
                <span className="text-[#CBD5E1]">100</span>
                <span className="text-[#64748B]">×</span>
                <div className="inline-flex flex-col items-center">
                  <span className="border-b border-[#00F0FF] pb-1 px-3 text-[#F8FAFC]">
                    Q<sub>ref, k</sub>
                  </span>
                  <span className="pt-1 px-3 text-[#94A3B8] text-xl sm:text-2xl">
                    Q<sub>initial</sub>
                  </span>
                </div>
              </div>

              <div className="text-xs text-[#64748B] tracking-wider pt-2">
                WHERE Q<sub>ref, k</sub> IS THE MEASURED CAPACITY (Ah) AT REFERENCE CYCLE k
              </div>
            </div>

            {/* Visual Signal Flow */}
            <div className="mt-6 pt-6 border-t border-[#1B2028] grid grid-cols-3 gap-2 text-center font-mono text-xs">
              <div className="p-3 bg-[#050607] border border-[#1B2028] rounded">
                <div className="text-[10px] text-[#64748B]">INPUT INTERVAL</div>
                <div className="text-[#CBD5E1] font-semibold mt-1">RANDOM USE</div>
              </div>
              <div className="p-3 bg-[#050607] border border-[#00F0FF]/30 rounded">
                <div className="text-[10px] text-[#00F0FF]">BENCHMARK</div>
                <div className="text-[#00F0FF] font-semibold mt-1">Q<sub>ref</sub> SIGNAL</div>
              </div>
              <div className="p-3 bg-[#050607] border border-[#1B2028] rounded">
                <div className="text-[10px] text-emerald-400">TARGET VALUE</div>
                <div className="text-emerald-400 font-semibold mt-1">SoH %</div>
              </div>
            </div>

          </div>

        </div>

        {/* Right: Methodological Integrity & Leakage Prevention Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border border-[#1B2028] bg-[#0D0F13] p-6 sm:p-8 rounded-sm space-y-5">
            
            <div className="flex items-center space-x-2.5 font-mono text-xs text-[#00F0FF] tracking-wider">
              <Lock className="w-4 h-4" />
              <span className="font-semibold uppercase">Zero Future Leakage Rule</span>
            </div>

            <h3 className="text-xl font-bold text-[#F8FAFC] tracking-tight">
              Strict Temporal Causality
            </h3>

            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              A common pitfall in battery degradation modeling is leaking future reference measurements or using cumulative future cycle counts.
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-start space-x-2.5 text-[#CBD5E1]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Features only summarize the randomized usage preceding the reference benchmark.</span>
              </div>
              <div className="flex items-start space-x-2.5 text-[#CBD5E1]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Future degradation trajectory points are strictly unseen at inference time.</span>
              </div>
              <div className="flex items-start space-x-2.5 text-[#CBD5E1]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Initial reference capacity (Q<sub>initial</sub>) is fixed to the cell's cycle 1 benchmark.</span>
              </div>
            </div>

            <div className="p-4 bg-[#050607] border border-amber-500/20 text-amber-300 text-[11px] font-mono rounded">
              ⚠️ Methodological Guarantee: The regression model predicts health using only observable physical operational history.
            </div>

          </div>
        </div>

      </div>

    </section>
  );
};
