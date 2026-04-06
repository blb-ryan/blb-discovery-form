import { computeComplexity } from './complexityScoring.js';

// Section metadata for formatting the page body (lightweight — no gate functions needed)
const SECTIONS = [
  { number: '00', name: 'Contact Info' },
  { number: '01', name: 'The Basics' },
  { number: '02', name: "Who's Involved" },
  { number: '03', name: 'What You Believe' },
  { number: '04', name: 'The Money' },
  { number: '05', name: 'Your Market' },
  { number: '06', name: 'What You Sell' },
  { number: '07', name: 'Who Buys It' },
  { number: '08', name: 'Your Brand Today' },
  { number: '09', name: 'How You Show Up' },
  { number: '10', name: 'The Competition' },
  { number: '11', name: 'Creative Direction' },
  { number: '12', name: 'What Success Looks Like' },
];

// Map question IDs to their section and text
const QUESTION_MAP = {
  contact_first_name: { section: '00', text: 'First name' },
  contact_last_name: { section: '00', text: 'Last name' },
  contact_email: { section: '00', text: 'Email address' },
  contact_phone: { section: '00', text: 'Phone number' },
  company_name: { section: '01', text: "What's the name of your company?" },
  company_description: { section: '01', text: 'What does your company do?' },
  origin_story: { section: '01', text: 'How did this business start?' },
  revenue_model: { section: '01', text: 'How does the business make money?' },
  employee_count: { section: '01', text: 'How many people work here?' },
  team_location: { section: '01', text: 'Where does your team work?' },
  decision_culture: { section: '01', text: 'Decision-making culture' },
  decision_maker: { section: '02', text: 'Final decision-maker' },
  day_to_day_contact: { section: '02', text: 'Day-to-day contact' },
  other_approvers: { section: '02', text: 'Other approvers' },
  decision_process: { section: '02', text: 'How decisions get made' },
  branding_experience: { section: '02', text: 'Previous branding experience' },
  company_why: { section: '03', text: 'Why does this company exist?' },
  company_vision: { section: '03', text: '3-5 year vision' },
  company_values: { section: '03', text: 'Values that govern operations' },
  company_culture: { section: '03', text: 'Company culture' },
  team_pride: { section: '03', text: 'What makes people proud to work here?' },
  team_unique: { section: '03', text: 'Something unique your team does' },
  values_in_action: { section: '03', text: 'Values in hiring/management' },
  revenue_streams: { section: '04', text: 'Revenue streams' },
  annual_revenue: { section: '04', text: 'Annual revenue' },
  growth_driver: { section: '04', text: 'Growth drivers' },
  brand_roi: { section: '04', text: 'Expected brand ROI' },
  financial_event: { section: '04', text: 'Financial events on the horizon' },
  industry_trends: { section: '05', text: 'Industry trends' },
  market_disruption: { section: '05', text: 'Market disruption' },
  brand_urgency: { section: '05', text: 'Brand work urgency' },
  external_challenge: { section: '05', text: 'External challenges' },
  product_list: { section: '06', text: 'Products/services offered' },
  pricing: { section: '06', text: 'Pricing' },
  top_revenue_offering: { section: '06', text: 'Top revenue offering' },
  top_volume_offering: { section: '06', text: 'Top volume offering' },
  market_position: { section: '06', text: 'Market position' },
  ideal_customer: { section: '07', text: 'Ideal customer' },
  core_problem: { section: '07', text: 'Biggest problem solved' },
  changing_needs: { section: '07', text: 'Changing customer needs' },
  brand_appeal: { section: '07', text: 'Brand appeal' },
  brand_loyalty: { section: '07', text: 'Brand loyalty in category' },
  brand_status: { section: '08', text: 'New or existing brand?' },
  current_positioning: { section: '08', text: 'Current brand positioning' },
  desired_positioning: { section: '08', text: 'Desired positioning' },
  brand_known_for: { section: '08', text: 'Known for' },
  brand_working: { section: '08', text: "What's working and what's not" },
  brand_sacred_cows: { section: '08', text: 'Sacred cows' },
  brand_perception: { section: '08', text: 'Leadership view of brand' },
  brand_personality: { section: '08', text: 'Brand personality' },
  company_name_story: { section: '08', text: 'Company name story' },
  distribution_channels: { section: '09', text: 'Distribution channels' },
  top_channels: { section: '09', text: 'Top marketing channels' },
  social_media: { section: '09', text: 'Social media interaction' },
  daily_visibility: { section: '09', text: 'Daily/weekly brand visibility' },
  launch_plan: { section: '09', text: 'Launch/rollout plan' },
  competitors: { section: '10', text: 'Top competitors' },
  differentiation: { section: '10', text: 'Differentiation' },
  strengths_weaknesses: { section: '10', text: 'Strengths and weaknesses' },
  competitive_landscape: { section: '10', text: 'Competitive landscape changes' },
  competition_fears: { section: '10', text: 'Competition fears' },
  brand_inspiration: { section: '11', text: 'Brand inspiration' },
  color_preference: { section: '11', text: 'Color preferences' },
  brand_words: { section: '11', text: 'Brand nouns and verbs' },
  visual_direction: { section: '11', text: 'Visual direction' },
  biggest_challenge: { section: '12', text: 'Biggest challenge' },
  success_definition: { section: '12', text: 'Success definition' },
  failure_definition: { section: '12', text: 'Failure definition' },
  success_metrics: { section: '12', text: 'Success metrics' },
  deadline: { section: '12', text: 'Deadline' },
};

/**
 * Build Notion page properties from form data.
 */
export function buildNotionProperties(answers, iDontKnowCount) {
  const complexity = computeComplexity(answers, iDontKnowCount);

  const empCount = parseInt(answers.employee_count, 10) || 0;
  const rev = answers.annual_revenue || '';
  let businessType = 'Startup';
  if (empCount >= 50 || ['$5M - $10M', '$10M+'].includes(rev)) {
    businessType = 'Enterprise';
  } else if (empCount >= 10 || ['$1M - $5M', '$500K - $1M'].includes(rev)) {
    businessType = 'Established';
  }

  const contactName = [answers.contact_first_name, answers.contact_last_name]
    .filter(Boolean).join(' ');

  const properties = {
    'Company Name': answers.company_name || 'Unnamed Submission',
    'Contact Name': contactName,
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

  if (answers.deadline) {
    properties['date:Deadline:start'] = answers.deadline;
  }

  return { properties, complexity };
}

/**
 * Build markdown content for the Notion page body.
 */
export function buildNotionContent(answers) {
  const lines = ['# Business Discovery Submission', ''];

  for (const section of SECTIONS) {
    const sectionAnswers = Object.entries(answers)
      .filter(([key, val]) => {
        const q = QUESTION_MAP[key];
        return q && q.section === section.number && val && val !== '';
      });

    if (sectionAnswers.length === 0) continue;

    lines.push(`## ${section.number}. ${section.name}`, '');

    for (const [key, val] of sectionAnswers) {
      const q = QUESTION_MAP[key];
      lines.push(`**${q.text}**`, '', val, '');
    }
  }

  return lines.join('\n');
}
