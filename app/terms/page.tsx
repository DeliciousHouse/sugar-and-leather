import type { Metadata } from "next";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import Section from "@/components/Section";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of service placeholder for Sugar and Leather.",
};

export default function TermsPage() {
  return (
    <div className="bg-zinc-50">
      <PageHeader
        title="Terms"
        description="Placeholder terms of service. Replace with your official terms."
      />
      <Section>
        <Container className="space-y-4 text-sm text-zinc-600">
          <p>
            This is a placeholder terms of service page. Add details on service
            scope, payment terms, and responsibilities.
          </p>
        </Container>
      </Section>
    </div>
  );
}
