import React, { useState } from 'react';

export const ChronosAIProver: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string>(
    'Gravitational Time Dilation at the Event Horizon'
  );
  const [queryInput, setQueryInput] = useState<string>(
    'Prove mathematically and physically why an outside observer never sees an object fall through a black hole horizon, while the falling observer crosses it in finite proper time.'
  );
  const [proofResult, setProofResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const presetQuestions = [
    {
      topic: 'Event Horizon & Infinite Redshift',
      prompt:
        'Prove mathematically and physically why an outside observer never sees an object cross a black hole event horizon, while the falling observer crosses it in finite proper time.',
    },
    {
      topic: 'Quantum Entanglement & Causality',
      prompt:
        'If quantum wave function collapse is instantaneous across cosmic distances (EPR paradox), prove why this does not allow faster-than-light signaling or backward-in-time causation.',
    },
    {
      topic: 'The Wheeler-DeWitt Equation & Timelessness',
      prompt:
        'In canonical quantum gravity, the Wheeler-DeWitt equation ĤΨ = 0 contains no time variable. Prove how time emerges as an apparent phenomenon through quantum entanglement (Page-Wootters mechanism).',
    },
    {
      topic: 'Thermodynamic Arrow & The Past Hypothesis',
      prompt:
        'Prove why the Second Law of Thermodynamics (ΔS ≥ 0) gives a definitive direction to time despite microscopic physical laws being completely time-symmetric (CPT invariant).',
    },
    {
      topic: 'Human Subjective Duration & Cognitive Clock',
      prompt:
        'Explain and prove the neurobiological mechanism of subjective time dilation during life-threatening events (tachypsychia). Why is it a retrospective memory density artifact rather than increased optical sampling?',
    },
  ];

  const handleGenerateProof = async (overridePrompt?: string, overrideTopic?: string) => {
    const q = overridePrompt || queryInput;
    const t = overrideTopic || selectedTopic;
    if (!q.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/ai/proof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: t,
          query: q,
          domain: 'Theoretical Physics & Cognitive Science',
        }),
      });

      const data = await res.json();
      if (data.success && data.proof) {
        setProofResult(data.proof);
      } else {
        setErrorMsg(data.error || 'Failed to generate proof.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error communicating with AI server.');
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
            06. AI Dialectic & Rigorous Prover Engine
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-100">
            Chronos AI: Formal Physical & Empirical Time Prover
          </h2>
        </div>
        <div className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
          Model: <span className="text-amber-400 font-bold">Gemini 3.8 Flash</span> (Physics & Mathematical Engine)
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Preset Questions & Query Input (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Select Deep Paradigm or Inquiry
            </div>

            <div className="space-y-2">
              {presetQuestions.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedTopic(item.topic);
                    setQueryInput(item.prompt);
                    handleGenerateProof(item.prompt, item.topic);
                  }}
                  className={`w-full p-3 rounded-lg border text-left transition-all cursor-pointer text-xs ${
                    queryInput === item.prompt
                      ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <div className="font-semibold font-mono text-[11px] text-amber-400 mb-0.5">
                    {item.topic}
                  </div>
                  <div className="line-clamp-2 text-slate-400 text-[11px] leading-relaxed">
                    {item.prompt}
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Query Input Box */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <label className="block text-xs font-mono text-slate-300">
                Or Pose a Custom Paradox or Hypothesis:
              </label>
              <textarea
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                rows={4}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-400 font-mono resize-none"
                placeholder="Ask any physical, mathematical, or psychological question about time..."
              />
              <button
                onClick={() => handleGenerateProof()}
                disabled={isLoading || !queryInput.trim()}
                className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                    <span>Deriving Mathematical & Physical Proof...</span>
                  </>
                ) : (
                  <span>Derive Rigorous AI Proof</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Generated Proof Display (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-[#06080E] p-6 shadow-inner min-h-[460px] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 text-xs font-mono text-slate-400">
              <span>OUTPUT: FORMAL PHYSICAL DERIVATION & CITATIONS</span>
              {isLoading && <span className="text-amber-400 animate-pulse">Computing geodesics...</span>}
            </div>

            {errorMsg && (
              <div className="p-4 rounded-lg bg-rose-950/40 border border-rose-900/60 text-xs text-rose-300 font-mono">
                {errorMsg}
              </div>
            )}

            {!proofResult && !isLoading && !errorMsg && (
              <div className="py-20 text-center space-y-3">
                <div className="w-12 h-12 rounded-full border border-slate-800 bg-slate-900/80 flex items-center justify-center mx-auto text-amber-400 font-mono text-lg">
                  ∇τ
                </div>
                <div className="text-sm font-semibold text-slate-300">
                  Ready to Generate Proof
                </div>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Select a deep paradigm from the left or type your own question to generate a formal mathematical and empirical proof with experimental citations.
                </p>
              </div>
            )}

            {isLoading && !proofResult && (
              <div className="py-24 text-center space-y-4">
                <div className="w-10 h-10 rounded-full border-2 border-amber-400 border-t-transparent animate-spin mx-auto" />
                <div className="text-xs font-mono text-amber-300">
                  Synthesizing General Relativity, Thermodynamics & Empirical Data...
                </div>
              </div>
            )}

            {proofResult && (
              <div className="prose prose-invert max-w-none text-slate-200 text-xs leading-relaxed space-y-4 font-sans whitespace-pre-wrap">
                {proofResult}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
