type FAQItem = {
  question: string;
  answer: string;
};

type FAQProps = {
  items: FAQItem[];
};

export default function FAQ({ items }: FAQProps) {
  return (
    <div className="divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white">
      {items.map((item) => (
        <details key={item.question} className="group px-6 py-5">
          <summary className="cursor-pointer list-none text-base font-medium text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900">
            {item.question}
            <span className="float-right text-zinc-400 group-open:rotate-45">+</span>
          </summary>
          <p className="mt-3 text-sm leading-6 text-zinc-600">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
