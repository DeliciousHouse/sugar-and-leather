import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useScrollNav } from '../hooks/useScrollNav';
import { scrollToSection } from '../hooks/useSmoothAnchor';
import { hashHref } from '../lib/asset';
import { CAL_BOOKING_URL } from '../lib/links';
import Brand from './ui/Brand';
import Button from './ui/Button';

const NAV_LINKS = [
  { href: '/#ecosystem', label: 'Ecosystem' },
  { href: '/about', label: 'About', route: true },
  { href: '/inquiry', label: 'Inquiry', route: true },
];

const PRODUCT_LINKS = [
  { href: 'https://aries.sugarandleather.com/', label: 'Aries AI' },
  { href: 'https://sequence.sugarandleather.com/', label: 'Sequence' },
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

function NavProductDropdown() {
  return (
    <div className="nav-dropdown">
      <button type="button" className="nav-link nav-dropdown-toggle" aria-haspopup="true">
        Product
        <ChevronDown size={14} strokeWidth={1.75} aria-hidden="true" />
      </button>
      <div className="nav-dropdown-menu" role="menu">
        {PRODUCT_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="nav-dropdown-item"
            role="menuitem"
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}

function NavProductDrawer({ onNavigate, drawerOpen }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!drawerOpen) setOpen(false);
  }, [drawerOpen]);

  return (
    <div className={`nav-drawer-group${open ? ' is-open' : ''}`}>
      <button
        type="button"
        className="nav-drawer-toggle"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span>Product</span>
        <ChevronDown size={18} strokeWidth={1.75} aria-hidden="true" />
      </button>
      <div className="nav-drawer-submenu" aria-hidden={!open}>
        <div className="nav-drawer-submenu-inner">
          {PRODUCT_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="nav-drawer-sublink"
              target="_blank"
              rel="noopener noreferrer"
              onClick={onNavigate}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
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
            <NavAnchor href="/#ecosystem" label="Ecosystem" />
            <NavProductDropdown />
            {NAV_LINKS.slice(1).map((link) => (
              <NavAnchor key={`${link.label}-${link.href}`} {...link} />
            ))}
          </nav>
          <Button href={CAL_BOOKING_URL} variant="outline" className="nav-cta" magnetic={false}>
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
        <NavAnchor href="/#ecosystem" label="Ecosystem" onNavigate={closeDrawer} />
        <NavProductDrawer onNavigate={closeDrawer} drawerOpen={drawerOpen} />
        {NAV_LINKS.slice(1).map((link) => (
          <NavAnchor key={`${link.label}-${link.href}`} {...link} onNavigate={closeDrawer} />
        ))}
        <a href={CAL_BOOKING_URL} className="nav-drawer-link" onClick={closeDrawer}>
          Book a call
        </a>
      </div>
    </>
  );
}
