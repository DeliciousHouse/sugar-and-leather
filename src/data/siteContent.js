import { asset as a } from '../lib/asset';
import { CAL_BOOKING_URL, ECOSYSTEM_HASH } from '../lib/links';

export const MARQUEE_ITEMS = [
  'Capital',
  'Leadership',
  'Execution',
  'Funding readiness',
  'Business growth',
  'Operational support',
];

export const ECOSYSTEM_CARDS = [
  {
    id: 'capital-access',
    href: '/capital-access',
    className: 'c-a',
    photo: a('/assets/photo-coaching-sage.webp'),
    index: '01',
    name: 'Capital Access & Grant Services',
    description:
      'Identify, apply for, and secure grants, incentives, and non-dilutive funding opportunities while building the operational readiness required for long-term growth.',
  },
  {
    id: 'strategic-partnerships',
    href: '/strategic-partnerships',
    className: 'c-b',
    photo: a('/assets/sp-ecosystem-card.webp'),
    index: '02',
    name: 'Strategic Partnerships',
    description:
      'Gain access to executive leadership and specialized teams that help execute growth initiatives across your organization.',
  },
  {
    id: 'community',
    href: '/community',
    className: 'c-c',
    photo: a('/assets/photo-coaching-library.webp'),
    index: '03',
    name: 'Community',
    description:
      'Where coaches, founders, and emerging entrepreneurs share knowledge, build capability, and find better direction through distinct learning communities.',
  },
  {
    id: 'advanced-tech',
    href: 'https://sugarandleather.ai/',
    external: true,
    className: 'c-d',
    photo: a('/assets/photo-study-light.webp'),
    index: '04',
    name: 'Innovation & Advanced Tech',
    description:
      'Access research initiatives, innovation programs, and advanced technology designed to support founders and organizations at every stage.',
  },
];

export const HOMEPAGE_ECOSYSTEM = {
  eyebrow: 'The Sugar & Leather Ecosystem',
  titleLine1: 'One Ecosystem.',
  titleLine2: 'Multiple Growth Engines.',
  intro:
    'Growing businesses rarely fail for lack of ideas. They need capital, leadership, and execution. Sugar & Leather unites all three in one ecosystem built for sustainable growth.',
};

