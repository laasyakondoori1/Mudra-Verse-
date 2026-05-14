import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";

export const Route = createFileRoute("/academics")({
  component: AcademicsPage,
});

function AcademicsPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-5xl px-6 py-24 lg:px-10 lg:py-32">
        <header className="mb-16 border-b border-background/10 pb-10">
          <p className="label text-[color:var(--terracotta)]">Academic Resources</p>
          <h1 className="mt-4 font-serif text-5xl font-medium sm:text-6xl text-foreground">
            Syllabi & Examinations
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            A comprehensive guide to formal dance education. From diploma courses to university degrees, access study materials, exam procedures, and career pathways in Bharatiya classical dance.
          </p>
        </header>

        <div className="space-y-24">
          <Section title="Degree & Certifications">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card 
                title="B.P.A / B.A in Dance" 
                desc="Three to four-year undergraduate programs focusing on practical performance, Natya Shastra theory, and historical context."
              />
              <Card 
                title="M.P.A / M.A in Dance" 
                desc="Postgraduate studies emphasizing research, choreography, nattuvangam, and advanced abhinaya."
              />
              <Card 
                title="Diploma & Certificate Courses" 
                desc="One to two-year foundation programs for those seeking structured learning outside a full degree."
              />
              <Card 
                title="Akhil Bharatiya Gandharva Mahavidyalaya" 
                desc="Graded examinations (Prarambhik to Visharad and Alankar) recognized nationwide."
              />
            </div>
          </Section>

          <Section title="Exam Procedures & Materials">
            <div className="space-y-8">
              <div className="bg-secondary p-8 border border-border">
                <h3 className="font-serif text-2xl text-foreground mb-4">Theory (Shastra)</h3>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground text-sm">
                  <li>Detailed study of Abhinaya Darpana and Natya Shastra.</li>
                  <li>History of dance lineages (Banis) and temple traditions.</li>
                  <li>Tala systems (Sapta Talas, Jathis) and musical accompaniment.</li>
                  <li>Biographies of legendary Gurus and Vaggeyakaras.</li>
                </ul>
              </div>
              
              <div className="bg-secondary p-8 border border-border">
                <h3 className="font-serif text-2xl text-foreground mb-4">Practical (Prayoga)</h3>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground text-sm">
                  <li>Demonstration of adavus in three speeds (Kalas).</li>
                  <li>Presentation of a complete Margam (Alarippu to Thillana).</li>
                  <li>Impromptu Abhinaya to a given Sahitya or Padam.</li>
                  <li>Nattuvangam practice and reciting Jathis.</li>
                </ul>
              </div>
            </div>
          </Section>

          <Section title="Career Pathways">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border-t-2 border-[color:var(--gold)] pt-4">
                <h4 className="font-serif text-xl mb-2">Performance & Choreography</h4>
                <p className="text-sm text-muted-foreground">Solo performer, ensemble member, or creative choreographer for classical and contemporary productions.</p>
              </div>
              <div className="border-t-2 border-[color:var(--terracotta)] pt-4">
                <h4 className="font-serif text-xl mb-2">Education & Academia</h4>
                <p className="text-sm text-muted-foreground">University professor, school instructor, or private Nattuvanar passing down the lineage.</p>
              </div>
              <div className="border-t-2 border-[color:var(--maroon)] pt-4">
                <h4 className="font-serif text-xl mb-2">Research & Archiving</h4>
                <p className="text-sm text-muted-foreground">Dance historian, museum curator, or arts administrator preserving cultural heritage.</p>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </SiteShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-8 font-serif text-3xl text-foreground">{title}</h2>
      {children}
    </section>
  );
}

function Card({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-card p-6 border border-border transition-colors hover:bg-secondary">
      <h3 className="font-serif text-xl text-foreground mb-3">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
    </div>
  );
}
