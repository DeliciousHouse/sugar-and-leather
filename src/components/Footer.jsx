import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Mail, MapPin } from 'lucide-react';
import { asset, hashHref } from '../lib/asset';

const FOOTER_LINKS = {
  ecosystem: [
    { href: '/capital-access', label: 'Capital Access', route: true },
    { href: '/strategic-partnerships', label: 'Strategic Partnerships', route: true },
    { href: '/community', label: 'Community', route: true },
    {
      href: 'https://sugarandleather.ai/',
      label: 'Innovation & Advanced Tech',
      external: true,
    },
  ],
  connect: [
    { href: '/inquiry', label: 'Enquiry', route: true },
    { href: '/about', label: 'About', route: true },
  ],
  product: [
    { href: 'https://aries.sugarandleather.com/', label: 'Aries', external: true },
    { href: 'https://sequence.sugarandleather.com/', label: 'Sequence', external: true },
  ],
  social: [
    {
      id: 'email',
      href: 'mailto:contact@sugarandleather.com',
      label: 'Email contact@sugarandleather.com',
      icon: Mail,
    },
    {
      id: 'linkedin',
      href: 'https://www.linkedin.com/company/sugarandleatherai/',
      label: 'LinkedIn',
      icon: Linkedin,
      external: true,
    },
    {
      id: 'instagram',
      href: 'https://www.instagram.com/sugarandleatherai/',
      label: 'Instagram',
      icon: Instagram,
      external: true,
    },
    {
      id: 'facebook',
      href: 'https://www.facebook.com/sugarandleatherai/',
      label: 'Facebook',
      icon: Facebook,
      external: true,
    },
    {
      id: 'location',
      href: 'https://maps.google.com/?q=33+Via+Aspero,+Alamo,+CA+94507',
      label: 'Alamo, California',
      icon: MapPin,
      external: true,
    },
  ],
};

function FooterLink({ link }) {
  if (link.route) {
    return (
      <Link to={link.href} className="footer-link">
        {link.label}
      </Link>
    );
  }

  const href = link.href.startsWith('/#') ? hashHref(link.href.slice(1)) : link.href;
  const externalProps = link.external
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <a href={href} className="footer-link" {...externalProps}>
      {link.label}
    </a>
  );
}

function FooterConnectIcons({ links }) {
  return (
    <div className="footer-connect">
      {links.map((link) => {
        const Icon = link.icon;
        const externalProps = link.external
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {};

        return (
          <a
            key={link.id}
            href={link.href}
            className="footer-connect-link"
            aria-label={link.label}
            {...externalProps}
          >
            <Icon size={14} strokeWidth={1.75} aria-hidden="true" />
          </a>
        );
      })}
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="footer" data-screen-label="Footer">
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="brand">
              <img src={asset('/assets/logo-mark-cream-flat.webp')} alt="Sugar & Leather" style={{ height: 38 }} />
            </Link>
            <p className="footer-mission">
              To humanize artificial intelligence by staying deeply human ourselves.
              <br />
              <span className="maxim">Built. Not given.</span>
            </p>
          </div>
          <div className="footer-col">
            <h4>Ecosystem</h4>
            {FOOTER_LINKS.ecosystem.map((link) => (
              <FooterLink key={link.label} link={link} />
            ))}
          </div>
          <div className="footer-col footer-col--connect">
            <h4>Connect</h4>
            {FOOTER_LINKS.connect.map((link) => (
              <FooterLink key={link.label} link={link} />
            ))}
            <FooterConnectIcons links={FOOTER_LINKS.social} />
          </div>
          <div className="footer-col">
            <h4>Product</h4>
            {FOOTER_LINKS.product.map((link) => (
              <FooterLink key={link.label} link={link} />
            ))}
          </div>
        </div>
        <div className="footer-base">
          <span className="small">&copy; 2026 Sugar &amp; Leather AI.</span>
          <span className="legal">
            <a href="#" className="footer-link" style={{ color: 'var(--mid-gray)' }}>
              Privacy
            </a>
            <a href="#" className="footer-link" style={{ color: 'var(--mid-gray)' }}>
              Terms
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
