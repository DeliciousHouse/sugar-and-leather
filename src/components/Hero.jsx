import { useEffect } from 'react';
import { useHeroParallax } from '../hooks/useParallax';
import { HOMEPAGE_HERO } from '../data/siteContent';
import Eyebrow from './ui/Eyebrow';
import Reveal from './ui/Reveal';
import SplitText from './ui/SplitText';
import Button from './ui/Button';
import MarqueeStrip from './MarqueeStrip';

export default function Hero({ ready }) {
  const heroBgRef = useHeroParallax();

  useEffect(() => {
    if (!ready) return;
    document.querySelectorAll('.hero [data-reveal], .hero .split').forEach((el) => {
      el.classList.add('in');
    });
  }, [ready]);

  return (
    <section className="hero" data-screen-label="Hero">
      <div
        className="hero-bg"
        id="heroBg"
        ref={heroBgRef}
        style={{ backgroundImage: `url('${HOMEPAGE_HERO.heroImage}')` }}
      />
      <div className="hero-scrim" />
      <div className="hero-grain" />
      <div className="hero-content wrap">
        <div className="hero-center">
          <Reveal as={Eyebrow} center className="hero-eyebrow" delay={1}>
            {HOMEPAGE_HERO.eyebrow}
          </Reveal>
          <SplitText as="h1" className="display" id="heroTitle">
            {HOMEPAGE_HERO.title}
          </SplitText>
          <Reveal as="p" className="hero-sub" delay={3}>
            {HOMEPAGE_HERO.sub}
          </Reveal>
          <Reveal className="hero-actions" delay={4}>
            <Button href={HOMEPAGE_HERO.primaryCta.href}>{HOMEPAGE_HERO.primaryCta.label}</Button>
            <Button href={HOMEPAGE_HERO.secondaryCta.href} variant="outline" showArrow={false}>
              {HOMEPAGE_HERO.secondaryCta.label}
            </Button>
          </Reveal>
        </div>
      </div>
      <MarqueeStrip />
    </section>
  );
}
