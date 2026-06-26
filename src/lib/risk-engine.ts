import { QUESTIONS, MAX_POSSIBLE_RISK_POINTS } from "../data/questions";
import { RiskEvaluation, WhatIfToggles } from "../types";

export function evaluateRisk(
  answers: Record<string, string>,
  whatIfToggles: WhatIfToggles
): RiskEvaluation {
  let totalPoints = 0;

  for (const q of QUESTIONS) {
    let selectedOptionValue = answers[q.id];

    // Apply What-If overrides
    if (q.id === "mfa" && whatIfToggles.enableMfa) {
      selectedOptionValue = "yes-everywhere";
    } else if (q.id === "passwords" && whatIfToggles.uniquePasswords) {
      selectedOptionValue = "password-manager";
    } else if (q.id === "os_updates" && whatIfToggles.updateOs) {
      selectedOptionValue = "auto-updates";
    } else if (q.id === "browser_updates" && whatIfToggles.updateOs) {
      selectedOptionValue = "immediate-update";
    } else if (q.id === "antivirus" && whatIfToggles.installAntivirus) {
      selectedOptionValue = "active-antivirus";
    } else if (q.id === "public_wifi" && whatIfToggles.secureWifi) {
      selectedOptionValue = "vpn-or-hotspot";
    }

    // Default to the worst-case (highest risk points) option if not answered yet
    if (!selectedOptionValue) {
      const maxImpact = Math.max(...q.options.map((o) => o.scoreImpact));
      totalPoints += maxImpact;
    } else {
      const option = q.options.find((o) => o.value === selectedOptionValue);
      totalPoints += option ? option.scoreImpact : 0;
    }
  }

  const score = Math.min(100, Math.max(0, Math.round((totalPoints / MAX_POSSIBLE_RISK_POINTS) * 100)));

  let level: "Low" | "Medium" | "High" | "Critical" = "Low";
  let color = "text-success"; // #10B981

  if (score > 80) {
    level = "Critical";
    color = "text-danger animate-pulse"; // #EF4444
  } else if (score > 60) {
    level = "High";
    color = "text-danger"; // #EF4444
  } else if (score > 30) {
    level = "Medium";
    color = "text-warning"; // #F59E0B
  }

  return { score, level, color };
}
