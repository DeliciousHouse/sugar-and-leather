import Link from "next/link";
import Container from "./Container";

const navItems = [
  { href: "/services", label: "Services" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link href="/" className="text-sm font-semibold tracking-tight text-zinc-900">
          Sugar and Leather
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-zinc-600 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-zinc-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/contact"
          className="inline-flex items-center rounded-full border border-zinc-900 px-4 py-2 text-xs font-medium text-zinc-900 transition-colors hover:bg-zinc-900 hover:text-white"
        >
          Book a call
        </Link>
      </Container>
      <div className="border-t border-zinc-200 bg-white md:hidden">
        <Container className="flex flex-wrap gap-4 py-3 text-sm text-zinc-600">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-zinc-900"
            >
              {item.label}
            </Link>
          ))}
        </Container>
      </div>
    </header>
  );
}