export const HOMEPAGE_SHOWCASES = [
  {
    id: 'capital-access',
    num: '01',
    eyebrow: 'Grant Writing & Funding Strategy',
    name: 'Turn a Funding Opportunity Into a Fundable Case',
    tagline: '',
    body:
      'We help organizations pursue grants with a stronger strategy, clearer narrative, credible budget, and the operational readiness funders expect.',
    features: [
      {
        icon: 'FileText',
        title: 'Grant Strategy',
        description: 'Opportunity research, funding roadmaps, and go / no-go decision support before you apply.',
      },
      {
        icon: 'Landmark',
        title: 'Grant Proposal Development',
        description: 'Proposal narrative, budget support, attachments, and submission-ready review.',
      },
      {
        icon: 'ClipboardCheck',
        title: 'Funding Readiness',
        description: 'Program framing, operating plans, financial readiness, and capacity narrative.',
      },
      {
        icon: 'TrendingUp',
        title: 'Grant Readiness Review',
        description: 'Expert assessment of eligibility, competitiveness, and proposal scope.',
      },
      {
        icon: 'Map',
        title: 'Fixed-Scope Proposal Plans',
        description: 'Clear deliverables, timeline, and project fee tied to the actual work required.',
      },
      {
        icon: 'Building2',
        title: 'Capital Readiness Support',
        description: 'Financial planning, delivery structure, and broader capital preparation where needed.',
      },
    ],
    cta: { label: 'Explore Capital Services', href: '/capital-access' },
    reverse: false,
    slides: [
      { type: 'photo', image: a('/assets/photo-coaching-sage.webp'), caption: 'Capital strategy' },
      {
        type: 'ui',
        caption: 'Funding roadmap',
        tag: 'Capital Access · Roadmap',
        title: 'Non-dilutive capital',
        subtitle: 'Grants · incentives · readiness',
        meter: '68%',
        lines: ['72%', '58%', '64%'],
      },
      { type: 'photo', image: a('/assets/photo-study-light.webp'), caption: 'Operational readiness' },
    ],
  },
  {
    id: 'strategic-partnerships',
    num: '02',
    eyebrow: 'Strategic Partnerships',
    name: 'Executive Leadership Without Full-Time Overhead',
    tagline: '',
    body:
      'For scaling organizations, Sugar & Leather pairs executive leadership with execution teams. Leaders guide strategy; specialist pods deliver.',
    features: [
      {
        icon: 'Megaphone',
        title: 'Marketing Pod',
        description:
          'Campaign execution, content systems, demand generation, brand growth, and marketing operations.',
        href: '/strategic-partnerships/marketing-pod',
      },
      {
        icon: 'Target',
        title: 'Sales Pod',
        description:
          'Pipeline development, outbound systems, sales operations, CRM processes, and revenue acceleration.',
        href: '/strategic-partnerships/sales-pod',
      },
      {
        icon: 'Code',
        title: 'Development Pod',
        description:
          'Product development, software engineering, AI implementation, automation, and technical execution.',
        href: '/strategic-partnerships/development-pod',
      },
      {
        icon: 'UserPlus',
        title: 'Recruitment Pod',
        description: 'Talent acquisition, hiring systems, workforce planning, and recruitment operations.',
        href: '/strategic-partnerships/recruitment-pod',
      },
    ],
    cta: { label: 'Explore Strategic Partnerships', href: '/strategic-partnerships' },
    reverse: true,
    slides: [
      { type: 'photo', image: a('/assets/sp-showcase-leadership.webp'), caption: 'Executive leadership' },
      {
        type: 'ui',
        caption: 'Execution pods',
        tag: 'Strategic Partnerships · Pods',
        title: 'Growth execution',
        subtitle: 'Marketing · sales · dev · recruitment',
        meter: '82%',
        lines: ['60%', '78%', '48%'],
      },
      { type: 'photo', image: a('/assets/sp-showcase-execution.webp'), caption: 'Operational delivery' },
    ],
  },
  {
    id: 'community',
    num: '03',
    eyebrow: 'Community',
    name: 'Where the Next Generation of Business Learns to Move',
    tagline: '',
    body:
      'Sugar & Leather brings together coaches, founders, emerging entrepreneurs, and curious operators. A place to share knowledge, build capability, and find better direction.',
    features: [
      {
        icon: 'Users',
        title: 'Coaches Network',
        description:
          'A platform where coaches share their expertise and people discover guidance that fits the challenge in front of them.',
      },
      {
        icon: 'GraduationCap',
        title: 'Next Level Business Society',
        description:
          'A Skool-based learning community for founders, young entrepreneurs, and future operators building real capability.',
      },
      {
        icon: 'Sparkles',
        title: 'Angel Series',
        description:
          'A more personal layer of guidance for those moving beyond the first stage of learning. Coming soon.',
      },
    ],
    cta: { label: 'Explore Community', href: '/community' },
    reverse: false,
    slides: [
      { type: 'photo', image: a('/assets/photo-coaching-library.webp'), caption: 'Coaches Network' },
      {
        type: 'ui',
        caption: 'Learning community',
        tag: 'Next Level Business Society',
        title: 'Build capability',
        subtitle: 'Live sessions · roadmaps · peers',
        meter: '78%',
        lines: ['64%', '72%', '86%'],
      },
      { type: 'photo', image: a('/assets/photo-study-light.webp'), caption: 'Community learning' },
    ],
  },
];

export const HOMEPAGE_WHY = {
  eyebrow: 'Why Companies Work With Sugar & Leather',
  title: 'More than advice.',
  titleHighlight: 'Real execution.',
  items: [
    {
      question: 'Strategic Leadership',
      answer:
        'Access experienced operators and executives without the cost of building a full executive team.',
    },
    {
      question: 'Execution Pods',
      answer:
        'Deploy specialized teams focused on outcomes rather than isolated consulting recommendations.',
    },
    {
      question: 'Funding Expertise',
      answer: 'Navigate grants and funding opportunities with experienced support.',
    },
    {
      question: 'Integrated Ecosystem',
      answer: 'Capital, leadership, technology, and execution delivered through a single partner.',
    },
  ],
};

export const HOMEPAGE_COMMUNITY = {
  eyebrow: 'Community',
  title: 'Where the Next Generation of Business Learns to Move',
  body:
    'Sugar & Leather brings together coaches, founders, emerging entrepreneurs, and curious operators who believe business can be commercially capable, technologically aware, and deeply human — a place to share knowledge, build capability, and find better direction.',
  cta: { label: 'Explore Our Communities', href: '/community' },
};

