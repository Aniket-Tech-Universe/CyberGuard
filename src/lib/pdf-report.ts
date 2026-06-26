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
    
    // Header blue line
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(1);
    doc.line(15, 15, pageWidth - 15, 15);

    // Footer brand note
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text("CyberGuard | IBM SkillsBuild + GTU SBTP 2026 Cyber Risk Program", 15, pageHeight - 12);
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
  doc.setFontSize(22);
  doc.setTextColor(59, 130, 246); // Primary Blue
  doc.text("CYBERGUARD SECURITY REPORT", 15, y);
  y += 7;

  // Subtitle block
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(120, 130, 140);
  doc.text("Automated Risk Visualization & Security Hygiene Audit", 15, y);
  doc.text("IBM SkillsBuild + GTU SBTP 2026 Partner", pageWidth - 15, y, { align: "right" });
  y += 10;

  // Divider
  doc.setDrawColor(31, 41, 55);
  doc.line(15, y, pageWidth - 15, y);
  y += 10;

  // Executive summary panel
  doc.setFillColor(17, 24, 39); // Surface color
  doc.rect(15, y, contentWidth, 38, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(243, 244, 246);
  doc.text("EXECUTIVE AUDIT SUMMARY", 20, y + 8);

  // Score block
  doc.setFillColor(31, 41, 55); // Card background
  doc.rect(20, y + 14, 40, 16, "F");
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(156, 163, 175);
  doc.text("OVERALL RISK", 24, y + 19);

  let riskColor = [16, 185, 129]; // Success green
  if (risk.score > 80) riskColor = [239, 68, 68]; // Danger red
  else if (risk.score > 60) riskColor = [239, 68, 68]; // Danger red
  else if (risk.score > 30) riskColor = [245, 158, 11]; // Warning orange

  doc.setFontSize(15);
  doc.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
  doc.text(`${risk.score} / 100`, 24, y + 26);

  // Tier block
  doc.setFillColor(31, 41, 55);
  doc.rect(65, y + 14, 40, 16, "F");

  doc.setFontSize(9);
  doc.setTextColor(156, 163, 175);
  doc.text("RISK LEVEL", 69, y + 19);

  doc.setFontSize(13);
  doc.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
  doc.text(risk.level, 69, y + 26);

  // Description copy
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(209, 213, 219);
  const summaryCopy = `This assessment evaluated your security hygiene across 10 essential control points. Your current status presents a ${risk.level} risk score of ${risk.score}/100. This indicates that security configurations are ${risk.score > 60 ? 'severely neglected and leave you vulnerable to automated threats' : risk.score > 30 ? 'partially implemented, creating critical entry points for exploits' : 'well-managed with minor areas of improvement'}. Detailed breakdowns are compiled below.`;
  const splitSummary = doc.splitTextToSize(summaryCopy, contentWidth - 100);
  doc.text(splitSummary, 110, y + 18);

  y += 48;

  // CIA Triad Status
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(243, 244, 246);
  doc.text("CIA TRIAD SECURITY CAPABILITIES", 15, y);
  y += 7;

  // Confidentiality
  doc.setFillColor(31, 41, 55);
  doc.rect(15, y, 52, 20, "F");
  doc.setFontSize(9.5);
  doc.setTextColor(156, 163, 175);
  doc.text("Confidentiality", 20, y + 7);
  doc.setFontSize(13);
  doc.setTextColor(59, 130, 246); // Primary
  doc.text(`${cia.confidentiality}% Secure`, 20, y + 14);

  // Integrity
  doc.setFillColor(31, 41, 55);
  doc.rect(pageWidth / 2 - 26, y, 52, 20, "F");
  doc.setFontSize(9.5);
  doc.setTextColor(156, 163, 175);
  doc.text("Integrity", pageWidth / 2 - 21, y + 7);
  doc.setFontSize(13);
  doc.setTextColor(139, 92, 246); // Accent
  doc.text(`${cia.integrity}% Secure`, pageWidth / 2 - 21, y + 14);

  // Availability
  doc.setFillColor(31, 41, 55);
  doc.rect(pageWidth - 67, y, 52, 20, "F");
  doc.setFontSize(9.5);
  doc.setTextColor(156, 163, 175);
  doc.text("Availability", pageWidth - 62, y + 7);
  doc.setFontSize(13);
  doc.setTextColor(16, 185, 129); // Success
  doc.text(`${cia.availability}% Secure`, pageWidth - 62, y + 14);

  y += 30;

  // Attack Path Explanations
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(243, 244, 246);
  doc.text("EXPLOIT PATH SIMULATIONS", 15, y);
  y += 7;

  for (const path of attackPaths) {
    checkPageBreak(32);
    doc.setFillColor(17, 24, 39);
    doc.rect(15, y, contentWidth, 25, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(243, 244, 246);
    doc.text(path.name, 20, y + 7);

    // Tag block
    if (path.isCompromised) {
      doc.setFillColor(239, 68, 68);
      doc.rect(pageWidth - 48, y + 3, 33, 6, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text("COMPROMISED", pageWidth - 45, y + 7.2);
    } else {
      doc.setFillColor(16, 185, 129);
      doc.rect(pageWidth - 48, y + 3, 33, 6, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text("SECURE / BLOCKED", pageWidth - 45, y + 7.2);
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(156, 163, 175);
    const descText = doc.splitTextToSize(path.description, contentWidth - 10);
    doc.text(descText, 20, y + 13);
    doc.setFont("helvetica", "bold");
    doc.text(`Identified Vulnerability Chain: ${path.triggerVulnerability}`, 20, y + 20);

    y += 31;
  }

  // Recommendations page header
  checkPageBreak(40);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(243, 244, 246);
  doc.text("RECOMMENDED MITIGATION ACTIONS (PRIORITIZED)", 15, y);
  y += 8;

  if (recommendations.length === 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(16, 185, 129);
    doc.text("Excellent! Your current configurations demonstrate solid cybersecurity posture.", 15, y);
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
      doc.setFontSize(9.5);
      doc.setTextColor(243, 244, 246);
      doc.text(`${index}. ${rec.title}`, 20, y + 6);

      // Metadata tags
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(156, 163, 175);
      doc.text(`Risk Impact: -${rec.riskReduction} Risk Points`, 20, y + 11);
      doc.text(`Estimated Cost: ${rec.cost}`, 75, y + 11);
      doc.text(`Setup Effort: ${rec.effort}`, 115, y + 11);
      doc.text(rec.ciaBenefit, pageWidth - 20, y + 11, { align: "right" });

      // Core steps
      doc.setFontSize(8.5);
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
  doc.save("CyberGuard_Risk_Report.pdf");
}
