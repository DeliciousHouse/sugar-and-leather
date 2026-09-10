import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from '../src/App';
import CTA from '../src/components/CTA';

const ROUTE_FAMILIES = [
  '/',
  '/about',
  '/inquiry',
  '/practices/atelier',
  '/strategic-cxo-team',
  '/strategic-cxo-team/marketing-pod',
  '/community',
  '/capital-access-and-grant-services',
  '/innovation-and-advanced-tech',
  '/strategic-partnerships',
  '/strategic-partnerships/marketing-pod',
  '/capital-access',
  '/advanced-tech',
  '/aries-platform',
];

describe('application startup', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/about');
  });

  afterEach(cleanup);

  it('renders the requested route inside the shared site layout', () => {
    render(<App />);

    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(within(screen.getByRole('banner')).getByRole('link', {
      name: 'Sugar & Leather',
    })).toHaveAttribute('href', '/');
    expect(screen.getByRole('heading', {
      level: 1,
      name: /Built through pressure\. Led with humanity\./,
    })).toBeInTheDocument();
  });

  it.each(ROUTE_FAMILIES)('inherits one feedback control on route family %s', (path) => {
    window.history.replaceState({}, '', path);
    render(<App />);

    expect(screen.getAllByRole('button', { name: 'Send feedback' })).toHaveLength(1);
  });
});

function expectBookingLink(link, source) {
  const url = new URL(link.getAttribute('href'));
  expect(url.origin + url.pathname).toBe('https://cal.sugarandleather.com/audrey/');
  expect([...url.searchParams]).toEqual([
    ['utm_source', 'sugarandleather-website'],
    ['utm_medium', 'referral'],
    ['utm_campaign', 'booking'],
    ['utm_content', source],
  ]);
  expect(url.hash).toBe('');
}

describe('rendered booking attribution', () => {
  afterEach(cleanup);

  it('distinguishes home hero, closing CTA, and both nav variants across rerenders', () => {
    window.history.replaceState({}, '', '/?utm_content=private-query#private-fragment');
    const { container, rerender } = render(<App />);
    const assertLinks = () => {
      for (const [selector, label, source] of [
        ['.hero', 'Book a Strategy Call', 'home-hero'],
        ['#cta', 'Book a Strategy Call', 'home-cta'],
        ['#nav', 'Book a call', 'nav-desktop'],
        ['#drawer', 'Book a call', 'nav-mobile'],
      ]) {
        const link = within(container.querySelector(selector)).getByRole('link', { name: label });
        expectBookingLink(link, source);
        if (source === 'nav-mobile') {
          expect(link).not.toHaveAttribute('target');
          expect(link).not.toHaveAttribute('rel');
        } else {
          expect(link).toHaveAttribute('target', '_blank');
          expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        }
      }
    };
    assertLinks();
    rerender(<App />);
    assertLinks();

    const burger = within(screen.getByRole('banner')).getByRole('button', { name: 'Open menu' });
    const drawer = container.querySelector('#drawer');
    fireEvent.click(burger);
    expect(burger).toHaveAttribute('aria-expanded', 'true');
    expect(drawer).toHaveClass('open');
    expect(document.body.style.overflow).toBe('hidden');
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(burger).toHaveAttribute('aria-expanded', 'false');
    expect(drawer).not.toHaveClass('open');
    expect(document.body.style.overflow).toBe('');
    fireEvent.click(burger);
    const mobileLink = within(drawer).getByRole('link', { name: 'Book a call' });
    // Exercise the drawer handler without navigating to the live calendar.
    mobileLink.addEventListener('click', (event) => event.preventDefault(), { once: true });
    fireEvent.click(mobileLink);
    expect(drawer).not.toHaveClass('open');
    expect(document.body.style.overflow).toBe('');

    expect(screen.getByRole('link', { name: 'Talk to Our Team' }))
      .toHaveAttribute('href', 'mailto:contact@sugarandleather.com');
    expect(screen.getByRole('link', { name: 'Explore Our Ecosystem' }))
      .toHaveAttribute('href', '#ecosystem');
    expect(screen.getByRole('link', { name: 'Explore Aries AI' }))
      .toHaveAttribute('href', 'https://aries.sugarandleather.com/');
  });

  it('tags only the shared CTA default, preserving explicit non-booking overrides', () => {
    const { rerender } = render(<MemoryRouter><CTA /></MemoryRouter>);
    expectBookingLink(screen.getByRole('link', { name: 'Book a call' }), 'cta-default');
    for (const href of ['mailto:contact@sugarandleather.com', '/about', '#ecosystem', 'https://example.com/']) {
      rerender(<MemoryRouter><CTA primaryHref={href} /></MemoryRouter>);
      expect(screen.getByRole('link', { name: 'Book a call' })).toHaveAttribute('href', href);
    }
  });

  it.each([
    ['/about', ['about-hero', 'about-cta']],
    ['/practices/atelier', ['atelier-hero', 'atelier-cta']],
    ['/practices/forge', ['forge-hero', 'forge-cta']],
    ['/practices/compass', ['compass-hero', 'compass-cta']],
    ['/practices/lexicon', ['lexicon-hero', 'lexicon-cta']],
    ['/strategic-cxo-team/marketing-pod', ['marketing-pod-hero', 'marketing-pod-cta']],
    ['/aries-platform', ['aries-platform-hero', 'aries-platform-cta']],
    ['/strategic-cxo-team', ['strategic-cxo-team-hero', 'strategic-cxo-team-cta']],
    ['/innovation-and-advanced-tech', ['innovation-and-advanced-tech-cta']],
    ['/capital-access-and-grant-services', [
      'capital-access-and-grant-services-hero',
      'capital-access-and-grant-services-cta-grant-support',
      'capital-access-and-grant-services-cta-process-fit-call',
      'capital-access-and-grant-services-cta-engagement-fit-call',
      'capital-access-and-grant-services-cta',
    ]],
  ])('attributes every page placement on %s from public content only', (path, sources) => {
    window.history.replaceState({}, '', `${path}?utm_content=private-query#private-fragment`);
    render(<App />);
    const links = [...screen.getByRole('main').querySelectorAll('a[href^="https://cal.sugarandleather.com/"]')];
    expect(links).toHaveLength(sources.length);
    links.forEach((link, index) => expectBookingLink(link, sources[index]));
    expect(new Set(sources).size).toBe(sources.length);
  });

  it.each([
    ['sales-pod', 'Book a Commercial Strategy Call', 'Book a Commercial Strategy Call'],
    ['development-pod', 'Book a Technology Strategy Call', 'Start a Technology Conversation'],
    ['recruitment-pod', 'Book a Talent Strategy Call', 'Start a Talent Conversation'],
  ])('preserves %s explicit hero and closing mailto overrides', (slug, heroLabel, ctaLabel) => {
    window.history.replaceState({}, '', `/strategic-cxo-team/${slug}`);
    const { container } = render(<App />);
    for (const [selector, name] of [['.page-hero', heroLabel], ['#cta', ctaLabel]]) {
      const link = within(container.querySelector(selector)).getByRole('link', { name });
      expect(link).toHaveAttribute('href', 'mailto:contact@sugarandleather.com');
      expect(link).not.toHaveAttribute('target');
      expect(link).not.toHaveAttribute('rel');
    }
    for (const link of screen.getAllByRole('link', { name: 'How we work' })) {
      expect(link).toHaveAttribute('href', '#how-it-works');
    }
  });
});
