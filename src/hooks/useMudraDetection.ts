/**
 * useMudraDetection — Real-time hand tracking + mudra classification
 * Uses MediaPipe Hands loaded from CDN (no npm install required).
 */
import { useEffect, useRef, useState, useCallback, type RefObject } from "react";

/* ─── Types ──────────────────────────────────────────────────── */
export type Landmark = { x: number; y: number; z: number };
export type HandLandmarks = Landmark[];

export interface DetectedMudra {
  id: string;
  name: string;
  confidence: number;
  fingerStates: boolean[]; // [thumb, index, middle, ring, pinky]
  corrections: string[];
  isCorrect: boolean;
}

export interface MudraDetectionState {
  isLoading: boolean;
  isRunning: boolean;
  landmarks: HandLandmarks | null;
  detectedMudra: DetectedMudra | null;
  handedness: string | null;
  error: string | null;
  fps: number;
}

/* ─── Hand skeleton connections (MediaPipe standard) ─────────── */
export const HAND_CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [0, 9], [9, 10], [10, 11], [11, 12],
  [0, 13], [13, 14], [14, 15], [15, 16],
  [0, 17], [17, 18], [18, 19], [19, 20],
  [5, 9], [9, 13], [13, 17], [0, 17],
];

/* ─── Mudra fingerprint definitions ─────────────────────────── */
interface MudraFingerprint {
  id: string;
  name: string;
  /** [thumb, index, middle, ring, pinky] — true = extended */
  fingers: [boolean, boolean, boolean, boolean, boolean];
  pinch?: boolean;   // thumb & index tips close together
  spread?: boolean;  // fingertips spread wide apart
  corrections: Record<string, string>;
  teacherNote: string;
}

const MUDRA_FINGERPRINTS: MudraFingerprint[] = [
  {
    id: "pathaka",
    name: "Pathaka",
    fingers: [false, true, true, true, true],
    spread: false,
    corrections: {
      thumb: "Bend your thumb inward against the palm",
      index: "Straighten and extend your index finger",
      middle: "Straighten and extend your middle finger",
      ring: "Straighten and extend your ring finger",
      pinky: "Straighten and extend your little finger",
      spread: "Keep all four fingers together, not spread",
    },
    teacherNote: "The flag — the most fundamental hasta. Begin every sequence here.",
  },
  {
    id: "alapadmam",
    name: "Alapadmam",
    fingers: [true, true, true, true, true],
    spread: true,
    corrections: {
      thumb: "Extend and open your thumb outward",
      index: "Spread your index finger wide",
      middle: "Spread your middle finger wide",
      ring: "Spread your ring finger wide",
      pinky: "Spread your little finger wide",
      spread: "Fan all five fingers outward from the wrist",
    },
    teacherNote: "A lotus in bloom — let each finger breathe.",
  },
  {
    id: "mushti",
    name: "Mushti",
    fingers: [false, false, false, false, false],
    corrections: {
      thumb: "Wrap your thumb over the curled fingers",
      index: "Curl your index finger into your palm",
      middle: "Curl your middle finger into your palm",
      ring: "Curl your ring finger into your palm",
      pinky: "Curl your little finger into your palm",
    },
    teacherNote: "Determined resolve — close the fist with intention.",
  },
  {
    id: "suchi",
    name: "Suchi",
    fingers: [false, true, false, false, false],
    corrections: {
      thumb: "Fold your thumb inward",
      index: "Point your index finger sharply upward",
      middle: "Curl your middle finger inward",
      ring: "Curl your ring finger inward",
      pinky: "Curl your little finger inward",
    },
    teacherNote: "The needle — one sharp point of focus.",
  },
  {
    id: "sikharam",
    name: "Sikharam",
    fingers: [true, true, false, false, false],
    corrections: {
      thumb: "Extend your thumb outward to support the index",
      index: "Raise your index finger fully upward",
      middle: "Curl your middle finger inward",
      ring: "Curl your ring finger inward",
      pinky: "Curl your little finger inward",
    },
    teacherNote: "A temple spire rising — index and thumb in harmony.",
  },
  {
    id: "hamsasyam",
    name: "Hamsasyam",
    fingers: [true, false, true, true, true],
    pinch: true,
    corrections: {
      thumb: "Bring your thumb tip to meet your index fingertip",
      index: "Curve your index to meet the thumb in a gentle pinch",
      middle: "Extend your middle finger gently",
      ring: "Extend your ring finger gently",
      pinky: "Extend your little finger gently",
      pinch: "Bring thumb and index closer — a precise pinch",
    },
    teacherNote: "The swan's beak — precision and delicate grace.",
  },
  {
    id: "mayura",
    name: "Mayura",
    fingers: [true, true, true, false, true],
    corrections: {
      thumb: "Extend your thumb",
      index: "Extend your index finger",
      middle: "Extend your middle finger",
      ring: "Bend your ring finger toward the thumb tip",
      pinky: "Extend your little finger",
    },
    teacherNote: "The peacock's neck — slow, proud movement.",
  },
  {
    id: "kangulam",
    name: "Kangulam",
    fingers: [false, true, true, true, false],
    corrections: {
      thumb: "Fold thumb inward",
      index: "Extend your index finger",
      middle: "Extend your middle finger",
      ring: "Extend your ring finger",
      pinky: "Bend your little finger inward",
    },
    teacherNote: "Subtle query — let the little finger rest.",
  },
  {
    id: "ardhachandran",
    name: "Ardhachandran",
    fingers: [true, true, true, true, true],
    spread: false,
    corrections: {
      thumb: "Extend your thumb outward to form the moon's arc",
      index: "Keep index close to middle finger",
      middle: "Keep fingers together",
      ring: "Keep fingers together",
      pinky: "Keep fingers together",
      spread: "Hold the four fingers together as one crescent",
    },
    teacherNote: "The crescent moon — thumb wide, fingers held as one.",
  },
  {
    id: "aralam",
    name: "Aralam",
    fingers: [false, true, false, false, false],
    corrections: {
      thumb: "Fold your thumb inward",
      index: "Raise your index finger straight up",
      middle: "Curl your middle finger",
      ring: "Curl your ring finger",
      pinky: "Curl your little finger",
    },
    teacherNote: "Point with purpose — a single direction of focus.",
  },
];

