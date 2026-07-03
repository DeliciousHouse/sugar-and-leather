import { COMMUNITY } from '../data/communityContent';
import PageHero from '../components/PageHero';
import ContentSection from '../components/ContentSection';
import CommunityOverviewSection from '../components/CommunityOverviewSection';
import CommunityProgramSection from '../components/CommunityProgramSection';
import FAQSection from '../components/FAQSection';
import CTA from '../components/CTA';

export default function CommunityPage() {
  const page = COMMUNITY;

  return (
    <div className="product-page community-page">
      <PageHero
        eyebrow={page.eyebrow}
        title={page.heroTitle}
        highlight={page.heroHighlight}
        sub={page.heroSub}
        image={page.heroImage}
        stackedTitle
        actionNote={page.heroActionNote}
        primaryAction={page.primaryCta}
      />
      <ContentSection section={page.knowledge} tone="dark" />
      <CommunityOverviewSection overview={page.overview} tone="light" />
      {page.programs.map((program, i) => (
        <CommunityProgramSection
          key={program.id}
          program={program}
          tone={i % 2 === 0 ? 'dark' : 'light'}
        />
      ))}
      <FAQSection
        items={page.faq}
        eyebrow={`${page.name} · FAQ`}
        title={page.faqTitle}
        subtitle={page.faqSubtitle}
        maxim={null}
        id="community-faq"
        tone="light"
      />
      <CTA {...page.cta} />
    </div>
  );
}
