// Shared contract between the feedback dialog and server/feedback/index.mjs.
// Values MUST match the enums the server validates against or every submission 422s.
//
// Categories and impacts mirror the Aries feedback widget exactly
// (aries-app/lib/feedback/report-options.ts) so the two report the same shape and
// triage reads the same vocabulary on both boards.

// Same-origin on purpose. The edge proxy routes /api/feedback/* on sugarandleather.com
// to the feedback container, so the browser never makes a cross-origin request and there
// is no CORS preflight to configure or get wrong.
export const FEEDBACK_ENDPOINT = '/api/feedback/submit';

export const FEEDBACK_CATEGORIES = [
  { value: 'bug', label: 'Bug' },
  { value: 'question', label: 'Question' },
  { value: 'other', label: 'Other' },
];

/** Impact is asked FIRST and has no default — same as Aries. */
export const FEEDBACK_IMPACTS = [
  { value: 'p0_system_blocked', label: 'Entire team/system is blocked' },
  { value: 'p1_account_blocked', label: 'My account is blocked, others are OK' },
  { value: 'p2_feature_degraded', label: 'A feature is degraded/broken' },
  { value: 'p3_minor_glitch', label: 'Minor glitch/cosmetic issue' },
  { value: 'p4_question', label: 'General question/feedback' },
];

export const FEEDBACK_LIMITS = {
  titleMax: 255,
  descriptionMax: 10_000,
  /** Decoded bytes. Matches the server cap; the server re-checks, this is a UX hint. */
  screenshotBytesMax: 2_000_000,
  consoleErrorsMax: 20,
  consoleErrorLineMax: 500,
};

export const FEEDBACK_SCREENSHOT_MIMES = ['image/png', 'image/jpeg', 'image/webp'];

/**
 * Split a data: URL into the {base64, mime} payload the server expects, rejecting
 * anything outside the MIME whitelist or over the size cap before it leaves the browser.
 */
export function screenshotPayloadFromDataUrl(dataUrl, maxBytes = FEEDBACK_LIMITS.screenshotBytesMax) {
  const match = /^data:([^;,]+);base64,(.+)$/.exec(dataUrl || '');
  if (!match) return { ok: false, error: 'That image could not be read.' };
  const [, mime, base64] = match;
  if (!FEEDBACK_SCREENSHOT_MIMES.includes(mime)) {
    return { ok: false, error: 'Use a PNG, JPEG or WebP image.' };
  }
  // base64 length -> decoded byte count, accounting for padding.
  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
  const bytes = Math.floor((base64.length * 3) / 4) - padding;
  if (bytes > maxBytes) {
    return { ok: false, error: `Screenshot must be ${Math.floor(maxBytes / 1_000_000)} MB or smaller.` };
  }
  return { ok: true, payload: { base64, mime } };
}
