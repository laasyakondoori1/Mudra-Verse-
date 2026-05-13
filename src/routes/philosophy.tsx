import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";

export const Route = createFileRoute("/philosophy")({
  head: () => ({
    meta: [
      { title: "Philosophy — MudraVerse" },
      {
        name: "description",
        content:
          "How MudraVerse thinks about technology, tradition and the people who carry it.",
      },
      { property: "og:title", content: "Philosophy — MudraVerse" },
      {
        property: "og:description",
        content: "Our principles for working alongside gurus, students and institutions.",
      },
    ],
  }),
  component: PhilosophyPage,
});

const principles = [
  {
    n: "i",
    title: "The guru leads.",
    body: "We do not certify, grade, or replace teachers. The platform exists in service of the guru–shishya relationship and our models are trained alongside senior practitioners.",
  },
  {
    n: "ii",
    title: "Restraint is a feature.",
    body: "Feedback is short, exact, and cited. We have no streak fireworks, no leaderboards on the home page, and no celebratory animations on a movement that took thirty years to refine.",
  },
  {
    n: "iii",
    title: "The archive is open.",
    body: "Mudra entries, references and historical notes are free to read. Where institutions contribute, they retain attribution and the right to remove material.",
  },
  {
    n: "iv",
    title: "Practice stays private.",
    body: "Camera footage is processed locally where possible and never used to train our models without explicit consent.",
  },
  {
    n: "v",
    title: "Context before capability.",
    body: "Each feature ships with the cultural reading that justifies it. If we cannot defend a feature in front of a teacher, we do not build it.",
  },
];

function PhilosophyPage() {
  return (
    <SiteShell>
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-10 lg:pt-28">
          <p className="label text-foreground/40">Vol. IV · Philosophy</p>
          <h1 className="mt-6 max-w-4xl font-serif text-5xl font-medium leading-[1.05] sm:text-7xl">
            Five principles, plainly stated.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            We work in a tradition that has survived for centuries by being careful. The
            way we build software should match.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <ol className="space-y-px bg-border">
          {principles.map((p) => (
            <li
              key={p.n}
              className="grid grid-cols-1 gap-8 bg-background px-2 py-12 sm:grid-cols-12 sm:px-8"
            >
              <p className="label text-[color:var(--gold)] sm:col-span-2">— {p.n}</p>
              <h3 className="font-serif text-3xl leading-tight sm:col-span-4">
                {p.title}
              </h3>
              <p className="text-base leading-relaxed text-muted-foreground sm:col-span-6">
                {p.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-border bg-foreground text-background">
        <div className="mx-auto max-w-3xl px-6 py-32 text-center lg:px-10">
          <p className="label text-[color:var(--gold)]">A closing word</p>
          <p className="mt-8 font-serif text-3xl italic leading-snug sm:text-4xl">
            “Yato hasta tato dṛṣṭi, yato dṛṣṭi tato manaḥ — where the hand goes, the eyes
            follow; where the eyes go, the mind follows.”
          </p>
          <p className="label mt-8 text-background/55">Nandikeshvara · Abhinaya Darpana</p>
        </div>
      </section>
    </SiteShell>
  );
}
