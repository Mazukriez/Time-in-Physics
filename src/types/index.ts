export type SimulationTab = 
  | 'relativity' 
  | 'gravity-gps' 
  | 'entropy' 
  | 'simultaneity' 
  | 'human-perception' 
  | 'ai-prover'
  | 'ai-hypotheses';

export interface ProofSection {
  id: string;
  title: string;
  subtitle: string;
  formula: string;
  empiricalFact: string;
  description: string;
}

export interface HypothesisResult {
  verdict: string;
  consistencyScore: number;
  physicalEvaluation: string;
  experimentalEvidence: string;
  mathematicalFormalism: string;
  suggestedExperiment: string;
}

export interface ThinkerProfile {
  id: string;
  name: string;
  era: string;
  viewpoint: string;
  keyWork: string;
}
