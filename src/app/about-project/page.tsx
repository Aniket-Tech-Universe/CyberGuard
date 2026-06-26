"use client";

import { Shield, Target, BookOpen, Layers, Forward, Award } from "lucide-react";

export default function AboutProjectPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-12 pb-16">
      {/* Header */}
      <div className="border-b border-gray-800 pb-5">
        <h1 className="text-3xl font-extrabold text-white">About CyberGuard</h1>
        <p className="mt-1.5 text-sm text-gray-400">
          Project context, architecture decisions, and alignment with IBM SkillsBuild + GTU SBTP 2026.
        </p>
      </div>

      {/* Problem Statement & Mission */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
            <Shield size={18} />
          </div>
          <h2 className="text-xl font-bold text-white">Problem Statement</h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            Most end-users struggle to comprehend how minor cybersecurity neglects (like skipping an OS update or reusing a password on a minor site) chain together to cause major breaches. Traditional training uses boring text slides, whereas users require interactive, visual modeling to build true threat intuition.
          </p>
        </div>

        <div className="space-y-4">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
            <Target size={18} />
          </div>
          <h2 className="text-xl font-bold text-white">Objectives &amp; Mission</h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            CyberGuard translates personal habits into a quantifiable 0-100 risk score and maps them to the CIA Triad. Its interactive timeline simulation shows how threat actors traverse exploits, demonstrating how controls (like MFA or antivirus) block attacks in real-time.
          </p>
        </div>
      </section>

      {/* Program Alignment Banner */}
      <section className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 space-y-3">
        <div className="flex items-center gap-2 text-blue-400">
          <Award size={20} />
          <h3 className="text-sm font-bold uppercase tracking-wider">IBM SkillsBuild &amp; GTU SBTP Alignment</h3>
        </div>
        <p className="text-xs text-gray-300 leading-relaxed">
          Developed in compliance with the **Gujarat Technological University (GTU) Security Best Practices (SBTP) 2026** guidelines. CyberGuard reinforces core learning elements such as the Principle of Least Privilege, physical access limits, browser sandbox controls, and the 3-2-1 backup strategy.
        </p>
      </section>

      {/* Project Implementation Highlights */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Layers className="text-purple-400" size={20} />
          Technical Stack
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          <div className="border border-gray-800 bg-gray-900/10 rounded-xl p-4 space-y-2">
            <h4 className="font-bold text-white">Next.js &amp; TS Architecture</h4>
            <p className="text-gray-400 leading-relaxed">
              Built on React 19 and Next.js App Router for optimized static bundle routing and high-performance client rendering.
            </p>
          </div>
          <div className="border border-gray-800 bg-gray-900/10 rounded-xl p-4 space-y-2">
            <h4 className="font-bold text-white">Tailwind &amp; CSS Tokens</h4>
            <p className="text-gray-400 leading-relaxed">
              Uses a tailored dark palette (Background `#0B0F19`, Surface `#111827`) configured in Tailwind for a premium SaaS visual aesthetic.
            </p>
          </div>
          <div className="border border-gray-800 bg-gray-900/10 rounded-xl p-4 space-y-2">
            <h4 className="font-bold text-white">State &amp; PDF Engines</h4>
            <p className="text-gray-400 leading-relaxed">
              Zustand manages the assessment wizard index. A custom client-side compiler uses jsPDF to compile downloadable audits.
            </p>
          </div>
        </div>
      </section>

      {/* Learning Outcomes */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen className="text-green-400" size={20} />
          Educational Outcomes
        </h2>
        <div className="space-y-3 text-xs text-gray-400 leading-relaxed">
          <p>
            • **CIA Triad Quantification**: Learn how distinct system habits affect Confidentiality (MFA/Passwords), Integrity (Antivirus/OS patches), and Availability (Backups).
          </p>
          <p>
            • **Kill-Chain Intuition**: Understand how threat actors do not use magic; they chain simple failures (outdated OS + administrative accounts) to escalate privileges.
          </p>
          <p>
            • **Mitigation Validation**: Observe how toggling basic controls changes risk states instantly, illustrating cost-effectiveness in security design.
          </p>
        </div>
      </section>

      {/* Future Scope */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Forward className="text-blue-400" size={20} />
          Future Enhancements
        </h2>
        <p className="text-xs text-gray-400 leading-relaxed">
          Planned scope items include: AI-powered custom remediation blueprints, live RSS threat advisory feeds, enterprise environment mapping configurations, and mobile companion configurations for offline testing.
        </p>
      </section>
    </div>
  );
}
