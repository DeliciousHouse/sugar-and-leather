// Single source of truth for every indexable URL on the site.
//
// Three things are generated from this file at build time (scripts/seo-build.mjs):
//   - dist/<route>/index.html   per-route <title>/description/canonical/OG/Twitter/JSON-LD
//   - dist/sitemap.xml
//   - dist/robots.txt and dist/llms.txt
// and one thing is validated against it (scripts/seo-check.mjs): that every route
// React can render has an entry here, and every entry here is a route React can render.
//
// That coupling is deliberate. The sitemap used to be hand-maintained, and because
// ProductPage/PodPage/EcosystemPage `<Navigate to="/" replace/>` on an unknown slug, a
// stale entry degraded into a silent soft-404 rather than a visible error. Adding a page
// now means adding it here, or the build fails.
//
// Descriptions are drawn from each page's own hero copy so they describe what is
// actually on the page. Keep them ~120-160 characters: shorter reads as thin in a SERP,
// longer gets truncated.

export const SITE = {
  origin: 'https://sugarandleather.com',
  name: 'Sugar & Leather',
  // Home carries the full positioning line; every other page gets " | Sugar & Leather".
  titleSuffix: ' | Sugar & Leather',
  defaultImage: '/assets/home-hero.webp',
  locale: 'en_US',
  twitterCard: 'summary_large_image',
};

// Organization facts for JSON-LD. Duplicated from src/data/inquiryContent.js rather than
// imported: this module is also loaded by plain Node in scripts/seo-build.mjs, and the
// content modules pull in src/lib/asset.js, which reads Vite's `import.meta.env` and
// therefore cannot be evaluated outside a Vite build. Keeping this file dependency-free
// is what lets one table drive both the runtime and the build.
// If the office address changes, update it in BOTH places — scripts/seo-check.mjs asserts
// they still agree and fails the build if they drift.
export const ORGANIZATION = {
  legalName: 'Sugar & Leather',
  street: '1650 Harbor Bay Pkwy Ste 220',
  locality: 'Alameda',
  region: 'CA',
  postalCode: '94502',
  country: 'US',
  email: 'contact@sugarandleather.com',
};

/**
 * @typedef {object} SeoRoute
 * @property {string}  path        Absolute site path, exactly as routed by src/App.jsx.
 * @property {string}  title       Page title WITHOUT the site suffix (home overrides via `fullTitle`).
 * @property {string=} fullTitle   Use verbatim instead of `title + titleSuffix`.
 * @property {string}  description Meta description. 120-160 chars.
 * @property {string}  group       Grouping used to lay out llms.txt.
 * @property {number}  priority    Sitemap priority.
 * @property {string}  changefreq  Sitemap changefreq.
 * @property {string=} image       OG image path. Falls back to SITE.defaultImage.
 * @property {boolean=} index      Default true. When false: noindex, and excluded from sitemap/llms.
 */

