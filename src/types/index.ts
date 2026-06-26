export interface CiaImpact {
  confidentiality: number; // 0 to 100 representing risk increase (security decrease)
  integrity: number;
  availability: number;
}

export interface Option {
  label: string;
  value: string;
  scoreImpact: number; // risk points contribution (0 to 100)
  ciaImpact: CiaImpact;
  description: string;
}

export interface Question {
  id: string;
  category: string;
  question: string;
  description: string;
  options: Option[];
}

export interface WhatIfToggles {
  enableMfa: boolean;
  installAntivirus: boolean;
  updateOs: boolean;
  uniquePasswords: boolean;
  secureWifi: boolean;
}

export interface AssessmentStore {
  answers: Record<string, string>;
  currentQuestionIndex: number;
  isSubmitted: boolean;
  whatIfToggles: WhatIfToggles;
  setAnswer: (questionId: string, value: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  goToQuestion: (index: number) => void;
  submitAssessment: () => void;
  resetAssessment: () => void;
  setWhatIfToggle: (key: keyof WhatIfToggles, value: boolean) => void;
  resetWhatIfToggles: () => void;
}

export interface RiskEvaluation {
  score: number;
  level: "Low" | "Medium" | "High" | "Critical";
  color: string; // Tailwind color class or hex
}

export interface CiaScore {
  confidentiality: number; // 0 to 100% security
  integrity: number;
  availability: number;
}

export interface AttackNode {
  id: string;
  label: string;
  description: string;
  status: "secure" | "vulnerable" | "active-exploit";
  mitigationText: string;
}

export interface AttackLink {
  source: string;
  target: string;
  isActive: boolean;
}

export interface AttackPath {
  id: string;
  name: string;
  description: string;
  nodes: AttackNode[];
  links: AttackLink[];
  isCompromised: boolean;
  triggerVulnerability: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  effort: "Low" | "Medium" | "High";
  cost: "Free" | "Low" | "Medium" | "High";
  riskReduction: number; // points reduced
  ciaBenefit: string; // e.g., "Improves Confidentiality & Integrity"
  steps: string[];
}
