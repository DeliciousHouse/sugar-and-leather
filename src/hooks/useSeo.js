import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE, canonicalFor, routeFor, titleFor } from '../data/seo';

// Keeps the document head in sync with the current route.
//
// scripts/seo-build.mjs already writes correct, fully-formed head tags into a static
// HTML file per route, which is what crawlers and social scrapers read — they do not
// wait for React. This hook covers the other half: in-app navigation, where no new
// document is ever fetched, so without it the tab title and canonical would keep
// describing whichever page the visitor happened to land on first.
//
// Both paths read the same table in src/data/seo.js, so they cannot disagree.

/** Create-or-update a <meta> tag, keyed by name= or property=. */
function setMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function useSeo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const route = routeFor(pathname);

    // Unknown path. ProductPage/PodPage/EcosystemPage redirect these to "/", so the
    // effect re-runs a moment later with a pathname we do have an entry for. Leaving
    // the head untouched here avoids briefly publishing a wrong canonical mid-redirect.
    if (!route) return;

    const title = titleFor(route);
    const canonical = canonicalFor(route);
    const image = `${SITE.origin}${route.image ?? SITE.defaultImage}`;
    const indexable = route.index !== false;

    document.title = title;
    setMeta('name', 'description', route.description);
    setLink('canonical', canonical);

    setMeta('property', 'og:type', route.path === '/' ? 'website' : 'article');
    setMeta('property', 'og:site_name', SITE.name);
    setMeta('property', 'og:locale', SITE.locale);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', route.description);
    setMeta('property', 'og:url', canonical);
    setMeta('property', 'og:image', image);

    setMeta('name', 'twitter:card', SITE.twitterCard);
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', route.description);
    setMeta('name', 'twitter:image', image);

    // Only ever ADD a robots tag; never remove one the static HTML set. The prerendered
    // noindex page must stay noindex even if a visitor SPA-navigates away and back.
    if (!indexable) setMeta('name', 'robots', 'noindex, follow');
    else {
      const robots = document.head.querySelector('meta[name="robots"]');
      if (robots) robots.setAttribute('content', 'index, follow');
    }
  }, [pathname]);
}