export const HOMEPAGE_CTA = {
  title: 'Ready to Accelerate Growth?',
  highlight: null,
  sub:
    "Whether you're looking for funding, leadership support, execution capacity, or AI-powered technology, Sugar & Leather provides the infrastructure to help organizations grow with confidence.",
  primaryLabel: 'Book a Strategy Call',
  primaryHref: CAL_BOOKING_URL,
  secondaryLabel: 'Talk to Our Team',
  secondaryHref: 'mailto:hello@sugarandleather.com',
};

export const HOMEPAGE_HERO = {
  eyebrow: 'Capital · Leadership · Execution',
  title: 'Building Companies Through Capital, Leadership, and Execution.',
  sub:
    'Sugar & Leather helps founders secure grants and non-dilutive funding, deploy executive leadership, and scale with execution pods across marketing, sales, development, and recruitment.',
  heroImage: a('/assets/home-hero.webp'),
  primaryCta: { label: 'Book a Strategy Call', href: CAL_BOOKING_URL },
  secondaryCta: { label: 'Explore Our Ecosystem', href: '#ecosystem' },
};

export const FOUNDERS = [
  {
    id: 'audrey',
    image: a('/assets/audrey.webp'),
    tag: 'Founder & Purpose-Driven Coach',
    eyebrow: 'A note from our founder',
    quote: 'The leaders I admire most were never the loudest. They stayed',
    quoteHighlight: 'human',
    quoteEnd: 'when the pressure said otherwise',
    body:
      'I built Sugar & Leather for leaders who refuse to choose between ambition and humanity. We coach the human and advise the strategy, because at this altitude the two cannot be separated.',
    name: 'Audrey Cunningham-Jackson',
    role: 'Founder & Purpose-Driven Coach',
  },
  {
    id: 'troy',
    image: a('/assets/Troy.webp'),
    tag: 'Founder & Visionary Leadership Head',
    eyebrow: 'A note from our founder',
    quote: 'Strategy without judgment is just motion. The best operators know when to',
    quoteHighlight: 'pause',
    quoteEnd: 'before they scale',
    body:
      'I joined to build the systems that let leaders move faster without losing the plot — capital, partnerships, and technology wired to the same standard of care.',
    name: 'Troy Cunningham-Jackson',
    role: 'Founder & Visionary Leadership Head',
  },
];

export const FAQ_ITEMS = [
  {
    question: 'Who do you work with',
    answer:
      'Senior leaders and the organizations they steward — typically executives, founders, and boards navigating AI transformation. We are selective by design, and we say no far more often than we say yes.',
  },
  {
    question: 'Is this coaching, or consulting',
    answer:
      'Both, and neither in the usual sense. We coach the human and advise the strategy, because at the level we work, the two cannot be pulled apart. You are not buying a deliverable — you are entering a relationship.',
  },
  {
    question: 'How long does an engagement last',
    answer:
      'Most begin with a single quarter and deepen from there. Transformation is not a sprint; we stay as long as the work honestly requires, and not a session longer.',
  },
  {
    question: 'What makes Sugar & Leather different',
    answer:
      'Restraint. We take few clients, say little publicly, and let the work speak. The darkness is deliberate — it signals that we do not need to shout.',
  },
  {
    question: 'How do we begin',
    answer:
      'With a conversation. Request an introduction below and we will explore whether the fit is right. It usually becomes clear, to both of us, quite quickly.',
  },
];

