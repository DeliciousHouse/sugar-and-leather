import { MessageSquarePlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FEEDBACK_URL } from '../lib/links';

// Persistent feedback affordance, rendered once in Layout so it appears on every route.
//
// FEEDBACK_URL is an internal route today (see the comment on it for why it is not the
// Jira portal), so this renders a react-router <Link> and stays in the same tab — a
// same-origin destination opened in a new tab is just tab litter. If the destination is
// ever switched to an external URL or a mailto: (the JSM email request channel), the
// branch below falls back to a plain anchor with the right target/rel.
//
// Either way it is a link, not a <button>: it navigates. That also means
// useCustomCursor's hot-selector list (which already covers `a`) picks it up for free.
const isExternal = /^([a-z]+:)?\/\//i.test(FEEDBACK_URL) || FEEDBACK_URL.startsWith('mailto:');

export default function FeedbackButton() {
  const content = (
    <>
      <MessageSquarePlus size={17} strokeWidth={1.75} aria-hidden="true" />
      <span className="feedback-btn__label">Feedback</span>
    </>
  );

  // The visible label is hidden under 600px, so the accessible name has to be carried
  // independently of it or the control becomes unlabelled on mobile.
  const shared = {
    className: 'feedback-btn',
    'data-testid': 'feedback-button',
    'aria-label': isExternal ? 'Send feedback (opens in a new tab)' : 'Send feedback',
  };

  if (isExternal) {
    return (
      <a href={FEEDBACK_URL} target="_blank" rel="noopener noreferrer" {...shared}>
        {content}
      </a>
    );
  }

  return (
    <Link to={FEEDBACK_URL} {...shared}>
      {content}
    </Link>
  );
}
