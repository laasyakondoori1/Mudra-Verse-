import { useEffect, useRef, useState, type RefObject } from "react";
import { InferenceEngine, CVImage } from "inferencejs";

/* ─── Types ──────────────────────────────────────────────────── */
export type Landmark = { x: number; y: number; z: number };
export type HandLandmarks = Landmark[]; // Kept for compatibility

export interface DetectedMudra {
  id: string;
  name: string;
  confidence: number;
  fingerStates: boolean[]; // Mocked from known states
  corrections: string[];
  isCorrect: boolean;
  bbox?: { x: number; y: number; width: number; height: number };
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

/* ─── Hand skeleton connections ─────────────────────────── */
export const HAND_CONNECTIONS: [number, number][] = [];

/* ─── Mudra fingerprint definitions ─────────────────────────── */
interface MudraFingerprint {
  id: string;
  name: string;
  roboflowClass: string;
  fingers: [boolean, boolean, boolean, boolean, boolean];
  corrections: Record<string, string>;
  teacherNote: string;
}

const MUDRA_FINGERPRINTS: MudraFingerprint[] = [
  {
    id: "pathaka",
    name: "Pathaka",
    roboflowClass: "Pataka",
    fingers: [false, true, true, true, true],
    corrections: {},
    teacherNote: "The flag — the most fundamental hasta. Begin every sequence here.",
  },
  {
    id: "alapadmam",
    name: "Alapadmam",
    roboflowClass: "Alapadma",
    fingers: [true, true, true, true, true],
    corrections: {},
    teacherNote: "A lotus in bloom — let each finger breathe.",
  },
  {
    id: "mushti",
    name: "Mushti",
    roboflowClass: "Mushti",
    fingers: [false, false, false, false, false],
    corrections: {},
    teacherNote: "Determined resolve — close the fist with intention.",
  },
  {
    id: "suchi",
    name: "Suchi",
    roboflowClass: "Suchi",
    fingers: [false, true, false, false, false],
    corrections: {},
    teacherNote: "The needle — one sharp point of focus.",
  },
  {
    id: "sikharam",
    name: "Sikharam",
    roboflowClass: "Shikhara",
    fingers: [true, true, false, false, false],
    corrections: {},
    teacherNote: "A temple spire rising — index and thumb in harmony.",
  },
  {
    id: "hamsasyam",
    name: "Hamsasyam",
    roboflowClass: "Hamsasya",
    fingers: [true, false, true, true, true],
    corrections: {},
    teacherNote: "The swan's beak — precision and delicate grace.",
  },
  {
    id: "mayura",
    name: "Mayura",
    roboflowClass: "Mayura",
    fingers: [true, true, true, false, true],
    corrections: {},
    teacherNote: "The peacock's neck — slow, proud movement.",
  },
  {
    id: "kangulam",
    name: "Kangulam",
    roboflowClass: "Kangula",
    fingers: [false, true, true, true, false],
    corrections: {},
    teacherNote: "Subtle query — let the little finger rest.",
  },
  {
    id: "ardhachandran",
    name: "Ardhachandran",
    roboflowClass: "Ardhachandra",
    fingers: [true, true, true, true, true],
    corrections: {},
    teacherNote: "The crescent moon — thumb wide, fingers held as one.",
  },
  {
    id: "aralam",
    name: "Aralam",
    roboflowClass: "Arala",
    fingers: [false, true, false, false, false],
    corrections: {},
    teacherNote: "Point with purpose — a single direction of focus.",
  },
];

/* ─── Main hook ──────────────────────────────────────────────── */
export function useMudraDetection(
  videoRef: RefObject<HTMLVideoElement | null>,
  targetMudraId?: string,
  isPaused?: boolean,
) {
  const engineRef = useRef<InferenceEngine | null>(null);
  const workerIdRef = useRef<string | null>(null);
  const rafRef = useRef<number>(0);
  const lastFpsTime = useRef(performance.now());
  const frameCount = useRef(0);
  
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

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const publishableKey = import.meta.env.VITE_ROBOFLOW_PUBLISHABLE_KEY || "YOUR_PUBLISHABLE_KEY";
        
        if (publishableKey === "YOUR_PUBLISHABLE_KEY") {
          throw new Error("Missing VITE_ROBOFLOW_PUBLISHABLE_KEY in .env");
        }

        const engine = new InferenceEngine();
        const workerId = await engine.startWorker(
          "kuchipudi-mudras",
          "4",
          publishableKey
        );

        if (cancelled) return;
        
        engineRef.current = engine;
        workerIdRef.current = workerId;

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
          if (cancelled || !videoRef.current || !engineRef.current || !workerIdRef.current) return;
          if (!pausedRef.current && videoRef.current.readyState >= 2) {
            try {
              const cvimg = new CVImage(videoRef.current);
              const predictions = await engineRef.current.infer(workerIdRef.current, cvimg);
              
              frameCount.current++;
              const now = performance.now();
              if (now - lastFpsTime.current >= 1000) {
                const fps = Math.round((frameCount.current * 1000) / (now - lastFpsTime.current));
                frameCount.current = 0;
                lastFpsTime.current = now;
                setState((s) => ({ ...s, fps }));
              }

              let bestPred = null;
              if (predictions && predictions.length > 0) {
                // Find highest confidence prediction
                bestPred = predictions.reduce((prev: any, curr: any) => 
                  (prev.confidence > curr.confidence) ? prev : curr
                );
              }

              if (bestPred && !["hand", "text", "lady", "bangle"].includes(bestPred.class)) {
                const targetMudra = MUDRA_FINGERPRINTS.find(m => m.id === targetIdRef.current);
                const isCorrect = targetMudra?.roboflowClass === bestPred.class && bestPred.confidence > 0.6;
                
                const matchedFingerprint = MUDRA_FINGERPRINTS.find(m => m.roboflowClass === bestPred.class);
                
                setState(s => ({
                  ...s,
                  isRunning: true,
                  landmarks: [], // Mock to indicate hand is present
                  detectedMudra: {
                    id: matchedFingerprint?.id || "unknown",
                    name: bestPred.class,
                    confidence: Math.round(bestPred.confidence * 100),
                    fingerStates: matchedFingerprint?.fingers || [false, false, false, false, false],
                    corrections: isCorrect ? [] : ["Check your hand form against the target"],
                    isCorrect,
                    bbox: {
                      x: bestPred.bbox.x,
                      y: bestPred.bbox.y,
                      width: bestPred.bbox.width,
                      height: bestPred.bbox.height
                    }
                  }
                }));
              } else {
                setState(s => ({ 
                  ...s, 
                  isRunning: true, 
                  landmarks: bestPred && bestPred.class === "hand" ? [] : null, 
                  detectedMudra: null 
                }));
              }
            } catch (err) {
              // Ignore inference errors per frame
            }
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
      const video = videoRef.current;
      if (video?.srcObject) {
        (video.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
        video.srcObject = null;
      }
    };
  }, []);

  return state;
}

export { MUDRA_FINGERPRINTS };
export type { MudraFingerprint };
