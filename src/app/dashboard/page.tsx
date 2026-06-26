"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAssessmentStore } from "@/stores/assessment-store";
import { evaluateRisk } from "@/lib/risk-engine";
import { evaluateCia } from "@/lib/cia-engine";
import { getAttackPaths } from "@/lib/attack-engine";
import { getRecommendations } from "@/lib/recommendation-engine";
import { generatePdfReport } from "@/lib/pdf-report";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  FileDown,
  CheckCircle,
  XCircle,
  Activity,
  Zap
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { answers, isSubmitted, whatIfToggles, setWhatIfToggle, resetWhatIfToggles } =
    useAssessmentStore();

  const [activePathTab, setActivePathTab] = useState("credential-theft");

  // Redirect to assessment if not submitted
  useEffect(() => {
    if (!isSubmitted) {
      router.push("/assessment");
    }
  }, [isSubmitted, router]);

  if (!isSubmitted) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4 text-center">
        <ShieldAlert size={48} className="text-warning animate-bounce" />
        <h2 className="text-xl font-bold text-white">Assessment Required</h2>
        <p className="text-sm text-gray-400 max-w-sm">
          Please complete the 10-question cyber hygiene assessment to generate your personalized risk dashboard.
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

  // Calculate results
  const risk = evaluateRisk(answers, whatIfToggles);
  const cia = evaluateCia(answers, whatIfToggles);
  const attackPaths = getAttackPaths(answers, whatIfToggles);
  const recommendations = getRecommendations(answers);

  // PDF report downloader
  const handleDownloadPdf = () => {
    // Generate active recommendations list
    generatePdfReport(risk, cia, attackPaths, recommendations);
  };

  const handleResetSandbox = () => {
    resetWhatIfToggles();
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Dashboard Title Panel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Risk &amp; Control Command Center</h1>
          <p className="mt-1 text-sm text-gray-400">
            Simulate controls, block attack chains, and export compliance reports.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleResetSandbox}
            className="flex items-center gap-1.5 rounded-xl border border-gray-800 bg-gray-900/30 px-4 py-2.5 text-sm font-semibold text-gray-400 hover:text-white transition hover:bg-gray-800"
          >
            <RefreshCw size={15} />
            Reset Sandbox
          </button>
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-500 hover:shadow-blue-500/20 hover:scale-[1.01] transition-all"
          >
            <FileDown size={15} />
            Download PDF Report
          </button>
        </div>
      </div>

      {/* Top Section: Risk Score & CIA Rings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Risk Gauge Card */}
        <div className="rounded-2xl border border-gray-800 bg-surface p-6 shadow-lg flex flex-col items-center justify-between text-center space-y-4">
          <div className="w-full flex items-center justify-between border-b border-gray-800 pb-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Hygiene Risk Level</span>
            <span className={`text-xs font-bold uppercase ${risk.color}`}>{risk.level}</span>
          </div>

          {/* SVG Risk Arc */}
          <div className="relative flex h-36 w-36 items-center justify-center">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-gray-800"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                className={`transition-all duration-500 ${
                  risk.score > 80 ? "stroke-danger" : risk.score > 60 ? "stroke-danger" : risk.score > 30 ? "stroke-warning" : "stroke-success"
                }`}
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * risk.score) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-white">{risk.score}</span>
              <span className="text-[10px] uppercase font-semibold text-gray-500">Risk Index</span>
            </div>
          </div>

          <p className="text-xs text-gray-500 leading-relaxed px-4">
            Lower scores imply higher resilience. Your baseline risk level is <span className="font-semibold text-white">{risk.level}</span>.
          </p>
        </div>

        {/* CIA Triad Circles Card */}
        <div className="rounded-2xl border border-gray-800 bg-surface p-6 shadow-lg flex flex-col items-center justify-between text-center space-y-4">
          <div className="w-full flex items-center justify-between border-b border-gray-800 pb-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">CIA Triad Security Strength</span>
            <span className="text-xs font-bold text-blue-400 uppercase">Capabilities</span>
          </div>

          {/* Concentric Circles Visualizer */}
          <div className="relative flex h-36 w-36 items-center justify-center">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
              {/* Outer: Confidentiality */}
              <circle cx="50" cy="50" r="40" className="stroke-gray-800/40" strokeWidth="4" fill="transparent" />
              <circle cx="50" cy="50" r="40" className="stroke-primary transition-all duration-500" strokeWidth="4" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * cia.confidentiality) / 100} strokeLinecap="round" />

              {/* Middle: Integrity */}
              <circle cx="50" cy="50" r="30" className="stroke-gray-800/40" strokeWidth="4" fill="transparent" />
              <circle cx="50" cy="50" r="30" className="stroke-accent transition-all duration-500" strokeWidth="4" fill="transparent" strokeDasharray="188.4" strokeDashoffset={188.4 - (188.4 * cia.integrity) / 100} strokeLinecap="round" />

              {/* Inner: Availability */}
              <circle cx="50" cy="50" r="20" className="stroke-gray-800/40" strokeWidth="4" fill="transparent" />
              <circle cx="50" cy="50" r="20" className="stroke-success transition-all duration-500" strokeWidth="4" fill="transparent" strokeDasharray="125.6" strokeDashoffset={125.6 - (125.6 * cia.availability) / 100} strokeLinecap="round" />
            </svg>
            <div className="absolute text-[9px] font-bold text-gray-500 flex flex-col items-center">
              <span className="text-blue-400">C: {cia.confidentiality}%</span>
              <span className="text-purple-400">I: {cia.integrity}%</span>
              <span className="text-green-400">A: {cia.availability}%</span>
            </div>
          </div>

          <div className="flex justify-center gap-4 text-[10px] font-semibold">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500" /> Confidentiality</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-purple-500" /> Integrity</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-green-500" /> Availability</span>
          </div>
        </div>

        {/* What-If Toggle Sandbox Card */}
        <div className="rounded-2xl border border-gray-800 bg-surface p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">What-If Control Sandbox</span>
            <span className="flex items-center gap-1 text-xs font-bold text-green-400">
              <Zap size={12} fill="currentColor" />
              Active Toggles
            </span>
          </div>

          <div className="space-y-3">
            <SandboxToggle
              label="Deploy Multi-Factor Authentication"
              checked={whatIfToggles.enableMfa}
              onChange={(v) => setWhatIfToggle("enableMfa", v)}
            />
            <SandboxToggle
              label="Enforce Unique Passwords"
              checked={whatIfToggles.uniquePasswords}
              onChange={(v) => setWhatIfToggle("uniquePasswords", v)}
            />
            <SandboxToggle
              label="Enable Auto Updates (OS/Browser)"
              checked={whatIfToggles.updateOs}
              onChange={(v) => setWhatIfToggle("updateOs", v)}
            />
            <SandboxToggle
              label="Install Active Antivirus"
              checked={whatIfToggles.installAntivirus}
              onChange={(v) => setWhatIfToggle("installAntivirus", v)}
            />
            <SandboxToggle
              label="Connect with Encrypted VPN"
              checked={whatIfToggles.secureWifi}
              onChange={(v) => setWhatIfToggle("secureWifi", v)}
            />
          </div>
        </div>
      </div>

      {/* Middle Section: Attack Simulator */}
      <div className="rounded-2xl border border-gray-800 bg-surface p-6 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-800 pb-3 gap-3">
          <div className="flex items-center gap-2">
            <Activity className="text-blue-500 animate-pulse" size={18} />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Interactive Attack Path Simulator</span>
          </div>

          <div className="flex rounded-lg bg-gray-900/50 p-1 border border-gray-800">
            {attackPaths.map((path) => (
              <button
                key={path.id}
                onClick={() => setActivePathTab(path.id)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  activePathTab === path.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {path.id === "credential-theft" ? "MFA/Password" : path.id === "ransomware" ? "Ransomware" : "Wi-Fi MitM"}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Attack Path visualization */}
        {attackPaths
          .filter((p) => p.id === activePathTab)
          .map((path) => {
            return (
              <div key={path.id} className="space-y-6">
                <div className="rounded-xl bg-gray-900/20 border border-gray-800 p-4 space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="text-sm font-bold text-white">{path.name}</h3>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      path.isCompromised
                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                        : "bg-green-500/10 text-green-400 border border-green-500/20"
                    }`}>
                      {path.isCompromised ? <XCircle size={12} /> : <CheckCircle size={12} />}
                      {path.isCompromised ? "System Compromised" : "Breach Blocked"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{path.description}</p>
                </div>

                {/* Node visual line map */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6 px-4 py-8 relative">
                  {path.nodes.map((node, idx) => {
                    const isLast = idx === path.nodes.length - 1;
                    const nextLink = path.links.find(l => l.source === node.id);
                    const isLinkActive = nextLink ? nextLink.isActive : false;

                    let statusColor = "border-gray-800 bg-gray-900/40 text-gray-500";
                    let glowClass = "";

                    if (node.status === "active-exploit") {
                      statusColor = "border-danger bg-danger/5 text-danger";
                      glowClass = "shadow-[0_0_15px_rgba(239,68,68,0.2)]";
                    } else if (node.status === "vulnerable") {
                      statusColor = "border-warning bg-warning/5 text-warning";
                    } else if (node.status === "secure") {
                      statusColor = "border-success bg-success/5 text-success";
                    }

                    return (
                      <div key={node.id} className="flex flex-col lg:flex-row items-center w-full lg:w-auto relative">
                        {/* Node Card */}
                        <div className={`relative flex flex-col items-center justify-center p-4 rounded-xl border text-center max-w-[170px] w-full min-h-[90px] transition-all duration-300 ${statusColor} ${glowClass}`}>
                          <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 mb-1">Step {idx + 1}</span>
                          <span className="text-xs font-bold">{node.label}</span>
                          <p className="mt-1.5 text-[10px] opacity-80 leading-normal hidden sm:block">{node.description}</p>
                        </div>

                        {/* Connection arrow/shield block to next node */}
                        {!isLast && (
                          <div className="flex flex-col items-center justify-center min-h-[40px] lg:min-h-0 w-8 lg:w-16 h-8 lg:h-auto">
                            {isLinkActive ? (
                              <div className="flex items-center justify-center flex-col text-red-500 font-bold text-lg rotate-90 lg:rotate-0 animate-pulse">
                                <span>&rarr;</span>
                                <span className="text-[8px] uppercase tracking-wider text-red-500/80 mt-0.5">Active</span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center flex-col text-green-500 font-bold text-lg rotate-90 lg:rotate-0">
                                <Shield className="text-success fill-success/10 animate-bounce" size={18} />
                                <span className="text-[8px] uppercase tracking-wider text-success/80 mt-0.5">Blocked</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>

      {/* Bottom Section: Prioritized Recommendations */}
      <div className="rounded-2xl border border-gray-800 bg-surface p-6 shadow-lg space-y-6">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="text-blue-500" size={18} />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Prioritized Cyber Security Control Action Plan</span>
          </div>
          <span className="text-xs text-gray-500">Sorted by highest risk reduction</span>
        </div>

        {recommendations.length === 0 ? (
          <div className="flex items-center gap-3 rounded-xl bg-green-500/10 p-6 border border-green-500/20 text-green-400">
            <ShieldCheck size={28} />
            <div>
              <h4 className="text-sm font-bold">Hygiene Fully Secured!</h4>
              <p className="text-xs text-green-500/80 mt-1">
                Your assessment answers reflect the highest standard of cyber hygiene controls. No immediate action required.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((rec, idx) => {
              return (
                <div key={rec.id} className="relative group flex border border-gray-800 rounded-xl bg-gray-900/10 p-5 gap-4 overflow-hidden transition hover:border-gray-700">
                  {/* Priority border highlight */}
                  <div className={`absolute top-0 left-0 bottom-0 w-1 ${
                    idx <= 1 ? "bg-red-500" : idx <= 4 ? "bg-warning" : "bg-blue-500"
                  }`} />
                  
                  <div className="flex flex-col justify-between w-full space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between flex-wrap gap-1">
                        <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">{rec.title}</span>
                        <span className="inline-flex rounded bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-400">
                          -{rec.riskReduction} Risk Points
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">{rec.description}</p>
                    </div>

                    {/* Metadata attributes */}
                    <div className="flex items-center justify-between border-t border-gray-800/80 pt-2.5 text-[10px] text-gray-500 font-semibold">
                      <span>Cost: <span className="text-gray-300">{rec.cost}</span></span>
                      <span>Effort: <span className="text-gray-300">{rec.effort}</span></span>
                      <span className="text-blue-400/90">{rec.ciaBenefit}</span>
                    </div>

                    {/* Expandable setup steps preview */}
                    <div className="rounded-lg bg-gray-900/60 p-3 text-[10px] text-gray-400 space-y-1 border border-gray-800/40">
                      <span className="font-bold text-gray-500 uppercase tracking-wider block mb-1">Remediation Steps</span>
                      {rec.steps.map((step, sidx) => (
                        <p key={sidx} className="leading-relaxed font-sans">• {step}</p>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function SandboxToggle({
  label,
  checked,
  onChange
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between rounded-xl border border-gray-800 bg-[#0B0F19]/40 p-3 transition hover:border-gray-700 cursor-pointer">
      <span className="text-xs font-semibold text-gray-300">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:ring-offset-1 focus:ring-offset-[#0B0F19] ${
          checked ? "bg-blue-600" : "bg-gray-800"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </label>
  );
}
