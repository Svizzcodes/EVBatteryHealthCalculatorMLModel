import React, { useState } from 'react';
import { X, BookOpen, Download, FileText, CheckCircle2, ChevronRight } from 'lucide-react';
import { ExperimentResults } from '../types/research';

interface UniversityReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: ExperimentResults | null;
}

export const UniversityReportModal: React.FC<UniversityReportModalProps> = ({
  isOpen,
  onClose,
  results
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'literature' | 'report' | 'references'>('overview');

  if (!isOpen) return null;

  const litReview = [
    {
      ref: 'Fan et al. (2020)',
      method: 'GRU-CNN Deep Learning',
      findings: 'Learns temporal features directly from full charging curves.',
      reported: 'Max error ≤ 4.3% on NASA/Oxford datasets',
      gap: 'Requires raw high-frequency charging profiles; high compute complexity.'
    },
    {
      ref: 'Wu et al. (2022)',
      method: 'Autoencoders + Ensemble GRU',
      findings: 'Extracts low-dimensional health representations from charging sequences.',
      reported: 'RMSE = 1.04%, MAE = 0.77% on LOO-CV',
      gap: 'Complex representation learning; does not emphasize model-agnostic explainability.'
    },
    {
      ref: 'Explainable AI for SoH (2026)',
      method: 'Feature Engineering + Random Forest + SHAP',
      findings: 'Engineered health indicators make battery predictions interpretable.',
      reported: 'R² = 0.992 on NASA B0005 dataset',
      gap: 'Evaluated on standard constant-current cycling, not randomized use.'
    },
    {
      ref: 'Desai et al. (2026)',
      method: 'Bayesian CNN-LSTM',
      findings: 'Models randomized-use temporal patterns and predictive uncertainty.',
      reported: 'R² = 0.932, RMSE = 0.022 on NASA randomized dataset',
      gap: 'Deep sequence model; this study provides a lightweight feature pipeline with explicit unseen-cell holdouts.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#050607]/90 backdrop-blur-md">
      <div className="w-full max-w-5xl bg-[#090A0D] border border-[#1B2028] rounded-sm shadow-2xl h-[90vh] flex flex-col overflow-hidden text-xs font-mono text-[#CBD5E1]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1B2028] bg-[#050607] shrink-0">
          <div>
            <span className="text-[#00F0FF] text-[10px] tracking-widest uppercase">
              ACADEMIC MINI-PROJECT REPORT
            </span>
            <h2 className="text-base sm:text-lg font-bold text-[#F8FAFC] font-sans truncate max-w-xl">
              Explainable Machine Learning Approaches for State of Health Estimation of Lithium-Ion Batteries
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="p-1.5 border border-[#1B2028] hover:border-[#00F0FF]/40 text-[#94A3B8] hover:text-[#F8FAFC] rounded-sm transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#1B2028] bg-[#090A0D] px-6 shrink-0 space-x-6 text-xs">
          {[
            { id: 'overview', label: '01. METADATA & ABSTRACT' },
            { id: 'literature', label: '02. LITERATURE REVIEW' },
            { id: 'report', label: '03. FULL 24-SECTION REPORT' },
            { id: 'references', label: '04. BIBLIOGRAPHY' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 font-semibold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-[#00F0FF] text-[#00F0FF]'
                  : 'border-transparent text-[#64748B] hover:text-[#CBD5E1]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8">
          
          {/* TAB 1: METADATA & ABSTRACT */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Student Metadata Card */}
              <div className="p-6 bg-[#050607] border border-[#1B2028] rounded-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-[#64748B] text-[10px]">STUDENT NAME</div>
                  <div className="text-sm font-bold text-[#F8FAFC] font-sans mt-0.5">SHLOK VIJ</div>
                </div>
                <div>
                  <div className="text-[#64748B] text-[10px]">PRN</div>
                  <div className="text-sm font-bold text-[#00F0FF] mt-0.5">230705211143</div>
                </div>
                <div>
                  <div className="text-[#64748B] text-[10px]">PROGRAM & SEMESTER</div>
                  <div className="text-sm text-[#CBD5E1] mt-0.5">B.Tech, Semester VII, Section B</div>
                </div>
                <div>
                  <div className="text-[#64748B] text-[10px]">SUBJECT</div>
                  <div className="text-sm text-[#CBD5E1] mt-0.5">Data Science Group A</div>
                </div>
                <div>
                  <div className="text-[#64748B] text-[10px]">INSTITUTION</div>
                  <div className="text-sm text-[#CBD5E1] mt-0.5">Symbiosis Institute of Technology, Nagpur</div>
                </div>
                <div>
                  <div className="text-[#64748B] text-[10px]">DATASET</div>
                  <div className="text-sm text-[#00F0FF] mt-0.5">NASA Ames PCoE Dataset #11</div>
                </div>
              </div>

              {/* Abstract */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#00F0FF] uppercase tracking-wider">
                  ABSTRACT
                </h3>
                <p className="text-sm text-[#CBD5E1] font-sans leading-relaxed">
                  Accurate State of Health (SoH) estimation for lithium-ion batteries under non-standardized, randomized operating conditions is a critical prerequisite for reliable electric vehicle Battery Management Systems (BMS). This study investigates whether statistical characteristics extracted from randomized battery-use intervals contain sufficient predictive signal to estimate subsequent benchmark capacity without requiring full high-frequency sequential telemetry. Using the official NASA Randomized Battery Usage Data Set (#11), we developed a lightweight, reproducible data science pipeline that converts randomized time-series into 23 physics-informed operating-history moments, evaluates six regression architectures, tests generalization on completely unseen battery cells via GroupShuffleSplit, and applies model-agnostic explainability (Permutation Importance and TreeExplainer SHAP). Gradient Boosting achieved an R² of 0.9595 and RMSE of 3.1000% on the random test partition (an 80.76% RMSE reduction over the mean-SoH baseline) and maintained an R² of 0.9311 on unseen cells. Feature attribution identified cumulative duration and thermal volatility as the primary operational contributors alongside cycle progression.
                </p>
              </div>

              {/* Keywords */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-[#00F0FF] uppercase tracking-wider">
                  KEYWORDS
                </h3>
                <div className="flex flex-wrap gap-2 text-xs">
                  {['Lithium-ion Batteries', 'State of Health (SoH)', 'NASA Randomized Battery Dataset', 'Explainable AI', 'SHAP', 'Permutation Importance', 'Gradient Boosting', 'GroupShuffleSplit'].map((k) => (
                    <span key={k} className="px-3 py-1 bg-[#050607] border border-[#1B2028] text-[#CBD5E1] rounded">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LITERATURE REVIEW */}
          {activeTab === 'literature' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-base font-bold text-[#F8FAFC] font-sans">
                  Empirical Literature Review & Positioning
                </h3>
                <p className="text-xs text-[#94A3B8] font-sans leading-relaxed">
                  Comparative analysis of recent battery health estimation frameworks and the specific research gap addressed in this study.
                </p>
              </div>

              <div className="overflow-x-auto border border-[#1B2028] bg-[#050607] rounded-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0D0F13] text-[#64748B] border-b border-[#1B2028] uppercase text-[10px]">
                    <tr>
                      <th className="p-3.5">Reference</th>
                      <th className="p-3.5">Methodology</th>
                      <th className="p-3.5">Reported Metrics</th>
                      <th className="p-3.5">Identified Gap / Scope</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1B2028]">
                    {litReview.map((item, idx) => (
                      <tr key={idx} className="hover:bg-[#090A0D]">
                        <td className="p-3.5 font-bold text-[#00F0FF]">{item.ref}</td>
                        <td className="p-3.5 text-[#CBD5E1]">{item.method}</td>
                        <td className="p-3.5 text-emerald-400 font-mono">{item.reported}</td>
                        <td className="p-3.5 text-[#94A3B8] font-sans text-[11px]">{item.gap}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: FULL 24-SECTION REPORT */}
          {activeTab === 'report' && (
            <div className="space-y-8 font-sans text-xs text-[#CBD5E1] leading-relaxed">
              
              <div className="space-y-2 border-b border-[#1B2028] pb-4">
                <h3 className="text-base font-bold text-[#00F0FF] font-mono">1. Introduction & Background</h3>
                <p>Electric mobility demands reliable State of Health (SoH) diagnostics to ensure safety, prevent sudden power cutoff, and optimize second-life battery repurposing. Real-world duty cycles are stochastic, rendering laboratory constant-current lookup tables inadequate.</p>
              </div>

              <div className="space-y-2 border-b border-[#1B2028] pb-4">
                <h3 className="text-base font-bold text-[#00F0FF] font-mono">2. Problem Statement & Research Objectives</h3>
                <p><strong>Question:</strong> Can measurable characteristics extracted from randomized battery-use history estimate Li-ion battery State of Health (SoH), and can explainable ML identify which operating characteristics contribute most to the estimate?</p>
                <p><strong>Objectives:</strong> (1) Build a leak-free feature extraction pipeline from MATLAB structures; (2) Compare parametric vs non-linear regressors; (3) Measure unseen-cell generalization; (4) Extract model-agnostic feature attributions.</p>
              </div>

              <div className="space-y-2 border-b border-[#1B2028] pb-4">
                <h3 className="text-base font-bold text-[#00F0FF] font-mono">3. Methodology & Implementation</h3>
                <p>Raw time-series from 28 NASA cells are segmented at reference discharge boundaries. 23 statistical moments (mean, std, min, max, range for current, voltage, temperature + Ah throughputs + duration) are scaled with <code>RobustScaler</code> and imputed via median values fit strictly on the training partition.</p>
              </div>

              <div className="space-y-2 border-b border-[#1B2028] pb-4">
                <h3 className="text-base font-bold text-[#00F0FF] font-mono">4. Results, Discussion & Explainability</h3>
                <p>Gradient Boosting and Extra Trees demonstrated superior non-linear fitting (R² = 0.9595 and 0.9591), reducing baseline RMSE by 80.76%. On unseen battery cells (RW1, RW7, RW8), linear regression suffered severe degradation (R² = 0.1113), while tree ensembles maintained R² &gt; 0.93. Permutation importance and SHAP confirmed that cumulative operating duration (<code>rw_duration_s</code>) and thermal dispersion (<code>temperature_std</code>) provided the strongest predictive signals.</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-[#00F0FF] font-mono">5. Conclusion & Limitations</h3>
                <p>The study demonstrates that compact operating-history features contain strong, generalizable battery degradation signals. Future work will investigate differential voltage curve fitting and conformal prediction uncertainty intervals.</p>
              </div>

            </div>
          )}

          {/* TAB 4: BIBLIOGRAPHY */}
          {activeTab === 'references' && (
            <div className="space-y-4 font-sans text-xs">
              <h3 className="text-base font-bold text-[#F8FAFC] font-sans">
                Academic References
              </h3>

              <ol className="space-y-3 text-[#94A3B8] list-decimal pl-5 leading-relaxed">
                <li>
                  <strong className="text-[#CBD5E1]">B. Bole, C. Kulkarni, and M. Daigle</strong>, “Randomized Battery Usage Data Set,” NASA Prognostics Data Repository, NASA Ames Research Center, Dataset #11.
                </li>
                <li>
                  <strong className="text-[#CBD5E1]">B. Bole, C. Kulkarni, and M. Daigle</strong>, “Adaptation of an Electrochemistry-based Li-Ion Battery Model to Account for Deterioration Observed Under Randomized Use,” <em>Annual Conference of the PHM Society</em>, 2014.
                </li>
                <li>
                  <strong className="text-[#CBD5E1]">Y. Fan, F. Xiao, C. Li, G. Yang, and X. Tang</strong>, “A novel deep learning framework for state of health estimation of lithium-ion battery,” <em>Journal of Energy Storage</em>, vol. 32, p. 101741, 2020. DOI: 10.1016/j.est.2020.101741.
                </li>
                <li>
                  <strong className="text-[#CBD5E1]">J. Wu, J. Chen, X. Feng, and H. Xiang</strong>, “State of health estimation of lithium-ion batteries using Autoencoders and Ensemble Learning,” <em>Journal of Energy Storage</em>, vol. 55, p. 105708, 2022. DOI: 10.1016/j.est.2022.105708.
                </li>
                <li>
                  <strong className="text-[#CBD5E1]">S. J. Desai, M. Ramanujam, and V. Runkana</strong>, “Bayesian CNN-LSTM for Battery State of Health (SoH) Estimation under Randomized Usage Conditions,” <em>Int. J. Prognostics and Health Management</em>, 2026. DOI: 10.36001/ijphm.2026.v17i2.4743.
                </li>
                <li>
                  <strong className="text-[#CBD5E1]">Feature engineering and explainable artificial intelligence for state of health estimation of Lithium-ion batteries</strong>, <em>Journal of Energy Storage</em>, vol. 144, p. 119873, 2026. DOI: 10.1016/j.est.2025.119873.
                </li>
              </ol>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#1B2028] bg-[#050607] shrink-0 font-mono text-xs">
          <span className="text-[#64748B]">
            Author: SHLOK VIJ • PRN: 230705211143 • SIT Nagpur
          </span>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#00F0FF] text-[#050607] font-bold rounded-sm hover:bg-[#67E8F9] transition-colors"
          >
            CLOSE
          </button>
        </div>

      </div>
    </div>
  );
};
