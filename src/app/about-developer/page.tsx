"use client";

import { Shield, Award, UserCheck, Heart } from "lucide-react";

export default function AboutDeveloperPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-12 pb-16">
      {/* Header */}
      <div className="border-b border-gray-800 pb-5">
        <h1 className="text-3xl font-extrabold text-white">About The Developer</h1>
        <p className="mt-1.5 text-sm text-gray-400">
          The mind behind the educational Cyber Risk visualizer project.
        </p>
      </div>

      {/* Profile Card */}
      <div className="rounded-2xl border border-gray-800 bg-surface p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-start gap-8 shadow-xl">
        {/* Placeholder Avatar Icon */}
        <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white shadow-[0_0_25px_rgba(139,92,246,0.3)]">
          <UserCheck size={48} className="animate-pulse" />
        </div>

        <div className="space-y-4 text-center md:text-left w-full">
          <div>
            <h2 className="text-xl font-bold text-white">Student Developer</h2>
            <p className="text-xs text-blue-400 font-semibold mt-0.5">GTU SBTP 2026 Cyber Security Intern</p>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed">
            I am a student developer passionate about full-stack web engineering and cybersecurity. Building CyberGuard has been an incredibly educational experience, blending visual client dashboard programming with threat modeling and CIA triad principles.
          </p>

          <div className="flex justify-center md:justify-start gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-gray-800 bg-[#0B0F19] px-3.5 py-2 text-xs font-semibold text-gray-400 hover:text-white transition"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-gray-800 bg-[#0B0F19] px-3.5 py-2 text-xs font-semibold text-gray-400 hover:text-white transition"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      {/* Grid: Motivation & Skill Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border border-gray-800 bg-gray-900/10 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-purple-400">
            <Heart size={16} fill="currentColor" className="opacity-80" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Project Motivation</h3>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            I wanted to create an app that doesn&apos;t just ask user questions and say &quot;you&apos;re unsafe&quot;. By integrating the What-If simulation toggles and visual attack paths, CyberGuard lets users instantly see how simple adjustments protect them, making cybersecurity training actionable and interactive.
          </p>
        </div>

        <div className="border border-gray-800 bg-gray-900/10 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-green-400">
            <Award size={16} />
            <h3 className="text-xs font-bold uppercase tracking-wider">Core Capabilities</h3>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="rounded bg-gray-800 px-2 py-1 text-[10px] text-gray-300">Next.js App Router</span>
            <span className="rounded bg-gray-800 px-2 py-1 text-[10px] text-gray-300">TypeScript Type Safety</span>
            <span className="rounded bg-gray-800 px-2 py-1 text-[10px] text-gray-300">Tailwind Styling</span>
            <span className="rounded bg-gray-800 px-2 py-1 text-[10px] text-gray-300">Zustand State</span>
            <span className="rounded bg-gray-800 px-2 py-1 text-[10px] text-gray-300">jsPDF Exporter</span>
            <span className="rounded bg-gray-800 px-2 py-1 text-[10px] text-gray-300">Threat Modeling</span>
          </div>
        </div>
      </div>

      {/* Academic Endorsement Note */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/20 p-4 flex items-start gap-3">
        <Shield className="text-blue-500 shrink-0 mt-0.5" size={16} />
        <p className="text-[11px] text-gray-500 leading-relaxed">
          This project was developed under the supervision of university sessional heads for the GTU SBTP 2026 cybersecurity internship requirement. Coursework references including CIA triad ratings and attack mapping were vetted for academic accuracy.
        </p>
      </div>
    </div>
  );
}
