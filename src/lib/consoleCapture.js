// Rolling buffer of recent console errors, attached to feedback reports.
//
// Ported from aries-app/frontend/feedback/console-capture.ts. The point is that a bug
// report saying "it broke" is much cheaper to triage when the stack trace that fired at
// the same moment is already on the ticket.
//
// Deliberately only console.error — not console.log or console.warn. Logs are chatty and
// frequently contain data the reporter did not intend to send; errors are the signal.
// Install-once and safe to call during module init.

import { FEEDBACK_LIMITS } from './feedback';

const MAX = FEEDBACK_LIMITS.consoleErrorsMax;
const LINE_MAX = FEEDBACK_LIMITS.consoleErrorLineMax;

let buffer = [];
let installed = false;

function push(line) {
  const trimmed = String(line).slice(0, LINE_MAX);
  buffer.push(trimmed);
  // Keep only the most recent MAX entries so a page that errors in a loop cannot grow
  // this without bound.
  if (buffer.length > MAX) buffer.splice(0, buffer.length - MAX);
}

/** Wrap console.error, preserving the original behaviour. Idempotent. */
export function installConsoleCapture() {
  if (installed || typeof window === 'undefined' || !window.console) return;
  installed = true;
  const original = window.console.error;
  window.console.error = (...args) => {
    try {
      push(
        args
          .map((a) => {
            if (a instanceof Error) return `${a.name}: ${a.message}`;
            if (typeof a === 'string') return a;
            try {
              return JSON.stringify(a);
            } catch {
              return String(a);
            }
          })
          .join(' '),
      );
    } catch {
      /* never let capture break the page's own error path */
    }
    original.apply(window.console, args);
  };
}

export function getRecentConsoleErrors() {
  return buffer.slice();
}

export function __resetConsoleCaptureForTests() {
  buffer = [];
  installed = false;
}
