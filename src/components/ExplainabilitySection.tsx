import React, { useState } from 'react';
import { FeatureImportance, ShapFeature } from '../types/research';
import { HelpCircle, BarChart3, PieChart, ShieldAlert, Sparkles } from 'lucide-react';

interface ExplainabilitySectionProps {
  topFeatures: FeatureImportance[];
  shapFeatures: ShapFeature[];
}

export const ExplainabilitySection: React.FC<ExplainabilitySectionProps> = ({
  topFeatures,
  shapFeatures
}) => {
  const [activeTab, setActiveTab] = useState<'perm' | 'shap'>('perm');
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  // Interpretation map for top features (strictly non-causal)
  const interpretations: Record<string, string> = {
    'cycle_index': 'The model relied heavily on sequential lifetime progression as the primary degradation anchor.',
    'rw_duration_s': 'The model assigned strong predictive weight to total random-walk exposure time between reference cycles.',
    'temperature_std': 'The model utilized thermal volatility as an indicator of uneven heat dissipation during random loads.',
    'temperature_min': 'The model factored resting thermal conditions into electrochemical resistance estimations.',
    'current_mean': 'The model leveraged net directional current offset during randomized charging/discharging.',
    'temperature_range': 'The model used peak-to-trough thermal excursion breadth as a marker of high dynamic load.',
    'voltage_range': 'The model factored terminal voltage oscillation into polarization and internal resistance checks.',
    'discharge_throughput_ah': 'The model utilized cumulative discharge Ah as a measure of active material extraction.',
    'charge_throughput_ah': 'The model tracked cumulative regenerative charge energy delivered into the cell.',
    'abs_current_mean': 'The model relied on overall current intensity magnitude to capture aggregate electrochemical stress.'
  };

  const maxPermImportance = topFeatures.length > 0 ? Math.max(...topFeatures.map((f) => f.importance)) : 1;
  const maxShapImportance = shapFeatures.length > 0 ? Math.max(...shapFeatures.map((f) => f.mean_abs_shap)) : 1;

  return (
    <section id="explainability" className="relative py-28 px-6 max-w-7xl mx-auto border-t border-[#1B2028]">
      
      {/* Section Header */}
      <div className="space-y-4 max-w-3xl mb-16">
        <div className="flex items-center space-x-2 font-mono text-xs tracking-widest text-[#00F0FF] uppercase">
          <span className="w-4 h-[1px] bg-[#00F0FF]" />
          <span>05 / MODEL-AGNOSTIC EXPLAINABILITY</span>
        </div>

        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#F8FAFC] leading-[1.0]">
          WHY DID THE MODEL<br />
          MAKE THAT PREDICTION?
        </h2>

        <p className="text-sm text-[#94A3B8] leading-relaxed pt-2">
          Model-agnostic permutation importance and Tree SHAP reveal which operational variables the regression model prioritized during inference.
        </p>
      </div>

      {/* Main Explainability Container */}
      <div className="border border-[#1B2028] bg-[#090A0D] p-6 sm:p-8 rounded-sm space-y-8">
        
        {/* Tab Selector & Caution Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1B2028] pb-4">
          <div className="flex items-center space-x-2 font-mono text-xs">
            <button
              onClick={() => setActiveTab('perm')}
              className={`px-4 py-2 rounded-sm border transition-colors ${
                activeTab === 'perm'
                  ? 'border-[#00F0FF] bg-[#00F0FF]/15 text-[#00F0FF] font-semibold'
                  : 'border-[#1B2028] text-[#64748B] hover:text-[#CBD5E1]'
              }`}
            >
              PERMUTATION IMPORTANCE (GLOBAL)
            </button>

            <button
              onClick={() => setActiveTab('shap')}
              className={`px-4 py-2 rounded-sm border transition-colors ${
                activeTab === 'shap'
                  ? 'border-[#00F0FF] bg-[#00F0FF]/15 text-[#00F0FF] font-semibold'
                  : 'border-[#1B2028] text-[#64748B] hover:text-[#CBD5E1]'
              }`}
            >
              SHAP SUMMARY (ATTRIBUTION)
            </button>
          </div>

          <div className="font-mono text-[10px] text-amber-400/90 bg-[#050607] px-3 py-1.5 border border-amber-500/20 rounded">
            ⚠️ Methodological constraint: Demonstrates feature reliance, not biological/electrochemical causation.
          </div>
        </div>

        {/* Feature Bars & Live Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Horizontal Bar Chart */}
          <div className="lg:col-span-7 space-y-3 font-mono text-xs">
            {activeTab === 'perm' ? (
              topFeatures.slice(0, 10).map((f) => {
                const pct = (f.importance / maxPermImportance) * 100;
                const isHovered = hoveredFeature === f.feature;

                return (
                  <div
                    key={f.feature}
                    onMouseEnter={() => setHoveredFeature(f.feature)}
                    onMouseLeave={() => setHoveredFeature(null)}
                    className={`p-3 border rounded-sm transition-all duration-200 cursor-pointer ${
                      isHovered
                        ? 'border-[#00F0FF] bg-[#0D0F13] shadow-[0_0_15px_rgba(0,240,255,0.08)]'
                        : 'border-[#1B2028] bg-[#050607] hover:border-[#2C3440]'
                    }`}
                  >
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className={`font-semibold ${isHovered ? 'text-[#00F0FF]' : 'text-[#F8FAFC]'}`}>
                        {f.feature}
                      </span>
                      <span className="text-[#64748B]">
                        Δ RMSE: <strong className="text-[#CBD5E1]">{f.importance.toFixed(4)}</strong>
                      </span>
                    </div>

                    <div className="w-full h-2 bg-[#14181F] rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          isHovered ? 'bg-[#00F0FF]' : 'bg-[#38BDF8]/70'
                        }`}
                        style={{ width: `${Math.max(pct, 2)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              shapFeatures.slice(0, 10).map((f) => {
                const pct = (f.mean_abs_shap / maxShapImportance) * 100;
                const isHovered = hoveredFeature === f.feature;

                return (
                  <div
                    key={f.feature}
                    onMouseEnter={() => setHoveredFeature(f.feature)}
                    onMouseLeave={() => setHoveredFeature(null)}
                    className={`p-3 border rounded-sm transition-all duration-200 cursor-pointer ${
                      isHovered
                        ? 'border-[#00F0FF] bg-[#0D0F13] shadow-[0_0_15px_rgba(0,240,255,0.08)]'
                        : 'border-[#1B2028] bg-[#050607] hover:border-[#2C3440]'
                    }`}
                  >
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className={`font-semibold ${isHovered ? 'text-[#00F0FF]' : 'text-[#F8FAFC]'}`}>
                        {f.feature}
                      </span>
                      <span className="text-[#64748B]">
                        mean(|SHAP|): <strong className="text-[#CBD5E1]">{f.mean_abs_shap.toFixed(4)}</strong>
                      </span>
                    </div>

                    <div className="w-full h-2 bg-[#14181F] rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          isHovered ? 'bg-[#00F0FF]' : 'bg-emerald-400/80'
                        }`}
                        style={{ width: `${Math.max(pct, 2)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right: Non-Causal Feature Interpretation Panel */}
          <div className="lg:col-span-5 sticky top-28 space-y-4">
            <div className="border border-[#1B2028] bg-[#050607] p-6 rounded-sm space-y-4">
              <div className="flex items-center justify-between font-mono text-[10px] text-[#64748B] border-b border-[#1B2028] pb-3">
                <span>MODEL ATTRIBUTION INTERPRETATION</span>
                <span className="text-[#00F0FF]">
                  {hoveredFeature ? 'INSPECTING' : 'HOVER A FEATURE'}
                </span>
              </div>

              {hoveredFeature ? (
                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-[#64748B]">FEATURE NAME</span>
                    <h4 className="text-lg font-bold text-[#00F0FF]">{hoveredFeature}</h4>
                  </div>

                  <div className="pt-2 border-t border-[#1B2028]">
                    <span className="text-[10px] text-[#64748B]">FORMAL INTERPRETATION</span>
                    <p className="text-xs text-[#CBD5E1] font-sans leading-relaxed mt-1">
                      {interpretations[hoveredFeature] ||
                        `The model relied more heavily on ${hoveredFeature} when computing individual prediction boundaries.`}
                    </p>
                  </div>

                  <div className="p-3 bg-[#0D0F13] border border-[#1B2028] rounded text-[11px] text-[#94A3B8]">
                    Scientific note: Avoids causal claims; reflects empirical sensitivity across the NASA dataset.
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 font-mono text-xs text-[#64748B] space-y-2">
                  <BarChart3 className="w-6 h-6 mx-auto opacity-30 text-[#00F0FF]" />
                  <p>Hover over any operating feature to inspect how the regression model utilized it.</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-[#0D0F13] border border-[#1B2028] rounded font-mono text-xs text-[#94A3B8] leading-relaxed">
              🔍 <strong className="text-[#F8FAFC]">Key Insight:</strong> Beyond <code className="text-[#00F0FF]">cycle_index</code>, cumulative duration (<code className="text-[#00F0FF]">rw_duration_s</code>) and thermal volatility (<code className="text-[#00F0FF]">temperature_std</code>, <code className="text-[#00F0FF]">temperature_min</code>) were the highest-ranked operating-history signals.
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};
