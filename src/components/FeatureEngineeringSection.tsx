import React, { useState } from 'react';
import { Layers, Activity, Zap, Thermometer, Clock, Sparkles } from 'lucide-react';

export const FeatureEngineeringSection: React.FC = () => {
  const [activeFeatureKey, setActiveFeatureKey] = useState<string>('current_range');

  const featureCatalog: Record<string, { group: string; name: string; formula: string; desc: string }> = {
    // Current
    'current_mean': { group: 'Current', name: 'CURRENT MEAN', formula: 'mean(I_t)', desc: 'Net average current demand during the random walk interval.' },
    'current_std': { group: 'Current', name: 'CURRENT STD', formula: 'std(I_t)', desc: 'Measures high-frequency current volatility and dynamic switching.' },
    'current_min': { group: 'Current', name: 'CURRENT MIN', formula: 'min(I_t)', desc: 'Peak discharge current pulse (-4.5A limit).' },
    'current_max': { group: 'Current', name: 'CURRENT MAX', formula: 'max(I_t)', desc: 'Peak regenerative charge pulse (+4.5A limit).' },
    'current_range': { group: 'Current', name: 'CURRENT RANGE', formula: 'max(I) - min(I)', desc: 'Captures the total spread between peak charge and discharge current demand during the randomized interval.' },
    'abs_current_mean': { group: 'Current', name: 'ABS CURRENT MEAN', formula: 'mean(|I_t|)', desc: 'Gross load intensity regardless of direction; correlates directly with internal heating.' },
    
    // Voltage
    'voltage_mean': { group: 'Voltage', name: 'VOLTAGE MEAN', formula: 'mean(V_t)', desc: 'Average cell terminal voltage across the randomized operating window.' },
    'voltage_std': { group: 'Voltage', name: 'VOLTAGE STD', formula: 'std(V_t)', desc: 'Voltage fluctuations responding to dynamic current pulses and impedance changes.' },
    'voltage_min': { group: 'Voltage', name: 'VOLTAGE MIN', formula: 'min(V_t)', desc: 'Lowest voltage drop; deep sags indicate high internal cell resistance.' },
    'voltage_max': { group: 'Voltage', name: 'VOLTAGE MAX', formula: 'max(V_t)', desc: 'Peak upper voltage reached during regenerative charging.' },
    'voltage_range': { group: 'Voltage', name: 'VOLTAGE RANGE', formula: 'max(V) - min(V)', desc: 'Total terminal voltage oscillation reflecting overall cell polarization.' },

    // Temperature
    'temperature_mean': { group: 'Temperature', name: 'TEMPERATURE MEAN', formula: 'mean(T_t)', desc: 'Average operating temperature; primary accelerator of solid-electrolyte interphase growth.' },
    'temperature_std': { group: 'Temperature', name: 'TEMPERATURE STD', formula: 'std(T_t)', desc: 'Thermal fluctuation magnitude indicating non-uniform thermal dissipation.' },
    'temperature_min': { group: 'Temperature', name: 'TEMPERATURE MIN', formula: 'min(T_t)', desc: 'Ambient resting baseline temperature.' },
    'temperature_max': { group: 'Temperature', name: 'TEMPERATURE MAX', formula: 'max(T_t)', desc: 'Peak surface temperature reached under sustained high load.' },
    'temperature_range': { group: 'Temperature', name: 'TEMPERATURE RANGE', formula: 'max(T) - min(T)', desc: 'Thermal excursion breadth throughout the randomized cycle.' },

    // Operational & Throughput
    'rw_steps': { group: 'Operational', name: 'RANDOM WALK STEPS', formula: 'count(steps)', desc: 'Number of individual random current profile segments between reference cycles.' },
    'rw_samples': { group: 'Operational', name: 'SAMPLE COUNT', formula: 'count(records)', desc: 'Total high-frequency time-series measurements collected during the interval.' },
    'rw_duration_s': { group: 'Operational', name: 'TOTAL DURATION', formula: 'sum(Δt_s)', desc: 'Total elapsed physical operating time in seconds.' },
    'charge_throughput_ah': { group: 'Operational', name: 'CHARGE THROUGHPUT', formula: '∫ I_charge dt', desc: 'Total electric charge (Ah) inserted into the cell during randomized intervals.' },
    'discharge_throughput_ah': { group: 'Operational', name: 'DISCHARGE THROUGHPUT', formula: '∫ |I_discharge| dt', desc: 'Total electric charge (Ah) extracted from the cell during randomized intervals.' },
    'cycle_index': { group: 'Operational', name: 'CYCLE INDEX', formula: 'cumulative_count', desc: 'Sequential index of the reference cycle along the battery lifetime progression.' }
  };

  const selectedFeature = featureCatalog[activeFeatureKey] || featureCatalog['current_range'];

  const groups = [
    { title: 'Current Statistics', features: ['current_mean', 'current_std', 'current_min', 'current_max', 'current_range', 'abs_current_mean'] },
    { title: 'Voltage Statistics', features: ['voltage_mean', 'voltage_std', 'voltage_min', 'voltage_max', 'voltage_range'] },
    { title: 'Temperature Statistics', features: ['temperature_mean', 'temperature_std', 'temperature_min', 'temperature_max', 'temperature_range'] },
    { title: 'Operational & Throughput', features: ['rw_steps', 'rw_samples', 'rw_duration_s', 'charge_throughput_ah', 'discharge_throughput_ah', 'cycle_index'] }
  ];

  return (
    <section id="features" className="relative py-28 px-6 max-w-7xl mx-auto border-t border-[#1B2028]">
      
      <div className="space-y-4 max-w-3xl mb-16">
        <div className="flex items-center space-x-2 font-mono text-xs tracking-widest text-[#00F0FF] uppercase">
          <span className="w-4 h-[1px] bg-[#00F0FF]" />
          <span>FEATURE ENGINEERING</span>
        </div>

        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#F8FAFC] leading-[1.0]">
          23 COMPACT<br />
          OPERATING DESCRIPTORS.
        </h2>

        <p className="text-sm text-[#94A3B8] leading-relaxed pt-2">
          Rather than feeding gigabytes of raw time-series directly into black-box sequence models, we compress randomized intervals into 23 physics-motivated statistical features.
        </p>
      </div>

      {/* Feature Explorer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Columns: Grouped Feature Tags */}
        <div className="lg:col-span-7 space-y-6">
          {groups.map((g) => (
            <div key={g.title} className="border border-[#1B2028] bg-[#090A0D]/70 p-5 rounded-sm space-y-3">
              <div className="font-mono text-[11px] tracking-wider text-[#64748B] uppercase flex items-center justify-between">
                <span>{g.title}</span>
                <span className="text-[#00F0FF]">{g.features.length} FEATURES</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {g.features.map((fKey) => {
                  const item = featureCatalog[fKey];
                  const isSelected = activeFeatureKey === fKey;
                  return (
                    <button
                      key={fKey}
                      onClick={() => setActiveFeatureKey(fKey)}
                      className={`text-left p-2.5 rounded-sm font-mono text-xs transition-all border ${
                        isSelected
                          ? 'border-[#00F0FF] bg-[#00F0FF]/15 text-[#00F0FF] font-semibold'
                          : 'border-[#1B2028] bg-[#0D0F13] text-[#94A3B8] hover:text-[#CBD5E1] hover:border-[#2C3440]'
                      }`}
                    >
                      <div className="text-[10px] text-[#64748B] truncate">{item.formula}</div>
                      <div className="font-medium truncate mt-0.5">{item.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Selected Feature Detail Card */}
        <div className="lg:col-span-5 sticky top-28">
          <div className="border border-[#00F0FF]/40 bg-[#0D0F13] p-6 sm:p-8 rounded-sm space-y-6 shadow-[0_0_30px_rgba(0,240,255,0.05)]">
            
            <div className="flex items-center justify-between border-b border-[#1B2028] pb-4">
              <span className="font-mono text-[10px] text-[#00F0FF] tracking-widest uppercase">
                {selectedFeature.group} FEATURE INSPECTOR
              </span>
              <span className="font-mono text-xs bg-[#050607] px-2.5 py-1 rounded text-[#94A3B8] border border-[#1B2028]">
                {selectedFeature.formula}
              </span>
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-bold tracking-tight text-[#F8FAFC]">
                {selectedFeature.name}
              </h3>
              <p className="text-sm text-[#CBD5E1] leading-relaxed">
                {selectedFeature.desc}
              </p>
            </div>

            <div className="border-t border-[#1B2028] pt-4 space-y-3 font-mono text-xs">
              <div className="flex justify-between text-[#64748B]">
                <span>FEATURE GROUP:</span>
                <span className="text-[#CBD5E1]">{selectedFeature.group}</span>
              </div>
              <div className="flex justify-between text-[#64748B]">
                <span>SCALING METHOD:</span>
                <span className="text-[#00F0FF]">RobustScaler (IQR-based)</span>
              </div>
              <div className="flex justify-between text-[#64748B]">
                <span>IMPUTATION:</span>
                <span className="text-[#CBD5E1]">Median (Train-Fit Only)</span>
              </div>
            </div>

            <div className="p-4 bg-[#050607] border border-[#1B2028] rounded-sm text-[11px] font-mono text-[#94A3B8]">
              💡 <span className="text-[#00F0FF]">Physical Insight:</span> Summarizing intervals into statistical moments preserves the variance of dynamic EV loads without requiring gigabytes of sequential memory.
            </div>

          </div>
        </div>

      </div>

    </section>
  );
};
