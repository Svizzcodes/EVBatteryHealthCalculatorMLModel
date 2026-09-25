import React, { useState, useMemo } from 'react';
import { 
  VehicleInputs, 
  defaultVehicleInputs, 
  predictBatterySoH, 
  PredictionResult 
} from '../utils/modelInference';
import { DiagnosticReportModal } from './DiagnosticReportModal';
import { 
  Zap, 
  Car, 
  BatteryCharging, 
  Thermometer, 
  Gauge, 
  Sliders, 
  RefreshCw, 
  ArrowRight, 
  Info, 
  CheckCircle2, 
  ShieldCheck, 
  HelpCircle,
  TrendingDown,
  Sparkles,
  FileText,
  Clock,
  BatteryMedium,
  Check
} from 'lucide-react';

export const BatteryHealthEstimator: React.FC = () => {
  const [inputs, setInputs] = useState<VehicleInputs>(defaultVehicleInputs);
  const [prediction, setPrediction] = useState<PredictionResult>(() => predictBatterySoH(defaultVehicleInputs));
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<1 | 2>(1);
  const [showTransformation, setShowTransformation] = useState<boolean>(false);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);

  // "What If?" Scenario State
  const [whatIfFastCharge, setWhatIfFastCharge] = useState<number>(1);
  const [whatIfTemp, setWhatIfTemp] = useState<number>(24);
  const [whatIfTargetSoc, setWhatIfTargetSoc] = useState<number>(80);
  const [whatIfStartSoc, setWhatIfStartSoc] = useState<number>(20);

  const handleInputChange = (field: keyof VehicleInputs, value: any) => {
    const updated = { ...inputs, [field]: value };
    setInputs(updated);
    setPrediction(predictBatterySoH(updated));
  };

  const runAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setPrediction(predictBatterySoH(inputs));
      setIsAnalyzing(false);
      const resEl = document.getElementById('estimation-results');
      if (resEl) resEl.scrollIntoView({ behavior: 'smooth' });
    }, 450);
  };

  // What-If Scenario Calculation
  const whatIfPrediction = useMemo(() => {
    const modifiedInputs: VehicleInputs = {
      ...inputs,
      fastChargePerWeek: whatIfFastCharge,
      operatingTempC: whatIfTemp,
      targetChargeLevelPct: whatIfTargetSoc,
      startChargeLevelPct: whatIfStartSoc,
      leavesPluggedAt100: whatIfTargetSoc > 90 ? false : inputs.leavesPluggedAt100
    };
    return predictBatterySoH(modifiedInputs);
  }, [inputs, whatIfFastCharge, whatIfTemp, whatIfTargetSoc, whatIfStartSoc]);

  const deltaSoH = parseFloat((whatIfPrediction.estimatedSoH - prediction.estimatedSoH).toFixed(1));

  return (
    <section id="estimator" className="relative py-20 px-6 max-w-7xl mx-auto border-t border-[#1B2028]">
      
      {/* Section Header */}
      <div className="space-y-3 max-w-3xl mb-12">
        <div className="flex items-center space-x-2 font-mono text-xs tracking-widest text-[#00F0FF] uppercase">
          <span className="w-4 h-[1px] bg-[#00F0FF]" />
          <span>BATTERY INTELLIGENCE CONFIGURATOR</span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#F8FAFC]">
          CHECK BATTERY<br />
          STATE OF HEALTH.
        </h2>

        <p className="text-sm text-[#94A3B8] leading-relaxed pt-1">
          Configure your vehicle's physical operating and charging regime. Our physical transformation layer maps your inputs into the NASA feature domain to execute real-time model inference.
        </p>
      </div>

      {/* Main Configurator Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: 2-Step Automotive Configurator Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="border border-[#1B2028] bg-[#090A0D] rounded-sm p-6 sm:p-8 space-y-8">
            
            {/* Step Selector Header */}
            <div className="flex items-center justify-between border-b border-[#1B2028] pb-4 font-mono text-xs">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setActiveStep(1)}
                  className={`flex items-center space-x-2 pb-1 border-b-2 transition-colors ${
                    activeStep === 1 ? 'border-[#00F0FF] text-[#00F0FF] font-bold' : 'border-transparent text-[#64748B]'
                  }`}
                >
                  <span>STEP 01</span>
                  <span className="hidden sm:inline">/ VEHICLE SPEC</span>
                </button>

                <button
                  onClick={() => setActiveStep(2)}
                  className={`flex items-center space-x-2 pb-1 border-b-2 transition-colors ${
                    activeStep === 2 ? 'border-[#00F0FF] text-[#00F0FF] font-bold' : 'border-transparent text-[#64748B]'
                  }`}
                >
                  <span>STEP 02</span>
                  <span className="hidden sm:inline">/ CHARGING & USAGE HABITS</span>
                </button>
              </div>

              <span className="text-[#64748B] text-[10px]">
                {activeStep === 1 ? 'STEP 1 OF 2' : 'STEP 2 OF 2'}
              </span>
            </div>

            {/* STEP 1: VEHICLE SPECIFICATION */}
            {activeStep === 1 && (
              <div className="space-y-6">
                
                {/* Vehicle Type */}
                <div className="space-y-2">
                  <label className="font-mono text-[11px] text-[#64748B] uppercase tracking-wider block">
                    VEHICLE CLASSIFICATION
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
                    {[
                      { id: 'car', label: 'Electric Car' },
                      { id: 'scooter', label: 'E-Scooter' },
                      { id: 'motorcycle', label: 'E-Motorcycle' },
                      { id: 'commercial', label: 'Commercial EV' }
                    ].map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => handleInputChange('vehicleType', v.id)}
                        className={`p-3 border text-left rounded-sm transition-all ${
                          inputs.vehicleType === v.id
                            ? 'border-[#00F0FF] bg-[#00F0FF]/15 text-[#00F0FF] font-bold'
                            : 'border-[#1B2028] bg-[#050607] text-[#94A3B8] hover:text-[#CBD5E1]'
                        }`}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Battery Pack Capacity */}
                <div className="space-y-2">
                  <div className="flex justify-between font-mono text-xs">
                    <span className="text-[#64748B] uppercase">NOMINAL PACK CAPACITY</span>
                    <span className="text-[#F8FAFC] font-bold">{inputs.batteryCapacityKwh} kWh</span>
                  </div>
                  <input
                    type="range"
                    min={inputs.vehicleType === 'scooter' ? 2 : 15}
                    max={inputs.vehicleType === 'commercial' ? 180 : 120}
                    step={1}
                    value={inputs.batteryCapacityKwh}
                    onChange={(e) => handleInputChange('batteryCapacityKwh', Number(e.target.value))}
                    className="w-full accent-[#00F0FF] bg-[#14181F] h-1.5 rounded-none cursor-pointer"
                  />
                  <div className="flex justify-between font-mono text-[10px] text-[#475569]">
                    <span>{inputs.vehicleType === 'scooter' ? '2 kWh' : '15 kWh'}</span>
                    <span>{inputs.vehicleType === 'commercial' ? '180 kWh' : '120 kWh'}</span>
                  </div>
                </div>

                {/* Battery Age */}
                <div className="space-y-2">
                  <div className="flex justify-between font-mono text-xs">
                    <span className="text-[#64748B] uppercase">BATTERY AGE</span>
                    <span className="text-[#F8FAFC] font-bold">{inputs.batteryAgeYears} Years</span>
                  </div>
                  <input
                    type="range"
                    min={0.2}
                    max={10.0}
                    step={0.1}
                    value={inputs.batteryAgeYears}
                    onChange={(e) => handleInputChange('batteryAgeYears', Number(e.target.value))}
                    className="w-full accent-[#00F0FF] bg-[#14181F] h-1.5 rounded-none cursor-pointer"
                  />
                  <div className="flex justify-between font-mono text-[10px] text-[#475569]">
                    <span>0.2 Yrs (Brand New)</span>
                    <span>10.0 Yrs</span>
                  </div>
                </div>

                {/* Odometer Mileage */}
                <div className="space-y-2">
                  <div className="flex justify-between font-mono text-xs">
                    <span className="text-[#64748B] uppercase">TOTAL DISTANCE TRAVELLED</span>
                    <span className="text-[#00F0FF] font-bold">{inputs.odometerKm.toLocaleString()} km</span>
                  </div>
                  <input
                    type="range"
                    min={1000}
                    max={250000}
                    step={1000}
                    value={inputs.odometerKm}
                    onChange={(e) => handleInputChange('odometerKm', Number(e.target.value))}
                    className="w-full accent-[#00F0FF] bg-[#14181F] h-1.5 rounded-none cursor-pointer"
                  />
                  <div className="flex justify-between font-mono text-[10px] text-[#475569]">
                    <span>1,000 km</span>
                    <span>250,000 km</span>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveStep(2)}
                    className="flex items-center space-x-2 px-5 py-2.5 bg-[#0D0F13] border border-[#1B2028] hover:border-[#00F0FF]/40 text-[#00F0FF] font-mono text-xs font-bold rounded-sm transition-all"
                  >
                    <span>NEXT: CHARGING & USAGE HABITS</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            )}

            {/* STEP 2: DETAILED CHARGING & USAGE HABITS */}
            {activeStep === 2 && (
              <div className="space-y-6">
                
                {/* Starting SoC Level (When do you plug in?) */}
                <div className="space-y-2">
                  <div className="flex justify-between font-mono text-xs">
                    <span className="text-[#64748B] uppercase">STARTING BATTERY LEVEL (WHEN DO YOU PLUG IN?)</span>
                    <span className={`font-bold ${inputs.startChargeLevelPct <= 10 ? 'text-rose-400' : 'text-[#00F0FF]'}`}>
                      {inputs.startChargeLevelPct}% SoC {inputs.startChargeLevelPct <= 10 ? '(Deep Discharge)' : ''}
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5 font-mono text-xs">
                    {[
                      { val: 5, label: '< 5% (Critical)' },
                      { val: 10, label: '10%' },
                      { val: 20, label: '20% (Optimal)' },
                      { val: 30, label: '30%' },
                      { val: 40, label: '40%+' }
                    ].map((s) => (
                      <button
                        key={s.val}
                        type="button"
                        onClick={() => handleInputChange('startChargeLevelPct', s.val)}
                        className={`p-2 border text-center rounded-sm transition-all ${
                          inputs.startChargeLevelPct === s.val
                            ? 'border-[#00F0FF] bg-[#00F0FF]/15 text-[#00F0FF] font-bold'
                            : 'border-[#1B2028] bg-[#050607] text-[#94A3B8] hover:text-[#CBD5E1]'
                        }`}
                      >
                        <div className="text-[10px] truncate">{s.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target SoC Ceiling (Till when do you charge?) */}
                <div className="space-y-2">
                  <div className="flex justify-between font-mono text-xs">
                    <span className="text-[#64748B] uppercase">TARGET CHARGE CEILING (TILL WHAT LEVEL?)</span>
                    <span className={`font-bold ${inputs.targetChargeLevelPct === 100 ? 'text-amber-400' : 'text-[#00F0FF]'}`}>
                      {inputs.targetChargeLevelPct}% SoC {inputs.targetChargeLevelPct === 100 ? '(Full Saturation)' : ''}
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5 font-mono text-xs">
                    {[
                      { val: 70, label: '70%' },
                      { val: 80, label: '80% (Daily rec.)' },
                      { val: 85, label: '85%' },
                      { val: 90, label: '90%' },
                      { val: 100, label: '100% (Full)' }
                    ].map((t) => (
                      <button
                        key={t.val}
                        type="button"
                        onClick={() => handleInputChange('targetChargeLevelPct', t.val)}
                        className={`p-2 border text-center rounded-sm transition-all ${
                          inputs.targetChargeLevelPct === t.val
                            ? 'border-[#00F0FF] bg-[#00F0FF]/15 text-[#00F0FF] font-bold'
                            : 'border-[#1B2028] bg-[#050607] text-[#94A3B8] hover:text-[#CBD5E1]'
                        }`}
                      >
                        <div className="text-[10px] truncate">{t.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Charging Pattern & Fast Charging Frequency */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="font-mono text-[11px] text-[#64748B] uppercase tracking-wider block">
                      CHARGING INFRASTRUCTURE
                    </label>
                    <select
                      value={inputs.chargingPattern}
                      onChange={(e) => handleInputChange('chargingPattern', e.target.value)}
                      className="w-full bg-[#050607] border border-[#1B2028] text-[#CBD5E1] p-2.5 rounded-sm font-mono text-xs focus:border-[#00F0FF] outline-none"
                    >
                      <option value="ac">Mostly AC Level 2 (Home/Office)</option>
                      <option value="mixed">Mixed AC & DC Fast Charging</option>
                      <option value="dc_fast">Frequent DC Fast Charging (50kW+)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between font-mono text-xs">
                      <span className="text-[#64748B] uppercase">DC FAST FREQUENCY</span>
                      <span className="text-[#F8FAFC] font-bold">{inputs.fastChargePerWeek}x / week</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={7}
                      step={1}
                      value={inputs.fastChargePerWeek}
                      onChange={(e) => handleInputChange('fastChargePerWeek', Number(e.target.value))}
                      className="w-full accent-[#00F0FF] bg-[#14181F] h-1.5 rounded-none cursor-pointer mt-2"
                    />
                  </div>
                </div>

                {/* Operating Climate Temperature */}
                <div className="space-y-2">
                  <div className="flex justify-between font-mono text-xs">
                    <span className="text-[#64748B] uppercase">OPERATING / CLIMATE TEMPERATURE</span>
                    <span className="text-[#00F0FF] font-bold">{inputs.operatingTempC}°C</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={48}
                    step={1}
                    value={inputs.operatingTempC}
                    onChange={(e) => handleInputChange('operatingTempC', Number(e.target.value))}
                    className="w-full accent-[#00F0FF] bg-[#14181F] h-1.5 rounded-none cursor-pointer"
                  />
                  <div className="flex justify-between font-mono text-[10px] text-[#475569]">
                    <span>10°C (Temperate)</span>
                    <span>48°C (Extreme Ambient Heat)</span>
                  </div>
                </div>

                {/* Overnight Soak Toggle */}
                <div className="p-3 bg-[#050607] border border-[#1B2028] rounded-sm flex items-center justify-between font-mono text-xs">
                  <div>
                    <div className="text-[#CBD5E1] font-semibold">Overnight Saturation (Left at 100%)</div>
                    <div className="text-[10px] text-[#64748B]">Does vehicle sit plugged in fully charged for 8+ hours?</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleInputChange('leavesPluggedAt100', !inputs.leavesPluggedAt100)}
                    className={`px-3 py-1.5 rounded-sm border font-bold text-xs transition-colors ${
                      inputs.leavesPluggedAt100
                        ? 'border-amber-400 bg-amber-400/20 text-amber-400'
                        : 'border-[#1B2028] bg-[#090A0D] text-[#64748B]'
                    }`}
                  >
                    {inputs.leavesPluggedAt100 ? 'YES (Soaks at 100%)' : 'NO'}
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveStep(1)}
                    className="text-xs font-mono text-[#64748B] hover:text-[#CBD5E1]"
                  >
                    ← Back to Step 1
                  </button>

                  <button
                    type="button"
                    onClick={runAnalysis}
                    className="flex items-center space-x-2 px-6 py-3 bg-[#00F0FF] text-[#050607] font-mono text-xs font-bold rounded-sm hover:bg-[#67E8F9] transition-all shadow-[0_0_20px_rgba(0,240,255,0.35)]"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                    <span>ANALYZE BATTERY HEALTH</span>
                  </button>
                </div>

              </div>
            )}

          </div>

          {/* Physical Transformation Layer Accordion */}
          <div className="border border-[#1B2028] bg-[#090A0D] rounded-sm p-5 font-mono text-xs space-y-3">
            <button
              onClick={() => setShowTransformation(!showTransformation)}
              className="w-full flex items-center justify-between text-left text-[#94A3B8] hover:text-[#F8FAFC]"
            >
              <div className="flex items-center space-x-2">
                <Info className="w-4 h-4 text-[#00F0FF]" />
                <span className="font-bold text-[#CBD5E1]">
                  Input-to-NASA Feature Transformation Layer
                </span>
              </div>
              <span className="text-[10px] text-[#00F0FF]">
                {showTransformation ? 'HIDE' : 'VIEW MAPPING'}
              </span>
            </button>

            {showTransformation && (
              <div className="space-y-4 pt-3 border-t border-[#1B2028] text-[11px] text-[#94A3B8]">
                <p className="leading-relaxed">
                  Your vehicle and charging parameters are mathematically mapped into the 23 physical statistical moments expected by the NASA 18650 cell regression pipeline:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px] p-3 bg-[#050607] border border-[#1B2028] rounded">
                  <div>
                    <span className="text-[#64748B] block">NASA cycle_index:</span>
                    <span className="text-[#00F0FF] font-bold">{prediction.transformedFeatures.cycle_index}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block">temperature_mean:</span>
                    <span className="text-[#00F0FF] font-bold">{prediction.transformedFeatures.temperature_mean}°C</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block">temperature_std:</span>
                    <span className="text-[#00F0FF] font-bold">{prediction.transformedFeatures.temperature_std}°C</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block">abs_current_mean:</span>
                    <span className="text-[#00F0FF] font-bold">{prediction.transformedFeatures.abs_current_mean} A</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block">voltage_std (DoD):</span>
                    <span className="text-[#00F0FF] font-bold">{prediction.transformedFeatures.voltage_std} V</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block">rw_duration_s:</span>
                    <span className="text-[#00F0FF] font-bold">{prediction.transformedFeatures.rw_duration_s.toLocaleString()} s</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: The WOW Result Dashboard */}
        <div id="estimation-results" className="lg:col-span-5 space-y-6">
          
          {/* Main Health Card */}
          <div className="border border-[#00F0FF]/40 bg-[#0D0F13] p-6 sm:p-8 rounded-sm space-y-6 shadow-[0_0_35px_rgba(0,240,255,0.08)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00F0FF]/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-[#1B2028] pb-4 font-mono text-xs">
              <span className="text-[#00F0FF] tracking-widest uppercase flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse" />
                <span>STATE OF HEALTH REPORT</span>
              </span>
              <span className="text-[#64748B]">
                {inputs.vehicleType.toUpperCase()}
              </span>
            </div>

            {/* Circular Arc / Big Number Display */}
            <div className="text-center py-4 space-y-2">
              <div className="text-6xl sm:text-7xl font-black text-[#F8FAFC] tracking-tighter">
                {prediction.estimatedSoH}
                <span className="text-3xl text-[#00F0FF] font-mono ml-1">%</span>
              </div>

              <div className="font-mono text-xs tracking-widest uppercase text-[#94A3B8]">
                ESTIMATED STATE OF HEALTH
              </div>

              <div className="pt-2 flex justify-center">
                <span className={`px-3 py-1 font-mono text-xs font-bold rounded-sm border ${
                  prediction.healthCategory === 'EXCELLENT'
                    ? 'border-emerald-400 bg-emerald-400/15 text-emerald-400'
                    : prediction.healthCategory === 'GOOD'
                    ? 'border-[#00F0FF] bg-[#00F0FF]/15 text-[#00F0FF]'
                    : prediction.healthCategory === 'MODERATE'
                    ? 'border-amber-400 bg-amber-400/15 text-amber-400'
                    : 'border-rose-400 bg-rose-400/15 text-rose-400'
                }`}>
                  STATUS: {prediction.healthCategory} CONDITION
                </span>
              </div>
            </div>

            {/* Honest Scientific Context Strip & PDF Generator Button */}
            <div className="space-y-3">
              <div className="p-4 bg-[#050607] border border-[#1B2028] rounded font-mono text-xs space-y-2">
                <div className="flex justify-between text-[#64748B]">
                  <span>MODEL USED:</span>
                  <span className="text-[#CBD5E1]">Gradient Boosting</span>
                </div>
                <div className="flex justify-between text-[#64748B]">
                  <span>TEST BENCHMARK RMSE:</span>
                  <span className="text-[#00F0FF]">±3.10% SoH</span>
                </div>
                <div className="flex justify-between text-[#64748B]">
                  <span>BASELINE REDUCTION:</span>
                  <span className="text-emerald-400">-80.76% error</span>
                </div>
              </div>

              <button
                onClick={() => setIsReportOpen(true)}
                className="w-full flex items-center justify-center space-x-2 py-2.5 bg-[#050607] border border-[#00F0FF]/40 hover:border-[#00F0FF] text-[#00F0FF] hover:text-[#F8FAFC] font-mono text-xs font-bold rounded-sm transition-all"
              >
                <FileText className="w-4 h-4" />
                <span>GENERATE BATTERY REPORT (PDF / PRINT)</span>
              </button>
            </div>

          </div>

          {/* Actionable Battery Preservation Tips */}
          <div className="border border-emerald-500/30 bg-[#090A0D] p-6 rounded-sm space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#1B2028] pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-[#F8FAFC]">BATTERY HEALTH PRESERVATION TIPS</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">ACTIONABLE</span>
            </div>

            <div className="space-y-3">
              {prediction.preservationTips.map((tip, idx) => (
                <div key={idx} className="p-3.5 bg-[#050607] border border-[#1B2028] rounded-sm space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-emerald-400 font-bold">{tip.category} TIP</span>
                    <span className="text-[#64748B] font-semibold">{tip.impactLevel}</span>
                  </div>
                  <div className="font-bold text-[#F8FAFC] text-xs font-sans">{tip.title}</div>
                  <p className="text-[11px] text-[#94A3B8] font-sans leading-relaxed">{tip.recommendation}</p>
                  <div className="text-[10px] text-[#00F0FF] pt-1">Potential Gain: {tip.potentialBenefit}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Explainability: Why This Estimate? */}
          <div className="border border-[#1B2028] bg-[#090A0D] p-6 rounded-sm space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#1B2028] pb-3">
              <span className="font-bold text-[#F8FAFC]">WHY THIS ESTIMATE? (FEATURE ATTRIBUTION)</span>
              <span className="text-[#00F0FF] text-[10px]">SHAP WEIGHTS</span>
            </div>

            <div className="space-y-3">
              {prediction.contributions.map((c) => (
                <div key={c.featureName} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#CBD5E1]">{c.label}</span>
                    <span className="text-[#64748B]">{c.impactScore}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#050607] rounded-none overflow-hidden">
                    <div
                      className={`h-full ${c.direction === 'degrades' ? 'bg-rose-400/80' : 'bg-[#00F0FF]'}`}
                      style={{ width: `${c.impactScore}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-[#64748B] font-sans pt-0.5">{c.explanation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive "What If?" Scenario Explorer */}
          <div className="border border-[#00F0FF]/30 bg-[#0D0F13] p-6 rounded-sm space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#1B2028] pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#00F0FF]" />
                <span className="font-bold text-[#F8FAFC]">WHAT IF? (LIVE SCENARIO SIMULATOR)</span>
              </div>
              <span className="text-[10px] text-emerald-400">REAL MODEL RE-RUN</span>
            </div>

            <p className="text-xs text-[#94A3B8] font-sans leading-relaxed">
              Modify charging habits below to calculate your potential State of Health recovery:
            </p>

            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#64748B]">Reduce Fast Charging to:</span>
                  <span className="text-[#F8FAFC] font-bold">{whatIfFastCharge}x / wk</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={7}
                  value={whatIfFastCharge}
                  onChange={(e) => setWhatIfFastCharge(Number(e.target.value))}
                  className="w-full accent-[#00F0FF] bg-[#050607] h-1 rounded-none cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#64748B]">Cap Daily Charge Limit (SoC) to:</span>
                  <span className="text-[#F8FAFC] font-bold">{whatIfTargetSoc}%</span>
                </div>
                <input
                  type="range"
                  min={70}
                  max={100}
                  step={5}
                  value={whatIfTargetSoc}
                  onChange={(e) => setWhatIfTargetSoc(Number(e.target.value))}
                  className="w-full accent-[#00F0FF] bg-[#050607] h-1 rounded-none cursor-pointer"
                />
              </div>
            </div>

            {/* Live What-If Comparison Banner */}
            <div className="mt-4 p-4 bg-[#050607] border border-[#1B2028] rounded flex items-center justify-between">
              <div>
                <div className="text-[10px] text-[#64748B]">PROJECTED REVISED SOH</div>
                <div className="text-xl font-bold text-[#00F0FF]">
                  {whatIfPrediction.estimatedSoH}%
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] text-[#64748B]">ESTIMATED HEALTH BENEFIT</div>
                <div className={`text-sm font-bold ${deltaSoH >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {deltaSoH >= 0 ? `+${deltaSoH}% SoH` : `${deltaSoH}% SoH`}
                </div>
              </div>
            </div>

          </div>

          {/* Simple Battery Timeline */}
          <div className="border border-[#1B2028] bg-[#090A0D] p-6 rounded-sm space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#1B2028] pb-3">
              <span className="font-bold text-[#F8FAFC]">BATTERY DEGRADATION TRAJECTORY</span>
              <span className="text-[#64748B] text-[10px]">LIFETIME TREND</span>
            </div>

            <div className="space-y-4 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#64748B]">YEAR 0 (FACTORY FRESH)</span>
                <span className="text-[#F8FAFC] font-semibold">100.0%</span>
              </div>

              <div className="flex items-center justify-between text-xs p-2.5 bg-[#0D0F13] border border-[#00F0FF]/30 rounded">
                <span className="text-[#00F0FF] font-bold">CURRENT ESTIMATE ({inputs.batteryAgeYears} YRS)</span>
                <span className="text-[#00F0FF] font-bold">{prediction.estimatedSoH}%</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-[#64748B]">PROJECTED +1 YEAR</span>
                <span className="text-[#94A3B8]">{prediction.timeline.projectedYearPlus1}%</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-[#64748B]">PROJECTED +3 YEARS</span>
                <span className="text-[#94A3B8]">{prediction.timeline.projectedYearPlus3}%</span>
              </div>
            </div>

            <div className="p-3 bg-[#050607] border border-[#1B2028] rounded text-[11px] text-[#64748B] font-sans">
              📌 Log periodic charging sessions to calibrate real-world personal degradation rates over time.
            </div>
          </div>

        </div>

      </div>

      {/* PDF / Printable Diagnostic Report Modal */}
      <DiagnosticReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        inputs={inputs}
        prediction={prediction}
      />

    </section>
  );
};
