import Container from "./Container";

type PageHeaderProps = {
  title: string;
  description: string;
};

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="border-b border-zinc-200 bg-white">
      <Container className="py-12 sm:py-16">
        <div className="max-w-2xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Sugar and Leather
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            {title}
          </h1>
          <p className="text-base leading-7 text-zinc-600">{description}</p>
        </div>
      </Container>
    </div>
  );
}
