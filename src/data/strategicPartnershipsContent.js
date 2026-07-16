import { asset as a } from '../lib/asset';
import { CAL_BOOKING_URL, HOW_IT_WORKS_HASH } from '../lib/links';

export const STRATEGIC_PARTNERSHIPS = {
  slug: 'strategic-partnerships',
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
      'State of Missouri — DOL',
      'Verizon',
      'Robert Half',
      'JPMorgan Chase',
      'Visa',
      'PayPal',
      'Salesforce',
      'IBM',
      'Autodesk',
      'Microsoft',
      'Wells Fargo',
      'Compass Health',
      'Google',
      'Experian',
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
        href: '/strategic-partnerships/marketing-pod',
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
        href: '/strategic-partnerships/sales-pod',
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
        href: '/strategic-partnerships/development-pod',
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
        href: '/strategic-partnerships/recruitment-pod',
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
