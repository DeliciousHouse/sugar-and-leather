import Eyebrow from './ui/Eyebrow';
import Reveal from './ui/Reveal';
import SplitText from './ui/SplitText';
import Button from './ui/Button';

function ProgramCta({ cta }) {
  if (!cta) return null;

  const className = [
    'community-program-cta',
    cta.lavenderBorder ? 'community-cta--lavender' : '',
  ]
    .filter(Boolean)
    .join(' ');

  if (cta.disabled) {
    return (
      <span
        className={`btn btn-outline ${className} community-overview-cta--disabled`}
      >
        <span className="lab">{cta.label}</span>
      </span>
    );
  }

  return (
    <Button
      href={cta.href}
      variant="cream"
      showArrow={false}
      magnetic={false}
      className={className}
      {...(cta.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {cta.label}
    </Button>
  );
}

export default function CommunityProgramSection({ program, tone = 'dark' }) {
  if (!program) return null;

  return (
    <section
      className={`section page-community-program surface-${tone}`}
      id={program.id}
    >
      <div className="wrap">
        <div className="community-program-head">
          {program.comingSoon ? (
            <Reveal>
              <span className="community-badge community-badge--inline">Coming Soon</span>
            </Reveal>
          ) : null}
          {program.eyebrow ? <Reveal as={Eyebrow}>{program.eyebrow}</Reveal> : null}
          <SplitText as="h2" className="display community-program-title" style={{ marginTop: 22 }}>
            {program.title}
          </SplitText>
          {program.body ? (
            <Reveal as="p" className="page-body page-body--wide" delay={1}>
              {program.body}
            </Reveal>
          ) : null}
          {program.body2 ? (
            <Reveal as="p" className="page-body page-body--wide" delay={1}>
              {program.body2}
            </Reveal>
          ) : null}
          {program.body3 ? (
            <Reveal as="p" className="page-body page-body--wide" delay={2}>
              {program.body3}
            </Reveal>
          ) : null}
        </div>

        {program.audiences?.length ? (
          <div className="community-audience-grid">
            {program.audiences.map((audience, i) => (
              <Reveal className="community-audience-card" key={audience.label} delay={i}>
                <p className="community-audience-label">{audience.label}</p>
                <ul className="community-audience-list">
                  {audience.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        ) : null}

        {program.bullets?.length ? (
          <Reveal className="community-bullets-block" delay={2}>
            {program.bulletsLabel ? (
              <p className="community-bullets-label">{program.bulletsLabel}</p>
            ) : null}
            <ul className="community-bullets-list">
              {program.bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
        ) : null}

        {program.footnote ? (
          <Reveal as="p" className="community-footnote" delay={3}>
            {program.footnote}
          </Reveal>
        ) : null}

        {program.cta ? (
          <Reveal delay={3}>
            <ProgramCta cta={program.cta} />
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
