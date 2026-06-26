"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAssessmentStore } from "@/stores/assessment-store";
import { QUESTIONS } from "@/data/questions";
import { evaluateRisk } from "@/lib/risk-engine";
import { evaluateCia } from "@/lib/cia-engine";
import { getAttackPaths } from "@/lib/attack-engine";
import { getRecommendations } from "@/lib/recommendation-engine";
import { generatePdfReport } from "@/lib/pdf-report";
import {
  FileText,
  FileDown,
  ShieldAlert,
  ArrowRight,
  CheckCircle,
  HelpCircle
} from "lucide-react";

export default function ReportsPage() {
  const router = useRouter();
  const { answers, isSubmitted, whatIfToggles } = useAssessmentStore();

  useEffect(() => {
    if (!isSubmitted) {
      router.push("/assessment");
    }
  }, [isSubmitted, router]);

  if (!isSubmitted) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4 text-center">
        <ShieldAlert size={48} className="text-warning animate-bounce" />
        <h2 className="text-xl font-bold text-white">No Reports Found</h2>
        <p className="text-sm text-gray-400 max-w-sm">
          Please complete the 10-question cyber hygiene assessment to generate and view your security audit report.
        </p>
        <button
          onClick={() => router.push("/assessment")}
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-500"
        >
          Start Assessment
          <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  // Calculate parameters for PDF
  const risk = evaluateRisk(answers, whatIfToggles);
  const cia = evaluateCia(answers, whatIfToggles);
  const attackPaths = getAttackPaths(answers, whatIfToggles);
  const recommendations = getRecommendations(answers);

  const handleDownload = () => {
    generatePdfReport(risk, cia, attackPaths, recommendations);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Security Audit Archive</h1>
          <p className="mt-1 text-sm text-gray-400">
            Review your answered questions audit trail and export reports.
          </p>
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-500 hover:shadow-blue-500/20 hover:scale-[1.01] transition-all"
        >
          <FileDown size={15} />
          Download PDF Report
        </button>
      </div>

      {/* Audit Overview card */}
      <div className="rounded-2xl border border-gray-800 bg-surface p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-blue-400 border-b border-gray-800/80 pb-3">
          <FileText size={18} />
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-300">Audit Summary Details</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-xl border border-gray-800 bg-[#0B0F19]/40 p-4 space-y-1">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Report Format</span>
            <p className="text-xs font-bold text-white">Portable Document Format (PDF)</p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-[#0B0F19]/40 p-4 space-y-1">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Assessment Status</span>
            <p className="text-xs font-bold text-green-400 flex items-center gap-1">
              <CheckCircle size={12} /> Complete
            </p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-[#0B0F19]/40 p-4 space-y-1">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Risk Level (Active)</span>
            <p className={`text-xs font-bold ${risk.color}`}>{risk.level} ({risk.score}/100)</p>
          </div>
        </div>
      </div>

      {/* Answers List Trail */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <HelpCircle className="text-blue-500" size={18} />
          Your Submitted Responses
        </h3>

        <div className="space-y-4">
          {QUESTIONS.map((q, idx) => {
            const selectedVal = answers[q.id];
            const option = q.options.find((o) => o.value === selectedVal);
            const isSecure = option?.scoreImpact === 0;

            return (
              <div
                key={q.id}
                className="rounded-xl border border-gray-800 bg-[#0B0F19]/20 p-5 space-y-2.5 transition hover:border-gray-700"
              >
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-blue-400/90 uppercase tracking-wider">
                      Question {idx + 1} &bull; {q.category}
                    </span>
                    <h4 className="text-xs font-bold text-white leading-normal">{q.question}</h4>
                  </div>
                  <span className={`inline-flex rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                    isSecure
                      ? "bg-green-500/10 text-green-400 border border-green-500/20"
                      : "bg-red-500/10 text-red-400 border border-red-500/20"
                  }`}>
                    {isSecure ? "Secure" : "Insecure Option (+ " + option?.scoreImpact + " Risk)"}
                  </span>
                </div>

                {option && (
                  <div className="rounded-lg bg-gray-900/40 p-3 border border-gray-800/40 text-[11px] text-gray-400 space-y-1">
                    <p className="font-bold text-gray-300">Selected: {option.label}</p>
                    <p className="leading-relaxed leading-normal text-gray-500 font-sans">{option.description}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
