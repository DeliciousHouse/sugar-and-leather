import Eyebrow from './ui/Eyebrow';
import Reveal from './ui/Reveal';
import SplitText from './ui/SplitText';

export default function ContentSection({ section, tone = 'dark' }) {
  const { eyebrow, title, body, body2, bullets, image, reverse } = section;
  const sectionIdClass = section?.id ? ` page-section--${section.id}` : '';

  return (
    <section
      className={`section page-section surface-${tone}${reverse ? ' page-section--reverse' : ''}${sectionIdClass}`}
    >
      <div className="wrap">
        <div className="page-split">
          <div className="page-split-text">
            <Reveal as={Eyebrow}>{eyebrow}</Reveal>
            <SplitText as="h2" className="display" style={{ marginTop: 22 }}>
              {title}
            </SplitText>
            <Reveal as="p" className="page-body" delay={2}>
              {body}
            </Reveal>
            {body2 ? (
              <Reveal as="p" className="page-body" delay={2}>
                {body2}
              </Reveal>
            ) : null}
            {bullets?.length ? (
              <ul className="page-bullets">
                {bullets.map((item, i) => (
                  <Reveal as="li" key={item} delay={i + 2}>
                    {item}
                  </Reveal>
                ))}
              </ul>
            ) : null}
          </div>
          <Reveal className="page-split-visual" delay={2}>
            <div className="page-split-photo">
              {image ? (
                <img src={image} alt="" className="page-split-photo-img" loading="lazy" />
              ) : null}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
