import type { Metadata } from "next";
import Container from "@/components/Container";
import ContactForm from "@/components/ContactForm";
import FAQ from "@/components/FAQ";
import PageHeader from "@/components/PageHeader";
import Section from "@/components/Section";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book a call with Sugar and Leather to discuss marketing execution support.",
};

export default function ContactPage() {
  return (
    <div className="bg-zinc-50">
      <PageHeader
        title="Contact"
        description="Tell us what you need help with. We will respond within two business days."
      />
      <Section>
        <Container className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-zinc-900">
              Start with the basics
            </h2>
            <p className="text-sm leading-6 text-zinc-600">
              Share your goals, channel priorities, and timeline. We will reply
              with a clear next step and availability for a short call.
            </p>
            <div className="space-y-3 text-sm text-zinc-600">
              <p>
                Email: <span className="text-zinc-900">hello@sugarandleather.co</span>
              </p>
              <p>
                Based in: <span className="text-zinc-900">Your town, USA</span>
              </p>
            </div>
          </div>
          <ContactForm />
        </Container>
      </Section>
      <Section className="border-t border-zinc-200 bg-white">
        <Container className="space-y-6">
          <h2 className="text-2xl font-semibold text-zinc-900">FAQ</h2>
          <FAQ
            items={[
              {
                question: "How soon can we start?",
                answer:
                  "Most engagements start within 1–2 weeks after onboarding and access.",
              },
              {
                question: "Do you require long-term contracts?",
                answer:
                  "No. We prefer monthly agreements with clear goals and a shared cadence.",
              },
              {
                question: "Will we have a single point of contact?",
                answer:
                  "Yes. You will work with one lead who coordinates all execution.",
              },
            ]}
          />
        </Container>
      </Section>
    </div>
  );
}
