import { useRef, useState } from 'react';
import { MessageSquarePlus } from 'lucide-react';
import { useOcclusionGuard } from '../hooks/useOcclusionGuard';
import { CAPTURE_IGNORE_ATTR } from '../lib/captureScreenshot';
import FeedbackDialog from './FeedbackDialog';

// Persistent feedback affordance, rendered once in Layout so it appears on every route.
//
// Opens a report dialog in place. It previously linked to /inquiry, which was wrong:
// that is a sales contact form, and routing bug reports into it loses both the bug and
// the lead. Reports now become Jira issues in SLW via server/feedback.
//
// A real <button>, not an <a> — it toggles UI rather than navigating. aria-haspopup and
// aria-expanded tell assistive tech that it opens a dialog and whether it is open.
export default function FeedbackButton() {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  const occluding = useOcclusionGuard(ref);

  // While the dialog is open the pill sits behind a scrim, so occlusion-tucking it would
  // just make the trigger disappear underneath. Only tuck when the dialog is closed.
  const tucked = occluding && !open;

  return (
    <>
      <button
        type="button"
        ref={ref}
        className={`feedback-btn${tucked ? ' feedback-btn--tucked' : ''}`}
        data-testid="feedback-button"
        // Excluded from the page capture so the screenshot shows the page, not our chrome.
        {...{ [CAPTURE_IGNORE_ATTR]: '' }}
        aria-haspopup="dialog"
        aria-expanded={open}
        // Mirror the pointer-events drop for assistive tech and keyboard users: while
        // tucked the control is inert, so it must not be a tab stop.
        aria-hidden={tucked || undefined}
        tabIndex={tucked ? -1 : undefined}
        // The visible label is hidden under 600px, so the accessible name has to be
        // carried independently or the control is unlabelled on mobile.
        aria-label="Send feedback"
        onClick={() => setOpen(true)}
      >
        <MessageSquarePlus size={17} strokeWidth={1.75} aria-hidden="true" />
        <span className="feedback-btn__label">Feedback</span>
      </button>
      <FeedbackDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
