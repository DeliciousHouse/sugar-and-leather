export const CAL_BOOKING_URL = 'https://cal.sugarandleather.com/audrey/';

/** @param {string} source Static, public placement label. */
export function calendarBookingUrl(source) {
  if (typeof source !== 'string' || source.length > 100 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(source)) {
    throw new TypeError('Calendar source must be a 1-100 character lowercase kebab-case label');
  }

  const url = new URL(CAL_BOOKING_URL);
  url.searchParams.set('utm_source', 'sugarandleather-website');
  url.searchParams.set('utm_medium', 'referral');
  url.searchParams.set('utm_campaign', 'booking');
  url.searchParams.set('utm_content', source);
  return url.href;
}

export const ECOSYSTEM_HASH = '/#ecosystem';

export const HOW_IT_WORKS_HASH = '#how-it-works';
