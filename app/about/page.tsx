import type { Metadata } from "next";
import Card from "@/components/Card";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import Section from "@/components/Section";

export const metadata: Metadata = {
  title: "About",
  description:
    "A small, senior team focused on practical marketing execution for small businesses.",
};

const values = [
  {
    title: "Clarity beats noise",
    text: "We keep plans simple and focus on what will actually ship this week.",
  },
  {
    title: "Consistency builds trust",
    text: "We show up on schedule so your customers see steady, reliable output.",
  },
  {
    title: "Partnership over handoffs",
    text: "We stay close to the business and adapt as priorities change.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-zinc-50">
      <PageHeader
        title="About"
        description="We are a full-stack marketing execution partner for small businesses — not just a strategy shop."
      />
      <Section>
        <Container className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-zinc-900">How we work</h2>
            <p className="text-sm leading-6 text-zinc-600">
              Sugar and Leather supports owners who need dependable marketing
              output. We handle planning, production, and channel management so
              you are not stuck coordinating multiple freelancers or agencies.
            </p>
            <p className="text-sm leading-6 text-zinc-600">
              We work in weekly cycles, share progress openly, and keep you close
              to the work without asking for extra time.
            </p>
          </div>
          <Card className="space-y-3">
            <h3 className="text-lg font-semibold text-zinc-900">Values in action</h3>
            <ul className="space-y-3 text-sm text-zinc-600">
              {values.map((value) => (
                <li key={value.title}>
                  <span className="font-semibold text-zinc-900">
                    {value.title}:
                  </span>{" "}
                  {value.text}
                </li>
              ))}
            </ul>
          </Card>
        </Container>
      </Section>
      <Section className="border-t border-zinc-200 bg-white">
        <Container className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-zinc-900">Founders</h2>
            <p className="text-sm leading-6 text-zinc-600">
              A senior team with hands-on experience across small business
              marketing, content production, and community engagement.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {["Founder Name", "Founder Name"].map((name, index) => (
              <Card key={`${name}-${index}`} className="space-y-2">
                <h3 className="text-lg font-semibold text-zinc-900">{name}</h3>
                <p className="text-sm leading-6 text-zinc-600">
                  Placeholder bio for founder. Highlight relevant experience and
                  local business expertise.
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
}
