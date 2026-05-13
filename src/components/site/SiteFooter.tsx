import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-20 md:grid-cols-12 lg:px-10">
        <div className="md:col-span-5">
          <Link to="/" className="font-serif text-2xl font-semibold italic">
            MudraVerse
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
            A digital sanctuary for Bharatiya classical dance — built with gurus, students,
            and researchers who care about getting the details right.
          </p>
        </div>
        <div className="md:col-span-7 grid grid-cols-2 gap-10 sm:grid-cols-3">
          <FooterCol
            title="Platform"
            items={[
              { to: "/library", label: "Mudra Archive" },
              { to: "/practice", label: "Practice" },
              { to: "/heritage", label: "Heritage" },
            ]}
          />
          <FooterCol
            title="Foundation"
            items={[
              { to: "/philosophy", label: "Philosophy" },
              { to: "/philosophy", label: "Research" },
              { to: "/philosophy", label: "Institutions" },
            ]}
          />
          <FooterCol
            title="Contact"
            items={[
              { to: "/", label: "Press" },
              { to: "/", label: "Careers" },
              { to: "/", label: "support@mudraverse.in" },
            ]}
          />
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-6 py-6 text-[11px] text-muted-foreground sm:flex-row sm:items-center lg:px-10">
          <span className="label">© {new Date().getFullYear()} MudraVerse Foundation</span>
          <span className="label">Bengaluru · Chennai · New York</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: { to: string; label: string }[];
}) {
  return (
    <div>
      <p className="label text-foreground/40">{title}</p>
      <ul className="mt-5 space-y-3">
        {items.map((it) => (
          <li key={it.label}>
            <Link to={it.to} className="text-sm text-foreground/75 hover:text-foreground">
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
