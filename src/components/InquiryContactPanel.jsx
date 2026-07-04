import { Facebook, Instagram, Linkedin } from 'lucide-react';

function XIcon({ size = 18, strokeWidth = 1.75 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 4L20 20M20 4L4 20"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

const SOCIAL_ICONS = {
  linkedin: Linkedin,
  x: XIcon,
  instagram: Instagram,
  facebook: Facebook,
};

function ContactBlock({ label, children }) {
  return (
    <div className="inquiry-contact-block">
      <h3 className="inquiry-contact-label">{label}</h3>
      <div className="inquiry-contact-value">{children}</div>
    </div>
  );
}

export default function InquiryContactPanel({ contact, social }) {
  return (
    <aside className="inquiry-aside" aria-label="Contact information">
      <div className="inquiry-aside-card">
        <h2 className="inquiry-aside-title">{contact.title}</h2>
        <p className="inquiry-aside-intro">{contact.intro}</p>

        <ContactBlock label={contact.address.label}>
          {contact.address.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </ContactBlock>

        <ContactBlock label={contact.email.label}>
          <a href={contact.email.href}>{contact.email.value}</a>
        </ContactBlock>

        <ContactBlock label={contact.phone.label}>
          <a href={contact.phone.href}>{contact.phone.value}</a>
        </ContactBlock>

        <ContactBlock label={contact.hours.label}>
          {contact.hours.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </ContactBlock>

        <div className="inquiry-social">
          <h3 className="inquiry-contact-label">{social.label}</h3>
          <ul className="inquiry-social-list">
            {social.links.map((link) => {
              const Icon = SOCIAL_ICONS[link.id];
              return (
                <li key={link.id}>
                  <a
                    href={link.href}
                    className="inquiry-social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                  >
                    {Icon ? <Icon size={18} strokeWidth={1.75} /> : null}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </aside>
  );
}
