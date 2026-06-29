"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
  ChevronRight,
  FileText,
  Globe,
  Server,
  Key,
  Database,
  Laptop
} from "lucide-react";
import { WhatIfToggles } from "@/types";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip
} from "recharts";

// Simulated threat density alerts dataset based on mitigations
function getTimelineData(toggles: WhatIfToggles) {
  const reduction =
    (toggles.enableMfa ? 3 : 0) +
    (toggles.uniquePasswords ? 2 : 0) +
    (toggles.updateOs ? 3 : 0) +
    (toggles.installAntivirus ? 2 : 0) +
    (toggles.secureWifi ? 2 : 0);

  return [
    { hour: "00:00", alerts: Math.max(0, 2 - (reduction > 6 ? 2 : 0)) },
    { hour: "04:00", alerts: Math.max(0, 1 - (reduction > 8 ? 1 : 0)) },
    { hour: "08:00", alerts: Math.max(1, 5 - (reduction > 4 ? 2 : 0)) },
    { hour: "12:00", alerts: Math.max(1, 14 - reduction) },
    { hour: "16:00", alerts: Math.max(2, 19 - Math.floor(reduction * 1.5)) },
    { hour: "20:00", alerts: Math.max(0, 4 - (reduction > 2 ? 2 : 0)) },
    { hour: "24:00", alerts: Math.max(0, 1 - (reduction > 6 ? 1 : 0)) }
  ];
}

// Asset icon selector based on threat model node hierarchy
function getNodeIcon(nodeId: string) {
  const index = nodeId.charAt(1); // '1' - '5'
  switch (index) {
    case "1":
      return Globe;
    case "2":
      return Server;
    case "3":
      return Laptop;
    case "4":
      return Key;
    case "5":
      return Database;
    default:
      return Server;
  }
}

// Forensics Log Event Interface
interface ForensicsEvent {
  time: string;
  type: string;
  description: string;
  severity: "critical" | "warning" | "success" | "info";
  technique: string;
}

