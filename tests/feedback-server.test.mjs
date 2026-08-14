// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { buildIssue, validate } from '../server/feedback/index.mjs';

const validReport = {
  category: 'bug',
  impact: 'p2_feature_degraded',
  title: 'Booking button is broken',
  description: 'The booking button did not open.',
  email: 'reporter@example.com',
  path: '/about',
};

describe('feedback server privacy boundary', () => {
  it('keeps only the browser allowlist and pins the Jira destination to SLW', () => {
    const { errors, value } = validate({
      ...validReport,
      consoleErrors: ['CONSOLE-SECRET'],
      screenshot: { mime: 'image/png', base64: Buffer.from('PAGE-SECRET').toString('base64') },
      fullUrl: 'https://sugarandleather.com/about?token=URL-SECRET#HASH-SECRET',
      dom: '<div>DOM-SECRET</div>',
      hiddenPageData: 'HIDDEN-PAGE-SECRET',
      userAgent: 'USER-AGENT-SECRET',
      viewport: { width: 1440, height: 900 },
      project: 'ATTACKER',
      projectKey: 'ATTACKER',
      reporter: 'ATTACKER',
      accountId: 'ATTACKER',
    });

    expect(errors).toStrictEqual({});
    expect(value).toStrictEqual(validReport);

    const issue = buildIssue(value);
    const serialized = JSON.stringify(issue);
    expect(issue.fields.project).toStrictEqual({ key: 'SLW' });
    expect(serialized).toContain('/about');
    expect(serialized).not.toMatch(
      /CONSOLE-SECRET|PAGE-SECRET|URL-SECRET|HASH-SECRET|DOM-SECRET|HIDDEN-PAGE-SECRET|USER-AGENT-SECRET|ATTACKER/,
    );
  });

  it.each([
    'https://sugarandleather.com/about',
    '//sugarandleather.com/about',
    '/about?token=QUERY-SECRET',
    '/about#HASH-SECRET',
    'about',
  ])('discards non-pathname route context: %s', (path) => {
    expect(validate({ ...validReport, path }).value.path).toBe('');
  });

  it('preserves a bounded pathname', () => {
    const longPath = `/${'a'.repeat(250)}`;
    const path = validate({ ...validReport, path: longPath }).value.path;

    expect(path).toHaveLength(200);
    expect(path).toMatch(/^\/[a]+$/);
  });

  it('preserves the reporter field validation caps', () => {
    const { errors } = validate({
      ...validReport,
      title: 't'.repeat(256),
      description: 'd'.repeat(10_001),
      email: `${'e'.repeat(250)}@example.com`,
    });

    expect(errors).toStrictEqual({
      title: 'Keep the title under 255 characters.',
      description: 'Keep the description under 10000 characters.',
      email: 'That email address does not look right.',
    });
  });
});
