import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";

export const Route = createFileRoute("/other-forms")({
  component: OtherFormsPage,
});

const otherFormsData = [
  {
    name: "Bharatanatyam",
    origin: "Tamil Nadu",
    description: "Known for its fixed upper torso, bent legs, and spectacular footwork. It is one of the oldest and most widely practiced classical forms.",
    contributors: 142,
  },
  {
    name: "Kathak",
    origin: "Northern India",
    description: "Characterized by intricate footwork, rapid spins, and rhythmic patterns. Historically performed by storytellers (Kathakars).",
    contributors: 89,
  },
  {
    name: "Odissi",
    origin: "Odisha",
    description: "Distinct for its 'Tribhangi' (three-part break) posture, graceful lyrical movements, and deep connections to temple sculptures.",
    contributors: 56,
  },
  {
    name: "Mohiniyattam",
    origin: "Kerala",
    description: "A highly graceful and feminine dance form. The movements are swaying and gentle, traditionally performed by women.",
    contributors: 34,
  },
  {
    name: "Manipuri",
    origin: "Manipur",
    description: "Deeply spiritual and delicate, known for its fluid movements and the famous Raas Leela depicting Krishna and the gopis.",
    contributors: 21,
  },
  {
    name: "Sattriya",
    origin: "Assam",
    description: "Originating in the Vaishnava monasteries (Sattras), it combines storytelling, intricate footwork, and devotion.",
    contributors: 18,
  },
  {
    name: "Yakshagana",
    origin: "Karnataka",
    description: "A theatrical dance-drama combining heavy costumes, fierce makeup, live music, and energetic movements.",
    contributors: 12,
  },
];

function OtherFormsPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-5xl px-6 py-24 lg:px-10 lg:py-32">
        <header className="mb-16 border-b border-border pb-10">
          <p className="label text-[color:var(--gold)]">Community Wiki</p>
          <h1 className="mt-4 font-serif text-5xl font-medium sm:text-6xl text-foreground">
            Other Classical Forms
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            While MudraVerse is currently focused heavily on Kuchipudi, the traditions of Bharatiya dance are vast. This space serves as a community-driven wiki where Gurus, practitioners, and scholars can contribute knowledge, teaching materials, and historical context for other classical forms.
          </p>
          
          <div className="mt-10 flex flex-wrap gap-4">
            <button className="label bg-foreground text-background px-6 py-3 hover:bg-accent transition-colors">
              Submit a Contribution
            </button>
            <button className="label border border-border text-foreground px-6 py-3 hover:bg-secondary transition-colors">
              Enroll as a Guru
            </button>
          </div>
        </header>

        <div className="space-y-6">
          {otherFormsData.map((form) => (
            <div key={form.name} className="group flex flex-col md:flex-row md:items-start justify-between gap-6 bg-card p-8 border border-border transition-colors hover:border-foreground/30">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <h3 className="font-serif text-2xl text-foreground">{form.name}</h3>
                  <span className="label px-3 py-1 bg-secondary text-foreground/60 rounded-full">{form.origin}</span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
                  {form.description}
                </p>
              </div>
              
              <div className="flex flex-col items-start md:items-end gap-4 shrink-0">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-xs">U</div>
                  <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-xs">P</div>
                  <div className="w-8 h-8 rounded-full bg-foreground text-background border border-border flex items-center justify-center text-[10px]">
                    +{form.contributors}
                  </div>
                </div>
                <Link to="#" className="label text-[color:var(--terracotta)] hover:underline underline-offset-4">
                  View Wiki →
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-secondary p-8 border border-border text-center">
          <h3 className="font-serif text-2xl text-foreground mb-4">Are you a practitioner?</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-lg mx-auto">
            Help us expand the archive. We are looking for scholars and dancers to document mudras, adavus, and theoretical texts for these forms.
          </p>
          <button className="label bg-foreground text-background px-6 py-3 hover:bg-accent transition-colors">
            Join the moderation team
          </button>
        </div>
      </div>
    </SiteShell>
  );
}
