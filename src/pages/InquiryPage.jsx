import { INQUIRY_PAGE } from '../data/inquiryContent';
import PageHero from '../components/PageHero';
import Reveal from '../components/ui/Reveal';
import InquiryForm from '../components/InquiryForm';
import InquiryContactPanel from '../components/InquiryContactPanel';

export default function InquiryPage() {
  const { eyebrow, title, highlight, sub, heroImage, form, contact, social, map, mailto } =
    INQUIRY_PAGE;

  return (
    <div className="product-page inquiry-page">
      <PageHero
        eyebrow={eyebrow}
        title={title}
        highlight={highlight}
        sub={sub}
        image={heroImage}
        stackedTitle
      />

      <section className="section inquiry-main">
        <div className="wrap">
          <div className="inquiry-grid">
            <Reveal className="inquiry-aside-col">
              <InquiryContactPanel contact={contact} social={social} />
            </Reveal>
            <Reveal className="inquiry-form-col" delay={1}>
              <InquiryForm form={form} mailto={mailto} />
            </Reveal>
          </div>

          <Reveal className="inquiry-map-section" delay={2}>
            <div className="inquiry-map-wrap inquiry-map-wrap--full">
              <h2 className="inquiry-map-heading">{map.title}</h2>
              <div className="inquiry-map inquiry-map--full">
                <iframe
                  src={map.embedUrl}
                  title="Sugar & Leather office location on Google Maps"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
              <a
                href={map.linkUrl}
                className="inquiry-map-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in Google Maps
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
