import { CAPITAL_ACCESS } from '../data/capitalAccessContent';
import PageHero from '../components/PageHero';
import GrantFoundationSection from '../components/GrantFoundationSection';
import GrantServicesSection from '../components/GrantServicesSection';
import ProcessSection from '../components/ProcessSection';
import PricingSection from '../components/PricingSection';
import ContentSection from '../components/ContentSection';
import CapitalSupportSection from '../components/CapitalSupportSection';
import FAQSection from '../components/FAQSection';
import CTA from '../components/CTA';

export default function CapitalAccessPage() {
  const page = CAPITAL_ACCESS;

  return (
    <div className="product-page capital-access-page">
      <PageHero
        eyebrow={page.eyebrow}
        title={page.heroTitle}
        highlight={page.heroHighlight}
        sub={page.heroSub}
        image={page.heroImage}
        actionNote={page.heroActionNote}
        primaryAction={page.primaryCta}
        secondaryAction={page.secondaryCta}
      />
      <GrantFoundationSection section={page.foundation} tone="dark" />
      <GrantServicesSection section={page.grantSupport} tone="light" />
      <ProcessSection process={{ ...page.process, id: 'how-we-work' }} tone="dark" />
      <PricingSection pricing={page.pricing} tone="light" />
      <ContentSection section={page.deliverables} tone="dark" />
      <ContentSection section={{ ...page.beyond, reverse: true }} tone="light" />
      <CapitalSupportSection section={page.whoWeSupport} tone="dark" />
      <FAQSection
        items={page.faq}
        eyebrow={`${page.name} · FAQ`}
        title="Questions about grant support"
        maxim={null}
        id={`${page.slug}-faq`}
        tone="light"
      />
      <CTA {...page.cta} />
    </div>
  );
}
