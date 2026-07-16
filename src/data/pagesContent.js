import { asset as a } from '../lib/asset';
import { CAL_BOOKING_URL } from '../lib/links';

export const PRODUCT_SLUGS = ['atelier', 'forge', 'compass', 'lexicon'];

export const PRODUCT_PAGES = {
  atelier: {
    slug: 'atelier',
    num: '01',
    eyebrow: 'Bespoke executive coaching',
    name: 'AriesAI',
    heroTitle: 'One leader. One coach.',
    heroHighlight: 'A year that changes the trajectory.',
    heroSub:
      'Private, intensive coaching for the singular leader navigating change at the highest altitude — confidential by design, intense by intention.',
    heroImage: a('/assets/photo-coaching-sage.webp'),
    sections: [
      {
        id: 'practice',
        eyebrow: 'The practice',
        title: 'Craft measured in quarters, not sessions',
        body: 'AriesAI is not executive coaching as a calendar block. It is a sustained relationship with a master coach who stays with you through the full arc of transformation — mapping the patterns beneath your performance, then rebuilding them deliberately across quarterly cycles of insight, practice, and integration.',
        bullets: [
          'Dedicated master coach — no pods, no handoffs',
          'Quarterly arcs with clear transformation milestones',
          'Confidential space for the most unguarded conversations',
        ],
        image: a('/assets/photo-study-light.webp'),
        reverse: false,
      },
      {
        id: 'experience',
        eyebrow: 'The experience',
        title: 'What changes when the room is truly yours',
        body: 'Leaders come to AriesAI at inflection points — succession, turnaround, public scrutiny, or the quiet crisis of outgrowing who they have been. The work is precise, private, and proportionate to the stakes.',
        bullets: [
          'Pattern recognition beneath executive performance',
          'Decision clarity under sustained pressure',
          'Leadership identity that holds when the context shifts',
        ],
        image: a('/assets/photo-coaching-library.webp'),
        reverse: true,
      },
    ],
    stories: [
      {
        quote:
          'I had advisors everywhere. AriesAI was the first place I could say what I actually thought — and leave with a plan I trusted.',
        role: 'Chief Executive Officer',
        sector: 'Global financial services',
      },
      {
        quote:
          'The quarterly arcs gave structure to work that could have drifted for years. By the second quarter, the organization felt the difference.',
        role: 'President',
        sector: 'Healthcare technology',
      },
      {
        quote:
          'Confidentiality was not a feature — it was the condition that made everything else possible.',
        role: 'Founder & Chair',
        sector: 'Private equity-backed platform',
      },
    ],
    faq: [
      {
        question: 'Who is AriesAI for',
        answer:
          'CEOs, founders, and senior executives carrying decisions that cannot be rehearsed in public. We work with one leader at a time, typically for a minimum of four quarters.',
      },
      {
        question: 'How is AriesAI different from other coaching',
        answer:
          'Depth over volume. One master coach, no junior bench, no content library substitute for relationship. The work is bespoke because the leader is.',
      },
      {
        question: 'What does a quarter look like',
        answer:
          'Each arc opens with diagnostic depth, moves through structured practice in real decisions, and closes with integration — so change shows up in behavior, not only insight.',
      },
      {
        question: 'How do we begin',
        answer:
          'Request an introduction. We will explore fit in a single conversation — direct, confidential, and without obligation.',
      },
    ],
    cta: {
      title: 'Ready for the room',
      highlight: 'that is truly yours',
      sub: 'AriesAI engagements are limited. If the fit is right, we will know quickly — and so will you.',
      primaryLabel: 'Book a call',
      primaryHref: CAL_BOOKING_URL,
      secondaryLabel: 'Explore the ecosystem',
      secondaryHref: '/#ecosystem',
    },
  },
  forge: {
    slug: 'forge',
    num: '02',
    eyebrow: 'Leadership team intensives',
    name: 'SequenceAI',
    heroTitle: 'Heat, then shape.',
    heroHighlight: 'Teams that hold when it matters.',
    heroSub:
      'Immersive intensives where an entire leadership team is pressure-tested together — rehearsing the hardest decisions before they arrive.',
    heroImage: a('/assets/photo-coaching-library.webp'),
    sections: [
      {
        id: 'practice',
        eyebrow: 'The practice',
        title: 'Alignment forged under pressure',
        body: 'SequenceAI brings the full leadership team into the same room — off the grid, fully present — to surface friction, rehearse high-stakes decisions, and leave with alignment that survives contact with reality.',
        bullets: [
          'Multi-day cohort immersions designed for your team',
          'Decision rehearsals for the calls you cannot get wrong',
          'Facilitation that surfaces friction instead of burying it',
        ],
        image: a('/assets/photo-night-work.webp'),
        reverse: false,
      },
      {
        id: 'experience',
        eyebrow: 'The experience',
        title: 'When the team bends without breaking',
        body: 'Most team offsites optimize for harmony. SequenceAI optimizes for truth — the kind that makes a leadership group faster, sharper, and more honest when the pressure is real.',
        bullets: [
          'Shared language for disagreement and commitment',
          'Rehearsed responses to board-level and market shocks',
          'Trust that compounds after the intensive ends',
        ],
        image: a('/assets/photo-coaching-sage.webp'),
        reverse: true,
      },
    ],
    stories: [
      {
        quote:
          'We had done offsites for a decade. SequenceAI was the first time we practiced the decisions we were actually afraid of.',
        role: 'Chief Operating Officer',
        sector: 'Industrial technology',
      },
      {
        quote:
          'The team left aligned in a way that held through our hardest quarter — not because we agreed on everything, but because we knew how to decide together.',
        role: 'Executive Team',
        sector: 'Consumer retail',
      },
    ],
    faq: [
      {
        question: 'What size team works best for SequenceAI',
        answer:
          'Typically six to twelve senior leaders — the group that must move together when stakes are highest. We design the intensive around your actual decision architecture.',
      },
      {
        question: 'Where do intensives take place',
        answer:
          'Off-site and distraction-free — often outside the city where your team operates daily. Location is chosen for focus, not spectacle.',
      },
      {
        question: 'How is SequenceAI different from a retreat',
        answer:
          'Retreats restore. SequenceAI reshapes — through structured pressure, honest friction, and rehearsed decisions your team will face within months.',
      },
      {
        question: 'Can SequenceAI follow AriesAI',
        answer:
          'Often. Individual coaching and team intensives complement each other when a CEO and their leadership group are transforming together.',
      },
    ],
    cta: {
      title: 'Bring the heat.',
      highlight: 'Leave with a team that holds.',
      sub: 'Tell us about your leadership group and the pressure you are preparing for. We will design the intensive from there.',
      primaryLabel: 'Book a call',
      primaryHref: CAL_BOOKING_URL,
      secondaryLabel: 'View AriesAI',
      secondaryHref: '/practices/atelier',
    },
  },
  compass: {
    slug: 'compass',
    num: '03',
    eyebrow: 'Fractional AI leadership',
    name: 'Compass',
    heroTitle: 'Strategy is a direction,',
    heroHighlight: 'not a deck.',
    heroSub:
      'Embedded, senior counsel on your AI strategy — translating ambition into roadmaps that survive contact with reality and boardrooms that demand clarity.',
    heroImage: a('/assets/photo-night-work.webp'),
    sections: [
      {
        id: 'practice',
        eyebrow: 'The practice',
        title: 'A steady hand on a moving frontier',
        body: 'Compass is fractional AI leadership for organizations that need senior judgment in the room — not another strategy document. We embed in your cadence, your context, and your hardest conversations.',
        bullets: [
          'Embedded advisory at executive and board level',
          'Roadmaps sequenced for capability before scale',
          'Narratives that hold up under scrutiny',
        ],
        image: a('/assets/photo-coaching-library.webp'),
        reverse: false,
      },
      {
        id: 'experience',
        eyebrow: 'The experience',
        title: 'Direction you can defend',
        body: 'AI strategy fails when it is performative — impressive in presentation, fragile in execution. Compass keeps the work honest about trade-offs, timing, and the human cost of transformation.',
        bullets: [
          'Horizon planning tied to fundable milestones',
          'Governance and risk framed in plain language',
          'Counsel present when the decision is live, not after',
        ],
        image: a('/assets/photo-study-light.webp'),
        reverse: true,
      },
    ],
    stories: [
      {
        quote:
          'We stopped presenting AI strategy and started making it. Compass gave us a roadmap the board could follow and the team could execute.',
        role: 'Chief Technology Officer',
        sector: 'Professional services',
      },
      {
        quote:
          'The value was not the deck — it was having someone in the room who had seen this movie before and would tell us the truth.',
        role: 'Chief Executive Officer',
        sector: 'Media & entertainment',
      },
    ],
    faq: [
      {
        question: 'Is Compass consulting or coaching',
        answer:
          'Both in practice, neither in the usual packaging. We advise strategy and coach the leaders carrying it — because at this altitude, the two cannot be separated.',
      },
      {
        question: 'How embedded is the engagement',
        answer:
          'Enough to be in your rhythm — leadership meetings, board prep, vendor decisions — without becoming another layer of bureaucracy.',
      },
      {
        question: 'Do you build the technology',
        answer:
          'No. We help you decide what to build, buy, or defer — and how to lead the organization through the consequences.',
      },
      {
        question: 'How long does Compass typically run',
        answer:
          'Most engagements begin with a quarter of diagnostic depth and extend as long as the strategic work requires — often twelve to eighteen months.',
      },
    ],
    cta: {
      title: 'Hold the line.',
      highlight: 'Steer with clarity.',
      sub: 'If your AI strategy needs a senior hand — not another slide — we should talk.',
      primaryLabel: 'Book a call',
      primaryHref: CAL_BOOKING_URL,
      secondaryLabel: 'View Lexicon',
      secondaryHref: '/practices/lexicon',
    },
  },
  lexicon: {
    slug: 'lexicon',
    num: '04',
    eyebrow: 'The AI-fluency platform',
    name: 'Lexicon',
    heroTitle: 'Understanding, not jargon.',
    heroHighlight: 'Fluency that compounds.',
    heroSub:
      'A living curriculum that makes executives genuinely fluent in AI — adaptive, current, and built for leaders who need to decide, not perform.',
    heroImage: a('/assets/photo-study-light.webp'),
    sections: [
      {
        id: 'practice',
        eyebrow: 'The platform',
        title: 'Fluency measured in decisions, not modules',
        body: 'Lexicon is not an LMS with a luxury skin. It is a curated path through the mental models, trade-offs, and language leaders need to steward AI responsibly — updated continuously as the frontier moves.',
        bullets: [
          'Adaptive paths by role, sector, and starting point',
          'Plain-language frameworks that survive a boardroom',
          'Content refreshed as the field shifts',
        ],
        image: a('/assets/photo-night-work.webp'),
        reverse: false,
      },
      {
        id: 'experience',
        eyebrow: 'The experience',
        title: 'Language that keeps pace with the work',
        body: 'Executives do not need to become engineers. They need to ask better questions, spot weak reasoning, and hold vendors and teams to a standard of clarity. Lexicon builds that capacity deliberately.',
        bullets: [
          'Executive-paced learning — respect for time and context',
          'Scenario-based practice tied to real decisions',
          'Shared vocabulary across the leadership team',
        ],
        image: a('/assets/photo-coaching-sage.webp'),
        reverse: true,
      },
    ],
    stories: [
      {
        quote:
          'Our board stopped nodding along and started asking sharp questions. Lexicon gave us a shared language we did not have before.',
        role: 'Board member',
        sector: 'Family-owned enterprise',
      },
      {
        quote:
          'Finally — AI education that treated us like executives, not students. The frameworks still show up in every strategy conversation.',
        role: 'Chief Strategy Officer',
        sector: 'Insurance',
      },
      {
        quote:
          'The curriculum updated faster than our internal committees could schedule meetings. That alone was worth it.',
        role: 'Head of Learning',
        sector: 'Global logistics',
      },
    ],
    faq: [
      {
        question: 'Who uses Lexicon',
        answer:
          'Executive teams, boards, and senior functional leaders who need fluency — not certification — to steward AI well.',
      },
      {
        question: 'How is content kept current',
        answer:
          'Lexicon is maintained as a living curriculum. When the frontier shifts, the path updates — so leaders are never learning from a stale playbook.',
      },
      {
        question: 'Can Lexicon complement Compass or SequenceAI',
        answer:
          'Yes. Lexicon builds shared fluency; Compass and SequenceAI apply it under pressure. Many clients use all three in sequence.',
      },
      {
        question: 'Is there a preview available',
        answer:
          'Request an introduction and we will walk you through a tailored path for your organization.',
      },
    ],
    cta: {
      title: 'Build the vocabulary',
      highlight: 'before the decision arrives',
      sub: 'Fluency is not optional at this altitude. Lexicon makes it achievable — and current.',
      primaryLabel: 'Book a call',
      primaryHref: CAL_BOOKING_URL,
      secondaryLabel: 'View Compass',
      secondaryHref: '/practices/compass',
    },
  },
};

