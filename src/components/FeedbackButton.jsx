import { useRef } from 'react';
import { MessageSquarePlus } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useOcclusionGuard } from '../hooks/useOcclusionGuard';
import { FEEDBACK_PATH, buildFeedbackUrl, isExternalFeedbackTarget } from '../lib/links';

// Persistent feedback affordance, rendered once in Layout so it appears on every route.
//
// It is a link, not a <button>: it navigates. That also means useCustomCursor's
// hot-selector list (which already covers `a`) picks it up for free.
export default function FeedbackButton() {
  const ref = useRef(null);
  const { pathname } = useLocation();
  const occluding = useOcclusionGuard(ref);

  // Don't render on the destination itself. A link to the page you are already on does
  // nothing visible — it rewrites the query string while the form, which reads `subject`
  // once on mount, never re-reads it. That looked exactly like a broken button.
  if (pathname === FEEDBACK_PATH) return null;

  const external = isExternalFeedbackTarget();
  // Carry the originating route so feedback about a specific page arrives identifiable
  // rather than as sixteen indistinguishable "Website feedback" messages.
  const href = buildFeedbackUrl(pathname);

  const content = (
    <>
      <MessageSquarePlus size={17} strokeWidth={1.75} aria-hidden="true" />
      <span className="feedback-btn__label">Feedback</span>
    </>
  );

  // The visible label is hidden under 600px, so the accessible name has to be carried
  // independently of it or the control becomes unlabelled on mobile.
  const shared = {
    ref,
    className: `feedback-btn${occluding ? ' feedback-btn--tucked' : ''}`,
    'data-testid': 'feedback-button',
    // Mirror the pointer-events drop for assistive tech and keyboard users: while tucked,
    // the control is inert, so it must not be a tab stop announcing itself as clickable.
    'aria-hidden': occluding || undefined,
    tabIndex: occluding ? -1 : undefined,
    'aria-label':
      external && !href.startsWith('mailto:') ? 'Send feedback (opens in a new tab)' : 'Send feedback',
  };

  if (external) {
    // mailto: must not get target=_blank — it opens a mail client, not a tab, and the
    // "opens in a new tab" promise above would be a lie.
    const isMailto = href.startsWith('mailto:');
    return (
      <a
        href={href}
        {...(isMailto ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
        {...shared}
      >
        {content}
      </a>
    );
  }

  return (
    <Link to={href} {...shared}>
      {content}
    </Link>
  );
}
