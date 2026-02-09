import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

const base =
  "inline-flex items-center justify-center rounded-full border px-5 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-zinc-900";

const variants = {
  primary:
    "border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800 focus-visible:ring-offset-white",
  secondary:
    "border-zinc-200 bg-white text-zinc-900 hover:border-zinc-300 hover:bg-zinc-50 focus-visible:ring-offset-white",
};

export default function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: ButtonProps) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`.trim()}>
      {children}
    </Link>
  );
}
