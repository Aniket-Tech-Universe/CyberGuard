import { AttackPath, WhatIfToggles } from "../types";

export function getAttackPaths(
  answers: Record<string, string>,
  whatIfToggles: WhatIfToggles
): AttackPath[] {
  // 1. Evaluate individual vulnerability states
  const hasWeakPassword =
    (answers.passwords === "reused-simple" || !answers.passwords) &&
    !whatIfToggles.uniquePasswords;

  const hasNoMfa =
    (answers.mfa === "no-mfa" || !answers.mfa) &&
    !whatIfToggles.enableMfa;

  const hasOutdatedOs =
    (answers.os_updates === "no-updates" || !answers.os_updates) &&
    !whatIfToggles.updateOs;

  const hasOutdatedBrowser =
    (answers.browser_updates === "never-update" || !answers.browser_updates) &&
    !whatIfToggles.updateOs;

  const hasNoAntivirus =
    (answers.antivirus === "no-antivirus" || !answers.antivirus) &&
    !whatIfToggles.installAntivirus;

  const runsAsAdmin =
    (answers.admin_usage === "admin-user" || !answers.admin_usage);

  const hasInsecureWifi =
    (answers.public_wifi === "unsecured-wifi" || !answers.public_wifi) &&
    !whatIfToggles.secureWifi;

  const hasNoBackup =
    (answers.backups === "no-backup" || !answers.backups);

  // --- PATH 1: CREDENTIAL COMPROMISE ---
  // If passwords are weak and/or MFA is disabled
  const credentialPathIsActive = hasWeakPassword || hasNoMfa;
  const credentialHarvested = hasWeakPassword;
  const takeoverActive = credentialHarvested && hasNoMfa;
  const accessActive = takeoverActive;
  const dataExposureActive = accessActive;

  const path1: AttackPath = {
    id: "credential-theft",
    name: "Credential Harvest & Account Takeover",
    description: "How weak access control allows unauthorized entry to cloud services.",
    triggerVulnerability: "Weak passwords or disabled MFA",
    isCompromised: dataExposureActive,
    nodes: [
      {
        id: "c1",
        label: "Phishing / Brute Force",
        description: "Attacker attempts to steal passwords or brute-force logins.",
        status: credentialPathIsActive ? "active-exploit" : "secure",
        mitigationText: "Use a Password Manager for complex passwords."
      },
      {
        id: "c2",
        label: "Credential Harvested",
        description: "User password is leaked or cracked.",
        status: credentialHarvested ? "active-exploit" : (credentialPathIsActive ? "vulnerable" : "secure"),
        mitigationText: "Unique strong passwords block reuse attacks."
      },
      {
        id: "c3",
        label: "Account Takeover",
        description: "Attacker logs in as user on primary services.",
        status: takeoverActive ? "active-exploit" : (credentialHarvested ? "vulnerable" : "secure"),
        mitigationText: "Enable MFA to block access even if password is leaked."
      },
      {
        id: "c4",
        label: "Unauthorized Access",
        description: "Attacker accesses private files, accounts, and contacts.",
        status: accessActive ? "active-exploit" : "secure",
        mitigationText: "MFA blocks initial access."
      },
      {
        id: "c5",
        label: "Sensitive Data Exposure",
        description: "User private data, banking, or emails are compromised.",
        status: dataExposureActive ? "active-exploit" : "secure",
        mitigationText: "Blocked by preventing Account Takeover."
      }
    ],
    links: [
      { source: "c1", target: "c2", isActive: hasWeakPassword },
      { source: "c2", target: "c3", isActive: hasWeakPassword && hasNoMfa },
      { source: "c3", target: "c4", isActive: takeoverActive },
      { source: "c4", target: "c5", isActive: accessActive }
    ]
  };

  // --- PATH 2: SYSTEM EXPLOIT & RANSOMWARE ---
  // If OS is outdated, antivirus is disabled, or downloads are bad
  const exploitPathActive = hasOutdatedOs || hasOutdatedBrowser || hasNoAntivirus;
  const payloadRunActive = (hasOutdatedOs || hasOutdatedBrowser) && hasNoAntivirus;
  const privilegeEscActive = payloadRunActive && runsAsAdmin;
  const ransomwareActive = privilegeEscActive && hasNoBackup;

  const path2: AttackPath = {
    id: "ransomware",
    name: "System Exploit & Ransomware Attack",
    description: "How software vulnerabilities and administrative rights lead to system lockouts.",
    triggerVulnerability: "Outdated OS, missing antivirus, or administrative habits",
    isCompromised: ransomwareActive,
    nodes: [
      {
        id: "e1",
        label: "Drive-by Download",
        description: "Attacker hosts exploit kits targeting software bugs.",
        status: exploitPathActive ? "active-exploit" : "secure",
        mitigationText: "Keep web browsers and OS updated to patch bugs."
      },
      {
        id: "e2",
        label: "Vulnerability Exploited",
        description: "Outdated OS/Browser allows malicious shellcode execution.",
        status: (hasOutdatedOs || hasOutdatedBrowser) ? "active-exploit" : (exploitPathActive ? "vulnerable" : "secure"),
        mitigationText: "Enable automatic OS and browser updates."
      },
      {
        id: "e3",
        label: "Malware Payload Injection",
        description: "Malicious trojan executes in memory without detection.",
        status: payloadRunActive ? "active-exploit" : ((hasOutdatedOs || hasOutdatedBrowser) ? "vulnerable" : "secure"),
        mitigationText: "Run active Endpoint Protection / Antivirus."
      },
      {
        id: "e4",
        label: "Local Admin Privilege",
        description: "Malware inherits administrator rights to overwrite core system files.",
        status: privilegeEscActive ? "active-exploit" : "secure",
        mitigationText: "Work on a Standard User account to block system alterations."
      },
      {
        id: "e5",
        label: "Ransomware Lockdown",
        description: "All files are encrypted; attacker demands ransom for key.",
        status: ransomwareActive ? "active-exploit" : "secure",
        mitigationText: "Maintain offline backups to recover without paying."
      }
    ],
    links: [
      { source: "e1", target: "e2", isActive: hasOutdatedOs || hasOutdatedBrowser },
      { source: "e2", target: "e3", isActive: (hasOutdatedOs || hasOutdatedBrowser) && hasNoAntivirus },
      { source: "e3", target: "e4", isActive: payloadRunActive && runsAsAdmin },
      { source: "e4", target: "e5", isActive: privilegeEscActive && hasNoBackup }
    ]
  };

  // --- PATH 3: MAN-IN-THE-MIDDLE NETWORKING ---
  // If user connects to unsecured public Wi-Fi
  const wifiPathActive = hasInsecureWifi;
  const sniffingActive = wifiPathActive;
  const interceptionActive = sniffingActive;
  const impersonActive = interceptionActive;
  const datastealActive = impersonActive;

  const path3: AttackPath = {
    id: "mitm",
    name: "Public Wi-Fi Man-in-the-Middle (MitM)",
    description: "How network eavesdropping compromises credentials and session tokens in transit.",
    triggerVulnerability: "Insecure Public Wi-Fi usage",
    isCompromised: datastealActive,
    nodes: [
      {
        id: "w1",
        label: "Rogue Wi-Fi Access Point",
        description: "Attacker sets up a fake hotspot or monitors public traffic.",
        status: wifiPathActive ? "active-exploit" : "secure",
        mitigationText: "Avoid unsecured public Wi-Fi or use a secure VPN."
      },
      {
        id: "w2",
        label: "Traffic Sniffing",
        description: "Attacker captures raw data packets transmitted over the air.",
        status: sniffingActive ? "active-exploit" : "secure",
        mitigationText: "VPN encrypts data, making sniffed packets unreadable."
      },
      {
        id: "w3",
        label: "Session Token Interception",
        description: "Attacker extracts authentication cookie tokens from headers.",
        status: interceptionActive ? "active-exploit" : "secure",
        mitigationText: "VPN blocks token sniffing at the local layer."
      },
      {
        id: "w4",
        label: "Session Impersonation",
        description: "Attacker clones tokens to bypass password verification.",
        status: impersonActive ? "active-exploit" : "secure",
        mitigationText: "Multi-Factor Authentication and encryption protect sessions."
      },
      {
        id: "w5",
        label: "Account & Data Theft",
        description: "Attacker downloads data from the hijacked session.",
        status: datastealActive ? "active-exploit" : "secure",
        mitigationText: "Use secure encrypted tunnels (VPN) to safeguard sessions."
      }
    ],
    links: [
      { source: "w1", target: "w2", isActive: hasInsecureWifi },
      { source: "w2", target: "w3", isActive: sniffingActive },
      { source: "w3", target: "w4", isActive: interceptionActive },
      { source: "w4", target: "w5", isActive: impersonActive }
    ]
  };

  return [path1, path2, path3];
}
