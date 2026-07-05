import Eyebrow from './ui/Eyebrow';
import Reveal from './ui/Reveal';
import SplitText from './ui/SplitText';
import Button from './ui/Button';

export default function ProcessSection({ process, tone = 'dark' }) {
  if (!process?.steps?.length) return null;

  return (
    <section className={`section page-process surface-${tone}`} id={process.id || undefined}>
      <div className="wrap">
        <div className="section-head">
          <div>
            <Reveal as={Eyebrow}>{process.eyebrow}</Reveal>
            <SplitText as="h2" className="display" style={{ marginTop: 22 }}>
              {process.title}
            </SplitText>
          </div>
        </div>
        <ol className={`process-grid${process.steps.length === 4 ? ' process-grid--quad' : ''}`}>
          {process.steps.map((step, i) => (
            <Reveal as="li" className="process-step" key={step.num} delay={i}>
              <span className="process-num">{step.num}</span>
              <div>
                <h3 className="process-title">{step.title}</h3>
                <p className="process-desc">{step.description}</p>
                {step.cta ? (
                  <Button
                    href={step.cta.href}
                    variant="outline"
                    showArrow={false}
                    magnetic={false}
                    className="process-step-cta"
                  >
                    {step.cta.label}
                  </Button>
                ) : null}
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
