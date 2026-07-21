import { STRATEGIC_PARTNERSHIPS } from '../data/strategicPartnershipsContent';
import PageHero from '../components/PageHero';
import ExperienceBackedBy from '../components/ExperienceBackedBy';
import ContentSection from '../components/ContentSection';
import ProcessSection from '../components/ProcessSection';
import ExpertiseSection from '../components/ExpertiseSection';
import PodsDetailSection from '../components/PodsDetailSection';
import PartnerFitSection from '../components/PartnerFitSection';
import OutcomesSection from '../components/OutcomesSection';
import FAQSection from '../components/FAQSection';
import CTA from '../components/CTA';

export default function StrategicPartnershipsPage() {
  const page = STRATEGIC_PARTNERSHIPS;

  return (
    <div className="product-page strategic-partnerships-page">
      <PageHero
        eyebrow={page.eyebrow}
        title={page.heroTitle}
        highlight={page.heroHighlight}
        sub={page.heroSub}
        image={page.heroImage}
        primaryAction={page.primaryCta}
        secondaryAction={page.secondaryCta}
        footer={
          <ExperienceBackedBy
            label={page.experienceBackedBy.label}
            companies={page.experienceBackedBy.companies}
          />
        }
      />
      <ContentSection section={page.whatIs} tone="dark" />
      <ProcessSection process={page.process} tone="light" />
      <ExpertiseSection
        expertise={{
          eyebrow: page.executiveGuidance.eyebrow,
          title: page.executiveGuidance.title,
          intro: page.executiveGuidance.body,
          itemsLabel: page.executiveGuidance.itemsLabel,
          items: page.executiveGuidance.items,
        }}
        tone="dark"
      />
      <PodsDetailSection pods={page.pods} tone="light" />
      <PartnerFitSection section={page.idealPartners} tone="dark" />
      <OutcomesSection section={page.outcomes} tone="light" />
      <FAQSection
        items={page.faq}
        eyebrow="Strategic CXO team · FAQ"
        title={page.faqTitle}
        maxim={null}
        id={`${page.slug}-faq`}
        tone="dark"
      />
      <CTA {...page.cta} />
    </div>
  );
}
