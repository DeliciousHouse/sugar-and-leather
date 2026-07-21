import { asset } from '../lib/asset';
import { CAL_BOOKING_URL } from '../lib/links';
import Reveal from '../components/ui/Reveal';
import SplitText from '../components/ui/SplitText';
import Eyebrow from '../components/ui/Eyebrow';
import Button from '../components/ui/Button';

const BACKGROUND_IMAGE = asset('/assets/photo-night-work.webp');
const CONTACT_EMAIL = 'contact@sugarandleather.com';

export default function AdvancedTechComingSoonPage() {
  return (
    <div className="product-page advanced-tech-coming-soon-page">
      <section className="section coming-soon surface-dark">
        <div
          className="coming-soon-bg"
          style={{ backgroundImage: `url('${BACKGROUND_IMAGE}')` }}
          aria-hidden="true"
        />
        <div className="coming-soon-scrim" aria-hidden="true" />

        <div className="coming-soon-center">
          <Reveal as={Eyebrow} center>
            Innovation & Advanced Tech
          </Reveal>
          <SplitText as="h1" className="display coming-soon-title">
            Coming soon
          </SplitText>
          <Reveal as="p" className="coming-soon-live">
            We&apos;ll be live shortly at{' '}
            <a href="https://sugarandleather.ai/" target="_blank" rel="noopener noreferrer">
              https://sugarandleather.ai/
            </a>
          </Reveal>
        </div>

        <div className="coming-soon-footer wrap">
          <div className="coming-soon-footer-left">
            <p className="coming-soon-body">
              Want to know about Innovation &amp; Advanced Tech?
            </p>
            <Button href={CAL_BOOKING_URL}>Book a call</Button>
          </div>
          <div className="coming-soon-footer-right">
            <p className="coming-soon-email-label">Connect through email</p>
            <a className="coming-soon-mail" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