// Simulated real-world chronological logs matching toggles
function getSimulatedTimeline(pathId: string, toggles: WhatIfToggles): ForensicsEvent[] {
  if (pathId === "credential-theft") {
    const isMfaActive = toggles.enableMfa;
    const isUniqueActive = toggles.uniquePasswords;

    const events: ForensicsEvent[] = [
      {
        time: "10:14:02 AM",
        type: "RECONNAISSANCE",
        description: "Brute-force scan initiated against remote authentication gateway.",
        severity: "info",
        technique: "MITRE ATT&CK: T1110 (Brute Force)"
      }
    ];

    if (isUniqueActive) {
      events.push(
        {
          time: "10:14:15 AM",
          type: "MITIGATION INTERCEPT",
          description: "Credential validation failed: High-entropy unique password detected. Login blocked.",
          severity: "success",
          technique: "Control Enforced: Password Policy"
        },
        {
          time: "10:14:20 AM",
          type: "INTRUSION SHIELDED",
          description: "Attack vector neutralized at authentication perimeter.",
          severity: "success",
          technique: "Boundary Safe"
        }
      );
      return events;
    }

    events.push({
      time: "10:14:15 AM",
      type: "CREDENTIAL LEAK",
      description: "Authentication token compromised via dictionary match.",
      severity: "warning",
      technique: "MITRE ATT&CK: T1589 (Gather Identity Info)"
    });

    if (isMfaActive) {
      events.push(
        {
          time: "10:14:30 AM",
          type: "MFA CHALLENGE",
          description: "Secondary Multi-Factor Authentication challenge issued to user device.",
          severity: "info",
          technique: "NIST Control: AC-3 (Access Control)"
        },
        {
          time: "10:14:35 AM",
          type: "MITIGATION INTERCEPT",
          description: "MFA challenge validation failed. Connection terminated by identity firewall.",
          severity: "success",
          technique: "Control Enforced: MFA Authentication"
        },
        {
          time: "10:14:40 AM",
          type: "INTRUSION SHIELDED",
          description: "Account takeover attempt successfully blocked.",
          severity: "success",
          technique: "Boundary Safe"
        }
      );
      return events;
    }

    events.push(
      {
        time: "10:14:30 AM",
        type: "IDENTITY BYPASS",
        description: "MFA checks absent. System granted login access to external profile.",
        severity: "critical",
        technique: "MITRE ATT&CK: T1078 (Valid Accounts)"
      },
      {
        time: "10:14:45 AM",
        type: "PRIVILEGED ACCESS",
        description: "Admin directory traversal completed. Session token cloned.",
        severity: "critical",
        technique: "MITRE ATT&CK: T1021 (Remote Services)"
      },
      {
        time: "10:15:00 AM",
        type: "INTEGRITY BREACH",
        description: "Sensitive repository exfiltrated: Database dump download detected.",
        severity: "critical",
        technique: "MITRE ATT&CK: T1048 (Exfiltration)"
      }
    );
    return events;
  }

  if (pathId === "ransomware") {
    const isOsUpdated = toggles.updateOs;
    const isAvInstalled = toggles.installAntivirus;

    const events: ForensicsEvent[] = [
      {
        time: "11:22:10 AM",
        type: "INITIAL ACCESS",
        description: "Remote client navigated to malicious web node hosting exploit scripts.",
        severity: "info",
        technique: "MITRE ATT&CK: T1189 (Drive-by Compromise)"
      }
    ];

    if (isOsUpdated) {
      events.push(
        {
          time: "11:22:15 AM",
          type: "MITIGATION INTERCEPT",
          description: "Exploit payload rejected: Browser Sandbox patches up-to-date. Shellcode execution blocked.",
          severity: "success",
          technique: "Control Enforced: Patch Integrity"
        },
        {
          time: "11:22:20 AM",
          type: "INTRUSION SHIELDED",
          description: "Malware download blocked. Host system intact.",
          severity: "success",
          technique: "Boundary Safe"
        }
      );
      return events;
    }

    events.push({
      time: "11:22:15 AM",
      type: "EXPLOIT RUN",
      description: "Outdated browser engine executed malicious buffer overflow payload.",
      severity: "warning",
      technique: "MITRE ATT&CK: T1203 (Client Execution)"
    });

    if (isAvInstalled) {
      events.push(
        {
          time: "11:22:30 AM",
          type: "BEHAVIOR AUDIT",
          description: "Real-time behavior monitor flagged suspicious process memory execution.",
          severity: "info",
          technique: "NIST Control: SI-4 (System Monitoring)"
        },
        {
          time: "11:22:35 AM",
          type: "MITIGATION INTERCEPT",
          description: "Malicious payload quarantined by Endpoint Protection agent.",
          severity: "success",
          technique: "Control Enforced: Antivirus Guard"
        },
        {
          time: "11:22:40 AM",
          type: "INTRUSION SHIELDED",
          description: "Malicious shellcode blocked before privilege inheritance.",
          severity: "success",
          technique: "Boundary Safe"
        }
      );
      return events;
    }

    events.push(
      {
        time: "11:22:30 AM",
        type: "MALWARE RUN",
        description: "Trojan payload injected into local memory structure.",
        severity: "critical",
        technique: "MITRE ATT&CK: T1059 (Interpreter Execution)"
      },
      {
        time: "11:22:45 AM",
        type: "PRIVILEGE ESCALATION",
        description: "Malware inherited Admin privileges from executing session context.",
        severity: "critical",
        technique: "MITRE ATT&CK: T1068 (Privilege Escalation)"
      },
      {
        time: "11:23:00 AM",
        type: "RANSOMWARE LOCK",
        description: "Local database directories encrypted. Shadow copy files destroyed. Ransom note created.",
        severity: "critical",
        technique: "MITRE ATT&CK: T1486 (Data Encrypted)"
      }
    );
    return events;
  }

  // mitm
  const isVpnActive = toggles.secureWifi;
  const events: ForensicsEvent[] = [
    {
      time: "02:33:40 PM",
      type: "NETWORK RECON",
      description: "User host connected to public unsecured Wi-Fi SSID network.",
      severity: "info",
      technique: "MITRE ATT&CK: T1040 (Network Sniffing)"
    }
  ];

  if (isVpnActive) {
    events.push(
      {
        time: "02:33:45 PM",
        type: "VPN TUNNEL",
        description: "IPsec/WireGuard encrypted tunnel established. Raw payload data securely encrypted.",
        severity: "success",
        technique: "Control Enforced: Secure VPN Tunnel"
      },
      {
        time: "02:33:50 PM",
        type: "MITIGATION INTERCEPT",
        description: "Sniffer client captured cipher data. Packets unreadable. Encryption intact.",
        severity: "success",
        technique: "NIST Control: SC-8 (Transmission Integrity)"
      },
      {
        time: "02:33:55 PM",
        type: "INTRUSION SHIELDED",
        description: "Sniffing attack neutralized. Session tokens safe.",
        severity: "success",
        technique: "Boundary Safe"
      }
    );
    return events;
  }

  events.push(
    {
      time: "02:33:45 PM",
      type: "SNIFFING MONITOR",
      description: "Attacker client intercepted plaintext packet headers.",
      severity: "warning",
      technique: "MITRE ATT&CK: T1040 (Network Sniffing)"
    },
    {
      time: "02:34:00 PM",
      type: "TOKEN CRACK",
      description: "Authentication cookie token extracted from session traffic.",
      severity: "critical",
      technique: "MITRE ATT&CK: T1539 (Steal Cookie)"
    },
    {
      time: "02:34:15 PM",
      type: "IMPERSONATION",
      description: "Attacker cloned session cookie header to bypass login gates.",
      severity: "critical",
      technique: "MITRE ATT&CK: T1556 (Modify Auth Process)"
    },
    {
      time: "02:34:30 PM",
      type: "DATA BREACH",
      description: "Hijacked user account session used to traverse database records.",
      severity: "critical",
      technique: "MITRE ATT&CK: T1114 (Email Collection)"
    }
  );
  return events;
}

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
  const [visualMode, setVisualMode] = useState<"topology" | "geospatial" | "timeline">("topology");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedGeoSource, setSelectedGeoSource] = useState<string | null>(null);

  // Redirect if not submitted
  useEffect(() => {
    if (!isSubmitted) {
      router.push("/assessment");
    }
  }, [isSubmitted, router]);

  if (!isSubmitted) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 text-center">
        <RefreshCw className="animate-spin text-blue-500" size={32} />
        <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Redirecting to active audit portal...</span>
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
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Security Threat Visualizer</h1>
          <p className="mt-1 text-sm text-gray-400">
            Interactive threat path simulation, risk metric calculations, and academic audit reports.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleResetSandbox}
            className="flex items-center gap-2 rounded-xl border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-gray-300 hover:text-white transition"
          >
            <RefreshCw size={13} />
            Reset Sandbox
          </button>
          <Link
            href="/reports"
            className="flex items-center gap-2 rounded-xl border border-white/[0.05] bg-white/[0.01] hover:bg-white/[0.03] px-4 py-2.5 text-xs font-semibold text-gray-400 hover:text-white transition"
          >
            <FileText size={13} />
            View Audit Trail
          </Link>
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-500/10 hover:bg-blue-500 hover:scale-[1.01] transition-all"
          >
            <FileDown size={13} />
            Download Audit Report
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
                
                {/* Needle Pointer */}
                <line
                  x1="50" y1="36" x2="50" y2="15"
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
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Threat Simulator Overrides</span>
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
          
          {/* Main Visualizer Panel */}
          <div className="rounded-2xl border border-white/[0.04] bg-[#111827]/40 backdrop-blur-md p-6 shadow-xl space-y-6 animate-fade-in-up">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between border-b border-white/[0.03] pb-4 gap-4">
              <div className="flex items-center gap-2">
                <Activity className="text-blue-500" size={16} />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Threat Visualization Center</span>
              </div>

              {/* Visual Mode Selector Tabs */}
              <div className="flex rounded-xl bg-[#0B0F19] p-1 border border-white/[0.04] shrink-0 self-start lg:self-auto">
                <button
                  onClick={() => { setVisualMode("topology"); setSelectedNodeId(null); }}
                  className={`rounded-lg px-3 py-1.5 text-[10px] font-bold tracking-wide uppercase transition-all ${
                    visualMode === "topology" ? "bg-blue-600 text-white shadow-md" : "text-gray-500 hover:text-white"
                  }`}
                >
                  Topology Graph
                </button>
                <button
                  onClick={() => { setVisualMode("geospatial"); setSelectedGeoSource(null); }}
                  className={`rounded-lg px-3 py-1.5 text-[10px] font-bold tracking-wide uppercase transition-all ${
                    visualMode === "geospatial" ? "bg-blue-600 text-white shadow-md" : "text-gray-500 hover:text-white"
                  }`}
                >
                  Geospatial Map
                </button>
                <button
                  onClick={() => setVisualMode("timeline")}
                  className={`rounded-lg px-3 py-1.5 text-[10px] font-bold tracking-wide uppercase transition-all ${
                    visualMode === "timeline" ? "bg-blue-600 text-white shadow-md" : "text-gray-500 hover:text-white"
                  }`}
                >
                  Incident Timeline
                </button>
              </div>
            </div>

            {/* Path Selection Vector Tabs (only shown for graph/map views) */}
            {visualMode !== "timeline" && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#0B0F19]/35 border border-white/[0.03] p-3 rounded-xl">
                <div className="text-[10px] font-semibold text-gray-400 font-sans">
                  Select Simulation Vector:
                </div>
                <div className="flex rounded-xl bg-[#0B0F19] p-1 border border-white/[0.04]">
                  {attackPaths.map((path) => (
                    <button
                      key={path.id}
                      onClick={() => { setActivePathTab(path.id); setSelectedNodeId(null); }}
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
            )}

            {/* Render Tab Contents */}
            {visualMode === "topology" && (
              <div className="space-y-6">
                {attackPaths
                  .filter((p) => p.id === activePathTab)
                  .map((path) => (
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

                      {/* Interactive Canvas Grid */}
                      <div className="relative rounded-xl border border-white/[0.03] bg-[#0B0F19]/60 p-4 overflow-hidden flex flex-col items-center justify-center min-h-[260px]">
                        <div className="absolute top-2 left-2 text-[8.5px] font-mono text-gray-500 uppercase">
                          CLICK ON NODES TO OPEN ASSET INSPECTOR
                        </div>
                        
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 px-2 py-6 w-full relative overflow-x-auto">
                          {path.nodes.map((node, idx) => {
                            const isLast = idx === path.nodes.length - 1;
                            const nextLink = path.links.find(l => l.source === node.id);
                            const isLinkActive = nextLink ? nextLink.isActive : false;

                            let statusColor = "border-white/[0.04] bg-[#111827]/10 text-gray-500 cursor-pointer hover:border-white/[0.15]";
                            if (selectedNodeId === node.id) {
                              statusColor = node.status === "secure"
                                ? "border-green-500 bg-green-500/15 text-green-400 shadow-lg shadow-green-500/5 ring-1 ring-green-500"
                                : node.status === "active-exploit"
                                ? "border-red-500 bg-red-500/15 text-red-400 shadow-lg shadow-red-500/5 ring-1 ring-red-500"
                                : "border-amber-500 bg-amber-500/15 text-amber-500 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500";
                            } else {
                              if (node.status === "active-exploit") {
                                statusColor = "border-red-500/40 bg-red-500/5 text-red-400 sonar-pulse-red glow-danger cursor-pointer hover:border-red-500";
                              } else if (node.status === "vulnerable") {
                                statusColor = "border-amber-500/30 bg-amber-500/5 text-amber-500 cursor-pointer hover:border-amber-500";
                              } else if (node.status === "secure") {
                                statusColor = "border-green-500/40 bg-green-500/5 text-green-400 sonar-pulse-green glow-success cursor-pointer hover:border-green-500";
                              }
                            }

                            const NodeIcon = getNodeIcon(node.id);
                            const assetLabels: Record<string, string> = {
                              "1": "ATTACK SOURCE",
                              "2": "GATEWAY BOUND",
                              "3": "HOST WORKSTATION",
                              "4": "IDENTITY BOUND",
                              "5": "TARGET DATABASE"
                            };
                            const nodeIndex = node.id.charAt(1);
                            const assetLabel = assetLabels[nodeIndex] || "ASSET NODE";

                            return (
                              <div key={node.id} className="flex flex-col lg:flex-row items-center w-full lg:w-auto shrink-0">
                                {/* Node card */}
                                <div
                                  onClick={() => setSelectedNodeId(node.id === selectedNodeId ? null : node.id)}
                                  className={`relative flex flex-col p-4 rounded-xl border text-left w-full lg:w-[155px] min-h-[110px] justify-between transition-all duration-300 ${statusColor}`}
                                >
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[7.5px] font-mono tracking-wider opacity-60 uppercase">{assetLabel}</span>
                                      <NodeIcon size={12} className="opacity-80" />
                                    </div>
                                    <span className="text-[10px] font-bold text-white tracking-wide block leading-tight">{node.label}</span>
                                  </div>
                                  <p className="text-[9px] opacity-65 leading-normal mt-1.5 font-sans">{node.description}</p>
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

                      {/* Node Details Inspector Sidebar */}
                      {selectedNodeId && (
                        <div className="rounded-xl border border-white/[0.05] bg-[#0B0F19]/80 p-4 space-y-2 animate-fade-in">
                          {(() => {
                            const node = path.nodes.find(n => n.id === selectedNodeId);
                            if (!node) return null;
                            
                            const nodeIndex = node.id.charAt(1);
                            const nodeVulnerabilities: Record<string, { cve: string; cvss: string; stride: string; recommendation: string }> = {
                              "1": {
                                cve: "N/A (External Attacker Node)",
                                cvss: "High",
                                stride: "Spoofing / Information Disclosure",
                                recommendation: "Ensure external perimeter controls drops unsanctioned requests."
                              },
                              "2": {
                                cve: "CVE-2021-41773 (Server Directory Traversal)",
                                cvss: "7.5 (High)",
                                stride: "Information Disclosure / Elevation",
                                recommendation: "Apply patch hotfixes to core gateway application binaries."
                              },
                              "3": {
                                cve: "CVE-2023-38606 (Host Process Memory Exploit)",
                                cvss: "8.1 (High)",
                                stride: "Tampering / Elevation of Privilege",
                                recommendation: "Enforce local behavior-monitoring heuristics and run active scanning."
                              },
                              "4": {
                                cve: "Weak/Reused Account Profile Session Capture",
                                cvss: "8.8 (High)",
                                stride: "Repudiation / Spoofing",
                                recommendation: "Enforce Multi-Factor Authentication validation checks."
                              },
                              "5": {
                                cve: "CVE-2023-29360 (Remote Storage Bucket Leak)",
                                cvss: "9.8 (Critical)",
                                stride: "Information Disclosure / Denial of Service",
                                recommendation: "Isolate network zones, encrypt data at rest, and keep offline backups."
                              }
                            };
                            const details = nodeVulnerabilities[nodeIndex] || {
                              cve: "General Configuration Exploit",
                              cvss: "Medium",
                              stride: "Information Disclosure",
                              recommendation: "Apply baseline hardening templates."
                            };

                            return (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                    Asset Details: {node.label}
                                  </h4>
                                  <p className="text-[10px] text-gray-400 font-sans">{node.description}</p>
                                  <div className="text-[9px] font-mono text-gray-500 mt-2">
                                    <div>IP ADDRESS: 10.0.{nodeIndex}.12</div>
                                    <div>STATUS: <span className={node.status === "secure" ? "text-green-400" : node.status === "active-exploit" ? "text-red-400" : "text-amber-400"}>{node.status.toUpperCase()}</span></div>
                                  </div>
                                </div>
                                <div className="space-y-1.5 border-t md:border-t-0 md:border-l border-white/[0.04] pt-2 md:pt-0 md:pl-4 text-[10px] font-sans">
                                  <div><span className="font-semibold text-gray-400">Vulnerability:</span> <span className="text-amber-400 font-mono">{details.cve}</span></div>
                                  <div><span className="font-semibold text-gray-400">STRIDE Threat:</span> <span className="text-purple-400">{details.stride}</span></div>
                                  <div><span className="font-semibold text-gray-400">Risk Severity:</span> <span className="text-red-400 font-mono font-bold">{details.cvss}</span></div>
                                  <div className="mt-2 text-gray-300 bg-white/[0.01] p-2 rounded border border-white/[0.03]">
                                    <span className="font-bold text-blue-400 block text-[9px] uppercase tracking-wide">Mitigation Action:</span>
                                    {details.recommendation}
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}

            {/* Geospatial Map Tab View */}
            {visualMode === "geospatial" && (
              <div className="space-y-4">
                <div className="relative rounded-xl border border-white/[0.03] bg-[#0B0F19]/60 p-4 overflow-hidden flex flex-col items-center justify-center min-h-[260px]">
                  <svg className="w-full max-w-lg h-56" viewBox="0 0 600 240">
                    {/* Stylized background dots representing world continents */}
                    {/* Americas */}
                    <circle cx="100" cy="80" r="25" fill="white" fillOpacity="0.03" />
                    <circle cx="130" cy="150" r="20" fill="white" fillOpacity="0.03" />
                    {/* Europe/Africa */}
                    <circle cx="300" cy="90" r="30" fill="white" fillOpacity="0.03" />
                    <circle cx="320" cy="160" r="25" fill="white" fillOpacity="0.03" />
                    {/* Asia/Australia */}
                    <circle cx="450" cy="90" r="35" fill="white" fillOpacity="0.03" />
                    <circle cx="500" cy="170" r="20" fill="white" fillOpacity="0.03" />

                    {/* Attacker Origin Nodes */}
                    {/* Paris, France */}
                    <g className="cursor-pointer" onClick={() => setSelectedGeoSource("paris")}>
                      <circle cx="300" cy="80" r="6" className={`fill-red-500 transition-all ${selectedGeoSource === "paris" ? "r-8 stroke-white stroke-2" : "animate-pulse"}`} />
                      <text x="310" y="83" className="fill-gray-400 text-[8px] font-mono">PARIS</text>
                    </g>

                    {/* Beijing, China */}
                    <g className="cursor-pointer" onClick={() => setSelectedGeoSource("beijing")}>
                      <circle cx="450" cy="100" r="6" className={`fill-red-500 transition-all ${selectedGeoSource === "beijing" ? "r-8 stroke-white stroke-2" : "animate-pulse"}`} />
                      <text x="460" y="103" className="fill-gray-400 text-[8px] font-mono">BEIJING</text>
                    </g>

                    {/* Sydney, Australia */}
                    <g className="cursor-pointer" onClick={() => setSelectedGeoSource("sydney")}>
                      <circle cx="500" cy="180" r="6" className={`fill-red-500 transition-all ${selectedGeoSource === "sydney" ? "r-8 stroke-white stroke-2" : "animate-pulse"}`} />
                      <text x="510" y="183" className="fill-gray-400 text-[8px] font-mono">SYDNEY</text>
                    </g>

                    {/* Target Node: New York, USA */}
                    <g>
                      <circle cx="150" cy="90" r="7" className="fill-blue-500 animate-pulse stroke-white stroke-1" />
                      <text x="110" y="94" className="fill-blue-400 text-[8px] font-bold font-mono">TARGET SYSTEM</text>
                    </g>

                    {/* Flight path lines */}
                    {/* Paris -> New York */}
                    <path
                      d="M 300,80 Q 225,45 150,90"
                      fill="none"
                      className={`stroke-[1.5] transition-all duration-300 ${
                        whatIfToggles.uniquePasswords || whatIfToggles.enableMfa
                          ? "stroke-green-500/30"
                          : "stroke-red-500/20"
                      }`}
                    />
                    <path
                      d="M 300,80 Q 225,45 150,90"
                      fill="none"
                      className={`stroke-[1.5] transition-all duration-300 ${
                        whatIfToggles.uniquePasswords || whatIfToggles.enableMfa
                          ? "stroke-green-500"
                          : "stroke-red-500 exploit-flow-line"
                      }`}
                      strokeDasharray="4,4"
                    />

                    {/* Beijing -> New York */}
                    <path
                      d="M 450,100 Q 300,20 150,90"
                      fill="none"
                      className={`stroke-[1.5] transition-all duration-300 ${
                        whatIfToggles.updateOs || whatIfToggles.installAntivirus
                          ? "stroke-green-500/30"
                          : "stroke-red-500/20"
                      }`}
                    />
                    <path
                      d="M 450,100 Q 300,20 150,90"
                      fill="none"
                      className={`stroke-[1.5] transition-all duration-300 ${
                        whatIfToggles.updateOs || whatIfToggles.installAntivirus
                          ? "stroke-green-500"
                          : "stroke-red-500 exploit-flow-line"
                      }`}
                      strokeDasharray="4,4"
                    />

                    {/* Sydney -> New York */}
                    <path
                      d="M 500,180 Q 325,135 150,90"
                      fill="none"
                      className={`stroke-[1.5] transition-all duration-300 ${
                        whatIfToggles.secureWifi
                          ? "stroke-green-500/30"
                          : "stroke-red-500/20"
                      }`}
                    />
                    <path
                      d="M 500,180 Q 325,135 150,90"
                      fill="none"
                      className={`stroke-[1.5] transition-all duration-300 ${
                        whatIfToggles.secureWifi
                          ? "stroke-green-500"
                          : "stroke-red-500 exploit-flow-line"
                      }`}
                      strokeDasharray="4,4"
                    />
                  </svg>

                  {/* Map interaction guide */}
                  <div className="absolute bottom-2 left-2 text-[8.5px] font-mono text-gray-500">
                    CLICK ON RED HACKER NODES TO INSPECT GEOLOCATION METADATA
                  </div>
                </div>

                {selectedGeoSource && (
                  <div className="rounded-xl border border-white/[0.05] bg-[#0B0F19]/80 p-4 space-y-1.5 animate-fade-in text-[10px] font-sans">
                    {(() => {
                      const geoSources: Record<string, { city: string; country: string; ip: string; threatRating: string; details: string }> = {
                        paris: {
                          city: "Paris",
                          country: "France",
                          ip: "93.184.216.34",
                          threatRating: "High (Credential Phishing)",
                          details: "Host attempts login validation queries via clone landing sites. Scanning active vectors trying password leaks."
                        },
                        beijing: {
                          city: "Beijing",
                          country: "China",
                          ip: "103.24.201.8",
                          threatRating: "Critical (Payload Injection Botnet)",
                          details: "Hacker system pushing server buffer overflow command exploits to inject malicious payload modules."
                        },
                        sydney: {
                          city: "Sydney",
                          country: "Australia",
                          ip: "185.12.56.91",
                          threatRating: "Medium (SSID Packet Sniffer)",
                          details: "Access point capturing packet headers from target user. Extracting browser cookies to run session takeover exploits."
                        }
                      };
                      const src = geoSources[selectedGeoSource];
                      if (!src) return null;
                      return (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-bold text-white uppercase text-[10px] flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                              HACKER NODE: {src.city}, {src.country}
                            </h4>
                            <p className="text-gray-400 mt-1 leading-normal">{src.details}</p>
                          </div>
                          <div className="font-mono text-[9.5px] space-y-0.5 border-t sm:border-t-0 sm:border-l border-white/[0.04] pt-2 sm:pt-0 sm:pl-4">
                            <div>IP BLOCK: {src.ip}</div>
                            <div>THREAT PROFILE: {src.threatRating}</div>
                            <div>TARGET ADDRESS: 10.0.3.12 (Local Workstation)</div>
                            <div className="mt-1.5">
                              ROUTE SECURITY:{" "}
                              {selectedGeoSource === "paris"
                                ? whatIfToggles.uniquePasswords || whatIfToggles.enableMfa
                                  ? <span className="text-green-400 font-bold">SECURED (Blocked by Identity Rules)</span>
                                  : <span className="text-red-400 font-bold">COMPROMISED (Perimeter Breached)</span>
                                : selectedGeoSource === "beijing"
                                ? whatIfToggles.updateOs || whatIfToggles.installAntivirus
                                  ? <span className="text-green-400 font-bold">SECURED (Blocked by Endpoint Guard)</span>
                                  : <span className="text-red-400 font-bold">COMPROMISED (Perimeter Breached)</span>
                                : whatIfToggles.secureWifi
                                ? <span className="text-green-400 font-bold">SECURED (Blocked by VPN Tunnel)</span>
                                : <span className="text-red-400 font-bold">COMPROMISED (Perimeter Breached)</span>}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}

            {/* Timeline Analysis Tab View */}
            {visualMode === "timeline" && (
              <div className="space-y-6">
                <div className="rounded-xl border border-white/[0.03] bg-[#0B0F19]/40 p-4">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono mb-3">24-Hour Threat Density Analytics</h4>
                  <div className="h-48 w-full font-sans">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={getTimelineData(whatIfToggles)}
                        margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                      >
                        <XAxis
                          dataKey="hour"
                          stroke="#4b5563"
                          fontSize={9}
                          tickLine={false}
                        />
                        <YAxis
                          stroke="#4b5563"
                          fontSize={9}
                          tickLine={false}
                          allowDecimals={false}
                        />
                        <ChartTooltip
                          contentStyle={{
                            backgroundColor: "#0B0F19",
                            borderColor: "rgba(255,255,255,0.05)",
                            fontSize: "10px",
                            borderRadius: "8px",
                            color: "#fff"
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="alerts"
                          stroke="#ef4444"
                          fill="rgba(239, 68, 68, 0.1)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-[8.5px] text-gray-500 font-mono mt-2 uppercase">
                    Visualizes alert spikes over time. Toggling mitigations directly flattens the risk curves.
                  </p>
                </div>

                {/* Forensics Event Logs Stream inside the Timeline tab */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/[0.03] pb-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Incident Forensics Event Log</span>
                    <span className="text-[8px] font-bold text-gray-500 uppercase tracking-wider">Real-Time Audit Stream</span>
                  </div>

                  <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin">
                    {getSimulatedTimeline(activePathTab, whatIfToggles).map((event, eidx) => {
                      let badgeColor = "bg-blue-500/10 text-blue-400 border-blue-500/20";
                      if (event.severity === "critical") badgeColor = "bg-red-500/10 text-red-400 border-red-500/20";
                      else if (event.severity === "warning") badgeColor = "bg-amber-500/10 text-amber-400 border-amber-500/20";
                      else if (event.severity === "success") badgeColor = "bg-green-500/10 text-green-400 border-green-500/20";

                      return (
                        <div key={eidx} className="flex gap-4 p-3 rounded-xl border border-white/[0.03] bg-[#0B0F19]/25 hover:bg-[#0B0F19]/40 transition duration-150 items-start">
                          <div className="font-mono text-[9px] text-gray-500 shrink-0 mt-0.5">{event.time}</div>
                          <div className="space-y-1 w-full">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <span className={`inline-flex rounded px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider border ${badgeColor}`}>
                                {event.type}
                              </span>
                              <span className="text-[8px] font-mono text-gray-500">{event.technique}</span>
                            </div>
                            <p className="text-[11px] text-gray-300 font-sans leading-normal">{event.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action plan recommendations */}
          <div className="rounded-2xl border border-white/[0.04] bg-[#111827]/40 backdrop-blur-md p-6 shadow-xl space-y-6 animate-fade-in-up delay-100">
            <div className="flex items-center justify-between border-b border-white/[0.03] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-blue-500" size={16} />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Prioritized Mitigation Steps</span>
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
                          <span className="font-bold text-gray-500 uppercase tracking-widest block">Action Blueprint</span>
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




