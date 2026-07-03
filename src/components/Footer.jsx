import { Link } from 'react-router-dom';
import { asset, hashHref } from '../lib/asset';

const FOOTER_LINKS = {
  ecosystem: [
    { href: '/capital-access', label: 'Capital Access', route: true },
    { href: '/strategic-partnerships', label: 'Strategic Partnerships', route: true },
    { href: '/community', label: 'Community', route: true },
    { href: '/advanced-tech', label: 'Advanced Tech', route: true },
  ],
  firm: [
    { href: '/#founder', label: 'Founder' },
    { href: '/#faq', label: 'Enquiry' },
    { href: '/about', label: 'About', route: true },
    { href: '/#ecosystem', label: 'Philosophy' },
    { href: '/#cta', label: 'Introductions' },
  ],
  connect: [
    { href: 'mailto:hello@sugarandleather.com', label: 'hello@sugarandleather.com' },
    { href: '#', label: 'LinkedIn' },
    { href: '#', label: 'Instagram' },
    { href: '#', label: 'New York · London' },
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
  return <a href={link.href.startsWith('/#') ? hashHref(link.href.slice(1)) : link.href}>{link.label}</a>;
}

export default function Footer() {
  return (
    <footer className="footer" data-screen-label="Footer">
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="brand">
              <img src={asset('/assets/logo-mark-cream-flat.png')} alt="Sugar & Leather" style={{ height: 38 }} />
            </Link>
            <p className="footer-mission">
              To humanize artificial intelligence by staying deeply human ourselves.
              <br />
              <span className="maxim">Built. Not given.</span>
            </p>
          </div>
          <div className="footer-col">
            <h4>Products</h4>
            {FOOTER_LINKS.ecosystem.map((link) => (
              <FooterLink key={link.label} link={link} />
            ))}
          </div>
          <div className="footer-col">
            <h4>Firm</h4>
            {FOOTER_LINKS.firm.map((link) => (
              <FooterLink key={link.label} link={link} />
            ))}
          </div>
          <div className="footer-col">
            <h4>Connect</h4>
            {FOOTER_LINKS.connect.map((link) => (
              <FooterLink key={link.label} link={link} />
            ))}
          </div>
        </div>
        <div className="footer-base">
          <span className="small">&copy; 2026 Sugar &amp; Leather AI. By appointment only.</span>
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
