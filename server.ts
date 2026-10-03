import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint: Rigorous Time Proof & Explanation Engine
app.post('/api/ai/proof', async (req, res) => {
  try {
    const { topic, query, domain, context } = req.body;

    const systemPrompt = `You are a world-class theoretical physicist, neuroscientist, and philosopher of science specializing in the physics and human perception of time.
Your task is to provide an authoritative, clear, and mathematically/empirically rigorous proof and explanation of the user's inquiry regarding time.

Structure your response with clarity:
1. Core Thesis & Fundamental Principle: The exact physical or neurological mechanism.
2. Formal Mathematical / Empirical Proof: Derivation, formulas (using clean readable text / LaTeX style formulas like γ = 1/√(1-v²/c²), S = k ln Ω, Δt' = Δt √(1 - 2GM/rc²), or pacemaker-accumulator rate equations), and geometric or statistical logic.
3. Decisive Experimental Proof: The real physical or perceptual experiments that proved this (e.g., Hafele-Keating atomic clocks, GPS timing drift, Pound-Rebka redshift, optical lattice clocks at 1mm elevation, Eagleman free-fall chronometer, SCN gene knockout studies).
4. Human Phenomenological Dimension: How this translates to human consciousness, memory encoding, perceived duration, and the "illusion" or reality of the present moment ("the specious present").
5. Counter-Intuitive Thought Experiment: A visceral, memorable scenario that demonstrates the truth of this proof.`;

    const promptText = `Topic: ${topic || 'General Nature of Time'}
Domain: ${domain || 'Physics & Human Experience'}
Inquiry / Paradox: ${query}
Contextual parameters: ${JSON.stringify(context || {})}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.4,
      },
    });

    const proofText = response.text || 'Unable to generate proof at this moment.';
    res.json({ success: true, proof: proofText });
  } catch (error: any) {
    console.error('Error in /api/ai/proof:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'An error occurred while formulating the proof.',
    });
  }
});

// Endpoint: Socratic Paradox Resolution & Historic Dialogue
app.post('/api/ai/dialogue', async (req, res) => {
  try {
    const { paradoxId, userArgument, thinker } = req.body;

    const systemInstruction = `You are an AI Socratic Philosopher and Theoretical Physicist specializing in temporal paradoxes (Twin Paradox, Grandfather Paradox, Boltzmann Brain, Loschmidt Paradox, Wheeler-DeWitt Timeless Universe, Specious Present).
If a thinker is selected (${thinker || 'Albert Einstein'}), embody their scientific worldview, mathematical precision, and historic voice while answering modern questions rigorously.
Resolve the paradox clearly by pointing out which intuitive assumption breaks down (e.g., non-inertial frames, entropy gradients, relativity of simultaneity, or memory bias).`;

    const userPrompt = `Paradox/Scenario: ${paradoxId}
Thinker Lens: ${thinker || 'Albert Einstein'}
User's Question/Hypothesis: "${userArgument}"
Please resolve the paradox, point out flawed classical intuition, and provide the exact physical resolution.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.6,
      },
    });

    res.json({ success: true, analysis: response.text || '' });
  } catch (error: any) {
    console.error('Error in /api/ai/dialogue:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error processing dialogue.',
    });
  }
});

// Endpoint: Hypothesis Laboratory
app.post('/api/ai/test-hypothesis', async (req, res) => {
  try {
    const { hypothesis } = req.body;

    const systemPrompt = `You evaluate novel physical or psychological hypotheses about time.
Evaluate the user's hypothesis with scientific rigor.
Return a structured JSON with:
- verdict: "Validated by Modern Physics" | "Partially Supported" | "Refuted by Empirical Observation" | "Speculative Frontier Hypothesis"
- consistencyScore: number from 1 to 10
- physicalEvaluation: comprehensive breakdown of theoretical consistency (Special/General Relativity, Thermodynamics, Quantum Mechanics, Neuroscience)
- experimentalEvidence: real-world experiments that test or conflict with this hypothesis
- mathematicalFormalism: relevant equations or theoretical frameworks
- suggestedExperiment: how a modern laboratory could empirically probe this hypothesis`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Evaluate this hypothesis about time: "${hypothesis}"`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verdict: { type: Type.STRING },
            consistencyScore: { type: Type.NUMBER },
            physicalEvaluation: { type: Type.STRING },
            experimentalEvidence: { type: Type.STRING },
            mathematicalFormalism: { type: Type.STRING },
            suggestedExperiment: { type: Type.STRING },
          },
          required: [
            'verdict',
            'consistencyScore',
            'physicalEvaluation',
            'experimentalEvidence',
            'mathematicalFormalism',
            'suggestedExperiment',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error in /api/ai/test-hypothesis:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to evaluate hypothesis.',
    });
  }
});

// Production vs Development Vite middleware
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`Chronos Physics & Perception server listening on http://localhost:${PORT}`);
  });
}

startServer();
