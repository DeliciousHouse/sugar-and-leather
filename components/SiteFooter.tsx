import Link from "next/link";
import Container from "./Container";

export default function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <Container className="flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-zinc-500">
          © {new Date().getFullYear()} Sugar and Leather. All rights reserved.
        </div>
        <div className="flex items-center gap-4 text-sm text-zinc-600">
          <Link href="/privacy" className="transition-colors hover:text-zinc-900">
            Privacy
          </Link>
          <span className="text-zinc-300">•</span>
          <Link href="/terms" className="transition-colors hover:text-zinc-900">
            Terms
          </Link>
        </div>
      </Container>
    </footer>
  );
}
