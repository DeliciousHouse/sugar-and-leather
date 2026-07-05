import { asset as a } from '../lib/asset';
import { CAL_BOOKING_URL } from '../lib/links';

export const POD_SLUGS = ['marketing-pod', 'sales-pod', 'development-pod', 'recruitment-pod'];

export const POD_PAGES = {
  'marketing-pod': {
    slug: 'marketing-pod',
    parentSlug: 'strategic-partnerships',
    parentLabel: 'Strategic Partnerships',
    eyebrow: 'Strategic Partnership · Marketing Pod',
    name: 'Marketing Pod',
    heroTitle: 'Build a marketing engine',
    heroHighlight: 'that grows with your business.',
    heroSub:
      "Marketing isn't about volume. It's a system that attracts and converts.\nOur Pod pairs executive leadership with specialists built to scale.\nGrow a marketing function, not just a list of campaigns.",
    heroImage: a('/assets/pod-marketing-hero.webp'),
    sections: [
      {
        id: 'challenge',
        eyebrow: 'The challenge',
        title: 'Disconnected marketing rarely drives outcomes',
        body: 'Many businesses invest heavily in marketing but struggle to see consistent results because every function operates independently. Marketing works when every activity supports the same business objective. Our Marketing Pod brings those moving pieces together into one cohesive growth engine.',
        bullets: [
          "Content isn't aligned with sales",
          "SEO isn't connected to customer intent",
          'Paid advertising drives traffic but not qualified opportunities',
          'Social media creates awareness without engagement',
          'Email marketing lacks a nurturing strategy',
        ],
        image: a('/assets/pod-marketing-challenge.webp'),
        reverse: false,
      },
      {
        id: 'partnership',
        eyebrow: 'Why a strategic partnership',
        title: 'More than an agency. A partner at the table.',
        body: "Unlike a traditional agency, we don't simply execute marketing tasks. We become a strategic partner that works alongside your leadership team, helping define priorities, establish systems, provide specialist expertise, and continuously improve performance as your business grows.",
        image: a('/assets/pod-marketing-partnership.webp'),
        reverse: true,
      },
      {
        id: 'model',
        eyebrow: 'Why this model works',
        title: 'One team. One outcome.',
        body: "Businesses don't need more disconnected vendors. They need one team working toward a shared outcome. Our Marketing Pod combines leadership, strategy, execution, and technology into one integrated capability, reducing complexity while improving consistency and performance.",
        image: a('/assets/pod-marketing-model.webp'),
        reverse: false,
      },
    ],
    expertise: {
      eyebrow: 'Capabilities',
      title: 'Marketing leadership, backed by specialists',
      intro:
        'Every engagement is led by experienced marketing leadership and supported by specialists across multiple disciplines. Depending on your goals, your Marketing Pod may include expertise in:',
      items: [
        'Marketing Strategy & Positioning',
        'Brand Strategy & Messaging',
        'Website & Landing Page Content',
        'SEO & Organic Growth',
        'Paid Search & Paid Social Advertising',
        'Performance Marketing',
        'Email Marketing & Marketing Automation',
        'CRM & Lifecycle Marketing',
        'Sales Funnel Strategy & Conversion Optimisation',
        'Social Media Strategy & Management',
        'Content Marketing',
        'Video Production',
        'Podcast & Audio Production',
        'Graphic Design & Creative Assets',
        'Motion Graphics & Short-form Video',
        'Thought Leadership Content',
        'Community Building & Engagement',
        'Analytics & Reporting',
        'Marketing Operations & AI-enabled Workflows',
        'Additional expertise aligned to your objectives',
      ],
    },
    process: {
      eyebrow: 'How we work',
      title: 'From discovery to scalable growth',
      steps: [
        {
          num: '01',
          title: 'Discover',
          description: 'Understand your business, market, and growth objectives.',
        },
        {
          num: '02',
          title: 'Strategize',
          description: 'Develop a marketing roadmap aligned with business goals.',
        },
        {
          num: '03',
          title: 'Build',
          description: 'Assemble the right specialists for your engagement.',
        },
        {
          num: '04',
          title: 'Execute',
          description: 'Deliver campaigns, content, and systems alongside your team.',
        },
        {
          num: '05',
          title: 'Optimise',
          description: 'Measure performance, refine strategy, and improve continuously.',
        },
        {
          num: '06',
          title: 'Scale',
          description: 'Build repeatable marketing capabilities that grow with your business.',
        },
      ],
    },
    faq: [
      {
        question: 'Do I get access to the full Marketing Pod?',
        answer:
          'Every engagement is tailored. You gain access to the expertise required for your business objectives, not a one-size-fits-all roster.',
      },
      {
        question: 'Can you work alongside our existing team?',
        answer:
          'Yes. We frequently support internal marketing teams with strategic leadership and specialist execution.',
      },
      {
        question: 'Do you only work on digital marketing?',
        answer:
          'No. We support the broader marketing function, from strategy and brand to campaigns, operations, and community growth.',
      },
      {
        question: 'How do you use AI?',
        answer:
          'We use AI to improve speed, insights, and efficiency while ensuring every decision remains guided by human expertise.',
      },
    ],
    cta: {
      title: 'Build marketing that creates',
      highlight: 'sustainable growth',
      sub: 'Not just activity. Book a strategy call and discover how the Marketing Pod can support your next stage of growth.',
      primaryLabel: 'Book a Strategy Call',
      primaryHref: CAL_BOOKING_URL,
      secondaryLabel: 'Strategic Partnerships',
      secondaryHref: '/strategic-partnerships',
    },
  },
  'sales-pod': {
    slug: 'sales-pod',
    parentSlug: 'strategic-partnerships',
    parentLabel: 'Strategic Partnerships',
    pageClass: 'pod-page--sales',
    eyebrow: 'Strategic Partnership · Sales Pod',
    name: 'Sales Pod',
    heroTitle: 'Build a sales system',
    heroHighlight: 'that carries growth.',
    heroSub:
      'Revenue should not depend on one founder, one salesperson, or one good month. The Sales Pod brings commercial direction, experienced leadership, and specialist execution into one focused partnership.',
    heroPrimaryLabel: 'Book a Commercial Strategy Call',
    heroPrimaryHref: 'mailto:hello@sugarandleather.com',
    heroImage: a('/assets/pod-sales-hero.webp'),
    sections: [
      {
        id: 'challenge',
        eyebrow: 'When sales feels unpredictable',
        title: 'The Problem',
        body: 'Many businesses are working hard to sell, but the commercial engine is not working as one. The founder is still carrying the biggest conversations, pipeline looks full but deals do not move, and follow-up becomes inconsistent. The issue is rarely effort. It is usually a lack of commercial structure.',
        bullets: [
          'Founder-led revenue remains a bottleneck',
          'Pipeline exists but conversion stalls',
          'Marketing attention does not become sales outcomes',
          'CRM visibility is incomplete or misleading',
          'Commercial rhythm is inconsistent across the team',
        ],
        image: a('/assets/pod-sales-challenge.webp'),
        reverse: false,
      },
      {
        id: 'partnership',
        eyebrow: 'A strategic partnership',
        title: 'The Sales Pod',
        body: 'A strong sales function connects strategy, messaging, people, process, data, and discipline. Our Sales Pod works alongside your leadership team to understand what is holding revenue back, then brings in the right expertise to strengthen the full commercial system. We do not arrive with a fixed playbook. We start with the business in front of us.',
        image: a('/assets/pod-sales-partnership.webp'),
        reverse: true,
      },
      {
        id: 'model',
        eyebrow: 'Sales does not operate alone',
        title: 'Built Into a Wider Ecosystem',
        body: 'Sales performs better when the wider business is aligned. Marketing strengthens demand and positioning. Recruitment helps build the right commercial team. Engineering supports systems and automation. Innovation and technology create leverage, and capital access supports the next stage of growth. The Sales Pod sits inside a wider Sugar & Leather ecosystem designed for meaningful progress.',
        image: a('/assets/pod-sales-ecosystem.webp'),
        reverse: false,
      },
    ],
    services: {
      eyebrow: 'What we build',
      title: 'Clarity, structure, pipeline, conversion, and operations',
      intro:
        'Each engagement blends commercial leadership with specialist execution. We strengthen the full sales system through five connected areas:',
      items: [
        {
          title: 'Commercial Direction',
          description:
            'Revenue strategy and go-to-market planning, ICP definition, segmentation, offer and pricing input, and sharper messaging so the right buyer hears the right message at the right time.',
        },
        {
          title: 'Sales Foundation',
          description:
            'Pipeline stage design, qualification frameworks, discovery structure, objection handling, playbooks, follow-up systems, and closing handovers your team can trust.',
        },
        {
          title: 'Pipeline Creation',
          description:
            'Target account and prospect strategy, outbound channels, referral and partnership-led motions, and qualification systems that create relevant conversations.',
        },
        {
          title: 'Conversion and Deal Support',
          description:
            'Sales conversation support, demo and proposal strategy, deal reviews, negotiation support, follow-up sequencing, and closing process support.',
        },
        {
          title: 'Sales Operation',
          description:
            'CRM optimisation, dashboards, forecasting, automation, AI-enabled research and workflows, management cadence, team enablement, and support for sales hiring.',
        },
      ],
    },
    process: {
      eyebrow: 'The partnership journey',
      title: 'How We Work',
      steps: [
        {
          num: '01',
          title: 'Diagnose',
          description:
            'Review your market, offer, sales motion, pipeline, team, and the core commercial constraints slowing growth.',
        },
        {
          num: '02',
          title: 'Clarify',
          description:
            'Define ideal buyers, sharpen messaging, and identify the priorities that create the strongest leverage.',
        },
        {
          num: '03',
          title: 'Build',
          description:
            'Establish process, tools, playbooks, reporting, and specialist support required to execute with confidence.',
        },
        {
          num: '04',
          title: 'Activate',
          description:
            'Support outreach, sales conversations, deal progression, and the commercial rhythm that keeps pipeline moving.',
        },
        {
          num: '05',
          title: 'Strengthen',
          description:
            'Improve performance over time while building lasting commercial capability inside your business.',
        },
      ],
    },
    whoThisIsFor: {
      eyebrow: 'Built for the next stage',
      title: 'Who This Is For',
      body: 'Best suited for businesses ready to stop relying on chance and build a repeatable commercial system.',
      bullets: [
        'Rely heavily on the founder to win business',
        'Have inconsistent pipeline or conversion',
        'Need clearer commercial direction',
        'Are preparing to enter a new market',
        'Need structure before expanding the sales team',
        'Have a sales team but lack process, leadership, or visibility',
        'Want to use AI to improve sales without losing the human relationship',
      ],
      image: a('/assets/pod-sales-who.webp'),
      reverse: true,
    },
    faqTitle: 'Questions about the Sales Pod',
    faq: [
      {
        question: 'What is the Sales Pod?',
        answer:
          'The Sales Pod is a strategic partnership that combines commercial leadership with the specialist expertise needed to build and improve your sales function.',
      },
      {
        question: 'Is this outsourced sales?',
        answer:
          'No. We work alongside your business to strengthen the commercial system, build internal capability, and support the areas where you need the most leverage.',
      },
      {
        question: 'Can you work with our existing sales team?',
        answer:
          'Yes. We support existing teams with strategy, process, leadership, specialist execution, training, and sales operations.',
      },
      {
        question: 'Do you provide outbound prospecting?',
        answer:
          'Yes, when it is part of the right commercial strategy. Outreach is never treated as a standalone activity.',
      },
      {
        question: 'Can you help us hire salespeople?',
        answer:
          'Yes. Through the wider Strategic Partnership model, we support commercial hiring and help define the roles your business actually needs.',
      },
      {
        question: 'How do you use AI in sales?',
        answer:
          'We use AI to improve research, preparation, workflow, reporting, and efficiency while keeping human judgment central to customer relationships and commercial decisions.',
      },
      {
        question: 'Do we need every Sugar & Leather pillar?',
        answer:
          'No. Every engagement starts with your business needs, then brings in only the capabilities that create meaningful progress.',
      },
    ],
    cta: {
      title: 'Find the blocker.',
      highlight: 'Build what comes next.',
      sub: 'The first step is understanding what is holding your commercial growth back.',
      primaryLabel: 'Book a Commercial Strategy Call',
      primaryHref: 'mailto:hello@sugarandleather.com',
      secondaryLabel: 'Strategic Partnerships',
      secondaryHref: '/strategic-partnerships',
    },
  },
  'development-pod': {
    slug: 'development-pod',
    parentSlug: 'strategic-partnerships',
    parentLabel: 'Strategic Partnerships',
    pageClass: 'pod-page--development',
    eyebrow: 'Strategic Partnership · Development Pod',
    name: 'Development Pod',
    heroTitle: 'Build technology',
    heroHighlight: 'that makes the business work better.',
    heroSub:
      'The right technology does not add complexity. It removes friction, improves visibility, and gives people more room to focus on work that matters. We help businesses define, build, and improve the systems, products, and workflows that support their next stage.',
    heroPrimaryLabel: 'Book a Technology Strategy Call',
    heroPrimaryHref: 'mailto:hello@sugarandleather.com',
    heroImage: a('/assets/pod-development-hero.webp'),
    sections: [
      {
        id: 'challenge',
        eyebrow: 'When technology adds more work',
        title: 'The Problem',
        body: 'Many businesses operate through a growing mix of spreadsheets, disconnected software, manual workarounds, and systems that were never designed to work together. The problem is rarely a lack of technology. It is a lack of direction around what technology should solve, what should be connected, and what should be built.',
        bullets: [
          'More tools do not always mean better systems',
          'Spreadsheets and software sit disconnected from each other',
          'Manual workarounds hide gaps in how work should flow',
          'Teams spend time managing tools instead of improving outcomes',
          'Investment happens without clarity on what to solve',
        ],
        image: a('/assets/pod-development-challenge.webp'),
        reverse: false,
      },
      {
        id: 'partnership',
        eyebrow: 'A technology and product partnership',
        title: 'The Development Pod',
        body: 'The Development Pod works alongside leadership teams to turn business problems, customer needs, and growth priorities into useful digital systems. We help define what is worth building, decide whether existing tools can do the job, and create technology that supports the wider operating model. This is not development for development’s sake. It is focused technical capability designed around the work your business needs to do next.',
        image: a('/assets/pod-development-partnership.webp'),
        reverse: true,
      },
      {
        id: 'model',
        eyebrow: 'Technology does not operate in isolation',
        title: 'Built Into a Wider Ecosystem',
        body: 'Technology decisions affect every part of the organisation. A sales team needs systems that make pipeline activity visible. A marketing team needs connected data and useful automation. A recruitment process needs clear workflows. Leadership needs better information to make stronger decisions. Where needed, the Development Pod works alongside the wider Sugar & Leather ecosystem to ensure technology supports business direction, rather than becoming another disconnected initiative.',
        image: a('/assets/pod-development-ecosystem.webp'),
        reverse: false,
      },
    ],
    services: {
      eyebrow: 'What we build',
      title: 'Direction, products, systems, AI, and delivery',
      intro:
        'Each engagement blends technology leadership with specialist execution. We strengthen the full technology capability through five connected areas:',
      items: [
        {
          title: 'Technology and Product Direction',
          description:
            'The first question is not what to build. It is what problem is worth solving. The goal is to create clarity before time, money, and attention are committed to the wrong build.',
          bullets: [
            'Technology strategy',
            'Product discovery',
            'Problem definition',
            'User and workflow research',
            'Requirements gathering',
            'Technical feasibility',
            'Build-versus-buy decisions',
            'Platform and tool selection',
            'Product roadmaps',
            'Scope and prioritisation',
            'Technical architecture input',
          ],
        },
        {
          title: 'Digital Products and Platforms',
          description:
            'Technology should make the business easier to run and easier to engage with. The objective is not to build more features — it is to build the right experience for the people using it.',
          bullets: [
            'Websites and web applications',
            'Customer portals',
            'Internal platforms',
            'SaaS products',
            'Marketplaces',
            'Member platforms',
            'Dashboards',
            'Mobile-responsive applications',
            'Minimum viable products',
            'Product redesigns',
          ],
        },
        {
          title: 'Business Systems and Automation',
          description:
            'The strongest systems reduce friction behind the scenes. The best systems do not demand more attention — they give it back.',
          bullets: [
            'Workflow automation',
            'CRM and system integrations',
            'Data flows',
            'Operational dashboards',
            'Internal tools',
            'Process redesign',
            'No-code and low-code systems',
            'AI-enabled workflows',
            'Reporting systems',
            'Document and approval workflows',
          ],
        },
        {
          title: 'AI and Intelligent Systems',
          description:
            'AI should strengthen judgment, not replace it. The aim is not to introduce AI everywhere — it is to use it where it makes the work meaningfully better.',
          bullets: [
            'AI opportunity assessment',
            'AI workflow design',
            'AI assistants',
            'Knowledge systems',
            'Intelligent automation',
            'AI-enabled customer experiences',
            'Internal AI tools',
            'AI product strategy',
            'Data and governance considerations',
          ],
        },
        {
          title: 'Build, Launch, and Improve',
          description:
            'Delivery is only the beginning. The aim is to create technology that can be understood, used, improved, and carried forward by the business.',
          bullets: [
            'Technical project management',
            'Prototyping',
            'Quality assurance',
            'Launch planning',
            'Documentation',
            'Team training',
            'Technical handover',
            'Maintenance planning',
            'Product iteration',
            'Performance review',
          ],
        },
      ],
    },
    process: {
      eyebrow: 'A clearer way to build',
      title: 'How We Work',
      steps: [
        {
          num: '01',
          title: 'Understand',
          description:
            'Review the business problem, users, workflows, existing systems, and technical constraints.',
        },
        {
          num: '02',
          title: 'Define',
          description:
            'Clarify the opportunity, scope, priorities, technical approach, and expected outcome.',
        },
        {
          num: '03',
          title: 'Design',
          description:
            'Shape the product, system, workflow, or prototype before major development begins.',
        },
        {
          num: '04',
          title: 'Build',
          description:
            'Deliver the right technical capability through focused development and regular review.',
        },
        {
          num: '05',
          title: 'Strengthen',
          description:
            'Improve adoption, performance, documentation, and the next layer of capability.',
        },
      ],
    },
    whoThisIsFor: {
      eyebrow: 'Built for businesses ready to work better',
      title: 'Who This Is For',
      body: 'The Development Pod is designed for businesses ready to improve how work gets done through clearer technology direction and stronger systems.',
      bullets: [
        'Founder-led businesses with a product, platform, or system idea',
        'Teams relying on manual processes and disconnected tools',
        'Businesses that need technology direction before investing in development',
        'Companies building a new digital product or customer experience',
        'Organisations looking to automate repetitive work',
        'Teams that need stronger data visibility and operational systems',
        'Businesses exploring practical uses of AI',
        'Companies that need technical capability without building a large internal team',
      ],
      image: a('/assets/pod-development-who.webp'),
      reverse: true,
    },
    faqTitle: 'Development Pod FAQs',
    faq: [
      {
        question: 'Is the Development Pod a software development agency?',
        answer:
          'The Development Pod is a strategic technology and product partnership. It can support development delivery, but the work begins by understanding the business problem, defining the right solution, and making sure technology supports the wider business direction.',
      },
      {
        question: 'Can you help if we are not sure what we need to build?',
        answer:
          'Yes. Many businesses need clarity before they need development. We can help assess the problem, review existing systems, explore options, and determine whether the answer is a new build, an integration, automation, or a better use of existing tools.',
      },
      {
        question: 'Do you only build custom software?',
        answer:
          'No. Custom development is one option. Depending on the need, the right solution may involve existing platforms, no-code or low-code tools, integrations, automation, or a combination of approaches.',
      },
      {
        question: 'Can you help with websites and web applications?',
        answer:
          'Yes. The Development Pod can support websites, web applications, customer portals, internal platforms, member platforms, dashboards, and other digital products.',
      },
      {
        question: 'Can you help us use AI in our business?',
        answer:
          'Yes. We help businesses identify practical AI opportunities, design AI-enabled workflows, build internal tools and assistants, and consider the right level of data governance and human oversight.',
      },
      {
        question: 'Can you work with our existing development team or technology partner?',
        answer:
          'Yes. The Development Pod can work alongside internal teams, existing developers, agencies, and technology partners to improve direction, delivery, and alignment around the work.',
      },
      {
        question: 'What happens after a product or system launches?',
        answer:
          'Where needed, we can support testing, adoption, documentation, training, maintenance planning, performance review, and future product improvements.',
      },
      {
        question: 'Do you guarantee that a technology project will succeed?',
        answer:
          'No. Technology outcomes depend on the clarity of the problem, user adoption, technical constraints, business ownership, and ongoing improvement. Our role is to reduce uncertainty, create a stronger delivery process, and build capability that is useful in practice.',
      },
    ],
    cta: {
      title: 'Build what makes the next stage possible.',
      highlight: 'The right technology creates room to move.',
      sub: 'If you are considering a product, system, automation, or AI initiative, start with a conversation about the problem behind it.',
      primaryLabel: 'Start a Technology Conversation',
      primaryHref: 'mailto:hello@sugarandleather.com',
      secondaryLabel: 'Strategic Partnerships',
      secondaryHref: '/strategic-partnerships',
    },
  },
  'recruitment-pod': {
    slug: 'recruitment-pod',
    parentSlug: 'strategic-partnerships',
    parentLabel: 'Strategic Partnerships',
    pageClass: 'pod-page--recruitment',
    eyebrow: 'Strategic Partnership · Recruitment Pod',
    name: 'Recruitment Pod',
    heroTitle: 'Build the team',
    heroHighlight: 'your next stage demands.',
    heroSub:
      'The right hire is not simply a person with the right experience. It is someone whose capability, judgment, and way of working can move the business forward. We help teams define the roles that matter, attract the right people, and build a stronger foundation.',
    heroPrimaryLabel: 'Book a Talent Strategy Call',
    heroPrimaryHref: 'mailto:hello@sugarandleather.com',
    heroImage: a('/assets/pod-recruitment-hero.webp'),
    sections: [
      {
        id: 'challenge',
        eyebrow: 'When hiring becomes reactive',
        title: 'The Problem',
        body: 'Businesses often begin hiring when pressure has already built. A founder is carrying too much, a team has outgrown its structure, or a critical capability is missing — but no one has clearly defined what success in the role should look like. The result is long hiring cycles, misaligned candidates, and good people placed into poorly designed roles.',
        bullets: [
          'Hiring begins under pressure rather than with clarity',
          'Founders and leaders are carrying too much',
          'Critical capability gaps are undefined',
          'Job descriptions exist without clear success measures',
          'Strong candidates are placed into poorly designed roles',
        ],
        image: a('/assets/pod-recruitment-challenge.webp'),
        reverse: false,
      },
      {
        id: 'partnership',
        eyebrow: 'A strategic talent partnership',
        title: 'The Recruitment Pod',
        body: 'The Recruitment Pod works alongside leadership teams to understand the work ahead, define the people required to carry it, and create a stronger hiring system around that need. This is not a CV-forwarding service. We help businesses make better talent decisions, from whether to hire through to how a new person becomes effective inside the team.',
        image: a('/assets/pod-recruitment-partnership.webp'),
        reverse: true,
      },
      {
        id: 'model',
        eyebrow: 'Talent does not operate in isolation',
        title: 'Built Into a Wider Ecosystem',
        body: 'Recruitment connects to every part of a business. A sales hire needs a clear commercial system. A marketing leader needs a defined brand and growth direction. An engineering team needs the right technology priorities. A founder needs a structure that does not depend on one person carrying everything. Where needed, the Recruitment Pod works alongside the wider Sugar & Leather ecosystem to ensure talent decisions support the broader business direction.',
        image: a('/assets/pod-recruitment-ecosystem.webp'),
        reverse: false,
      },
    ],
    services: {
      eyebrow: 'What we build',
      title: 'Direction, positioning, search, selection, and integration',
      intro:
        'Each engagement blends talent leadership with specialist execution. We strengthen the full hiring system through five connected areas:',
      items: [
        {
          title: 'Workforce Direction',
          description:
            'Before searching for people, define the work. The goal is simple: make sure the business is hiring for the work that matters, not simply responding to the pressure of the moment.',
          bullets: [
            'Hiring priorities',
            'Team and organisational structure',
            'Role purpose and ownership',
            'Outcomes and success measures',
            'Job scorecards',
            'Headcount planning',
            'Market and compensation input',
            'Permanent, fractional, contract, or specialist hiring needs',
          ],
        },
        {
          title: 'Role and Employer Positioning',
          description:
            'Strong candidates evaluate the business, the leadership, and the opportunity — not just the role. The aim is not to make every role sound bigger than it is. It is to make the right opportunity clear to the right person.',
          bullets: [
            'Clear role narratives',
            'Job descriptions that explain the work, not just the requirements',
            'Candidate messaging',
            'Employer positioning',
            'Hiring-page and application experience',
            'Outreach communication',
            'Interview communication and candidate journey design',
          ],
        },
        {
          title: 'Talent Search and Attraction',
          description:
            'Good hiring starts with better search. Our role is to bring focus to the search, so leadership teams spend time with candidates worth serious consideration.',
          bullets: [
            'Talent mapping',
            'Candidate research',
            'Specialist and leadership search',
            'Direct outreach',
            'Referral-led sourcing',
            'Network activation',
            'Recruitment campaign support',
            'Candidate screening',
            'Shortlist development',
            'Hiring-manager coordination',
          ],
        },
        {
          title: 'Assessment and Selection',
          description:
            'Hiring decisions become stronger when they are structured around the work, not instinct alone. The goal is not to remove human judgment — it is to give human judgment better evidence.',
          bullets: [
            'Structured interview processes',
            'Role-specific scorecards',
            'Competency assessment',
            'Work samples and case studies',
            'Candidate comparison frameworks',
            'Hiring-manager interview support',
            'Reference-check processes',
            'Final-stage decision support',
          ],
        },
        {
          title: 'Onboarding and Team Integration',
          description:
            'The work does not end when the contract is signed. The aim is to help new people become effective sooner, while giving the business a better foundation for future hiring.',
          bullets: [
            'First-90-day plans',
            'Role expectations and priorities',
            'Manager alignment',
            'Onboarding frameworks',
            'Early performance check-ins',
            'Team integration support',
            'Feedback loops',
            'Hiring retrospectives',
          ],
        },
      ],
    },
    process: {
      eyebrow: 'A clearer hiring journey',
      title: 'How We Work',
      steps: [
        {
          num: '01',
          title: 'Diagnose',
          description:
            'Review the business context, team structure, role need, and hiring constraints.',
        },
        {
          num: '02',
          title: 'Define',
          description:
            'Clarify the capability gap, role outcomes, candidate profile, and hiring plan.',
        },
        {
          num: '03',
          title: 'Attract',
          description:
            'Shape the role narrative, identify relevant talent, and begin the search.',
        },
        {
          num: '04',
          title: 'Assess',
          description:
            'Support structured interviews, evidence-based evaluation, and confident decisions.',
        },
        {
          num: '05',
          title: 'Integrate',
          description:
            'Create the conditions for a stronger start and faster contribution.',
        },
      ],
    },
    whoThisIsFor: {
      eyebrow: 'Built for businesses at a turning point',
      title: 'Who This Is For',
      body: 'The Recruitment Pod is designed for leadership teams ready to hire with greater intent and stronger outcomes.',
      bullets: [
        'Founder-led businesses where key people are carrying too much',
        'Companies preparing for their next stage of growth',
        'Leadership teams building a new function or specialist capability',
        'Businesses entering a new market',
        'Teams that need greater clarity before making an important hire',
        'Companies with hiring activity but inconsistent outcomes',
        'Leaders who want a stronger recruitment process without building a large internal talent function',
      ],
      image: a('/assets/pod-recruitment-who.webp'),
      reverse: true,
    },
    faqTitle: 'Recruitment Pod FAQs',
    faq: [
      {
        question: 'Is the Recruitment Pod a recruitment agency?',
        answer:
          'The Recruitment Pod is a strategic talent partnership. It can support the practical search and hiring process, but it begins with understanding the business need, defining the role clearly, and building a stronger decision system around hiring.',
      },
      {
        question: 'Can you help before we know what role to hire?',
        answer:
          'Yes. Many businesses need role clarity before they need candidate search. We can help assess the capability gap, define the work that needs ownership, and determine whether a permanent hire is the right solution.',
      },
      {
        question: 'Do you only support permanent hiring?',
        answer:
          'No. Depending on the business need, we can help assess whether permanent, fractional, contract, interim, or specialist support is the most suitable option.',
      },
      {
        question: 'What types of roles can the Recruitment Pod support?',
        answer:
          'The Pod can support leadership, commercial, marketing, sales, operational, technical, and specialist roles. The approach begins with the capability required, rather than a fixed list of job titles.',
      },
      {
        question: 'Can you help us improve our existing hiring process?',
        answer:
          'Yes. The Recruitment Pod can support role design, candidate messaging, interview structure, scorecards, assessment processes, onboarding, and hiring-manager decision-making.',
      },
      {
        question: 'Do you guarantee a hire?',
        answer:
          'No. Good hiring depends on the market, the role, the business context, candidate availability, and the quality of decision-making throughout the process. Our role is to create a more focused, structured, and effective hiring process.',
      },
      {
        question: 'Can you work with our internal HR or talent team?',
        answer:
          'Yes. The Recruitment Pod can work alongside internal HR teams, hiring managers, founders, and existing recruitment partners to strengthen the hiring system around the business.',
      },
      {
        question: 'What happens after a candidate accepts an offer?',
        answer:
          'Where needed, we can support the transition into the role through first-90-day planning, manager alignment, onboarding structure, and early performance check-ins.',
      },
    ],
    cta: {
      title: 'Build with greater intent.',
      highlight: 'The next hire can change more than one role.',
      sub: 'If you are planning a hire, questioning a team structure, or trying to understand the capability your business needs next, start with a conversation.',
      primaryLabel: 'Start a Talent Conversation',
      primaryHref: 'mailto:hello@sugarandleather.com',
      secondaryLabel: 'Strategic Partnerships',
      secondaryHref: '/strategic-partnerships',
    },
  },
};
