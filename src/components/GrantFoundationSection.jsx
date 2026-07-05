import Eyebrow from './ui/Eyebrow';
import Reveal from './ui/Reveal';
import SplitText from './ui/SplitText';

export default function GrantFoundationSection({ section, tone = 'dark' }) {
  if (!section?.items?.length) return null;

  return (
    <section className={`section page-grant-foundation surface-${tone}`}>
      <div className="wrap">
        <div className="page-split">
          <div className="page-split-text">
            <Reveal as={Eyebrow}>{section.eyebrow}</Reveal>
            <SplitText as="h2" className="display" style={{ marginTop: 22 }}>
              {section.title}
            </SplitText>
            <Reveal as="p" className="page-body" delay={2}>
              {section.body}
            </Reveal>
            {section.body2 ? (
              <Reveal as="p" className="page-body" delay={2}>
                {section.body2}
              </Reveal>
            ) : null}
          </div>
          <Reveal className="page-split-visual" delay={2}>
            <div className="page-split-photo">
              {section.image ? (
                <img src={section.image} alt="" className="page-split-photo-img" loading="lazy" />
              ) : null}
            </div>
          </Reveal>
        </div>
        <div className="grant-foundation-grid">
          {section.items.map((item, i) => (
            <Reveal className="grant-foundation-card" key={item.title} delay={i}>
              <h3 className="grant-foundation-title">{item.title}</h3>
              <p className="grant-foundation-desc">{item.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
