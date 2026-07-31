// Shared contract between the feedback dialog and server/feedback/index.mjs.
// The values MUST match the enums the server validates against, or every submission
// 422s. Kept in one file so a change to one side is visibly a change to the other.

// Same-origin on purpose. The edge proxy routes /api/feedback/* on sugarandleather.com
// to the feedback container, so the browser never makes a cross-origin request and there
// is no CORS preflight to configure or get wrong.
export const FEEDBACK_ENDPOINT = '/api/feedback/submit';

export const FEEDBACK_CATEGORIES = [
  { value: 'bug', label: 'Something is broken' },
  { value: 'request', label: 'Feature or change request' },
  { value: 'question', label: 'Question' },
  { value: 'other', label: 'Something else' },
];

export const FEEDBACK_IMPACTS = [
  { value: 'p0_blocked', label: 'Blocked — I cannot use the site' },
  { value: 'p1_broken', label: 'Something is broken' },
  { value: 'p2_degraded', label: 'Works, but not properly' },
  { value: 'p3_minor', label: 'Minor or cosmetic' },
  { value: 'p4_idea', label: 'Idea or general feedback' },
];
