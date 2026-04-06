/**
 * All form sections, questions, gate logic, and section intro copy.
 *
 * Gate functions receive the full `answers` object and return a boolean.
 * If `gate` is omitted the question is always shown.
 *
 * Question types: text, textarea, email, tel, number, select, date
 */

export const sections = [
  // ── Section 00: Contact Info ──────────────────────────────────────
  {
    id: 'contact',
    number: '00',
    name: 'Contact Info',
    intro: "Before we dive in, let's get to know each other.",
    time: 'About 1 minute',
    questions: [
      {
        id: 'contact_name',
        text: 'What\'s your full name?',
        type: 'text',
        placeholder: 'Jane Doe',
      },
      {
        id: 'contact_email',
        text: 'What\'s your email address?',
        type: 'email',
        placeholder: 'jane@company.com',
      },
      {
        id: 'contact_phone',
        text: 'What\'s your phone number?',
        type: 'tel',
        placeholder: '(555) 123-4567',
      },
    ],
  },

  // ── Section 01: The Basics ────────────────────────────────────────
  {
    id: 'basics',
    number: '01',
    name: 'The Basics',
    intro: "Let's start simple. Who are you and what do you do?",
    time: 'About 3 minutes',
    questions: [
      {
        id: 'company_name',
        text: "What's the name of your company?",
        type: 'text',
        placeholder: 'Acme Corp',
      },
      {
        id: 'company_description',
        text: 'Explain what your company does in one sentence. No jargon. Like you\'re telling a friend at dinner.',
        type: 'textarea',
        placeholder: 'We help small restaurants manage their online ordering without the fees...',
      },
      {
        id: 'origin_story',
        text: 'How did this business start? What problem made you say, "I need to build something"?',
        type: 'textarea',
        placeholder: 'I was working in the industry and kept seeing the same problem over and over...',
      },
      {
        id: 'revenue_model',
        text: 'How does the business make money? Products, services, subscriptions, licensing, etc.',
        type: 'textarea',
        placeholder: 'We sell a monthly SaaS subscription to restaurants plus a one-time setup fee...',
      },
      {
        id: 'employee_count',
        text: 'How many people work here?',
        type: 'text',
        placeholder: 'e.g. 5, 25, 100+',
      },
      {
        id: 'team_location',
        text: 'Where does your team work? Fully remote, hybrid, in-person, multiple locations.',
        type: 'text',
        placeholder: 'Hybrid — main office in Austin with remote team across the US',
        gate: (answers) => {
          const count = parseInt(answers.employee_count, 10);
          return !isNaN(count) && count >= 10;
        },
      },
      {
        id: 'decision_culture',
        text: "Describe the decision-making culture. Is it top-down? Collaborative? Depends on the day?",
        type: 'textarea',
        placeholder: 'Mostly collaborative for creative stuff, but the CEO makes final calls on anything client-facing...',
        gate: (answers) => {
          const count = parseInt(answers.employee_count, 10);
          return !isNaN(count) && count >= 10;
        },
      },
    ],
  },

  // ── Section 02: Who's Involved ────────────────────────────────────
  {
    id: 'stakeholders',
    number: '02',
    name: "Who's Involved",
    intro: "We want to know who we're building with.",
    time: 'About 2 minutes',
    questions: [
      {
        id: 'decision_maker',
        text: 'Who is the final decision-maker on this project? Name and title.',
        type: 'text',
        placeholder: 'Sarah Chen, CEO',
      },
      {
        id: 'day_to_day_contact',
        text: 'Who is our day-to-day point of contact?',
        type: 'text',
        placeholder: 'Mark Rivera, Marketing Director',
      },
      {
        id: 'other_approvers',
        text: "Is anyone else involved in approvals or feedback? List names and titles.",
        type: 'textarea',
        placeholder: 'Just us — or list names like: Tom (VP Product), Lisa (Brand Manager)...',
      },
      {
        id: 'decision_process',
        text: 'Walk us through how decisions actually get made. Is it a conversation, a committee, a vote, or one person with veto power?',
        type: 'textarea',
        placeholder: 'Usually the CEO and CMO align first, then present to the leadership team for input...',
        gate: (answers) => {
          const val = (answers.other_approvers || '').toLowerCase();
          if (val === 'just us' || val === '' || val === "i don't know yet") return false;
          // Check for multiple names (commas, "and", or line breaks suggest 3+)
          const separators = (val.match(/,|;|\band\b|\n/g) || []).length;
          return separators >= 2;
        },
      },
      {
        id: 'branding_experience',
        text: "Has your team been through a branding process before? What went well? What didn't?",
        type: 'textarea',
        placeholder: 'We did a logo redesign two years ago. The design was great but the rollout was messy...',
      },
    ],
  },

  // ── Section 03: What You Believe ──────────────────────────────────
  {
    id: 'beliefs',
    number: '03',
    name: 'What You Believe',
    intro: "This is the soul stuff. Don't overthink it.",
    time: 'About 3 minutes',
    sectionNote: 'This section is about the soul of the business. Not the marketing copy. The real stuff.',
    questions: [
      {
        id: 'company_why',
        text: 'Why does this company exist? Not what you sell. Why do you do what you do?',
        type: 'textarea',
        placeholder: 'We believe every small business deserves access to the same tools the big guys have...',
      },
      {
        id: 'company_vision',
        text: 'What are you building toward? Where does this go in 3-5 years?',
        type: 'textarea',
        placeholder: 'We want to be the default operating system for independent restaurants nationwide...',
      },
      {
        id: 'company_values',
        text: "What values actually govern how your team operates? Not the ones on the wall. The ones people feel.",
        type: 'textarea',
        placeholder: 'Radical honesty, speed over perfection, protect the customer at all costs...',
      },
      {
        id: 'company_culture',
        text: 'Describe your company culture in your own words. Be honest, not aspirational.',
        type: 'textarea',
        placeholder: 'Scrappy, fast-moving, sometimes chaotic. People wear a lot of hats...',
        gate: (answers) => {
          const count = parseInt(answers.employee_count, 10);
          return !isNaN(count) && count >= 10;
        },
      },
      {
        id: 'team_pride',
        text: 'What makes people proud to work here?',
        type: 'textarea',
        placeholder: 'We ship fast, we actually listen to customers, and nobody hides behind a title...',
        gate: (answers) => {
          const count = parseInt(answers.employee_count, 10);
          return !isNaN(count) && count >= 10;
        },
      },
      {
        id: 'team_unique',
        text: "What's one thing your team does that you've never seen another company do?",
        type: 'textarea',
        placeholder: 'Every Friday we call a random customer just to say thanks and ask how things are going...',
        gate: (answers) => {
          const count = parseInt(answers.employee_count, 10);
          return !isNaN(count) && count >= 10;
        },
      },
      {
        id: 'values_in_action',
        text: 'How do your values show up in how people are hired, managed, or let go?',
        type: 'textarea',
        placeholder: 'We hire for curiosity over credentials. If someone stops being curious, we notice...',
        gate: (answers) => {
          const count = parseInt(answers.employee_count, 10);
          return !isNaN(count) && count >= 10;
        },
      },
    ],
  },

  // ── Section 04: The Money ─────────────────────────────────────────
  {
    id: 'money',
    number: '04',
    name: 'The Money',
    intro: "Uncomfortable? Maybe. Useful? Definitely.",
    time: 'About 2 minutes',
    questions: [
      {
        id: 'revenue_streams',
        text: 'How does revenue come in? One-time sales, retainers, subscriptions, per-project, etc.',
        type: 'textarea',
        placeholder: '60% monthly subscriptions, 30% one-time setup fees, 10% add-on services...',
      },
      {
        id: 'annual_revenue',
        text: "What's your current annual revenue? Exact or range. This stays between us.",
        type: 'select',
        placeholder: 'Select a range',
        options: [
          'Pre-revenue',
          'Under $500K',
          '$500K - $1M',
          '$1M - $5M',
          '$5M - $10M',
          '$10M+',
        ],
      },
      {
        id: 'growth_driver',
        text: "What's driving growth right now? Be specific. A channel, a product, a partnership, a referral source.",
        type: 'textarea',
        placeholder: 'Word of mouth from restaurant owners in our first market, plus a partnership with a POS provider...',
        gate: (answers) => {
          const rev = answers.annual_revenue || '';
          return !['Pre-revenue', 'Under $500K', '', "I don't know yet"].includes(rev);
        },
      },
      {
        id: 'brand_roi',
        text: 'How do you expect brand work to contribute to financial results? More leads? Higher prices? Better close rates? Retention?',
        type: 'textarea',
        placeholder: 'We want to be able to charge premium pricing and close enterprise deals faster...',
        gate: (answers) => {
          const rev = answers.annual_revenue || '';
          return !['Pre-revenue', 'Under $500K', '', "I don't know yet"].includes(rev);
        },
      },
      {
        id: 'financial_event',
        text: 'Is there a major financial event on the horizon? Fundraise, acquisition, merger, IPO.',
        type: 'textarea',
        placeholder: 'We\'re planning a Series A in Q3, so the brand needs to be investor-ready...',
        gate: (answers) => {
          const rev = answers.annual_revenue || '';
          return !['Pre-revenue', 'Under $500K', '', "I don't know yet"].includes(rev);
        },
      },
    ],
  },

  // ── Section 05: Your Market ───────────────────────────────────────
  {
    id: 'market',
    number: '05',
    name: 'Your Market',
    intro: "What's happening in your world right now?",
    time: 'About 2 minutes',
    questions: [
      {
        id: 'industry_trends',
        text: 'What are 2-3 trends in your industry that are changing how you operate or compete?',
        type: 'textarea',
        placeholder: 'AI-powered ordering, consolidation of delivery platforms, rising food costs...',
        gate: (answers) => {
          const rev = answers.annual_revenue || '';
          return !['Pre-revenue', 'Under $500K', '', "I don't know yet"].includes(rev);
        },
      },
      {
        id: 'market_disruption',
        text: "What's coming in the next 3-5 years that could disrupt your market?",
        type: 'textarea',
        placeholder: 'Ghost kitchens, autonomous delivery, big tech entering the space...',
        gate: (answers) => {
          const rev = answers.annual_revenue || '';
          return !['Pre-revenue', 'Under $500K', '', "I don't know yet"].includes(rev);
        },
      },
      {
        id: 'brand_urgency',
        text: 'Is there anything happening in your space right now that makes this brand work feel urgent?',
        type: 'textarea',
        placeholder: 'A competitor just raised $50M and is running ads everywhere. We need to stand out now...',
      },
      {
        id: 'external_challenge',
        text: "What's the biggest external challenge slowing your growth?",
        type: 'textarea',
        placeholder: 'Restaurant owners are skeptical of new tech after getting burned by other platforms...',
      },
    ],
  },

  // ── Section 06: What You Sell ─────────────────────────────────────
  {
    id: 'offerings',
    number: '06',
    name: 'What You Sell',
    intro: "Tell us about the thing people pay you for.",
    time: 'About 2 minutes',
    questions: [
      {
        id: 'product_list',
        text: 'What exactly do you offer? List the products, services, or packages. Be specific.',
        type: 'textarea',
        placeholder: 'Core platform ($199/mo), Premium tier ($399/mo), Setup service ($2,500 one-time)...',
      },
      {
        id: 'pricing',
        text: 'What does it cost? Price points, ranges, or tiers.',
        type: 'textarea',
        placeholder: 'Starter: $99/mo, Growth: $199/mo, Enterprise: custom pricing starting at $500/mo...',
      },
      {
        id: 'top_revenue_offering',
        text: 'Which offering makes you the most money?',
        type: 'textarea',
        placeholder: 'The Growth tier — it\'s where 70% of our customers land after the first month...',
      },
      {
        id: 'top_volume_offering',
        text: 'Which offering gets the most volume?',
        type: 'textarea',
        placeholder: 'Starter tier — it\'s our entry point and we convert about 40% to Growth...',
      },
      {
        id: 'market_position',
        text: 'In your market, are you leading, following, or carving out something new?',
        type: 'select',
        placeholder: 'Select one',
        options: ['Leading', 'Following', 'Carving something new'],
      },
    ],
  },

  // ── Section 07: Who Buys It ───────────────────────────────────────
  {
    id: 'customers',
    number: '07',
    name: 'Who Buys It',
    intro: "This is the big one. Take your time.",
    time: 'About 4 minutes',
    sectionNote: 'This is the most important section. Take your time here.',
    questions: [
      {
        id: 'ideal_customer',
        text: "Describe your best customer. Not demographics. The person. What are they dealing with? What do they care about? What made them come looking for you?",
        type: 'textarea',
        placeholder: "She's a restaurant owner in her 40s, running a family spot that's been open 15 years. She's tired of paying 30% to delivery apps and wants to own her customer relationships again...",
        large: true,
      },
      {
        id: 'core_problem',
        text: "What's the biggest problem you solve for them?",
        type: 'textarea',
        placeholder: 'They\'re losing money and customer data to third-party platforms...',
      },
      {
        id: 'changing_needs',
        text: "How are your customers' needs changing? What did they want 2 years ago vs. now?",
        type: 'textarea',
        placeholder: 'Two years ago they just wanted a website. Now they want a full digital ordering system with loyalty built in...',
      },
      {
        id: 'brand_appeal',
        text: 'What makes your brand compelling to buyers? Why do they pick you over someone else?',
        type: 'textarea',
        placeholder: 'We\'re the only platform that doesn\'t take a cut of their sales. Period.',
      },
      {
        id: 'brand_loyalty',
        text: 'Are buyers in your category loyal to brands, or do they shop around every time?',
        type: 'textarea',
        placeholder: 'Once they\'re set up, they stay. Switching costs are real. But getting them to try something new is the hard part...',
      },
    ],
  },

  // ── Section 08: Your Brand Today ──────────────────────────────────
  {
    id: 'brand_today',
    number: '08',
    name: 'Your Brand Today',
    intro: "Where are you now, and where's the gap?",
    time: 'About 3 minutes',
    questions: [
      {
        id: 'brand_status',
        text: 'Is this a new brand or does your business have an existing brand?',
        type: 'select',
        placeholder: 'Select one',
        options: ['New Brand', 'Existing Brand'],
      },
      {
        id: 'current_positioning',
        text: 'How is your brand currently positioned in the market? How would a stranger describe you after 30 seconds on your website?',
        type: 'textarea',
        placeholder: 'Probably "another tech platform for restaurants" — which is exactly the problem...',
        gate: (answers) => answers.brand_status === 'Existing Brand',
      },
      {
        id: 'desired_positioning',
        text: 'How is that different from how you want to be positioned?',
        type: 'textarea',
        placeholder: 'We want to feel like the restaurant owner\'s trusted partner, not another SaaS tool...',
        gate: (answers) => answers.brand_status === 'Existing Brand',
      },
      {
        id: 'brand_known_for',
        text: 'What\'s the single most important thing your brand should be known for?',
        type: 'textarea',
        placeholder: 'Giving independent restaurants their power back...',
        gate: (answers) => answers.brand_status === 'Existing Brand',
      },
      {
        id: 'brand_working',
        text: "At a high level, what's working and what's not?",
        type: 'textarea',
        placeholder: 'The product is great, word of mouth is strong, but our website and pitch deck look amateur...',
        gate: (answers) => answers.brand_status === 'Existing Brand',
      },
      {
        id: 'brand_sacred_cows',
        text: "Is there anything about the current brand that can't change? Sacred cows, legacy elements, founder attachment. Be honest.",
        type: 'textarea',
        placeholder: 'The name stays. Everything else is on the table. Well... maybe the orange color too.',
        gate: (answers) => answers.brand_status === 'Existing Brand',
      },
      {
        id: 'brand_perception',
        text: 'How does leadership think about "brand"? Is it a logo? A feeling? A business strategy? Something else?',
        type: 'textarea',
        placeholder: 'The CEO sees it as strategy, the CTO thinks it\'s just a logo, the sales team thinks it\'s a pitch deck...',
      },
      {
        id: 'brand_personality',
        text: "Describe your brand's personality in 3-5 words. Not what you sell. How you show up.",
        type: 'text',
        placeholder: 'Bold, warm, scrappy, honest, relentless',
      },
      {
        id: 'company_name_story',
        text: 'Is there a story behind your company name? Or if you need naming, what have you explored so far?',
        type: 'textarea',
        placeholder: 'The name came from a late-night brainstorm. It stuck because it felt different...',
      },
    ],
  },

  // ── Section 09: How You Show Up ───────────────────────────────────
  {
    id: 'marketing',
    number: '09',
    name: 'How You Show Up',
    intro: "How does the world find you?",
    time: 'About 2 minutes',
    questions: [
      {
        id: 'distribution_channels',
        text: 'How do your products or services get in front of buyers? Referrals, ads, content, events, partnerships, cold outreach, etc.',
        type: 'textarea',
        placeholder: 'Mostly word of mouth and local restaurant association events. Some Google Ads...',
      },
      {
        id: 'top_channels',
        text: 'Pick your top two marketing channels. What are they and why do they work?',
        type: 'textarea',
        placeholder: 'Referrals and local events. Restaurant owners trust other owners more than any ad...',
      },
      {
        id: 'social_media',
        text: 'How does your audience interact with social media? Are they scrollers, searchers, or skeptics?',
        type: 'textarea',
        placeholder: 'They\'re on Facebook and Instagram but they\'re skeptics. They don\'t click ads but they do read reviews...',
      },
      {
        id: 'daily_visibility',
        text: 'What do you do every day or week to keep the brand visible?',
        type: 'textarea',
        placeholder: 'Weekly email newsletter, Instagram 3x/week, monthly webinar for restaurant owners...',
      },
      {
        id: 'launch_plan',
        text: 'How do you plan to launch or roll out the work we do together?',
        type: 'textarea',
        placeholder: 'Phase 1: update website and sales deck. Phase 2: new social templates. Phase 3: trade show booth redesign...',
      },
    ],
  },

  // ── Section 10: The Competition ───────────────────────────────────
  {
    id: 'competition',
    number: '10',
    name: 'The Competition',
    intro: "Who else is out there, and why aren't you them?",
    time: 'About 3 minutes',
    questions: [
      {
        id: 'competitors',
        text: 'Who are your top 3-5 competitors? Drop links if you have them.',
        type: 'textarea',
        placeholder: 'Toast (toast.tab), Square for Restaurants, ChowNow, BentoBox...',
      },
      {
        id: 'differentiation',
        text: 'What makes you different from them? Not better. Different.',
        type: 'textarea',
        placeholder: 'We don\'t take a cut of sales. Every other platform does. That\'s it. That\'s the difference.',
      },
      {
        id: 'strengths_weaknesses',
        text: 'What are your honest strengths and weaknesses compared to competitors?',
        type: 'textarea',
        placeholder: 'Strength: pricing model and customer service. Weakness: brand recognition and enterprise features...',
      },
      {
        id: 'competitive_landscape',
        text: "What's changing in the competitive landscape?",
        type: 'textarea',
        placeholder: 'Big players are acquiring smaller ones. The market is consolidating fast...',
      },
      {
        id: 'competition_fears',
        text: 'What about the competition keeps you up at night?',
        type: 'textarea',
        placeholder: 'Toast has unlimited money and is moving into our exact niche...',
      },
    ],
  },

  // ── Section 11: Creative Direction ────────────────────────────────
  {
    id: 'creative',
    number: '11',
    name: 'Creative Direction',
    intro: "Help us see what you see.",
    time: 'About 3 minutes',
    sectionNote: 'This section helps our design team understand how you want the brand to feel.',
    questions: [
      {
        id: 'brand_inspiration',
        text: 'List 2-3 brands you admire. Not competitors. Brands that feel like the energy you want. What specifically draws you to them? Typography, photography, tone, packaging, all of it?',
        type: 'textarea',
        placeholder: 'Patagonia — honest, purpose-driven, beautiful photography. Mailchimp — playful but professional. Aesop — minimal, elevated, intentional...',
      },
      {
        id: 'color_preference',
        text: 'What colors are you drawn to? Are these product colors, brand colors, or both?',
        type: 'textarea',
        placeholder: 'Warm earth tones — terracotta, sage, cream. These feel like our brand. Product colors are more neutral...',
      },
      {
        id: 'brand_words',
        text: 'Give us 5 nouns and 5 verbs that describe the world of your brand. Think physical and emotional. Example nouns: stone, ritual, harbor, edge. Example verbs: refine, anchor, strip, warm.',
        type: 'textarea',
        placeholder: 'Nouns: kitchen, neighborhood, roots, warmth, table\nVerbs: gather, nourish, simplify, protect, connect',
      },
      {
        id: 'visual_direction',
        text: 'Is there a visual style, era, or aesthetic you want to channel or avoid?',
        type: 'textarea',
        placeholder: 'Channel: mid-century warmth, Japanese minimalism. Avoid: corporate blue, stock photos of handshakes...',
      },
    ],
  },

  // ── Section 12: What Success Looks Like ───────────────────────────
  {
    id: 'success',
    number: '12',
    name: 'What Success Looks Like',
    intro: "Last one. Let's make sure we're aligned.",
    time: 'About 2 minutes',
    questions: [
      {
        id: 'biggest_challenge',
        text: 'What is the single biggest challenge we\'re tackling together?',
        type: 'textarea',
        placeholder: 'We look like a startup but we need to close enterprise deals. The brand needs to match the product...',
      },
      {
        id: 'success_definition',
        text: 'What does success look like when this project is done? Be specific.',
        type: 'textarea',
        placeholder: 'A brand that makes restaurant owners feel like we get them. A website that converts. A pitch deck that closes...',
      },
      {
        id: 'failure_definition',
        text: 'What would make this engagement feel like a failure?',
        type: 'textarea',
        placeholder: 'If the brand feels generic or corporate. If it doesn\'t connect with real restaurant owners...',
      },
      {
        id: 'success_metrics',
        text: 'How will you measure whether the work is actually working? Leads, revenue, internal alignment, customer feedback, something else?',
        type: 'textarea',
        placeholder: 'Conversion rate on the website, close rate on enterprise deals, and whether the team actually uses the brand guidelines...',
      },
      {
        id: 'deadline',
        text: "When does this need to be done? Give us the real deadline, not the comfortable one.",
        type: 'date',
        placeholder: 'Select a date',
      },
    ],
  },
];

