import React, { useState, useEffect, useRef } from 'react';
import entropyDiagramImg from '../../assets/images/diagram_entropy_arrow_1791005487531.jpg';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
}

export const EntropyArrowSim: React.FC = () => {
  const [hasPartition, setHasPartition] = useState<boolean>(true);
  const [particleCount, setParticleCount] = useState<number>(180);
  const [isSimRunning, setIsSimRunning] = useState<boolean>(true);
  const [entropyHistory, setEntropyHistory] = useState<number[]>([]);
  const [entropyFraction, setEntropyFraction] = useState<number>(0);
  const [leftCount, setLeftCount] = useState<number>(180);
  const [rightCount, setRightCount] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);

  // Initialize particles strictly in the left chamber
  const resetToLowEntropy = () => {
    const particles: Particle[] = [];
    const width = 600;
    const height = 300;
    const halfWidth = width / 2;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: 10 + Math.random() * (halfWidth - 25),
        y: 10 + Math.random() * (height - 20),
        vx: (Math.random() - 0.5) * 160,
        vy: (Math.random() - 0.5) * 160,
        color: i % 2 === 0 ? '#f59e0b' : '#38bdf8',
      });
    }
    particlesRef.current = particles;
    setHasPartition(true);
    setEntropyHistory([]);
    setLeftCount(particleCount);
    setRightCount(0);
    setEntropyFraction(0);
  };

  useEffect(() => {
    resetToLowEntropy();
  }, [particleCount]);

  // Reverse all velocity vectors (Loschmidt's time-reversal thought experiment)
  const reverseTimeVectors = () => {
    particlesRef.current.forEach((p) => {
      p.vx = -p.vx;
      p.vy = -p.vy;
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();
    let tickCounter = 0;

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const width = canvas.width;
      const height = canvas.height;
      const midX = width / 2;

      if (isSimRunning) {
        let leftSide = 0;
        let rightSide = 0;

        particlesRef.current.forEach((p) => {
          p.x += p.vx * dt;
          p.y += p.vy * dt;

          // Wall bounces
          if (p.y <= 4) {
            p.y = 4;
            p.vy = Math.abs(p.vy);
          } else if (p.y >= height - 4) {
            p.y = height - 4;
            p.vy = -Math.abs(p.vy);
          }

          if (hasPartition) {
            // Constrained to left side
            if (p.x <= 4) {
              p.x = 4;
              p.vx = Math.abs(p.vx);
            } else if (p.x >= midX - 6) {
              p.x = midX - 6;
              p.vx = -Math.abs(p.vx);
            }
          } else {
            // Full box boundary
            if (p.x <= 4) {
              p.x = 4;
              p.vx = Math.abs(p.vx);
            } else if (p.x >= width - 4) {
              p.x = width - 4;
              p.vx = -Math.abs(p.vx);
            }
          }

          if (p.x < midX) leftSide++;
          else rightSide++;
        });

        // Calculate Boltzmann entropy based on distribution
        // For two halves, S / k = - [ p_L * ln(p_L) + p_R * ln(p_R) ] / ln(2)
        const pL = Math.max(0.0001, leftSide / particleCount);
        const pR = Math.max(0.0001, rightSide / particleCount);
        const entropyVal = -(pL * Math.log2(pL) + pR * Math.log2(pR)); // 0 to 1
        setEntropyFraction(entropyVal);
        setLeftCount(leftSide);
        setRightCount(rightSide);

        tickCounter++;
        if (tickCounter % 6 === 0) {
          setEntropyHistory((prev) => [...prev.slice(-80), entropyVal]);
        }
      }

      // Drawing
      ctx.clearRect(0, 0, width, height);

      // Background grid
      ctx.strokeStyle = '#111827';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Center dividing line or partition
      if (hasPartition) {
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(midX - 3, 0, 6, height);
        ctx.fillStyle = '#f87171';
        ctx.font = '10px IBM Plex Mono';
        ctx.fillText('PARTITION [CLOSED]', midX - 55, 18);
      } else {
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(midX, 0);
        ctx.lineTo(midX, height);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Particles
      particlesRef.current.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isSimRunning, hasPartition, particleCount]);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-amber-400">
            03. Statistical Mechanics & Thermodynamics
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-100">
            The Thermodynamic Arrow: Why Time Cannot Flow Backward
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setHasPartition(!hasPartition)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors cursor-pointer ${
              hasPartition
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                : 'bg-slate-800 text-slate-200 border-slate-700'
            }`}
          >
            {hasPartition ? 'Remove Partition (Trigger ΔS > 0)' : 'Restore Partition'}
          </button>
          <button
            onClick={reverseTimeVectors}
            className="px-3 py-1.5 text-xs font-semibold rounded-md bg-purple-950 text-purple-200 border border-purple-800/60 hover:bg-purple-900/60 transition-colors cursor-pointer"
          >
            Reverse Time (v → -v)
          </button>
          <button
            onClick={resetToLowEntropy}
            className="px-3 py-1.5 text-xs font-medium rounded-md bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Reset to Low Entropy
          </button>
        </div>
      </div>

      {/* Two-Zone Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Particle Chamber & Live Entropy Curve (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-[#06080E] p-4 shadow-inner space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-800/80">
              <span>CANVAS: BOLTZMANN PHASE SPACE EXPANSION</span>
              <span className="text-amber-400">S = k_B · ln(Ω)</span>
            </div>

            <canvas
              ref={canvasRef}
              width={600}
              height={260}
              className="w-full h-auto rounded-lg bg-[#070A11] block border border-slate-800/60"
            />

            {/* Distribution metrics */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2.5 bg-slate-950/70 rounded-lg border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400">Left Chamber Particles</div>
                <div className="text-lg font-mono font-bold text-amber-400 tabular-nums">
                  {leftCount} <span className="text-xs text-slate-500 font-normal">({((leftCount / particleCount) * 100).toFixed(0)}%)</span>
                </div>
              </div>
              <div className="p-2.5 bg-slate-950/70 rounded-lg border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400">Right Chamber Particles</div>
                <div className="text-lg font-mono font-bold text-cyan-400 tabular-nums">
                  {rightCount} <span className="text-xs text-slate-500 font-normal">({((rightCount / particleCount) * 100).toFixed(0)}%)</span>
                </div>
              </div>
              <div className="p-2.5 bg-slate-950/70 rounded-lg border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400">Calculated Entropy S / S_max</div>
                <div className="text-lg font-mono font-bold text-emerald-400 tabular-nums">
                  {(entropyFraction * 100).toFixed(1)} %
                </div>
              </div>
            </div>

            {/* Real-Time Entropy Trace Chart */}
            <div className="pt-2">
              <div className="text-[11px] font-mono text-slate-400 mb-1 flex justify-between">
                <span>Entropy Evolution Curve ΔS over Time:</span>
                <span className="text-emerald-400">Thermal Equilibrium (100%)</span>
              </div>
              <div className="h-14 bg-slate-950/90 rounded border border-slate-800/80 p-1 flex items-end gap-1 overflow-hidden">
                {entropyHistory.map((val, idx) => (
                  <div
                    key={idx}
                    className="flex-1 bg-amber-500/80 rounded-t-sm transition-all"
                    style={{ height: `${Math.max(4, val * 100)}%` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Deep Explanation: Why Humans Remember the Past and Not the Future */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-amber-400 font-semibold uppercase">
                The Memory Paradox: Why We Remember Past, Not Future
              </span>
              <span className="text-xs font-mono text-slate-400">Landauer's Principle</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              If fundamental quantum equations work equally forward and backward in time, why do human brains have vivid memories of the past but none of the future?
            </p>
            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
              <div>• <strong>A memory is a localized decrease in entropy</strong> (ordered neuronal synaptic connections).</div>
              <div>• <strong>Landauer's Thermodynamic Bound</strong>: Writing, retaining, or erasing 1 bit of information in the brain requires dissipating minimum heat: <span className="text-amber-300">Q ≥ k_B·T·ln(2)</span> into the environment.</div>
              <div>• Therefore, cognitive memory formation is fundamentally an entropy pump: <strong>you can only form a record of an event if the total entropy of the universe increases!</strong></div>
            </div>
          </div>
        </div>

        {/* Right: Loschmidt Paradox & The Past Hypothesis (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              The Loschmidt Reversibility Paradox
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              In 1876, Johann Josef Loschmidt challenged Ludwig Boltzmann: <em>"If Newton’s laws are symmetric in time, just reverse every molecule’s velocity, and the gas must reassemble back into the left chamber!"</em>
            </p>

            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg space-y-2 text-xs">
              <div className="font-semibold text-purple-300 font-mono">Test it in the simulation:</div>
              <p className="text-slate-400 leading-relaxed">
                Click the <strong className="text-purple-300">Reverse Time (v → -v)</strong> button above. The particles momentarily re-concentrate, but any microscopic collision immediately causes them to scatter again!
              </p>
              <div className="text-slate-300 font-mono text-[11px] pt-1 border-t border-slate-800">
                Probability of 1 mole of air spontaneously returning to one corner:
                <div className="text-rose-400 font-bold text-sm">P ≈ (1/2)^(10²³) ≈ 0</div>
                <div className="text-slate-500">You would have to wait 10^10^20 years for a single spontaneous fluctuation.</div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="text-xs font-mono text-amber-300 font-semibold uppercase">
                The Cosmic "Past Hypothesis" (David Albert)
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                The only reason time flows forward today is that the Big Bang began in an extraordinarily rare, ultra-low entropy state (smooth, hot, un-clumped gravitational field).
                Everything we experience—clocks ticking, stars burning, thoughts firing, dying—is simply the cosmic universe rolling down this initial entropy gradient toward heat death.
              </p>
            </div>
          </div>

          {/* Reference Image Artwork */}
          <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900/40">
            <img
              src={entropyDiagramImg}
              alt="Scientific diagram of thermodynamic entropy arrow from crystal order to dispersed thermal equilibrium"
              referrerPolicy="no-referrer"
              className="w-full h-auto object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="p-3 text-[11px] font-mono text-slate-400 bg-slate-950/90 border-t border-slate-800">
              Boltzmann Entropy Equation: S = k_B · ln(Ω). Engraved on Ludwig Boltzmann’s tombstone in Vienna.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
