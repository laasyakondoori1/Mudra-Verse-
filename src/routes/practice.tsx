import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { MudraCamera } from "@/components/site/MudraCamera";
import { useMudraDetection, MUDRA_FINGERPRINTS } from "@/hooks/useMudraDetection";
import { mudras } from "@/lib/mudras";

export const Route = createFileRoute("/practice")({
  head: () => ({
    meta: [
      { title: "Practice Room — MudraVerse" },
      {
        name: "description",
        content:
          "Camera-based practice environment for classical Indian dance with real-time mudra detection and feedback.",
      },
      { property: "og:title", content: "Practice Room — MudraVerse" },
    ],
  }),
  component: PracticePage,
});

/* Mudras that our model can detect — cross-reference with mudras.ts */
const DETECTABLE_IDS = MUDRA_FINGERPRINTS.map((m) => m.id);

const PRACTICE_MUDRAS = mudras
  .filter((m) => DETECTABLE_IDS.includes(m.id))
  .slice(0, 10);

/* ─── Adi tāla beat labels ───────────────────────────────────── */
const TALA_BEATS = ["Tha", "Ka", "Dhi", "Mi", "Tha", "Ka", "Ju", "Nu"];

/* ─── Guru notes per mudra ──────────────────────────────────── */
const GURU_NOTES: Record<string, string> = {
  pathaka: "Don't perform the flag. Let it unfurl from within.",
  alapadmam: "Each finger is a petal — no two open at the same time.",
  mushti: "The closed fist holds more power than the open hand.",
  suchi: "One point of consciousness. Everything else falls away.",
  sikharam: "The spire does not lean — neither should the gesture.",
  hamsasyam: "Precision without tension — the beak does not clench.",
  mayura: "The peacock does not hurry. Inhabit its pride.",
  kangulam: "Subtlety is a virtue. This gesture whispers.",
  ardhachandran: "The moon is always complete, even when it appears partial.",
  aralam: "Direction is intention. Point with your whole being.",
};

