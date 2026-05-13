import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { mudras, danceForms, type Mudra, type MudraCategory } from "@/lib/mudras";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "The Mudra Archive — MudraVerse" },
      {
        name: "description",
        content:
          "A museum-grade archive of hand gestures from Bharatiya classical dance — searchable by form, category and rasa.",
      },
      { property: "og:title", content: "The Mudra Archive — MudraVerse" },
      {
        property: "og:description",
        content: "Searchable catalogue of mudras with Sanskrit meaning, rasa and references.",
      },
    ],
  }),
  component: LibraryPage,
});

const categories: MudraCategory[] = ["Asamyuta", "Samyuta", "Adavu", "Sthana"];

function LibraryPage() {
  const [q, setQ] = useState("");
  const [form, setForm] = useState<string>("All");
  const [cat, setCat] = useState<string>("All");
  const [open, setOpen] = useState<Mudra | null>(null);

  const filtered = useMemo(() => {
    return mudras.filter((m) => {
      const matchesForm = form === "All" || m.form === form;
      const matchesCat = cat === "All" || m.category === cat;
      const matchesQ =
        !q ||
        [m.name, m.translation, m.rasa, m.description, m.category]
          .join(" ")
          .toLowerCase()
          .includes(q.toLowerCase());
      return matchesForm && matchesCat && matchesQ;
    });
  }, [q, form, cat]);

  return (
    <SiteShell>
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-20 lg:px-10 lg:pt-28">
          <p className="label text-foreground/40">Vol. II · The archive</p>
          <h1 className="mt-6 max-w-4xl font-serif text-5xl font-medium leading-[1.05] sm:text-7xl">
            A catalogue of hand gestures, kept with care.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Each entry includes the Sanskrit name, the literal translation, the rasa it
            most often serves, and a citation from a primary text.
          </p>

          {/* Search */}
          <div className="mt-12 border-t border-border pt-8">
            <div className="relative max-w-md">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name, meaning, or rasa…"
                className="w-full border-b border-foreground/20 bg-transparent py-3 pl-7 text-base placeholder:text-foreground/40 focus:border-foreground focus:outline-none"
              />
              <span className="label absolute left-0 top-1/2 -translate-y-1/2 text-foreground/40">
                ⌕
              </span>
            </div>

            {/* Dance form filter */}
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="label text-foreground/30 mr-1">Form</span>
              {(["All", ...danceForms] as const).map((f) => {
                const active = form === f;
                return (
                  <button
                    key={f}
                    onClick={() => setForm(f)}
                    className={`label transition-colors ${
                      active ? "text-foreground" : "text-foreground/40 hover:text-foreground/70"
                    }`}
                  >
                    {f}
                    {active && <span className="ml-2 text-[color:var(--gold)]">·</span>}
                  </button>
                );
              })}
            </div>

            {/* Category filter */}
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="label text-foreground/30 mr-1">Type</span>
              {(["All", ...categories] as const).map((c) => {
                const active = cat === c;
                return (
                  <button
                    key={c}
                    onClick={() => setCat(c)}
                    className={`label transition-colors ${
                      active ? "text-foreground" : "text-foreground/40 hover:text-foreground/70"
                    }`}
                  >
                    {c}
                    {active && <span className="ml-2 text-[color:var(--gold)]">·</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        {filtered.length > 0 && (
          <p className="label mb-8 text-foreground/35">
            {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
            {form !== "All" && ` · ${form}`}
            {cat !== "All" && ` · ${cat}`}
          </p>
        )}
        {filtered.length === 0 ? (
          <div className="border border-dashed border-border px-6 py-24 text-center">
            <p className="label text-foreground/50">No entries</p>
            <p className="mt-3 font-serif text-2xl">Nothing matches that search.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try a broader form, or clear the query.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((m, i) => (
              <button
                key={m.id}
                onClick={() => setOpen(m)}
                className="group text-left"
              >
                <div className="flex items-baseline justify-between">
                  <p className="label text-[color:var(--gold)]">
                    No. {String(i + 1).padStart(3, "0")}
                  </p>
                  <p className="label text-foreground/40">{m.form}</p>
                </div>
                <div className="mt-4 aspect-[4/5] w-full overflow-hidden bg-secondary">
                  <img
                    src={m.image}
                    alt={`${m.name} mudra`}
                    width={800}
                    height={1000}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="mt-5 flex items-baseline justify-between">
                  <h3 className="font-serif text-2xl">{m.name}</h3>
                  <p className="label text-foreground/40">{m.category}</p>
                </div>
                <p className="mt-1 text-sm italic text-muted-foreground">{m.translation}</p>
              </button>
            ))}
          </div>
        )}
      </section>

      {open && <MudraSheet mudra={open} onClose={() => setOpen(null)} />}
    </SiteShell>
  );
}


function MudraSheet({ mudra, onClose }: { mudra: Mudra; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch justify-end bg-foreground/35 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex h-full w-full max-w-2xl flex-col overflow-y-auto bg-background"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-8 py-5">
          <p className="label text-foreground/50">{mudra.form} · {mudra.category}</p>
          <button onClick={onClose} className="label hover:text-accent">Close ✕</button>
        </div>
        <div className="aspect-[5/4] w-full overflow-hidden bg-secondary">
          <img
            src={mudra.image}
            alt={mudra.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="px-8 py-10">
          <p className="label text-[color:var(--gold)]">{mudra.rasa}</p>
          <h2 className="mt-3 font-serif text-5xl">{mudra.name}</h2>
          <p className="mt-2 font-serif text-xl italic text-muted-foreground">
            {mudra.translation}
          </p>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-foreground/85">
            <p>{mudra.description}</p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-6 border-t border-border pt-6 text-sm">
            <div>
              <p className="label text-foreground/40">Reference</p>
              <p className="mt-2 font-serif text-base italic">{mudra.reference}</p>
            </div>
            <div>
              <p className="label text-foreground/40">Companion gestures</p>
              <p className="mt-2 font-serif text-base italic">
                {mudra.companions?.join(", ") ?? "—"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
