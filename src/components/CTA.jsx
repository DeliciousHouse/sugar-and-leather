import { asset } from '../lib/asset';
import { CAL_BOOKING_URL } from '../lib/links';
import Reveal from './ui/Reveal';
import SplitText from './ui/SplitText';
import Button from './ui/Button';

export default function CTA({
  title = 'Some companies are given.',
  highlight = 'You will be built',
  sub = 'If you are leading through change and refuse to lose your humanity in the process, we should talk. Introductions are limited, and considered.',
  primaryLabel = 'Book a call',
  primaryHref = CAL_BOOKING_URL,
  secondaryLabel = 'Revisit the ecosystem',
  secondaryHref = '/#ecosystem',
  tone = 'dark',
}) {
  return (
    <section className={`cta surface-${tone}`} id="cta" data-screen-label="CTA">
      <div className="cta-glow" />
      <div className="wrap">
        <Reveal>
          <img className="cta-mark" src={asset('/assets/logo-mark-lavender-flat.webp')} alt="" />
        </Reveal>
        <SplitText as="h2" className="display">
          {highlight ? (
            <>
              {title} <br />
              <span className="serif-i">{highlight}</span>
            </>
          ) : (
            title
          )}
        </SplitText>
        <Reveal as="p" className="cta-sub" delay={2}>
          {sub}
        </Reveal>
        <Reveal className="cta-actions" delay={3}>
          <Button href={primaryHref}>{primaryLabel}</Button>
          {secondaryLabel ? (
            <Button href={secondaryHref} variant="outline" showArrow={false}>
              {secondaryLabel}
            </Button>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
