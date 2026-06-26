"use client";

import { useRouter } from "next/navigation";
import { useAssessmentStore } from "@/stores/assessment-store";
import { QUESTIONS } from "@/data/questions";
import {
  ArrowLeft,
  ArrowRight,
  Info,
  RotateCcw
} from "lucide-react";

export default function AssessmentPage() {
  const router = useRouter();
  const {
    answers,
    currentQuestionIndex,
    isSubmitted,
    setAnswer,
    nextQuestion,
    prevQuestion,
    goToQuestion,
    submitAssessment,
    resetAssessment
  } = useAssessmentStore();

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const totalQuestions = QUESTIONS.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const currentAnswer = answers[currentQuestion.id];

  // If already submitted and user visits assessment, let them review or retake
  const handleRetake = () => {
    if (confirm("Are you sure you want to reset your answers and start a new risk assessment?")) {
      resetAssessment();
    }
  };

  const handleNextOrSubmit = () => {
    if (!currentAnswer) return; // Enforce answering

    if (isLastQuestion) {
      submitAssessment();
      router.push("/dashboard");
    } else {
      nextQuestion();
    }
  };

  const progressPercent = Math.round(((currentQuestionIndex) / totalQuestions) * 100);

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Cyber Hygiene Audit</h1>
          <p className="mt-1 text-sm text-gray-400">
            Answer the following questions honestly to determine your security posture.
          </p>
        </div>
        {isSubmitted && (
          <button
            onClick={handleRetake}
            className="flex items-center gap-1.5 rounded-lg border border-gray-800 bg-gray-900/50 px-3.5 py-2 text-xs font-semibold text-gray-300 transition hover:bg-gray-800 hover:text-white"
          >
            <RotateCcw size={14} />
            Reset &amp; Retake
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-medium text-gray-500">
          <span>PROGRESS</span>
          <span>
            Question {currentQuestionIndex + 1} of {totalQuestions} ({progressPercent}%)
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Wizard Card */}
      <div className="rounded-2xl border border-gray-800 bg-surface p-6 shadow-xl sm:p-8 space-y-6">
        {/* Category Header */}
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold tracking-wider text-blue-400 border border-blue-500/20 uppercase">
            {currentQuestion.category}
          </span>
        </div>

        {/* Question Text */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white sm:text-2xl">
            {currentQuestion.question}
          </h2>
          <div className="flex gap-2 rounded-xl bg-gray-900/40 p-4 border border-gray-800/40 text-xs text-gray-400">
            <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{currentQuestion.description}</p>
          </div>
        </div>

        {/* Answer Options */}
        <div className="space-y-4">
          {currentQuestion.options.map((option) => {
            const isSelected = currentAnswer === option.value;
            return (
              <div
                key={option.value}
                onClick={() => setAnswer(currentQuestion.id, option.value)}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    setAnswer(currentQuestion.id, option.value);
                  }
                }}
                tabIndex={0}
                role="radio"
                aria-checked={isSelected}
                className={`group flex items-start gap-4 rounded-xl border p-4 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                  isSelected
                    ? "border-blue-500 bg-blue-600/5 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                    : "border-gray-800 bg-[#0B0F19]/40 hover:border-gray-700 hover:bg-gray-800/20"
                }`}
              >
                {/* Radio indicator */}
                <div className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-gray-600 group-hover:border-gray-400">
                  {isSelected && <div className="h-2 w-2 rounded-full bg-blue-500" />}
                </div>

                <div className="space-y-1">
                  <p className={`text-sm font-semibold transition-colors ${isSelected ? "text-blue-400" : "text-gray-300"}`}>
                    {option.label}
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {option.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Wizard Controls */}
        <div className="flex items-center justify-between border-t border-gray-800/60 pt-6">
          <button
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-1.5 rounded-xl border border-gray-800 bg-gray-900/20 px-4 py-2.5 text-sm font-semibold text-gray-400 transition hover:bg-gray-800 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <button
            onClick={handleNextOrSubmit}
            disabled={!currentAnswer}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-blue-500 hover:shadow-blue-500/20 disabled:opacity-40 disabled:pointer-events-none hover:scale-[1.01]"
          >
            {isLastQuestion ? "Submit Assessment" : "Next Question"}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Grid Jump Quick Links */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/10 p-4 text-center space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Jump to Question</span>
        <div className="flex justify-center flex-wrap gap-2">
          {QUESTIONS.map((q, idx) => {
            const hasAnswer = !!answers[q.id];
            const isCurrent = idx === currentQuestionIndex;
            return (
              <button
                key={q.id}
                onClick={() => goToQuestion(idx)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition border ${
                  isCurrent
                    ? "bg-blue-600 text-white border-blue-500"
                    : hasAnswer
                    ? "bg-blue-950/20 border-blue-800/50 text-blue-400"
                    : "bg-gray-900/50 border-gray-800 text-gray-500 hover:border-gray-700 hover:text-gray-300"
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