/** @type {SeoRoute[]} */
export const ROUTES = [
  {
    path: '/',
    fullTitle: 'Sugar & Leather — Human at the core, unbreakable under pressure',
    title: 'Home',
    description:
      'World-class executive coaching and strategic AI leadership for the people and organizations brave enough to lead through change.',
    group: 'company',
    priority: 1.0,
    changefreq: 'weekly',
    image: '/assets/home-hero.webp',
  },
  {
    path: '/about',
    title: 'About',
    description:
      'We help leaders navigate change with clarity, combining strategic thinking, human judgment, and AI-enabled execution to build businesses ready for what comes next.',
    group: 'company',
    priority: 0.8,
    changefreq: 'monthly',
    image: '/assets/about-hero.webp',
  },
  {
    path: '/inquiry',
    title: 'Inquiry',
    description:
      'Start a conversation with Sugar & Leather. Book a call, email the team, or visit our Alameda, California office.',
    group: 'company',
    priority: 0.8,
    changefreq: 'monthly',
    image: '/assets/inquiry-hero.webp',
  },

  // --- Ecosystem -------------------------------------------------------------
  {
    path: '/capital-access-and-grant-services',
    title: 'Capital Access & Grant Services',
    description:
      'Pursue grants with a stronger strategy, a clearer narrative, a credible budget, and the operational readiness funders expect.',
    group: 'ecosystem',
    priority: 0.9,
    changefreq: 'monthly',
    image: '/assets/ca-hero.webp',
  },
  {
    path: '/strategic-cxo-team',
    title: 'Strategic CXO team',
    description:
      'Executive leadership, operational expertise, and specialized execution pods, without building an entire internal department.',
    group: 'ecosystem',
    priority: 0.9,
    changefreq: 'monthly',
    image: '/assets/sp-hero.webp',
  },
  {
    path: '/community',
    title: 'Community',
    description:
      'Coaches, founders, and emerging operators building businesses that are commercially capable, technologically aware, and deeply human.',
    group: 'ecosystem',
    priority: 0.8,
    changefreq: 'monthly',
    image: '/assets/photo-coaching-library.webp',
  },
  {
    path: '/aries-platform',
    title: 'ARIES Platform & Products',
    description:
      'An AI-native business platform built for mid-market scale: Sequence CRM, intelligent workflows, and a data layer that keeps judgment human.',
    group: 'ecosystem',
    priority: 0.7,
    changefreq: 'monthly',
    image: '/assets/photo-night-work.webp',
  },
  {
    path: '/innovation-and-advanced-tech',
    title: 'Innovation & Advanced Tech',
    description:
      'Innovation & Advanced Tech from Sugar & Leather is launching soon at sugarandleather.ai. Book a call or email the team to talk about what is coming.',
    group: 'ecosystem',
    priority: 0.3,
    changefreq: 'monthly',
    // Holding page: ~265 characters of copy. Indexing it invites a thin-content /
    // soft-404 penalty and spends crawl budget on a page with nothing to rank for.
    // Flip to true once it has real content, and it rejoins the sitemap automatically.
    index: false,
  },

  // --- Strategic CXO team pods -----------------------------------------------
  {
    path: '/strategic-cxo-team/marketing-pod',
    title: 'Marketing Pod',
    description:
      'Demand, brand, and marketing operations run as a Strategic CXO team: senior direction plus the specialists who execute it.',
    group: 'pod',
    priority: 0.7,
    changefreq: 'monthly',
    image: '/assets/pod-marketing-hero.webp',
  },
  {
    path: '/strategic-cxo-team/sales-pod',
    title: 'Sales Pod',
    description:
      'Revenue should not depend on one founder or one good month. Commercial direction, experienced leadership, and specialist execution in one team.',
    group: 'pod',
    priority: 0.7,
    changefreq: 'monthly',
    image: '/assets/pod-sales-hero.webp',
  },
  {
    path: '/strategic-cxo-team/development-pod',
    title: 'Development Pod',
    description:
      'Define, build, and improve the systems, products, and workflows that support your next stage of growth.',
    group: 'pod',
    priority: 0.7,
    changefreq: 'monthly',
    image: '/assets/pod-development-hero.webp',
  },
  {
    path: '/strategic-cxo-team/recruitment-pod',
    title: 'Recruitment Pod',
    description:
      'Define the roles that actually matter, attract the right people, and build a stronger hiring foundation for growth.',
    group: 'pod',
    priority: 0.7,
    changefreq: 'monthly',
    image: '/assets/pod-recruitment-hero.webp',
  },

  // --- Practices --------------------------------------------------------------
  {
    path: '/practices/atelier',
    title: 'Atelier — Bespoke executive coaching',
    description:
      'Private, intensive coaching for the singular leader navigating change at the highest altitude. Confidential by design, intense by intention.',
    group: 'practice',
    priority: 0.6,
    changefreq: 'monthly',
    image: '/assets/photo-coaching-sage.webp',
  },
  {
    path: '/practices/forge',
    title: 'Forge — Leadership team intensives',
    description:
      'Immersive intensives where an entire leadership team is pressure-tested together, rehearsing the hardest decisions before they arrive.',
    group: 'practice',
    priority: 0.6,
    changefreq: 'monthly',
    image: '/assets/photo-knowledge-motion.webp',
  },
  {
    path: '/practices/compass',
    title: 'Compass — Fractional AI leadership',
    description:
      'Embedded, senior counsel on your AI strategy, translating ambition into roadmaps that survive contact with reality.',
    group: 'practice',
    priority: 0.6,
    changefreq: 'monthly',
    image: '/assets/aries-ecosystem.webp',
  },
  {
    path: '/practices/lexicon',
    title: 'Lexicon — The AI-fluency platform',
    description:
      'A living curriculum that makes executives genuinely fluent in AI. Adaptive, current, and built for leaders who need to decide, not perform.',
    group: 'practice',
    priority: 0.6,
    changefreq: 'monthly',
    image: '/assets/photo-study-light.webp',
  },
];

/** Routes that belong in the sitemap and should be indexed. */
export const indexableRoutes = () => ROUTES.filter((r) => r.index !== false);

/** Full <title> for a route, applying the site suffix unless the route overrides it. */
export const titleFor = (route) => route.fullTitle ?? `${route.title}${SITE.titleSuffix}`;

/** Absolute canonical URL for a route. */
export const canonicalFor = (route) =>
  route.path === '/' ? `${SITE.origin}/` : `${SITE.origin}${route.path}`;

/**
 * Look up the SEO entry for a pathname. Trailing slashes are normalized so that
 * `/about` and `/about/` resolve to the same entry.
 */
export const routeFor = (pathname) => {
  const normalized =
    pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  return ROUTES.find((r) => r.path === normalized) ?? null;
};
