import { create } from "zustand";
import { AssessmentStore, WhatIfToggles } from "../types";

const initialWhatIfToggles: WhatIfToggles = {
  enableMfa: false,
  installAntivirus: false,
  updateOs: false,
  uniquePasswords: false,
  secureWifi: false,
};

export const useAssessmentStore = create<AssessmentStore>((set) => ({
  answers: {},
  currentQuestionIndex: 0,
  isSubmitted: false,
  whatIfToggles: initialWhatIfToggles,

  setAnswer: (questionId, value) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: value },
    })),

  nextQuestion: () =>
    set((state) => ({
      currentQuestionIndex: state.currentQuestionIndex + 1,
    })),

  prevQuestion: () =>
    set((state) => ({
      currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1),
    })),

  goToQuestion: (index) =>
    set({ currentQuestionIndex: index }),

  submitAssessment: () =>
    set({ isSubmitted: true }),

  resetAssessment: () =>
    set({
      answers: {},
      currentQuestionIndex: 0,
      isSubmitted: false,
      whatIfToggles: initialWhatIfToggles,
    }),

  setWhatIfToggle: (key, value) =>
    set((state) => ({
      whatIfToggles: { ...state.whatIfToggles, [key]: value },
    })),

  resetWhatIfToggles: () =>
    set({ whatIfToggles: initialWhatIfToggles }),
}));
