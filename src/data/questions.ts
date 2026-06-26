import { Question } from "../types";

export const QUESTIONS: Question[] = [
  {
    id: "mfa",
    category: "Identity & Access Control",
    question: "Do you use Multi-Factor Authentication (MFA) on your critical accounts (Email, Banking, Social Media)?",
    description: "MFA requires you to verify your identity using two or more separate verification methods before accessing an account.",
    options: [
      {
        label: "Yes, everywhere possible",
        value: "yes-everywhere",
        scoreImpact: 0,
        ciaImpact: { confidentiality: 0, integrity: 0, availability: 0 },
        description: "Robust protection. Even if your password is stolen, hackers cannot access your account."
      },
      {
        label: "Yes, but only on my email",
        value: "email-only",
        scoreImpact: 10,
        ciaImpact: { confidentiality: 10, integrity: 10, availability: 5 },
        description: "Partial protection. Other accounts remain vulnerable to credential theft or takeover."
      },
      {
        label: "No, password only",
        value: "no-mfa",
        scoreImpact: 25,
        ciaImpact: { confidentiality: 25, integrity: 20, availability: 15 },
        description: "Critical risk. Hackers can easily compromise your account with credential stuffing or phishing."
      }
    ]
  },
  {
    id: "passwords",
    category: "Identity & Access Control",
    question: "How do you manage passwords across your online accounts?",
    description: "Reusing passwords means a single database breach on one website can compromise all your accounts.",
    options: [
      {
        label: "Unique passwords stored in a Password Manager",
        value: "password-manager",
        scoreImpact: 0,
        ciaImpact: { confidentiality: 0, integrity: 0, availability: 0 },
        description: "Excellent practice. High-strength passwords prevent brute-force attacks."
      },
      {
        label: "Different passwords memorized in my head",
        value: "memorized-different",
        scoreImpact: 8,
        ciaImpact: { confidentiality: 5, integrity: 5, availability: 5 },
        description: "Moderate protection. Memorized passwords tend to follow guessable patterns."
      },
      {
        label: "Reuse 1-2 simple passwords across multiple accounts",
        value: "reused-simple",
        scoreImpact: 20,
        ciaImpact: { confidentiality: 20, integrity: 15, availability: 10 },
        description: "High risk. A breach at any minor service instantly exposes your primary accounts."
      }
    ]
  },
  {
    id: "os_updates",
    category: "Device Security",
    question: "How often do you apply software and Operating System updates?",
    description: "Software vendors release security patches to fix newly discovered code vulnerabilities. Delaying updates leaves you exposed.",
    options: [
      {
        label: "Automatically installed as soon as they are available",
        value: "auto-updates",
        scoreImpact: 0,
        ciaImpact: { confidentiality: 0, integrity: 0, availability: 0 },
        description: "Best practice. Minimizes the window of exposure for zero-day exploits."
      },
      {
        label: "Manually install updates when prompted (within a week)",
        value: "manual-updates",
        scoreImpact: 5,
        ciaImpact: { confidentiality: 5, integrity: 5, availability: 5 },
        description: "Adequate protection, but leaves a temporary window open for attackers."
      },
      {
        label: "Rarely update or disabled update notifications",
        value: "no-updates",
        scoreImpact: 15,
        ciaImpact: { confidentiality: 12, integrity: 15, availability: 15 },
        description: "High risk. System is vulnerable to public exploits and automated worm-based malware."
      }
    ]
  },
  {
    id: "antivirus",
    category: "Device Security",
    question: "Is an active antivirus / endpoint security software running on your computer?",
    description: "Antivirus software actively scans, detects, blocks, and removes malicious code before it executes.",
    options: [
      {
        label: "Yes, built-in (e.g., Windows Defender) or premium antivirus is active",
        value: "active-antivirus",
        scoreImpact: 0,
        ciaImpact: { confidentiality: 0, integrity: 0, availability: 0 },
        description: "Good coverage. System actively detects known malware signatures and behaviors."
      },
      {
        label: "Yes, but it is outdated or I only run manual scans",
        value: "outdated-antivirus",
        scoreImpact: 7,
        ciaImpact: { confidentiality: 5, integrity: 7, availability: 7 },
        description: "Reduced protection. Outdated databases cannot detect newly developed malware variants."
      },
      {
        label: "No, I do not have antivirus software running",
        value: "no-antivirus",
        scoreImpact: 15,
        ciaImpact: { confidentiality: 12, integrity: 15, availability: 15 },
        description: "High risk. Trojan files and script exploits can run completely undetected on your system."
      }
    ]
  },
  {
    id: "admin_usage",
    category: "Device Security",
    question: "Do you use an Administrator account for your everyday computing tasks?",
    description: "Admin accounts have full control over the system. If malware infects an admin account, it inherits full control.",
    options: [
      {
        label: "No, I use a Standard User account for daily work",
        value: "standard-user",
        scoreImpact: 0,
        ciaImpact: { confidentiality: 0, integrity: 0, availability: 0 },
        description: "Least Privilege principle. Malware is blocked from modifying core system settings."
      },
      {
        label: "Yes, I run daily tasks on an Administrator account",
        value: "admin-user",
        scoreImpact: 15,
        ciaImpact: { confidentiality: 10, integrity: 15, availability: 12 },
        description: "High risk. Any malicious script or browser download can silently overwrite system files."
      }
    ]
  },
  {
    id: "public_wifi",
    category: "Network Security",
    question: "How do you connect your device when using public Wi-Fi networks (cafes, hotels)?",
    description: "Unsecured public networks allow local attackers to intercept data packets in transit (Man-in-the-Middle attacks).",
    options: [
      {
        label: "Always use a secure VPN or mobile data hotspot",
        value: "vpn-or-hotspot",
        scoreImpact: 0,
        ciaImpact: { confidentiality: 0, integrity: 0, availability: 0 },
        description: "Highly secure. Encrypts all web traffic, shielding data from network eavesdroppers."
      },
      {
        label: "Connect directly, but only log into HTTPS websites",
        value: "https-only",
        scoreImpact: 4,
        ciaImpact: { confidentiality: 5, integrity: 3, availability: 0 },
        description: "Moderate protection. Protects request content, but leaks domain names (DNS) and metadata."
      },
      {
        label: "Connect directly without a VPN or taking precautions",
        value: "unsecured-wifi",
        scoreImpact: 10,
        ciaImpact: { confidentiality: 10, integrity: 8, availability: 2 },
        description: "High risk. Interception tools can easily steal active login tokens and unencrypted data."
      }
    ]
  },
  {
    id: "browser_updates",
    category: "Device Security",
    question: "How do you manage updates for your web browser (Chrome, Edge, Safari)?",
    description: "Web browsers are the primary window to the internet. Outdated browsers are target targets for drive-by downloads.",
    options: [
      {
        label: "Relaunch/update the browser as soon as prompted",
        value: "immediate-update",
        scoreImpact: 0,
        ciaImpact: { confidentiality: 0, integrity: 0, availability: 0 },
        description: "Browser sandbox escapes are patched quickly, protecting your session."
      },
      {
        label: "Ignore updates for weeks until I restart my computer",
        value: "delayed-update",
        scoreImpact: 5,
        ciaImpact: { confidentiality: 5, integrity: 5, availability: 3 },
        description: "Leaves your browser vulnerable to web exploits that target patch deltas."
      },
      {
        label: "Rarely update or disable update checking",
        value: "never-update",
        scoreImpact: 10,
        ciaImpact: { confidentiality: 10, integrity: 10, availability: 5 },
        description: "Critical hazard. Malicious web ads can exploit the browser process to run local code."
      }
    ]
  },
  {
    id: "downloads",
    category: "Data Security",
    question: "From where do you download files and software programs?",
    description: "Untrusted sources are a primary vector for malware distribution, including info-stealers and ransomware.",
    options: [
      {
        label: "Official App Stores or official verified developer websites only",
        value: "official-only",
        scoreImpact: 0,
        ciaImpact: { confidentiality: 0, integrity: 0, availability: 0 },
        description: "High integrity. Verified signatures guarantee that software hasn't been repackaged."
      },
      {
        label: "Occasionally from general search engine results or blog posts",
        value: "general-search",
        scoreImpact: 6,
        ciaImpact: { confidentiality: 5, integrity: 5, availability: 2 },
        description: "Risky. Search ads often spoof official domains (malvertising) to deliver malware."
      },
      {
        label: "Peer-to-peer (Torrents) or sites offering cracked software keys",
        value: "torrents-cracked",
        scoreImpact: 15,
        ciaImpact: { confidentiality: 15, integrity: 15, availability: 10 },
        description: "Severe hazard. Cracked software is almost universally bundled with silent background trojans."
      }
    ]
  },
  {
    id: "backups",
    category: "Data Security",
    question: "What is your backup strategy for important personal and work files?",
    description: "Backups protect your data against hardware failures, physical loss, theft, and ransomware encryption.",
    options: [
      {
        label: "Automated, versioned cloud backups combined with periodic offline external drives",
        value: "3-2-1-backup",
        scoreImpact: 0,
        ciaImpact: { confidentiality: 0, integrity: 0, availability: 0 },
        description: "Gold standard (3-2-1 backup strategy). High resilience against ransomware."
      },
      {
        label: "Manual copies to a USB drive or cloud storage occasionally",
        value: "manual-backup",
        scoreImpact: 8,
        ciaImpact: { confidentiality: 0, integrity: 0, availability: 10 },
        description: "Partial protection. Data since the last backup is permanently lost in a disaster."
      },
      {
        label: "I do not back up my files",
        value: "no-backup",
        scoreImpact: 20,
        ciaImpact: { confidentiality: 0, integrity: 0, availability: 20 },
        description: "Extreme risk. A hardware crash or ransomware attack results in irreversible data loss."
      }
    ]
  },
  {
    id: "usb_hygiene",
    category: "Device Security",
    question: "Do you plug unknown USB flash drives into your computer, or use public USB charging ports?",
    description: "USB devices can carry hardware exploits (e.g. BadUSB) that act as keyboard emulators to run commands.",
    options: [
      {
        label: "Never connect unknown USBs; use data-blockers on public chargers",
        value: "safe-usb",
        scoreImpact: 0,
        ciaImpact: { confidentiality: 0, integrity: 0, availability: 0 },
        description: "Highly secure. Prevents both hardware injection and 'juice jacking' data leaks."
      },
      {
        label: "Connect suspect USBs but scan them with antivirus first; use public chargers directly",
        value: "scan-usb",
        scoreImpact: 4,
        ciaImpact: { confidentiality: 5, integrity: 3, availability: 2 },
        description: "Incomplete protection. Antivirus cannot block controller-level keyboard inject exploits."
      },
      {
        label: "Plug in any USB, and use public USB chargers without adapters",
        value: "unsafe-usb",
        scoreImpact: 10,
        ciaImpact: { confidentiality: 10, integrity: 8, availability: 5 },
        description: "Dangerous. Exposed to juice jacking, credential theft, and immediate shell injection."
      }
    ]
  }
];

export const CATEGORIES = [
  "Identity & Access Control",
  "Device Security",
  "Network Security",
  "Data Security"
];

// Maximum risk points before normalization
export const MAX_POSSIBLE_RISK_POINTS = QUESTIONS.reduce((sum, q) => {
  const maxOptionScore = Math.max(...q.options.map(o => o.scoreImpact));
  return sum + maxOptionScore;
}, 0);
