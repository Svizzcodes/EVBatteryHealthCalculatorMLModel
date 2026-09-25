import React, { useState } from 'react';
import { X, BookOpen, Download, FileText, CheckCircle2, ChevronRight, Printer, ExternalLink } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'overview' | 'literature' | 'methodology' | 'results' | 'full_report' | 'references'>('overview');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-[#050607]/90 backdrop-blur-md">
      <div className="w-full max-w-5xl bg-[#090A0D] border border-[#1B2028] rounded-sm shadow-2xl h-[92vh] flex flex-col overflow-hidden text-xs font-mono text-[#CBD5E1]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#1B2028] bg-[#050607] shrink-0">
          <div>
            <span className="text-[#00F0FF] text-[10px] tracking-widest uppercase font-bold">
              SYMBIOSIS INSTITUTE OF TECHNOLOGY, NAGPUR • CA-3 REPORT
            </span>
            <h2 className="text-sm sm:text-base font-bold text-[#F8FAFC] font-sans truncate max-w-xl">
              Explainable Machine Learning Approaches for State of Health Estimation of Lithium-Ion Batteries
            </h2>
          </div>

          <div className="flex items-center space-x-2.5">
            <a
              href="/PROJECT_REPORT_SIT_NAGPUR.docx"
              download="PROJECT_REPORT_SIT_NAGPUR.docx"
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-[#00F0FF] hover:bg-[#00F0FF] hover:text-[#050607] text-[11px] font-bold rounded-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DOWNLOAD DOCX</span>
            </a>

            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#0D0F13] border border-[#1B2028] hover:border-[#00F0FF]/40 text-[#CBD5E1] text-[11px] rounded-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PRINT</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 border border-[#1B2028] hover:border-[#00F0FF]/40 text-[#94A3B8] hover:text-[#F8FAFC] rounded-sm transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#1B2028] bg-[#090A0D] px-6 shrink-0 space-x-4 sm:space-x-6 text-xs overflow-x-auto">
          {[
            { id: 'overview', label: '01. TITLE & ABSTRACT' },
            { id: 'literature', label: '02. LITERATURE REVIEW' },
            { id: 'methodology', label: '03. METHODOLOGY & FIGURES' },
            { id: 'results', label: '04. EXPERIMENTAL RESULTS' },
            { id: 'full_report', label: '05. COMPLETE 10-SECTION REPORT' },
            { id: 'references', label: '06. REFERENCES' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 font-semibold border-b-2 whitespace-nowrap transition-colors ${
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
          
          {/* TAB 1: TITLE & ABSTRACT */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              
              {/* Title Page Card */}
              <div className="p-6 bg-[#050607] border border-[#1B2028] rounded-sm text-center space-y-4">
                <div className="text-[11px] text-[#64748B] tracking-widest uppercase">
                  SYMBIOSIS INSTITUTE OF TECHNOLOGY, NAGPUR<br />
                  Symbiosis International (Deemed University), Pune
                </div>

                <div className="text-xs font-bold text-[#00F0FF] tracking-wider uppercase">
                  DATA SCIENCE • CONTINUOUS ASSESSMENT - 3 (CA-3) • MINI PROJECT REPORT
                </div>

                <h1 className="text-xl sm:text-2xl font-black text-[#F8FAFC] font-sans max-w-3xl mx-auto leading-tight">
                  EXPLAINABLE MACHINE LEARNING APPROACHES FOR STATE OF HEALTH ESTIMATION OF LITHIUM-ION BATTERIES
                </h1>

                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto text-left text-[11px] p-4 bg-[#090A0D] border border-[#1B2028] rounded">
                  <div>
                    <span className="text-[#64748B] block">SUBMITTED BY:</span>
                    <strong className="text-[#F8FAFC]">SHLOK VIJ</strong><br />
                    <span className="text-[#CBD5E1]">PRN: 230705211143</span><br />
                    <span className="text-[#94A3B8]">Semester: VII | Section: B</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block">SUBMITTED TO:</span>
                    <strong className="text-[#F8FAFC]">Dr. Smita Singh, PhD</strong><br />
                    <span className="text-[#CBD5E1]">Associate Professor</span><br />
                    <span className="text-[#94A3B8]">Dept. of CSE, SIT Nagpur</span>
                  </div>
                </div>

                <div className="text-[10px] text-[#64748B]">
                  Date of Submission: 26 September 2026 • Academic Year: 2026–2027
                </div>
              </div>

              {/* Abstract */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-[#00F0FF] uppercase tracking-wider">
                  2. ABSTRACT
                </h3>
                <p className="text-xs text-[#CBD5E1] font-sans leading-relaxed">
                  Lithium-ion batteries are widely used in electric vehicles, portable electronics, renewable energy storage systems, and other modern energy applications because of their high energy density and favourable operating characteristics. However, repeated charging and discharging gradually cause battery degradation, resulting in a reduction in available capacity and overall performance. The State of Health (SoH) is therefore an important indicator for evaluating the remaining performance capability of a battery. Accurate SoH estimation can support battery monitoring, maintenance planning, safety management, and efficient energy utilization.
                </p>
                <p className="text-xs text-[#CBD5E1] font-sans leading-relaxed">
                  This project investigates an explainable machine learning approach for estimating the State of Health of lithium-ion batteries operated under randomized usage conditions. The study uses the NASA Randomized Battery Usage Dataset, in which batteries are subjected to randomly generated current profiles and periodic reference charge-discharge cycles are performed to benchmark battery health. The raw MATLAB data is processed to identify reference cycles and summarize the preceding randomized operating history into numerical features such as current, voltage, temperature, duration, and charge-discharge throughput statistics. Multiple regression algorithms, including Linear Regression, Ridge, Elastic Net, Random Forest, Extra Trees, and Gradient Boosting, are evaluated using Mean Absolute Error (MAE), Root Mean Squared Error (RMSE), and coefficient of determination (R²).
                </p>
                <p className="text-xs text-[#CBD5E1] font-sans leading-relaxed">
                  In addition to conventional random train-test evaluation, battery-wise validation is used to investigate how well the selected model generalizes to previously unseen batteries. Permutation importance and SHAP-based analysis are incorporated to improve interpretability and identify operating-history characteristics associated with the predictions. The study therefore combines predictive modelling, generalization analysis, and explainable machine learning into a reproducible data science workflow for battery SoH estimation.
                </p>
              </div>

              {/* Keywords */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-[#00F0FF] uppercase tracking-wider">
                  3. KEYWORDS
                </h3>
                <div className="flex flex-wrap gap-2 text-[11px]">
                  {['Lithium-Ion Battery', 'State of Health', 'Explainable Machine Learning', 'Randomized Battery Usage', 'Feature Engineering', 'Regression', 'Battery Degradation', 'SHAP', 'Machine Learning', 'Data Science'].map((k) => (
                    <span key={k} className="px-2.5 py-1 bg-[#050607] border border-[#1B2028] text-[#CBD5E1] rounded">
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
                  5. Literature Review & Comparison of Existing Research
                </h3>
                <p className="text-xs text-[#94A3B8] font-sans leading-relaxed">
                  Comprehensive benchmark comparison of existing peer-reviewed studies across datasets, architectures, health indicators, and reported metrics.
                </p>
              </div>

              {/* Table 1 */}
              <div className="overflow-x-auto border border-[#1B2028] bg-[#050607] rounded-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0D0F13] text-[#00F0FF] border-b border-[#1B2028] uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Ref</th>
                      <th className="p-3">Authors / Year</th>
                      <th className="p-3">Dataset</th>
                      <th className="p-3">Main Inputs / Features</th>
                      <th className="p-3">Methodology</th>
                      <th className="p-3">Reported Results</th>
                      <th className="p-3">Main Limitation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1B2028] text-[11px]">
                    {[
                      { ref: '[5]', authors: 'Gong et al., 2022', data: 'MIT, CALCE, NASA, Oxford', inputs: 'CC energy, CV energy, EDVI energy', method: 'Gaussian Process Regression', res: 'Errors <0.5%; R²>97%', lim: 'Relies on specifically designed energy indicators' },
                      { ref: '[6]', authors: 'Cai et al., 2022', data: 'NASA and other public datasets', inputs: 'Energy-based features', method: 'Improved GPR', res: 'Errors <0.5% under reported settings', lim: 'Requires carefully engineered energy features' },
                      { ref: '[7]', authors: 'Fan et al., 2020', data: 'NASA Randomized, Oxford', inputs: 'Charging voltage, current, temp', method: 'GRU-CNN', res: 'Maximum error within 4.3%', lim: 'Complex sequential architecture' },
                      { ref: '[3]', authors: 'Ren and Du, 2023', data: 'Multiple battery datasets', inputs: 'Capacity, V, I, T indicators', method: 'Review of ML/DL/SVM/GPR', res: 'Comparative review', lim: 'Dataset and feature differences affect performance' },
                      { ref: '[4]', authors: 'Lyu et al., 2026', data: 'Multiple battery datasets', inputs: 'Engineered health indicators', method: 'Review of data-driven methods', res: 'Comprehensive comparison', lim: 'Highlights continuing generalization challenges' },
                      { ref: '[9]', authors: 'Wang et al., 2026', data: 'Public Li-ion datasets', inputs: 'Raw, derived and smoothed features', method: 'ML + SHAP', res: 'Lightweight short-time estimation', lim: 'Feature effectiveness varies by operating phase' },
                      { ref: '[10]', authors: '2026 XAI study', data: 'NASA B0005', inputs: 'Engineered charge indicators', method: 'RF + GBR + SHAP', res: 'R² = 0.992 reported', lim: 'Uses conventional NASA degradation data, not randomized usage' },
                      { ref: '[11]', authors: '2026 interpretable study', data: 'NASA and CALCE', inputs: 'Base, IC and IE features', method: 'TCN-SENet-BiLSTM + Deep SHAP', res: 'MAE and RMSE <1.5%', lim: 'High model complexity' },
                      { ref: '[8]', authors: 'Desai et al., 2026', data: 'NASA Randomized Battery Usage', inputs: 'Sequential charge-discharge profiles', method: 'Bayesian CNN-LSTM', res: 'R² = 0.932, RMSE = 0.022', lim: 'Computationally complex; sequential model' }
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-[#090A0D]">
                        <td className="p-3 font-bold text-[#00F0FF]">{row.ref}</td>
                        <td className="p-3 text-[#F8FAFC] font-sans">{row.authors}</td>
                        <td className="p-3 text-[#94A3B8]">{row.data}</td>
                        <td className="p-3 text-[#CBD5E1]">{row.inputs}</td>
                        <td className="p-3 text-[#CBD5E1]">{row.method}</td>
                        <td className="p-3 text-emerald-400 font-mono">{row.res}</td>
                        <td className="p-3 text-[#64748B] font-sans">{row.lim}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: METHODOLOGY & FIGURES */}
          {activeTab === 'methodology' && (
            <div className="space-y-8">
              <div className="space-y-2">
                <h3 className="text-base font-bold text-[#F8FAFC] font-sans">
                  6. Methodology & Architectural Figures
                </h3>
                <p className="text-xs text-[#94A3B8] font-sans leading-relaxed">
                  End-to-end data acquisition, statistical moments feature engineering, ensemble modeling, and Bayesian optimization workflows.
                </p>
              </div>

              {/* Figure 1 */}
              <div className="p-4 bg-[#050607] border border-[#1B2028] rounded-sm space-y-3">
                <img
                  src="/figures/figure1_overall_methodology.png"
                  alt="Figure 1. Overall methodology"
                  className="w-full rounded bg-white p-2"
                />
                <div className="text-center text-[11px] text-[#CBD5E1] font-semibold">
                  Figure 1. Overall methodology for SOH prediction using Random Forest with Bayesian Hyperparameter Optimization
                </div>
              </div>

              {/* Figure 2 & Figure 3 Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-[#050607] border border-[#1B2028] rounded-sm space-y-3">
                  <img
                    src="/figures/figure2_random_forest_process.png"
                    alt="Figure 2. Random Forest regression process"
                    className="w-full rounded bg-white p-2"
                  />
                  <div className="text-center text-[11px] text-[#CBD5E1] font-semibold">
                    Figure 2. Random Forest regression process
                  </div>
                </div>

                <div className="p-4 bg-[#050607] border border-[#1B2028] rounded-sm space-y-3">
                  <img
                    src="/figures/figure3_bayesian_optimization.png"
                    alt="Figure 3. Bayesian optimization process"
                    className="w-full rounded bg-white p-2"
                  />
                  <div className="text-center text-[11px] text-[#CBD5E1] font-semibold">
                    Figure 3. Bayesian optimization process for hyperparameter tuning
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EXPERIMENTAL RESULTS */}
          {activeTab === 'results' && (
            <div className="space-y-8">
              <div className="space-y-2">
                <h3 className="text-base font-bold text-[#F8FAFC] font-sans">
                  8. Experimental Results & Visualizations
                </h3>
                <p className="text-xs text-[#94A3B8] font-sans leading-relaxed">
                  Actual experiment metrics, fleet degradation curves, actual vs predicted scatter, permutation importance, and SHAP explanations.
                </p>
              </div>

              {/* Figure 8.1 & 8.2 Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-[#050607] border border-[#1B2028] rounded-sm space-y-3">
                  <img
                    src="/figures/figure8_1_battery_degradation.png"
                    alt="Figure 8.1. Battery degradation"
                    className="w-full rounded bg-white p-1"
                  />
                  <div className="text-center text-[11px] text-[#CBD5E1] font-semibold">
                    Figure 8.1. Battery degradation under randomized usage
                  </div>
                </div>

                <div className="p-4 bg-[#050607] border border-[#1B2028] rounded-sm space-y-3">
                  <img
                    src="/figures/figure8_2_actual_vs_predicted.png"
                    alt="Figure 8.2. Actual vs predicted"
                    className="w-full rounded bg-white p-1"
                  />
                  <div className="text-center text-[11px] text-[#CBD5E1] font-semibold">
                    Figure 8.2. Actual versus predicted SoH
                  </div>
                </div>
              </div>

              {/* Table 8.1 & Table 8.2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="text-xs font-bold text-[#00F0FF] uppercase">
                    Table 8.1. Model Performance under Random Train-Test Split
                  </div>
                  <div className="border border-[#1B2028] bg-[#050607] rounded-sm overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#0D0F13] text-[#64748B] border-b border-[#1B2028] text-[10px]">
                        <tr>
                          <th className="p-2.5">Model</th>
                          <th className="p-2.5">MAE</th>
                          <th className="p-2.5">RMSE</th>
                          <th className="p-2.5">R²</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1B2028] text-[11px]">
                        {[
                          { m: 'Mean-SoH Baseline', mae: '13.3297%', rmse: '16.1129%', r2: '0.0000' },
                          { m: 'Linear Regression', mae: '3.0246%', rmse: '4.0649%', r2: '0.9303' },
                          { m: 'Ridge Regression', mae: '2.8408%', rmse: '4.0081%', r2: '0.9322' },
                          { m: 'Elastic Net', mae: '3.5801%', rmse: '4.9965%', r2: '0.8947' },
                          { m: 'Random Forest', mae: '2.3174%', rmse: '3.5887%', r2: '0.9457' },
                          { m: 'Extra Trees', mae: '2.0091%', rmse: '3.1122%', r2: '0.9591' },
                          { m: 'Gradient Boosting (Selected)', mae: '2.0658%', rmse: '3.1000%', r2: '0.9595' }
                        ].map((r, i) => (
                          <tr key={i} className={r.m.includes('Selected') ? 'bg-[#00F0FF]/10 text-[#00F0FF] font-bold' : ''}>
                            <td className="p-2.5">{r.m}</td>
                            <td className="p-2.5">{r.mae}</td>
                            <td className="p-2.5">{r.rmse}</td>
                            <td className="p-2.5">{r.r2}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-bold text-[#00F0FF] uppercase">
                    Table 8.2. Machine-Learning Improvement over Baseline
                  </div>
                  <div className="border border-[#1B2028] bg-[#050607] rounded-sm overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#0D0F13] text-[#64748B] border-b border-[#1B2028] text-[10px]">
                        <tr>
                          <th className="p-2.5">Metric</th>
                          <th className="p-2.5">Baseline</th>
                          <th className="p-2.5">Selected Model (GBR)</th>
                          <th className="p-2.5">Improvement</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1B2028] text-[11px]">
                        <tr>
                          <td className="p-2.5 font-bold">MAE</td>
                          <td className="p-2.5 text-[#94A3B8]">13.3297%</td>
                          <td className="p-2.5 text-[#00F0FF] font-bold">2.0658%</td>
                          <td className="p-2.5 text-emerald-400 font-bold">-84.50% error</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold">RMSE</td>
                          <td className="p-2.5 text-[#94A3B8]">16.1129%</td>
                          <td className="p-2.5 text-[#00F0FF] font-bold">3.1000%</td>
                          <td className="p-2.5 text-emerald-400 font-bold">-80.76% error</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold">R²</td>
                          <td className="p-2.5 text-[#94A3B8]">-0.0954</td>
                          <td className="p-2.5 text-[#00F0FF] font-bold">0.9595</td>
                          <td className="p-2.5 text-emerald-400 font-bold">+0.9595 fit</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="pt-2 text-xs font-bold text-[#00F0FF] uppercase">
                    Table 8.3. Random-Split versus Unseen-Battery Performance
                  </div>
                  <div className="border border-[#1B2028] bg-[#050607] rounded-sm overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#0D0F13] text-[#64748B] border-b border-[#1B2028] text-[10px]">
                        <tr>
                          <th className="p-2.5">Evaluation Strategy</th>
                          <th className="p-2.5">MAE</th>
                          <th className="p-2.5">RMSE</th>
                          <th className="p-2.5">R²</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1B2028] text-[11px]">
                        <tr>
                          <td className="p-2.5 font-bold">Random Split (80:20)</td>
                          <td className="p-2.5">2.0658%</td>
                          <td className="p-2.5">3.1000%</td>
                          <td className="p-2.5 text-[#00F0FF] font-bold">0.9595</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold">Battery-Wise Holdout (Unseen RW1, 7, 8)</td>
                          <td className="p-2.5">2.4819%</td>
                          <td className="p-2.5">3.0977%</td>
                          <td className="p-2.5 text-emerald-400 font-bold">0.9311</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Figure 8.3 & Figure 8.4 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-[#050607] border border-[#1B2028] rounded-sm space-y-3">
                  <img
                    src="/figures/figure8_3_permutation_importance.png"
                    alt="Figure 8.3. Permutation importance"
                    className="w-full rounded bg-white p-1"
                  />
                  <div className="text-center text-[11px] text-[#CBD5E1] font-semibold">
                    Figure 8.3. Permutation importance of operating-history features
                  </div>
                </div>

                <div className="p-4 bg-[#050607] border border-[#1B2028] rounded-sm space-y-3">
                  <img
                    src="/figures/figure8_4_shap_explanation.png"
                    alt="Figure 8.4. SHAP explanation"
                    className="w-full rounded bg-white p-1"
                  />
                  <div className="text-center text-[11px] text-[#CBD5E1] font-semibold">
                    Figure 8.4. SHAP explanation of SoH predictions
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: COMPLETE 10-SECTION REPORT */}
          {activeTab === 'full_report' && (
            <div className="space-y-8 font-sans text-xs text-[#CBD5E1] leading-relaxed max-w-4xl mx-auto">
              
              <div className="space-y-3 border-b border-[#1B2028] pb-6">
                <h2 className="text-lg font-bold text-[#00F0FF] font-mono">4. INTRODUCTION</h2>
                <h3 className="text-sm font-bold text-[#F8FAFC]">4.1 Background</h3>
                <p>Lithium-ion batteries have become an important energy-storage technology because of their relatively high energy density, rechargeable nature, and suitability for a wide range of applications...</p>
                
                <h3 className="text-sm font-bold text-[#F8FAFC] pt-2">4.2 Battery State of Health</h3>
                <p>State of Health represents the current condition of a battery compared with an appropriate reference condition: <code>SoH = (Q_i / Q_0) × 100%</code>.</p>
                
                <h3 className="text-sm font-bold text-[#F8FAFC] pt-2">4.7 Research Question & 4.8 Hypothesis</h3>
                <p><strong>Question:</strong> Can measurable characteristics extracted from randomized battery-use history provide sufficient information to estimate SoH, and can explainable ML identify which operating characteristics contribute most?</p>
                <p><strong>Alternative Hypothesis (H₁):</strong> Features derived from randomized battery operating history contain predictive information, achieving lower prediction error than a simple mean-SoH baseline.</p>
              </div>

              <div className="space-y-3 border-b border-[#1B2028] pb-6">
                <h2 className="text-lg font-bold text-[#00F0FF] font-mono">6. METHODOLOGY / PROPOSED SYSTEM</h2>
                <p>The processing pipeline consists of raw MATLAB data extraction from 28 NASA files, reference-cycle identification (315 reference cycles), randomized-use segmentation, 23 statistical moments feature engineering, zero-leakage preprocessing, 6 regression algorithms, and SHAP explainability.</p>
              </div>

              <div className="space-y-3 border-b border-[#1B2028] pb-6">
                <h2 className="text-lg font-bold text-[#00F0FF] font-mono">7. IMPLEMENTATION</h2>
                <p>Executed in Python 3.10+ and Google Colab using NumPy, pandas, SciPy, scikit-learn, and Matplotlib. Clean outputs exported as CSV and JSON.</p>
              </div>

              <div className="space-y-3 border-b border-[#1B2028] pb-6">
                <h2 className="text-lg font-bold text-[#00F0FF] font-mono">9. CONCLUSION AND FUTURE WORK</h2>
                <p>The study demonstrates a practical, interpretable data science approach to battery State of Health estimation. Tree-based ensembles maintain high generalization on unseen cells (R² &gt; 0.93), while SHAP and permutation importance clearly isolate thermal and duration stress factors.</p>
              </div>

            </div>
          )}

          {/* TAB 6: REFERENCES */}
          {activeTab === 'references' && (
            <div className="space-y-4 font-sans text-xs">
              <h3 className="text-base font-bold text-[#F8FAFC] font-sans">
                10. REFERENCES (IEEE Format)
              </h3>

              <ol className="space-y-3 text-[#94A3B8] list-decimal pl-5 leading-relaxed text-xs">
                <li>
                  <strong className="text-[#CBD5E1]">B. Bole, C. Kulkarni, and M. Daigle</strong>, “Randomized Battery Usage Data Set,” NASA Prognostics Data Repository, NASA Ames Research Center, Moffett Field, CA.
                </li>
                <li>
                  <strong className="text-[#CBD5E1]">B. Bole, C. Kulkarni, and M. Daigle</strong>, “Adaptation of an Electrochemistry-based Li-Ion Battery Model to Account for Deterioration Observed Under Randomized Use,” <em>Proc. Annual Conference of the Prognostics and Health Management Society</em>, 2014.
                </li>
                <li>
                  <strong className="text-[#CBD5E1]">Y. Fan, F. Xiao, C. Li, G. Yang, and X. Tang</strong>, “A novel deep learning framework for state of health estimation of lithium-ion battery,” <em>Journal of Energy Storage</em>, vol. 32, Art. no. 101741, 2020, doi: 10.1016/j.est.2020.101741.
                </li>
                <li>
                  <strong className="text-[#CBD5E1]">L. Cai et al.</strong>, “An estimation model for state of health of lithium-ion batteries using energy-based features,” <em>Journal of Energy Storage</em>, vol. 46, Art. no. 103846, 2022.
                </li>
                <li>
                  <strong className="text-[#CBD5E1]">D. Gong et al.</strong>, “State of health estimation for lithium-ion battery based on energy features,” <em>Energy</em>, 2022.
                </li>
                <li>
                  <strong className="text-[#CBD5E1]">Z. Lyu et al.</strong>, “Data-Driven State of Health for Lithium-Ion Batteries: Feature Engineering, Estimation Approaches, and Future Directions,” <em>Batteries & Supercaps</em>, 2025/2026.
                </li>
                <li>
                  <strong className="text-[#CBD5E1]">Y. Wang, S. K. Lier, F. Li, S. Maier, T. Oestreich, M. H. Breitner, and W. Schade</strong>, “An explainable artificial intelligence-based feature engineering strategy for lightweight battery health estimation,” <em>Journal of Energy Storage</em>, vol. 155, Art. no. 121444, 2026.
                </li>
                <li>
                  <strong className="text-[#CBD5E1]">S. J. Desai, M. Ramanujam, and V. Runkana</strong>, “Bayesian CNN-LSTM for Battery State of Health (SoH) Estimation under Randomized Usage Conditions,” <em>International Journal of Prognostics and Health Management</em>, vol. 17, no. 2, 2026.
                </li>
                <li>
                  <strong className="text-[#CBD5E1]">W. Huang et al.</strong>, “A dual-level interpretability method for state of health estimation integrating mechanism-related insights in lithium-ion batteries,” <em>Journal of Energy Chemistry</em>, vol. 120, pp. 624–637, 2026.
                </li>
              </ol>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-[#1B2028] bg-[#050607] shrink-0 font-mono text-xs">
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
