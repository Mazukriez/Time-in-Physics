import React from 'react';
import { SimulationTab } from '../types';
import heroImg from '../assets/images/hero_spacetime_curvature_1791005474908.jpg';

interface HeroProps {
  onSelectTab: (tab: SimulationTab) => void;
}

export const Hero: React.FC<HeroProps> = ({ onSelectTab }) => {
  return (
    <section className="relative overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-[#0B0F19] to-[#080B11] py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Main Editorial Text (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-amber-400">
                Physics & Human Consciousness Laboratory
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-100 leading-tight">
                Does time actually flow, or is flow an illusion of consciousness?
              </h1>
            </div>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              In modern physics, time is neither absolute nor universal. Special relativity proves that
              simultaneity is relative; general relativity proves gravity bends the ticking of clocks;
              and thermodynamics defines an irreversible arrow from disorder. Yet in human experience,
              time is an intimate, elastic river shaped by attention, memory, and neural oscillations.
            </p>

            {/* Empirical Grounding Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-slate-800/70">
              <div>
                <div className="text-xs text-slate-400 font-medium">GPS Net Drift</div>
                <div className="text-xl sm:text-2xl font-mono font-bold text-amber-400 tabular-nums">
                  +38.6 <span className="text-xs text-slate-400 font-normal">μs/day</span>
                </div>
                <div className="text-[11px] text-slate-500">GR +45.7 vs SR -7.1</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Muon Dilation</div>
                <div className="text-xl sm:text-2xl font-mono font-bold text-cyan-400 tabular-nums">
                  9.0× <span className="text-xs text-slate-400 font-normal">lifetime</span>
                </div>
                <div className="text-[11px] text-slate-500">Reaches Earth at 0.994c</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Cosmic Arrow</div>
                <div className="text-xl sm:text-2xl font-mono font-bold text-amber-300 tabular-nums">
                  ΔS ≥ 0
                </div>
                <div className="text-[11px] text-slate-500">2nd Law of Thermodynamics</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Human "Now"</div>
                <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-400 tabular-nums">
                  ~2.5 <span className="text-xs text-slate-400 font-normal">seconds</span>
                </div>
                <div className="text-[11px] text-slate-500">The Specious Present</div>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onSelectTab('relativity')}
                className="px-5 py-2.5 rounded-lg bg-amber-500 text-slate-950 font-semibold text-sm hover:bg-amber-400 transition-colors cursor-pointer shadow-sm shadow-amber-500/10"
              >
                Explore Einstein Light Clock
              </button>
              <button
                onClick={() => onSelectTab('entropy')}
                className="px-5 py-2.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 font-medium text-sm hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Thermodynamic Arrow
              </button>
              <button
                onClick={() => onSelectTab('ai-prover')}
                className="px-5 py-2.5 rounded-lg bg-cyan-950 text-cyan-200 border border-cyan-800/60 font-medium text-sm hover:bg-cyan-900/60 transition-colors cursor-pointer"
              >
                AI Proof Engine
              </button>
            </div>
          </div>

          {/* High-Fidelity Scientific Artwork (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900/60 shadow-xl group">
              <img
                src={heroImg}
                alt="Four-dimensional spacetime fabric curved by mass with light geodesics and coordinate grid"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  // Fallback container
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080B11] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-3 left-4 right-4 text-xs text-slate-300">
                <span className="font-semibold text-amber-200">Minkowski Metric:</span> ds² = -c²dt² + dx² + dy² + dz²
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Spacetime interval ds is invariant for all observers regardless of velocity.
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
