import { MEDICAL_CONDITIONS_DB } from './conditions-db';

export function generateFirstAidHints(matchedConditions: typeof MEDICAL_CONDITIONS_DB): string[] {
  // Extract all first aid hints from matched conditions
  const hints = matchedConditions.flatMap(c => c.firstAid);
  
  // Deduplicate and return
  return Array.from(new Set(hints));
}
