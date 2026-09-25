import React from 'react';
import { ArrowDown, ChevronRight, Activity, Zap, ShieldCheck } from 'lucide-react';
import { ExperimentResults } from '../types/research';
import { HeroCanvas } from './HeroCanvas';

interface HeroSectionProps {
  results: ExperimentResults | null;
  onCheckHealthClick: () => void;
  onExploreResearchClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  results,
  onCheckHealthClick,
  onExploreResearchClick
}) => {
  return (
    <section id="hero" className="relative min-h-[92vh] flex flex-col justify-between pt-28 pb-12 px-6 max-w-7xl mx-auto overflow-hidden">
      
      {/* Contained Canvas Background */}
      <HeroCanvas />

      {/* Top Telemetry Line */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-[#1B2028] pb-4 font-mono text-[10px] tracking-widest text-[#64748B]">
        <div className="flex items-center space-x-3">
          <span className="text-[#00F0FF] font-bold">EV INTELLIGENCE LAB</span>
          <span>•</span>
          <span className="text-[#94A3B8]">SHLOK VIJ [230705211143]</span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[#CBD5E1]">NASA SOH INFERENCE ENGINE ONLINE</span>
        </div>
      </div>

      {/* Main Hero Product Typography */}
      <div className="relative z-10 my-auto py-8">
        <div className="space-y-1 sm:space-y-2">
          
          <div className="font-mono text-xs tracking-[0.2em] text-[#00F0FF] uppercase mb-4 flex items-center space-x-2">
            <span className="w-5 h-[1px] bg-[#00F0FF]" />
            <span>State of Health Diagnostic Platform</span>
          </div>

          <h1 className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter leading-[0.88] text-[#F8FAFC] select-none">
            KNOW<br />
            YOUR<br />
            BATTERY.
          </h1>

          <div className="pt-6 max-w-2xl space-y-4">
            <p className="text-base sm:text-2xl font-light tracking-tight text-[#E2E8F0]">
              Explainable machine learning for lithium-ion battery health estimation.
            </p>
            
            <p className="text-xs font-mono text-[#64748B] uppercase tracking-wider">
              Powered by NASA Ames Randomized Battery Usage Models (Dataset #11)
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons & Telemetry Ticker */}
      <div className="relative z-10 border-t border-[#1B2028] pt-6 space-y-6">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={onCheckHealthClick}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-6 py-3 bg-[#00F0FF] text-[#050607] font-mono text-xs tracking-wider font-bold rounded-sm hover:bg-[#67E8F9] transition-all duration-300 shadow-[0_0_25px_rgba(0,240,255,0.4)]"
            >
              <span>CHECK BATTERY HEALTH</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreResearchClick}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-5 py-3 border border-[#1B2028] hover:border-[#00F0FF]/40 text-[#CBD5E1] hover:text-[#F8FAFC] font-mono text-xs tracking-wider rounded-sm bg-[#090A0D]/80 backdrop-blur transition-all"
            >
              <span>EXPLORE THE RESEARCH</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono text-[#64748B]">
            <span>CONFIGURE ESTIMATOR</span>
            <ArrowDown className="w-3.5 h-3.5 text-[#00F0FF] animate-bounce" />
          </div>
        </div>

      </div>

    </section>
  );
};
