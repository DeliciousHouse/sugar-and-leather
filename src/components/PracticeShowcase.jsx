import {
  Infinity,
  UserRound,
  Lock,
  Flame,
  GitBranch,
  UsersRound,
  Compass,
  Presentation,
  Route,
  Waypoints,
  BookOpen,
  RefreshCw,
  Landmark,
  FileText,
  Building2,
  Coins,
  TrendingUp,
  Map,
  Megaphone,
  Target,
  Code,
  UserPlus,
  Cpu,
  Workflow,
  Users,
  GraduationCap,
  Sparkles,
  Brain,
  Search,
  Bot,
  Share2,
  Link2,
  Layers,
  MessageSquare,
  Signal,
  Database,
  Activity,
  BarChart3,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useParallax } from '../hooks/useParallax';
import Eyebrow from './ui/Eyebrow';
import Reveal from './ui/Reveal';
import SplitText from './ui/SplitText';
import Button from './ui/Button';
import Carousel from './ui/Carousel';

const ICONS = {
  Infinity,
  UserRound,
  Lock,
  Flame,
  GitBranch,
  UsersRound,
  Compass,
  Presentation,
  Route,
  Waypoints,
  BookOpen,
  RefreshCw,
  Landmark,
  FileText,
  Building2,
  Coins,
  TrendingUp,
  Map,
  Megaphone,
  Target,
  Code,
  UserPlus,
  Cpu,
  Workflow,
  Users,
  GraduationCap,
  Sparkles,
  Brain,
  Search,
  Bot,
  Share2,
  Link2,
  Layers,
  MessageSquare,
  Signal,
  Database,
  Activity,
  BarChart3,
};

function FeatureIcon({ name }) {
  const Icon = ICONS[name];
  return Icon ? <Icon size={22} strokeWidth={1.75} /> : null;
}

function BodyCopy({ text }) {
  const lines = text.split('\n');
  if (lines.length === 1) return text;
  return lines.map((line, i) => (
    <span key={i}>
      {i > 0 ? <br /> : null}
      {line}
    </span>
  ));
}

function StaticShowVisual({ slide }) {
  if (!slide?.image) return null;

  return (
    <div className="carousel carousel--static">
      <div className="car-frame">
        <div className="car-slide">
          <div className="cs-photo" style={{ backgroundImage: `url('${slide.image}')` }} />
          <div className="cs-veil" />
          {slide.caption ? <span className="cs-caption">{slide.caption}</span> : null}
        </div>
      </div>
    </div>
  );
}

export default function PracticeShowcase({ practice }) {
  const visualRef = useParallax(0.06);
  const sectionClass = `show${practice.reverse ? ' reverse' : ''}`;

  return (
    <section className={sectionClass} id={practice.id} data-screen-label={practice.name}>
      <div className="wrap">
        <div className="show-grid">
          <div className="show-text">
            <div className="show-meta">
              <span className="num">{practice.num}</span>
              <Reveal as={Eyebrow}>{practice.eyebrow}</Reveal>
            </div>
            <SplitText as="h2" className="show-name display">
              {practice.name}
            </SplitText>
            {practice.tagline ? (
              <Reveal as="p" className="show-tagline" delay={2}>
                {practice.tagline}
              </Reveal>
            ) : null}
            <Reveal as="p" className="show-body" delay={3}>
              <BodyCopy text={practice.body} />
            </Reveal>
            <ul className="caps">
              {practice.features.map((feature, i) => (
                <Reveal as="li" className="cap" key={feature.title} delay={i}>
                  <span className="cap-ic">
                    <FeatureIcon name={feature.icon} />
                  </span>
                  <span>
                    {feature.href ? (
                      <Link to={feature.href} className="cap-t cap-t-link">
                        {feature.title}
                      </Link>
                    ) : (
                      <span className="cap-t">{feature.title}</span>
                    )}
                    {feature.description ? (
                      <span className="cap-d">{feature.description}</span>
                    ) : null}
                  </span>
                </Reveal>
              ))}
            </ul>
            <Reveal className="show-actions" delay={3}>
              <Button
                href={practice.cta.href}
                showArrow={practice.cta.showArrow ?? true}
              >
                {practice.cta.label}
              </Button>
            </Reveal>
          </div>
          <div className="show-visual" ref={visualRef} data-parallax="0.06">
            {practice.staticVisual ? (
              <StaticShowVisual slide={practice.slides[0]} />
            ) : (
              <Carousel slides={practice.slides} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
