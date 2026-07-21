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
    id: 'capital-access-and-grant-services',
    href: '/capital-access-and-grant-services',
    className: 'c-a',
    photo: a('/assets/ca-hero.webp'),
    index: '01',
    name: 'Capital Access & Grant Services',
    description:
      'Identify, apply for, and secure grants, incentives, and non-dilutive funding opportunities while building the operational readiness required for long-term growth.',
  },
  {
    id: 'strategic-cxo-team',
    href: '/strategic-cxo-team',
    className: 'c-b',
    photo: a('/assets/sp-ecosystem-card.webp'),
    index: '02',
    name: 'Strategic CXO team',
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
    id: 'innovation-and-advanced-tech',
    href: '/innovation-and-advanced-tech',
    className: 'c-d',
    photo: a('/assets/photo-night-work.webp'),
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

export const HOMEPAGE_PRODUCTS = [
  {
    id: 'aries-ai',
    num: '01',
    eyebrow: 'Our Products',
    name: 'Aries AI',
    tagline: 'An AI orchestration layer for your complete marketing operation.',
    body:
      'Marketing becomes fragmented when strategy, research, execution, and channel management live in separate places. Aries AI gives marketing one connected intelligence layer, from insight to strategy to execution.',
    features: [
      {
        icon: 'Brain',
        title: 'Builds a working understanding of your business, market, audience, and competitors',
      },
      {
        icon: 'Search',
        title: 'Continuously gathers relevant market and competitor intelligence',
      },
      {
        icon: 'Bot',
        title: 'Orchestrates specialized AI agents for different marketing tasks',
      },
      {
        icon: 'Target',
        title: 'Uses that context to shape marketing priorities and strategy',
      },
      {
        icon: 'Share2',
        title: 'Supports execution across social profiles, content, research, and search',
      },
      {
        icon: 'Layers',
        title: 'Keeps strategy, messaging, and activity connected in one place',
      },
    ],
    cta: { label: 'Explore Aries AI', href: 'https://aries.sugarandleather.com/' },
    reverse: false,
    slides: [
      { type: 'photo', image: a('/assets/aries-dashboard.webp'), caption: 'Aries AI dashboard' },
      { type: 'photo', image: a('/assets/aries-ecosystem.webp'), caption: 'Connected marketing ecosystem' },
    ],
  },
  {
    id: 'sequence',
    num: '02',
    eyebrow: 'Our Products',
    name: 'Sequence',
    tagline: 'A CRM intelligence layer that learns from every customer conversation.',
    body:
      'Customer context is usually scattered across calls, messages, and meeting notes. Sequence builds a living understanding of every customer relationship, so teams know what matters, when to follow up, and how to improve.',
    features: [
      {
        icon: 'MessageSquare',
        title: 'Maintains context for each customer across conversations and interactions',
      },
      {
        icon: 'Signal',
        title: 'Identifies important signals, concerns, needs, and next steps',
      },
      {
        icon: 'Target',
        title: 'Surfaces stronger buying intent and the right moments to follow up',
      },
      {
        icon: 'Database',
        title: 'Updates CRM information based on meaningful customer context',
      },
      {
        icon: 'GraduationCap',
        title: 'Helps SDRs and sales representatives learn from conversations and refine their approach',
      },
      {
        icon: 'Layers',
        title: 'Keeps relationship intelligence, CRM activity, and sales learning in one place',
      },
    ],
    cta: { label: 'Explore Sequence', href: 'https://sequence.sugarandleather.com/', showArrow: false },
    reverse: true,
    staticVisual: true,
    slides: [
      { type: 'photo', image: a('/assets/sequence-dashboard.webp'), caption: 'Sequence CRM dashboard' },
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
  secondaryHref: 'mailto:contact@sugarandleather.com',
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
    tag: 'Heart, Humanity & Leadership',
    eyebrow: 'A note from our founder',
    quote: 'The best leaders don’t lose themselves when success arrives. They become',
    quoteHighlight: 'more themselves',
    quoteEnd: '',
    body: [
      'I’ve spent my career helping people lead from a place of purpose instead of performance. Whether I’m coaching founders, executives, or emerging leaders, my work always begins with the human being behind the title.',
      'Sugar & Leather was built on a simple belief: ambition should never cost you your values. The strongest organizations are created by leaders who know how to care deeply, make difficult decisions with compassion, and build cultures where people can do the best work of their lives.',
      'I lead the human side of our work, executive coaching, leadership development, and the conversations that shape character long before they shape companies. Our commitment to service and community isn’t an initiative we added later; it’s the reason we built this company in the first place.',
      'Because strategy can grow a business. Humanity builds a legacy.',
    ],
    name: 'Audrey Cunningham-Jackson',
    role: 'Founder | Heart, Humanity & Leadership',
  },
  {
    id: 'troy',
    image: a('/assets/Troy.webp'),
    tag: 'Strategy, Systems & Innovation',
    eyebrow: 'A note from our founder',
    quote: 'Every meaningful mission deserves an architecture',
    quoteHighlight: 'strong enough',
    quoteEnd: 'to carry it.',
    breakBeforeHighlight: true,
    body: [
      'I build the systems behind bold ideas.',
      'My background spans entrepreneurship, technology, AI, product development, and venture strategy, but I’ve never been interested in innovation for its own sake. The best technology doesn’t replace human judgment, it amplifies it.',
      'At Sugar & Leather, I design the operating systems that allow leaders to scale without losing clarity. From AI implementation and strategic partnerships to capital strategy and organizational design, my role is turning vision into infrastructure that lasts.',
      'While Audrey protects the heart of the organization, I build the engine that moves it forward. Together, we believe companies shouldn’t have to choose between human-centered leadership and world-class execution.',
      'Because vision is only as powerful as the systems that make it real.',
    ],
    name: 'Troy Cunningham-Jackson',
    role: 'Founder | Strategy, Systems & Innovation',
    press: {
      label: 'Know More :',
      links: [
        {
          name: 'The Real Edit',
          href: 'https://therealedit.site/troy-cunningham/',
          logo: a('/assets/press/the-real-edit.webp'),
        },
        {
          name: 'The Entrepreneur Times',
          href: 'https://theentrepreneur-times.com/troy-cunningham-jackson-redefining-leadership-in-the-age-of-ai-with-heart-and-purpose/',
          logo: a('/assets/press/the-entrepreneur-times.webp'),
        },
      ],
    },
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
