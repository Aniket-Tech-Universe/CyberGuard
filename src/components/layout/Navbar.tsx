"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAssessmentStore } from "@/stores/assessment-store";
import { Shield, ShieldAlert, BarChart3, Info, User, HelpCircle, Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { isSubmitted } = useAssessmentStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { href: "/", label: "Home", icon: Shield },
    {
      href: isSubmitted ? "/dashboard" : "/assessment",
      label: isSubmitted ? "Dashboard" : "Assessment",
      icon: isSubmitted ? BarChart3 : HelpCircle,
    },
    ...(isSubmitted ? [{ href: "/assessment", label: "Retake", icon: HelpCircle }] : []),
    { href: "/about-project", label: "About Project", icon: Info },
    { href: "/about-developer", label: "About Developer", icon: User },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-[#0B0F19]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 transition-transform hover:scale-[1.02]">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <ShieldAlert size={20} className="animate-pulse" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Cyber<span className="text-blue-500">Guard</span>
          </span>
        </Link>

        {/* Desktop Navbar */}
        <nav className="hidden md:flex items-center gap-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                    : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
                }`}
              >
                <Icon size={16} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400 border border-blue-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-ping" />
            IBM SkillsBuild 2026
          </span>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex md:hidden h-9 w-9 items-center justify-center rounded-lg border border-gray-800 text-gray-400 hover:bg-gray-850 hover:text-white transition-colors"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-gray-800 bg-[#0B0F19]/95 px-4 py-4 space-y-2 animate-in fade-in slide-in-from-top-3 duration-200">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                    : "text-gray-400 hover:bg-gray-850 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
