import { useState } from 'react';
import { HOMEPAGE_CTA, HOMEPAGE_PRODUCTS } from '../data/siteContent';
import Loader from '../components/Loader';
import Hero from '../components/Hero';
import Ecosystem from '../components/Ecosystem';
import PracticeShowcase from '../components/PracticeShowcase';
import Founder from '../components/Founder';
import FAQ from '../components/FAQ';
import HomeCommunity from '../components/HomeCommunity';
import CTA from '../components/CTA';

export default function HomePage() {
  const [heroReady, setHeroReady] = useState(false);

  return (
    <>
      <Loader onComplete={() => setHeroReady(true)} />
      <Hero ready={heroReady} />
      <Ecosystem />
      <div className="show-stack" id="products">
        {HOMEPAGE_PRODUCTS.map((practice, i) => (
          <div key={practice.id} className="show-sticky" style={{ '--stack-i': i + 1 }}>
            <PracticeShowcase practice={practice} />
          </div>
        ))}
      </div>
      <Founder />
      <FAQ />
      <HomeCommunity />
      <CTA
        title={HOMEPAGE_CTA.title}
        highlight={HOMEPAGE_CTA.highlight}
        sub={HOMEPAGE_CTA.sub}
        primaryLabel={HOMEPAGE_CTA.primaryLabel}
        primaryHref={HOMEPAGE_CTA.primaryHref}
        secondaryLabel={HOMEPAGE_CTA.secondaryLabel}
        secondaryHref={HOMEPAGE_CTA.secondaryHref}
      />
    </>
  );
}