export const ABOUT_PAGE = {
  hero: {
    eyebrow: 'About the firm',
    title: 'Built through pressure.',
    highlight: 'Led with humanity.',
    sub: 'At Sugar & Leather, we help leaders navigate this transition with clarity, combining strategic thinking, human judgment, and AI-enabled execution to build businesses that are prepared for what comes next.',
    image: a('/assets/about-hero.webp'),
    primaryAction: {
      label: 'Book a call',
      href: CAL_BOOKING_URL,
    },
  },
  name: {
    eyebrow: 'Who we are',
    title: 'Not a contradiction.',
    titleLine2: 'A philosophy.',
    sugar: {
      title: 'Sugar',
      body: 'Warmth is not weakness.',
      body2:
        'It is trust earned through listening, curiosity before certainty, and the belief that every meaningful transformation begins with people. We build with empathy, because technology only creates value when it serves the humans behind it.',
    },
    leather: {
      title: 'Leather',
      body: 'Resilience is not rigidity.',
      body2:
        'It is the discipline to make difficult decisions, the structure to execute consistently, and the courage to lead when the path ahead is uncertain. We bring clarity where complexity has taken hold.',
    },
    together: {
      brand: 'Sugar & Leather',
      lead: 'Together, they define how we work.',
      tag: 'Human-centered. Technology-enabled.',
      body: 'Not because AI should replace human capability, but because it should expand it.',
    },
  },
  mission: {
    eyebrow: 'Mission',
    title: 'Helping businesses find direction.',
    body: 'Technology has made almost everything possible. Knowing what matters has become the harder challenge.',
    body2:
      'Our work begins long before implementation. We help leadership teams uncover where meaningful leverage exists, align strategy with execution, and introduce intelligent systems only when they strengthen the business, not distract from it.',
  },
  vision: {
    eyebrow: 'Vision',
    title: 'Building organisations',
    titleLine2: 'that remain unmistakably human',
    titleLine3: 'in an increasingly intelligent world.',
    body: 'We believe the strongest companies of the next decade won\'t simply adopt AI. They\'ll build cultures where human judgment, technological capability, and disciplined execution reinforce one another.',
    body2:
      'The future doesn\'t belong to businesses with the most technology. It belongs to those that know why they\'re using it.',
  },
  leadership: {
    eyebrow: 'Leadership',
    title: 'Troy Cunningham-Jackson & Audrey Cunningham-Jackson',
    role: 'Founders & Strategic Partners',
    quote:
      'Pressure doesn\'t reveal character. It reveals preparation. Our responsibility is to help leaders build organisations that remain thoughtful, decisive, and deeply human, especially when the stakes are highest.',
    body: 'Sugar & Leather operates as a deliberately high-touch advisory practice. We work selectively, partnering closely with leadership teams to solve complex business challenges through strategic guidance, embedded expertise, and long-term capability building. Every engagement is designed around the organisation, not around a predefined service.',
    image: a('/assets/troy-audrey-together.webp'),
  },
  philosophy: {
    eyebrow: 'Ecosystem philosophy',
    title: 'Four pillars.',
    titleLine2: 'One direction.',
    body: 'Businesses need leadership, execution, technology, and opportunity working together, not in silos. Every engagement crosses all four pillars, so strategy and capability evolve as one ecosystem.',
    cards: [
      {
        name: 'Capital Access',
        href: '/capital-access',
        desc: 'Unlock the resources to move forward.',
        body: 'From grants and funding pathways to investment readiness, we help businesses access the capital needed to support their next stage of growth.',
      },
      {
        name: 'Strategic CXO team',
        href: '/strategic-partnerships',
        desc: 'Leadership that becomes part of your business.',
        body: 'Our Sales, Marketing, Recruitment, and Engineering Pods work alongside your team, providing strategic direction and embedded execution where it matters most.',
      },
      {
        name: 'Innovation & Technology',
        href: '/aries-platform',
        desc: 'Technology with purpose.',
        body: 'Whether through Aries AI, Sequence AI, automation, or AI strategy, we introduce technology where it creates measurable leverage, never complexity.',
      },
      {
        name: 'Community',
        href: '/advanced-tech',
        desc: "Growth doesn't happen in isolation.",
        body: 'Our communities bring together founders, operators, coaches, and leaders who learn from one another, challenge ideas, and create opportunities beyond a single engagement.',
      },
    ],
  },
  cta: {
    title: 'Some companies are scaled.',
    highlight: 'The best are built.',
    sub: 'Human judgment. Intelligent technology. Enduring businesses.',
    primaryLabel: 'Book a call',
    primaryHref: CAL_BOOKING_URL,
  },
};
