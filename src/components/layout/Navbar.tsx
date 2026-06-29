"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, BarChart3, Info, User, HelpCircle, Menu, X, FileText, Terminal } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { href: "/", label: "Home", icon: Shield },
    { href: "/assessment", label: "Security Audit", icon: HelpCircle },
    { href: "/dashboard", label: "Risk Visualizer", icon: BarChart3 },
    { href: "/reports", label: "Audit Trail", icon: FileText },
    { href: "/terminal", label: "Sandbox Terminal", icon: Terminal },
    { href: "/about-project", label: "Project Details", icon: Info },
    { href: "/about-developer", label: "Developer Bio", icon: User },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.04] bg-[#0B0F19]/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 transition-transform hover:scale-[1.01]">
          {/* Double-shield vector logo */}
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-lg shadow-blue-500/10">
            <Shield size={16} className="relative z-10" />
            <div className="absolute inset-0 rounded-lg bg-blue-500/20 blur-[2px] transition-opacity" />
          </div>
          <span className="text-base font-semibold tracking-tight text-white">
            Cyber<span className="text-blue-500 font-medium">Guard</span>
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
                className={`relative flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium tracking-wide transition-all duration-200 ${
                  isActive
                    ? "bg-white/[0.03] text-blue-400 border border-white/[0.04] shadow-inner"
                    : "text-gray-400 hover:bg-white/[0.01] hover:text-white"
                }`}
              >
                <Icon size={13} className={isActive ? "text-blue-400" : "text-gray-500"} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {/* Low profile version badge */}
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/[0.05] bg-white/[0.02] px-3 py-1 text-[10px] font-medium tracking-wider text-gray-400">
            <span className="h-1 w-1 rounded-full bg-blue-400" />
            v2.0.0
          </span>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex md:hidden h-8 w-8 items-center justify-center rounded-lg border border-white/[0.05] bg-white/[0.01] text-gray-400 hover:bg-white/[0.03] hover:text-white transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/[0.04] bg-[#0B0F19]/95 px-4 py-4 space-y-1.5 animate-fade-in-up">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-medium tracking-wide transition-all duration-150 ${
                  isActive
                    ? "bg-white/[0.03] text-blue-400 border border-white/[0.04]"
                    : "text-gray-400 hover:bg-white/[0.01] hover:text-white"
                }`}
              >
                <Icon size={15} />
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
