import { Link } from "@tanstack/react-router";

const nav = [
  { to: "/library", label: "Archive" },
  { to: "/practice", label: "Practice" },
  { to: "/heritage", label: "Heritage" },
  { to: "/philosophy", label: "Philosophy" },
  { to: "/academics", label: "Academics" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link to="/" className="font-serif text-[22px] font-semibold italic tracking-tight">
          MudraVerse
        </Link>
        <nav className="hidden items-center gap-9 md:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="label text-foreground/60 transition-colors hover:text-foreground"
              activeProps={{ className: "label text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/practice" className="hidden label text-foreground/60 hover:text-foreground md:inline">
            Sign in
          </Link>
          <Link
            to="/practice"
            className="label inline-flex items-center gap-2 bg-foreground px-4 py-2.5 text-background transition-colors hover:bg-accent"
          >
            Begin practice
          </Link>
        </div>
      </div>
    </header>
  );
}
