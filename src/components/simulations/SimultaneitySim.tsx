import React, { useState } from 'react';

export const SimultaneitySim: React.FC = () => {
  // Walking velocity on Earth in km/h (-15 to +15) or relativistic mode
  const [walkSpeedKmh, setWalkSpeedKmh] = useState<number>(5);
  const [distanceMly, setDistanceMly] = useState<number>(2.5); // Millions of light-years (2.5 Mly = Andromeda)

  const cMps = 299792458; // m/s
  const walkSpeedMs = (walkSpeedKmh * 1000) / 3600; // m/s

  // Distance in meters: 1 light-year = 9.461e15 meters
  const distanceMeters = distanceMly * 1e6 * 9.460730472e15;

  // Relativity of simultaneity shift: delta_t = (v * delta_x) / c^2 in seconds
  const shiftSeconds = (walkSpeedMs * distanceMeters) / (cMps * cMps);
  const shiftDays = shiftSeconds / 86400;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-amber-400">
            04. Minkowski Geometry & The Block Universe
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-100">
            The Andromeda Paradox: Proof the Future Already Exists
          </h2>
        </div>
        <div className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
          Simultaneity Shift: <span className="text-amber-400 font-bold">{shiftDays >= 0 ? `+${shiftDays.toFixed(2)}` : shiftDays.toFixed(2)} days</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Interactive Minkowski Spacetime Diagram (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-[#06080E] p-5 shadow-inner">
            <div className="text-xs font-mono text-slate-400 pb-3 border-b border-slate-800/80 mb-3 flex justify-between">
              <span>MINKOWSKI SPACETIME HYPERPLANE OF SIMULTANEITY</span>
              <span className="text-cyan-400">Distance: {distanceMly.toFixed(1)} Mly</span>
            </div>

            {/* Diagram */}
            <div className="relative w-full aspect-[16/9] bg-slate-950/80 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center">
              <svg viewBox="0 0 600 320" className="w-full h-full">
                {/* Spacetime axes */}
                <line x1="80" y1="280" x2="80" y2="40" stroke="#334155" strokeWidth="1.5" />
                <line x1="80" y1="160" x2="560" y2="160" stroke="#334155" strokeWidth="1.5" strokeDasharray="3 3" />
                
                {/* Light cone diagonals */}
                <line x1="80" y1="160" x2="200" y2="40" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="1.5" />
                <line x1="80" y1="160" x2="200" y2="280" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="1.5" />

                {/* Andromeda location vertical worldline */}
                <line x1="480" y1="40" x2="480" y2="280" stroke="#475569" strokeWidth="1.5" strokeDasharray="2 2" />
                <text x="480" y="32" fill="#94a3b8" fontSize="11" textAnchor="middle" fontFamily="IBM Plex Mono">
                  ANDROMEDA (2.5 Mly)
                </text>

                {/* Earth location vertical worldline */}
                <text x="80" y="32" fill="#38bdf8" fontSize="11" textAnchor="middle" fontFamily="IBM Plex Mono">
                  EARTH (x = 0)
                </text>

                {/* Stationary Observer Plane of "Now" (flat horizontal green line) */}
                <line x1="80" y1="160" x2="480" y2="160" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 4" />
                <circle cx="480" cy="160" r="4" fill="#10b981" />
                <text x="490" y="164" fill="#10b981" fontSize="10" fontFamily="IBM Plex Mono">
                  Stationary "Now"
                </text>

                {/* Walking Observer Tilted Hyperplane of Simultaneity */}
                {(() => {
                  // Slope = v / c
                  // Tilted line from (80, 160) to (480, 160 - tiltY)
                  const tiltY = Math.max(-100, Math.min(100, shiftDays * 12));
                  const andromedaY = 160 - tiltY;

                  return (
                    <>
                      <line
                        x1="80"
                        y1="160"
                        x2="480"
                        y2={andromedaY}
                        stroke="#f59e0b"
                        strokeWidth="2.5"
                      />
                      <circle cx="480" cy={andromedaY} r="6" fill="#f59e0b" />
                      <text
                        x="490"
                        y={andromedaY + (tiltY > 0 ? -6 : 14)}
                        fill="#fbbf24"
                        fontSize="11"
                        fontWeight="bold"
                        fontFamily="IBM Plex Mono"
                      >
                        Walking "Now" ({shiftDays >= 0 ? `+${shiftDays.toFixed(1)}d` : `${shiftDays.toFixed(1)}d`})
                      </text>

                      {/* Delta bracket */}
                      <line x1="480" y1="160" x2="480" y2={andromedaY} stroke="#f43f5e" strokeWidth="2" />
                    </>
                  );
                })()}

                {/* Labels */}
                <text x="90" y="55" fill="#64748b" fontSize="10" fontFamily="IBM Plex Mono">
                  Time (ct) ⟶
                </text>
                <text x="400" y="152" fill="#64748b" fontSize="10" fontFamily="IBM Plex Mono">
                  Space (x) ⟶
                </text>
              </svg>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="p-2.5 bg-slate-950/70 rounded-lg border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400">Walking Speed</div>
                <div className="text-lg font-mono font-bold text-slate-100 tabular-nums">
                  {walkSpeedKmh} <span className="text-xs text-slate-400 font-normal">km/h</span>
                </div>
                <div className="text-[10px] text-slate-500">{(walkSpeedMs).toFixed(2)} m/s pedestrian</div>
              </div>

              <div className="p-2.5 bg-slate-950/70 rounded-lg border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400">Temporal Discrepancy</div>
                <div className="text-lg font-mono font-bold text-amber-400 tabular-nums">
                  {Math.abs(shiftDays).toFixed(2)} <span className="text-xs text-slate-400 font-normal">days</span>
                </div>
                <div className="text-[10px] text-slate-500">{Math.abs(Math.round(shiftSeconds)).toLocaleString()} seconds</div>
              </div>

              <div className="p-2.5 bg-slate-950/70 rounded-lg border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400">Philosophical Verdict</div>
                <div className="text-sm font-mono font-bold text-cyan-400 mt-1">
                  Block Universe (4D)
                </div>
                <div className="text-[10px] text-slate-500">The future is already real</div>
              </div>
            </div>
          </div>

          {/* Deep Insight */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-400 font-semibold uppercase">
                Roger Penrose's Formulation (1989)
              </span>
              <span className="text-xs font-mono text-slate-400">The Emperor's New Mind</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <em>"Two people pass each other on the street. For one of them, an alien space fleet at Andromeda has already set off on its voyage to invade Earth; for the other, the decision as to whether to launch has not even been made!"</em>
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              If an event in person A’s "present" is still in person B’s "future", then both the past and future must be equally real. Time does not "flow"—the universe is a static four-dimensional tapestry where all points in history exist eternally.
            </p>
          </div>
        </div>

        {/* Right: Interactive Walking Slider & Mathematical Proof (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Observer Motion on Earth
              </span>
              <span className="text-xs font-mono text-amber-400 font-bold">
                {walkSpeedKmh > 0 ? `+${walkSpeedKmh} km/h (Toward)` : walkSpeedKmh < 0 ? `${walkSpeedKmh} km/h (Away)` : '0 km/h (At Rest)'}
              </span>
            </div>

            <div className="space-y-1">
              <input
                type="range"
                min="-15"
                max="15"
                step="0.5"
                value={walkSpeedKmh}
                onChange={(e) => setWalkSpeedKmh(parseFloat(e.target.value))}
                className="w-full cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-500">
                <span>-15 km/h (Running away)</span>
                <span>0 (Stationary)</span>
                <span>+15 km/h (Sprinting toward)</span>
              </div>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { label: 'Casual Walk (3 km/h)', v: 3 },
                { label: 'Brisk Walk (5 km/h)', v: 5 },
                { label: 'Bicycle (20 km/h)', v: 20 },
                { label: 'Airplane (900 km/h)', v: 900 },
              ].map((p) => (
                <button
                  key={p.label}
                  onClick={() => setWalkSpeedKmh(p.v)}
                  className="px-2.5 py-1 text-[11px] font-mono rounded bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer border border-slate-700/60"
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800/80 space-y-3">
              <div className="text-xs font-mono uppercase text-slate-400">
                Cosmic Distance Target
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={distanceMly}
                  onChange={(e) => setDistanceMly(parseFloat(e.target.value))}
                  className="w-full cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <span className="text-xs font-mono text-cyan-400 whitespace-nowrap">
                  {distanceMly} Mly
                </span>
              </div>
            </div>
          </div>

          {/* Mathematical Proof Box */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-2.5">
            <div className="text-xs font-mono font-semibold text-slate-200 uppercase">
              The Lorentz Transformation for Simultaneity
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              From the Lorentz transform:
            </p>
            <div className="p-2.5 bg-slate-950/80 rounded border border-slate-800 text-xs font-mono text-amber-300">
              t' = γ · (t - (v · x) / c²)
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              For two events that are simultaneous in the stationary frame (Δt = 0), the moving observer experiences a temporal separation:
            </p>
            <div className="p-2.5 bg-slate-950/80 rounded border border-slate-800 text-xs font-mono text-cyan-300">
              Δt' = -γ · (v · Δx) / c²
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Because Δx is multiplied by v/c², even though v is only a few meters per second, multiplying by 2.5 million light-years generates a massive discrepancy of days!
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
