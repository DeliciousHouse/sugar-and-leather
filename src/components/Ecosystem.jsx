import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { ECOSYSTEM_CARDS, HOMEPAGE_ECOSYSTEM } from '../data/siteContent';
import { useTilt } from '../hooks/useMagnetic';
import Eyebrow from './ui/Eyebrow';
import Reveal from './ui/Reveal';
import SplitText from './ui/SplitText';

function EcoCard({ card }) {
  const { ref, onMouseMove, onMouseLeave } = useTilt();
  const isRoute = card.href.startsWith('/') && !card.href.startsWith('/#');
  const isExternal = card.external || card.href.startsWith('http');
  const CardTag = isRoute ? Link : 'a';
  const linkProps = isRoute
    ? { to: card.href }
    : {
        href: card.href,
        ...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
      };

  return (
    <CardTag
      {...linkProps}
      className={`eco-card ${card.className}${isExternal ? ' eco-card--external' : ''}`}
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      data-magnetic
      data-tilt
    >
      <div className="eco-photo" style={{ backgroundImage: `url('${card.photo}')` }} />
      <div className="eco-veil" />
      <div className="eco-go">
        <ArrowUpRight size={18} strokeWidth={1.75} />
      </div>
      <span className="eco-idx">{card.index}</span>
      <h3 className="eco-name">{card.name}</h3>
      <p className="eco-desc">{card.description}</p>
    </CardTag>
  );
}

export default function Ecosystem() {
  return (
    <section className="section" id="ecosystem" data-screen-label="Ecosystem">
      <div className="wrap">
        <div className="section-head">
          <div>
            <Reveal as={Eyebrow}>{HOMEPAGE_ECOSYSTEM.eyebrow}</Reveal>
            <SplitText as="h2" className="display" style={{ marginTop: 22 }}>
              {HOMEPAGE_ECOSYSTEM.titleLine1}
              <br />
              {HOMEPAGE_ECOSYSTEM.titleLine2}
            </SplitText>
          </div>
          <Reveal as="p" className="lead" delay={1}>
            {HOMEPAGE_ECOSYSTEM.intro}
          </Reveal>
        </div>
        <div className="eco-grid">
          {ECOSYSTEM_CARDS.map((card) => (
            <EcoCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
