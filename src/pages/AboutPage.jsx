import { Link } from 'react-router-dom';
import { ABOUT_PAGE } from '../data/pagesContent';
import PageHero from '../components/PageHero';
import Eyebrow from '../components/ui/Eyebrow';
import Reveal from '../components/ui/Reveal';
import SplitText from '../components/ui/SplitText';
import CTA from '../components/CTA';

export default function AboutPage() {
  const { hero, name, mission, vision, leadership, philosophy, cta } = ABOUT_PAGE;

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        highlight={hero.highlight}
        sub={hero.sub}
        image={hero.image}
        primaryAction={hero.primaryAction}
        secondaryAction={hero.secondaryAction}
        fullViewport
        extraClass="page-hero--about"
      />

      <div className="about-hero-divider" aria-hidden="true" />

      <section className="section about-name">
        <div className="wrap">
          <Reveal as={Eyebrow}>{name.eyebrow}</Reveal>
          <SplitText as="h2" className="display about-name-title">
            {name.title}
            <br />
            {name.titleLine2}
          </SplitText>
          <div className="about-name-rule" aria-hidden="true" />
          <div className="about-name-grid">
            <Reveal className="about-name-card about-name-card--light">
              <div className="about-name-card-bar" aria-hidden="true" />
              <h3 className="about-name-card-title">{name.sugar.title}</h3>
              <p className="about-name-card-body">{name.sugar.body}</p>
              <p className="about-name-card-body">{name.sugar.body2}</p>
            </Reveal>
            <Reveal className="about-name-card about-name-card--dark" delay={1}>
              <div className="about-name-card-bar" aria-hidden="true" />
              <h3 className="about-name-card-title">{name.leather.title}</h3>
              <p className="about-name-card-body">{name.leather.body}</p>
              <p className="about-name-card-body">{name.leather.body2}</p>
            </Reveal>
          </div>
          {name.together ? (
            <>
              <Reveal className="about-name-together-wrap" delay={2}>
                <div className="about-name-together-box">
                  <p className="about-name-together-brand">{name.together.brand}</p>
                  <p className="about-name-together-lead">{name.together.lead}</p>
                  <p className="about-name-together-tag">{name.together.tag}</p>
                  <p className="about-name-together-body">{name.together.body}</p>
                </div>
              </Reveal>
              <div className="about-name-rule about-name-rule--below-together" aria-hidden="true" />
            </>
          ) : null}
        </div>
      </section>

      <section className="section about-mv">
        <div className="wrap">
          <div className="about-mv-stack">
            <Reveal className="about-mv-row">
              <div className="about-mv-aside">
                <Eyebrow>{mission.eyebrow}</Eyebrow>
              </div>
              <div className="about-mv-main">
                <h2 className="display about-mv-title">{mission.title}</h2>
                <p className="about-mv-body">{mission.body}</p>
                {mission.body2 ? <p className="about-mv-body">{mission.body2}</p> : null}
              </div>
            </Reveal>
            <div className="about-mv-divider" aria-hidden="true" />
            <Reveal className="about-mv-row" delay={1}>
              <div className="about-mv-aside">
                <Eyebrow>{vision.eyebrow}</Eyebrow>
              </div>
              <div className="about-mv-main">
                <h2 className="display about-mv-title about-mv-title--vision">
                  <span className="serif-i">
                    {vision.title}
                    <br />
                    {vision.titleLine2}
                    <br />
                    {vision.titleLine3}
                  </span>
                </h2>
                <p className="about-mv-body">{vision.body}</p>
                {vision.body2 ? <p className="about-mv-body">{vision.body2}</p> : null}
              </div>
            </Reveal>
            <div className="about-mv-end-rule" aria-hidden="true" />
          </div>
        </div>
      </section>

      <section className="section page-section page-section--reverse about-leadership">
        <div className="wrap">
          <div className="page-split">
            <Reveal className="page-split-visual" delay={1}>
              <div className="page-split-photo page-split-photo--portrait">
                <img
                  src={leadership.image}
                  alt="Troy Cunningham-Jackson and Audrey Cunningham-Jackson"
                  className="page-split-photo-img"
                  loading="lazy"
                />
              </div>
            </Reveal>
            <div className="page-split-text">
              <Reveal as={Eyebrow}>{leadership.eyebrow}</Reveal>
              <Reveal as="p" className="page-lead page-lead--quote" delay={1} style={{ marginTop: 22 }}>
                &ldquo;{leadership.quote}&rdquo;
              </Reveal>
              <Reveal as="p" className="page-body" delay={2}>
                {leadership.body}
              </Reveal>
              <Reveal className="founder-sign" delay={3}>
                <span className="sig">{leadership.title}</span>
                <span className="who">{leadership.role}</span>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="section page-philosophy">
        <div className="wrap">
          <Reveal as={Eyebrow}>{philosophy.eyebrow}</Reveal>
          <SplitText as="h2" className="display philosophy-title">
            {philosophy.title}
            {philosophy.titleLine2 ? (
              <>
                <br />
                {philosophy.titleLine2}
              </>
            ) : null}
          </SplitText>
          <Reveal as="p" className="page-body page-body--wide" delay={2}>
            {philosophy.body}
          </Reveal>
          <div className="philosophy-links">
            {philosophy.cards.map((card, i) => (
              <Reveal delay={i + 2} key={card.name}>
                <Link to={card.href} className="philosophy-link">
                  <span className="philosophy-link-name">{card.name}</span>
                  <span className="philosophy-link-tagline">{card.desc}</span>
                  {card.body ? <span className="philosophy-link-body">{card.body}</span> : null}
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTA {...cta} />
    </>
  );
}
