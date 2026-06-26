import { Recommendation } from "../types";

export function getRecommendations(
  answers: Record<string, string>
): Recommendation[] {
  const list: Recommendation[] = [];

  // 1. MFA Recommendation
  if (answers.mfa !== "yes-everywhere") {
    list.push({
      id: "rec-mfa",
      title: "Implement Multi-Factor Authentication (MFA)",
      description: "Deploy MFA across all critical personal and professional accounts to add an extra layer of verification beyond passwords.",
      effort: "Low",
      cost: "Free",
      riskReduction: 25,
      ciaBenefit: "Improves Confidentiality & Integrity",
      steps: [
        "Download a trusted authenticator app (e.g., Google Authenticator, Microsoft Authenticator, or Bitwarden).",
        "Log into your critical accounts (email, online banking, social media) and go to Security Settings.",
        "Select 'Enable Multi-Factor Authentication' or 'Two-Step Verification' and scan the provided QR code.",
        "Save the emergency backup recovery codes in a secure, offline location."
      ]
    });
  }

  // 2. Passwords Recommendation
  if (answers.passwords !== "password-manager") {
    list.push({
      id: "rec-passwords",
      title: "Adopt a Dedicated Password Manager",
      description: "Stop reusing passwords across services. Adopt a password manager to generate, store, and auto-fill complex, unique passwords.",
      effort: "Low",
      cost: "Free",
      riskReduction: 20,
      ciaBenefit: "Improves Confidentiality",
      steps: [
        "Select a reliable password manager (e.g., Bitwarden, 1Password, or Proton Pass).",
        "Create an extremely strong, memorable master password (avoid sharing it).",
        "Install the password manager's browser extension and mobile app.",
        "Gradually replace all reused or weak passwords with complex, random 16+ character passwords."
      ]
    });
  }

  // 3. OS Updates Recommendation
  if (answers.os_updates !== "auto-updates") {
    list.push({
      id: "rec-os_updates",
      title: "Enable Automatic Operating System Updates",
      description: "Turn on automatic updates for Windows, macOS, or Linux to ensure security patches are applied immediately upon release.",
      effort: "Low",
      cost: "Free",
      riskReduction: 15,
      ciaBenefit: "Improves Confidentiality, Integrity & Availability",
      steps: [
        "On Windows: Go to Settings -> Update & Security -> Windows Update. On macOS: Go to System Settings -> General -> Software Update.",
        "Toggle on 'Automatically keep my computer up to date'.",
        "Under advanced options, enable automatic download and installation of security response updates.",
        "Restart your device promptly when prompted to apply critical updates."
      ]
    });
  }

  // 4. Antivirus Recommendation
  if (answers.antivirus !== "active-antivirus") {
    list.push({
      id: "rec-antivirus",
      title: "Activate Active Endpoint Protection / Antivirus",
      description: "Keep a reliable antivirus or endpoint protection system running to monitor files and memory for active threats.",
      effort: "Low",
      cost: "Free",
      riskReduction: 15,
      ciaBenefit: "Improves Integrity & Availability",
      steps: [
        "Verify that built-in security software (Windows Defender) is active and running.",
        "Ensure real-time scanning, behavioral analysis, and cloud-delivered protection are enabled.",
        "Set up automatic daily virus definition updates.",
        "Run a full system scan once a month to detect dormant malware."
      ]
    });
  }

  // 5. Admin Privileges Recommendation
  if (answers.admin_usage !== "standard-user") {
    list.push({
      id: "rec-admin_usage",
      title: "Operate under a Standard User Account",
      description: "Use a standard non-admin account for everyday computer usage. Reserve administrator credentials solely for setup tasks.",
      effort: "Medium",
      cost: "Free",
      riskReduction: 15,
      ciaBenefit: "Improves Integrity & Availability",
      steps: [
        "Create a new local account on your computer and name it 'Standard' or similar.",
        "Set the account type to 'Standard User' in your system settings.",
        "Log out of your administrator account and log in using the new Standard User account.",
        "Whenever a prompt asks for Administrator permissions, input the admin password only if you explicitly triggered the request."
      ]
    });
  }

  // 6. Public Wi-Fi Recommendation
  if (answers.public_wifi !== "vpn-or-hotspot") {
    list.push({
      id: "rec-public_wifi",
      title: "Utilize a Secure Virtual Private Network (VPN)",
      description: "Encrypt your connection traffic with a VPN whenever you connect to public networks, preventing network sniffer hijacking.",
      effort: "Low",
      cost: "Low",
      riskReduction: 10,
      ciaBenefit: "Improves Confidentiality & Integrity",
      steps: [
        "Acquire a subscription to a reputable, audited VPN provider (avoid sketchy 'free' VPNs).",
        "Install the VPN client application on your computer and mobile devices.",
        "Configure the VPN app settings to 'Auto-connect' whenever joining open public networks.",
        "Alternatively, configure your smartphone as a personal encrypted Wi-Fi hotspot."
      ]
    });
  }

  // 7. Browser Updates Recommendation
  if (answers.browser_updates !== "immediate-update") {
    list.push({
      id: "rec-browser_updates",
      title: "Enable Automatic Web Browser Updates",
      description: "Ensure your primary browser automatically updates to patch sandboxed sandbox-escape bugs and zero-day vulnerabilities.",
      effort: "Low",
      cost: "Free",
      riskReduction: 10,
      ciaBenefit: "Improves Confidentiality & Integrity",
      steps: [
        "Open your browser and navigate to the settings 'About' page to force update checking.",
        "Enable automatic background updates if supported by the browser.",
        "Relaunch the browser as soon as you see the colored 'Update' warning dot.",
        "Minimize the use of legacy browser extensions, which can introduce unpatched vulnerabilities."
      ]
    });
  }

  // 8. Software Downloads Recommendation
  if (answers.downloads !== "official-only") {
    list.push({
      id: "rec-downloads",
      title: "Strictly Enforce Verified Software Downloads",
      description: "Avoid third-party search listings, torrent services, and cracked software keys, which are heavily bundled with malware.",
      effort: "Medium",
      cost: "Free",
      riskReduction: 15,
      ciaBenefit: "Improves Confidentiality & Integrity",
      steps: [
        "Download programs exclusively from official app directories (e.g. Mac/Windows Store) or official developer sites.",
        "Check URLs carefully to avoid typo-squatted domains running search ad malware.",
        "Never download or run cracked files, keygens, or games from peer-to-peer networks.",
        "Right-click downloaded installers and choose 'Scan with Antivirus' before executing."
      ]
    });
  }

  // 9. Backups Recommendation
  if (answers.backups !== "3-2-1-backup") {
    list.push({
      id: "rec-backups",
      title: "Deploy a 3-2-1 Backup Strategy",
      description: "Ensure you can recover from hardware failure, fire, or ransomware encryption by maintaining multiple copies of your data.",
      effort: "Medium",
      cost: "Low",
      riskReduction: 20,
      ciaBenefit: "Improves Availability",
      steps: [
        "Keep at least 3 copies of your data: 1 production database and 2 backups.",
        "Store backups on 2 different media types (e.g., local external SSD + secure cloud).",
        "Ensure 1 backup is stored completely offline or off-site, away from your local network.",
        "Set up automated schedules (daily or weekly) and occasionally test recovering files."
      ]
    });
  }

  // 10. USB Hygiene Recommendation
  if (answers.usb_hygiene !== "safe-usb") {
    list.push({
      id: "rec-usb_hygiene",
      title: "Practice Strict USB Hardware Hygiene",
      description: "Avoid inserting unknown USB drives, and secure physical charging points against juice-jacking data exploits.",
      effort: "Low",
      cost: "Low",
      riskReduction: 10,
      ciaBenefit: "Improves Confidentiality, Integrity & Availability",
      steps: [
        "Never connect found or promotional USB drives of unverified origins.",
        "Purchase a hardware 'USB Data Blocker' (often called a 'USB condom') for use in public USB chargers.",
        "Connect devices to standard electrical wall outlets using your own adapter instead of public USB ports.",
        "Disable Autorun/Autoplay settings for external media drives in your Operating System configurations."
      ]
    });
  }

  // Sort recommendations by risk reduction descending
  return list.sort((a, b) => b.riskReduction - a.riskReduction);
}
export function getMitigatedScore(
  baseScore: number,
  mitigatedRecIds: string[],
  recommendations: Recommendation[]
): number {
  let totalReduction = 0;
  for (const id of mitigatedRecIds) {
    const rec = recommendations.find(r => r.id === id);
    if (rec) {
      totalReduction += rec.riskReduction;
    }
  }
  // Risk cannot drop below 0
  return Math.max(0, baseScore - totalReduction);
}
