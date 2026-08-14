// @vitest-environment node

import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

describe('feedback privacy and presentation source contract', () => {
  it('has no automatic console or page capture implementation', () => {
    expect(existsSync(new URL('../src/lib/consoleCapture.js', import.meta.url))).toBe(false);
    expect(existsSync(new URL('../src/lib/captureScreenshot.js', import.meta.url))).toBe(false);
    expect(source('src/main.jsx')).not.toMatch(/consoleCapture|installConsoleCapture/);
    expect(source('src/components/FeedbackDialog.jsx')).not.toMatch(
      /consoleErrors|screenshot|Capture page|Attach image|type="file"/,
    );
    expect(JSON.parse(source('package.json')).dependencies).not.toHaveProperty('html-to-image');
  });

  it('preserves the brand tokens, layering, occlusion, and mobile bottom sheet', () => {
    const tokens = source('src/styles/tokens.css');
    const styles = source('src/styles/site.css');

    expect(tokens).toMatch(/--obsidian:\s+#0E0C0F/);
    expect(tokens).toMatch(/--cream:\s+#EDE8E1/);
    expect(tokens).toMatch(/--lavender:\s+#C5B8D4/);
    expect(styles).toMatch(/\.feedback-btn\s*{[^}]*position:\s*fixed;[^}]*z-index:\s*70;/s);
    expect(styles).toMatch(/\.feedback-btn--tucked\s*{[^}]*pointer-events:\s*none;/s);
    expect(styles).toMatch(/\.feedback-dialog__scrim\s*{[^}]*z-index:\s*100;/s);
    expect(styles).toMatch(
      /@media \(max-width: 600px\)\s*{[^}]*\.feedback-dialog__scrim\s*{[^}]*place-items:\s*end stretch;/s,
    );
  });
});
