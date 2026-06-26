"use client";

import { Shield, Award, UserCheck, Heart } from "lucide-react";

export default function AboutDeveloperPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-16 pb-16 bg-grid-pattern relative">
      <div className="absolute top-20 left-10 h-[300px] w-[300px] rounded-full bg-purple-500/5 blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="border-b border-white/[0.04] pb-5 animate-fade-in-up">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Developer Profile</h1>
        <p className="mt-2 text-sm text-gray-400">
          The engineer and threat modeler behind the CyberGuard simulator application.
        </p>
      </div>

      {/* Profile Panel Card */}
      <div className="rounded-2xl border border-white/[0.04] bg-[#111827]/40 backdrop-blur-md p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-start gap-8 shadow-xl animate-fade-in-up delay-100">
        
        {/* Profile Avatar Block */}
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white shadow-xl shadow-purple-500/10">
          <UserCheck size={40} />
        </div>

        <div className="space-y-4 text-center md:text-left w-full">
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">Student Developer</h2>
            <p className="text-xs text-blue-400 font-semibold tracking-wider uppercase mt-0.5">GTU SBTP 2026 Cyber Security Intern</p>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed font-sans max-w-xl">
            I am a student developer passionate about full-stack engineering and threat modeling architectures. CyberGuard is designed to bridge the gap between abstract compliance recommendations and concrete visual simulations, giving users immediate clarity on risk controls.
          </p>

          {/* Social connections */}
          <div className="flex justify-center md:justify-start gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl border border-white/[0.05] bg-white/[0.01] hover:bg-white/[0.03] px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white transition"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub Profile
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl border border-white/[0.05] bg-white/[0.01] hover:bg-white/[0.03] px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white transition"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              LinkedIn Profile
            </a>
          </div>
        </div>
      </div>

      {/* Grid: Motivations & Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up delay-200">
        
        <div className="rounded-2xl border border-white/[0.04] bg-white/[0.005] p-6 space-y-4">
          <div className="flex items-center gap-2 text-purple-400">
            <Heart size={14} fill="currentColor" className="opacity-80" />
            <h3 className="text-xs font-bold uppercase tracking-widest">Motivation</h3>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed font-sans">
            My goal was to build a security application that moves away from static guidelines. By implementing visual attack paths and an interactive sandbox, users instantly observe risk variations. This approach transforms standard security training into an interactive learning experience.
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.04] bg-white/[0.005] p-6 space-y-4">
          <div className="flex items-center gap-2 text-green-400">
            <Award size={14} />
            <h3 className="text-xs font-bold uppercase tracking-widest">Technical Highlights</h3>
          </div>
          <div className="flex flex-wrap gap-2 pt-1 font-sans">
            <span className="rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-1.5 text-[10px] text-gray-300">Next.js App Router</span>
            <span className="rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-1.5 text-[10px] text-gray-300">TypeScript Architecture</span>
            <span className="rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-1.5 text-[10px] text-gray-300">Tailwind CSS Tokens</span>
            <span className="rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-1.5 text-[10px] text-gray-300">Zustand State Hub</span>
            <span className="rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-1.5 text-[10px] text-gray-300">jsPDF Audit Compiler</span>
            <span className="rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-1.5 text-[10px] text-gray-300">Threat Modeling Logic</span>
          </div>
        </div>
      </div>

      {/* Sessional Endorsements */}
      <div className="rounded-2xl border border-white/[0.04] bg-white/[0.01] p-5 flex items-start gap-4 animate-fade-in-up delay-300">
        <Shield className="text-blue-500 shrink-0 mt-0.5 animate-pulse" size={16} />
        <p className="text-[11px] text-gray-500 leading-relaxed font-sans">
          This educational simulator is submitted in fulfillment of sessional assessment guidelines under university heads for the GTU SBTP 2026 cybersecurity internship requirement. Logic weights, category mappings, and path flow connections have been checked for academic compliance.
        </p>
      </div>
    </div>
  );
}
