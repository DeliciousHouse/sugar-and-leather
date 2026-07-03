import Eyebrow from './ui/Eyebrow';
import Reveal from './ui/Reveal';
import SplitText from './ui/SplitText';
import Button from './ui/Button';

function MultilineText({ text }) {
  const lines = text.split('\n');
  if (lines.length === 1) return text;
  return lines.map((line, i) => (
    <span key={i}>
      {i > 0 ? <br /> : null}
      {line}
    </span>
  ));
}

export default function PageHero({
  eyebrow,
  title,
  highlight,
  sub,
  image,
  primaryAction,
  secondaryAction,
  actionNote,
  compact = false,
  fullViewport = false,
  stackedTitle = false,
  extraClass = '',
}) {
  const heroClass = [
    'page-hero',
    'surface-dark',
    compact && 'page-hero--compact',
    fullViewport && 'page-hero--viewport',
    extraClass,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section className={heroClass} data-screen-label="Hero">
      <div
        className="page-hero-bg"
        style={image ? { backgroundImage: `url('${image}')` } : undefined}
      />
      <div className="page-hero-scrim" />
      <div className="page-hero-grain" />
      <div className="wrap page-hero-content">
        <Reveal as={Eyebrow} center>
          {eyebrow}
        </Reveal>
        {stackedTitle && highlight ? (
          <Reveal as="h1" className="display page-hero-title">
            <span className="page-hero-title-line">{title}</span>
            <span className="page-hero-title-line serif-i">{highlight}</span>
          </Reveal>
        ) : (
          <SplitText as="h1" className="display page-hero-title">
            {title}
            {highlight ? (
              <>
                <br />
                <span className="serif-i">{highlight}</span>
              </>
            ) : null}
          </SplitText>
        )}
        {sub ? (
          <Reveal as="p" className="page-hero-sub" delay={2}>
            <MultilineText text={sub} />
          </Reveal>
        ) : null}
        {actionNote ? (
          <Reveal as="p" className="page-hero-action-note" delay={2}>
            {actionNote}
          </Reveal>
        ) : null}
        {primaryAction || secondaryAction ? (
          <Reveal className="page-hero-actions" delay={3}>
            {primaryAction ? (
              <Button href={primaryAction.href}>{primaryAction.label}</Button>
            ) : null}
            {secondaryAction ? (
              <Button href={secondaryAction.href} variant="outline" showArrow={false}>
                {secondaryAction.label}
              </Button>
            ) : null}
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
