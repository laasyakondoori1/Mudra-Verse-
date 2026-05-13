/**
 * MudraCamera — live camera feed with hand skeleton overlay
 * Draws the 21 MediaPipe hand landmarks and connections in the app's gold palette.
 */
import { useRef, useEffect, type RefObject } from "react";
import type { HandLandmarks } from "@/hooks/useMudraDetection";
import { HAND_CONNECTIONS } from "@/hooks/useMudraDetection";

interface MudraCameraProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  landmarks: HandLandmarks | null;
  isLoading: boolean;
  isCorrect: boolean;
  detectedName: string;
  confidence: number;
  fps: number;
  isPaused: boolean;
}

/* Finger tip indices for coloured fingertip dots */
const FINGER_TIPS = [4, 8, 12, 16, 20];

export function MudraCamera({
  videoRef,
  landmarks,
  isLoading,
  isCorrect,
  detectedName,
  confidence,
  fps,
  isPaused,
}: MudraCameraProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* Draw skeleton on every landmarks change */
  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Match canvas to video natural size
    const W = video.videoWidth || 1280;
    const H = video.videoHeight || 720;
    canvas.width = W;
    canvas.height = H;

    ctx.clearRect(0, 0, W, H);

    if (!landmarks || landmarks.length === 0) return;

    const toX = (lm: { x: number }) => (1 - lm.x) * W; // mirror
    const toY = (lm: { y: number }) => lm.y * H;

    const goldOk = "rgba(200, 169, 106, 0.90)";   // var(--gold)
    const goldWarn = "rgba(166, 93, 70, 0.85)";    // var(--terracotta)
    const lineColor = isCorrect ? goldOk : goldWarn;

    /* Connections */
    ctx.lineWidth = W * 0.003;
    ctx.strokeStyle = lineColor;
    ctx.shadowColor = lineColor;
    ctx.shadowBlur = 8;
    for (const [a, b] of HAND_CONNECTIONS) {
      ctx.beginPath();
      ctx.moveTo(toX(landmarks[a]), toY(landmarks[a]));
      ctx.lineTo(toX(landmarks[b]), toY(landmarks[b]));
      ctx.stroke();
    }

    /* All landmark dots */
    ctx.shadowBlur = 0;
    for (let i = 0; i < landmarks.length; i++) {
      const isTip = FINGER_TIPS.includes(i);
      ctx.beginPath();
      ctx.arc(toX(landmarks[i]), toY(landmarks[i]), W * (isTip ? 0.007 : 0.004), 0, Math.PI * 2);
      ctx.fillStyle = isTip ? lineColor : "rgba(255,255,255,0.7)";
      ctx.fill();
    }

    /* Wrist dot (landmark 0) */
    ctx.beginPath();
    ctx.arc(toX(landmarks[0]), toY(landmarks[0]), W * 0.006, 0, Math.PI * 2);
    ctx.fillStyle = lineColor;
    ctx.fill();
  }, [landmarks, isCorrect, videoRef]);

  return (
    <div className="relative w-full overflow-hidden bg-[#0B0B0F]" style={{ aspectRatio: "16/9" }}>
      {/* Live video — mirrored */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ transform: "scaleX(-1)" }}
        muted
        playsInline
        autoPlay
      />

      {/* Skeleton canvas — not mirrored (we flip x in drawing code) */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ mixBlendMode: "screen" }}
      />

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0B0B0F]">
          <div className="relative mb-4 h-10 w-10">
            <div
              className="absolute inset-0 rounded-full border-2 border-[color:var(--gold)] opacity-30"
              style={{ animation: "ping 1.4s cubic-bezier(0,0,0.2,1) infinite" }}
            />
            <div className="absolute inset-1 rounded-full border border-[color:var(--gold)]" />
          </div>
          <p className="label text-[color:var(--gold)]">Initialising hand tracker…</p>
          <p className="mt-2 font-mono text-[11px] text-white/30">Loading MediaPipe model</p>
        </div>
      )}

      {/* Paused overlay */}
      {isPaused && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0B0B0F]/70 backdrop-blur-sm">
          <p className="label text-white/60">Session paused</p>
        </div>
      )}

      {/* Live badge */}
      {!isLoading && !isPaused && (
        <div className="absolute left-4 top-4 flex items-center gap-3 bg-black/55 px-3 py-2 backdrop-blur-sm">
          <span className="size-1.5 animate-pulse rounded-full bg-red-500" />
          <span className="label text-white/80">Live · {fps > 0 ? `${fps} fps` : "–"}</span>
        </div>
      )}

      {/* Detection HUD — bottom bar */}
      {!isLoading && (
        <div
          className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-white/10 px-5 py-3"
          style={{ background: "linear-gradient(to top, rgba(11,11,15,0.95), rgba(11,11,15,0.7))" }}
        >
          <div className="flex items-center gap-6">
            <div>
              <p className="label text-white/40">Detected</p>
              <p
                className="mt-0.5 font-serif text-lg transition-all duration-300"
                style={{ color: isCorrect ? "var(--gold)" : "var(--terracotta)" }}
              >
                {detectedName || "—"}
              </p>
            </div>
            <div>
              <p className="label text-white/40">Confidence</p>
              <p className="mt-0.5 font-mono text-sm" style={{ color: "var(--gold)" }}>
                {confidence > 0 ? `${confidence}%` : "—"}
              </p>
            </div>
          </div>
          {/* Confidence bar */}
          <div className="hidden w-32 sm:block">
            <div className="h-1 w-full rounded-full bg-white/10">
              <div
                className="h-1 rounded-full transition-all duration-500"
                style={{
                  width: `${confidence}%`,
                  background: isCorrect
                    ? "var(--gold)"
                    : "var(--terracotta)",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
