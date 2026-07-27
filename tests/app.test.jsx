import '@testing-library/jest-dom/vitest';
import { render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '../src/App';

describe('application startup', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/about');
  });

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
});