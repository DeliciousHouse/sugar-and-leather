// @vitest-environment node

import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { CAL_BOOKING_URL, calendarBookingUrl } from '../src/lib/links.js';

describe('calendar booking attribution', () => {
  it('accepts only 1-100 character lowercase kebab-case strings', () => {
    for (const source of ['a', '0', 'nav-mobile', 'page-2-hero', 'a'.repeat(100)]) {
      expect(new URL(calendarBookingUrl(source)).searchParams.get('utm_content')).toBe(source);
    }
    for (const source of [
      undefined, null, 1, true, {}, ['home'], '', 'a'.repeat(101),
      'Home', '-home', 'home-', 'home--hero', 'home_hero', 'home hero',
      'home/hero', 'home?query', 'home#hash', 'person@example.com', 'café', 'home\n', 'home\r',
    ]) {
      expect(() => calendarBookingUrl(source), String(source)).toThrow(TypeError);
    }
  });

  it('preserves the destination and emits one of each exact attribution parameter on repeated calls', () => {
    const first = calendarBookingUrl('home-hero');
    const second = calendarBookingUrl('home-cta');
    const url = new URL(first);

    expect(CAL_BOOKING_URL).toBe('https://cal.sugarandleather.com/audrey/');
    expect(url.origin + url.pathname).toBe(CAL_BOOKING_URL);
    expect([...url.searchParams]).toEqual([
      ['utm_source', 'sugarandleather-website'],
      ['utm_medium', 'referral'],
      ['utm_campaign', 'booking'],
      ['utm_content', 'home-hero'],
    ]);
    expect(new URL(second).searchParams.getAll('utm_content')).toEqual(['home-cta']);
    expect(calendarBookingUrl('home-hero')).toBe(first);
  });

  it('preserves other base parameters and hash while replacing duplicate attribution keys', async () => {
    // Load the same helper with a fixture base, without adding a production configuration API.
    const moduleSource = await readFile(new URL('../src/lib/links.js', import.meta.url), 'utf8');
    const base = new URL(CAL_BOOKING_URL);
    base.search = 'keep=one&keep=two';
    base.hash = '#details';
    for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content']) {
      base.searchParams.append(key, 'old');
      base.searchParams.append(key, 'duplicate');
    }
    const fixture = moduleSource.replace(CAL_BOOKING_URL, base.href);
    const { calendarBookingUrl: withBase } = await import(/* @vite-ignore */ `data:text/javascript,${encodeURIComponent(fixture)}`);
    const url = new URL(withBase('home-hero'));
    expect(url.origin + url.pathname).toBe(CAL_BOOKING_URL);
    expect(url.hash).toBe('#details');
    expect(url.searchParams.getAll('keep')).toEqual(['one', 'two']);
    url.searchParams.delete('keep');
    expect([...url.searchParams]).toEqual([...new URL(calendarBookingUrl('home-hero')).searchParams]);
    expect(withBase('home-hero')).toBe(withBase('home-hero'));
  });
});

describe('static booking content inventory', () => {
  it('tags every static content booking href, including legacy ecosystem content', () => {
    const content = Object.assign({}, ...Object.values(import.meta.glob('../src/data/*Content.js', { eager: true })));
    const sources = {};
    function visit(value, path = '') {
      if (typeof value === 'string' && value.startsWith(CAL_BOOKING_URL)) {
        const url = new URL(value);
        const source = url.searchParams.get('utm_content');
        expect(value, path).toBe(calendarBookingUrl(source));
        sources[path] = source;
      } else if (value && typeof value === 'object') {
        for (const [key, child] of Object.entries(value)) visit(child, path ? `${path}.${key}` : key);
      }
    }
    visit(content);
    expect(sources).toEqual({
      'HOMEPAGE_HERO.primaryCta.href': 'home-hero',
      'HOMEPAGE_CTA.primaryHref': 'home-cta',
      'ABOUT_PAGE.hero.primaryAction.href': 'about-hero',
      'ABOUT_PAGE.cta.primaryHref': 'about-cta',
      'PRODUCT_PAGES.atelier.cta.primaryHref': 'atelier-cta',
      'PRODUCT_PAGES.forge.cta.primaryHref': 'forge-cta',
      'PRODUCT_PAGES.compass.cta.primaryHref': 'compass-cta',
      'PRODUCT_PAGES.lexicon.cta.primaryHref': 'lexicon-cta',
      'POD_PAGES.marketing-pod.cta.primaryHref': 'marketing-pod-cta',
      'STRATEGIC_PARTNERSHIPS.primaryCta.href': 'strategic-cxo-team-hero',
      'STRATEGIC_PARTNERSHIPS.cta.primaryHref': 'strategic-cxo-team-cta',
      'CAPITAL_ACCESS.primaryCta.href': 'capital-access-and-grant-services-hero',
      'CAPITAL_ACCESS.grantSupport.cta.href': 'capital-access-and-grant-services-cta-grant-support',
      'CAPITAL_ACCESS.process.steps.0.cta.href': 'capital-access-and-grant-services-cta-process-fit-call',
      'CAPITAL_ACCESS.pricing.plans.0.cta.href': 'capital-access-and-grant-services-cta-engagement-fit-call',
      'CAPITAL_ACCESS.cta.primaryHref': 'capital-access-and-grant-services-cta',
      'ECOSYSTEM_PAGES.capital-access-and-grant-services.cta.primaryHref': 'capital-access-and-grant-services-cta',
      'ECOSYSTEM_PAGES.aries-platform.cta.primaryHref': 'aries-platform-cta',
      'ECOSYSTEM_PAGES.innovation-and-advanced-tech.cta.primaryHref': 'innovation-and-advanced-tech-cta',
    });
  });

  it('keeps the raw booking destination confined to the shared helper', () => {
    const modules = import.meta.glob('../src/**/*.{js,jsx}', { query: '?raw', import: 'default', eager: true });
    for (const [path, source] of Object.entries(modules)) {
      if (path === '../src/lib/links.js') continue;
      expect(source, path).not.toContain(CAL_BOOKING_URL);
      expect(source, path).not.toMatch(/\bCAL_BOOKING_URL\b/);
    }
  });
});
