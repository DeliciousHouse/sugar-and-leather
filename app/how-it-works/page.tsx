import type { Metadata } from "next";
import Card from "@/components/Card";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import Section from "@/components/Section";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "A five-step process that keeps marketing execution focused and reliable.",
};

const steps = [
  {
    title: "1. Onboarding",
    text: "We collect access, assets, and goals. You get a shared schedule and a single point of contact.",
  },
  {
    title: "2. Brand alignment",
    text: "We document brand voice, messaging, and channel priorities so work stays consistent.",
  },
  {
    title: "3. Execution",
    text: "We produce content, update channels, and manage community responses each week.",
  },
  {
    title: "4. Review & iteration",
    text: "We review what is performing and adjust output based on results and feedback.",
  },
  {
    title: "5. Ongoing management",
    text: "We keep the system running with steady output and ongoing improvements.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="bg-zinc-50">
      <PageHeader
        title="How it works"
        description="A simple, repeatable process that keeps execution moving without constant meetings."
      />
      <Section>
        <Container className="grid gap-6 lg:grid-cols-2">
          {steps.map((step) => (
            <Card key={step.title} className="space-y-3">
              <h2 className="text-lg font-semibold text-zinc-900">{step.title}</h2>
              <p className="text-sm leading-6 text-zinc-600">{step.text}</p>
            </Card>
          ))}
        </Container>
      </Section>
      <Section className="border-t border-zinc-200 bg-white">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-zinc-900">
              What we need from you
            </h3>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li>Access to social accounts, website, and existing assets</li>
              <li>Priority goals and any upcoming launches or promotions</li>
              <li>Decision-maker availability for quick approvals</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-zinc-900">
              What you can expect in week 1–2
            </h3>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li>Channel audit and quick wins list</li>
              <li>Brand voice notes and messaging baseline</li>
              <li>First batch of content and community responses</li>
            </ul>
          </div>
        </Container>
      </Section>
    </div>
  );
}
