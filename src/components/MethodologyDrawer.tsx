import React from 'react';
import { X, Database, Sliders, AlertTriangle, ShieldCheck, Binary } from 'lucide-react';
import { OutlierMetric, FeatureScreeningMetric } from '../types/research';

interface MethodologyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  outliers: OutlierMetric[];
  featureScreening: FeatureScreeningMetric[];
}

export const MethodologyDrawer: React.FC<MethodologyDrawerProps> = ({
  isOpen,
  onClose,
  outliers,
  featureScreening
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#050607]/80 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-3xl bg-[#090A0D] border-l border-[#1B2028] h-full overflow-y-auto p-6 sm:p-10 space-y-8 text-xs font-mono text-[#CBD5E1]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1B2028] pb-4">
          <div>
            <span className="text-[#00F0FF] text-[10px] tracking-widest uppercase">
              TECHNICAL SPECIFICATION
            </span>
            <h2 className="text-2xl font-bold text-[#F8FAFC] font-sans tracking-tight">
              Research Methodology
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 border border-[#1B2028] hover:border-[#00F0FF]/40 text-[#94A3B8] hover:text-[#F8FAFC] rounded-sm transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Dataset Provenance */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-[#00F0FF] flex items-center space-x-2">
            <Database className="w-4 h-4" />
            <span>01 / DATASET PROVENANCE & HARVESTING</span>
          </h3>
          <p className="text-[#94A3B8] font-sans leading-relaxed">
            Data obtained from the NASA Ames Prognostics Center of Excellence (PCoE) Randomized Battery Usage Data Set (#11). Contains 28 MATLAB files (.mat) of commercially available 18650 Li-ion cells subjected to randomized walk discharge and charge profiles with periodic reference capacity benchmarking.
          </p>
        </div>

        {/* 2. Preprocessing & Data Cleaning */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-[#00F0FF] flex items-center space-x-2">
            <Sliders className="w-4 h-4" />
            <span>02 / PREPROCESSING & QUALITY CONTROL</span>
          </h3>
          <ul className="space-y-1.5 text-[#94A3B8] font-sans">
            <li>• <strong className="text-[#F8FAFC]">Missing Values:</strong> Verified zero missing values in physical target measurements. Remaining operational missingness handled via median imputation fit strictly on the training partition.</li>
            <li>• <strong className="text-[#F8FAFC]">Duplicates & Infinities:</strong> Exact duplicate operational rows purged; invalid non-finite floating point records removed.</li>
            <li>• <strong className="text-[#F8FAFC]">Scaling:</strong> Standardized with <code>RobustScaler</code> (scaling by median and interquartile range) to preserve genuine dynamic pulse peaks without skewing gradient steps.</li>
          </ul>
        </div>

        {/* 3. IQR Outlier Screening Report */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-amber-400 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4" />
            <span>03 / IQR OUTLIER DETECTION (1.5 × IQR)</span>
          </h3>
          <p className="text-[#94A3B8] font-sans leading-relaxed text-[11px]">
            Outliers were identified via Tukey's IQR rule ($Q_1 - 1.5 \cdot IQR, Q_3 + 1.5 \cdot IQR$). They were retained in training because extreme current/temperature excursions represent genuine random-walk conditions.
          </p>

          <div className="overflow-x-auto border border-[#1B2028] bg-[#050607] rounded-sm max-h-56">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-[#0D0F13] text-[#64748B] border-b border-[#1B2028]">
                <tr>
                  <th className="p-2.5">Feature</th>
                  <th className="p-2.5">Outlier Count</th>
                  <th className="p-2.5">Lower Bound</th>
                  <th className="p-2.5">Upper Bound</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B2028]">
                {outliers.slice(0, 8).map((o) => (
                  <tr key={o.feature} className="hover:bg-[#090A0D]">
                    <td className="p-2.5 text-[#CBD5E1]">{o.feature}</td>
                    <td className="p-2.5 text-amber-400 font-bold">{o.outlier_count}</td>
                    <td className="p-2.5 text-[#64748B]">{o.lower_bound.toFixed(2)}</td>
                    <td className="p-2.5 text-[#64748B]">{o.upper_bound.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Feature Screening Scores */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-[#00F0FF] flex items-center space-x-2">
            <Binary className="w-4 h-4" />
            <span>04 / UNIVARIATE & NONLINEAR FEATURE SCREENING</span>
          </h3>
          <p className="text-[#94A3B8] font-sans leading-relaxed text-[11px]">
            Composite ranking evaluating Pearson correlation ($|r|$), ANOVA F-statistic ($F$), and Mutual Information ($MI$).
          </p>

          <div className="overflow-x-auto border border-[#1B2028] bg-[#050607] rounded-sm max-h-56">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-[#0D0F13] text-[#64748B] border-b border-[#1B2028]">
                <tr>
                  <th className="p-2.5">Feature</th>
                  <th className="p-2.5">Pearson |r|</th>
                  <th className="p-2.5">F-Score</th>
                  <th className="p-2.5">Mutual Info</th>
                  <th className="p-2.5">Composite</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B2028]">
                {featureScreening.slice(0, 8).map((fs) => (
                  <tr key={fs.feature} className="hover:bg-[#090A0D]">
                    <td className="p-2.5 text-[#CBD5E1]">{fs.feature}</td>
                    <td className="p-2.5 text-[#94A3B8]">{fs.pearson_abs.toFixed(3)}</td>
                    <td className="p-2.5 text-[#94A3B8]">{fs.f_score.toFixed(1)}</td>
                    <td className="p-2.5 text-[#94A3B8]">{fs.mutual_info.toFixed(3)}</td>
                    <td className="p-2.5 text-[#00F0FF] font-bold">{fs.composite_score.toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
