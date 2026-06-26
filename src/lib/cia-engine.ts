import { QUESTIONS } from "../data/questions";
import { CiaScore, WhatIfToggles } from "../types";

export function evaluateCia(
  answers: Record<string, string>,
  whatIfToggles: WhatIfToggles
): CiaScore {
  let confidentialityLoss = 0;
  let integrityLoss = 0;
  let availabilityLoss = 0;

  // Maximum possible losses for normalization
  let maxConfidentiality = 0;
  let maxIntegrity = 0;
  let maxAvailability = 0;

  for (const q of QUESTIONS) {
    const maxCOption = Math.max(...q.options.map((o) => o.ciaImpact.confidentiality));
    const maxIOption = Math.max(...q.options.map((o) => o.ciaImpact.integrity));
    const maxAOption = Math.max(...q.options.map((o) => o.ciaImpact.availability));

    maxConfidentiality += maxCOption;
    maxIntegrity += maxIOption;
    maxAvailability += maxAOption;

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

    if (!selectedOptionValue) {
      // If not answered, count as worst-case loss
      confidentialityLoss += maxCOption;
      integrityLoss += maxIOption;
      availabilityLoss += maxAOption;
    } else {
      const option = q.options.find((o) => o.value === selectedOptionValue);
      if (option) {
        confidentialityLoss += option.ciaImpact.confidentiality;
        integrityLoss += option.ciaImpact.integrity;
        availabilityLoss += option.ciaImpact.availability;
      }
    }
  }

  // Calculate final security scores (100 - percentage loss)
  const confidentiality = maxConfidentiality > 0
    ? Math.max(0, 100 - Math.round((confidentialityLoss / maxConfidentiality) * 100))
    : 100;

  const integrity = maxIntegrity > 0
    ? Math.max(0, 100 - Math.round((integrityLoss / maxIntegrity) * 100))
    : 100;

  const availability = maxAvailability > 0
    ? Math.max(0, 100 - Math.round((availabilityLoss / maxAvailability) * 100))
    : 100;

  return { confidentiality, integrity, availability };
}
