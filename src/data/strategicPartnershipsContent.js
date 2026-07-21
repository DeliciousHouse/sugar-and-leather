import { asset as a } from '../lib/asset';
import { CAL_BOOKING_URL, HOW_IT_WORKS_HASH } from '../lib/links';

export const STRATEGIC_PARTNERSHIPS = {
  slug: 'strategic-cxo-team',
  eyebrow: 'Strategic CXO team',
  name: 'Strategic CXO team',
  heroTitle: 'A Strategic CXO team',
  heroHighlight: 'Built for Growth',
  heroSub:
    'Gain executive leadership, operational expertise, and specialized execution teams without building an entire internal department.',
  heroImage: a('/assets/sp-hero.webp'),
  primaryCta: {
    label: 'Book a Discovery Call',
    href: CAL_BOOKING_URL,
  },
  secondaryCta: {
    label: 'See how it works',
    href: HOW_IT_WORKS_HASH,
  },
  experienceBackedBy: {
    label: 'Experience Backed By',
    companies: [
      {
        name: 'Missouri DOL',
        mark: a('/assets/logos/missouri-dol.webp'),
      },
      {
        name: 'Verizon',
        logo: a('/assets/logos/verizon.webp'),
        compact: true,
      },
      {
        name: 'Robert Half',
        logo: a('/assets/logos/roberthalf.webp'),
      },
      {
        name: 'JPMorgan Chase',
        logo: a('/assets/logos/jpmorganchase.webp'),
      },
      { name: 'Visa', logo: a('/assets/logos/visa.webp') },
      {
        name: 'PayPal',
        mark: a('/assets/logos/paypal-icon.webp'),
        wordmark: a('/assets/logos/paypal-wordmark.webp'),
      },
      { name: 'Salesforce', logo: a('/assets/logos/salesforce.webp') },
      { name: 'IBM', logo: a('/assets/logos/ibm.webp'), compact: true },
      { name: 'Autodesk', logo: a('/assets/logos/autodesk.webp') },
      { name: 'Microsoft', logo: a('/assets/logos/microsoft.webp'), compact: true },
      {
        name: 'Wells Fargo',
        mark: a('/assets/logos/wellsfargo.webp'),
      },
      { name: 'Compass Health', logo: a('/assets/logos/compasshealth.webp') },
      {
        name: 'Google',
        logo: a('/assets/logos/google.webp'),
        compact: true,
      },
      {
        name: 'Experian',
        logo: a('/assets/logos/experian.webp'),
      },
    ],
  },
  whatIs: {
    eyebrow: 'What is a Strategic CXO team',
    title: 'Designed for businesses that need more than advice.',
    body: 'A Strategic CXO team is designed for businesses that need more than advice. Rather than hiring multiple executives, agencies, and contractors, organizations partner with Sugar & Leather to gain access to executive guidance and dedicated execution pods that work together toward clearly defined growth objectives.',
    body2:
      'We become an extension of your leadership team while helping drive measurable outcomes.',
    image: a('/assets/sp-partnership.webp'),
    reverse: false,
  },
  process: {
    id: 'how-it-works',
    eyebrow: 'How it works',
    title: 'From assessment to execution',
    steps: [
      {
        num: '01',
        title: 'Business Assessment',
        description:
          'We evaluate your goals, growth stage, operational maturity, and strategic priorities.',
      },
      {
        num: '02',
        title: 'Executive Alignment',
        description:
          'A dedicated executive team helps define priorities, KPIs, and growth initiatives.',
      },
      {
        num: '03',
        title: 'Pod Deployment',
        description: 'Specialized pods are assembled based on your business needs.',
      },
      {
        num: '04',
        title: 'Execution & Optimization',
        description:
          'Teams execute initiatives while leadership continuously reviews performance and adjusts strategy.',
      },
    ],
  },
  executiveGuidance: {
    eyebrow: 'Executive guidance layer',
    title: 'Leadership before execution',
    body: 'Every engagement is supported by experienced operators and executives who help guide decision-making, prioritize initiatives, and ensure alignment between strategy and execution.',
    itemsLabel: 'Areas of focus',
    items: [
      'Growth Strategy',
      'Revenue Planning',
      'Operational Excellence',
      'Organizational Design',
      'Technology Adoption',
      'Market Expansion',
    ],
  },
  pods: {
    eyebrow: 'The four Strategic CXO team pods',
    title: 'Specialist teams. One partnership.',
    items: [
      {
        title: 'Marketing Pod',
        purpose: 'Build predictable demand and strengthen market presence.',
        services: [
          'Growth Strategy',
          'Content Marketing',
          'Campaign Management',
          'Brand Development',
          'Marketing Operations',
          'Performance Reporting',
        ],
        icon: 'Megaphone',
        href: '/strategic-cxo-team/marketing-pod',
      },
      {
        title: 'Sales Pod',
        purpose: 'Create repeatable revenue systems and accelerate growth.',
        services: [
          'Sales Process Design',
          'Outbound Systems',
          'CRM Optimization',
          'Pipeline Management',
          'Revenue Operations',
          'Sales Enablement',
        ],
        icon: 'Handshake',
        href: '/strategic-cxo-team/sales-pod',
      },
      {
        title: 'Development Pod',
        purpose: 'Turn ideas into products, systems, and scalable technology.',
        services: [
          'Software Development',
          'Product Strategy',
          'AI Implementation',
          'Workflow Automation',
          'Technical Architecture',
          'Platform Development',
        ],
        icon: 'Code2',
        href: '/strategic-cxo-team/development-pod',
      },
      {
        title: 'Recruitment Pod',
        purpose: 'Build teams capable of supporting long-term growth.',
        services: [
          'Talent Acquisition',
          'Hiring Strategy',
          'Recruitment Operations',
          'Candidate Screening',
          'Workforce Planning',
          'Team Scaling',
        ],
        icon: 'UserPlus',
        href: '/strategic-cxo-team/recruitment-pod',
      },
    ],
  },
  idealPartners: {
    eyebrow: 'Who this is for',
    title: 'Ideal partners',
    items: [
      'Early-Stage Startups',
      'Venture-Backed Companies',
      'Scaling Businesses',
      'Innovation-Focused Organizations',
      'Founder-Led Companies',
      'Growth-Stage Enterprises',
    ],
  },
  engagementModels: {
    eyebrow: 'Engagement models',
    title: 'A partnership shape for every stage',
    items: [
      {
        title: 'Advisory + Pod',
        description: 'Executive guidance combined with a single execution pod.',
      },
      {
        title: 'Multi-Pod Partnership',
        description: 'Multiple pods working together under a unified growth strategy.',
      },
      {
        title: 'Embedded Growth Team',
        description:
          'A fully integrated leadership and execution structure operating as an extension of your business.',
      },
    ],
  },
  outcomes: {
    eyebrow: 'Expected outcomes',
    title: 'What changes when the model works',
    items: [
      'Faster execution',
      'Improved operational efficiency',
      'Stronger revenue systems',
      'Better hiring outcomes',
      'Clear strategic direction',
      'Sustainable business growth',
    ],
  },
  faqTitle: 'Questions about the Strategic CXO team',
  faq: [
    {
      question: 'What is a fractional CXO?',
      answer:
        'A fractional CXO is an experienced executive who works with your business on a part-time, project, or retainer basis. You receive strategic leadership, decision-making, and execution support without hiring a full-time executive.',
    },
    {
      question: 'How is a Strategic CXO team different from consulting?',
      answer:
        'Consultants primarily provide recommendations. Our Strategic CXO team becomes part of your leadership structure, helps make decisions, guides execution, mentors internal teams, and remains accountable for outcomes.',
    },
    {
      question: 'Which businesses benefit most from fractional executive leadership?',
      answer:
        'Startups, growing companies, family-owned businesses, and organizations preparing to scale often benefit most. Fractional CXO leadership provides senior expertise while keeping cost and commitment flexible.',
    },
    {
      question: 'Do I hire one executive or a full CXO team?',
      answer:
        'Either. You can engage a single executive for a focused need, or assemble a coordinated Strategic CXO team. When multiple leaders are engaged, they operate as one aligned team so strategy and execution stay connected.',
    },
    {
      question: 'How long do Strategic CXO engagements last?',
      answer:
        'Engagements range from short project-based initiatives to ongoing monthly retainers and interim leadership during transitions. Time commitment is customized to your goals and can expand or contract as the business evolves.',
    },
    {
      question: 'Will fractional CXOs work with our existing team and leadership meetings?',
      answer:
        'Yes. They collaborate with, mentor, and guide internal teams, and can join executive meetings, planning sessions, board discussions, and investor updates whenever it strengthens decision-making.',
    },
    {
      question: 'How do you determine which CXO role we need?',
      answer:
        'We begin with a business assessment of your challenges, growth stage, and current capabilities, then recommend the executive role or team structure that will create the greatest impact.',
    },
    {
      question: 'What industries does the Strategic CXO team support?',
      answer:
        'The model is adaptable across industries. Engagements focus on leadership, strategy, operations, and execution tailored to your market, stage, and growth objectives.',
    },
    {
      question: 'How does AI support the Strategic CXO team?',
      answer:
        'AI accelerates research, reporting, planning, and analysis. Final decisions, relationship-building, accountability, and leadership remain with experienced human executives. AI is a productivity tool, not a replacement for judgment.',
    },
    {
      question: 'What outcomes should we expect from a Strategic CXO engagement?',
      answer:
        'Results vary by engagement, but commonly include clearer strategy, stronger operations, better financial and commercial planning, faster execution, greater team alignment, and more sustainable growth.',
    },
  ],
  cta: {
    title: 'Build faster with',
    highlight: 'the right partner',
    sub: 'Access leadership, execution, and specialized expertise through a single Strategic CXO team designed around your growth objectives.',
    primaryLabel: 'Schedule a Discovery Session',
    primaryHref: CAL_BOOKING_URL,
    secondaryLabel: 'See how it works',
    secondaryHref: HOW_IT_WORKS_HASH,
  },
};
