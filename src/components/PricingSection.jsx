import Eyebrow from './ui/Eyebrow';
import Reveal from './ui/Reveal';
import SplitText from './ui/SplitText';
import Button from './ui/Button';

export default function PricingSection({ pricing, tone = 'dark' }) {
  if (!pricing?.plans?.length) return null;

  return (
    <section className={`section page-pricing surface-${tone}`} id="pricing">
      <div className="wrap">
        <div className="section-head">
          <div>
            <Reveal as={Eyebrow}>{pricing.eyebrow}</Reveal>
            <SplitText as="h2" className="display" style={{ marginTop: 22 }}>
              {pricing.title}
            </SplitText>
            {pricing.intro ? (
              <Reveal as="p" className="lead pricing-intro" delay={1}>
                {pricing.intro}
              </Reveal>
            ) : null}
          </div>
        </div>
        <div className="pricing-grid">
          {pricing.plans.map((plan, i) => (
            <Reveal className="pricing-card" key={plan.title} delay={i}>
              <p className="pricing-card-title">{plan.title}</p>
              <p className="pricing-card-price">{plan.price}</p>
              <p className="pricing-card-desc">{plan.description}</p>
              {plan.includes?.length ? (
                <>
                  <p className="pricing-card-label">{plan.includesLabel || 'Includes:'}</p>
                  <ul className="pricing-card-list">
                    {plan.includes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </>
              ) : null}
              {plan.cta ? (
                <Button href={plan.cta.href} showArrow={false} magnetic={false}>
                  {plan.cta.label}
                </Button>
              ) : null}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
