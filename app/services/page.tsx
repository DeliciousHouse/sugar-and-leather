import type { Metadata } from "next";
import Card from "@/components/Card";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import Section from "@/components/Section";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Execution-focused marketing services across social, web, community, and optimization.",
};

const services = [
  {
    title: "Social channels & content",
    description:
      "Publishing and management across the channels your customers actually use.",
    included: [
      "Content planning and posting for Facebook, Instagram, TikTok",
      "Short-form video, captions, and campaign calendars",
    ],
    excluded: ["Influencer sourcing", "Paid ad buying"],
  },
  {
    title: "Website & personal branding",
    description:
      "Clear messaging and updates that keep your digital front door current.",
    included: [
      "Landing pages, updates, and lightweight site edits",
      "Founder or team personal branding support on LinkedIn",
    ],
    excluded: ["Full website rebuilds", "Custom app development"],
  },
  {
    title: "Community management",
    description:
      "Daily responses that protect your brand and keep customers engaged.",
    included: ["Comment, DM, and review responses", "Escalation notes for your team"],
    excluded: ["24/7 moderation coverage", "Legal response handling"],
  },
  {
    title: "Growth & optimization",
    description:
      "Practical reporting and iteration that keeps momentum on track.",
    included: ["Monthly performance reporting", "Content and channel optimization"],
    excluded: ["Enterprise analytics tooling", "Attribution modeling builds"],
  },
];

export default function ServicesPage() {
  return (
    <div className="bg-zinc-50">
      <PageHeader
        title="Services"
        description="Execution-first marketing support for small businesses that need dependable output."
      />
      <Section>
        <Container className="grid gap-6 lg:grid-cols-2">
          {services.map((service) => (
            <Card key={service.title} className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-zinc-900">
                  {service.title}
                </h2>
                <p className="text-sm leading-6 text-zinc-600">
                  {service.description}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Included
                </p>
                <ul className="space-y-2 text-sm text-zinc-600">
                  {service.included.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Not included
                </p>
                <ul className="space-y-2 text-sm text-zinc-600">
                  {service.excluded.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </Container>
      </Section>
    </div>
  );
}
