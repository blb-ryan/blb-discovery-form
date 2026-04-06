/**
 * Computes the internal complexity score (4-12) from form answers.
 * NEVER shown to the client.
 */

/**
 * Driver 1: Business / Industry Complexity (1-3)
 */
function scoreBusinessComplexity(answers) {
  const empRaw = parseInt(answers.employee_count, 10) || 0;
  const rev = answers.annual_revenue || '';

  const isHighRev = ['$5M - $10M', '$10M+'].includes(rev);
  const isMidRev = ['$1M - $5M', '$500K - $1M'].includes(rev);

  if (empRaw >= 50 || isHighRev) return 3;
  if ((empRaw >= 10 && empRaw < 50) || isMidRev) return 2;
  return 1;
}

/**
 * Driver 2: Discovery Needed (1-3)
 */
function scoreDiscoveryNeeded(answers, iDontKnowCount) {
  const isNewBrand = answers.brand_status === 'New Brand';

  // Calculate average answer length for textarea questions
  const textAnswers = Object.entries(answers).filter(
    ([key, val]) => typeof val === 'string' && val !== "I don't know yet" && val.length > 0
  );
  const avgLength = textAnswers.length > 0
    ? textAnswers.reduce((sum, [, val]) => sum + val.length, 0) / textAnswers.length
    : 0;
  const shortAnswers = avgLength < 40;

  if (iDontKnowCount > 10 || (isNewBrand && shortAnswers)) return 3;
  if (iDontKnowCount >= 5 || (isNewBrand && !shortAnswers)) return 2;
  return 1;
}

/**
 * Driver 3: Number of Deliverables (1-3)
 * Inferred from answers. Defaults to 2 if unclear.
 */
function scoreDeliverables(answers) {
  const textBlob = [
    answers.success_definition,
    answers.launch_plan,
    answers.brand_working,
    answers.biggest_challenge,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  // Keywords suggesting extensive scope
  const extensiveKeywords = ['website', 'collateral', 'social', 'packaging', 'signage', 'vehicle', 'uniform', 'trade show', 'booth', 'app', 'full system', 'everything'];
  const matchCount = extensiveKeywords.filter((kw) => textBlob.includes(kw)).length;

  // Keywords suggesting minimal scope
  const minimalKeywords = ['just a logo', 'only naming', 'just the name', 'logo only'];
  const isMinimal = minimalKeywords.some((kw) => textBlob.includes(kw));

  if (isMinimal) return 1;
  if (matchCount >= 3) return 3;
  return 2; // default
}

/**
 * Driver 4: Stakeholder Complexity (1-3)
 */
function scoreStakeholderComplexity(answers) {
  const approvers = (answers.other_approvers || '').toLowerCase();

  if (
    approvers === '' ||
    approvers === 'just us' ||
    approvers === "i don't know yet"
  ) {
    return 1;
  }

  // Count people mentioned (commas, "and", line breaks)
  const separators = (approvers.match(/,|;|\band\b|\n/g) || []).length;
  const peopleCount = separators + 1; // approximate

  if (peopleCount >= 4) return 3;
  if (peopleCount >= 2) return 2;
  return 1;
}

/**
 * Main scoring function.
 * Returns { score, tier, involvementLevel, drivers, iDontKnowCount }
 */
export function computeComplexity(answers, iDontKnowCount) {
  const d1 = scoreBusinessComplexity(answers);
  const d2 = scoreDiscoveryNeeded(answers, iDontKnowCount);
  const d3 = scoreDeliverables(answers);
  const d4 = scoreStakeholderComplexity(answers);

  const score = d1 + d2 + d3 + d4;

  let tier, involvementLevel;
  if (score >= 10) {
    tier = 'High';
    involvementLevel = 'Ryan-Led';
  } else if (score >= 7) {
    tier = 'Mid';
    involvementLevel = 'Ryan-Lite';
  } else {
    tier = 'Low';
    involvementLevel = 'Ryan-Free';
  }

  return {
    score,
    tier,
    involvementLevel,
    drivers: {
      businessComplexity: d1,
      discoveryNeeded: d2,
      deliverables: d3,
      stakeholderComplexity: d4,
    },
    iDontKnowCount,
  };
}
