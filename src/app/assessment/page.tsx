"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAssessmentStore } from "@/stores/assessment-store";
import { QUESTIONS } from "@/data/questions";
import {
  ArrowLeft,
  ArrowRight,
  Info,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  CheckCircle,
  Lock,
  UserCheck,
  TrendingDown,
  FileSpreadsheet,
  AlertTriangle
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

  // Onboarding Scan sequence states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanStep, setScanStep] = useState(0);

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const totalQuestions = QUESTIONS.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const currentAnswer = answers[currentQuestion.id];

  const handleRetake = () => {
    if (confirm("Are you sure you want to reset your answers and start a new risk assessment?")) {
      resetAssessment();
    }
  };

  // Onboarding scan scheduler
  useEffect(() => {
    if (isAnalyzing) {
      if (scanStep < 7) {
        const timer = setTimeout(() => {
          setScanStep((prev) => prev + 1);
        }, 400); // 400ms per step = 2.8s total
        return () => clearTimeout(timer);
      } else {
        submitAssessment();
        router.push("/dashboard");
      }
    }
  }, [isAnalyzing, scanStep, submitAssessment, router]);

  const handleNextOrSubmit = () => {
    if (!currentAnswer) return;

    if (isLastQuestion) {
      // Trigger full-screen scanning overlay instead of immediate routing
      setIsAnalyzing(true);
      setScanStep(0);
    } else {
      nextQuestion();
    }
  };

  const progressPercent = Math.round(((currentQuestionIndex) / totalQuestions) * 100);

  // Steps for analysis sequence
  const scanSteps = [
    { label: "Evaluating Password Security", icon: Lock },
    { label: "Checking Authentication Strength", icon: UserCheck },
    { label: "Calculating Cyber Risk Score", icon: ShieldAlert },
    { label: "Mapping Lateral Attack Paths", icon: AlertTriangle },
    { label: "Evaluating CIA Triad Impact", icon: TrendingDown },
    { label: "Prioritizing Actions & Recommendations", icon: FileSpreadsheet },
    { label: "Preparing Security Dashboard", icon: ShieldCheck },
  ];

  // Full-screen scanner overlay
  if (isAnalyzing) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B0F19] bg-grid-pattern p-6">
        <div className="absolute inset-0 bg-[#0B0F19]/50 backdrop-blur-sm pointer-events-none" />
        
        <div className="relative w-full max-w-lg rounded-2xl border border-white/[0.05] bg-[#111827]/90 p-8 shadow-2xl space-y-8 animate-fade-in-up text-center">
          <div className="space-y-3">
            {/* Spinning scanner graphic */}
            <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <Loader2 className="animate-spin" size={28} />
              <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-ping" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide">Threat &amp; Compliance Audit</h2>
            <p className="text-xs text-gray-500">Processing security questionnaire. Generating custom scorecards...</p>
          </div>

          <div className="space-y-3.5 text-left max-w-sm mx-auto">
            {scanSteps.map((step, idx) => {
              const StepIcon = step.icon;
              const isChecked = scanStep > idx;
              const isActive = scanStep === idx;

              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between rounded-lg p-2.5 transition-all duration-300 border ${
                    isChecked
                      ? "border-green-500/10 bg-green-500/5 text-green-400 opacity-90"
                      : isActive
                      ? "border-blue-500/20 bg-blue-500/5 text-blue-400 font-semibold"
                      : "border-transparent text-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-3 text-xs">
                    <StepIcon size={14} className={isActive ? "animate-pulse" : ""} />
                    <span>{step.label}</span>
                  </div>
                  <div>
                    {isChecked ? (
                      <CheckCircle size={14} className="text-green-500 animate-scale-in" />
                    ) : isActive ? (
                      <Loader2 className="animate-spin text-blue-500" size={14} />
                    ) : (
                      <div className="h-3 w-3 rounded-full border border-gray-800" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-10 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/[0.04] pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Hygiene Audit Simulator</h1>
          <p className="mt-1 text-sm text-gray-400">
            Submit your parameters to compile threat matrices and test mitigations.
          </p>
        </div>
        {isSubmitted && (
          <button
            onClick={handleRetake}
            className="flex items-center gap-2 rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-2.5 text-xs font-semibold text-gray-300 transition-all hover:bg-white/[0.04] hover:text-white"
          >
            <RotateCcw size={13} />
            Reset Audit
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Question Form */}
        <div className="lg:col-span-8 space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-bold tracking-widest text-gray-500 uppercase">
              <span>Auditing Progress</span>
              <span>
                Question {currentQuestionIndex + 1} of {totalQuestions} ({progressPercent}%)
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.03]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          {/* Main Card */}
          <div className="rounded-2xl border border-white/[0.04] bg-[#111827]/75 backdrop-blur-md p-6 sm:p-8 shadow-xl space-y-6 animate-fade-in-up">
            {/* Category */}
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-[10px] font-bold tracking-widest text-blue-400 border border-blue-500/20 uppercase">
                {currentQuestion.category}
              </span>
              <span className="text-[10px] text-gray-500 font-mono">QID: {currentQuestion.id}</span>
            </div>

            {/* Title */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white leading-snug sm:text-2xl">
                {currentQuestion.question}
              </h2>
              <div className="flex gap-3 rounded-xl border border-white/[0.04] bg-white/[0.01] p-4 text-xs text-gray-400">
                <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="leading-relaxed font-sans">{currentQuestion.description}</p>
              </div>
            </div>

            {/* Dynamic Selection Cards */}
            <div className="space-y-3.5">
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
                    className={`group flex items-start gap-4 rounded-xl border p-4 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500/50 ${
                      isSelected
                        ? "border-blue-500/60 bg-blue-500/[0.03] shadow-[0_0_15px_rgba(59,130,246,0.12)]"
                        : "border-white/[0.05] bg-white/[0.02] backdrop-blur-md hover:border-white/[0.1] hover:bg-white/[0.04] hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)]"
                    }`}
                  >
                    {/* SVG Radio indicator */}
                    <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                      isSelected ? "border-blue-500 text-blue-500" : "border-gray-700 group-hover:border-gray-500"
                    }`}>
                      {isSelected && <div className="h-2 w-2 rounded-full bg-blue-500" />}
                    </div>

                    <div className="space-y-1">
                      <p className={`text-xs font-bold transition-colors ${isSelected ? "text-blue-400" : "text-gray-300"}`}>
                        {option.label}
                      </p>
                      <p className="text-[11px] text-gray-500 leading-normal font-sans">
                        {option.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between border-t border-white/[0.04] pt-6">
              <button
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-1.5 rounded-xl border border-white/[0.05] bg-white/[0.01] px-4 py-2.5 text-xs font-semibold text-gray-400 transition hover:bg-white/[0.03] hover:text-white disabled:opacity-30 disabled:pointer-events-none"
              >
                <ArrowLeft size={14} />
                Back
              </button>

              <button
                onClick={handleNextOrSubmit}
                disabled={!currentAnswer}
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg transition hover:bg-blue-500 hover:shadow-blue-500/20 disabled:opacity-40 disabled:pointer-events-none hover:scale-[1.01]"
              >
                {isLastQuestion ? "Submit Assessment" : "Next Question"}
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Command Hub Grid Index */}
        <div className="lg:col-span-4 rounded-2xl border border-white/[0.04] bg-[#111827]/30 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Navigation Hub</span>
            <span className="text-[10px] text-gray-500">{QUESTIONS.filter(q => !!answers[q.id]).length} / {totalQuestions} Answered</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {QUESTIONS.map((q, idx) => {
              const hasAnswer = !!answers[q.id];
              const isCurrent = idx === currentQuestionIndex;
              
              let statusBorder = "border-white/[0.04] bg-white/[0.005] text-gray-500 hover:border-white/[0.08]";
              if (isCurrent) {
                statusBorder = "border-blue-500 bg-blue-500/10 text-blue-400 font-bold shadow-[0_0_10px_rgba(59,130,246,0.05)]";
              } else if (hasAnswer) {
                statusBorder = "border-indigo-500/20 bg-indigo-500/5 text-indigo-400 font-semibold";
              }

              return (
                <button
                  key={q.id}
                  onClick={() => goToQuestion(idx)}
                  className={`flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-all ${statusBorder}`}
                >
                  <span className="text-[8px] font-bold uppercase tracking-widest opacity-60">Step {idx + 1}</span>
                  <span className="text-[10px] truncate w-full font-medium">{q.category}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
