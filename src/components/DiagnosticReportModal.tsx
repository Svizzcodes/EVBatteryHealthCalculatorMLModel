import React from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck, FileText, Zap, Thermometer, BatteryCharging } from 'lucide-react';
import { VehicleInputs, PredictionResult } from '../utils/modelInference';

interface DiagnosticReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: VehicleInputs;
  prediction: PredictionResult;
}

export const DiagnosticReportModal: React.FC<DiagnosticReportModalProps> = ({
  isOpen,
  onClose,
  inputs,
  prediction
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#050607]/90 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-4xl bg-[#090A0D] border border-[#1B2028] rounded-sm shadow-2xl overflow-hidden font-mono text-xs text-[#CBD5E1] my-auto">
        
        {/* Modal Top Control Bar (Hidden on print) */}
        <div className="print:hidden flex items-center justify-between px-6 py-4 border-b border-[#1B2028] bg-[#050607]">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-[#00F0FF]" />
            <span className="font-bold text-[#F8FAFC]">BATTERY HEALTH CERTIFICATE & DIAGNOSTIC REPORT</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#00F0FF] text-[#050607] font-bold rounded-sm hover:bg-[#67E8F9] transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PRINT / SAVE AS PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-[#64748B] hover:text-[#F8FAFC] border border-[#1B2028] rounded-sm transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Report Canvas */}
        <div id="printable-report" className="p-8 sm:p-10 space-y-8 bg-[#090A0D] print:bg-white print:text-black">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-b border-[#1B2028] print:border-black pb-6 gap-4">
            <div>
              <div className="text-[10px] text-[#00F0FF] print:text-blue-700 tracking-widest font-bold uppercase">
                STATE OF HEALTH DIAGNOSTIC CERTIFICATE
              </div>
              <h1 className="text-2xl font-black text-[#F8FAFC] print:text-black font-sans mt-1">
                LITHIUM-ION BATTERY SOH REPORT
              </h1>
              <p className="text-xs text-[#64748B] print:text-gray-600 mt-0.5">
                Model: Gradient Boosting • NASA Ames PCoE Dataset #11 Ground Truth
              </p>
            </div>

            <div className="text-left sm:text-right text-[11px] space-y-0.5">
              <div><strong className="text-[#CBD5E1] print:text-black">RESEARCHER:</strong> SHLOK VIJ</div>
              <div><strong className="text-[#CBD5E1] print:text-black">PRN:</strong> 230705211143 (Sem VII, Sec B)</div>
              <div className="text-[#64748B] print:text-gray-600">Symbiosis Institute of Technology, Nagpur</div>
            </div>
          </div>

          {/* Primary Health Score Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 bg-[#050607] print:bg-gray-100 border border-[#1B2028] print:border-gray-300 rounded-sm items-center">
            <div className="sm:col-span-2 space-y-1">
              <span className="text-[10px] text-[#64748B] print:text-gray-600 uppercase tracking-widest">
                ESTIMATED BATTERY HEALTH
              </span>
              <div className="text-5xl font-black text-[#00F0FF] print:text-blue-700 tracking-tight">
                {prediction.estimatedSoH}% <span className="text-xl font-normal text-[#F8FAFC] print:text-black">SoH</span>
              </div>
              <div className="text-xs text-emerald-400 print:text-green-700 font-bold pt-1">
                STATUS: {prediction.healthCategory} CONDITION
              </div>
            </div>

            <div className="space-y-1.5 text-xs border-t sm:border-t-0 sm:border-l border-[#1B2028] print:border-gray-300 pt-4 sm:pt-0 sm:pl-6">
              <div className="text-[#64748B] print:text-gray-600">MODEL BENCHMARK:</div>
              <div className="text-[#F8FAFC] print:text-black font-bold">RMSE: ±3.10% SoH</div>
              <div className="text-[#64748B] print:text-gray-600">VARIANCE EXPLAINED:</div>
              <div className="text-[#00F0FF] print:text-blue-700 font-bold">R² = 0.9595</div>
            </div>
          </div>

          {/* Vehicle & Usage Telemetry Specs */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#00F0FF] print:text-blue-700 uppercase tracking-wider">
              01 / OPERATING PROFILE TELEMETRY
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#050607] print:bg-gray-50 border border-[#1B2028] print:border-gray-300 rounded-sm text-[11px]">
              <div>
                <span className="text-[#64748B] print:text-gray-600 block">VEHICLE TYPE:</span>
                <span className="text-[#CBD5E1] print:text-black font-bold">{inputs.vehicleType.toUpperCase()}</span>
              </div>
              <div>
                <span className="text-[#64748B] print:text-gray-600 block">PACK CAPACITY:</span>
                <span className="text-[#CBD5E1] print:text-black font-bold">{inputs.batteryCapacityKwh} kWh</span>
              </div>
              <div>
                <span className="text-[#64748B] print:text-gray-600 block">ODOMETER:</span>
                <span className="text-[#CBD5E1] print:text-black font-bold">{inputs.odometerKm.toLocaleString()} km</span>
              </div>
              <div>
                <span className="text-[#64748B] print:text-gray-600 block">BATTERY AGE:</span>
                <span className="text-[#CBD5E1] print:text-black font-bold">{inputs.batteryAgeYears} Years</span>
              </div>
              <div>
                <span className="text-[#64748B] print:text-gray-600 block">CHARGING PATTERN:</span>
                <span className="text-[#CBD5E1] print:text-black font-bold">{inputs.chargingPattern.toUpperCase()}</span>
              </div>
              <div>
                <span className="text-[#64748B] print:text-gray-600 block">FAST CHARGING:</span>
                <span className="text-[#CBD5E1] print:text-black font-bold">{inputs.fastChargePerWeek}x / Week</span>
              </div>
              <div>
                <span className="text-[#64748B] print:text-gray-600 block">OPERATING TEMP:</span>
                <span className="text-[#CBD5E1] print:text-black font-bold">{inputs.operatingTempC}°C</span>
              </div>
              <div>
                <span className="text-[#64748B] print:text-gray-600 block">SOC WINDOW:</span>
                <span className="text-[#00F0FF] print:text-blue-700 font-bold">{inputs.startChargeLevelPct}% → {inputs.targetChargeLevelPct}%</span>
              </div>
            </div>
          </div>

          {/* Explainability & Feature Contribution Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#00F0FF] print:text-blue-700 uppercase tracking-wider">
              02 / DEGRADATION ATTRIBUTION BREAKDOWN (SHAP)
            </h3>

            <div className="space-y-2 p-4 bg-[#050607] print:bg-gray-50 border border-[#1B2028] print:border-gray-300 rounded-sm">
              {prediction.contributions.map((c) => (
                <div key={c.featureName} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#CBD5E1] print:text-black font-semibold">{c.label}</span>
                    <span className="text-[#00F0FF] print:text-blue-700">{c.impactScore}% impact</span>
                  </div>
                  <p className="text-[10px] text-[#94A3B8] print:text-gray-600 font-sans">{c.explanation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Personalized Battery Health Preservation Protocol */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-emerald-400 print:text-green-700 uppercase tracking-wider">
              03 / PERSONALIZED BATTERY PRESERVATION PROTOCOL
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {prediction.preservationTips.map((tip, idx) => (
                <div key={idx} className="p-3.5 bg-[#050607] print:bg-gray-50 border border-[#1B2028] print:border-gray-300 rounded-sm space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-emerald-400 print:text-green-700 font-bold">{tip.category} TIP</span>
                    <span className="text-[#64748B] print:text-gray-500 font-semibold">{tip.impactLevel}</span>
                  </div>
                  <div className="font-bold text-[#F8FAFC] print:text-black text-xs font-sans">{tip.title}</div>
                  <p className="text-[11px] text-[#94A3B8] print:text-gray-700 font-sans leading-relaxed">{tip.recommendation}</p>
                  <div className="text-[10px] text-[#00F0FF] print:text-blue-700 pt-1 font-semibold">Benefit: {tip.potentialBenefit}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline & Signature */}
          <div className="flex flex-col sm:flex-row justify-between items-end border-t border-[#1B2028] print:border-black pt-6 text-[10px] text-[#64748B] print:text-gray-600 gap-4">
            <div>
              <div>Methodology: NASA Randomized-Use Features (scikit-learn RobustScaler Pipeline)</div>
              <div>Strict Zero-Leakage Benchmark Formulation • Symbiosis Institute of Technology</div>
            </div>

            <div className="text-left sm:text-right font-mono">
              <div>REPORT SIGNED BY: <strong className="text-[#CBD5E1] print:text-black">SHLOK VIJ</strong></div>
              <div>DATE: {new Date().toLocaleDateString()}</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
