import { jsPDF } from "jspdf";
import { RiskEvaluation, CiaScore, AttackPath, Recommendation } from "../types";

export function generatePdfReport(
  risk: RiskEvaluation,
  cia: CiaScore,
  attackPaths: AttackPath[],
  recommendations: Recommendation[]
) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const drawPageBorder = () => {
    // Dark border line matching surface themes
    doc.setDrawColor(27, 38, 59);
    doc.setLineWidth(0.5);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
    
    // Header accent blue line
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(1);
    doc.line(15, 15, pageWidth - 15, 15);

    // Footer brand note
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text("CyberGuard Security Threat Visualizer & Risk Report", 15, pageHeight - 12);
    doc.text(`Page ${doc.internal.pages.length - 1}`, pageWidth - 25, pageHeight - 12);
  };

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      drawPageBorder();
      y = margin + 5; // offset slightly from top border line
    }
  };

  // Draw initial borders
  drawPageBorder();
  y += 5;

  // Title block
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(59, 130, 246); // Primary Blue
  doc.text("CYBERGUARD RISK & THREAT ASSESSMENT REPORT", 15, y);
  y += 6;

  // Subtitle block
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120, 130, 140);
  doc.text("Automated Risk Analysis, Security Hygiene Audit, & Exploit Path Simulation", 15, y);
  doc.text("System Audit Version 2.0.0", pageWidth - 15, y, { align: "right" });
  y += 6;

  // Divider
  doc.setDrawColor(31, 41, 55);
  doc.line(15, y, pageWidth - 15, y);
  y += 10;

  // Executive summary panel
  doc.setFillColor(17, 24, 39); // Surface color
  doc.rect(15, y, contentWidth, 38, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(243, 244, 246);
  doc.text("EXECUTIVE THREAT AUDIT SUMMARY", 20, y + 7);

  // Score block
  doc.setFillColor(31, 41, 55); // Card background
  doc.rect(20, y + 13, 40, 18, "F");
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);
  doc.text("HYGIENE INDEX", 24, y + 18);

  let riskColor = [16, 185, 129]; // Success green
  if (risk.score > 80) riskColor = [239, 68, 68]; // Danger red
  else if (risk.score > 60) riskColor = [239, 68, 68]; // Danger red
  else if (risk.score > 30) riskColor = [245, 158, 11]; // Warning orange

  doc.setFontSize(14);
  doc.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
  doc.text(`${risk.score} / 100`, 24, y + 25);

  // Tier block
  doc.setFillColor(31, 41, 55);
  doc.rect(65, y + 13, 40, 18, "F");

  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);
  doc.text("THREAT EXPOSURE", 69, y + 18);

  doc.setFontSize(11);
  doc.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
  doc.text(risk.level, 69, y + 25);

  // Description copy
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(209, 213, 219);
  const summaryCopy = `In compliance with academic risk assessment parameters, this audit evaluated 10 local security control domains. The subject's baseline configurations returned a posture rating of ${risk.level} (exposure coefficient of ${risk.score}/100). This quantitative value suggests that system borders are ${risk.score > 60 ? 'vulnerable to exploit chaining due to missing foundational authentication controls' : risk.score > 30 ? 'partially shielded, although key transport and local updates remain insecure' : 'secured under standard hygiene policies, leaving minor surface areas exposed'}.`;
  const splitSummary = doc.splitTextToSize(summaryCopy, contentWidth - 100);
  doc.text(splitSummary, 110, y + 17);

  y += 46;

  // CIA Triad Status
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(243, 244, 246);
  doc.text("CIA TRIAD SEGREGATION & THEORY ALIGNMENT", 15, y);
  y += 6;

  // Confidentiality
  doc.setFillColor(31, 41, 55);
  doc.rect(15, y, 52, 22, "F");
  doc.setFontSize(8.5);
  doc.setTextColor(156, 163, 175);
  doc.text("Confidentiality (C)", 20, y + 6);
  doc.setFontSize(11);
  doc.setTextColor(59, 130, 246); // Primary
  doc.text(`${cia.confidentiality}% Secure`, 20, y + 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(180, 185, 190);
  doc.text("MFA / Unique Credentials", 20, y + 17);

  // Integrity
  doc.setFillColor(31, 41, 55);
  doc.rect(pageWidth / 2 - 26, y, 52, 22, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(156, 163, 175);
  doc.text("Integrity (I)", pageWidth / 2 - 21, y + 6);
  doc.setFontSize(11);
  doc.setTextColor(139, 92, 246); // Accent
  doc.text(`${cia.integrity}% Secure`, pageWidth / 2 - 21, y + 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(180, 185, 190);
  doc.text("OS Updates / Endpoint AV", pageWidth / 2 - 21, y + 17);

  // Availability
  doc.setFillColor(31, 41, 55);
  doc.rect(pageWidth - 67, y, 52, 22, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(156, 163, 175);
  doc.text("Availability (A)", pageWidth - 62, y + 6);
  doc.setFontSize(11);
  doc.setTextColor(16, 185, 129); // Success
  doc.text(`${cia.availability}% Secure`, pageWidth - 62, y + 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(180, 185, 190);
  doc.text("Redundant Backups", pageWidth - 62, y + 17);

  y += 32;

  // Threat Matrix Mapping (STRIDE Framework)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(243, 244, 246);
  doc.text("SECURITY HYGIENE DOMAIN MATRIX", 15, y);
  y += 6;

  doc.setFillColor(17, 24, 39);
  doc.rect(15, y, contentWidth, 24, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);
  doc.text("DOMAIN AREA", 20, y + 6);
  doc.text("PRIMARY MITIGATION FOCUS", 65, y + 6);
  doc.text("STRIDE CLASSIFICATION", pageWidth - 65, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(209, 213, 219);
  doc.text("Identity & Access Bounds", 20, y + 12);
  doc.text("Multi-Factor Authentication & Identity Verification", 65, y + 12);
  doc.text("Spoofing (S), Elevation of Privilege (E)", pageWidth - 65, y + 12);

  doc.text("Endpoint & Local Defense", 20, y + 18);
  doc.text("Operating System Patches & Real-Time Antivirus", 65, y + 18);
  doc.text("Tampering (T), Information Disclosure (I)", pageWidth - 65, y + 18);

  y += 34;

  // Attack Path Explanations
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(243, 244, 246);
  doc.text("EXPLOIT PATH SIMULATIONS & MITRE ATT&CK ALIGNMENT", 15, y);
  y += 6;

  for (const path of attackPaths) {
    checkPageBreak(34);
    doc.setFillColor(17, 24, 39);
    doc.rect(15, y, contentWidth, 28, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(243, 244, 246);
    doc.text(path.name, 20, y + 6);

    // STRIDE / MITRE label
    let strideLabel = "";
    if (path.id === "credential-theft") strideLabel = "STRIDE: Spoofing (S) | MITRE: T1078 (Valid Accounts)";
    else if (path.id === "ransomware") strideLabel = "STRIDE: Tampering (T) / Denial of Service (D) | MITRE: T1486";
    else strideLabel = "STRIDE: Information Disclosure (I) | MITRE: T1040 (Network Sniffing)";

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(139, 92, 246); // Accent purple
    doc.text(strideLabel, 20, y + 11);

    // Tag block
    if (path.isCompromised) {
      doc.setFillColor(239, 68, 68);
      doc.rect(pageWidth - 48, y + 3, 33, 6, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      doc.text("PATH EXPLOITED", pageWidth - 45, y + 7.2);
    } else {
      doc.setFillColor(16, 185, 129);
      doc.rect(pageWidth - 48, y + 3, 33, 6, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      doc.text("BARRIER BLOCKED", pageWidth - 45, y + 7.2);
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(156, 163, 175);
    const descText = doc.splitTextToSize(path.description, contentWidth - 10);
    doc.text(descText, 20, y + 16);
    doc.setFont("helvetica", "bold");
    doc.text(`Vulnerability Chain Origin: ${path.triggerVulnerability}`, 20, y + 23);

    y += 34;
  }

  // Recommendations page header
  checkPageBreak(40);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(243, 244, 246);
  doc.text("PRIORITIZED ACADEMIC MITIGATION BLUEPRINTS", 15, y);
  y += 7;

  if (recommendations.length === 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(16, 185, 129);
    doc.text("Audit verified: Subject's security posture is aligned with all assessed university best practices.", 15, y);
    y += 15;
  } else {
    let index = 1;
    for (const rec of recommendations) {
      checkPageBreak(38);

      doc.setFillColor(17, 24, 39);
      doc.rect(15, y, contentWidth, 32, "F");

      // Left bar priority color indicator
      if (index <= 2) {
        doc.setFillColor(239, 68, 68); // High Priority - Danger Red
      } else if (index <= 5) {
        doc.setFillColor(245, 158, 11); // Medium Priority - Warning Orange
      } else {
        doc.setFillColor(59, 130, 246); // Low Priority - Primary Blue
      }
      doc.rect(15, y, 2, 32, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(243, 244, 246);
      doc.text(`${index}. ${rec.title}`, 20, y + 6);

      // Metadata tags
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(156, 163, 175);
      doc.text(`Risk Mitigation: -${rec.riskReduction} Pts`, 20, y + 11);
      doc.text(`Resource Cost: ${rec.cost}`, 75, y + 11);
      doc.text(`Effort Complexity: ${rec.effort}`, 115, y + 11);
      doc.text(rec.ciaBenefit, pageWidth - 20, y + 11, { align: "right" });

      // Core steps
      doc.setFontSize(8);
      doc.setTextColor(209, 213, 219);
      let stepY = y + 17;
      for (let i = 0; i < Math.min(2, rec.steps.length); i++) {
        doc.text(`• ${rec.steps[i]}`, 20, stepY);
        stepY += 5;
      }

      y += 38;
      index++;
    }
  }

  // Save the compiled PDF
  doc.save("CyberGuard_Security_Audit_Report.pdf");
}
