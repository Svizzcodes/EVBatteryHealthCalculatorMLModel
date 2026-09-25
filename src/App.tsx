import React, { useState, useEffect } from 'react';
import { ExperimentResults } from './types/research';
import { OpeningSequence } from './components/OpeningSequence';
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { BatteryHealthEstimator } from './components/BatteryHealthEstimator';
import { CompactHowItWorks } from './components/CompactHowItWorks';
import { ResultsSuiteSection } from './components/ResultsSuiteSection';
import { FindingsAndPositioningSection } from './components/FindingsAndPositioningSection';
import { MethodologyDrawer } from './components/MethodologyDrawer';
import { LiveExperimentModal } from './components/LiveExperimentModal';
import { UniversityReportModal } from './components/UniversityReportModal';

export const App: React.FC = () => {
  const [showOpening, setShowOpening] = useState<boolean>(true);
  const [results, setResults] = useState<ExperimentResults | null>(null);
  const [loadingResults, setLoadingResults] = useState<boolean>(true);
  const [isExperimentModalOpen, setIsExperimentModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isMethodologyDrawerOpen, setIsMethodologyDrawerOpen] = useState<boolean>(false);

  const loadResults = async () => {
    try {
      setLoadingResults(true);
      const res = await fetch('/data/results.json');
      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}`);
      }
      const data: ExperimentResults = await res.json();
      setResults(data);
    } catch (err) {
      console.warn('Could not load /data/results.json yet:', err);
    } finally {
      setLoadingResults(false);
    }
  };

  useEffect(() => {
    loadResults();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-[#050607] text-[#CBD5E1] overflow-x-hidden selection:bg-[#00F0FF]/20 selection:text-[#00F0FF]">
      
      {/* 01. Single-Phase Seamless Boot Animation */}
      {showOpening && (
        <OpeningSequence onComplete={() => setShowOpening(false)} />
      )}

      {/* Top Telemetry Header */}
      <Navigation
        results={results}
        onOpenExperimentModal={() => setIsExperimentModalOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenMethodologyModal={() => setIsMethodologyDrawerOpen(true)}
      />

      {/* Main Product Application Flow */}
      <main className="relative z-10 space-y-6">
        
        {/* 01. Hero Section (Contains interactive canvas within hero only) */}
        <HeroSection
          results={results}
          onCheckHealthClick={() => scrollToSection('estimator')}
          onExploreResearchClick={() => scrollToSection('how-it-works')}
        />

        {/* 02. The Main Product: Battery Health Check Configurator & Inference */}
        <BatteryHealthEstimator />

        {/* 03. How It Works (Compact 4-Pillar Pipeline) */}
        <CompactHowItWorks
          onOpenReport={() => setIsReportModalOpen(true)}
        />

        {/* 04. Compact Research & Model Performance Suite */}
        <ResultsSuiteSection results={results} />

        {/* 05. Research Findings, Novelty, Limitations & Academic Position */}
        <FindingsAndPositioningSection results={results} />

      </main>

      {/* Modals and Technical Drawers */}
      <MethodologyDrawer
        isOpen={isMethodologyDrawerOpen}
        onClose={() => setIsMethodologyDrawerOpen(false)}
        outliers={results?.outliers || []}
        featureScreening={results?.feature_screening || []}
      />

      <LiveExperimentModal
        isOpen={isExperimentModalOpen}
        onClose={() => setIsExperimentModalOpen(false)}
        onReloadData={loadResults}
        currentResults={results}
      />

      <UniversityReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        results={results}
      />

    </div>
  );
};
