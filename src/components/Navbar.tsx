import React from 'react';
import { SimulationTab } from '../types';

interface NavbarProps {
  activeTab: SimulationTab;
  setActiveTab: (tab: SimulationTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const navItems: { id: SimulationTab; label: string }[] = [
    { id: 'relativity', label: 'Velocity Dilation' },
    { id: 'gravity-gps', label: 'Gravitational GPS' },
    { id: 'entropy', label: 'Entropy Arrow' },
    { id: 'simultaneity', label: 'Simultaneity' },
    { id: 'human-perception', label: 'Human Experience' },
    { id: 'ai-prover', label: 'AI Prover' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#080B11]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('relativity')}
          className="font-display text-xl font-bold tracking-tight text-amber-100 hover:text-white transition-colors cursor-pointer text-left"
        >
          Chronos
        </button>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`transition-colors whitespace-nowrap cursor-pointer relative py-1 ${
                activeTab === item.id
                  ? 'text-amber-400 font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-amber-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Primary action button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('ai-hypotheses')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'ai-hypotheses'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800/90 text-amber-200 border border-amber-500/30 hover:bg-slate-800 hover:border-amber-400'
            }`}
          >
            Hypothesis Lab
          </button>
        </div>
      </div>
    </header>
  );
};
