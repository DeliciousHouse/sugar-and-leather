import Eyebrow from './ui/Eyebrow';
import Reveal from './ui/Reveal';
import SplitText from './ui/SplitText';

export default function OutcomesSection({ section, tone = 'dark' }) {
  if (!section?.items?.length) return null;

  return (
    <section className={`section page-outcomes surface-${tone}`}>
      <div className="wrap">
        <div className="outcomes-head">
          <Reveal as={Eyebrow}>{section.eyebrow}</Reveal>
          <SplitText as="h2" className="display outcomes-title">
            {section.title}
          </SplitText>
        </div>
        <ul className="outcomes-grid">
          {section.items.map((item, i) => (
            <Reveal as="li" className="outcome-card" key={item} delay={i % 6}>
              <span className="outcome-num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="outcome-text">{item}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