/* ─── Geometry helpers ───────────────────────────────────────── */
function dist(a: Landmark, b: Landmark): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);
}

function isFingerExtended(
  lm: HandLandmarks,
  tipIdx: number,
  pipIdx: number,
  mcpIdx: number,
): boolean {
  const wrist = lm[0];
  const tip = lm[tipIdx];
  const pip = lm[pipIdx];
  const mcp = lm[mcpIdx];
  // Tip must be further from wrist than mcp, and tip further from mcp than pip from mcp
  return dist(wrist, tip) > dist(wrist, pip) * 1.08 &&
    dist(mcp, tip) > dist(mcp, pip) * 0.9;
}

function isThumbExtended(lm: HandLandmarks): boolean {
  const tip = lm[4]; const ip = lm[3]; const mcp = lm[2]; const wrist = lm[0];
  return dist(wrist, tip) > dist(wrist, ip) * 1.05 &&
    dist(mcp, tip) > dist(mcp, ip) * 0.9;
}

function getFingerStates(lm: HandLandmarks): [boolean, boolean, boolean, boolean, boolean] {
  return [
    isThumbExtended(lm),
    isFingerExtended(lm, 8, 6, 5),
    isFingerExtended(lm, 12, 10, 9),
    isFingerExtended(lm, 16, 14, 13),
    isFingerExtended(lm, 20, 18, 17),
  ];
}

function isPinching(lm: HandLandmarks): boolean {
  const handSize = dist(lm[0], lm[9]);
  return dist(lm[4], lm[8]) < handSize * 0.28;
}

function isSpread(lm: HandLandmarks): boolean {
  const handSize = dist(lm[0], lm[9]);
  const tips = [lm[8], lm[12], lm[16], lm[20]];
  let total = 0;
  for (let i = 0; i < tips.length - 1; i++) total += dist(tips[i], tips[i + 1]);
  return (total / 3) > handSize * 0.32;
}

/* ─── Mudra classifier ───────────────────────────────────────── */
export function classifyMudra(
  lm: HandLandmarks,
  targetId?: string,
): DetectedMudra {
  const fingerStates = getFingerStates(lm);
  const pinch = isPinching(lm);
  const spread = isSpread(lm);
  const fingerNames = ["Thumb", "Index", "Middle", "Ring", "Pinky"];

  let bestScore = -1;
  let bestMudra: MudraFingerprint | null = null;

  for (const mudra of MUDRA_FINGERPRINTS) {
    let score = 0, total = 5;
    for (let i = 0; i < 5; i++) {
      if (fingerStates[i] === mudra.fingers[i]) score++;
    }
    if (mudra.pinch !== undefined) { total++; if (pinch === mudra.pinch) score++; }
    if (mudra.spread !== undefined) { total++; if (spread === mudra.spread) score++; }
    const s = score / total;
    if (s > bestScore) { bestScore = s; bestMudra = mudra; }
  }

  if (!bestMudra || bestScore < 0.45) {
    return {
      id: "unknown", name: "Unclear", confidence: 0, fingerStates: [...fingerStates],
      corrections: ["Bring your hand into clear camera view and hold a mudra"],
      isCorrect: false,
    };
  }

  // Build targeted corrections
  const corrections: string[] = [];
  if (targetId) {
    const target = MUDRA_FINGERPRINTS.find((m) => m.id === targetId);
    if (target && target.id !== bestMudra.id) {
      for (let i = 0; i < 5; i++) {
        if (fingerStates[i] !== target.fingers[i]) {
          const key = fingerNames[i].toLowerCase();
          if (target.corrections[key]) corrections.push(target.corrections[key]);
        }
      }
      if (target.pinch !== undefined && pinch !== target.pinch && target.corrections.pinch) {
        corrections.push(target.corrections.pinch);
      }
      if (target.spread !== undefined && spread !== target.spread && target.corrections.spread) {
        corrections.push(target.corrections.spread);
      }
    }
  }

  return {
    id: bestMudra.id,
    name: bestMudra.name,
    confidence: Math.round(bestScore * 100),
    fingerStates: [...fingerStates],
    corrections,
    isCorrect: targetId ? bestMudra.id === targetId && bestScore >= 0.8 : bestScore >= 0.8,
  };
}

