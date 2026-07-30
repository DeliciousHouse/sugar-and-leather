export const CAL_BOOKING_URL = 'https://cal.sugarandleather.com/audrey/';

// Destination for the global feedback button (src/components/FeedbackButton.jsx).
//
// Points at the Jira Service Management customer portal so feedback lands as a real
// ticket rather than an email nobody triages.
//
// KNOWN LIMITATION — see SLW-31: the portal currently redirects anonymous visitors to
// `/servicedesk/customer/user/login`, so a member of the public who clicks this today
// hits a login wall. SLW-32 ("Restrict JSM Portal Access to Authenticated Customers")
// intends to keep it that way, which is in direct tension with a feedback button on a
// public marketing site. Someone needs to decide whether the feedback request type
// specifically may be raised anonymously.
//
// When SLW-33 lands the custom domain, this becomes
// `https://get.help.sugarandleather.com/...` — one constant, one edit.
export const FEEDBACK_URL =
  'https://sugarandleather.atlassian.net/servicedesk/customer/portals';

export const ECOSYSTEM_HASH = '/#ecosystem';

export const HOW_IT_WORKS_HASH = '#how-it-works';
