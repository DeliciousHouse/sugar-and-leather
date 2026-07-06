import { asset as a } from '../lib/asset';
import { CAL_BOOKING_URL } from '../lib/links';

const MAIL = 'mailto:contact@sugarandleather.com';

export const CAPITAL_ACCESS = {
  slug: 'capital-access',
  eyebrow: 'Grant Writing & Funding Strategy',
  name: 'Capital Access & Grant Services',
  heroTitle: 'Turn a funding opportunity',
  heroHighlight: 'into a fundable case.',
  heroSub:
    'We help organizations pursue grants with a stronger strategy, clearer narrative, credible budget, and the operational readiness funders expect.',
  heroImage: a('/assets/ca-hero.webp'),
  heroActionNote: 'Grant Strategy · Grant Writing · Funding Readiness',
  primaryCta: { label: 'Book a Complimentary Fit Call', href: CAL_BOOKING_URL },
  secondaryCta: { label: 'See How Grant Support Works', href: '#grant-support' },
  foundation: {
    eyebrow: 'Before the application is written',
    title: 'A strong grant starts with more than strong writing.',
    body: 'Funders are not only evaluating the idea. They are evaluating whether your organization can deliver the work, manage the funds, and create the outcomes promised in the proposal.',
    body2: 'We help you build that case before submission.',
    image: a('/assets/ca-foundation.webp'),
    items: [
      {
        title: 'The Right Opportunity',
        description:
          'We help assess whether a grant fits your mission, eligibility, capacity, and funding goals before you invest in an application.',
      },
      {
        title: 'The Stronger Story',
        description:
          'We turn your work into a clear, persuasive narrative that connects the problem, solution, outcomes, and use of funds.',
      },
      {
        title: 'The Credible Plan',
        description:
          'We help strengthen the budget, delivery plan, supporting documents, and operational story behind the proposal.',
      },
    ],
  },
  grantSupport: {
    id: 'grant-support',
    eyebrow: 'Grant support built around the opportunity',
    title: 'Support for the work that happens before, during, and after submission.',
    cta: { label: 'Discuss Your Funding Goals', href: CAL_BOOKING_URL },
    items: [
      {
        title: 'Grant Strategy',
        subtitle: 'For organizations that need clarity before they apply.',
        services: [
          'Opportunity research and qualification',
          'Funding roadmap and grant calendar',
          'Grant-readiness assessment',
          'Application strategy',
          'Go / no-go decision support',
        ],
      },
      {
        title: 'Grant Proposal Development',
        subtitle: 'For organizations pursuing a specific grant opportunity.',
        services: [
          'Proposal narrative and project framing',
          'Budget narrative and supporting documentation',
          'Application responses and attachments',
          'Stakeholder coordination',
          'Submission-ready review',
        ],
      },
      {
        title: 'Funding Readiness',
        subtitle: 'For organizations that need to strengthen the foundation behind the ask.',
        services: [
          'Program and impact framing',
          'Operating and delivery plans',
          'Financial readiness',
          'Measurement and reporting approach',
          'Leadership and capacity narrative',
        ],
      },
    ],
  },
  process: {
    eyebrow: 'Our process',
    title: 'Clear decisions before major investment.',
    steps: [
      {
        num: '01',
        title: 'Complimentary Fit Call',
        description:
          'We start with a short conversation to understand your funding goal, current opportunity, timeline, and readiness.',
        cta: { label: 'Book a Fit Call', href: CAL_BOOKING_URL },
      },
      {
        num: '02',
        title: 'Grant Readiness Review',
        description:
          'For qualified organizations, we assess the opportunity, your eligibility, the materials available, and the work required to submit a credible application. You receive a clear recommendation: pursue, prepare first, or redirect to a stronger opportunity.',
      },
      {
        num: '03',
        title: 'Fixed-Scope Proposal Plan',
        description:
          'If the opportunity is a fit, we define the proposal scope, deliverables, timeline, responsibilities, and fixed project fee. No vague retainers. No unclear scope. No percentage of grant funds.',
      },
      {
        num: '04',
        title: 'Build and Submit',
        description:
          'We work with your team to develop the strategy, narrative, budget support, and submission materials required for the opportunity.',
      },
    ],
  },
  pricing: {
    eyebrow: 'Pricing',
    title: 'Start with clarity. Scope the work properly.',
    intro:
      'Grant applications vary widely in complexity. Instead of publishing a broad proposal-price range, we begin with a defined advisory engagement that tells you whether the opportunity is worth pursuing and what a successful application will require.',
    plans: [
      {
        title: 'Complimentary Fit Call',
        price: 'No cost',
        description:
          'A focused introductory conversation to understand your organization, funding goals, current opportunity, and likely next step.',
        includes: [
          'Initial funding-goal discussion',
          'High-level opportunity review',
          'Fit and readiness conversation',
          'Recommended next step',
        ],
        cta: { label: 'Book a Fit Call', href: CAL_BOOKING_URL },
      },
      {
        title: 'Grant Readiness Review',
        price: '$250 per hour',
        description:
          'A focused working session for organizations that need expert guidance before investing in a full proposal.',
        includesLabel: 'Best for:',
        includes: [
          'Reviewing a live grant opportunity',
          'Assessing eligibility and competitiveness',
          'Identifying gaps in the application',
          'Clarifying the funding strategy',
          'Determining proposal scope and priorities',
        ],
        cta: { label: 'Request a Readiness Review', href: MAIL },
      },
      {
        title: 'Proposal Development',
        price: 'Fixed project fee after review',
        description:
          'Every proposal is scoped after the Grant Readiness Review. Your proposal plan is priced based on the actual work required—not a generic package.',
        includesLabel: 'Scope considers:',
        includes: [
          'Funder and application requirements',
          'Narrative length and technical depth',
          'Budget development needs',
          'Research and supporting documentation',
          'Number of stakeholders involved',
          'Submission timeline',
        ],
        cta: { label: 'Discuss Proposal Development', href: MAIL },
      },
    ],
  },
  deliverables: {
    eyebrow: 'What you receive',
    title: 'A grant application built to stand up to review.',
    body: 'The exact deliverables depend on the opportunity. A typical proposal engagement may include:',
    body2:
      'We do not promise awards. We help you present the strongest credible case for the opportunity.',
    image: a('/assets/ca-deliverables.webp'),
    bullets: [
      'Grant strategy and application plan',
      'Core proposal narrative',
      'Project goals, outcomes, and measurement plan',
      'Budget narrative support',
      'Required attachments and supporting materials',
      'Internal review coordination',
      'Submission-ready final files',
    ],
  },
  beyond: {
    eyebrow: 'Beyond grant writing',
    title: 'When the application reveals a larger readiness gap.',
    body: 'Some organizations need more than a proposal. They need a stronger operating, financial, or growth story before they can pursue funding credibly.',
    body2:
      'Where needed, we provide strategic support across financial planning and budget readiness, operating plans and delivery structure, impact measurement and reporting, market positioning and partnership strategy, and investor preparation for organizations pursuing equity capital. For businesses exploring debt financing, we can also provide limited preparation support for SBA-backed loan applications as part of a broader capital-readiness engagement.',
    image: a('/assets/ca-beyond.webp'),
    cta: { label: 'Discuss Your Capital Needs', href: MAIL, variant: 'outline' },
  },
  whoWeSupport: {
    eyebrow: 'Who we support',
    title: 'Built for organizations doing work worth funding.',
    intro:
      'We support organizations across sectors where public, private, philanthropic, and mission-aligned funding can accelerate meaningful growth.',
    items: [
      'Nonprofits and social impact organizations',
      'Education and workforce development',
      'Healthcare and public health',
      'Community development',
      'Technology and innovation',
      'Artificial intelligence',
      'Climate and clean energy',
      'Manufacturing and supply chain',
      'Government and public-sector initiatives',
      'Financial services',
      'Real estate and infrastructure',
      'Professional services',
      'International development',
    ],
  },
  faq: [
    {
      question: 'What is included in the complimentary fit call?',
      answer:
        'The fit call is a short introductory conversation about your organization, funding goals, current opportunity, timeline, and readiness. It helps determine whether a Grant Readiness Review or another next step makes sense.',
    },
    {
      question: 'What is a Grant Readiness Review?',
      answer:
        'A Grant Readiness Review is a paid advisory engagement where we assess a live opportunity, your eligibility, existing materials, capacity, and the work required to submit a credible application.',
    },
    {
      question: 'How much does grant writing cost?',
      answer:
        'Proposal development is priced as a fixed project fee after the Grant Readiness Review. The fee depends on the funder’s requirements, the depth of writing and research required, budget needs, documentation, stakeholder coordination, and timeline.',
    },
    {
      question: 'Why is proposal development not listed as one fixed price?',
      answer:
        'A short foundation application and a complex government or multi-partner proposal require very different levels of work. A fixed price without reviewing the opportunity either creates hidden scope or leads to weak delivery. We scope the work first so the fee is clear and tied to the actual requirements.',
    },
    {
      question: 'Do you charge a percentage of grant funds awarded?',
      answer:
        'Not as a standard practice. We typically work through hourly advisory or fixed-fee project engagements. For larger initiatives where our role extends beyond grant writing into operational planning, delivery structure, financial readiness, and ongoing strategic support, we may consider a custom award-sharing arrangement. Any such agreement is discussed upfront, and structured around the full scope of work.',
    },
    {
      question: 'Do you guarantee grant funding?',
      answer:
        'No. Grant decisions are made by funders. We do not guarantee awards. We help clients assess opportunities, strengthen readiness, and submit a credible, well-prepared application.',
    },
    {
      question: 'Can you help us find grants?',
      answer:
        'Yes. We can help identify aligned opportunities, assess fit, prioritize the strongest options, and create a funding roadmap. We focus on grants that match your mission, eligibility, capacity, and goals.',
    },
    {
      question: 'Can you help us if we have never applied for a grant before?',
      answer:
        'Yes. We work with first-time applicants and experienced organizations. If you are early in the process, we begin by identifying what needs to be in place before you pursue an application.',
    },
    {
      question: 'Do you work with for-profit companies?',
      answer:
        'Yes, where the grant opportunity allows for-profit applicants. We also support mission-driven companies, startups, nonprofits, and organizations pursuing public or private funding.',
    },
    {
      question: 'Do you work with nonprofits?',
      answer:
        'Yes. We support nonprofits with grant strategy, proposal development, budgets, funding readiness, operating plans, and post-award preparation.',
    },
    {
      question: 'Do you work internationally?',
      answer:
        'Most grant work is focused on U.S. opportunities. We may support international initiatives where there is a clear strategic fit and a viable funding pathway.',
    },
    {
      question: 'What should we bring to the fit call?',
      answer:
        'Bring the grant opportunity, if you have one, along with any existing materials such as a program description, budget, business plan, prior applications, financial information, or a clear explanation of what you are trying to fund.',
    },
  ],
  cta: {
    title: 'Before you write the application,',
    highlight: 'make sure you are pursuing the right opportunity.',
    sub: 'Book a complimentary fit call to clarify your funding path and determine the strongest next step.',
    primaryLabel: 'Book a Complimentary Fit Call',
    primaryHref: CAL_BOOKING_URL,
    secondaryLabel: 'Discuss a Grant Opportunity',
    secondaryHref: MAIL,
  },
};
