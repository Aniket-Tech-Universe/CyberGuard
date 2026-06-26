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
  ShieldCheck,
  RefreshCw,
  FileDown,
  CheckCircle,
  XCircle,
  Activity,
  Zap,
  ChevronRight
} from "lucide-react";

// Animated counter hook helper
function AnimatedCounter({ value }: { value: number }) {
  const [displayVal, setDisplayVal] = useState(0);

  useEffect(() => {
    const start = displayVal;
    const end = value;
    if (start === end) return;
    const duration = 600; // ms
    const range = end - start;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Easing out quadratic
      const ease = progress * (2 - progress);
      setDisplayVal(Math.round(start + range * ease));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span>{displayVal}</span>;
}

export default function DashboardPage() {
  const router = useRouter();
  const { answers, isSubmitted, whatIfToggles, setWhatIfToggle, resetWhatIfToggles } =
    useAssessmentStore();

  const [activePathTab, setActivePathTab] = useState("credential-theft");
  const [expandedRecId, setExpandedRecId] = useState<string | null>(null);

  // Redirect if not submitted
  useEffect(() => {
    if (!isSubmitted) {
      router.push("/assessment");
    }
  }, [isSubmitted, router]);

  if (!isSubmitted) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 text-center">
        <LoaderSpinner />
      </div>
    );
  }

  // Calculate parameters
  const risk = evaluateRisk(answers, whatIfToggles);
  const healthScore = Math.max(0, 100 - risk.score);
  const cia = evaluateCia(answers, whatIfToggles);
  const attackPaths = getAttackPaths(answers, whatIfToggles);
  const recommendations = getRecommendations(answers);

  const handleDownloadPdf = () => {
    generatePdfReport(risk, cia, attackPaths, recommendations);
  };

  const handleResetSandbox = () => {
    resetWhatIfToggles();
  };

  // Needle degrees: 0 score = -90deg, 100 score = 90deg
  const needleRotation = (risk.score / 100) * 180 - 90;

  return (
    <div className="space-y-8 pb-16 bg-grid-pattern relative">
      {/* Dynamic Background Glows */}
      <div className="absolute top-20 right-10 h-[300px] w-[300px] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

      {/* Title Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-white/[0.04] pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Risk Command Center</h1>
          <p className="mt-1 text-sm text-gray-400">
            Real-time threat modeling, control simulations, and compliance reports.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleResetSandbox}
            className="flex items-center gap-2 rounded-xl border border-white/[0.05] bg-white/[0.01] hover:bg-white/[0.03] px-4 py-2.5 text-xs font-semibold text-gray-400 hover:text-white transition"
          >
            <RefreshCw size={13} />
            Reset Sandbox
          </button>
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-500/10 hover:bg-blue-500 hover:scale-[1.01] transition-all"
          >
            <FileDown size={13} />
            Export Compliance Report
          </button>
        </div>
      </div>

      {/* Main Grid: Mission Control Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Columns sidebar: Metrics Controls */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Risk Level gauge */}
          <div className="rounded-2xl border border-white/[0.04] bg-[#111827]/40 backdrop-blur-md p-6 shadow-xl space-y-6 flex flex-col items-center text-center animate-fade-in-up">
            <div className="w-full flex items-center justify-between border-b border-white/[0.03] pb-3">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Risk Posture</span>
              <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded ${
                risk.score > 80 ? "bg-red-500/10 text-red-400 border border-red-500/20" : risk.score > 60 ? "bg-red-500/10 text-red-400" : risk.score > 30 ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-green-500/10 text-green-400 border border-green-500/20"
              }`}>
                {risk.level}
              </span>
            </div>

            {/* SVG semi-circle pointer dial */}
            <div className="relative flex h-32 w-48 items-end justify-center overflow-hidden">
              <svg className="absolute top-0 left-0 h-full w-full" viewBox="0 0 100 60">
                {/* Dial background arc */}
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  className="stroke-white/[0.02]"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                {/* Colored progress arc */}
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  className={`transition-all duration-700 ease-out ${
                    risk.score > 60 ? "stroke-red-500" : risk.score > 30 ? "stroke-amber-500" : "stroke-green-500"
                  }`}
                  strokeWidth="8"
                  strokeDasharray="125.6"
                  strokeDashoffset={125.6 - (125.6 * risk.score) / 100}
                  strokeLinecap="round"
                />
                
                {/* Needle Center Pivot */}
                <circle cx="50" cy="50" r="4" className="fill-white" />
                <circle cx="50" cy="50" r="2" className="fill-gray-900" />
                
                {/* Needle Pointer */}
                <line
                  x1="50" y1="50" x2="50" y2="15"
                  className="stroke-white stroke-2"
                  style={{
                    transform: `rotate(${needleRotation}deg)`,
                    transformOrigin: "50px 50px",
                    transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1)"
                  }}
                />
              </svg>
              
              <div className="absolute bottom-0 flex flex-col items-center">
                <span className="text-3xl font-black text-white tracking-tight">
                  <AnimatedCounter value={risk.score} />
                </span>
                <span className="text-[8px] uppercase tracking-wider text-gray-500">Risk Score Index</span>
              </div>
            </div>

            <p className="text-[11px] text-gray-500 leading-relaxed max-w-xs font-sans">
              Calculated based on answers and active overrides. Target is a lower score.
            </p>
          </div>

          {/* Security Health / CIA rings */}
          <div className="rounded-2xl border border-white/[0.04] bg-[#111827]/40 backdrop-blur-md p-6 shadow-xl space-y-6 flex flex-col items-center text-center animate-fade-in-up delay-100">
            <div className="w-full flex items-center justify-between border-b border-white/[0.03] pb-3">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Security Health &amp; CIA Strength</span>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wide">Metrics</span>
            </div>

            {/* Health index card */}
            <div className="flex justify-between items-center w-full px-4 py-3 rounded-xl border border-white/[0.03] bg-white/[0.005]">
              <span className="text-xs font-semibold text-gray-400">Security Health</span>
              <span className="text-xl font-extrabold text-white flex items-center gap-1.5">
                <ShieldCheck size={18} className="text-indigo-400" />
                <AnimatedCounter value={healthScore} />%
              </span>
            </div>

            {/* Concentric CIA rings */}
            <div className="relative flex h-36 w-36 items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                {/* Confidentiality Outer */}
                <circle cx="50" cy="50" r="40" className="stroke-white/[0.02]" strokeWidth="4" fill="transparent" />
                <circle cx="50" cy="50" r="40" className="stroke-blue-500 transition-all duration-700 ease-out" strokeWidth="4" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * cia.confidentiality) / 100} strokeLinecap="round" />

                {/* Integrity Middle */}
                <circle cx="50" cy="50" r="30" className="stroke-white/[0.02]" strokeWidth="4" fill="transparent" />
                <circle cx="50" cy="50" r="30" className="stroke-purple-500 transition-all duration-700 ease-out" strokeWidth="4" fill="transparent" strokeDasharray="188.4" strokeDashoffset={188.4 - (188.4 * cia.integrity) / 100} strokeLinecap="round" />

                {/* Availability Inner */}
                <circle cx="50" cy="50" r="20" className="stroke-white/[0.02]" strokeWidth="4" fill="transparent" />
                <circle cx="50" cy="50" r="20" className="stroke-green-500 transition-all duration-700 ease-out" strokeWidth="4" fill="transparent" strokeDasharray="125.6" strokeDashoffset={125.6 - (125.6 * cia.availability) / 100} strokeLinecap="round" />
              </svg>
              <div className="absolute text-[8px] font-bold text-gray-500 flex flex-col items-center space-y-0.5">
                <span className="text-blue-400">C: <AnimatedCounter value={cia.confidentiality} />%</span>
                <span className="text-purple-400">I: <AnimatedCounter value={cia.integrity} />%</span>
                <span className="text-green-400 font-medium">A: <AnimatedCounter value={cia.availability} />%</span>
              </div>
            </div>

            {/* Custom Interactive Tooltips explaining CIA */}
            <div className="grid grid-cols-3 gap-2 w-full pt-2">
              <div className="tooltip-trigger flex flex-col items-center p-2 rounded-lg border border-white/[0.03] bg-white/[0.005] cursor-help">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mb-1" />
                <span className="text-[9px] text-gray-400 font-semibold">Confid.</span>
                {/* Tooltip Box */}
                <div className="tooltip-box bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 rounded-lg border border-white/[0.06] bg-[#161B26] p-2.5 text-left text-[9px] text-gray-400 shadow-xl leading-normal">
                  <span className="font-bold text-white block mb-0.5">Confidentiality</span>
                  Restricts unauthorized data access. Secured by MFA and strong passwords.
                </div>
              </div>

              <div className="tooltip-trigger flex flex-col items-center p-2 rounded-lg border border-white/[0.03] bg-white/[0.005] cursor-help">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-500 mb-1" />
                <span className="text-[9px] text-gray-400 font-semibold">Integrity</span>
                {/* Tooltip Box */}
                <div className="tooltip-box bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 rounded-lg border border-white/[0.06] bg-[#161B26] p-2.5 text-left text-[9px] text-gray-400 shadow-xl leading-normal">
                  <span className="font-bold text-white block mb-0.5">Integrity</span>
                  Protects data from unauthorized modification. Enforced by OS patches and Antivirus.
                </div>
              </div>

              <div className="tooltip-trigger flex flex-col items-center p-2 rounded-lg border border-white/[0.03] bg-white/[0.005] cursor-help">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 mb-1" />
                <span className="text-[9px] text-gray-400 font-semibold">Availab.</span>
                {/* Tooltip Box */}
                <div className="tooltip-box bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 rounded-lg border border-white/[0.06] bg-[#161B26] p-2.5 text-left text-[9px] text-gray-400 shadow-xl leading-normal">
                  <span className="font-bold text-white block mb-0.5">Availability</span>
                  Ensures systems stay responsive. Secured by regular offline backups.
                </div>
              </div>
            </div>
          </div>

          {/* Sandbox console */}
          <div className="rounded-2xl border border-white/[0.04] bg-[#111827]/40 backdrop-blur-md p-6 shadow-xl space-y-5 animate-fade-in-up delay-200">
            <div className="flex items-center justify-between border-b border-white/[0.03] pb-3">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sandbox Overrides</span>
              <span className="flex items-center gap-1 text-[9px] font-bold text-green-400 px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20">
                <Zap size={10} fill="currentColor" />
                ACTIVE
              </span>
            </div>

            <div className="space-y-3">
              <SandboxSliderToggle
                label="Multi-Factor Auth (MFA)"
                checked={whatIfToggles.enableMfa}
                onChange={(v) => setWhatIfToggle("enableMfa", v)}
                tooltip="Secures identity and prevents password abuse."
              />
              <SandboxSliderToggle
                label="Unique Passwords"
                checked={whatIfToggles.uniquePasswords}
                onChange={(v) => setWhatIfToggle("uniquePasswords", v)}
                tooltip="Prevents credential reuse attacks across sites."
              />
              <SandboxSliderToggle
                label="Automatic OS Updates"
                checked={whatIfToggles.updateOs}
                onChange={(v) => setWhatIfToggle("updateOs", v)}
                tooltip="Patches critical zero-day software holes."
              />
              <SandboxSliderToggle
                label="Endpoint Antivirus"
                checked={whatIfToggles.installAntivirus}
                onChange={(v) => setWhatIfToggle("installAntivirus", v)}
                tooltip="Quarantines malicious file downloads."
              />
              <SandboxSliderToggle
                label="Encrypted VPN Connections"
                checked={whatIfToggles.secureWifi}
                onChange={(v) => setWhatIfToggle("secureWifi", v)}
                tooltip="Shields packets from public Wi-Fi packet sniffing."
              />
            </div>
          </div>
        </div>

        {/* Right side area: Simulator & Actions */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Attack simulator */}
          <div className="rounded-2xl border border-white/[0.04] bg-[#111827]/40 backdrop-blur-md p-6 shadow-xl space-y-6 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.03] pb-3 gap-3">
              <div className="flex items-center gap-2">
                <Activity className="text-blue-500" size={16} />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Compromise Path Simulator</span>
              </div>

              {/* Tabs */}
              <div className="flex rounded-xl bg-[#0B0F19] p-1 border border-white/[0.04]">
                {attackPaths.map((path) => (
                  <button
                    key={path.id}
                    onClick={() => setActivePathTab(path.id)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                      activePathTab === path.id
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {path.id === "credential-theft" ? "Identity Breach" : path.id === "ransomware" ? "Ransomware" : "Wi-Fi Sniff"}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Path Details */}
            {attackPaths
              .filter((p) => p.id === activePathTab)
              .map((path) => {
                return (
                  <div key={path.id} className="space-y-6">
                    <div className="rounded-xl bg-[#0B0F19]/40 border border-white/[0.03] p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="space-y-1.5 max-w-xl">
                        <h3 className="text-xs font-bold text-white tracking-wide">{path.name}</h3>
                        <p className="text-[11px] text-gray-500 leading-normal font-sans">{path.description}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase shrink-0 border ${
                        path.isCompromised
                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                          : "bg-green-500/10 text-green-400 border-green-500/20"
                      }`}>
                        {path.isCompromised ? <XCircle size={12} /> : <CheckCircle size={12} />}
                        {path.isCompromised ? "Compromised" : "Audit Blocked"}
                      </span>
                    </div>

                    {/* Node map container */}
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 px-2 py-6 relative overflow-x-auto">
                      {path.nodes.map((node, idx) => {
                        const isLast = idx === path.nodes.length - 1;
                        const nextLink = path.links.find(l => l.source === node.id);
                        const isLinkActive = nextLink ? nextLink.isActive : false;

                        let statusColor = "border-white/[0.04] bg-[#111827]/10 text-gray-500";
                        if (node.status === "active-exploit") {
                          statusColor = "border-red-500 bg-red-500/5 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.1)]";
                        } else if (node.status === "vulnerable") {
                          statusColor = "border-amber-500/30 bg-amber-500/5 text-amber-500";
                        } else if (node.status === "secure") {
                          statusColor = "border-green-500 bg-green-500/5 text-green-400";
                        }

                        return (
                          <div key={node.id} className="flex flex-col lg:flex-row items-center w-full lg:w-auto shrink-0">
                            {/* Node element */}
                            <div className={`relative flex flex-col p-4 rounded-xl border text-left w-full lg:w-[155px] min-h-[90px] justify-between ${statusColor}`}>
                              <div>
                                <span className="text-[8px] font-mono tracking-wider opacity-50 block mb-0.5">NODE {idx + 1}</span>
                                <span className="text-[10px] font-bold text-white tracking-wide">{node.label}</span>
                              </div>
                              <p className="text-[9px] opacity-65 leading-normal mt-1 font-sans">{node.description}</p>
                            </div>

                            {/* Connection SVG with Dash flow */}
                            {!isLast && (
                              <div className="flex items-center justify-center p-2 w-6 lg:w-12 shrink-0">
                                <svg className="w-6 lg:w-12 h-4 rotate-90 lg:rotate-0" viewBox="0 0 40 20">
                                  <line
                                    x1="0" y1="10" x2="40" y2="10"
                                    className={`stroke-2 ${
                                      isLinkActive
                                        ? "stroke-red-500 exploit-flow-line"
                                        : "stroke-green-500"
                                    }`}
                                  />
                                </svg>
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

          {/* Action plan recommendations */}
          <div className="rounded-2xl border border-white/[0.04] bg-[#111827]/40 backdrop-blur-md p-6 shadow-xl space-y-6 animate-fade-in-up delay-100">
            <div className="flex items-center justify-between border-b border-white/[0.03] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-blue-500" size={16} />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Prioritized Control Plan</span>
              </div>
              <span className="text-[10px] text-gray-500 font-medium">Sorted by points drop</span>
            </div>

            {recommendations.length === 0 ? (
              <div className="flex items-center gap-4 rounded-xl bg-green-500/5 p-6 border border-green-500/20 text-green-400">
                <ShieldCheck size={28} className="shrink-0" />
                <div>
                  <h4 className="text-xs font-bold">Hygiene Fully Optimal</h4>
                  <p className="text-[11px] text-green-500/80 mt-1 font-sans">
                    All compliance controls are active in your baseline assessment.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {recommendations.map((rec) => {
                  const isExpanded = expandedRecId === rec.id;
                  
                  return (
                    <div
                      key={rec.id}
                      className="group border border-white/[0.04] rounded-xl bg-[#0B0F19]/20 p-4 transition-all hover:border-white/[0.08]"
                    >
                      {/* Flex header */}
                      <div
                        onClick={() => setExpandedRecId(isExpanded ? null : rec.id)}
                        className="flex items-start justify-between gap-4 cursor-pointer"
                      >
                        <div className="space-y-1 w-full">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                              {rec.title}
                              <span className="inline-flex rounded bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 text-[8px] font-bold text-blue-400 uppercase">
                                -{rec.riskReduction} Risk
                              </span>
                            </h4>
                            <div className="flex items-center gap-1.5 text-[8px] font-bold tracking-wide text-gray-500 uppercase">
                              <span>COST: <span className="text-gray-300">{rec.cost}</span></span>
                              <span>&bull;</span>
                              <span>EFFORT: <span className="text-gray-300">{rec.effort}</span></span>
                            </div>
                          </div>
                          <p className="text-[11px] text-gray-400 leading-normal font-sans">{rec.description}</p>
                        </div>
                        <ChevronRight
                          size={14}
                          className={`text-gray-500 shrink-0 mt-0.5 transition-transform duration-200 ${
                            isExpanded ? "rotate-95" : ""
                          }`}
                        />
                      </div>

                      {/* Expanded disclosure steps */}
                      {isExpanded && (
                        <div className="mt-4 border-t border-white/[0.03] pt-4 space-y-2.5 text-[10px] text-gray-400 animate-fade-in-up">
                          <span className="font-bold text-gray-500 uppercase tracking-widest block">Remediation Action Blueprint</span>
                          <div className="space-y-2">
                            {rec.steps.map((step, sidx) => (
                              <p key={sidx} className="leading-relaxed leading-normal font-sans flex items-start gap-1.5">
                                <span className="text-blue-500 font-bold font-mono">{sidx + 1}.</span>
                                <span>{step}</span>
                              </p>
                            ))}
                          </div>
                          <div className="text-[8px] font-bold text-blue-400/90 border-t border-white/[0.03] pt-2 mt-1">
                            BENEFIT: {rec.ciaBenefit}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Sandbox slider item
function SandboxSliderToggle({
  label,
  checked,
  onChange,
  tooltip
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  tooltip: string;
}) {
  return (
    <div className="tooltip-trigger flex items-center justify-between rounded-xl border border-white/[0.04] bg-[#0B0F19]/40 p-3 transition hover:border-white/[0.08]">
      <span className="text-xs font-semibold text-gray-300">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-blue-500/50 ${
          checked ? "bg-blue-600" : "bg-gray-800"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>

      {/* Tooltip */}
      <div className="tooltip-box bottom-full right-4 mb-2 w-48 rounded-lg border border-white/[0.06] bg-[#161B26] p-2.5 text-left text-[9px] text-gray-400 shadow-xl leading-normal">
        <span className="font-bold text-white block mb-0.5">Control Action</span>
        {tooltip}
      </div>
    </div>
  );
}

function LoaderSpinner() {
  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <RefreshCw className="animate-spin text-blue-500" size={32} />
      <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Initializing Command Console</span>
    </div>
  );
}


