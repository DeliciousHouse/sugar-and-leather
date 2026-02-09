import type { Metadata } from "next";
import Card from "@/components/Card";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import Section from "@/components/Section";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Capabilities we use to deliver better marketing outcomes for small businesses.",
};

export default function ProductsPage() {
  return (
    <div className="bg-zinc-50">
      <PageHeader
        title="Products"
        description="Capabilities we use to deliver better outcomes — clear tools, not hype."
      />
      <Section>
        <Container className="space-y-8">
          <Card className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Capability
              </p>
              <h2 className="text-xl font-semibold text-zinc-900">
                Rooted In The Town
              </h2>
              <p className="text-sm leading-6 text-zinc-600">
                A local-first content and community framework that captures what
                makes your business feel real in the neighborhood.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-zinc-900">Who it’s for</h3>
                <p className="text-sm text-zinc-600">
                  Main-street businesses that want consistent local visibility
                  without constant ad spend.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-zinc-900">
                  How it supports marketing work
                </h3>
                <p className="text-sm text-zinc-600">
                  Provides a repeatable format for local stories, partner
                  highlights, and community engagement.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-zinc-900">Limitations</h3>
                <p className="text-sm text-zinc-600">
                  It does not replace paid ads or PR campaigns, and it is not a
                  full rebrand.
                </p>
              </div>
            </div>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="space-y-3">
              <h2 className="text-lg font-semibold text-zinc-900">
                Content system
              </h2>
              <p className="text-sm leading-6 text-zinc-600">
                A repeatable weekly system for turning business updates into
                posts, stories, and short-form content.
              </p>
            </Card>
            <Card className="space-y-3">
              <h2 className="text-lg font-semibold text-zinc-900">
                Brand voice guidelines
              </h2>
              <p className="text-sm leading-6 text-zinc-600">
                A practical guide that keeps every post, response, and landing
                page consistent with how you want to sound.
              </p>
            </Card>
          </div>
        </Container>
      </Section>
    </div>
  );
}
