import { MEDICAL_CONDITIONS_DB, SeverityLevel } from './conditions-db';
import { generateFirstAidHints } from './firstaid-hints';
import { calculateRiskScore } from './risk-scorer';

export interface TriageResult {
  overallSeverity: SeverityLevel;
  severityColor: string;
  severityLabel: string;
  matchedConditions: typeof MEDICAL_CONDITIONS_DB;
  rescuerAlerts: string[];
  firstAidHints: string[];
  riskScore: number; // 0-100
}

const SEVERITY_ORDER: Record<SeverityLevel, number> = {
  CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1, NONE: 0,
};

export function runTriageEngine(
  conditions: string,
  allergies: string,
  medications: string,
  age: number,
  bloodGroup: string
): TriageResult {
  const combinedText = `${conditions} ${allergies} ${medications}`.toLowerCase();

  const matched = MEDICAL_CONDITIONS_DB.filter(condition =>
    condition.keywords.some(keyword => combinedText.includes(keyword.toLowerCase()))
  );

  // Determine overall severity (highest wins)
  let overallSeverity: SeverityLevel = 'NONE';
  for (const condition of matched) {
    const sev = condition.severity as SeverityLevel;
    if (SEVERITY_ORDER[sev] > SEVERITY_ORDER[overallSeverity]) {
      overallSeverity = sev;
    }
  }

  // Age-based severity boost
  if (age >= 70 && SEVERITY_ORDER[overallSeverity] < SEVERITY_ORDER['HIGH']) {
    overallSeverity = 'HIGH'; // Elderly patients always at least HIGH
  }

  // Risk score calculation
  const riskScore = calculateRiskScore(matched, overallSeverity, age, bloodGroup);
  
  // First aid hints
  const firstAidHints = generateFirstAidHints(matched);

  const severityConfig: Record<SeverityLevel, { color: string; label: string }> = {
    CRITICAL: { color: '#FF0000', label: 'CRITICAL — IMMEDIATE INTERVENTION REQUIRED' },
    HIGH: { color: '#FF6600', label: 'HIGH RISK — Urgent medical attention needed' },
    MEDIUM: { color: '#FFAA00', label: 'MODERATE — Monitor and assist' },
    LOW: { color: '#00AA00', label: 'LOW RISK — Standard care' },
    NONE: { color: '#888888', label: 'No critical conditions detected' },
  };

  return {
    overallSeverity,
    severityColor: severityConfig[overallSeverity].color,
    severityLabel: severityConfig[overallSeverity].label,
    matchedConditions: matched,
    rescuerAlerts: matched.map(c => c.rescuerAlert),
    firstAidHints,
    riskScore,
  };
}
