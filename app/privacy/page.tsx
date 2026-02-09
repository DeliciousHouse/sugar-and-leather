import type { Metadata } from "next";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import Section from "@/components/Section";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy policy placeholder for Sugar and Leather.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-zinc-50">
      <PageHeader
        title="Privacy"
        description="Placeholder privacy policy. Replace with your official policy."
      />
      <Section>
        <Container className="space-y-4 text-sm text-zinc-600">
          <p>
            This is a placeholder privacy policy. Add details on data handling,
            contact form submissions, and analytics usage.
          </p>
        </Container>
      </Section>
    </div>
  );
}
