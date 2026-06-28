import { MEDICAL_CONDITIONS_DB, SeverityLevel } from './conditions-db';

const SEVERITY_ORDER: Record<SeverityLevel, number> = {
  CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1, NONE: 0,
};

export function calculateRiskScore(
  matchedConditions: typeof MEDICAL_CONDITIONS_DB,
  overallSeverity: SeverityLevel,
  age: number,
  bloodGroup: string
): number {
  let riskScore = 0;
  riskScore += matchedConditions.length * 10;
  riskScore += SEVERITY_ORDER[overallSeverity] * 15;
  
  if (age > 65) riskScore += 15;
  if (age < 5) riskScore += 20;
  if (['AB-', 'O-', 'B-', 'A-'].includes(bloodGroup)) riskScore += 10; // Rare blood groups
  
  return Math.min(100, riskScore);
}