function PracticePage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [targetId, setTargetId] = useState<string>(PRACTICE_MUDRAS[0]?.id ?? "pathaka");
  const [isPaused, setIsPaused] = useState(false);
  const [sessionSec, setSessionSec] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [talabeat, setTalaBeat] = useState(0);
  const [streak, setStreak] = useState(0);
  const prevCorrect = useRef(false);

  const detection = useMudraDetection(videoRef, targetId, isPaused);

  /* Session timer */
  useEffect(() => {
    if (isPaused) return;
    const t = setInterval(() => setSessionSec((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [isPaused]);

  /* Tāla metronome (every ~1.5 s per beat) */
  useEffect(() => {
    if (isPaused) return;
    const t = setInterval(() => setTalaBeat((b) => (b + 1) % 8), 1500);
    return () => clearInterval(t);
  }, [isPaused]);

  /* Track correct detections + streak */
  useEffect(() => {
    const isNowCorrect = detection.detectedMudra?.isCorrect ?? false;
    if (isNowCorrect && !prevCorrect.current) {
      setCorrectCount((c) => c + 1);
      setStreak((s) => s + 1);
    }
    if (!isNowCorrect) setStreak(0);
    prevCorrect.current = isNowCorrect;
  }, [detection.detectedMudra?.isCorrect]);

  const fmtTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const targetMudra = PRACTICE_MUDRAS.find((m) => m.id === targetId);
  const fingerprint = MUDRA_FINGERPRINTS.find((m) => m.id === targetId);
  const detected = detection.detectedMudra;
  const isCorrect = detected?.isCorrect ?? false;
  const corrections = detected?.corrections ?? [];
  const fingerNames = ["Thumb", "Index", "Middle", "Ring", "Pinky"];
  const targetFingers = fingerprint?.fingers ?? [false, false, false, false, false];

  return (
    <SiteShell>
      {/* ── Header ───────────────────────────────────────────── */}
      <section className="border-b border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 pb-10 pt-20 lg:flex-row lg:items-end lg:justify-between lg:px-10 lg:pt-24">
          <div>
            <p className="label text-foreground/40">Practice Room · Live Camera</p>
            <h1 className="mt-4 font-serif text-4xl font-medium sm:text-5xl">
              The practice room.
            </h1>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Stand at a comfortable distance. Select a mudra below and hold the gesture — the
              room will recognise and correct you in real time.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <Stat label="Session" value={fmtTime(sessionSec)} />
            <Stat label="Correct" value={`${correctCount}`} />
            <Stat label="Streak" value={`${streak}`} />
          </div>
        </div>
      </section>

      {/* ── Mudra selector ───────────────────────────────────── */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-5 lg:px-10">
          <p className="label mb-3 text-foreground/40">Choose mudra to practice</p>
          <div className="flex flex-wrap gap-2">
            {PRACTICE_MUDRAS.map((m) => (
              <button
                key={m.id}
                id={`mudra-btn-${m.id}`}
                onClick={() => setTargetId(m.id)}
                className="label rounded-none border px-4 py-2 transition-all duration-200"
                style={
                  targetId === m.id
                    ? {
                        background: "var(--charcoal)",
                        color: "var(--gold)",
                        borderColor: "var(--charcoal)",
                      }
                    : {
                        background: "transparent",
                        color: "inherit",
                        borderColor: "var(--border)",
                        opacity: 0.7,
                      }
                }
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main grid ────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">

          {/* ── Camera ───────────────────────────────────────── */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            {detection.error ? (
              <div className="flex aspect-video items-center justify-center bg-[#0B0B0F] text-center">
                <div>
                  <p className="label text-[color:var(--terracotta)] mb-3">Camera error</p>
                  <p className="font-mono text-xs text-white/50">{detection.error}</p>
                  <p className="mt-3 font-mono text-xs text-white/30">
                    Check browser camera permissions and reload.
                  </p>
                </div>
              </div>
            ) : (
              <MudraCamera
                videoRef={videoRef}
                landmarks={detection.landmarks}
                isLoading={detection.isLoading}
                isCorrect={isCorrect}
                detectedName={detected?.name ?? ""}
                confidence={detected?.confidence ?? 0}
                fps={detection.fps}
                isPaused={isPaused}
                bbox={detected?.bbox}
              />
            )}

            {/* Controls */}
            <div className="flex items-center justify-between">
              <button
                id="btn-pause"
                onClick={() => setIsPaused((p) => !p)}
                className="label border border-border px-5 py-2.5 text-foreground/70 transition hover:border-foreground/40 hover:text-foreground"
              >
                {isPaused ? "▶  Resume" : "⏸  Pause"}
              </button>
              <button
                id="btn-next-mudra"
                onClick={() => {
                  const idx = PRACTICE_MUDRAS.findIndex((m) => m.id === targetId);
                  const next = PRACTICE_MUDRAS[(idx + 1) % PRACTICE_MUDRAS.length];
                  setTargetId(next.id);
                }}
                className="label border border-border px-5 py-2.5 text-foreground/70 transition hover:border-foreground/40 hover:text-foreground"
              >
                Next mudra →
              </button>
            </div>

            {/* Tāla cycle */}
            <div className="bg-card p-6 ring-1 ring-black/5">
              <div className="flex items-baseline justify-between">
                <p className="label text-foreground/45">Adi tāla · 8 beats</p>
                <p className="label text-[color:var(--gold)]">Cycle</p>
              </div>
              <div className="mt-4 grid grid-cols-8 gap-1.5">
                {TALA_BEATS.map((_, i) => (
                  <div
                    key={i}
                    className="h-2 transition-all duration-300"
                    style={{
                      background:
                        i === talabeat
                          ? "var(--gold)"
                          : i < talabeat
                          ? "var(--charcoal)"
                          : "color-mix(in oklab, var(--charcoal) 15%, transparent)",
                      boxShadow: i === talabeat ? "0 0 8px var(--gold)" : "none",
                    }}
                  />
                ))}
              </div>
              <div className="mt-3 grid grid-cols-8 text-[10px] text-foreground/35">
                {TALA_BEATS.map((b, i) => (
                  <span
                    key={i}
                    className="font-mono uppercase tracking-widest transition-colors duration-200"
                    style={{ color: i === talabeat ? "var(--gold)" : undefined }}
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Side panel ───────────────────────────────────── */}
          <aside className="lg:col-span-4 flex flex-col gap-4">

            {/* Target reference */}
            {targetMudra && (
              <div className="bg-foreground text-background overflow-hidden">
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={targetMudra.image}
                    alt={targetMudra.name}
                    className="h-full w-full object-cover opacity-90 transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <p className="label text-[color:var(--gold)]">Target · {targetMudra.category}</p>
                  <p className="mt-2 font-serif text-2xl">{targetMudra.name}</p>
                  <p className="mt-1 font-mono text-xs text-background/50">{targetMudra.translation}</p>
                  <p className="mt-3 font-serif text-sm italic leading-relaxed text-background/70">
                    {targetMudra.description}
                  </p>
                </div>
              </div>
            )}

            {/* Live feedback engine */}
            <div className="bg-foreground p-5 text-background">
              <p className="label text-[color:var(--gold)]">Feedback engine</p>
              <dl className="mt-4 space-y-2.5 font-mono text-[11px]">
                {fingerNames.map((name, i) => {
                  const needed = targetFingers[i];
                  const actual = detection.detectedMudra?.fingerStates[i];
                  const ok = actual === needed;
                  const hasHand = !!detection.landmarks;
                  return (
                    <FeedbackRow
                      key={name}
                      label={name}
                      value={
                        !hasHand
                          ? "—"
                          : actual === true
                          ? "Extended"
                          : "Curled"
                      }
                      target={needed ? "Extended" : "Curled"}
                      tone={!hasHand ? "neutral" : ok ? "ok" : "warn"}
                    />
                  );
                })}
                <FeedbackRow
                  label="Hand present"
                  value={detection.landmarks ? "Yes" : "No"}
                  target="Yes"
                  tone={detection.landmarks ? "ok" : "warn"}
                />
                <FeedbackRow
                  label="Confidence"
                  value={detected ? `${detected.confidence}%` : "—"}
                  target="≥ 80%"
                  tone={
                    !detected ? "neutral" : detected.confidence >= 80 ? "ok" : "warn"
                  }
                />
              </dl>
            </div>

            {/* Corrections */}
            <div
              className="border-l-2 p-5 transition-all duration-300"
              style={{
                borderColor: isCorrect ? "var(--gold)" : "var(--terracotta)",
                background: "var(--card)",
              }}
            >
              <p className="label text-foreground/40">
                {isCorrect ? "✓ Correct form" : "Current correction"}
              </p>
              {isCorrect ? (
                <p className="mt-3 font-serif text-base italic leading-snug text-[color:var(--gold)]">
                  Excellent — hold the form and feel it settle.
                </p>
              ) : corrections.length > 0 ? (
                <ul className="mt-3 space-y-1.5">
                  {corrections.slice(0, 3).map((c, i) => (
                    <li key={i} className="flex items-start gap-2 font-serif text-sm italic leading-snug">
                      <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[color:var(--terracotta)]" />
                      {c}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 font-serif text-sm italic text-foreground/50">
                  {detection.landmarks
                    ? "Hold the mudra steadily for feedback."
                    : "Show your hand to the camera."}
                </p>
              )}
            </div>

            {/* Guru note */}
            <div className="bg-[color:var(--maroon)]/8 p-5">
              <p className="label text-accent">Guru note</p>
              <p className="mt-3 font-serif text-base italic leading-relaxed">
                "{GURU_NOTES[targetId] ?? fingerprint?.teacherNote ?? "Inhabit the gesture, do not perform it."}"
              </p>
              <p className="label mt-3 text-foreground/35">— Smt. R. Iyer</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-2">
              <SmallCard k="Session" v={fmtTime(sessionSec)} />
              <SmallCard k="Correct" v={`${correctCount}`} />
              <SmallCard k="Streak" v={`${streak}`} />
              <SmallCard k="FPS" v={detection.fps > 0 ? `${detection.fps}` : "—"} />
            </div>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}

/* ─── Sub-components ─────────────────────────────────────────── */
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-l border-border pl-4">
      <p className="label text-foreground/40">{label}</p>
      <p className="mt-1 font-serif text-lg">{value}</p>
    </div>
  );
}

function SmallCard({ k, v }: { k: string; v: string }) {
  return (
    <div className="bg-card p-4 ring-1 ring-black/5">
      <p className="label text-foreground/40">{k}</p>
      <p className="mt-2 font-serif text-xl">{v}</p>
    </div>
  );
}

function FeedbackRow({
  label,
  value,
  target,
  tone,
}: {
  label: string;
  value: string;
  target: string;
  tone: "ok" | "warn" | "neutral";
}) {
  const color =
    tone === "ok"
      ? "var(--gold)"
      : tone === "warn"
      ? "var(--terracotta)"
      : "rgba(255,255,255,0.45)";
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="uppercase tracking-widest text-background/40 shrink-0">{label}</dt>
      <div className="flex items-center gap-2 min-w-0">
        <dd className="font-mono text-right" style={{ color }}>
          {value}
        </dd>
        {tone !== "neutral" && (
          <span
            className="text-[9px] font-mono"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            / {target}
          </span>
        )}
      </div>
    </div>
  );
}
