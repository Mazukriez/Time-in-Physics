import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#06080E] text-slate-400 py-10 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="font-display text-base font-bold text-amber-100">Chronos</span>
            <p className="text-slate-500 text-[11px] mt-0.5">
              Empirical and philosophical laboratory for the physics and conscious perception of time.
            </p>
          </div>

          {/* Physical Constants Table */}
          <div className="flex flex-wrap gap-4 text-[11px] font-mono text-slate-400">
            <div>
              <span className="text-slate-500">c:</span> 299,792,458 m/s
            </div>
            <div>
              <span className="text-slate-500">G:</span> 6.6743 × 10⁻¹¹ m³·kg⁻¹·s⁻²
            </div>
            <div>
              <span className="text-slate-500">k_B:</span> 1.380649 × 10⁻²³ J/K
            </div>
            <div>
              <span className="text-slate-500">t_P:</span> 5.391247 × 10⁻⁴⁴ s
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <div>
            Grounded in Special Relativity, General Relativity, Boltzmann Statistical Mechanics & Cognitive Psychophysics.
          </div>
          <div>
            Powered by Google Gemini 3.8 Flash
          </div>
        </div>
      </div>
    </footer>
  );
};
