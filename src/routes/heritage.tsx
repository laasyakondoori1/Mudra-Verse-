import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import guruPortrait from "@/assets/guru-portrait.jpg";

export const Route = createFileRoute("/heritage")({
  head: () => ({
    meta: [
      { title: "Heritage — MudraVerse" },
      {
        name: "description",
        content:
          "Long-form essays, lineages and primary references that give Bharatiya classical dance its meaning.",
      },
      { property: "og:title", content: "Heritage — MudraVerse" },
      {
        property: "og:description",
        content: "A reading room for the philosophy and history of Bharatiya classical dance.",
      },
    ],
  }),
  component: HeritagePage,
});

const timeline = [
  {
    era: "c. 200 BCE",
    title: "The Natya Shastra",
    body: "Bharata Muni compiles the foundational treatise on dramaturgy, codifying rasa, mudra and tāla.",
  },
  {
    era: "c. 1000 CE",
    title: "Temple repertoire",
    body: "The Chola dynasty builds vast temple complexes; devadasis preserve and refine Sadir, the precursor to Bharatanatyam.",
  },
  {
    era: "c. 1300 CE",
    title: "The Abhinaya Darpana",
    body: "Nandikeshvara composes a focused manual on hand gesture and expression that remains a primary teaching text.",
  },
  {
    era: "1932",
    title: "Renaissance",
    body: "Rukmini Devi Arundale and a generation of reformers reframe temple dance as Bharatanatyam, founding Kalakshetra.",
  },
  {
    era: "Today",
    title: "Living tradition",
    body: "Eight major classical forms continue to be taught one student at a time, in studios from Chennai to Toronto.",
  },
];

function HeritagePage() {
  return (
    <SiteShell>
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-20 lg:px-10 lg:pt-28">
          <p className="label text-foreground/40">Vol. III · Heritage</p>
          <h1 className="mt-6 max-w-4xl font-serif text-5xl font-medium leading-[1.05] sm:text-7xl">
            A short reading room.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            The grammar of Bharatiya classical dance is centuries old. These pages collect
            the texts, lineages and quiet histories that help make sense of a single
            gesture.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <img
              src={guruPortrait}
              alt="A senior guru in a temple courtyard."
              loading="lazy"
              className="aspect-[4/5] w-full object-cover ring-1 ring-black/5"
            />
            <p className="label mt-3 text-foreground/45">
              Plate iv · The lineage of patient teachers
            </p>
          </div>
          <div className="lg:col-span-7">
            <p className="label text-accent">Essay</p>
            <h2 className="mt-4 font-serif text-4xl font-medium leading-tight sm:text-5xl">
              On the patience of a single gesture.
            </h2>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-foreground/85">
              <p>
                A mudra is not a symbol you decode. It is a small, exact thing — a
                grammar carried in the hands. To learn one well is to slow down enough that
                your fingers begin to remember a shape your mind cannot quite name.
              </p>
              <p>
                The texts make this plain. The Abhinaya Darpana opens not with a definition
                but with an offering: the joined hands of Anjali, raised toward the guru,
                the audience and the divine. Before any meaning is exchanged, attention
                itself is the first gift.
              </p>
              <p>
                Our work begins from there. The archive is not a search engine for the
                sacred; it is a careful place to wait with a gesture until it begins to
                speak.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-secondary">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <p className="label text-foreground/40">A brief timeline</p>
          <h2 className="mt-4 font-serif text-4xl font-medium sm:text-5xl">
            Centuries, in five stops.
          </h2>
          <ol className="mt-12 space-y-px bg-border">
            {timeline.map((t) => (
              <li
                key={t.title}
                className="grid grid-cols-1 gap-6 bg-secondary px-2 py-8 sm:grid-cols-12 sm:px-6"
              >
                <p className="label sm:col-span-2 text-[color:var(--gold)]">{t.era}</p>
                <h3 className="font-serif text-2xl sm:col-span-3">{t.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground sm:col-span-7">
                  {t.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </SiteShell>
  );
}
