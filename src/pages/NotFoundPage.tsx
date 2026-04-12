import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";

export function NotFoundPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-20">
      <Seo title="Page not found" description="That URL is not part of pylearn." noIndex />
      <p className="text-sm font-medium text-[var(--muted)]">404</p>
      <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight">
        Page not found
      </h1>
      <p className="mt-4 text-base leading-relaxed text-[var(--muted)]">
        If you followed an old link, head back to the full lesson list.
      </p>
      <Link
        className="mt-8 inline-flex items-center justify-center rounded-full bg-[var(--text)] px-5 py-2 text-sm font-semibold text-[var(--bg)] no-underline"
        to="/learn"
      >
        Open all lessons
      </Link>
    </div>
  );
}