export const PRACTICES = [
  {
    id: 'atelier',
    num: '01',
    eyebrow: 'Bespoke executive coaching',
    name: 'AriesAI',
    tagline: 'One leader. One coach. A year that changes the trajectory.',
    body: 'A single, uninterrupted relationship with a master coach. We work in quarterly arcs — uncovering the patterns beneath the performance, then rebuilding them deliberately. Confidential by design, intense by intention.',
    features: [
      {
        icon: 'Infinity',
        title: 'Quarterly transformation arcs',
        description: 'Structured cycles of insight, practice, and integration.',
      },
      {
        icon: 'UserRound',
        title: 'One-to-one with a master coach',
        description: 'No pods, no juniors. The same trusted voice throughout.',
      },
      {
        icon: 'Lock',
        title: 'Confidential by design',
        description: 'A room where the most senior leader can be unguarded.',
      },
    ],
    cta: { label: 'View more', href: '/practices/atelier' },
    reverse: false,
    slides: [
      { type: 'photo', image: a('/assets/photo-coaching-sage.webp'), caption: 'The room' },
      {
        type: 'ui',
        caption: 'The arc',
        tag: 'AriesAI · Arc 01',
        title: 'Quarter one',
        subtitle: 'Patterns mapped · trust established',
        meter: '34%',
        lines: ['72%', '54%', '64%'],
      },
      { type: 'photo', image: a('/assets/photo-study-light.webp'), caption: 'The work' },
    ],
  },
  {
    id: 'forge',
    num: '02',
    eyebrow: 'Leadership team intensives',
    name: 'SequenceAI',
    tagline: 'Heat, then shape. Teams that hold when it matters.',
    body: 'Immersive intensives where an entire leadership team is pressure-tested together. We rehearse the hardest decisions before they arrive — so that under real pressure, the team bends without breaking.',
    features: [
      {
        icon: 'Flame',
        title: 'Cohort immersions',
        description: 'Multi-day intensives, off the grid, fully present.',
      },
      {
        icon: 'GitBranch',
        title: 'Decision rehearsals',
        description: 'The high-stakes calls, practiced before they are real.',
      },
      {
        icon: 'UsersRound',
        title: 'Pressure-tested alignment',
        description: 'Friction surfaced and resolved, not buried.',
      },
    ],
    cta: { label: 'View more', href: '/practices/forge' },
    reverse: true,
    slides: [
      { type: 'photo', image: a('/assets/photo-coaching-library.webp'), caption: 'The table' },
      {
        type: 'ui',
        caption: 'The rehearsal',
        tag: 'SequenceAI · Cohort',
        title: 'Alignment',
        subtitle: 'Eight leaders · one decision',
        meter: '82%',
        lines: ['60%', '78%', '48%'],
      },
      { type: 'photo', image: a('/assets/photo-night-work.webp'), caption: 'The pressure' },
    ],
  },
  {
    id: 'compass',
    num: '03',
    eyebrow: 'Fractional AI leadership',
    name: 'Compass',
    tagline: 'Strategy is a direction, not a deck. We hold the line with you.',
    body: 'An embedded, senior hand on your AI strategy — part fractional Chief AI Officer, part trusted counsel. We translate ambition into roadmaps that survive contact with reality, and sit with you in the room when the decisions are hard.',
    features: [
      {
        icon: 'Compass',
        title: 'Embedded advisory',
        description: 'In your cadence, in your context — not from the outside.',
      },
      {
        icon: 'Presentation',
        title: 'Board-level fluency',
        description: 'The narrative your board needs, without the hand-waving.',
      },
      {
        icon: 'Route',
        title: 'Roadmaps that survive contact',
        description: 'Sequenced, fundable, and honest about the trade-offs.',
      },
    ],
    cta: { label: 'View more', href: '/practices/compass' },
    reverse: false,
    slides: [
      {
        type: 'ui',
        caption: 'The roadmap',
        tag: 'Compass · Roadmap',
        title: 'Horizon 2',
        subtitle: 'Capability before scale',
        meter: '58%',
        lines: ['84%', '56%', '70%'],
      },
      { type: 'photo', image: a('/assets/photo-night-work.webp'), caption: 'The build' },
      { type: 'photo', image: a('/assets/photo-coaching-library.webp'), caption: 'The counsel' },
    ],
  },
  {
    id: 'lexicon',
    num: '04',
    eyebrow: 'The AI-fluency platform',
    name: 'Lexicon',
    tagline: 'Understanding, not jargon. Fluency that compounds.',
    body: 'A living curriculum that makes executives genuinely fluent in AI — not performatively, but practically. Adaptive paths meet leaders where they are and stay current as the field moves, so the language never goes stale.',
    features: [
      {
        icon: 'Waypoints',
        title: 'Adaptive learning paths',
        description: 'Tailored to role, sector, and starting point.',
      },
      {
        icon: 'BookOpen',
        title: 'Plain-language frameworks',
        description: 'Mental models that hold up in a real boardroom.',
      },
      {
        icon: 'RefreshCw',
        title: 'Always current',
        description: 'Updated continuously as the frontier shifts.',
      },
    ],
    cta: { label: 'View more', href: '/practices/lexicon' },
    reverse: true,
    slides: [
      { type: 'photo', image: a('/assets/photo-study-light.webp'), caption: 'The study' },
      {
        type: 'ui',
        caption: 'The path',
        tag: 'Lexicon · Path',
        title: 'Fluency',
        subtitle: 'Module 7 of 12 · adaptive',
        meter: '62%',
        lines: ['66%', '80%', '50%'],
      },
      { type: 'photo', image: a('/assets/photo-night-work.webp'), caption: 'The practice' },
    ],
  },
];
