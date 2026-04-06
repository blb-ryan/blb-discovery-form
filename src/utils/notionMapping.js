import { sections } from './questionData';
import { computeComplexity } from './complexityScoring';

/**
 * Maps form answers to Notion database properties for the
 * Business Discovery Submissions database.
 *
 * Database ID: be44fd0d7b0b4eac8a4f209571f3345b
 * Data Source: 35a08d40-f41c-43b2-8228-1413baeb5148
 */

/**
 * Build Notion page properties object from form data.
 */
export function buildNotionProperties(answers, iDontKnowCount) {
  const complexity = computeComplexity(answers, iDontKnowCount);

  // Determine business type
  const empCount = parseInt(answers.employee_count, 10) || 0;
  const rev = answers.annual_revenue || '';
  let businessType = 'Startup';
  if (empCount >= 50 || ['$5M - $10M', '$10M+'].includes(rev)) {
    businessType = 'Enterprise';
  } else if (empCount >= 10 || ['$1M - $5M', '$500K - $1M'].includes(rev)) {
    businessType = 'Established';
  }

  const properties = {
    'Company Name': answers.company_name || 'Unnamed Submission',
    'Contact Name': answers.contact_name || '',
    'Email': answers.contact_email || '',
    'Phone': answers.contact_phone || '',
    'Complexity Score': complexity.score,
    'Complexity Tier': complexity.tier,
    'Involvement Level': complexity.involvementLevel,
    'Business Type': businessType,
    'Brand Status': answers.brand_status || 'New Brand',
    'Employee Count': answers.employee_count || '',
    'I Dont Know Count': iDontKnowCount,
    'Status': 'New',
  };

  // Deadline (date property)
  if (answers.deadline) {
    properties['date:Deadline:start'] = answers.deadline;
    properties['date:Deadline:is_datetime'] = 0;
  }

  return properties;
}

/**
 * Build the Notion page body content (markdown) from all answers.
 */
export function buildNotionContent(answers) {
  const lines = [];

  lines.push('# Business Discovery Submission');
  lines.push('');

  sections.forEach((section) => {
    const sectionAnswers = section.questions
      .filter((q) => {
        const val = answers[q.id];
        return val !== undefined && val !== '';
      });

    if (sectionAnswers.length === 0) return;

    lines.push(`## ${section.number}. ${section.name}`);
    lines.push('');

    sectionAnswers.forEach((q) => {
      const val = answers[q.id];
      lines.push(`**${q.text}**`);
      lines.push('');
      lines.push(val);
      lines.push('');
    });
  });

  return lines.join('\n');
}
