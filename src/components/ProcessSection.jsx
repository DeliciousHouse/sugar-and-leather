import { ArrowDown, ArrowRight } from 'lucide-react';
import Eyebrow from './ui/Eyebrow';
import Reveal from './ui/Reveal';
import SplitText from './ui/SplitText';
import Button from './ui/Button';

export default function ProcessSection({ process, tone = 'dark', variant = 'cards' }) {
  if (!process?.steps?.length) return null;

  const isFlow = variant === 'flow';
  const steps = process.steps;

  return (
    <section
      className={`section page-process surface-${tone}${isFlow ? ' page-process--flow' : ''}`}
      id={process.id || undefined}
    >
      <div className="wrap">
        <div className="section-head">
          <div>
            <Reveal as={Eyebrow}>{process.eyebrow}</Reveal>
            <SplitText as="h2" className="display" style={{ marginTop: 22 }}>
              {process.title}
            </SplitText>
          </div>
        </div>

        {isFlow ? (
          <ol className="process-journey">
            {steps.map((step, i) => (
              <li className="process-journey-item" key={step.num} style={{ '--i': i }}>
                <Reveal className="process-journey-card" delay={Math.min(i, 5)}>
                  <span className="process-journey-num">{step.num}</span>
                  <div className="process-journey-marker" aria-hidden="true">
                    <span className="process-journey-ring" />
                    <span className="process-journey-core" />
                  </div>
                  <h3 className="process-journey-title">{step.title}</h3>
                  <p className="process-journey-desc">{step.description}</p>
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
                </Reveal>
                {i < steps.length - 1 ? (
                  <div className="process-journey-bridge" aria-hidden="true">
                    <span className="process-journey-dots" />
                    <span className="process-journey-arrow">
                      <ArrowRight className="process-journey-arrow-h" strokeWidth={1.75} />
                      <ArrowDown className="process-journey-arrow-v" strokeWidth={1.75} />
                    </span>
                  </div>
                ) : null}
              </li>
            ))}
          </ol>
        ) : (
          <ol className={`process-grid${steps.length === 4 ? ' process-grid--quad' : ''}`}>
            {steps.map((step, i) => (
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
        )}
      </div>
    </section>
  );
}
