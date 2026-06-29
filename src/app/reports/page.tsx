"use client";

import { useEffect, useState } from "react";
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
  CheckCircle,
  HelpCircle,
  ChevronRight,
  Loader2,
  Activity
} from "lucide-react";

export default function ReportsPage() {
  const router = useRouter();
  const { answers, isSubmitted, whatIfToggles } = useAssessmentStore();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!isSubmitted) {
      router.push("/assessment");
    }
  }, [isSubmitted, router]);

  if (!isSubmitted) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 text-center">
        <Loader2 className="animate-spin text-blue-500" size={32} />
        <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Redirecting to active audit portal...</span>
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

  // Tooltip descriptions for categories
  const categoryTooltips: Record<string, string> = {
    "Identity & Access Control": "Audits authentication bounds and brute-force defenses.",
    "System & Endpoint Security": "Audits device-level updates, antivirus, and privilege limitations.",
    "Network Security": "Audits packet encryption, untrusted connections, and browser sandboxing.",
    "Data Protection & Backups": "Audits backup redundancy strategies and software supply integrity."
  };

  return (
    <div className="space-y-8 pb-16 bg-grid-pattern relative">
      {/* Background Glow */}
      <div className="absolute top-20 left-10 h-[300px] w-[300px] rounded-full bg-purple-500/5 blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/[0.04] pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Audit History &amp; Trail</h1>
          <p className="mt-1 text-sm text-gray-400">
            Review response logs and export your academic audit report.
          </p>
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-500/10 hover:bg-blue-500 hover:scale-[1.01] transition-all"
        >
          <FileDown size={13} />
          Download Audit Report
        </button>
      </div>

      {/* Audit Meta Indicators Cards */}
      <div className="rounded-2xl border border-white/[0.04] bg-[#111827]/40 backdrop-blur-md p-6 shadow-xl space-y-4 animate-fade-in-up">
        <div className="flex items-center gap-2 text-gray-400 border-b border-white/[0.03] pb-3">
          <FileText size={15} className="text-blue-400" />
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Audit Trails Overview</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-xl border border-white/[0.04] bg-[#0B0F19]/40 p-4 space-y-1.5">
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Document Specifications</span>
            <p className="text-xs font-bold text-white">Portable PDF &bull; A4 Vector Grid</p>
          </div>
          <div className="rounded-xl border border-white/[0.04] bg-[#0B0F19]/40 p-4 space-y-1.5">
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Assessment Integrity</span>
            <p className="text-xs font-bold text-green-400 flex items-center gap-1.5">
              <CheckCircle size={13} /> Statically Checked &amp; Verified
            </p>
          </div>
          <div className="rounded-xl border border-white/[0.04] bg-[#0B0F19]/40 p-4 space-y-1.5">
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Active Baseline Risk Index</span>
            <p className={`text-xs font-bold ${
              risk.score > 60 ? "text-red-400" : risk.score > 30 ? "text-amber-400" : "text-green-400"
            }`}>
              {risk.level} ({risk.score}/100 Risk Points)
            </p>
          </div>
        </div>
      </div>

      {/* Accordion Answers Trail */}
      <div className="space-y-5 animate-fade-in-up delay-100">
        <h3 className="text-base font-bold text-white flex items-center gap-2 tracking-wide">
          <Activity className="text-blue-500" size={16} />
          Response Analysis &amp; Vulnerability Mapping
        </h3>

        <div className="space-y-3.5">
          {QUESTIONS.map((q, idx) => {
            const selectedVal = answers[q.id];
            const option = q.options.find((o) => o.value === selectedVal);
            const isSecure = option?.scoreImpact === 0;
            const isExpanded = expandedIndex === idx;

            return (
              <div
                key={q.id}
                className="group rounded-xl border border-white/[0.04] bg-[#111827]/10 p-5 space-y-3.5 transition hover:border-white/[0.08]"
              >
                {/* Header click toggle */}
                <div
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="flex items-start justify-between gap-4 cursor-pointer"
                >
                  <div className="space-y-1 w-full">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono tracking-wider opacity-50">QUESTION {idx + 1}</span>
                      <span>&bull;</span>
                      
                      {/* Tooltip trigger for category */}
                      <span className="tooltip-trigger inline-flex items-center gap-1 text-[9px] font-bold text-blue-400/90 uppercase tracking-widest cursor-help">
                        {q.category}
                        <HelpCircle size={10} className="opacity-60" />
                        
                        {/* Tooltip Box */}
                        <span className="tooltip-box bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-48 rounded-lg border border-white/[0.06] bg-[#161B26] p-2 text-left text-[8px] text-gray-400 shadow-xl leading-normal font-sans normal-case tracking-normal">
                          {categoryTooltips[q.category] || "Security domain classification."}
                        </span>
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white leading-normal tracking-wide">{q.question}</h4>
                  </div>
                  
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`inline-flex rounded px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider border ${
                      isSecure
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : "bg-red-500/10 text-red-400 border-red-500/20"
                    }`}>
                      {isSecure ? "Secure" : "Insecure option (+ " + option?.scoreImpact + " Risk)"}
                    </span>
                    <ChevronRight
                      size={14}
                      className={`text-gray-500 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                    />
                  </div>
                </div>

                {/* Collapsible Disclosure details */}
                {isExpanded && option && (
                  <div className="rounded-xl bg-[#0B0F19]/60 p-4 border border-white/[0.03] text-xs text-gray-400 space-y-2 animate-fade-in-up">
                    <div className="flex items-center gap-1.5 text-xs text-gray-300 font-bold">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      <span>Submitted Answer:</span>
                      <span className="text-blue-400">{option.label}</span>
                    </div>
                    <p className="leading-relaxed leading-normal text-gray-500 font-sans">{option.description}</p>
                    
                    {/* Security impact metadata */}
                    <div className="border-t border-white/[0.03] pt-2.5 mt-2 flex flex-wrap gap-x-6 gap-y-2 text-[10px] text-gray-500">
                      <span>Confidentiality Impairment: <span className={option.ciaImpact.confidentiality > 0 ? "text-red-400 font-semibold" : "text-gray-400"}>+{option.ciaImpact.confidentiality}%</span></span>
                      <span>Integrity Impairment: <span className={option.ciaImpact.integrity > 0 ? "text-red-400 font-semibold" : "text-gray-400"}>+{option.ciaImpact.integrity}%</span></span>
                      <span>Availability Impairment: <span className={option.ciaImpact.availability > 0 ? "text-red-400 font-semibold" : "text-gray-400"}>+{option.ciaImpact.availability}%</span></span>
                    </div>
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
