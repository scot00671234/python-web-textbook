import { Outlet } from "react-router-dom";
import { GlobalAudioPlayer } from "../components/GlobalAudioPlayer";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export function AppShell() {
  return (
    <div className="flex min-h-dvh flex-col text-[var(--text)]">
      <a
        href="#main-content"
        className="sr-only left-4 top-4 z-[100] rounded-full bg-[var(--text)] px-4 py-2 text-sm font-semibold text-[var(--bg)] no-underline focus:not-sr-only focus:absolute focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
      >
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <Outlet />
      </main>
      <SiteFooter />
      <GlobalAudioPlayer />
    </div>
  );
}
