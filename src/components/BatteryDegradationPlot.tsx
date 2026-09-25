import React, { useState, useMemo } from 'react';
import { BatteryTrajectory, MeanTrajectoryPoint } from '../types/research';
import { TrendingDown, Eye, Activity, Filter, Info } from 'lucide-react';

interface BatteryDegradationPlotProps {
  trajectories: BatteryTrajectory[];
  meanTrajectory: MeanTrajectoryPoint[];
  meanSlope: number;
}

export const BatteryDegradationPlot: React.FC<BatteryDegradationPlotProps> = ({
  trajectories,
  meanTrajectory,
  meanSlope
}) => {
  const [hoveredBatteryId, setHoveredBatteryId] = useState<string | null>(null);
  const [selectedBatteryId, setSelectedBatteryId] = useState<string | null>(null);
  const [showMean, setShowMean] = useState<boolean>(true);
  const [showAllLines, setShowAllLines] = useState<boolean>(true);

  // Determine Max Cycles and SoH range for scaling
  const maxCycles = useMemo(() => {
    let maxC = 40;
    trajectories.forEach((t) => {
      t.cycles.forEach((c) => {
        if (c.cycle_index > maxC) maxC = c.cycle_index;
      });
    });
    return maxC;
  }, [trajectories]);

  const minSoH = 50;
  const maxSoH = 105;

  const svgWidth = 800;
  const svgHeight = 420;
  const padding = { top: 30, right: 30, bottom: 45, left: 55 };
  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;

  const scaleX = (cycle: number) => padding.left + ((cycle - 1) / (maxCycles - 1)) * plotWidth;
  const scaleY = (soh: number) => padding.top + ((maxSoH - soh) / (maxSoH - minSoH)) * plotHeight;

  // Generate SVG Path string for a series of cycles
  const createPath = (cycles: Array<{ cycle_index: number; soh: number }>) => {
    if (cycles.length === 0) return '';
    return cycles
      .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(pt.cycle_index)} ${scaleY(pt.soh)}`)
      .join(' ');
  };

  const activeBattery = useMemo(() => {
    const targetId = hoveredBatteryId || selectedBatteryId;
    if (!targetId) return null;
    return trajectories.find((t) => t.battery_id === targetId) || null;
  }, [hoveredBatteryId, selectedBatteryId, trajectories]);

  return (
    <section className="relative py-28 px-6 max-w-7xl mx-auto border-t border-[#1B2028]">
      
      {/* Section Title */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
        <div className="space-y-3 max-w-3xl">
          <div className="flex items-center space-x-2 font-mono text-xs tracking-widest text-[#00F0FF] uppercase">
            <span className="w-4 h-[1px] bg-[#00F0FF]" />
            <span>OBSERVED DEGRADATION PHENOMENON</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#F8FAFC] leading-[1.0]">
            BATTERY HEALTH<br />
            UNDER RANDOMIZED USE.
          </h2>

          <p className="text-sm text-[#94A3B8] leading-relaxed pt-1">
            Empirical degradation curves across 12 NASA lithium-ion battery cells. Notice the non-linear capacity drop and battery-to-battery variance under randomized dynamic loads.
          </p>
        </div>

        {/* Global Trajectory Stats Badge */}
        <div className="border border-[#1B2028] bg-[#090A0D] p-4 rounded-sm font-mono text-xs space-y-1 shrink-0">
          <div className="text-[#64748B] text-[10px] uppercase">MEAN DEGRADATION SLOPE</div>
          <div className="text-xl font-bold text-rose-400">
            {meanSlope.toFixed(4)}
            <span className="text-xs text-[#94A3B8] ml-1 font-normal">% SoH / Cycle</span>
          </div>
          <div className="text-[10px] text-[#64748B]">Linear rate across all observed units</div>
        </div>
      </div>

      {/* Main Interactive Graph Container */}
      <div className="border border-[#1B2028] bg-[#090A0D] p-6 sm:p-8 rounded-sm space-y-6">
        
        {/* Graph Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1B2028] pb-4 font-mono text-xs">
          
          {/* Toggles */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowMean(!showMean)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-sm border transition-colors ${
                showMean
                  ? 'border-[#00F0FF] bg-[#00F0FF]/15 text-[#00F0FF]'
                  : 'border-[#1B2028] text-[#64748B] hover:text-[#CBD5E1]'
              }`}
            >
              <div className="w-2.5 h-[2px] bg-[#00F0FF]" />
              <span>MEAN TRAJECTORY</span>
            </button>

            <button
              onClick={() => setShowAllLines(!showAllLines)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-sm border transition-colors ${
                showAllLines
                  ? 'border-[#2C3440] bg-[#14181F] text-[#CBD5E1]'
                  : 'border-[#1B2028] text-[#64748B] hover:text-[#CBD5E1]'
              }`}
            >
              <span>ALL 12 CELLS</span>
            </button>
          </div>

          {/* Quick Cell Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-[#64748B]">Highlight:</span>
            <select
              value={selectedBatteryId || ''}
              onChange={(e) => setSelectedBatteryId(e.target.value || null)}
              className="bg-[#050607] border border-[#1B2028] text-[#CBD5E1] px-2.5 py-1 rounded-sm focus:border-[#00F0FF] outline-none"
            >
              <option value="">Hover to inspect (or select)</option>
              {trajectories.map((t) => (
                <option key={t.battery_id} value={t.battery_id}>
                  {t.battery_id} ({t.cycles_count} cycles, Final SoH: {t.final_soh.toFixed(1)}%)
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* SVG Chart */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[650px]">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full bg-[#050607] border border-[#1B2028] rounded-sm select-none">
              
              {/* Y-Axis Horizontal Grid Lines */}
              {[100, 90, 80, 70, 60].map((soh) => {
                const y = scaleY(soh);
                return (
                  <g key={soh} className="font-mono text-[10px] fill-[#64748B]">
                    <line x1={padding.left} y1={y} x2={svgWidth - padding.right} y2={y} stroke="#14181F" strokeWidth="1" strokeDasharray="2,2" />
                    <text x={padding.left - 10} y={y + 3} textAnchor="end">{soh}%</text>
                  </g>
                );
              })}

              {/* X-Axis Vertical Grid Lines */}
              {[1, 5, 10, 15, 20, 25, 30, 35, 40].map((c) => {
                const x = scaleX(c);
                return (
                  <g key={c} className="font-mono text-[10px] fill-[#64748B]">
                    <line x1={x} y1={padding.top} x2={x} y2={svgHeight - padding.bottom} stroke="#14181F" strokeWidth="1" strokeDasharray="2,2" />
                    <text x={x} y={svgHeight - padding.bottom + 18} textAnchor="middle">#{c}</text>
                  </g>
                );
              })}

              {/* Individual Battery Trajectories */}
              {showAllLines && trajectories.map((traj) => {
                const isHovered = hoveredBatteryId === traj.battery_id || selectedBatteryId === traj.battery_id;
                const isDimmed = (hoveredBatteryId || selectedBatteryId) && !isHovered;
                const pathStr = createPath(traj.cycles);

                return (
                  <g 
                    key={traj.battery_id}
                    onMouseEnter={() => setHoveredBatteryId(traj.battery_id)}
                    onMouseLeave={() => setHoveredBatteryId(null)}
                    onClick={() => setSelectedBatteryId(selectedBatteryId === traj.battery_id ? null : traj.battery_id)}
                    className="cursor-pointer"
                  >
                    {/* Wider transparent stroke for easier hover hit testing */}
                    <path
                      d={pathStr}
                      fill="none"
                      stroke="transparent"
                      strokeWidth={14}
                    />
                    
                    {/* Visual Line */}
                    <path
                      d={pathStr}
                      fill="none"
                      stroke={isHovered ? '#00F0FF' : isDimmed ? 'rgba(100, 116, 139, 0.15)' : 'rgba(148, 163, 184, 0.45)'}
                      strokeWidth={isHovered ? 2.5 : 1}
                      className="transition-all duration-300"
                    />

                    {/* Final Cycle End Dot */}
                    {traj.cycles.length > 0 && (
                      <circle
                        cx={scaleX(traj.cycles[traj.cycles.length - 1].cycle_index)}
                        cy={scaleY(traj.cycles[traj.cycles.length - 1].soh)}
                        r={isHovered ? 4 : 2}
                        fill={isHovered ? '#00F0FF' : '#64748B'}
                      />
                    )}
                  </g>
                );
              })}

              {/* Mean Trajectory Curve */}
              {showMean && meanTrajectory.length > 0 && (
                <g>
                  <path
                    d={meanTrajectory.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(pt.cycle_index)} ${scaleY(pt.mean_soh)}`).join(' ')}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                  />
                  {meanTrajectory.map((pt, i) => (
                    <circle
                      key={i}
                      cx={scaleX(pt.cycle_index)}
                      cy={scaleY(pt.mean_soh)}
                      r={2.5}
                      fill="#FFFFFF"
                    />
                  ))}
                </g>
              )}

              {/* Axis Titles */}
              <text
                x={svgWidth / 2}
                y={svgHeight - 8}
                textAnchor="middle"
                fill="#94A3B8"
                className="font-mono text-[11px] uppercase tracking-wider font-semibold"
              >
                Reference Cycle Progression (Life Progression Index)
              </text>
              <text
                x={-svgHeight / 2}
                y={15}
                transform="rotate(-90)"
                textAnchor="middle"
                fill="#94A3B8"
                className="font-mono text-[11px] uppercase tracking-wider font-semibold"
              >
                State of Health (% of Initial Capacity)
              </text>
            </svg>
          </div>
        </div>

        {/* Selected / Hovered Battery Telemetry Drawer */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-[#050607] border border-[#1B2028] rounded-sm font-mono text-xs">
          <div>
            <div className="text-[10px] text-[#64748B]">SELECTED UNIT</div>
            <div className="text-sm font-bold text-[#00F0FF] mt-0.5">
              {activeBattery ? activeBattery.battery_id : 'GLOBAL FLEET'}
            </div>
          </div>

          <div>
            <div className="text-[10px] text-[#64748B]">INITIAL CAPACITY</div>
            <div className="text-sm font-semibold text-[#CBD5E1] mt-0.5">
              {activeBattery ? `${activeBattery.initial_capacity_ah.toFixed(3)} Ah` : '2.100 Ah (Nominal)'}
            </div>
          </div>

          <div>
            <div className="text-[10px] text-[#64748B]">FINAL RECORDED SOH</div>
            <div className="text-sm font-semibold text-[#CBD5E1] mt-0.5">
              {activeBattery ? `${activeBattery.final_soh.toFixed(2)}%` : '62.4% - 84.1%'}
            </div>
          </div>

          <div>
            <div className="text-[10px] text-[#64748B]">ESTIMATED DEGRADATION SLOPE</div>
            <div className="text-sm font-semibold text-rose-400 mt-0.5">
              {activeBattery && activeBattery.slope ? `${activeBattery.slope.toFixed(4)} % / cyc` : `${meanSlope.toFixed(4)} % / cyc`}
            </div>
          </div>
        </div>

      </div>

    </section>
  );
};
