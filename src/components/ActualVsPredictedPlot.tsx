import React, { useState, useMemo } from 'react';
import { ActualVsPredictedPoint } from '../types/research';
import { Activity, Target, Filter } from 'lucide-react';

interface ActualVsPredictedPlotProps {
  points: ActualVsPredictedPoint[];
}

export const ActualVsPredictedPlot: React.FC<ActualVsPredictedPlotProps> = ({ points }) => {
  const [selectedBattery, setSelectedBattery] = useState<string>('ALL');
  const [hoveredPoint, setHoveredPoint] = useState<ActualVsPredictedPoint | null>(null);

  const batteries = useMemo(() => {
    const list = Array.from(new Set(points.map((p) => p.battery_id))).sort();
    return ['ALL', ...list];
  }, [points]);

  const filteredPoints = useMemo(() => {
    if (selectedBattery === 'ALL') return points;
    return points.filter((p) => p.battery_id === selectedBattery);
  }, [points, selectedBattery]);

  // Bounds
  const minVal = 60;
  const maxVal = 105;
  const svgSize = 560;
  const padding = 50;
  const plotWidth = svgSize - padding * 2;
  const plotHeight = svgSize - padding * 2;

  const scaleX = (val: number) => padding + ((val - minVal) / (maxVal - minVal)) * plotWidth;
  const scaleY = (val: number) => svgSize - padding - ((val - minVal) / (maxVal - minVal)) * plotHeight;

  return (
    <div className="border border-[#1B2028] bg-[#090A0D] p-6 sm:p-8 rounded-sm space-y-6">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1B2028] pb-4">
        <div>
          <div className="font-mono text-xs text-[#00F0FF] tracking-wider uppercase">
            REGRESSION FIDELITY SCATTER
          </div>
          <h3 className="text-xl font-bold text-[#F8FAFC]">
            Actual vs. Predicted SoH (%)
          </h3>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <Filter className="w-3.5 h-3.5 text-[#64748B]" />
          <span className="text-[#64748B]">Cell:</span>
          <select
            value={selectedBattery}
            onChange={(e) => setSelectedBattery(e.target.value)}
            className="bg-[#050607] border border-[#1B2028] text-[#CBD5E1] px-2.5 py-1 rounded-sm focus:border-[#00F0FF] outline-none"
          >
            {batteries.map((b) => (
              <option key={b} value={b}>
                {b === 'ALL' ? 'All Test Cells' : b}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* SVG Scatter Plot */}
        <div className="lg:col-span-8 flex justify-center">
          <div className="relative w-full max-w-[560px] aspect-square">
            <svg 
              viewBox={`0 0 ${svgSize} ${svgSize}`} 
              className="w-full h-full bg-[#050607] border border-[#1B2028] rounded-sm select-none"
            >
              {/* Grid Lines */}
              {[60, 70, 80, 90, 100].map((tick) => {
                const x = scaleX(tick);
                const y = scaleY(tick);
                return (
                  <g key={tick} className="font-mono text-[10px] fill-[#64748B]">
                    <line x1={x} y1={padding} x2={x} y2={svgSize - padding} stroke="#1B2028" strokeWidth="1" strokeDasharray="2,2" />
                    <line x1={padding} y1={y} x2={svgSize - padding} y2={y} stroke="#1B2028" strokeWidth="1" strokeDasharray="2,2" />
                    <text x={x} y={svgSize - padding + 18} textAnchor="middle">{tick}%</text>
                    <text x={padding - 10} y={y + 4} textAnchor="end">{tick}%</text>
                  </g>
                );
              })}

              {/* Parity 45-degree Reference Line (y = x) */}
              <line
                x1={scaleX(minVal)}
                y1={scaleY(minVal)}
                x2={scaleX(maxVal)}
                y2={scaleY(maxVal)}
                stroke="rgba(0, 240, 255, 0.4)"
                strokeWidth="1.5"
                strokeDasharray="4,4"
              />
              <text
                x={scaleX(102)}
                y={scaleY(102) - 8}
                fill="#00F0FF"
                className="font-mono text-[9px]"
              >
                1:1 Parity (Ideal)
              </text>

              {/* Data Points */}
              {filteredPoints.map((pt, idx) => {
                const cx = scaleX(pt.actual_soh);
                const cy = scaleY(pt.predicted_soh);
                const isHovered = hoveredPoint === pt;

                return (
                  <g key={idx} onMouseEnter={() => setHoveredPoint(pt)}>
                    {isHovered && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={12}
                        fill="none"
                        stroke="#00F0FF"
                        strokeWidth="1"
                        className="animate-ping"
                      />
                    )}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isHovered ? 6 : 4}
                      fill={isHovered ? '#00F0FF' : '#E2E8F0'}
                      stroke="#050607"
                      strokeWidth="1.5"
                      className="cursor-pointer transition-all duration-200 hover:scale-150"
                    />
                  </g>
                );
              })}

              {/* Axis Labels */}
              <text
                x={svgSize / 2}
                y={svgSize - 8}
                textAnchor="middle"
                fill="#94A3B8"
                className="font-mono text-[11px] font-semibold tracking-wider uppercase"
              >
                Actual Ground-Truth SoH (%)
              </text>
              <text
                x={-svgSize / 2}
                y={14}
                transform="rotate(-90)"
                textAnchor="middle"
                fill="#94A3B8"
                className="font-mono text-[11px] font-semibold tracking-wider uppercase"
              >
                Model Predicted SoH (%)
              </text>
            </svg>
          </div>
        </div>

        {/* Live Hover Inspection Tooltip Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 bg-[#050607] border border-[#1B2028] rounded-sm space-y-4">
            <div className="flex items-center justify-between font-mono text-[10px] text-[#64748B] border-b border-[#1B2028] pb-3">
              <span>POINT TELEMETRY</span>
              <span className="text-[#00F0FF]">
                {hoveredPoint ? 'HOVER ACTIVE' : 'HOVER ANY POINT'}
              </span>
            </div>

            {hoveredPoint ? (
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">BATTERY CELL:</span>
                  <span className="text-[#00F0FF] font-bold">{hoveredPoint.battery_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">CYCLE INDEX:</span>
                  <span className="text-[#F8FAFC]">Cycle #{hoveredPoint.cycle_index}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">ACTUAL SOH:</span>
                  <span className="text-[#CBD5E1] font-semibold">{hoveredPoint.actual_soh.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">PREDICTED SOH:</span>
                  <span className="text-[#00F0FF] font-semibold">{hoveredPoint.predicted_soh.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between border-t border-[#1B2028] pt-2">
                  <span className="text-[#64748B]">RESIDUAL ERROR:</span>
                  <span className={hoveredPoint.abs_error < 2 ? 'text-emerald-400' : 'text-amber-400'}>
                    {hoveredPoint.error > 0 ? '+' : ''}{hoveredPoint.error.toFixed(3)}%
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-xs font-mono text-[#64748B] space-y-2">
                <Activity className="w-6 h-6 mx-auto opacity-30 text-[#00F0FF]" />
                <p>Hover over points on the scatter canvas to inspect individual cycle prediction errors.</p>
              </div>
            )}
          </div>

          <div className="text-[11px] font-mono text-[#64748B] leading-relaxed p-4 bg-[#0D0F13] border border-[#1B2028] rounded">
            📌 <span className="text-[#CBD5E1]">Interpretation:</span> Tight clustering along the dashed 45° diagonal line indicates strong linearity and absence of systematic over- or under-estimation across healthy and degraded states.
          </div>
        </div>

      </div>

    </div>
  );
};
