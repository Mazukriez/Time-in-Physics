import React, { useState } from 'react';
import { HypothesisResult } from '../../types';

export const HypothesisLaboratory: React.FC = () => {
  const [hypothesisText, setHypothesisText] = useState<string>(
    'Could time be quantized into discrete Planck time packets (t_P ≈ 5.39 × 10⁻⁴⁴ s), meaning the universe updates like frames in a film projector rather than a continuous smooth flow?'
  );
  const [result, setResult] = useState<HypothesisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sampleHypotheses = [
    {
      title: 'Quantized Planck Time',
      text: 'Could time be quantized into discrete Planck time packets (t_P ≈ 5.39 × 10⁻⁴⁴ s), meaning the universe updates like discrete frames in a film projector rather than a continuous smooth flow?',
    },
    {
      title: 'Local Entropy Reversal in Quantum Systems',
      text: 'Could a microscopic closed quantum system temporarily reverse its thermodynamic arrow of time through quantum entanglement or Maxwell demon feedback without violating the 2nd law globally?',
    },
    {
      title: 'Gravitational Dilation of Thought',
      text: 'If a human brain is placed in an intense gravitational field near a neutron star, does the person experience their thoughts as slowing down, or do they perceive outside universe as accelerating?',
    },
    {
      title: 'Two-Dimensional Time (t₁, t₂)',
      text: 'What if spacetime had 3 space dimensions and 2 time dimensions (3+2 metric)? Could this resolve quantum wave-function collapse or allow closed timelike loops?',
    },
  ];

  const handleTestHypothesis = async (textToTest?: string) => {
    const text = textToTest || hypothesisText;
    if (!text.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/ai/test-hypothesis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hypothesis: text }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setResult(data.data);
      } else {
        setErrorMsg(data.error || 'Failed to evaluate hypothesis.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error communicating with AI evaluator.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-amber-400">
            07. Scientific Peer Review & Hypothesis Sandbox
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-100">
            Hypothesis Laboratory: Empirical & Theoretical Verification
          </h2>
        </div>
        <div className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
          Evaluator: <span className="text-cyan-400 font-bold">Standard Model & General Relativity Benchmark</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Form & Presets (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Explore or Submit a Hypothesis
            </div>

            <div className="space-y-2">
              {sampleHypotheses.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setHypothesisText(item.text);
                    handleTestHypothesis(item.text);
                  }}
                  className={`w-full p-3 rounded-lg border text-left transition-all cursor-pointer text-xs ${
                    hypothesisText === item.text
                      ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <div className="font-semibold font-mono text-[11px] text-amber-400 mb-0.5">
                    {item.title}
                  </div>
                  <div className="line-clamp-2 text-slate-400 text-[11px]">
                    {item.text}
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2">
              <label className="block text-xs font-mono text-slate-300">
                Your Theoretical or Experiential Proposition:
              </label>
              <textarea
                value={hypothesisText}
                onChange={(e) => setHypothesisText(e.target.value)}
                rows={4}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-400 font-mono resize-none"
                placeholder="State your hypothesis regarding time, physics, entropy, or human perception..."
              />
              <button
                onClick={() => handleTestHypothesis()}
                disabled={isLoading || !hypothesisText.trim()}
                className="w-full py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Evaluating Against Known Physics...</span>
                  </>
                ) : (
                  <span>Submit to Peer Review</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Structured Peer Review Output (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-[#06080E] p-6 shadow-inner min-h-[460px] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 text-xs font-mono text-slate-400">
              <span>PEER REVIEW REPORT</span>
              {result && (
                <span className="text-amber-400">
                  Consistency Score: {result.consistencyScore} / 10
                </span>
              )}
            </div>

            {errorMsg && (
              <div className="p-4 rounded-lg bg-rose-950/40 border border-rose-900/60 text-xs text-rose-300 font-mono">
                {errorMsg}
              </div>
            )}

            {!result && !isLoading && !errorMsg && (
              <div className="py-20 text-center space-y-3">
                <div className="w-12 h-12 rounded-full border border-slate-800 bg-slate-900/80 flex items-center justify-center mx-auto text-cyan-400 font-mono text-lg">
                  Ψ(t)
                </div>
                <div className="text-sm font-semibold text-slate-300">
                  Awaiting Hypothesis Evaluation
                </div>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Select a hypothesis from the left or write your own to review its consistency against General Relativity, Quantum Mechanics, and Empirical Observation.
                </p>
              </div>
            )}

            {isLoading && !result && (
              <div className="py-24 text-center space-y-4">
                <div className="w-10 h-10 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mx-auto" />
                <div className="text-xs font-mono text-cyan-300">
                  Checking Lorentz Invariance, Energy Conditions, and Known Experiments...
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-4 text-xs leading-relaxed">
                {/* Verdict Banner */}
                <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono uppercase text-slate-400">Verdict</div>
                    <div className="text-sm font-bold text-amber-300 font-mono">
                      {result.verdict}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-mono uppercase text-slate-400">Physics Consistency</div>
                    <div className="text-sm font-bold font-mono text-emerald-400">
                      {result.consistencyScore} / 10
                    </div>
                  </div>
                </div>

                {/* Score bar */}
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${(result.consistencyScore / 10) * 100}%` }}
                  />
                </div>

                {/* Sections */}
                <div className="space-y-3 pt-2">
                  <div className="p-3.5 bg-slate-950/70 rounded-lg border border-slate-800/80 space-y-1">
                    <div className="text-[11px] font-mono font-semibold text-slate-200 uppercase">
                      1. Theoretical Evaluation
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      {result.physicalEvaluation}
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-950/70 rounded-lg border border-slate-800/80 space-y-1">
                    <div className="text-[11px] font-mono font-semibold text-cyan-300 uppercase">
                      2. Relevant Mathematical Formalism
                    </div>
                    <p className="text-slate-300 text-xs font-mono leading-relaxed">
                      {result.mathematicalFormalism}
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-950/70 rounded-lg border border-slate-800/80 space-y-1">
                    <div className="text-[11px] font-mono font-semibold text-amber-300 uppercase">
                      3. Empirical Evidence & Counter-Observations
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      {result.experimentalEvidence}
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-950/70 rounded-lg border border-emerald-500/20 bg-emerald-950/10 space-y-1">
                    <div className="text-[11px] font-mono font-semibold text-emerald-300 uppercase">
                      4. Proposed Experimental Test
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      {result.suggestedExperiment}
                    </p>
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
