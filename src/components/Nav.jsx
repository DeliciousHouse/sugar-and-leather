import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useScrollNav } from '../hooks/useScrollNav';
import { scrollToSection } from '../hooks/useSmoothAnchor';
import { hashHref } from '../lib/asset';
import Brand from './ui/Brand';
import Button from './ui/Button';

const NAV_LINKS = [
  { href: '/#ecosystem', label: 'Ecosystem' },
  { href: '/about', label: 'About', route: true },
  { href: '/inquiry', label: 'Enquiry', route: true },
];

function NavAnchor({ href, label, route, onNavigate }) {
  const navigate = useNavigate();
  const location = useLocation();

  if (route) {
    return (
      <Link to={href} className="nav-link" onClick={onNavigate}>
        {label}
      </Link>
    );
  }

  if (href.startsWith('/#')) {
    const hash = href.slice(1);
    return (
      <a
        href={hashHref(hash)}
        className="nav-link"
        onClick={(e) => {
          e.preventDefault();
          onNavigate?.();
          if (location.pathname !== '/') {
            navigate('/');
            window.setTimeout(() => scrollToSection(hash), 80);
          } else {
            scrollToSection(hash);
          }
        }}
      >
        {label}
      </a>
    );
  }

  return (
    <a href={href} className="nav-link" onClick={onNavigate}>
      {label}
    </a>
  );
}

export default function Nav() {
  const scrolled = useScrollNav();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeDrawer = () => setDrawerOpen(false);

  useEffect(() => {
    if (!drawerOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeDrawer();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [drawerOpen]);

  return (
    <>
      <header className={`nav${scrolled ? ' scrolled' : ''}`} id="nav">
        <div className="nav-inner">
          <Brand />
          <nav className="nav-links">
            {NAV_LINKS.map((link) => (
              <NavAnchor key={`${link.label}-${link.href}`} {...link} />
            ))}
          </nav>
          <Button href="/#cta" variant="outline" className="nav-cta" magnetic={false}>
            Book a call
          </Button>
          <button
            type="button"
            className="nav-burger"
            aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen((open) => !open)}
          >
            {drawerOpen ? (
              <X size={26} strokeWidth={1.75} />
            ) : (
              <Menu size={26} strokeWidth={1.75} />
            )}
          </button>
        </div>
      </header>

      <div className={`nav-drawer${drawerOpen ? ' open' : ''}`} id="drawer">
        <button
          type="button"
          className="nd-close"
          aria-label="Close menu"
          onClick={closeDrawer}
        >
          <X size={30} strokeWidth={1.75} />
        </button>
        {NAV_LINKS.map((link) => (
          <NavAnchor key={`${link.label}-${link.href}`} {...link} onNavigate={closeDrawer} />
        ))}
        <NavAnchor href="/#cta" label="Book a call" onNavigate={closeDrawer} />
      </div>
    </>
  );
}
