import type { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

export default function Section({ children, className = "", id }: SectionProps) {
  return (
    <section id={id} className={`py-16 sm:py-20 ${className}`.trim()}>
      {children}
    </section>
  );
}
