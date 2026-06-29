"use client";

import { useState, useRef, useEffect } from "react";
import { useAssessmentStore } from "@/stores/assessment-store";
import { Terminal as TerminalIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ConsoleLine {
  text: string;
  type: "input" | "output" | "error" | "success" | "warning" | "header" | "info";
}

export default function TerminalPage() {
  const { whatIfToggles, setWhatIfToggle } = useAssessmentStore();

  const [inputVal, setInputVal] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [lines, setLines] = useState<ConsoleLine[]>([
    { text: "=========================================================", type: "header" },
    { text: "         CYBERGUARD INTERACTIVE DEFENSE CLI v2.0.0       ", type: "header" },
    { text: "=========================================================", type: "header" },
    { text: "System ready. Type 'help' to review the security command list.", type: "info" },
    { text: "", type: "output" }
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  // Focus terminal input on load or click
  useEffect(() => {
    inputRef.current?.focus();
  }, []);



  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd) return;

    // Add command to output log
    const newLines = [...lines, { text: `cyberguard-shell:~# ${cmd}`, type: "input" as const }];
    const lowerCmd = cmd.toLowerCase();
    const tokens = lowerCmd.split(/\s+/);
    const mainCommand = tokens[0];

    // Add to history
    const updatedHistory = [...commandHistory, cmd];
    setCommandHistory(updatedHistory);
    setHistoryIndex(-1);

    switch (mainCommand) {
      case "help":
      case "?":
        newLines.push(
          { text: "CyberGuard CLI - Command Directory Manual:", type: "info" },
          { text: "  status                               - View active shields and security metrics.", type: "output" },
          { text: "  nmap                                 - Scan system network channels for open ports.", type: "output" },
          { text: "  mitigate [mfa|passwords|updates|antivirus|vpn] - Toggle defensive controls in real-time.", type: "output" },
          { text: "  exploit [identity|system|network]    - Execute exploit payloads to test defenses.", type: "output" },
          { text: "  clear / cls                          - Clear CLI logs screen.", type: "output" },
          { text: "  history                              - View entered prompt histories.", type: "output" },
          { text: "  help / ?                             - Display this help documentation.", type: "output" }
        );
        break;

      case "clear":
      case "cls":
        setLines([]);
        setInputVal("");
        return;

      case "history":
        if (updatedHistory.length === 0) {
          newLines.push({ text: "Command prompt history empty.", type: "output" });
        } else {
          updatedHistory.forEach((h, i) => {
            newLines.push({ text: `  ${i + 1}: ${h}`, type: "output" });
          });
        }
        break;

      case "status": {
        const mfa = whatIfToggles.enableMfa ? "ENABLED" : "DISABLED";
        const pass = whatIfToggles.uniquePasswords ? "ENABLED" : "DISABLED";
        const os = whatIfToggles.updateOs ? "ENABLED" : "DISABLED";
        const av = whatIfToggles.installAntivirus ? "ENABLED" : "DISABLED";
        const vpn = whatIfToggles.secureWifi ? "ENABLED" : "DISABLED";

        newLines.push(
          { text: "--- POSTURE SHIELD STATUS ENGINE ---", type: "info" },
          { text: `  Multi-Factor Auth (MFA):       [${mfa}]`, type: whatIfToggles.enableMfa ? "success" : "error" },
          { text: `  Unique Passwords Rule:         [${pass}]`, type: whatIfToggles.uniquePasswords ? "success" : "error" },
          { text: `  Automatic OS Updates:          [${os}]`, type: whatIfToggles.updateOs ? "success" : "error" },
          { text: `  Endpoint Antivirus Guard:      [${av}]`, type: whatIfToggles.installAntivirus ? "success" : "error" },
          { text: `  Encrypted VPN Tunnel:          [${vpn}]`, type: whatIfToggles.secureWifi ? "success" : "error" }
        );
        break;
      }

      case "nmap":
        newLines.push(
          { text: "Starting Nmap 7.92 ( https://nmap.org ) at 2026-06-27 14:44", type: "output" },
          { text: "Nmap scan report for host-node (10.0.3.12)", type: "output" },
          { text: "Host is up (0.0012s latency).", type: "output" },
          { text: "", type: "output" },
          { text: "PORT      STATE    SERVICE       VERSION", type: "info" },
          { text: "80/tcp    open     http          Apache httpd 2.4.41 (Outdated - Vulnerable to CVE-2021-41773)", type: "warning" },
          { text: "443/tcp   open     https         Apache httpd 2.4.41", type: "output" },
          { text: "3306/tcp  open     mysql         MySQL 5.7.28", type: "output" },
          { text: "8080/tcp  open     http-proxy    Squid proxy (Plaintext sniffer route)", type: "warning" },
          { text: "", type: "output" },
          { text: "Nmap done: 1 IP address (1 host up) scanned in 0.86 seconds", type: "success" }
        );
        break;

      case "mitigate": {
        const toggle = tokens[1];
        if (!toggle) {
          newLines.push({ text: "Error: Please specify control key. Usage: mitigate [mfa|passwords|updates|antivirus|vpn]", type: "error" });
          break;
        }

        const map: Record<string, keyof typeof whatIfToggles> = {
          mfa: "enableMfa",
          passwords: "uniquePasswords",
          updates: "updateOs",
          antivirus: "installAntivirus",
          vpn: "secureWifi"
        };

        const key = map[toggle];
        if (!key) {
          newLines.push({ text: `Error: Unknown control key '${toggle}'. Type 'help' for correct keys.`, type: "error" });
        } else {
          const nextVal = !whatIfToggles[key];
          setWhatIfToggle(key, nextVal);
          newLines.push({ text: `[+] Toggle updated: '${key}' set to [${nextVal ? "ENABLED" : "DISABLED"}] successfully.`, type: "success" });
        }
        break;
      }

      case "exploit": {
        const target = tokens[1];
        if (!target) {
          newLines.push({ text: "Error: Please specify target. Usage: exploit [identity|system|network]", type: "error" });
          break;
        }

        if (target === "identity") {
          newLines.push(
            { text: "[*] Initializing exploit path: Identity Breach vector...", type: "info" },
            { text: "[*] Attempting brute-force dictionaries on SSH gateway port 22...", type: "output" }
          );

          if (whatIfToggles.uniquePasswords) {
            newLines.push(
              { text: "[-] Brute-force blocked: Complex unique rules enforced. Key space search failed.", type: "warning" },
              { text: "[SUCCESS] EXPLOIT BLOCKED: Security boundary active.", type: "success" }
            );
          } else {
            newLines.push(
              { text: "[+] Success: Cracked weak reused credentials profile.", type: "warning" },
              { text: "[*] Requesting account session login permissions...", type: "output" }
            );

            if (whatIfToggles.enableMfa) {
              newLines.push(
                { text: "[!] MFA Authentication requested: Triggered secondary check.", type: "info" },
                { text: "[-] Session rejected: MFA verification challenge timed out/rejected.", type: "warning" },
                { text: "[SUCCESS] EXPLOIT BLOCKED: Access denied at Node 4 (MFA).", type: "success" }
              );
            } else {
              newLines.push(
                { text: "[+] Bypass successful: MFA authorization absent.", type: "warning" },
                { text: "[+] Admin Traversal successful. Account session token cloned.", type: "warning" },
                { text: "[CRITICAL] SYSTEM BREACHED: Database tables successfully exfiltrated.", type: "error" }
              );
            }
          }
        } else if (target === "system") {
          newLines.push(
            { text: "[*] Initializing exploit path: System Ransomware payload...", type: "info" },
            { text: "[*] Launching browser buffer overflow shellcode against port 80 Apache...", type: "output" }
          );

          if (whatIfToggles.updateOs) {
            newLines.push(
              { text: "[-] Payload execution failed: Core browser libraries patches up-to-date.", type: "warning" },
              { text: "[SUCCESS] EXPLOIT BLOCKED: Threat quarantined at Entry Node.", type: "success" }
            );
          } else {
            newLines.push(
              { text: "[+] Success: Shellcode injected into client process space.", type: "warning" },
              { text: "[*] Attempting local registry dll file system payload writes...", type: "output" }
            );

            if (whatIfToggles.installAntivirus) {
              newLines.push(
                { text: "[!] Alert: Endpoint antivirus behavior guard flagged process inject.", type: "info" },
                { text: "[-] Malware executable file quarantined.", type: "warning" },
                { text: "[SUCCESS] EXPLOIT BLOCKED: Threat neutralised at Node 3 (Host Antivirus).", type: "success" }
              );
            } else {
              newLines.push(
                { text: "[+] Executed payload script with inherited admin rights.", type: "warning" },
                { text: "[+] Encrypted local database folders. Deleted storage shadow volumes.", type: "warning" },
                { text: "[CRITICAL] SYSTEM COMPROMISED: Host directory ransomed.", type: "error" }
              );
            }
          }
        } else if (target === "network") {
          newLines.push(
            { text: "[*] Initializing exploit path: Public Wi-Fi Sniffing...", type: "info" },
            { text: "[*] Setting sniffer agent in monitor mode on SSIDs...", type: "output" }
          );

          if (whatIfToggles.secureWifi) {
            newLines.push(
              { text: "[+] IPSec VPN encryption tunnel active.", type: "success" },
              { text: "[-] Sniffer captured ciphertext packet load. Decryption failed.", type: "warning" },
              { text: "[SUCCESS] EXPLOIT BLOCKED: Communication stream secure.", type: "success" }
            );
          } else {
            newLines.push(
              { text: "[+] Plaintext network packet headers captured.", type: "warning" },
              { text: "[+] Session cookies and headers extracted from TCP stream.", type: "warning" },
              { text: "[CRITICAL] NETWORK HIJACKED: User account session hijacked via MitM.", type: "error" }
            );
          }
        } else {
          newLines.push({ text: `Error: Unknown exploit vector '${target}'. Use exploit [identity|system|network].`, type: "error" });
        }
        break;
      }

      default:
        newLines.push({ text: `cyberguard-shell: command not found: '${mainCommand}'. Type 'help' for command reference.`, type: "error" });
    }

    setLines(newLines);
    setInputVal("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputVal(commandHistory[nextIndex]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInputVal("");
      } else {
        setHistoryIndex(nextIndex);
        setInputVal(commandHistory[nextIndex]);
      }
    }
  };

  return (
    <div className="space-y-6 pb-16 bg-grid-pattern relative">
      <div className="absolute top-20 right-10 h-[300px] w-[300px] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

      {/* Header navigations */}
      <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.05] bg-white/[0.02] text-gray-400 transition-colors hover:bg-white/[0.05] hover:text-white"
          >
            <ArrowLeft size={14} />
          </Link>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white">Threat Sandbox Terminal</h1>
            <p className="text-[11px] text-gray-500 font-sans">Run interactive console-based exploit simulations and secure system channels</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[9px] font-mono text-gray-400 bg-white/[0.02] border border-white/[0.05] px-3 py-1.5 rounded-lg">
          <TerminalIcon size={12} className="text-blue-500 animate-pulse" />
          <span>SHELL CONSOLE SESSION</span>
        </div>
      </div>

      {/* Retro terminal console container */}
      <div
        className="rounded-2xl border border-white/[0.06] bg-[#030712] p-5 shadow-2xl space-y-4 font-mono text-xs max-w-4xl mx-auto flex flex-col min-h-[500px]"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Terminal Screen log */}
        <div className="flex-1 space-y-2 overflow-y-auto pr-2 max-h-[420px] scrollbar-thin">
          {lines.map((line, idx) => {
            let color = "text-gray-300";
            if (line.type === "input") color = "text-blue-400 font-bold";
            else if (line.type === "header") color = "text-blue-500 font-bold";
            else if (line.type === "info") color = "text-cyan-400";
            else if (line.type === "error") color = "text-red-500 font-semibold";
            else if (line.type === "warning") color = "text-amber-500";
            else if (line.type === "success") color = "text-green-400 font-bold";

            return (
              <div key={idx} className={`${color} leading-relaxed whitespace-pre-wrap`}>
                {line.text}
              </div>
            );
          })}
          <div ref={terminalEndRef} />
        </div>

        {/* Input prompt line */}
        <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 border-t border-white/[0.04] pt-4">
          <span className="text-green-400 font-bold shrink-0">cyberguard-shell:~#</span>
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent text-white outline-none border-none caret-blue-500 w-full"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        </form>
      </div>

      {/* Exploit command helper cues */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans text-xs">
        <div className="rounded-xl border border-white/[0.03] bg-[#111827]/20 p-4">
          <h4 className="font-bold text-white mb-1 uppercase tracking-wider text-[10px] text-blue-400">Scan Hosts</h4>
          <p className="text-gray-500 leading-normal mb-2">Audit ports and service versions running on the local host subnet.</p>
          <span className="font-mono text-[10px] bg-black/40 px-2 py-1 rounded border border-white/[0.04] text-amber-500">nmap</span>
        </div>
        <div className="rounded-xl border border-white/[0.03] bg-[#111827]/20 p-4">
          <h4 className="font-bold text-white mb-1 uppercase tracking-wider text-[10px] text-blue-400">Launch Exploits</h4>
          <p className="text-gray-500 leading-normal mb-2">Simulate attack payloads trying to breach system ports.</p>
          <span className="font-mono text-[10px] bg-black/40 px-2 py-1 rounded border border-white/[0.04] text-amber-500">exploit system</span>
        </div>
        <div className="rounded-xl border border-white/[0.03] bg-[#111827]/20 p-4">
          <h4 className="font-bold text-white mb-1 uppercase tracking-wider text-[10px] text-blue-400">Configure Controls</h4>
          <p className="text-gray-500 leading-normal mb-2">Toggle vulnerability shields and mitigations direct from CLI.</p>
          <span className="font-mono text-[10px] bg-black/40 px-2 py-1 rounded border border-white/[0.04] text-amber-500">mitigate mfa</span>
        </div>
      </div>
    </div>
  );
}
