import { Navigate, useParams } from 'react-router-dom';
import { ECOSYSTEM_PAGES } from '../data/ecosystemContent';
import { CAL_BOOKING_URL } from '../lib/links';
import PageHero from '../components/PageHero';
import OfferingsSection from '../components/OfferingsSection';
import ContentSection from '../components/ContentSection';
import SuccessStories from '../components/SuccessStories';
import FAQSection from '../components/FAQSection';
import CTA from '../components/CTA';

export default function EcosystemPage() {
  const { slug } = useParams();
  const product = ECOSYSTEM_PAGES[slug];

  if (!product) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="product-page ecosystem-page">
      <PageHero
        eyebrow={product.eyebrow}
        title={product.heroTitle}
        highlight={product.heroHighlight}
        sub={product.heroSub}
        image={product.heroImage}
        primaryAction={{
          label: 'Book a call',
          href: CAL_BOOKING_URL,
        }}
        secondaryAction={{
          label: 'All products',
          href: '/#ecosystem',
        }}
      />
      <OfferingsSection offerings={product.offerings} tone="dark" />
      {product.sections.map((section, i) => (
        <ContentSection
          key={section.id}
          section={section}
          tone={i % 2 === 0 ? 'light' : 'dark'}
        />
      ))}
      <SuccessStories stories={product.stories} tone="light" />
      <FAQSection
        items={product.faq}
        eyebrow={`${product.name} · FAQ`}
        title="Questions about this product"
        maxim={null}
        id={`${product.slug}-faq`}
        tone="dark"
      />
      <CTA {...product.cta} />
    </div>
  );
}
