"use client";

import { Shield, Target, BookOpen, Layers, Forward, Award } from "lucide-react";

export default function AboutProjectPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-16 pb-16 bg-grid-pattern relative">
      <div className="absolute top-20 right-10 h-[300px] w-[300px] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="border-b border-white/[0.04] pb-5 animate-fade-in-up">
        <h1 className="text-4xl font-extrabold tracking-tight text-white">Project Specification</h1>
        <p className="mt-2 text-sm text-gray-400">
          Architecture documentation, academic alignments, and implementation blueprints of CyberGuard.
        </p>
      </div>

      {/* Problem & Objectives */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start animate-fade-in-up delay-100">
        <div className="rounded-2xl border border-white/[0.04] bg-[#111827]/40 p-6 space-y-4">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Shield size={16} />
          </div>
          <h2 className="text-base font-bold text-white tracking-wide">Problem Statement</h2>
          <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
            End-users often struggle to comprehend how minor security neglects (such as reusing a password or delaying an operating system patch) can be chained together by threat actors to execute full system breaches. Traditional compliance training relies on static slides, failing to build practical threat intuition.
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.04] bg-[#111827]/40 p-6 space-y-4">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Target size={16} />
          </div>
          <h2 className="text-base font-bold text-white tracking-wide">Objectives &amp; Mission</h2>
          <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
            CyberGuard translates individual cyber habits into clear, quantifiable security risk indices. By displaying real-time CIA Triad strength changes and animating active exploit connections, it demonstrates exactly how mitigation steps (such as MFA or OS updates) act as barriers.
          </p>
        </div>
      </section>

      {/* Security Principles Banner */}
      <section className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 md:p-8 space-y-3.5 animate-fade-in-up delay-200">
        <div className="flex items-center gap-2 text-blue-400">
          <Award size={18} />
          <h3 className="text-xs font-bold uppercase tracking-widest">Core Security Design Principles</h3>
        </div>
        <p className="text-xs text-gray-300 leading-relaxed font-sans">
          CyberGuard is modeled on standard defensive principles, highlighting the Principle of Least Privilege, transport encryption tunnels, and offline backup strategies. By visualising these domains, users see exactly how vulnerability vectors propagate.
        </p>
      </section>

      {/* Technical stack highlight */}
      <section className="space-y-6 animate-fade-in-up delay-300">
        <h2 className="text-base font-bold text-white flex items-center gap-2 tracking-wide">
          <Layers className="text-purple-400" size={16} />
          Engineering Stack
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-white/[0.04] bg-white/[0.005] p-5 space-y-2">
            <h4 className="text-xs font-bold text-white tracking-wide">Next.js &amp; TS Router</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed font-sans">
              Leverages React 19 client components and Next.js App Router for high-performance static rendering and client-side page transitions.
            </p>
          </div>
          <div className="rounded-2xl border border-white/[0.04] bg-white/[0.005] p-5 space-y-2">
            <h4 className="text-xs font-bold text-white tracking-wide">Design System &amp; UI Tokens</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed font-sans">
              Implements custom dark theme palettes and CSS variables configured directly within Tailwind for responsive visual alignments.
            </p>
          </div>
          <div className="rounded-2xl border border-white/[0.04] bg-white/[0.005] p-5 space-y-2">
            <h4 className="text-xs font-bold text-white tracking-wide">State &amp; Exporters</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed font-sans">
              Zustand manages the multi-step questionnaire state. A custom client engine utilizes jsPDF to assemble downloadable vector documents.
            </p>
          </div>
        </div>
      </section>

      {/* Educational outcomes */}
      <section className="space-y-6 animate-fade-in-up delay-400">
        <h2 className="text-base font-bold text-white flex items-center gap-2 tracking-wide">
          <BookOpen className="text-green-400" size={16} />
          Key Educational Outcomes
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px] text-gray-400 font-sans leading-relaxed">
          <div className="space-y-1.5 p-4 rounded-xl border border-white/[0.03] bg-[#111827]/10">
            <span className="font-bold text-white block">CIA Triad Mapping</span>
            <span>Observe how access security, application downloads, and storage redundancy map to Confidentiality, Integrity, and Availability pillars.</span>
          </div>
          <div className="space-y-1.5 p-4 rounded-xl border border-white/[0.03] bg-[#111827]/10">
            <span className="font-bold text-white block">Kill-Chain Visualization</span>
            <span>Learn how threat actors exploit weak nodes step-by-step to escalate system administrative permissions and compromise database files.</span>
          </div>
          <div className="space-y-1.5 p-4 rounded-xl border border-white/[0.03] bg-[#111827]/10">
            <span className="font-bold text-white block">Remediation Validation</span>
            <span>Validate system changes instantly in the Sandbox to inspect risk offsets, developing an intuition for secure setup architectures.</span>
          </div>
        </div>
      </section>

      {/* Future roadmap */}
      <section className="space-y-4 animate-fade-in-up delay-500">
        <h2 className="text-base font-bold text-white flex items-center gap-2 tracking-wide">
          <Forward className="text-blue-400" size={16} />
          Future Scope &amp; Enhancements
        </h2>
        <p className="text-[11px] text-gray-400 leading-relaxed font-sans max-w-2xl">
          Future enhancements include AI-driven compliance blueprint generation, active feed integration for CVE vulnerability alerts, custom infrastructure layout setups, and local file scanner plugins.
        </p>
      </section>
    </div>
  );
}
