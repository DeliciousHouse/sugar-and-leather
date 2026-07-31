// In-page screenshot capture for the feedback dialog.
//
// Ported from the Aries widget (aries-app/frontend/feedback/capture-screenshot.ts) so
// the two behave identically. The history there is worth keeping: the original
// implementation used navigator.mediaDevices.getDisplayMedia() — the screen-SHARE API —
// which (1) pops the browser's window/tab/screen picker, (2) captures the whole shared
// surface rather than the page behind the widget, and (3) is unsupported on mobile. In
// practice it never captured the actual problem (Aries AA-77, "captures incorrect
// portion of the screen").
//
// This rasterizes the DOM instead, via html-to-image's SVG <foreignObject> renderer:
// no picker, works on mobile, and captures exactly "the page you're on". The feedback UI
// itself — button, dialog, scrim — is excluded so the shot shows the page BEHIND the
// dialog rather than our own chrome.
//
// Best-effort throughout: any failure resolves null and the dialog degrades to the file
// picker, which is the same contract the getDisplayMedia path had on denial.

/** Nodes carrying this attribute (and their subtrees) are omitted from the capture. */
export const CAPTURE_IGNORE_ATTR = 'data-feedback-capture-ignore';

/**
 * JPEG rather than PNG, at viewport resolution: keeps a full-page capture comfortably
 * under the 2 MB cap even on tall pages, and JPEG is in the accepted MIME whitelist.
 */
export const CAPTURE_JPEG_QUALITY = 0.82;

/** Opaque fallback fill when the page background cannot be read (JPEG has no alpha). */
const CAPTURE_BG_FALLBACK = '#0E0C0F';

/**
 * html-to-image `filter` predicate: drop the feedback UI so the screenshot shows the
 * page behind it. Any node that IS — or is nested inside — a `[data-feedback-capture-
 * ignore]` element is excluded. Text and comment nodes are kept.
 */
export function shouldCaptureNode(node) {
  if (!node || typeof node !== 'object') return true;
  // Only Element nodes (nodeType 1) can carry the marker.
  if (node.nodeType !== 1 || typeof node.closest !== 'function') return true;
  return node.closest(`[${CAPTURE_IGNORE_ATTR}]`) == null;
}

/** True whenever an in-page capture is possible (any client DOM). */
export function pageCaptureSupported() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/** The page's own background, so JPEG's opaque fill matches the site rather than black. */
function getCaptureBackgroundColor() {
  try {
    if (typeof window === 'undefined' || typeof window.getComputedStyle !== 'function') {
      return CAPTURE_BG_FALLBACK;
    }
    for (const el of [document.body, document.documentElement]) {
      if (!el) continue;
      const bg = window.getComputedStyle(el).backgroundColor;
      if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') return bg;
    }
  } catch {
    /* fall through */
  }
  return CAPTURE_BG_FALLBACK;
}

/**
 * Rasterize the current page to a JPEG data URL, excluding the feedback UI.
 * Resolves null when there is no DOM, the capture throws, or the output is not a JPEG
 * data URL — the caller degrades to the file picker on null.
 */
export async function capturePageScreenshot(deps = {}) {
  if (typeof document === 'undefined' || !document.body) return null;
  try {
    // Lazy import keeps html-to-image out of the main bundle: most visitors never open
    // the dialog, and this is a ~30KB parser they should not pay for on first paint.
    const toJpeg = deps.toJpeg ?? (await import('html-to-image')).toJpeg;
    const dataUrl = await toJpeg(document.body, {
      quality: CAPTURE_JPEG_QUALITY,
      // CSS-pixel resolution: plenty for a bug screenshot, and keeps the encoded size
      // under the cap on tall pages and HiDPI displays.
      pixelRatio: 1,
      cacheBust: true,
      backgroundColor: getCaptureBackgroundColor(),
      filter: shouldCaptureNode,
    });
    return typeof dataUrl === 'string' && dataUrl.startsWith('data:image/jpeg') ? dataUrl : null;
  } catch {
    return null;
  }
}
