import { GraduationCap, Sparkles, Users } from 'lucide-react';
import Eyebrow from './ui/Eyebrow';
import Reveal from './ui/Reveal';
import SplitText from './ui/SplitText';
import Button from './ui/Button';

const ICONS = { Users, GraduationCap, Sparkles };

function CommunityIcon({ name }) {
  const Icon = ICONS[name];
  return Icon ? <Icon size={22} strokeWidth={1.75} /> : null;
}

export default function CommunityOverviewSection({ overview, tone = 'light' }) {
  if (!overview?.items?.length) return null;

  return (
    <section
      className={`section page-community-overview surface-${tone}`}
      id={overview.id}
    >
      <div className="wrap">
        <div className="section-head">
          <div>
            <Reveal as={Eyebrow}>{overview.eyebrow}</Reveal>
            <SplitText as="h2" className="display" style={{ marginTop: 22 }}>
              {overview.title}
            </SplitText>
            {overview.intro ? (
              <Reveal as="p" className="page-body page-body--wide" delay={1}>
                {overview.intro}
              </Reveal>
            ) : null}
          </div>
        </div>
        <div className="community-overview-grid">
          {overview.items.map((item, i) => (
            <Reveal className="community-overview-card" key={item.title} delay={i}>
              <div className="community-overview-icon">
                <CommunityIcon name={item.icon} />
              </div>
              <h3 className="community-overview-title">{item.title}</h3>
              <p className="community-overview-desc">{item.description}</p>
              {item.cta?.disabled ? (
                <span className="btn btn-outline community-overview-cta community-overview-cta--disabled">
                  <span className="lab">{item.cta.label}</span>
                </span>
              ) : item.cta ? (
                <Button
                  href={item.cta.href}
                  variant="cream"
                  showArrow={false}
                  magnetic={false}
                  className={[
                    'community-overview-cta',
                    item.cta.lavenderBorder ? 'community-cta--lavender' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  {...(item.cta.external
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                >
                  {item.cta.label}
                </Button>
              ) : null}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
