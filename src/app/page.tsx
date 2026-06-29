"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  AlertTriangle,
  Zap,
  ArrowRight,
  TrendingDown,
  LayoutDashboard,
  HelpCircle,
  Play,
  Cpu,
  Lock,
  Globe,
  Database,
  Terminal,
  Activity,
  FileCheck
} from "lucide-react";

export default function HomePage() {
  
  // Interactive mock dashboard preview local state
  const [mockMfa, setMockMfa] = useState(false);
  const [mockRisk, setMockRisk] = useState(78);
  const [activeCheckStep, setActiveCheckStep] = useState(0);

  // Auto transition checkmarks in preview
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCheckStep((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // Update risk index when toggling MFA in mock
  const handleToggleMockMfa = () => {
    setMockMfa(!mockMfa);
    setMockRisk(mockMfa ? 78 : 34);
  };

  return (
    <div className="space-y-24 pb-20 bg-grid-pattern relative">
      {/* Background glowing blobs */}
      <div className="absolute top-10 left-1/4 h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-40 right-1/4 h-[400px] w-[400px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

      {/* 1. Hero Section */}
      <section className="relative mx-auto max-w-5xl pt-12 md:pt-20 text-center space-y-8 animate-fade-in-up">

        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl leading-tight">
          Quantify Cyber Risk. <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Block Compromise Paths.
          </span>
        </h1>

        <p className="mx-auto max-w-2xl text-base sm:text-lg text-gray-400 leading-relaxed">
          CyberGuard translates personal habits into quantifiable security scores. Simulate exploit chains, test real-time What-If mitigations, and compile security audit reports on a sleek interactive dashboard.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          <Link
            href="/assessment"
            className="group flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:bg-blue-500 hover:shadow-blue-500/30 hover:scale-[1.02]"
          >
            <Play size={14} fill="currentColor" />
            Start Security Audit
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-gray-300 transition-all duration-200 hover:text-white"
          >
            <LayoutDashboard size={16} />
            Threat Visualizer
          </Link>
          <Link
            href="/terminal"
            className="flex items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10 px-6 py-3.5 text-sm font-semibold text-blue-400 hover:text-white transition-all duration-200"
          >
            <Terminal size={14} />
            Sandbox Terminal
          </Link>
        </div>
      </section>

      {/* 2. Interactive Dashboard Preview Widget */}
      <section className="mx-auto max-w-5xl animate-fade-in-up delay-100">
        <div className="relative rounded-2xl border border-white/[0.05] bg-[#0E131F]/90 p-1.5 shadow-2xl backdrop-blur-md">
          {/* Subtle panel header bar */}
          <div className="flex items-center justify-between border-b border-white/[0.04] px-4 py-3 bg-white/[0.01] rounded-t-xl">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
              <span className="ml-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">Interactive Threat Simulator</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 border border-white/[0.05] bg-white/[0.02] px-2.5 py-1 rounded-md">
              <Activity size={10} className="text-blue-500 animate-pulse" />
              SIMULATOR ALIVE
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6">
            {/* Left Col: Analytics preview */}
            <div className="md:col-span-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Risk dial */}
                <div className="rounded-xl border border-white/[0.04] bg-white/[0.01] p-5 flex flex-col items-center text-center justify-center space-y-3">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Hygiene Risk Index</span>
                  <div className="relative flex h-28 w-28 items-center justify-center">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" className="stroke-white/[0.03]" strokeWidth="8" fill="transparent" />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        className="stroke-blue-500 transition-all duration-700 ease-out"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray="251.2"
                        strokeDashoffset={251.2 - (251.2 * mockRisk) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-2xl font-extrabold text-white transition-all duration-700">{mockRisk}</span>
                      <span className="text-[8px] uppercase tracking-wider text-gray-500">Risk Score</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${mockRisk > 50 ? "text-danger" : "text-success"}`}>
                    {mockRisk > 50 ? "HIGH RISK Posture" : "SECURED Posture"}
                  </span>
                </div>

                {/* Security Health */}
                <div className="rounded-xl border border-white/[0.04] bg-white/[0.01] p-5 flex flex-col items-center text-center justify-center space-y-3">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Security Health Score</span>
                  <div className="relative flex h-28 w-28 items-center justify-center">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" className="stroke-white/[0.03]" strokeWidth="8" fill="transparent" />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        className="stroke-indigo-500 transition-all duration-700 ease-out"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray="251.2"
                        strokeDashoffset={251.2 - (251.2 * (100 - mockRisk)) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-2xl font-extrabold text-white transition-all duration-700">{100 - mockRisk}</span>
                      <span className="text-[8px] uppercase tracking-wider text-gray-500">Health Index</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${mockRisk > 50 ? "text-red-400" : "text-indigo-400"}`}>
                    {mockRisk > 50 ? "Vulnerable Level" : "Optimal Level"}
                  </span>
                </div>
              </div>

              {/* Exploit timeline simulation */}
              <div className="rounded-xl border border-white/[0.04] bg-white/[0.01] p-5 space-y-3">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Simulated Threat Vector</span>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
                  <div className="flex items-center gap-2 p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 w-full sm:w-auto">
                    <AlertTriangle size={14} className="shrink-0 animate-pulse" />
                    <span>Insecure Login</span>
                  </div>
                  <div className="text-gray-600 font-bold rotate-90 sm:rotate-0">&rarr;</div>
                  
                  {/* Dynamic connector link */}
                  <div className="flex items-center gap-2 p-3 rounded-lg border w-full sm:w-auto transition-all duration-500 bg-white/[0.02] border-white/[0.05]">
                    {mockMfa ? (
                      <span className="text-green-400 font-semibold flex items-center gap-1.5">
                        <ShieldCheck size={14} />
                        MFA Active (Blocked)
                      </span>
                    ) : (
                      <span className="text-red-400 font-semibold flex items-center gap-1.5 animate-pulse">
                        <AlertTriangle size={14} />
                        No MFA (Exploited)
                      </span>
                    )}
                  </div>

                  <div className="text-gray-600 font-bold rotate-90 sm:rotate-0">&rarr;</div>
                  <div className={`flex items-center gap-2 p-3 rounded-lg border w-full sm:w-auto transition-all duration-500 ${
                    mockMfa ? "border-green-500/20 bg-green-500/5 text-green-400" : "border-red-500/20 bg-red-500/5 text-red-400"
                  }`}>
                    {mockMfa ? (
                      <>
                        <ShieldCheck size={14} />
                        <span>Database Safe</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle size={14} className="animate-bounce" />
                        <span>Data Compromised</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Interactive Control Sidebar */}
            <div className="md:col-span-4 flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/[0.04] pt-6 md:pt-0 md:pl-6 space-y-6">
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Simulator Parameter Overrides</span>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Toggle controls below to watch how risk recalculates and blocks compromise paths in real-time.
                </p>
                <div className="space-y-3">
                  <div
                    onClick={handleToggleMockMfa}
                    className="flex items-center justify-between p-3 rounded-lg border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.02] cursor-pointer transition"
                  >
                    <span className="text-xs font-semibold text-gray-300">Enforce Multi-Factor Auth</span>
                    <button
                      type="button"
                      className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full transition-colors ${
                        mockMfa ? "bg-blue-600" : "bg-gray-800"
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        mockMfa ? "translate-x-4" : "translate-x-0"
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-white/[0.02] bg-white/[0.005] opacity-50 cursor-not-allowed">
                    <span className="text-xs font-semibold text-gray-400">Install Endpoint Antivirus</span>
                    <button type="button" className="relative inline-flex h-4 w-8 shrink-0 rounded-full bg-gray-800">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-0" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Feed ticker */}
              <div className="rounded-lg bg-white/[0.01] border border-white/[0.04] p-3 text-[10px] text-gray-500 font-mono space-y-1">
                <div className="flex items-center justify-between text-gray-400 border-b border-white/[0.03] pb-1.5 mb-1.5">
                  <span>AUDIT LOG TICKER</span>
                  <span>TIME UTC</span>
                </div>
                <div className={activeCheckStep === 0 ? "text-blue-400 transition-colors" : ""}>
                  {activeCheckStep === 0 ? "> Evaluating Password Security..." : "  Evaluating Password Security..."}
                </div>
                <div className={activeCheckStep === 1 ? "text-blue-400 transition-colors" : ""}>
                  {activeCheckStep === 1 ? "> Checking Auth Strength..." : "  Checking Auth Strength..."}
                </div>
                <div className={activeCheckStep === 2 ? "text-indigo-400 transition-colors" : ""}>
                  {activeCheckStep === 2 ? "> Simulating Kill-Chains..." : "  Simulating Kill-Chains..."}
                </div>
                <div className={activeCheckStep === 3 ? "text-green-400 transition-colors" : ""}>
                  {activeCheckStep === 3 ? "> Risk calculations synced." : "  Risk calculations synced."}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. "How CyberGuard Works" Timeline Section */}
      <section className="mx-auto max-w-5xl space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-white">How CyberGuard Works</h2>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            A comprehensive pipeline to analyze, visualize, and mitigate vulnerabilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <TimelineStep
            step="01"
            title="Audit Posture"
            description="Complete a 10-question cyber hygiene questionnaire analyzing key threat domains."
            icon={HelpCircle}
          />
          <TimelineStep
            step="02"
            title="Quantify Metrics"
            description="Our engines process risk parameters into index levels and CIA percentage charts."
            icon={TrendingDown}
          />
          <TimelineStep
            step="03"
            title="Simulate Vectors"
            description="Observe step-by-step kill-chains threat actors map to compromise local networks."
            icon={AlertTriangle}
          />
          <TimelineStep
            step="04"
            title="Apply Sandbox"
            description="Toggle security controls in the sandbox to watch vulnerabilities block in real-time."
            icon={Zap}
          />
        </div>
      </section>

      {/* 4. Statistics / Highlights Section */}
      <section className="mx-auto max-w-5xl rounded-2xl border border-white/[0.04] bg-white/[0.01] p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <StatCounter value="0%" label="Server Overhead" desc="100% Client-Side Engine" />
          <StatCounter value="10" label="Audit Domains Assessed" desc="Key Risk Areas Audited" />
          <StatCounter value="3" label="Attack Vector Simulations" desc="Real-time exploit flow maps" />
          <StatCounter value="0.0s" label="Processing Time" desc="Instant dashboard calculation" />
        </div>
      </section>

      {/* 5. Feature Showcase Grid */}
      <section className="mx-auto max-w-5xl space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-white">Security Analysis Hub</h2>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            Packed with educational capabilities to build threat mitigation intuition.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ShowcaseCard
            icon={Lock}
            title="Principle of Least Privilege"
            description="Learn why separating admin accounts prevents lateral movements and privilege escalation breaches."
            domain="Identity Boundary"
          />
          <ShowcaseCard
            icon={Globe}
            title="Transport Layer Security"
            description="Evaluate how securing open Wi-Fi routes via encryption tunnels frustrates MitM exploits."
            domain="Network Bound"
          />
          <ShowcaseCard
            icon={Database}
            title="3-2-1 Data Protection"
            description="Discover why offline physical backups block complete encryption ransomware blackmail vectors."
            domain="Data Integrity"
          />
          <ShowcaseCard
            icon={Cpu}
            title="System Patch Integrity"
            description="Visualize how out-of-date components act as direct entry keys for threat actors."
            domain="Endpoint Defense"
          />
          <ShowcaseCard
            icon={Terminal}
            title="Interactive CLI Shell"
            description="Test live exploit simulations (exploit system/identity) and apply mitigations directly via command lines."
            domain="Sandbox Terminal"
          />
          <ShowcaseCard
            icon={FileCheck}
            title="Comprehensive Audit Trail"
            description="Export detailed security blueprints compiled dynamically into vector PDF reports."
            domain="Audit Report"
          />
        </div>
      </section>

      {/* 6. Call to Action Panel */}
      <section className="mx-auto max-w-4xl text-center space-y-6 rounded-2xl border border-white/[0.05] bg-gradient-to-b from-white/[0.02] to-transparent p-12">
        <h2 className="text-3xl font-bold text-white">Assess Your Cyber Security Posture</h2>
        <p className="mx-auto max-w-lg text-xs text-gray-400 leading-relaxed">
          Ready to run the cyber risk visualization simulator? Run our 10-domain questionnaire to establish your baseline security profile.
        </p>
        <div className="pt-2 flex justify-center gap-4">
          <Link
            href="/assessment"
            className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-6 py-3.5 text-xs font-semibold text-white shadow-lg transition-all"
          >
            Start Security Audit
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] px-6 py-3.5 text-xs font-semibold text-gray-300 transition-all hover:text-white"
          >
            View Threat Visualizer
          </Link>
        </div>
      </section>
    </div>
  );
}

function TimelineStep({
  step,
  title,
  description,
  icon: Icon
}: {
  step: string;
  title: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <div className="relative group rounded-2xl border border-white/[0.04] bg-white/[0.01] p-6 space-y-4 hover:border-white/[0.08] transition duration-200">
      <div className="flex items-center justify-between">
        <span className="text-2xl font-black text-white/5 group-hover:text-blue-500/10 transition-colors">{step}</span>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <Icon size={14} />
        </div>
      </div>
      <h3 className="text-sm font-bold text-white tracking-wide">{title}</h3>
      <p className="text-[11px] text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}

function StatCounter({
  value,
  label,
  desc
}: {
  value: string;
  label: string;
  desc: string;
}) {
  return (
    <div className="space-y-1">
      <div className="text-3xl font-extrabold text-white tracking-tight">{value}</div>
      <div className="text-xs font-bold text-gray-400 tracking-wide">{label}</div>
      <div className="text-[10px] text-gray-500">{desc}</div>
    </div>
  );
}

function ShowcaseCard({
  icon: Icon,
  title,
  description,
  domain
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  domain: string;
}) {
  return (
    <div className="premium-card rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <span className="rounded bg-blue-500/5 px-2 py-0.5 text-[8px] font-bold text-blue-400 border border-blue-500/10 uppercase tracking-wider">
          {domain}
        </span>
        <div className="text-gray-400">
          <Icon size={16} />
        </div>
      </div>
      <h3 className="text-xs font-bold text-white tracking-wide">{title}</h3>
      <p className="text-[11px] text-gray-500 leading-relaxed font-sans">{description}</p>
    </div>
  );
}
