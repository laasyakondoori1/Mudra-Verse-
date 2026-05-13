import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { mudras, danceForms } from "@/lib/mudras";
import heroMudra from "@/assets/hero-mudra.jpg";
import practiceFeed from "@/assets/practice-feed.jpg";
import guruPortrait from "@/assets/guru-portrait.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MudraVerse — A digital sanctuary for Bharatiya classical dance" },
      {
        name: "description",
        content:
          "MudraVerse helps dancers practice classical Indian dance with culturally grounded AI guidance, a museum-grade mudra archive, and tools built alongside gurus.",
      },
      { property: "og:title", content: "MudraVerse — A digital sanctuary for Bharatiya classical dance" },
      {
        property: "og:description",
        content:
          "An archive, a practice room, and a quiet place to study the grammar of Indian classical dance.",
      },
      { property: "og:image", content: heroMudra },
      { property: "og:type", content: "website" },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <SiteShell>
      <Hero />
      <ArchiveTeaser />
      <PracticePreview />
      <Mission />
      <Capabilities />
      <Voices />
      <Closing />
    </SiteShell>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-end gap-12 px-6 pt-20 pb-28 lg:grid-cols-12 lg:gap-10 lg:px-10 lg:pt-28">
        <div className="animate-reveal lg:col-span-7">
          <p className="label mb-8 text-foreground/50">
            Vol. I · An archive in motion
          </p>
          <h1 className="text-balance font-serif text-[44px] font-medium leading-[1.02] tracking-tight sm:text-6xl lg:text-[88px]">
            The preservation of <em className="italic text-accent">sacred</em> motion.
          </h1>
          <p className="mt-8 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            MudraVerse is a quiet place to study Bharatiya classical dance. A museum-grade
            archive, a careful practice room, and tools built with the gurus who shaped them.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/practice"
              className="label inline-flex items-center bg-foreground px-7 py-4 text-background transition-colors hover:bg-accent"
            >
              Begin practice
            </Link>
            <Link
              to="/library"
              className="label inline-flex items-center border border-foreground/15 px-7 py-4 text-foreground/80 transition-colors hover:border-foreground/40 hover:text-foreground"
            >
              Enter the archive
            </Link>
          </div>
        </div>
        <div className="animate-reveal [animation-delay:160ms] lg:col-span-5">
          <figure className="relative">
            <img
              src={heroMudra}
              alt="A dancer's hand performing the Pataka mudra in warm dramatic light."
              width={1024}
              height={1280}
              className="aspect-[4/5] w-full object-cover ring-1 ring-black/5"
            />
            <figcaption className="label mt-3 flex items-center justify-between text-foreground/50">
              <span>Plate i · Pataka</span>
              <span>Bharatanatyam · Tanjavur lineage</span>
            </figcaption>
          </figure>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="rule" />
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 py-10 sm:grid-cols-4">
          {[
            ["108", "Documented mudras"],
            ["8", "Classical forms"],
            ["32", "Partnering institutions"],
            ["—", "Independent foundation"],
          ].map(([n, l]) => (
            <div key={l}>
              <p className="font-serif text-3xl font-medium">{n}</p>
              <p className="label mt-2 text-foreground/50">{l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArchiveTeaser() {
  return (
    <section className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="flex flex-col items-baseline justify-between gap-6 border-b border-background/10 pb-8 md:flex-row">
          <div>
            <p className="label text-background/40">The archive</p>
            <h2 className="mt-3 font-serif text-4xl font-medium sm:text-5xl">
              Hand gestures, catalogued by lineage.
            </h2>
          </div>
          <Link
            to="/library"
            className="label text-[color:var(--gold)] underline-offset-8 hover:underline"
          >
            View entire archive →
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
          {danceForms.map((f, i) => (
            <span
              key={f}
              className={`label transition-colors ${
                i === 0 ? "text-[color:var(--gold)]" : "text-background/40 hover:text-background/80"
              }`}
            >
              {f}
            </span>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-px bg-background/10 sm:grid-cols-2 lg:grid-cols-4">
          {mudras.map((m, i) => (
            <Link
              to="/library"
              key={m.id}
              className="group flex flex-col bg-foreground p-6 transition-colors hover:bg-background/5"
            >
              <p className="label text-[color:var(--gold)]">
                {String(i + 1).padStart(2, "0")} · {m.category}
              </p>
              <div className="my-6 aspect-square w-full overflow-hidden bg-background/5">
                <img
                  src={m.image}
                  alt={`${m.name} mudra`}
                  width={400}
                  height={400}
                  loading="lazy"
                  className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
                />
              </div>
              <h3 className="font-serif text-2xl">{m.name}</h3>
              <p className="mt-2 text-xs leading-relaxed text-background/50">
                {m.translation}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function PracticePreview() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="label text-[color:var(--terracotta)]">The practice room</p>
          <h2 className="mt-4 font-serif text-4xl font-medium leading-tight sm:text-5xl">
            Real-time corrections, drawn from the <em className="italic">Natya Shastra</em>.
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
            Our vision models are trained on archival footage of senior practitioners. The
            feedback you receive is precise, restrained, and rooted in tradition — not a
            score, but a small note from a careful teacher.
          </p>
          <ul className="mt-10 space-y-4 text-sm">
            {[
              "Twenty-one keypoint hand and skeletal tracking.",
              "Adavu sequence and tāla synchronisation.",
              "Abhinaya expression analysis with cultural context.",
            ].map((line) => (
              <li key={line} className="flex items-start gap-3">
                <span className="mt-[7px] inline-block size-1.5 shrink-0 rounded-full bg-[color:var(--gold)]" />
                <span className="text-foreground/80">{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-7">
          <div className="ring-1 ring-black/5 bg-card p-2">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
              <div className="md:col-span-2 relative overflow-hidden bg-foreground">
                <img
                  src={practiceFeed}
                  alt="A dancer practicing in a quiet studio."
                  width={1280}
                  height={800}
                  loading="lazy"
                  className="aspect-[5/4] w-full object-cover opacity-90"
                />
                <SkeletalOverlay />
                <div className="absolute bottom-3 left-3 flex items-center gap-3 bg-foreground/70 px-3 py-2 backdrop-blur-md">
                  <span className="size-1.5 animate-pulse rounded-full bg-[color:var(--gold)]" />
                  <span className="label text-background/80">Live · Adi Tāla</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex-1 bg-foreground p-5 text-background">
                  <p className="label text-[color:var(--gold)]">Feedback engine</p>
                  <dl className="mt-5 space-y-3 font-mono text-[11px] text-background/70">
                    <Row k="Stance" v="Aligned" tone="ok" />
                    <Row k="Mudra" v="Alapadma" tone="info" />
                    <Row k="Confidence" v="94.2%" />
                    <Row k="Tāla offset" v="+0.04s" />
                  </dl>
                  <div className="my-5 h-px bg-background/10" />
                  <p className="text-[11px] leading-relaxed text-background/55">
                    Extend the little finger four degrees outward to recover the lotus form.
                  </p>
                </div>
                <div className="bg-[color:var(--maroon)]/8 p-5">
                  <p className="label text-accent">Guru note</p>
                  <p className="mt-3 font-serif text-base italic leading-snug text-foreground/85">
                    “The fingers should bloom, not stretch.”
                  </p>
                </div>
              </div>
            </div>
          </div>
          <p className="label mt-4 text-foreground/40">
            Plate ii · Practice interface, 1080p · 60 fps
          </p>
        </div>
      </div>
    </section>
  );
}

function Row({ k, v, tone }: { k: string; v: string; tone?: "ok" | "info" }) {
  const color =
    tone === "ok"
      ? "text-[color:var(--gold)]"
      : tone === "info"
      ? "text-background"
      : "text-background/80";
  return (
    <div className="flex items-center justify-between">
      <dt className="uppercase tracking-widest text-background/45">{k}</dt>
      <dd className={color}>{v}</dd>
    </div>
  );
}

function SkeletalOverlay() {
  // Subtle, restrained joint dots — gestural, not gamified.
  const points = [
    [38, 44], [44, 38], [50, 36], [56, 38], [62, 44],
    [50, 50], [50, 60], [46, 70], [54, 70],
  ];
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full mix-blend-screen"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      {points.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r="0.6"
          fill="var(--gold)"
          opacity="0.85"
        />
      ))}
      {[
        [38, 44, 44, 38],
        [44, 38, 50, 36],
        [50, 36, 56, 38],
        [56, 38, 62, 44],
        [50, 36, 50, 50],
        [50, 50, 50, 60],
        [50, 60, 46, 70],
        [50, 60, 54, 70],
      ].map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="var(--gold)"
          strokeWidth="0.25"
          opacity="0.55"
        />
      ))}
    </svg>
  );
}

function Mission() {
  return (
    <section className="border-t border-border bg-secondary">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-24 lg:grid-cols-12 lg:gap-20 lg:px-10 lg:py-32">
        <div className="lg:col-span-6">
          <figure>
            <img
              src={guruPortrait}
              alt="A senior classical dance guru seated in a temple courtyard."
              width={1024}
              height={1280}
              loading="lazy"
              className="aspect-[4/5] w-full object-cover ring-1 ring-black/5"
            />
            <figcaption className="label mt-3 text-foreground/50">
              Plate iii · Guru in residence, Tiruvarur courtyard
            </figcaption>
          </figure>
        </div>
        <div className="lg:col-span-6 lg:pt-10">
          <p className="label text-accent">Our commitment</p>
          <h2 className="mt-4 font-serif text-4xl font-medium leading-tight sm:text-5xl">
            We are not replacing the guru. We are protecting their work.
          </h2>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
            <p>
              MudraVerse exists because much of what we know about Bharatiya classical dance
              lives in the bodies of senior practitioners. When a guru passes, a vocabulary
              of gesture often passes with them.
            </p>
            <p>
              We work with institutions across India to record, annotate and study these
              traditions carefully — and to give students a way to keep practicing when
              their teacher is far away, or no longer here.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-6 border-t border-border pt-8 sm:grid-cols-3">
            {[
              ["Heritage", "UNESCO-aligned"],
              ["Education", "NEP 2020"],
              ["Access", "Open archive"],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="label text-foreground/40">{k}</p>
                <p className="mt-2 font-serif text-lg">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Capabilities() {
  const items = [
    {
      n: "i",
      title: "Mudra archive",
      body: "A searchable catalogue of single and joined hand gestures — with Sanskrit meaning, rasa, and historical references.",
    },
    {
      n: "ii",
      title: "AI practice",
      body: "Camera-based feedback on posture, hand position and rhythm. Quiet, precise, and cited.",
    },
    {
      n: "iii",
      title: "Heritage stories",
      body: "Long-form essays on the lineages, temples, and stories that gave each movement its meaning.",
    },
    {
      n: "iv",
      title: "Guru tools",
      body: "Lesson planning, attendance, certification prep and student progress for teaching studios.",
    },
    {
      n: "v",
      title: "Community salons",
      body: "Small, moderated rooms for students, scholars and gurus — not a feed.",
    },
    {
      n: "vi",
      title: "Examination prep",
      body: "Theory, practical and viva preparation aligned with major state and university syllabi.",
    },
  ];
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-28">
        <div className="flex flex-col items-baseline justify-between gap-4 md:flex-row">
          <h2 className="font-serif text-4xl font-medium sm:text-5xl">What lives inside.</h2>
          <p className="label text-foreground/40">Six rooms, one foundation</p>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <div key={it.n} className="bg-background p-8">
              <p className="label text-[color:var(--gold)]">— {it.n}</p>
              <h3 className="mt-5 font-serif text-2xl">{it.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{it.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Voices() {
  const quotes = [
    {
      q: "I have been teaching for thirty-eight years. This is the first piece of software that listens before it speaks.",
      who: "Smt. Rukmini Iyer",
      role: "Senior guru, Bharatanatyam · Mylapore",
    },
    {
      q: "The corrections are small and exact. It feels like sitting in front of a careful teacher, not a game.",
      who: "Ananya Mohan",
      role: "Student · Toronto",
    },
    {
      q: "We are using the archive in our undergraduate programme. The references are clean enough to cite.",
      who: "Dr. K. Subramanian",
      role: "Department of Performing Arts",
    },
  ];
  return (
    <section className="border-t border-border bg-secondary">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <p className="label text-foreground/40">Voices</p>
        <div className="mt-10 grid grid-cols-1 gap-px bg-border md:grid-cols-3">
          {quotes.map((q) => (
            <figure key={q.who} className="bg-secondary p-8">
              <blockquote className="font-serif text-xl italic leading-snug text-foreground/90">
                “{q.q}”
              </blockquote>
              <figcaption className="mt-8">
                <p className="text-sm font-medium">{q.who}</p>
                <p className="label mt-1 text-foreground/45">{q.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section className="bg-foreground text-background">
      <div className="mx-auto max-w-5xl px-6 py-32 text-center lg:px-10">
        <p className="label text-[color:var(--gold)]">An invitation</p>
        <h2 className="mt-6 font-serif text-4xl font-medium leading-tight sm:text-6xl">
          Where the hand goes, the mind follows.
        </h2>
        <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-background/65">
          Spend a quiet half hour with the archive. Or step into the practice room and
          let an old vocabulary find your hands again.
        </p>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/practice"
            className="label inline-flex items-center bg-background px-7 py-4 text-foreground hover:bg-[color:var(--gold)]"
          >
            Begin practice
          </Link>
          <Link
            to="/library"
            className="label inline-flex items-center border border-background/20 px-7 py-4 text-background/85 hover:border-background/60"
          >
            Enter the archive
          </Link>
        </div>
      </div>
    </section>
  );
}
