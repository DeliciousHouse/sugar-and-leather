import { MessageSquarePlus } from 'lucide-react';
import { FEEDBACK_URL } from '../lib/links';

// Persistent feedback affordance, rendered once in Layout so it appears on every route.
//
// Deliberately an <a> rather than a <button>: it navigates to the Jira Service Management
// portal, so anchor semantics give us middle-click, cmd-click and "copy link address" for
// free, and useCustomCursor's hot-selector list already covers `a`.
//
// The label collapses to an icon under 600px. The button sits at the bottom-right where a
// support affordance is conventionally expected, at z-index 70 — below the nav (80) so it
// never covers the menu, and well below the loader (300).
export default function FeedbackButton() {
  return (
    <a
      className="feedback-btn"
      href={FEEDBACK_URL}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="feedback-button"
      // The visible label disappears on small screens, so the accessible name has to be
      // carried independently of it or the control becomes unlabelled on mobile.
      aria-label="Send feedback (opens in a new tab)"
    >
      <MessageSquarePlus size={17} strokeWidth={1.75} aria-hidden="true" />
      <span className="feedback-btn__label">Feedback</span>
    </a>
  );
}
