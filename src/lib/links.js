export const CAL_BOOKING_URL = 'https://cal.sugarandleather.com/audrey/';

// Destination for the global feedback button (src/components/FeedbackButton.jsx).
//
// This points at our own /inquiry page, NOT at Jira Service Management, and that is
// deliberate. Every JSM customer portal on this site requires a login: portals 1-5 all
// render "The action performed required a logged in user", and the portal index 302s to
// /servicedesk/customer/user/login. Marketing-site visitors are prospects without
// Atlassian accounts, so a JSM link would dead-end every one of them. SLW-32 intends to
// keep the portal locked, so this is a standing conflict, not a misconfiguration to wait
// out. Tracked in SLW-37.
//
// /inquiry works for everyone today and is the same path the rest of the site already
// uses for contact. The `subject` param prefills the form's Subject field so feedback
// arrives labelled instead of mixed in with sales enquiries.
//
// To route into JSM later, change this one constant to the service desk's EMAIL REQUEST
// CHANNEL address (`mailto:<address>`) rather than a portal URL — email-in creates
// tickets without requiring the sender to authenticate, which is the only way to get
// anonymous feedback into JSM while SLW-32 holds.
export const FEEDBACK_TARGET = '/inquiry';

/** Path the feedback button points at, without query. Used to suppress the button there. */
export const FEEDBACK_PATH = '/inquiry';

/** Subject the Inquiry form prefills for feedback. Must match SUBJECT in InquiryForm. */
export const FEEDBACK_SUBJECT = 'Website feedback';

export const isExternalFeedbackTarget = () =>
  /^([a-z]+:)?\/\//i.test(FEEDBACK_TARGET) || FEEDBACK_TARGET.startsWith('mailto:');

/**
 * Build the feedback destination, tagging which route the visitor was on.
 * "Website feedback" alone is useless across 16 routes — without the origin nobody can
 * tell whether a complaint is about the pricing page or the contact form.
 */
export function buildFeedbackUrl(fromPath) {
  const subject = fromPath && fromPath !== '/'
    ? `${FEEDBACK_SUBJECT}: ${fromPath}`
    : `${FEEDBACK_SUBJECT}: home`;
  if (isExternalFeedbackTarget()) {
    const sep = FEEDBACK_TARGET.startsWith('mailto:') ? '?' : '#';
    return `${FEEDBACK_TARGET}${sep}subject=${encodeURIComponent(subject)}`;
  }
  return `${FEEDBACK_TARGET}?subject=${encodeURIComponent(subject)}`;
}

export const ECOSYSTEM_HASH = '/#ecosystem';

export const HOW_IT_WORKS_HASH = '#how-it-works';
