import React, { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { ModelMetric } from '../types/research';

interface ModelComparisonTableProps {
  models: ModelMetric[];
  selectedModelName: string;
}

export const ModelComparisonTable: React.FC<ModelComparisonTableProps> = ({
  models,
  selectedModelName
}) => {
  const [sortField, setSortField] = useState<'mae' | 'rmse' | 'r2'>('rmse');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const handleSort = (field: 'mae' | 'rmse' | 'r2') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      // For R2 default to descending (higher is better), for errors default to ascending (lower is better)
      setSortAsc(field !== 'r2');
    }
  };

  const sortedModels = [...models].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    return sortAsc ? valA - valB : valB - valA;
  });

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1B2028] pb-4">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-[#F8FAFC]">
            Model Performance Comparison
          </h3>
          <p className="text-xs font-mono text-[#64748B] mt-0.5">
            Random 80/20 train/test partition • Median Imputation & Robust Scaling
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs text-[#94A3B8]">
          <span className="text-[#64748B]">Sort by:</span>
          {(['rmse', 'mae', 'r2'] as const).map((field) => (
            <button
              key={field}
              onClick={() => handleSort(field)}
              className={`px-2.5 py-1 rounded-sm border uppercase text-[10px] transition-colors ${
                sortField === field
                  ? 'border-[#00F0FF] bg-[#00F0FF]/10 text-[#00F0FF]'
                  : 'border-[#1B2028] text-[#94A3B8] hover:text-[#CBD5E1]'
              }`}
            >
              {field} {sortField === field && (sortAsc ? '↑' : '↓')}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto border border-[#1B2028] bg-[#090A0D] rounded-sm">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-[#1B2028] bg-[#050607]/80 text-[#64748B] text-[10px] tracking-wider uppercase">
              <th className="py-4 px-6 font-semibold">MODEL ARCHITECTURE</th>
              <th 
                onClick={() => handleSort('mae')}
                className="py-4 px-6 font-semibold cursor-pointer hover:text-[#F8FAFC]"
              >
                <div className="flex items-center space-x-1.5">
                  <span>MAE (%)</span>
                  {sortField === 'mae' ? (sortAsc ? <ArrowUp className="w-3 h-3 text-[#00F0FF]" /> : <ArrowDown className="w-3 h-3 text-[#00F0FF]" />) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                </div>
              </th>
              <th 
                onClick={() => handleSort('rmse')}
                className="py-4 px-6 font-semibold cursor-pointer hover:text-[#F8FAFC]"
              >
                <div className="flex items-center space-x-1.5">
                  <span>RMSE (%)</span>
                  {sortField === 'rmse' ? (sortAsc ? <ArrowUp className="w-3 h-3 text-[#00F0FF]" /> : <ArrowDown className="w-3 h-3 text-[#00F0FF]" />) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                </div>
              </th>
              <th 
                onClick={() => handleSort('r2')}
                className="py-4 px-6 font-semibold cursor-pointer hover:text-[#F8FAFC]"
              >
                <div className="flex items-center space-x-1.5">
                  <span>R² DETERMINATION</span>
                  {sortField === 'r2' ? (sortAsc ? <ArrowUp className="w-3 h-3 text-[#00F0FF]" /> : <ArrowDown className="w-3 h-3 text-[#00F0FF]" />) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                </div>
              </th>
              <th className="py-4 px-6 font-semibold text-right">MODEL TYPE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1B2028]">
            {sortedModels.map((m) => {
              const isSelected = m.name === selectedModelName;
              return (
                <tr
                  key={m.name}
                  className={`transition-colors ${
                    isSelected
                      ? 'bg-[#00F0FF]/5 hover:bg-[#00F0FF]/10 text-[#F8FAFC]'
                      : 'hover:bg-[#0D0F13] text-[#CBD5E1]'
                  }`}
                >
                  <td className="py-4 px-6 font-sans">
                    <div className="flex items-center space-x-3">
                      {isSelected ? (
                        <div className="w-1.5 h-1.5 bg-[#00F0FF] rounded-full" />
                      ) : (
                        <div className="w-1.5 h-1.5 bg-transparent rounded-full" />
                      )}
                      <span className={`text-sm font-semibold tracking-tight ${isSelected ? 'text-[#00F0FF]' : 'text-[#F8FAFC]'}`}>
                        {m.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-mono text-xs">
                    {m.mae.toFixed(4)}
                  </td>
                  <td className="py-4 px-6 font-mono text-xs font-semibold">
                    <span className={isSelected ? 'text-[#00F0FF]' : ''}>
                      {m.rmse.toFixed(4)}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-mono text-xs">
                    <span className={m.r2 > 0.95 ? 'text-[#00F0FF]' : m.r2 > 0.90 ? 'text-[#CBD5E1]' : 'text-[#94A3B8]'}>
                      {m.r2.toFixed(4)}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-mono text-[10px] text-[#64748B] text-right uppercase">
                    {m.name.includes('Forest') || m.name.includes('Trees') || m.name.includes('Boosting') ? 'Ensemble' : 'Linear'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="text-[11px] font-mono text-[#64748B] flex items-center justify-between">
        <span>* Lower MAE & RMSE indicate higher estimation precision.</span>
        <span>• Highlight indicates selected model ({selectedModelName})</span>
      </div>

    </div>
  );
};
