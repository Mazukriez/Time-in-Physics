import React, { useState } from 'react';
import { SimulationTab } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { LightClockSim } from './components/simulations/LightClockSim';
import { GravitationalGpsSim } from './components/simulations/GravitationalGpsSim';
import { EntropyArrowSim } from './components/simulations/EntropyArrowSim';
import { SimultaneitySim } from './components/simulations/SimultaneitySim';
import { HumanPerceptionLab } from './components/simulations/HumanPerceptionLab';
import { ChronosAIProver } from './components/ai/ChronosAIProver';
import { HypothesisLaboratory } from './components/ai/HypothesisLaboratory';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<SimulationTab>('relativity');

  const tabDescriptions: Record<SimulationTab, { title: string; subtitle: string }> = {
    relativity: {
      title: 'Einstein Light Clock & Velocity Dilation',
      subtitle: 'Geometric proof why motion through space slows progression through time (Lorentz invariance).',
    },
    'gravity-gps': {
      title: 'Gravitational Potential & GPS Engineering Proof',
      subtitle: 'Why clocks tick faster in weaker gravity and how GPS proves General Relativity (+38.6 μs/day).',
    },
    entropy: {
      title: 'The Thermodynamic Arrow & Memory Formation',
      subtitle: 'Why time cannot flow backward, Boltzmann microstates, and why memory requires entropy dissipation.',
    },
    simultaneity: {
      title: 'Relativity of Simultaneity & The Block Universe',
      subtitle: 'The Andromeda Paradox: how walking at 5 km/h tilts the present across 2.5 million light-years.',
    },
    'human-perception': {
      title: 'Human Consciousness & The Specious Present',
      subtitle: 'Interactive interval reproduction test, Janet’s aging formula, and fear-induced tachypsychia.',
    },
    'ai-prover': {
      title: 'Chronos AI Formal Proof Engine',
      subtitle: 'Derive mathematical, physical, and neuroscientific proofs with empirical citations via Gemini.',
    },
    'ai-hypotheses': {
      title: 'Hypothesis Laboratory & Peer Review',
      subtitle: 'Submit any theoretical or speculative temporal hypothesis for peer review against known physics.',
    },
  };

  return (
    <div className="min-h-screen bg-[#080B11] text-slate-100 flex flex-col font-sans">
      {/* Top Bar Contract Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Hero Section */}
      <Hero onSelectTab={(tab) => setActiveTab(tab)} />

      {/* Main Interactive Stage Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Module Switcher Tabs (Segmented Controls) */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-900/80 rounded-xl border border-slate-800 overflow-x-auto">
          {[
            { id: 'relativity' as SimulationTab, label: '01. Velocity Dilation' },
            { id: 'gravity-gps' as SimulationTab, label: '02. Gravitational GPS' },
            { id: 'entropy' as SimulationTab, label: '03. Entropy Arrow' },
            { id: 'simultaneity' as SimulationTab, label: '04. Simultaneity & Block Universe' },
            { id: 'human-perception' as SimulationTab, label: '05. Human Experience' },
            { id: 'ai-prover' as SimulationTab, label: '06. AI Prover' },
            { id: 'ai-hypotheses' as SimulationTab, label: '07. Hypothesis Lab' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Context Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 bg-slate-900/40 rounded-xl border border-slate-800/80">
          <div>
            <h2 className="text-base font-bold text-slate-100">
              {tabDescriptions[activeTab].title}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {tabDescriptions[activeTab].subtitle}
            </p>
          </div>
          <div className="text-xs font-mono text-slate-500 shrink-0">
            Interactive Scientific Sandbox
          </div>
        </div>

        {/* Active Simulation Viewport */}
        <div className="transition-all duration-300">
          {activeTab === 'relativity' && <LightClockSim />}
          {activeTab === 'gravity-gps' && <GravitationalGpsSim />}
          {activeTab === 'entropy' && <EntropyArrowSim />}
          {activeTab === 'simultaneity' && <SimultaneitySim />}
          {activeTab === 'human-perception' && <HumanPerceptionLab />}
          {activeTab === 'ai-prover' && <ChronosAIProver />}
          {activeTab === 'ai-hypotheses' && <HypothesisLaboratory />}
        </div>
      </main>

      {/* Respectful Footer */}
      <Footer />
    </div>
  );
}
