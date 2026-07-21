import { Navigate, useParams } from 'react-router-dom';
import { POD_PAGES } from '../data/podContent';
import { CAL_BOOKING_URL, HOW_IT_WORKS_HASH } from '../lib/links';
import PageHero from '../components/PageHero';
import ContentSection from '../components/ContentSection';
import ExpertiseSection from '../components/ExpertiseSection';
import PodServicesSection from '../components/PodServicesSection';
import PodPurposeBanner from '../components/PodPurposeBanner';
import ProcessSection from '../components/ProcessSection';
import FAQSection from '../components/FAQSection';
import CTA from '../components/CTA';

export default function PodPage() {
  const { podSlug } = useParams();
  const pod = POD_PAGES[podSlug];

  if (!pod) {
    return <Navigate to="/" replace />;
  }

  const [challenge, partnership, model] = pod.sections;
  const pageClass = ['product-page', 'pod-page', pod.pageClass].filter(Boolean).join(' ');

  return (
    <div className={pageClass}>
      <PageHero
        eyebrow={pod.eyebrow}
        title={pod.heroTitle}
        highlight={pod.heroHighlight}
        sub={pod.heroSub}
        image={pod.heroImage}
        stackedTitle
        primaryAction={{
          label: pod.heroPrimaryLabel || 'Book a Strategy Call',
          href: pod.heroPrimaryHref || CAL_BOOKING_URL,
        }}
        secondaryAction={{
          label: 'How we work',
          href: HOW_IT_WORKS_HASH,
        }}
      />
      {pod.purpose ? <PodPurposeBanner purpose={pod.purpose} tone="light" /> : null}
      <ContentSection section={challenge} tone="dark" />
      <ContentSection section={partnership} tone="light" />
      {pod.services ? (
        <PodServicesSection services={pod.services} tone="dark" />
      ) : (
        <ExpertiseSection expertise={pod.expertise} tone="dark" />
      )}
      <ProcessSection process={pod.process} tone="light" variant="flow" />
      <ContentSection section={model} tone="dark" />
      {pod.whoThisIsFor ? <ContentSection section={pod.whoThisIsFor} tone="light" /> : null}
      <FAQSection
        items={pod.faq}
        eyebrow={`${pod.name} · FAQ`}
        title={pod.faqTitle || `Questions about the ${pod.name}`}
        maxim={null}
        id={`${pod.slug}-faq`}
        tone="light"
      />
      <CTA {...pod.cta} />
    </div>
  );
}
