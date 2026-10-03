import React, { useState, useEffect, useRef } from 'react';
import humanTimeImg from '../../assets/images/diagram_human_chronos_1791005500470.jpg';

export const HumanPerceptionLab: React.FC = () => {
  // --- Experiment 1: Interval Reproduction State ---
  type ExpState = 'idle' | 'presenting' | 'ready_to_reproduce' | 'measuring' | 'result';
  const [expState, setExpState] = useState<ExpState>('idle');
  const [targetDurationMs, setTargetDurationMs] = useState<number>(3000);
  const [userDurationMs, setUserDurationMs] = useState<number | null>(null);
  const [trials, setTrials] = useState<{ target: number; reproduced: number; ratio: number }[]>([]);

  const holdStartRef = useRef<number>(0);
  const targetTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startPresentation = () => {
    // Random target between 2000ms and 4500ms rounded to nearest 500
    const targets = [2000, 2500, 3000, 3500, 4000];
    const chosen = targets[Math.floor(Math.random() * targets.length)];
    setTargetDurationMs(chosen);
    setExpState('presenting');

    targetTimerRef.current = setTimeout(() => {
      setExpState('ready_to_reproduce');
    }, chosen);
  };

  const handleMouseDown = () => {
    if (expState !== 'ready_to_reproduce') return;
    holdStartRef.current = performance.now();
    setExpState('measuring');
  };

  const handleMouseUp = () => {
    if (expState !== 'measuring') return;
    const duration = performance.now() - holdStartRef.current;
    const rounded = Math.round(duration);
    setUserDurationMs(rounded);
    const ratio = rounded / targetDurationMs;

    setTrials((prev) => [...prev, { target: targetDurationMs, reproduced: rounded, ratio }]);
    setExpState('result');
  };

  useEffect(() => {
    return () => {
      if (targetTimerRef.current) clearTimeout(targetTimerRef.current);
    };
  }, []);

  // --- Experiment 2: Janet's Law of Aging Slider ---
  const [currentAge, setCurrentAge] = useState<number>(25);

  // Calculate subjective fraction of life lived so far according to Janet's Law
  // S(T) = integral from 1 to T of dt/t = ln(T)
  // Normalized over an 80-year lifespan: ln(currentAge) / ln(80)
  const subjectiveFractionLived = Math.min(1, Math.max(0, Math.log(currentAge) / Math.log(80)));

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-amber-400">
            05. Neuroscience & Phenomenological Psychophysics
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-100">
            Human Experience: The Internal Clock, Aging & The Specious Present
          </h2>
        </div>
        <div className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
          The Specious Present: <span className="text-emerald-400 font-bold">~2.5 seconds</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Live Interval Estimation Test (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-[#06080E] p-5 shadow-inner space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-800/80">
              <span>PSYCHOPHYSICAL EXPERIMENT: PACEMAKER INTERVAL TEST</span>
              <span className="text-cyan-400">Trial #{trials.length + 1}</span>
            </div>

            {/* Test Stage Visual Container */}
            <div className="relative w-full aspect-[16/9] bg-slate-950/90 rounded-xl border border-slate-800 flex flex-col items-center justify-center p-6 text-center select-none">
              {expState === 'idle' && (
                <div className="space-y-3">
                  <div className="text-sm font-semibold text-slate-200">
                    Test Your Brain’s Internal Neural Clock
                  </div>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    The platform will pulse a stimulus for a mystery duration. Afterwards, press and hold the button to recreate that exact interval.
                  </p>
                  <button
                    onClick={startPresentation}
                    className="px-5 py-2 rounded-lg bg-amber-500 text-slate-950 font-semibold text-xs hover:bg-amber-400 transition-colors cursor-pointer"
                  >
                    Start Stimulus Pulse
                  </button>
                </div>
              )}

              {expState === 'presenting' && (
                <div className="space-y-4 flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-amber-400/90 shadow-[0_0_40px_rgba(245,158,11,0.6)] animate-pulse" />
                  <div className="text-xs font-mono text-amber-300">
                    STIMULUS ACTIVE — Observe the duration...
                  </div>
                </div>
              )}

              {expState === 'ready_to_reproduce' && (
                <div className="space-y-3">
                  <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                    Stimulus Completed
                  </div>
                  <div className="text-sm font-semibold text-slate-100">
                    Press and hold the button below for that exact duration
                  </div>
                  <button
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleMouseDown}
                    className="px-8 py-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-400 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all cursor-pointer select-none"
                  >
                    HOLD TO REPRODUCE TIME
                  </button>
                </div>
              )}

              {expState === 'measuring' && (
                <div className="space-y-3">
                  <div className="w-16 h-16 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin mx-auto" />
                  <div className="text-xs font-mono text-cyan-300">
                    RECORDING INTERVAL... RELEASE WHEN COMPLETE
                  </div>
                  <button
                    onMouseUp={handleMouseUp}
                    onTouchEnd={handleMouseUp}
                    className="px-8 py-4 rounded-xl bg-rose-600 text-white font-bold text-sm shadow-lg transition-all cursor-pointer"
                  >
                    RELEASE TO FINISH
                  </button>
                </div>
              )}

              {expState === 'result' && userDurationMs && (
                <div className="space-y-3 max-w-md">
                  <div className="text-xs font-mono uppercase text-emerald-400">
                    Calibration Result
                  </div>
                  <div className="grid grid-cols-3 gap-2 bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-left font-mono">
                    <div>
                      <div className="text-[10px] text-slate-400">Target Time</div>
                      <div className="text-base font-bold text-slate-100">{targetDurationMs} ms</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Your Estimate</div>
                      <div className="text-base font-bold text-cyan-400">{userDurationMs} ms</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Perceptual Ratio</div>
                      <div className="text-base font-bold text-amber-400">
                        {(userDurationMs / targetDurationMs).toFixed(2)}x
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300">
                    {userDurationMs > targetDurationMs ? (
                      <span>
                        Your internal clock underestimated time (held <strong className="text-amber-300">{userDurationMs - targetDurationMs} ms</strong> too long).
                        This occurs when internal pacemaker pulses tick slower than standard physical clocks.
                      </span>
                    ) : (
                      <span>
                        Your internal clock compressed time (released <strong className="text-cyan-300">{targetDurationMs - userDurationMs} ms</strong> early).
                        High cognitive arousal or caffeine accelerates pacemaker frequency!
                      </span>
                    )}
                  </p>
                  <button
                    onClick={startPresentation}
                    className="px-4 py-1.5 rounded bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 text-xs font-mono cursor-pointer"
                  >
                    Try Another Trial
                  </button>
                </div>
              )}
            </div>

            {/* Trial History Log */}
            {trials.length > 0 && (
              <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800/80 space-y-1.5">
                <div className="text-[11px] font-mono text-slate-400 flex justify-between">
                  <span>HISTORICAL TRIALS (Weber-Fechner Consistency)</span>
                  <span className="text-amber-400">Avg Ratio: {(trials.reduce((a, b) => a + b.ratio, 0) / trials.length).toFixed(2)}x</span>
                </div>
                <div className="flex gap-2 overflow-x-auto py-1">
                  {trials.map((t, idx) => (
                    <div key={idx} className="p-2 bg-slate-900 rounded border border-slate-800 text-[10px] font-mono shrink-0">
                      <div>#{idx + 1}: {t.target}ms → {t.reproduced}ms</div>
                      <div className={t.ratio > 1 ? 'text-amber-400' : 'text-cyan-400'}>
                        Bias: {(t.ratio * 100).toFixed(0)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Neuroscientific Proof: Tachypsychia & The Eagleman Free-Fall Experiment */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-amber-400 font-semibold uppercase">
                The Trauma Illusion: Tachypsychia (David Eagleman)
              </span>
              <span className="text-xs font-mono text-slate-400">Baylor College of Medicine</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Why do car crashes, falls, or life-or-death moments seem to unfold in super slow-motion?
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Neuroscientist David Eagleman dropped participants from a 150-foot tower into a safety net while wearing wrist displays flashing numbers faster than human critical flicker fusion (&gt;60 Hz). If brain processing speed truly increased during fear, participants could read the numbers.
            </p>
            <div className="p-2.5 bg-slate-950/80 rounded border border-slate-800 text-xs font-mono text-slate-300">
              Result: Participants <strong className="text-rose-400">could NOT</strong> read the digits. Time dilation in fear is a <strong>retrospective memory illusion</strong>.
              The amygdala kicks into hyperdrive, laying down multiple redundant memory traces. When recalling the incident, the brain mistakes the unprecedented density of memories for extended duration!
            </div>
          </div>
        </div>

        {/* Right Column: Janet's Law of Lifespan & Visual Artwork (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Janet's Law Interactive Aging Explorer */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Janet's Law: Proportional Theory of Life
              </span>
              <span className="text-xs font-mono text-amber-400 font-bold">
                Age: {currentAge} years old
              </span>
            </div>

            <div className="space-y-1">
              <input
                type="range"
                min="5"
                max="80"
                step="1"
                value={currentAge}
                onChange={(e) => setCurrentAge(parseInt(e.target.value))}
                className="w-full cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-500">
                <span>Age 5 (Childhood)</span>
                <span>Age 25</span>
                <span>Age 50</span>
                <span>Age 80</span>
              </div>
            </div>

            {/* Calculations */}
            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Subjective Life Lived:</span>
                <span className="text-amber-400 font-bold">
                  {(subjectiveFractionLived * 100).toFixed(1)}% of perceived lifetime
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full transition-all duration-300"
                  style={{ width: `${subjectiveFractionLived * 100}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-400 pt-1 leading-relaxed">
                By age <strong>20</strong>, according to Paul Janet's logarithmic formula, you have already subjectively experienced{' '}
                <strong className="text-slate-200">{((Math.log(20) / Math.log(80)) * 100).toFixed(0)}%</strong> of your entire perceived lifetime, because every subsequent year represents an ever-smaller fraction of your accumulated memories!
              </div>
            </div>

            <div className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-slate-800">
              <strong className="text-slate-200">The "Holiday Paradox":</strong> Why routine days pass quickly while happening but vanish from memory, whereas novel travel passes slowly in hindsight?
              Novelty forces rich hippocampal episodic encoding; routine compresses data into a single neural token.
            </div>
          </div>

          {/* Reference Image */}
          <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900/40">
            <img
              src={humanTimeImg}
              alt="Neuroscientific illustration of synaptic clock oscillations intertwined with hourglass of memory and subjective consciousness"
              referrerPolicy="no-referrer"
              className="w-full h-auto object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="p-3 text-[11px] font-mono text-slate-400 bg-slate-950/90 border-t border-slate-800">
              The Specious Present: William James formulated that our conscious "Now" is an interval roughly 2.5 seconds wide holding the immediate past and emerging future in one unified percept.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
