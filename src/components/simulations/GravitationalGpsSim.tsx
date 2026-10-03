import React, { useState } from 'react';

export const GravitationalGpsSim: React.FC = () => {
  // Altitude in km (default GPS altitude is 20,200 km)
  const [altitudeKm, setAltitudeKm] = useState<number>(20200);

  // Constants
  const G = 6.6743e-11; // Gravitational constant
  const M = 5.9722e24; // Earth mass in kg
  const c = 299792458; // Speed of light m/s
  const rEarth = 6371000; // Earth radius in meters

  // Current satellite radius from center of Earth
  const rSat = rEarth + altitudeKm * 1000;

  // Orbital velocity v = sqrt(GM / r)
  const orbitalVelocity = Math.sqrt((G * M) / rSat); // m/s
  const orbitalVelocityKmS = orbitalVelocity / 1000;

  // 1. Special Relativity (Kinetic time dilation): satellite is moving relative to ground
  // d_t_SR / t = - v^2 / (2 * c^2)
  const fractionalSR = -(orbitalVelocity * orbitalVelocity) / (2 * c * c);
  const driftSR_microsecPerDay = fractionalSR * 86400 * 1e6; // negative (slower)

  // 2. General Relativity (Gravitational time dilation): satellite is at higher gravitational potential
  // d_t_GR / t = (Phi_sat - Phi_earth) / c^2 = (GM / c^2) * (1/rEarth - 1/rSat)
  const fractionalGR = ((G * M) / (c * c)) * (1 / rEarth - 1 / rSat);
  const driftGR_microsecPerDay = fractionalGR * 86400 * 1e6; // positive (faster)

  // Net daily drift
  const netDailyDriftMicrosec = driftSR_microsecPerDay + driftGR_microsecPerDay;

  // Positional error per day without relativistic correction: err = c * dt
  const dailyPositionErrorKm = Math.abs((netDailyDriftMicrosec * 1e-6 * c) / 1000);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-amber-400">
            02. General Relativity & Gravitational Curvature
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-100">
            Gravitational Time Dilation & The GPS Relativistic Proof
          </h2>
        </div>
        <div className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
          Atomic Clock Ground Truth: <span className="text-amber-400 font-bold">+38.6 μs/day</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Graphic Visualizer & Real-World Satellite Orbital Diagram (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-[#06080E] p-5 shadow-inner">
            <div className="text-xs font-mono text-slate-400 pb-3 border-b border-slate-800/80 mb-4 flex justify-between">
              <span>ORBITAL GRAVITATIONAL WELL SCHEMATIC</span>
              <span className="text-cyan-400">Altitude: {altitudeKm.toLocaleString()} km</span>
            </div>

            {/* SVG Visual of Earth & Orbit */}
            <div className="relative w-full aspect-[16/9] flex items-center justify-center bg-slate-950/80 rounded-lg overflow-hidden border border-slate-800">
              <svg viewBox="0 0 600 340" className="w-full h-full">
                {/* Gravity well contour lines */}
                <ellipse cx="300" cy="170" rx="260" ry="140" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
                <ellipse cx="300" cy="170" rx="200" ry="110" fill="none" stroke="#1e293b" strokeWidth="1" />
                <ellipse cx="300" cy="170" rx="140" ry="75" fill="none" stroke="#334155" strokeWidth="1" />
                <ellipse cx="300" cy="170" rx="80" ry="45" fill="none" stroke="#475569" strokeWidth="1" />

                {/* Satellite Dynamic Orbit ring based on altitude */}
                {(() => {
                  const scaleRadius = 55 + (altitudeKm / 36000) * 190;
                  return (
                    <>
                      <ellipse
                        cx="300"
                        cy="170"
                        rx={scaleRadius}
                        ry={scaleRadius * 0.55}
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                      />
                      {/* Satellite icon node */}
                      <g transform={`translate(${300 + scaleRadius * 0.86}, ${170 - scaleRadius * 0.55 * 0.5})`}>
                        <circle cx="0" cy="0" r="6" fill="#f59e0b" />
                        <rect x="-12" y="-3" width="7" height="6" fill="#38bdf8" rx="1" />
                        <rect x="5" y="-3" width="7" height="6" fill="#38bdf8" rx="1" />
                        <text x="10" y="16" fill="#fef08a" fontSize="11" fontFamily="IBM Plex Mono">
                          Clock: {netDailyDriftMicrosec >= 0 ? `+${netDailyDriftMicrosec.toFixed(1)}` : netDailyDriftMicrosec.toFixed(1)} μs/day
                        </text>
                      </g>
                    </>
                  );
                })()}

                {/* Earth Sphere in center */}
                <circle cx="300" cy="170" r="42" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                <circle cx="300" cy="170" r="42" fill="url(#earthGrad)" />
                <defs>
                  <radialGradient id="earthGrad" cx="35%" cy="35%">
                    <stop offset="0%" stopColor="#0284c7" />
                    <stop offset="60%" stopColor="#0369a1" />
                    <stop offset="100%" stopColor="#082f49" />
                  </radialGradient>
                </defs>
                <text x="300" y="166" fill="#e0f2fe" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="IBM Plex Mono">
                  EARTH
                </text>
                <text x="300" y="180" fill="#7dd3fc" fontSize="9" textAnchor="middle" fontFamily="IBM Plex Mono">
                  Heavy Gravity
                </text>
              </svg>

              {/* Inset overlay annotations */}
              <div className="absolute top-3 left-3 bg-slate-900/80 p-2.5 rounded border border-slate-800 text-[11px] font-mono text-slate-300">
                <div>Earth Surface: Deeper Gravity Well (Clocks tick slower)</div>
                <div>Satellite Orbit: Weaker Gravity Well (Clocks tick faster)</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800/80">
                <div className="text-[11px] font-mono text-slate-400">Special Relativity (Velocity)</div>
                <div className="text-lg font-mono font-bold text-rose-400 tabular-nums">
                  {driftSR_microsecPerDay.toFixed(1)} μs/day
                </div>
                <div className="text-[10px] text-slate-500">Speed slows clock down</div>
              </div>

              <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800/80">
                <div className="text-[11px] font-mono text-slate-400">General Relativity (Height)</div>
                <div className="text-lg font-mono font-bold text-emerald-400 tabular-nums">
                  +{driftGR_microsecPerDay.toFixed(1)} μs/day
                </div>
                <div className="text-[10px] text-slate-500">Weak gravity speeds clock up</div>
              </div>

              <div className="p-3 bg-slate-950/70 rounded-lg border border-amber-500/30 bg-amber-950/10">
                <div className="text-[11px] font-mono text-amber-300">Net Relativistic Drift</div>
                <div className="text-lg font-mono font-bold text-amber-400 tabular-nums">
                  {netDailyDriftMicrosec >= 0 ? `+${netDailyDriftMicrosec.toFixed(1)}` : netDailyDriftMicrosec.toFixed(1)} μs/day
                </div>
                <div className="text-[10px] text-amber-500/80">Physical offset applied to GPS</div>
              </div>
            </div>
          </div>

          {/* Decisive Evidence: 1-millimeter Optical Lattice Clock */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-amber-400 font-semibold uppercase">
                Ultra-Precision Lab Proof: Millimeter Dilation (JILA / NIST)
              </span>
              <span className="text-xs font-mono text-slate-400">Strontium Optical Clock</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              In 2022, physicists at JILA (Bothwell et al.) measured gravitational time dilation across a macroscopic height difference of{' '}
              <strong className="text-slate-100">just 1 millimeter (1,000 micrometers)</strong> in a cloud of 100,000 strontium atoms.
              The fractional frequency shift matched Einstein’s prediction <span className="font-mono text-amber-300">Δf/f = gh/c² ≈ 1.1 × 10⁻¹⁹</span> with
              sub-millimeter precision: proof that your head ages faster than your feet!
            </p>
          </div>
        </div>

        {/* Right: Interactive Altitude Slider & Catastrophic Drift Failure (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Orbit Altitude Calibration
              </span>
              <span className="text-xs font-mono text-amber-400 font-bold">
                {altitudeKm.toLocaleString()} km
              </span>
            </div>

            <div className="space-y-1">
              <input
                type="range"
                min="200"
                max="36000"
                step="200"
                value={altitudeKm}
                onChange={(e) => setAltitudeKm(parseInt(e.target.value))}
                className="w-full cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-500">
                <span>ISS (400 km)</span>
                <span>GPS (20,200 km)</span>
                <span>GEO (35,786 km)</span>
              </div>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { label: 'ISS Station (408 km)', h: 408 },
                { label: 'Starlink / LEO (550 km)', h: 550 },
                { label: 'Standard GPS Constellation (20,200 km)', h: 20200 },
                { label: 'Geostationary (35,786 km)', h: 35786 },
              ].map((p) => (
                <button
                  key={p.label}
                  onClick={() => setAltitudeKm(p.h)}
                  className="px-2.5 py-1 text-[11px] font-mono rounded bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer border border-slate-700/60"
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800/80 space-y-3">
              <div className="text-xs font-mono uppercase text-slate-400">
                The Consequence of Ignoring Einstein
              </div>

              <div className="p-4 bg-rose-950/30 border border-rose-900/50 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-rose-200">Daily Positioning Error:</span>
                  <span className="text-lg font-bold text-rose-400 tabular-nums">
                    {dailyPositionErrorKm.toFixed(2)} km / day
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Signals travel at the speed of light (299,792 km/s). A net time mismatch of{' '}
                  <span className="font-mono text-amber-300">
                    {netDailyDriftMicrosec >= 0 ? `+${netDailyDriftMicrosec.toFixed(1)}` : netDailyDriftMicrosec.toFixed(1)} μs
                  </span>{' '}
                  accumulates an error of <strong className="text-rose-300">{dailyPositionErrorKm.toFixed(1)} kilometers every 24 hours</strong>.
                </p>
                <div className="text-[11px] font-mono text-slate-400 border-t border-rose-900/40 pt-2">
                  ✓ Engineering Solution: GPS engineers detune satellite crystal synthesizers from 10.23 MHz down to{' '}
                  <strong className="text-emerald-400">10.22999999543 MHz</strong> before rocket launch so they tick synchronously with ground receivers!
                </div>
              </div>
            </div>
          </div>

          {/* Mathematical Proof Box */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-2.5">
            <div className="text-xs font-mono font-semibold text-slate-200 uppercase">
              The Schwarzschild Metric Time Ratio
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              In the Schwarzschild geometry surrounding a spherical mass M, the proper time dτ at radius r is related to coordinate time dt at infinity:
            </p>
            <div className="p-2.5 bg-slate-950/80 rounded border border-slate-800 text-xs font-mono text-amber-300">
              dτ = dt · √(1 - 2GM / (r·c²))
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Since r_sat (26,570 km) &gt; r_earth (6,371 km), √(1 - 2GM/(r_sat·c²)) &gt; √(1 - 2GM/(r_earth·c²)). Thus, satellite proper time elapses{' '}
              <em>strictly faster</em> than ground clocks.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