/**
 * Flatten all questions across all sections for progress tracking.
 * Returns array of { sectionIndex, questionIndex, question, section }.
 */
export function getAllQuestions() {
  const result = [];
  sections.forEach((section, sIdx) => {
    section.questions.forEach((q, qIdx) => {
      result.push({
        sectionIndex: sIdx,
        questionIndex: qIdx,
        question: q,
        section,
      });
    });
  });
  return result;
}

/**
 * Get visible questions for a section given current answers (evaluates gates).
 */
export function getVisibleQuestions(sectionIndex, answers) {
  const section = sections[sectionIndex];
  if (!section) return [];
  return section.questions.filter((q) => {
    if (!q.gate) return true;
    return q.gate(answers);
  });
}

/**
 * Get total visible question count across all sections.
 */
export function getTotalVisibleCount(answers) {
  let count = 0;
  sections.forEach((_, idx) => {
    count += getVisibleQuestions(idx, answers).length;
  });
  return count;
}

/**
 * Get answered visible question count.
 */
export function getAnsweredCount(answers) {
  let count = 0;
  sections.forEach((_, idx) => {
    const visible = getVisibleQuestions(idx, answers);
    visible.forEach((q) => {
      if (answers[q.id] !== undefined && answers[q.id] !== '') {
        count++;
      }
    });
  });
  return count;
}
