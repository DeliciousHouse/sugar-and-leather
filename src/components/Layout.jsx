import { Outlet, useLocation } from 'react-router-dom';
import { useCustomCursor } from '../hooks/useCustomCursor';
import { useSeo } from '../hooks/useSeo';
import { useSmoothAnchor } from '../hooks/useSmoothAnchor';
import CustomCursor from './CustomCursor';
import Nav from './Nav';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';

export default function Layout() {
  useSmoothAnchor();
  useCustomCursor();
  useSeo();
  const { pathname } = useLocation();
  const hideFooter =
    pathname === '/innovation-and-advanced-tech' ||
    pathname.endsWith('/innovation-and-advanced-tech');

  return (
    <div className={`on-obsidian${hideFooter ? ' layout--no-footer' : ''}`}>
      <ScrollToTop />
      <CustomCursor />
      <Nav />
      <main id="top">
        <Outlet />
      </main>
      {hideFooter ? null : <Footer />}
    </div>
  );
}