/* ─── CDN loader ─────────────────────────────────────────────── */
const CDN = "https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915";

function loadScript(src: string): Promise<void> {
  return new Promise((res, rej) => {
    if (document.querySelector(`script[src="${src}"]`)) { res(); return; }
    const s = document.createElement("script");
    s.src = src; s.crossOrigin = "anonymous";
    s.onload = () => res(); s.onerror = rej;
    document.head.appendChild(s);
  });
}

/* ─── Main hook ──────────────────────────────────────────────── */
export function useMudraDetection(
  videoRef: RefObject<HTMLVideoElement | null>,
  targetMudraId?: string,
  isPaused?: boolean,
) {
  const handsRef = useRef<any>(null);
  const rafRef = useRef<number>(0);
  const lastFpsTime = useRef(performance.now());
  const frameCount = useRef(0);
  // Keep latest targetMudraId in a ref so the callback doesn't need to re-register
  const targetIdRef = useRef(targetMudraId);
  useEffect(() => { targetIdRef.current = targetMudraId; }, [targetMudraId]);
  const pausedRef = useRef(isPaused ?? false);
  useEffect(() => { pausedRef.current = isPaused ?? false; }, [isPaused]);

  const [state, setState] = useState<MudraDetectionState>({
    isLoading: true,
    isRunning: false,
    landmarks: null,
    detectedMudra: null,
    handedness: null,
    error: null,
    fps: 0,
  });

  const onResults = useCallback((results: any) => {
    // FPS tracking
    frameCount.current++;
    const now = performance.now();
    if (now - lastFpsTime.current >= 1000) {
      const fps = Math.round((frameCount.current * 1000) / (now - lastFpsTime.current));
      frameCount.current = 0;
      lastFpsTime.current = now;
      setState((s) => ({ ...s, fps }));
    }

    if (!results.multiHandLandmarks?.length) {
      setState((s) => ({
        ...s,
        landmarks: null,
        detectedMudra: null,
        handedness: null,
      }));
      return;
    }

    const lm: HandLandmarks = results.multiHandLandmarks[0];
    const handedness = results.multiHandedness?.[0]?.label ?? null;
    const detected = classifyMudra(lm, targetIdRef.current);
    setState((s) => ({
      ...s,
      isRunning: true,
      landmarks: lm,
      detectedMudra: detected,
      handedness,
    }));
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        await loadScript(`${CDN}/hands.js`);
        if (cancelled) return;

        const HandsClass = (window as any).Hands;
        if (!HandsClass) throw new Error("MediaPipe Hands failed to load");

        const hands = new HandsClass({
          locateFile: (f: string) => `${CDN}/${f}`,
        });
        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.65,
          minTrackingConfidence: 0.55,
        });
        hands.onResults(onResults);
        handsRef.current = hands;

        // Get camera stream
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720, facingMode: "user" },
        });
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }

        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        await video.play();

        setState((s) => ({ ...s, isLoading: false }));

        // Process frames
        async function processFrame() {
          if (cancelled || !videoRef.current || !handsRef.current) return;
          if (!pausedRef.current && videoRef.current.readyState >= 2) {
            await handsRef.current.send({ image: videoRef.current });
          }
          rafRef.current = requestAnimationFrame(processFrame);
        }
        rafRef.current = requestAnimationFrame(processFrame);
      } catch (err: any) {
        if (!cancelled) {
          setState((s) => ({
            ...s,
            isLoading: false,
            error: err?.message ?? "Camera or model error",
          }));
        }
      }
    }

    init();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      handsRef.current?.close?.();
      const video = videoRef.current;
      if (video?.srcObject) {
        (video.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
        video.srcObject = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return state;
}

/* ─── Exports for practice page ─────────────────────────────── */
export { MUDRA_FINGERPRINTS };
export type { MudraFingerprint };
