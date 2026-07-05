import { Navigate, useParams } from 'react-router-dom';
import { PRODUCT_PAGES } from '../data/pagesContent';
import { CAL_BOOKING_URL } from '../lib/links';
import PageHero from '../components/PageHero';
import ContentSection from '../components/ContentSection';
import SuccessStories from '../components/SuccessStories';
import FAQSection from '../components/FAQSection';
import CTA from '../components/CTA';

export default function ProductPage() {
  const { slug } = useParams();
  const product = PRODUCT_PAGES[slug];

  if (!product) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="product-page">
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
          label: 'Back to home',
          href: '/',
        }}
      />
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
        title="Questions about this practice"
        maxim={null}
        id={`${product.slug}-faq`}
        tone="dark"
      />
      <CTA {...product.cta} />
    </div>
  );
}
