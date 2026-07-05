import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToSection } from '../hooks/useSmoothAnchor';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      let attempts = 0;
      const tryScroll = () => {
        const target = document.querySelector(hash);
        if (target || attempts >= 12) {
          scrollToSection(hash);
          return;
        }
        attempts += 1;
        window.setTimeout(tryScroll, 80);
      };
      window.setTimeout(tryScroll, 80);
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
