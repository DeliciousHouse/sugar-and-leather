import { asset as a } from '../lib/asset';

export const COMMUNITY = {
  slug: 'community',
  eyebrow: 'Community',
  name: 'Community',
  heroTitle: 'Where the next generation',
  heroHighlight: 'of business learns to move.',
  heroSub:
    'Sugar & Leather brings together coaches, founders, emerging entrepreneurs, and curious operators who believe business can be commercially capable, technologically aware, and deeply human.',
  heroActionNote:
    'A place to share knowledge. Build capability. Find better direction.',
  heroImage: a('/assets/photo-coaching-library.png'),
  primaryCta: {
    label: 'Explore Our Communities',
    href: '#our-communities',
  },
  knowledge: {
    eyebrow: 'Knowledge in motion',
    title: 'Good direction should not stay locked inside one room.',
    body: 'The strongest businesses are rarely built in isolation. They are shaped through better thinking, practical experience, honest conversation, and people willing to share what they have learned.',
    body2:
      'Our communities create space for that exchange. From experienced coaches sharing hard-won perspective, to founders learning how to build with greater clarity, each community plays a different role in a wider environment designed for what comes next.',
    image: a('/assets/photo-knowledge-motion.png'),
    reverse: false,
  },
  overview: {
    id: 'our-communities',
    eyebrow: 'Our communities',
    title: 'Different rooms. One shared direction.',
    intro:
      'Sugar & Leather brings together distinct communities for people at different points in their work. Each has its own purpose, audience, and rhythm. Together, they create an environment where knowledge is shared, capability is developed, and stronger business ideas can take shape.',
    items: [
      {
        title: 'Coaches Network',
        description:
          'For coaches and people looking for guidance. A place where experienced coaches can share their work, and people can find expertise that fits the challenge in front of them.',
        cta: {
          label: 'Explore the Coaches Network',
          href: 'https://sugarandleather.com/',
          external: true,
        },
        icon: 'Users',
      },
      {
        title: 'Next Level Business Society',
        description:
          'For people learning to build. A business learning community for founders, young entrepreneurs, learners, and future operators.',
        cta: {
          label: 'Join the Society',
          href: 'https://share.google/gzoANdFq5B0l4dmaB',
          external: true,
          lavenderBorder: true,
        },
        icon: 'GraduationCap',
      },
      {
        title: 'Angel Series',
        description:
          'For people ready to go further. A more personal layer of guidance for those moving beyond the first stage of learning.',
        cta: { label: 'Coming Soon', disabled: true },
        icon: 'Sparkles',
      },
    ],
  },
  programs: [
    {
      id: 'coaches-network',
      eyebrow: 'For coaches and learners',
      title: 'Coaches Network',
      body: 'The Coaches Network brings together coaches from different backgrounds, industries, and disciplines with people looking for clearer guidance.',
      body2:
        'For coaches, it is a place to present the work they have built, the experience behind it, and the perspective they bring to the people they support. For learners, founders, and operators, it is a place to discover coaches whose expertise is relevant to the challenge they are facing now.',
      body3:
        'The value is not simply access to more profiles. It is access to experience shaped through real work, long careers, tested thinking, and distinct points of view.',
      footnote:
        'Sugar & Leather provides the platform. Each coach remains responsible for their own programme, relationships, and delivery.',
      audiences: [
        {
          label: 'For Coaches',
          items: [
            'Create a clear profile for your coaching practice or programme',
            'Present your experience, expertise, and approach',
            'Help the right people understand the work you do',
            'Become part of a wider business and learning ecosystem',
          ],
        },
        {
          label: 'For People Seeking Guidance',
          items: [
            'Discover coaches across different disciplines and backgrounds',
            'Explore expertise relevant to your current challenge',
            'Learn more about each coach’s perspective and programme',
            'Find guidance that fits where you are trying to go',
          ],
        },
      ],
      cta: {
        label: 'Explore the Coaches Network',
        href: 'https://sugarandleather.com/',
        external: true,
      },
    },
    {
      id: 'next-level-society',
      eyebrow: 'For learners and builders',
      title: 'Next Level Business Society',
      body: 'The Next Level Business Society is a Skool-based learning community for founders, young entrepreneurs, learners, and people preparing to work in modern businesses.',
      body2:
        'It is designed for people who want more than surface-level business advice. People who want to understand how strong businesses are shaped, how technology can create real leverage, and how to build without losing the human judgment that makes good work matter.',
      body3: 'Inside the Society, learning stays close to the work.',
      bulletsLabel: 'Inside the Society',
      bullets: [
        'Live learning sessions',
        'Practical business roadmaps',
        'Guided programmes',
        'Ideas and perspectives from people doing the work',
        'A peer environment for people serious about building what comes next',
      ],
      cta: {
        label: 'Join the Next Level Business Society',
        href: 'https://share.google/gzoANdFq5B0l4dmaB',
        external: true,
        lavenderBorder: true,
      },
    },
    {
      id: 'angel-series',
      title: 'Angel Series',
      comingSoon: true,
      body: 'The Angel Series is being developed for people who want a more personal form of guidance as they move from learning into action.',
      body2:
        'It will sit closer to the individual journey, helping people think more clearly about what they are building, where they are heading, and what needs to happen next.',
      body3: 'More details will follow.',
      cta: {
        label: 'Register Your Interest',
        href: 'mailto:hello@sugarandleather.com',
      },
    },
  ],
  faqTitle: 'Community FAQs',
  faqSubtitle: 'A clearer view before you step in.',
  faq: [
    {
      question: 'What is the Sugar & Leather community?',
      answer:
        'The Sugar & Leather community is an ecosystem of spaces designed for coaches, founders, entrepreneurs, learners, and operators. It brings together practical business knowledge, shared learning, experienced guidance, and opportunities to connect with people building what comes next.',
    },
    {
      question: 'What is the Coaches Network?',
      answer:
        'The Coaches Network is a platform where coaches can present their expertise, programmes, and professional perspective. It also helps founders, learners, and operators discover coaches whose experience may be relevant to the challenge they are working through.',
    },
    {
      question: 'Who can join the Coaches Network as a coach?',
      answer:
        'The network is designed for coaches with an established programme, practice, or area of expertise. It is open to people who want to make their work easier for the right audience to discover.',
    },
    {
      question: 'Can I use the Coaches Network if I am looking for guidance?',
      answer:
        'Yes. The Coaches Network is for people looking to discover experienced coaches across different disciplines, industries, and areas of business expertise.',
    },
    {
      question: 'What is the Next Level Business Society?',
      answer:
        'The Next Level Business Society is a Skool-based business learning community created by the Sugar & Leather leadership team. It is for founders, young entrepreneurs, learners, and future operators who want practical insight into how modern businesses are built and run.',
    },
    {
      question: 'What can I expect inside the Next Level Business Society?',
      answer:
        'The Society includes live learning sessions, practical roadmaps, guided programmes, business ideas, and a peer environment for people developing real capability.',
    },
    {
      question: 'Is the Next Level Business Society only for founders?',
      answer:
        'No. It is for founders, young entrepreneurs, learners, aspiring operators, and anyone interested in building or working within the next generation of businesses.',
    },
    {
      question: 'What is the Angel Series?',
      answer:
        'The Angel Series is a forthcoming Sugar & Leather initiative for people seeking a more personal layer of guidance beyond the wider learning community. Further details will be shared when it is ready.',
    },
    {
      question: 'How do I know which community is right for me?',
      answer:
        'If you are a coach or looking for a coach, begin with the Coaches Network. If you want practical business learning, live sessions, and a peer environment, explore the Next Level Business Society. If you are looking for more personal guidance, register your interest in the Angel Series.',
    },
  ],
  cta: {
    title: 'Stay close to what is next.',
    highlight: 'Some opportunities begin with a better conversation.',
    sub: 'Whether you want to share your expertise, develop your business capability, find the right guidance, or explore how Sugar & Leather can support your next move, start by telling us what you are working towards.',
    primaryLabel: 'Start a Conversation',
    primaryHref: 'mailto:hello@sugarandleather.com',
    secondaryLabel: 'Explore the ecosystem',
    secondaryHref: '/#ecosystem',
  },
};
