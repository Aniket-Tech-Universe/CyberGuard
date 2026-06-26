"use client";

import Link from "next/link";
import { useAssessmentStore } from "@/stores/assessment-store";
import {
  ShieldCheck,
  AlertTriangle,
  Zap,
  ArrowRight,
  TrendingDown,
  LayoutDashboard,
  HelpCircle,
  Play
} from "lucide-react";

export default function HomePage() {
  const { isSubmitted } = useAssessmentStore();

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-gray-800/80 bg-gradient-to-br from-[#111827] via-[#0B0F19] to-[#1E1B4B] px-6 py-16 text-center shadow-2xl sm:px-12 sm:py-24">
        {/* Ambient glow backgrounds */}
        <div className="absolute -left-1/4 -top-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-1/4 -right-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400 border border-blue-500/20">
            <ShieldCheck size={14} />
            IBM SkillsBuild GTU SBTP 2026 Project
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Visualize Cyber Risk. <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Block Exploit Paths.
            </span>
          </h1>
          <p className="mx-auto max-w-xl text-base text-gray-400 sm:text-lg">
            CyberGuard is an interactive simulation dashboard built to teach cyber hygiene. Analyze vulnerabilities, map kill-chains, test What-If mitigations, and export security audits.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Link
              href={isSubmitted ? "/dashboard" : "/assessment"}
              className="group flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:bg-blue-500 hover:shadow-blue-500/20 hover:scale-[1.02]"
            >
              {isSubmitted ? (
                <>
                  <LayoutDashboard size={18} />
                  View Dashboard
                </>
              ) : (
                <>
                  <Play size={16} fill="currentColor" />
                  Start Risk Assessment
                </>
              )}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/about-project"
              className="flex items-center gap-2 rounded-xl border border-gray-800 bg-gray-900/50 px-6 py-3.5 text-sm font-semibold text-gray-300 transition-all duration-200 hover:bg-gray-800 hover:text-white"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Hero Interactive Mini Visualizer Mock */}
        <div className="mx-auto mt-12 max-w-xl rounded-xl border border-gray-800 bg-[#0B0F19]/90 p-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Live Simulation Preview</span>
            <div className="flex gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              <span className="h-2 w-2 rounded-full bg-yellow-500" />
              <span className="h-2 w-2 rounded-full bg-green-500" />
            </div>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium text-gray-400">
            <div className="flex flex-col items-center p-3.5 rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 max-w-[130px] w-full text-center">
              <span className="mb-1 text-[10px] uppercase text-red-500 font-bold">Vulnerability</span>
              Weak Passwords
            </div>
            <div className="text-red-500 text-lg rotate-90 sm:rotate-0">&rarr;</div>
            <div className="flex flex-col items-center p-3.5 rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 max-w-[130px] w-full text-center animate-pulse">
              <span className="mb-1 text-[10px] uppercase text-red-500 font-bold">Exploit Stage</span>
              Credential Theft
            </div>
            <div className="text-green-500 text-lg rotate-90 sm:rotate-0">| (Blocked)</div>
            <div className="flex flex-col items-center p-3.5 rounded-lg border border-green-500/20 bg-green-500/5 text-green-400 max-w-[130px] w-full text-center">
              <span className="mb-1 text-[10px] uppercase text-green-500 font-bold">Mitigation</span>
              MFA Active
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Core Simulation Capabilities</h2>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            CyberGuard processes security questions into functional intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={HelpCircle}
            title="Risk Assessment"
            description="Complete a 10-question security audit spanning Identity, Device, Network, and Data controls."
            color="border-blue-500/10 hover:border-blue-500/30"
            iconColor="text-blue-500 bg-blue-500/10"
          />
          <FeatureCard
            icon={TrendingDown}
            title="CIA Impact Engine"
            description="Analyze how vulnerabilities degrade Confidentiality, Integrity, and Availability components."
            color="border-purple-500/10 hover:border-purple-500/30"
            iconColor="text-purple-500 bg-purple-500/10"
          />
          <FeatureCard
            icon={AlertTriangle}
            title="Attack Path Simulator"
            description="Visualize the step-by-step kill-chains threat actors use to breach local and cloud systems."
            color="border-red-500/10 hover:border-red-500/30"
            iconColor="text-red-500 bg-red-500/10"
          />
          <FeatureCard
            icon={Zap}
            title="What-If Sandbox"
            description="Toggle security controls (MFA, updates, antivirus) to watch risk levels drop in real-time."
            color="border-green-500/10 hover:border-green-500/30"
            iconColor="text-green-500 bg-green-500/10"
          />
        </div>
      </section>

      {/* IBM SkillsBuild CTA */}
      <section className="rounded-2xl border border-gray-800 bg-gray-900/30 p-8 sm:p-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-lg font-bold text-white">Academic Learning Outcomes</h3>
            <p className="text-sm text-gray-400 max-w-xl">
              CyberGuard addresses key goals of the GTU SBTP 2026 security syllabus: understanding the Principle of Least Privilege, securing the transport layer, implementing identity boundaries, and establishing redundancy configurations.
            </p>
          </div>
          <Link
            href="/about-project"
            className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            Review Project Details
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
  iconColor
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  iconColor: string;
}) {
  return (
    <div className={`group rounded-2xl border bg-gray-900/20 p-6 shadow-md transition-all duration-200 hover:scale-[1.01] ${color}`}>
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl font-semibold shadow-inner ${iconColor}`}>
        <Icon size={20} />
      </div>
      <h3 className="mt-4 text-base font-bold text-white group-hover:text-blue-400 transition-colors">
        {title}
      </h3>
      <p className="mt-2 text-xs text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}
