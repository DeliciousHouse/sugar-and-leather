import { asset as a } from '../lib/asset';

export const INQUIRY_PAGE = {
  eyebrow: 'Inquiry',
  title: 'Start a conversation.',
  highlight: 'We respond with care.',
  sub: 'Share a little context about your organisation and what you are exploring. We read every message personally and respond within two business days.',
  heroImage: a('/assets/inquiry-hero.webp'),
  form: {
    title: 'Send a message',
    intro: 'All fields marked with an asterisk are required.',
    submitLabel: 'Send message',
    successTitle: 'Thank you.',
    successBody: 'Your message is ready to send. If your email client did not open, write to hello@sugarandleather.com and we will be in touch shortly.',
    fields: {
      name: { label: 'Full name', placeholder: 'Your full name' },
      email: { label: 'Email address', placeholder: 'you@company.com' },
      phone: { label: 'Phone number', placeholder: '+1 (510) 397-9109' },
      subject: { label: 'Subject', placeholder: 'How can we help?' },
      message: { label: 'Message', placeholder: 'Tell us about your organisation and what you are looking to explore.' },
    },
  },
  contact: {
    title: 'Contact information',
    intro: 'Prefer a direct line? Reach us through the details below.',
    address: {
      label: 'Office',
      lines: ['Sugar & Leather', '33 Via Aspero', 'Alamo, California 94507'],
    },
    email: {
      label: 'Email',
      value: 'hello@sugarandleather.com',
      href: 'mailto:hello@sugarandleather.com',
    },
    phone: {
      label: 'Phone',
      value: '+1 (510) 397-9109',
      href: 'tel:+15103979109',
    },
    hours: {
      label: 'Business hours',
      lines: ['Monday – Friday: 9:00 AM – 6:00 PM PT', 'Saturday – Sunday: Closed', 'Meetings by appointment'],
    },
  },
  social: {
    label: 'Follow us',
    links: [
      {
        id: 'linkedin',
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/company/sugarandleatherai/',
      },
      {
        id: 'instagram',
        label: 'Instagram',
        href: 'https://www.instagram.com/sugarandleatherai/',
      },
      {
        id: 'facebook',
        label: 'Facebook',
        href: 'https://www.facebook.com/sugarandleatherai/',
      },
    ],
  },
  map: {
    title: 'Find us',
    embedUrl:
      'https://maps.google.com/maps?q=33+Via+Aspero,+Alamo,+CA+94507&hl=en&z=15&output=embed',
    linkUrl: 'https://maps.google.com/?q=33+Via+Aspero,+Alamo,+CA+94507',
  },
  mailto: 'hello@sugarandleather.com',
};
