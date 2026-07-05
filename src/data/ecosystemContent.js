import { asset as a } from '../lib/asset';
import { CAL_BOOKING_URL } from '../lib/links';

export const ECOSYSTEM_SLUGS = [
  'capital-access',
  'strategic-partnerships',
  'aries-platform',
  'advanced-tech',
];

export const ECOSYSTEM_PAGES = {
  'capital-access': {
    slug: 'capital-access',
    num: '01',
    eyebrow: 'Capital access & grant services',
    name: 'Capital Access & Grant Services',
    heroTitle: 'Funding that compounds,',
    heroHighlight: 'not dilutes.',
    heroSub:
      'Grant strategy, non-dilutive capital, and operational readiness for organizations building at scale — without trading away what you have fought to own.',
    heroImage: a('/assets/photo-coaching-sage.webp'),
    offerings: {
      eyebrow: 'What we deliver',
      title: 'Capital with clarity at every stage',
      items: [
        {
          icon: 'FileText',
          title: 'Grant strategy & writing',
          description:
            'Federal, state, and foundation grants mapped to your roadmap — narrative, compliance, and submission managed end to end.',
        },
        {
          icon: 'Landmark',
          title: 'Non-dilutive capital',
          description:
            'SBIR, STTR, and incentive programs structured so growth capital arrives without surrendering equity prematurely.',
        },
        {
          icon: 'ClipboardCheck',
          title: 'Operational readiness',
          description:
            'Audit trails, financial systems, and documentation built to pass diligence before the deadline arrives.',
        },
      ],
    },
    sections: [
      {
        id: 'approach',
        eyebrow: 'The approach',
        title: 'Capital is a design problem, not a lottery',
        body: 'Most teams treat grants as a side project. We treat capital access as strategic infrastructure — sequenced against your product roadmap, your hiring plan, and the milestones investors will actually underwrite.',
        bullets: [
          'Funding calendar aligned to product and hiring milestones',
          'Grant portfolios diversified across non-dilutive sources',
          'Readiness audits before submission, not after rejection',
        ],
        image: a('/assets/photo-study-light.webp'),
        reverse: false,
      },
      {
        id: 'fit',
        eyebrow: 'Who it serves',
        title: 'Built for builders who need runway without surrender',
        body: 'Growth-stage companies, research-driven ventures, and mission-aligned organizations that need capital to compound — not cap tables to dilute. We work with teams serious about operational discipline.',
        bullets: [
          'Mid-market and growth-stage technology companies',
          'R&D-intensive ventures pursuing federal programs',
          'Leadership teams preparing for institutional diligence',
        ],
        image: a('/assets/photo-coaching-library.webp'),
        reverse: true,
      },
    ],
    stories: [
      {
        quote:
          'They did not just write the grant — they rebuilt how we talked about the company to funders. We closed two awards in the same quarter.',
        role: 'Chief Executive Officer',
        sector: 'Climate technology',
      },
      {
        quote:
          'Readiness work felt tedious until diligence day. Every document was where it needed to be. That alone saved the round.',
        role: 'Chief Financial Officer',
        sector: 'Healthcare platform',
      },
      {
        quote:
          'Non-dilutive capital changed our growth math. We scaled headcount without negotiating away the future.',
        role: 'Founder',
        sector: 'Defense-adjacent AI',
      },
    ],
    faq: [
      {
        question: 'What types of funding do you pursue',
        answer:
          'Federal grants, state incentives, foundation awards, and structured non-dilutive programs — selected for fit, timeline, and strategic alignment with your roadmap.',
      },
      {
        question: 'How long does a typical engagement take',
        answer:
          'Strategy and readiness work often runs one quarter. Active grant cycles vary by program — we map timelines upfront so leadership knows what lands when.',
      },
      {
        question: 'Do you replace our finance team',
        answer:
          'No. We augment leadership with specialized grant and diligence expertise, then transfer the systems so your team can run the next cycle.',
      },
      {
        question: 'How do we begin',
        answer:
          'Book a call. We will review your stage, capital goals, and readiness in a single conversation — direct and without obligation.',
      },
    ],
    cta: {
      title: 'Ready to fund the work',
      highlight: 'without diluting the vision',
      sub: 'Capital access engagements are scoped to your stage and timeline. If the fit is right, we will know quickly.',
      primaryLabel: 'Book a call',
      primaryHref: CAL_BOOKING_URL,
      secondaryLabel: 'View all products',
      secondaryHref: '/#ecosystem',
    },
  },
  'aries-platform': {
    slug: 'aries-platform',
    num: '03',
    eyebrow: 'ARIES platform & products',
    name: 'ARIES Platform & Products',
    heroTitle: 'The operating system',
    heroHighlight: 'for the AI-native company.',
    heroSub:
      'An AI-native business platform built for mid-market scale — Sequence CRM, intelligent workflows, and a data layer that keeps judgment human while the machine moves faster.',
    heroImage: a('/assets/photo-night-work.webp'),
    offerings: {
      eyebrow: 'Platform modules',
      title: 'Infrastructure that scales with judgment intact',
      items: [
        {
          icon: 'Workflow',
          title: 'Sequence CRM',
          description:
            'Relationship intelligence designed for complex B2B motion — not contact lists with automation bolted on.',
        },
        {
          icon: 'Bot',
          title: 'AI workflow layer',
          description:
            'Agents and automations scoped to human approval gates — speed without surrendering accountability.',
        },
        {
          icon: 'Database',
          title: 'Unified data core',
          description:
            'Pipeline, product, and customer signals in one layer — so leadership sees reality, not dashboard theater.',
        },
      ],
    },
    sections: [
      {
        id: 'philosophy',
        eyebrow: 'Platform philosophy',
        title: 'AI-native, not AI-applied',
        body: 'Most platforms retrofit AI onto legacy architecture. ARIES is built from the ground up for organizations where machine intelligence is operational infrastructure — with human judgment explicit at every decision point that matters.',
        bullets: [
          'Human-in-the-loop by design, not as an afterthought',
          'Mid-market pricing without enterprise implementation drag',
          'Composable modules that grow with your operating model',
        ],
        image: a('/assets/photo-coaching-library.webp'),
        reverse: false,
      },
      {
        id: 'deployment',
        eyebrow: 'Deployment',
        title: 'Live in weeks, not quarters',
        body: 'Implementation is paired with change management — because a platform only works when leadership trusts what it shows. We deploy alongside your team until the cadence holds.',
        bullets: [
          'Phased rollout aligned to revenue and ops priorities',
          'Executive dashboards with plain-language signal',
          'Ongoing tuning as your AI maturity compounds',
        ],
        image: a('/assets/photo-study-light.webp'),
        reverse: true,
      },
    ],
    stories: [
      {
        quote:
          'Sequence replaced three tools and one brittle integration. Our reps finally trusted the pipeline — leadership finally trusted the forecast.',
        role: 'Chief Revenue Officer',
        sector: 'Professional services',
      },
      {
        quote:
          'The workflow layer cut cycle time on approvals without cutting humans out of the decisions that mattered.',
        role: 'Chief Operating Officer',
        sector: 'Logistics technology',
      },
      {
        quote:
          'We did not need another dashboard. We needed one source of truth. ARIES became that within the first month.',
        role: 'President',
        sector: 'Manufacturing software',
      },
    ],
    faq: [
      {
        question: 'Who is ARIES built for',
        answer:
          'Mid-market B2B organizations with complex sales motion, multiple data sources, and leadership teams ready to operate AI-native — not AI-curious.',
      },
      {
        question: 'Can we adopt modules incrementally',
        answer:
          'Yes. Most clients begin with Sequence CRM or the workflow layer, then expand into the unified data core as integration maturity allows.',
      },
      {
        question: 'How does implementation work',
        answer:
          'A phased deployment with executive sponsorship, typically four to eight weeks to first production value — with Sugar & Leather embedded through adoption.',
      },
      {
        question: 'How do we begin',
        answer:
          'Book a call for a platform walkthrough tailored to your stack, team size, and operating model.',
      },
    ],
    cta: {
      title: 'Ready for infrastructure',
      highlight: 'that matches your ambition',
      sub: 'ARIES deployments are scoped to your operating model. See the platform in context — not in a generic demo.',
      primaryLabel: 'Book a call',
      primaryHref: CAL_BOOKING_URL,
      secondaryLabel: 'View all products',
      secondaryHref: '/#ecosystem',
    },
  },
  'advanced-tech': {
    slug: 'advanced-tech',
    num: '04',
    eyebrow: 'Advanced tech & innovation',
    name: 'Advanced Tech & Innovation',
    heroTitle: 'Governance and invention',
    heroHighlight: 'at the frontier.',
    heroSub:
      'AI governance, drone systems, distributed networks, and patented intellectual property — for organizations building what does not exist yet, under scrutiny that will not wait.',
    heroImage: a('/assets/photo-study-light.webp'),
    offerings: {
      eyebrow: 'Capability areas',
      title: 'Innovation with guardrails that hold',
      items: [
        {
          icon: 'Shield',
          title: 'AI governance',
          description:
            'Policy, risk frameworks, and board-ready fluency for deployments that must survive audit and public trust.',
        },
        {
          icon: 'Plane',
          title: 'Drone systems',
          description:
            'Autonomous and semi-autonomous platforms for inspection, logistics, and defense-adjacent operations.',
        },
        {
          icon: 'Network',
          title: 'Distributed networks',
          description:
            'Resilient communications and edge architectures for environments where failure is not an option.',
        },
        {
          icon: 'Lightbulb',
          title: 'Patented IP',
          description:
            'Invention strategy, prior art navigation, and portfolio development for defensible long-term advantage.',
        },
      ],
    },
    sections: [
      {
        id: 'mandate',
        eyebrow: 'The mandate',
        title: 'Build at the edge without losing the center',
        body: 'Frontier technology demands speed and restraint in equal measure. We partner with leadership teams and technical principals to move fast on invention while governance, safety, and IP strategy keep pace — not play catch-up.',
        bullets: [
          'Governance frameworks aligned to regulatory reality',
          'Technical programs with executive-visible milestones',
          'IP strategy integrated with product and capital planning',
        ],
        image: a('/assets/photo-night-work.webp'),
        reverse: false,
      },
      {
        id: 'engagement',
        eyebrow: 'Engagement shape',
        title: 'Principal-level depth, not vendor sprawl',
        body: 'Advanced work fails when it is ticketed through generalists. Engagements are led by principals with domain depth — AI policy, autonomous systems, network architecture — embedded with your team until the capability is yours.',
        bullets: [
          'Fractional chief technology and governance roles',
          'Program leadership on drone and distributed systems',
          'IP counsel coordination with technical documentation',
        ],
        image: a('/assets/photo-coaching-sage.webp'),
        reverse: true,
      },
    ],
    stories: [
      {
        quote:
          'Governance used to slow us down. The framework they built let us ship faster because everyone knew the lines.',
        role: 'Chief Technology Officer',
        sector: 'Autonomous systems',
      },
      {
        quote:
          'Our drone program went from prototype to regulated operation in one arc — technical and policy in the same room.',
        role: 'Director of Operations',
        sector: 'Infrastructure inspection',
      },
      {
        quote:
          'The IP work was not legal paperwork. It was strategy — what to patent, what to publish, what to keep quiet.',
        role: 'Founder',
        sector: 'Network security',
      },
    ],
    faq: [
      {
        question: 'What industries do you serve here',
        answer:
          'Defense-adjacent technology, critical infrastructure, regulated AI deployments, and R&D-intensive ventures where governance and invention must move together.',
      },
      {
        question: 'Do you build or advise',
        answer:
          'Both — shaped by the engagement. We advise leadership on governance and IP, and embed with technical teams on systems delivery when execution is the bottleneck.',
      },
      {
        question: 'How do you handle classified or sensitive work',
        answer:
          'Engagements are structured for confidentiality from the first conversation. Scope, clearance, and data handling are defined before technical work begins.',
      },
      {
        question: 'How do we begin',
        answer:
          'Book a call. We will explore your technical mandate, regulatory context, and timeline — then define whether advisory or embedded delivery fits.',
      },
    ],
    cta: {
      title: 'Building at the frontier',
      highlight: 'requires more than speed',
      sub: 'Advanced tech engagements are principal-led and selectively scoped. If the mandate is real, we will know quickly.',
      primaryLabel: 'Book a call',
      primaryHref: CAL_BOOKING_URL,
      secondaryLabel: 'View all products',
      secondaryHref: '/#ecosystem',
    },
  },
};
