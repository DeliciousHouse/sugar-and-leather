import Eyebrow from './ui/Eyebrow';
import Reveal from './ui/Reveal';
import SplitText from './ui/SplitText';

export default function PodServicesSection({ services, tone = 'dark' }) {
  if (!services?.items?.length) return null;

  return (
    <section className={`section page-pod-services surface-${tone}`}>
      <div className="wrap">
        <div className="section-head">
          <div>
            <Reveal as={Eyebrow}>{services.eyebrow}</Reveal>
            <SplitText as="h2" className="display" style={{ marginTop: 22 }}>
              {services.title}
            </SplitText>
            {services.intro ? (
              <Reveal as="p" className="page-body page-body--wide" delay={1}>
                {services.intro}
              </Reveal>
            ) : null}
          </div>
        </div>
        <ul className="pod-services-grid">
          {services.items.map((item, i) => (
            <Reveal as="li" className="pod-service-card" key={item.title} delay={i % 6}>
              <span className="pod-service-num">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="pod-service-title">{item.title}</h3>
              {item.description ? (
                <p className="pod-service-desc">{item.description}</p>
              ) : null}
              {item.bullets?.length ? (
                <ul className="pod-service-bullets">
                  {item.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
