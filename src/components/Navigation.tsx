import React, { useState, useEffect } from 'react';
import { Play, FileText, Database, Menu, X, Activity } from 'lucide-react';
import { ExperimentResults } from '../types/research';

interface NavigationProps {
  results: ExperimentResults | null;
  onOpenExperimentModal: () => void;
  onOpenReportModal: () => void;
  onOpenMethodologyModal: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  results,
  onOpenExperimentModal,
  onOpenReportModal,
  onOpenMethodologyModal
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = ['hero', 'estimator', 'how-it-works', 'results', 'findings'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#050607]/95 backdrop-blur-md border-b border-[#1B2028] py-3 shadow-2xl' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => scrollTo('hero')} 
            className="flex items-center space-x-2.5 text-left group"
          >
            <div className="w-2.5 h-2.5 bg-[#00F0FF] rounded-none group-hover:scale-125 transition-transform duration-300" />
            <div>
              <div className="font-mono text-[11px] tracking-widest text-[#F8FAFC] font-bold uppercase">
                SOH INTELLIGENCE
              </div>
              <div className="font-mono text-[9px] tracking-wider text-[#64748B]">
                EV BATTERY HEALTH LAB
              </div>
            </div>
          </button>

          {results && (
            <div className="hidden lg:flex items-center space-x-2 border-l border-[#1B2028] pl-4">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-[#0D0F13] text-[#00F0FF] border border-[#00F0FF]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse mr-1.5" />
                NASA MODELS LOADED
              </span>
            </div>
          )}
        </div>

        {/* Minimal Navigation */}
        <div className="hidden md:flex items-center space-x-7 font-mono text-[11px] tracking-widest text-[#94A3B8]">
          <button 
            onClick={() => scrollTo('estimator')}
            className={`hover:text-[#F8FAFC] transition-colors ${activeSection === 'estimator' ? 'text-[#00F0FF] font-bold' : ''}`}
          >
            01 / HEALTH ESTIMATOR
          </button>
          <button 
            onClick={() => scrollTo('how-it-works')}
            className={`hover:text-[#F8FAFC] transition-colors ${activeSection === 'how-it-works' ? 'text-[#00F0FF] font-bold' : ''}`}
          >
            02 / HOW IT WORKS
          </button>
          <button 
            onClick={() => scrollTo('results')}
            className={`hover:text-[#F8FAFC] transition-colors ${activeSection === 'results' ? 'text-[#00F0FF] font-bold' : ''}`}
          >
            03 / RESEARCH RESULTS
          </button>
          <button 
            onClick={() => scrollTo('findings')}
            className={`hover:text-[#F8FAFC] transition-colors ${activeSection === 'findings' ? 'text-[#00F0FF] font-bold' : ''}`}
          >
            04 / FINDINGS
          </button>
        </div>

        {/* Actions */}
        <div className="hidden sm:flex items-center space-x-3">
          <button
            onClick={onOpenMethodologyModal}
            className="flex items-center space-x-1.5 text-[11px] font-mono text-[#CBD5E1] hover:text-[#00F0FF] px-3 py-1.5 rounded-sm border border-[#1B2028] hover:border-[#00F0FF]/30 bg-[#090A0D] transition-all"
          >
            <Database className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>METHODOLOGY</span>
          </button>

          <button
            onClick={onOpenReportModal}
            className="flex items-center space-x-1.5 text-[11px] font-mono text-[#CBD5E1] hover:text-[#00F0FF] px-3 py-1.5 rounded-sm border border-[#1B2028] hover:border-[#00F0FF]/30 bg-[#090A0D] transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>REPORT</span>
          </button>

          <button
            onClick={onOpenExperimentModal}
            className="flex items-center space-x-1.5 text-[11px] font-mono font-bold text-[#050607] bg-[#00F0FF] hover:bg-[#67E8F9] px-3.5 py-1.5 rounded-sm transition-all shadow-[0_0_15px_rgba(0,240,255,0.25)] hover:shadow-[0_0_20px_rgba(0,240,255,0.45)]"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>RUN PIPELINE</span>
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center space-x-2">
          <button
            onClick={() => scrollTo('estimator')}
            className="text-[10px] font-mono text-[#050607] bg-[#00F0FF] px-2.5 py-1 rounded-sm font-bold"
          >
            ESTIMATE
          </button>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-[#94A3B8] hover:text-[#F8FAFC]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#090A0D]/95 backdrop-blur-lg border-b border-[#1B2028] px-6 py-4 space-y-2.5 font-mono text-xs tracking-wider">
          <button onClick={() => scrollTo('estimator')} className="block w-full text-left py-1 text-[#00F0FF]">01 / HEALTH ESTIMATOR</button>
          <button onClick={() => scrollTo('how-it-works')} className="block w-full text-left py-1 text-[#CBD5E1]">02 / HOW IT WORKS</button>
          <button onClick={() => scrollTo('results')} className="block w-full text-left py-1 text-[#CBD5E1]">03 / RESEARCH RESULTS</button>
          <button onClick={() => scrollTo('findings')} className="block w-full text-left py-1 text-[#CBD5E1]">04 / FINDINGS</button>
          <div className="pt-2 border-t border-[#1B2028] flex space-x-2">
            <button onClick={onOpenMethodologyModal} className="flex-1 text-center py-1.5 text-[10px] border border-[#1B2028] text-[#CBD5E1]">METHODOLOGY</button>
            <button onClick={onOpenReportModal} className="flex-1 text-center py-1.5 text-[10px] border border-[#1B2028] text-[#CBD5E1]">REPORT</button>
          </div>
        </div>
      )}
    </nav>
  );
};
