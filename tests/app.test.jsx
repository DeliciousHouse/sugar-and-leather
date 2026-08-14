import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import App from '../src/App';

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
