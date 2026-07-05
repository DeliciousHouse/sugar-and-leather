import Eyebrow from './ui/Eyebrow';
import Reveal from './ui/Reveal';
import SplitText from './ui/SplitText';

export default function CapitalSupportSection({ section, tone = 'light' }) {
  if (!section) return null;

  return (
    <section className={`section page-section surface-${tone}`}>
      <div className="wrap">
        <div className="page-split">
          <div className="page-split-text">
            <Reveal as={Eyebrow}>{section.eyebrow}</Reveal>
            <SplitText as="h2" className="display" style={{ marginTop: 22 }}>
              {section.title}
            </SplitText>
            <Reveal as="p" className="page-body" delay={2}>
              {section.intro}
            </Reveal>
          </div>
        </div>
        <ol className="partner-fit-list partner-fit-list--capital">
          {section.items.map((item, i) => (
            <Reveal as="li" className="partner-fit-item" key={item} delay={i % 4}>
              <span className="partner-fit-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="partner-fit-label">{item}</span>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
