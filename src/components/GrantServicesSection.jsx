import Eyebrow from './ui/Eyebrow';
import Reveal from './ui/Reveal';
import SplitText from './ui/SplitText';
import Button from './ui/Button';

export default function GrantServicesSection({ section, tone = 'light' }) {
  if (!section?.items?.length) return null;

  return (
    <section
      className={`section page-grant-services surface-${tone}`}
      id={section.id || undefined}
    >
      <div className="wrap">
        <div className="section-head">
          <div>
            <Reveal as={Eyebrow}>{section.eyebrow}</Reveal>
            <SplitText as="h2" className="display" style={{ marginTop: 22 }}>
              {section.title}
            </SplitText>
          </div>
        </div>
        <div className="grant-services-grid">
          {section.items.map((item, i) => (
            <Reveal className="grant-services-card" key={item.title} delay={i}>
              <h3 className="grant-services-title">{item.title}</h3>
              <p className="grant-services-subtitle">{item.subtitle}</p>
              <ul className="grant-services-list">
                {item.services.map((service) => (
                  <li key={service}>{service}</li>
                ))}
              </ul>
              {item.cta ? (
                <Button href={item.cta.href} variant="outline" showArrow={false} magnetic={false}>
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
