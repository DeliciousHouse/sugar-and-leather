import Button from "@/components/Button";
import Card from "@/components/Card";
import Container from "@/components/Container";
import Section from "@/components/Section";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-zinc-50">
      <Section className="pt-16 sm:pt-20">
        <Container className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Full-stack marketing execution
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
              Marketing execution for small businesses that need steady output,
              not just strategy.
            </h1>
            <p className="text-lg leading-7 text-zinc-600">
              Sugar and Leather handles the day-to-day work across channels so you
              can focus on the business. We plan, produce, publish, and manage —
              with clear communication and measurable progress.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button href="/contact">Book a call</Button>
              <Button href="/services" variant="secondary">
                See services
              </Button>
            </div>
          </div>
          <Card className="space-y-4">
            <h2 className="text-base font-semibold text-zinc-900">
              What we handle
            </h2>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li>Facebook, Instagram, and TikTok content and posting</li>
              <li>LinkedIn presence and founder personal branding</li>
              <li>Website updates, landing pages, and positioning copy</li>
              <li>Responding to comments, DMs, and review requests</li>
              <li>Content creation (short-form, captions, campaigns)</li>
              <li>Optimization and performance reporting</li>
            </ul>
          </Card>
        </Container>
      </Section>

      <Section className="border-t border-zinc-200 bg-white">
        <Container className="space-y-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-zinc-900">
                How it works
              </h2>
              <p className="max-w-2xl text-base leading-7 text-zinc-600">
                We move fast without creating chaos. The process is simple and
                keeps you informed without extra meetings.
              </p>
            </div>
            <Link
              href="/how-it-works"
              className="text-sm font-medium text-zinc-900 underline-offset-4 hover:underline"
            >
              See the full process
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "1. Onboard quickly",
                text: "We gather access, assets, and goals so production can start immediately.",
              },
              {
                title: "2. Execute weekly",
                text: "We ship content, updates, and community responses on a steady cadence.",
              },
              {
                title: "3. Review and improve",
                text: "We share what is working and adjust without the churn.",
              },
            ].map((item) => (
              <Card key={item.title} className="space-y-3">
                <h3 className="text-base font-semibold text-zinc-900">
                  {item.title}
                </h3>
                <p className="text-sm leading-6 text-zinc-600">{item.text}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-zinc-900">
              Built for owners who need a dependable marketing partner
            </h2>
            <p className="text-base leading-7 text-zinc-600">
              We do the work, not just the planning. Expect clear schedules,
              rapid execution, and a team that can run the channels without
              constant oversight.
            </p>
          </div>
          <Card className="space-y-4">
            <h3 className="text-base font-semibold text-zinc-900">
              Next step
            </h3>
            <p className="text-sm leading-6 text-zinc-600">
              Book a call to review your goals, current channels, and where
              execution support would make the biggest difference.
            </p>
            <Button href="/contact" className="w-fit">
              Book a call
            </Button>
          </Card>
        </Container>
      </Section>
    </div>
  );
}
