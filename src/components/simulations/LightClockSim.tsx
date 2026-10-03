import React, { useState, useEffect, useRef } from 'react';
import lightClockImg from '../../assets/images/diagram_relativistic_dilation_1791005512462.jpg';

export const LightClockSim: React.FC = () => {
  // Velocity as fraction of c (0 to 0.99)
  const [velocityFraction, setVelocityFraction] = useState<number>(0.75);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [showDerivation, setShowDerivation] = useState<boolean>(false);
  const [showTriangleProof, setShowTriangleProof] = useState<boolean>(true);

  // Lorentz factor gamma = 1 / sqrt(1 - v^2)
  const gamma = 1 / Math.sqrt(Math.max(0.001, 1 - velocityFraction * velocityFraction));
  const velocityKmS = Math.round(velocityFraction * 299792);

  // Canvas animation refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const stateRef = useRef({
    tStationary: 0,
    tMoving: 0,
    shipX: 50,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (isPlaying) {
        // Photon speed in sim units
        const cSpeed = 240; // px/sec
        stateRef.current.tStationary += dt * cSpeed;
        // Moving frame photon travels same c, but along diagonal hypotenuse
        stateRef.current.tMoving += dt * (cSpeed / gamma);
        
        // Ship movement across screen
        const shipSpeed = cSpeed * velocityFraction;
        stateRef.current.shipX += dt * shipSpeed * 0.6;
        if (stateRef.current.shipX > canvas.width - 120) {
          stateRef.current.shipX = 40;
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mirrorDist = 120; // Height of light clock
      const topY = 40;
      const botY = topY + mirrorDist;

      // Draw Grid / Coordinate background
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // ==========================================
      // FRAME 1: Stationary Light Clock (Left side)
      // ==========================================
      const restX = 140;
      // Mirrors
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(restX - 35, topY - 6, 70, 6);
      ctx.fillRect(restX - 35, botY, 70, 6);

      // Bounce math for stationary: cycle = 2 * mirrorDist
      const cycleDist = mirrorDist * 2;
      const posInCycle = stateRef.current.tStationary % cycleDist;
      let photonY = posInCycle < mirrorDist ? topY + posInCycle : botY - (posInCycle - mirrorDist);

      // Vertical photon path line
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(restX, topY);
      ctx.lineTo(restX, botY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Photon
      ctx.fillStyle = '#06b6d4';
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(restX, photonY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Labels for Rest Frame
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '12px IBM Plex Mono, monospace';
      ctx.fillText('REST FRAME (Observer inside)', restX - 85, botY + 32);
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`Δτ = 2L / c (Proper Time)`, restX - 70, botY + 48);

      // ==========================================
      // FRAME 2: Moving Light Clock (Right side)
      // ==========================================
      const shipCurX = stateRef.current.shipX + 240;
      // Moving mirrors
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(shipCurX - 35, topY - 6, 70, 6);
      ctx.fillRect(shipCurX - 35, botY, 70, 6);

      // Moving photon position
      const movingCycle = mirrorDist * 2;
      const mPos = stateRef.current.tMoving % movingCycle;
      let mPhotonY = mPos < mirrorDist ? topY + mPos : botY - (mPos - mirrorDist);

      // Draw the diagonal triangle path if enabled
      if (showTriangleProof) {
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        // Path trace
        const halfDiagX = mirrorDist * velocityFraction * gamma * 0.4;
        ctx.moveTo(shipCurX - halfDiagX, topY);
        ctx.lineTo(shipCurX, botY);
        ctx.lineTo(shipCurX + halfDiagX, topY);
        ctx.stroke();

        // Right triangle guide
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(shipCurX - halfDiagX, topY);
        ctx.lineTo(shipCurX - halfDiagX, botY);
        ctx.lineTo(shipCurX, botY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Labels on triangle
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px IBM Plex Mono, monospace';
        ctx.fillText('L = cΔτ/2', shipCurX - halfDiagX - 55, topY + mirrorDist / 2);
        ctx.fillText('vΔt/2', shipCurX - halfDiagX / 2 - 10, botY + 12);
        ctx.fillStyle = '#f59e0b';
        ctx.fillText('Hypotenuse = cΔt/2', shipCurX - 20, topY + mirrorDist / 2 - 10);
      }

      // Moving Photon
      ctx.fillStyle = '#f59e0b';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(shipCurX, mPhotonY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Labels for Moving Frame
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '12px IBM Plex Mono, monospace';
      ctx.fillText('MOVING FRAME (External Observer)', shipCurX - 85, botY + 32);
      ctx.fillStyle = '#fbbf24';
      ctx.fillText(`Δt = γ · Δτ (Dilated Time)`, shipCurX - 70, botY + 48);

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, velocityFraction, gamma, showTriangleProof]);

  return (
    <div className="space-y-6">
      {/* Header & Principle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-amber-400">
            01. Special Relativity & Geometric Invariance
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-100">
            Einstein’s Light Clock & Geometric Proof of Time Dilation
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors cursor-pointer ${
              isPlaying
                ? 'bg-slate-800 text-amber-400 border-amber-500/40 hover:bg-slate-700'
                : 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
            }`}
          >
            {isPlaying ? 'Pause Simulation' : 'Resume Simulation'}
          </button>
          <button
            onClick={() => setShowTriangleProof(!showTriangleProof)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
              showTriangleProof
                ? 'bg-slate-800 text-slate-200 border-slate-700'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            {showTriangleProof ? 'Hide Triangle Vectors' : 'Show Triangle Vectors'}
          </button>
        </div>
      </div>

      {/* Two-Zone Layout: Interactive Stage + Control & Calibration Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Zone: Live Simulation Canvas (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-xl border border-slate-800 bg-[#06080E] p-4 overflow-hidden shadow-inner">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-800/80 mb-2">
              <span>CANVAS: LIGHT CLOCK PHOTON TRAJECTORIES</span>
              <span className="text-amber-400">c = 299,792,458 m/s (INVARIANT)</span>
            </div>
            
            <canvas
              ref={canvasRef}
              width={640}
              height={260}
              className="w-full h-auto rounded-lg bg-[#070A11] block"
            />

            <div className="text-[11px] text-slate-400 mt-3 flex items-center justify-between">
              <span>● Cyan = Rest Frame Proper Time (Δτ)</span>
              <span>▲ Amber = Dilated Coordinate Time (Δt = γΔτ)</span>
            </div>
          </div>

          {/* Real-World Proof Spotlight: Atmospheric Cosmic Ray Muons */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-400 font-semibold uppercase">
                Decisive Empirical Proof: Cosmic Ray Muons
              </span>
              <span className="text-xs font-mono text-slate-400">Mount Washington / CERN</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Cosmic rays hit the upper atmosphere 15 km above Earth, generating muons with a rest half-life of only{' '}
              <strong className="text-slate-100 font-mono">2.2 μs</strong>. Classically, moving near the speed of light (0.994c),
              muons could only travel <span className="font-mono text-rose-300">d = v·t ≈ 656 meters</span> before decaying, and{' '}
              <em>zero</em> should reach the ground.
            </p>
            <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800/80 text-xs font-mono text-slate-300 space-y-1">
              <div>• Special Relativity Factor: γ = 1 / √(1 - 0.994²) = <strong>9.14</strong></div>
              <div>• Earth Observer Time: Δt = 9.14 × 2.2 μs = <strong className="text-emerald-400">20.1 μs</strong> (dilated by 900%)</div>
              <div>• Distance Traversed: d = 0.994c × 20.1 μs = <strong className="text-emerald-400">5,990 meters</strong> → Muons reach sea-level detectors!</div>
              <div className="text-[11px] text-slate-400 italic">
                From the muon’s perspective, time flows normally, but the 15 km atmosphere contracts to 1.64 km. Both descriptions are mathematically identical.
              </div>
            </div>
          </div>
        </div>

        {/* Right Zone: Parameter Slider & Mathematical Derivation (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Calibrated Parameter Console */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Velocity Calibration
              </span>
              <span className="text-xs font-mono text-amber-400">
                v = {velocityFraction.toFixed(3)} c
              </span>
            </div>

            {/* Slider */}
            <div className="space-y-1">
              <input
                type="range"
                min="0"
                max="0.995"
                step="0.005"
                value={velocityFraction}
                onChange={(e) => setVelocityFraction(parseFloat(e.target.value))}
                className="w-full cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-500">
                <span>0.0c (Rest)</span>
                <span>0.5c</span>
                <span>0.866c (γ=2.0)</span>
                <span>0.995c (γ=10.0)</span>
              </div>
            </div>

            {/* Quick preset buttons */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { label: 'Airplane (Mach 1)', v: 0.000001 },
                { label: 'Apollo 10 (11 km/s)', v: 0.000037 },
                { label: 'Relativistic (0.50c)', v: 0.5 },
                { label: 'Half-Speed (0.866c, γ=2x)', v: 0.866 },
                { label: 'Extreme (0.990c, γ=7x)', v: 0.99 },
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setVelocityFraction(preset.v)}
                  className="px-2.5 py-1 text-[11px] font-mono rounded bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer border border-slate-700/60"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Live Telemetry Display */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/80">
              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                <div className="text-[11px] font-mono uppercase text-slate-400">Lorentz Factor (γ)</div>
                <div className="text-2xl font-mono font-bold text-amber-400 tabular-nums">
                  {gamma.toFixed(3)}×
                </div>
                <div className="text-[10px] text-slate-500">Clock ticks slower by this ratio</div>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                <div className="text-[11px] font-mono uppercase text-slate-400">Velocity</div>
                <div className="text-xl font-mono font-bold text-slate-100 tabular-nums">
                  {velocityKmS.toLocaleString()}{' '}
                  <span className="text-xs text-slate-400 font-normal">km/s</span>
                </div>
                <div className="text-[10px] text-slate-500">{(velocityFraction * 100).toFixed(1)}% Speed of Light</div>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                <div className="text-[11px] font-mono uppercase text-slate-400">Length Contraction</div>
                <div className="text-xl font-mono font-bold text-cyan-400 tabular-nums">
                  {(100 / gamma).toFixed(1)}%
                </div>
                <div className="text-[10px] text-slate-500">L = L₀ / γ along motion axis</div>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                <div className="text-[11px] font-mono uppercase text-slate-400">Twin Aging Lag</div>
                <div className="text-xl font-mono font-bold text-emerald-400 tabular-nums">
                  {((1 - 1 / gamma) * 100).toFixed(1)}%
                </div>
                <div className="text-[10px] text-slate-500">Traveler younger upon return</div>
              </div>
            </div>
          </div>

          {/* Collapsible Mathematical Proof Box */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden">
            <button
              onClick={() => setShowDerivation(!showDerivation)}
              className="w-full p-4 flex items-center justify-between text-left text-xs font-mono font-semibold text-slate-200 hover:text-amber-400 transition-colors cursor-pointer"
            >
              <span>THE PYTHAGOREAN PROOF DERIVATION</span>
              <span>{showDerivation ? '− Collapse' : '+ Expand Proof'}</span>
            </button>

            {showDerivation && (
              <div className="p-4 pt-0 text-xs font-mono text-slate-300 space-y-3 border-t border-slate-800/60 bg-slate-950/50">
                <div className="space-y-1.5 pt-2">
                  <div className="text-amber-300 font-semibold">Step 1: The Rest Frame (Mirror Height L)</div>
                  <p className="text-slate-400">
                    A photon bouncing vertically between mirrors separated by distance L takes proper time:
                  </p>
                  <div className="p-2 bg-slate-900 rounded text-amber-200">
                    Δτ = 2L / c ⟹ L = c·Δτ / 2
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="text-amber-300 font-semibold">Step 2: The Moving Frame (Diagonal Hypotenuse)</div>
                  <p className="text-slate-400">
                    In coordinate time Δt, the clock moves horizontally by distance <span className="text-slate-200">v·Δt</span>.
                    The photon traverses a right triangle whose vertical leg is L, horizontal leg is <span className="text-slate-200">v·Δt / 2</span>,
                    and hypotenuse is <span className="text-slate-200">c·Δt / 2</span>:
                  </p>
                  <div className="p-2 bg-slate-900 rounded text-cyan-200">
                    (c·Δt / 2)² = L² + (v·Δt / 2)²
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="text-amber-300 font-semibold">Step 3: Algebraic Substitution</div>
                  <p className="text-slate-400">
                    Substituting L = c·Δτ / 2 into the Pythagorean formula:
                  </p>
                  <div className="p-2 bg-slate-900 rounded text-slate-200 space-y-1">
                    <div>c²·Δt² / 4 = c²·Δτ² / 4 + v²·Δt² / 4</div>
                    <div>(c² - v²)·Δt² = c²·Δτ²</div>
                    <div>Δt² = Δτ² / (1 - v²/c²)</div>
                    <div className="text-amber-400 font-bold text-sm pt-1">
                      Δt = Δτ / √(1 - v²/c²) ≡ γ·Δτ  ∎
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
