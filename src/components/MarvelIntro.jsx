import { useEffect, useRef, useState, useCallback } from "react";

const PLACEHOLDER_COLORS = [
  "#1a0a2e", "#0d1a3e", "#2e0a1a", "#0a2e0a", "#2e1a0a",
  "#1a2e0a", "#0a0a2e", "#2e0a2e", "#0a2e2e", "#150520",
  "#051520", "#201505", "#051505", "#200515", "#0a1530",
  "#300a15", "#15300a", "#300a30", "#0a3030", "#302a0a",
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function MarvelIntro({
  photos = [],
  name = "Nicole Amoguis",
  titles = ["Software Engineer", "DevOps Engineer", "UI/UX Designer"],
  onComplete,
}) {
  const [phase, setPhase] = useState("idle"); // idle | running | revealed | done
  const [panelFrames, setPanelFrames] = useState(
    Array(9).fill(null).map((_, i) => ({ color: PLACEHOLDER_COLORS[i % PLACEHOLDER_COLORS.length], imgIndex: -1 }))
  );
  const [flashOpacity, setFlashOpacity] = useState(0);
  const [barScale, setBarScale] = useState(0);
  const [barOrigin, setBarOrigin] = useState("left");
  const [nameVisible, setNameVisible] = useState(false);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [titleIndex, setTitleIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const cancelRef = useRef(false);
  const startingRef = useRef(false);
  const loadedPhotosRef = useRef([]);

  const generateUniqueFrames = useCallback(() => {
    const totalPhotos = loadedPhotosRef.current.length;
    if (totalPhotos === 0) {
      return Array(9).fill(null).map(() => ({
        color: PLACEHOLDER_COLORS[Math.floor(Math.random() * PLACEHOLDER_COLORS.length)],
        imgIndex: -1,
      }));
    }

    // Build shuffled pool, cycling if fewer than 9 photos, so each panel gets a unique index
    const base = Array.from({ length: totalPhotos }, (_, i) => i);
    const pool = [];
    while (pool.length < 9) {
      const chunk = [...base];
      for (let i = chunk.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [chunk[i], chunk[j]] = [chunk[j], chunk[i]];
      }
      pool.push(...chunk);
    }

    return Array(9).fill(null).map((_, i) => ({
      color: PLACEHOLDER_COLORS[Math.floor(Math.random() * PLACEHOLDER_COLORS.length)],
      imgIndex: pool[i],
    }));
  }, []);

  const runIntro = useCallback(async () => {
    if (startingRef.current || phase === "running") return;
    startingRef.current = true;
    cancelRef.current = false;
    const loadedPhotos = await Promise.all(
      photos.map((src) => new Promise((resolve) => {
        const image = new Image();
        image.onload = () => resolve(src);
        image.onerror = () => resolve(null);
        image.src = src;
      }))
    );
    if (cancelRef.current) return;
    loadedPhotosRef.current = loadedPhotos.filter(Boolean);
    setPhase("running");
    setNameVisible(false);
    setSubtitleVisible(false);
    setBarScale(0);
    setBarOrigin("left");
    setFlashOpacity(0);

    const TOTAL_FRAMES = 50;
    const FAST_START = 35;

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      if (cancelRef.current) return;

      setPanelFrames(generateUniqueFrames());

      // white flash every ~5 frames
      if (i % 5 === 0) {
        setFlashOpacity(0.7);
        await sleep(35);
        setFlashOpacity(0);
      }

      const delay =
        i < FAST_START
          ? Math.max(28, 130 - i * 3.5)
          : Math.max(14, 55 - (i - FAST_START) * 5);

      await sleep(delay);
    }

    // final big flash
    setFlashOpacity(1);
    await sleep(90);
    setFlashOpacity(0);

    // sweep bar in
    setBarOrigin("left");
    setBarScale(1);
    await sleep(350);

    // name appears
    setNameVisible(true);
    setPhase("revealed");
    await sleep(450);

    // subtitle cycles through titles
    setSubtitleVisible(true);
    for (let t = 0; t < titles.length; t++) {
      if (cancelRef.current) return;
      setTitleIndex(t);
      await sleep(t === titles.length - 1 ? 1800 : 900);
    }

    // outro
    setBarOrigin("right");
    setBarScale(0);
    await sleep(500);
    setSubtitleVisible(false);
    setNameVisible(false);
    await sleep(400);

    setIsDone(true);
    setPhase("done");
    onComplete?.();
  }, [phase, photos, generateUniqueFrames, titles, onComplete]);

  // Auto-play on mount
  useEffect(() => {
    const timer = setTimeout(() => runIntro(), 300);
    return () => {
      clearTimeout(timer);
      cancelRef.current = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isDone) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#000",
        overflow: "hidden",
        cursor: phase === "idle" ? "pointer" : "default",
      }}
      onClick={phase === "idle" ? runIntro : undefined}
      aria-label="Portfolio intro animation"
    >
      {/* 3x3 photo grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(3, 1fr)",
          gap: "3px",
        }}
      >
        {panelFrames.map((frame, i) => (
          <div
            key={i}
            style={{
              position: "relative",
              overflow: "hidden",
              background: frame.color,
              transition: "background 0.04s",
            }}
          >
            {frame.imgIndex >= 0 && loadedPhotosRef.current[frame.imgIndex] && (
              <img
                src={loadedPhotosRef.current[frame.imgIndex]}
                alt=""
                aria-hidden="true"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center top",
                  filter: "grayscale(20%) contrast(1.15) brightness(0.85)",
                  display: "block",
                }}
              />
            )}
            {/* purple tint overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  i % 3 === 0
                    ? "rgba(145,94,255,0.18)"
                    : "rgba(0,0,40,0.25)",
                mixBlendMode: "screen",
              }}
            />
          </div>
        ))}
      </div>

      {/* white flash layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#fff",
          opacity: flashOpacity,
          pointerEvents: "none",
          transition: "opacity 0.05s linear",
          zIndex: 2,
        }}
      />

      {/* purple sweep bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "6px",
          background: "linear-gradient(90deg, #915EFF, #c084fc, #e879f9)",
          zIndex: 6,
          transform: `scaleX(${barScale})`,
          transformOrigin: barOrigin,
          transition:
            barOrigin === "left"
              ? "transform 0.45s cubic-bezier(0.4,0,0.2,1)"
              : "transform 0.35s ease-in",
          boxShadow: "0 0 20px rgba(145,94,255,0.8)",
        }}
      />

      {/* name + subtitle reveal */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          pointerEvents: "none",
          background: nameVisible ? "rgba(0,0,0,0.88)" : "transparent",
          transition: "background 0.3s ease",
        }}
      >
        {/* Name */}
        <div
          style={{
            fontFamily: "'Impact', 'Arial Black', 'Haettenschweiler', sans-serif",
            fontSize: "clamp(36px, 8vw, 100px)",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            lineHeight: 1,
            textAlign: "center",
            padding: "0 20px",
            color: "transparent",
            background:
              "linear-gradient(135deg, #915EFF 0%, #c084fc 35%, #ffffff 50%, #c084fc 65%, #915EFF 100%)",
            backgroundSize: "300% auto",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: nameVisible ? "marvelShine 2s linear infinite" : "none",
            opacity: nameVisible ? 1 : 0,
            transform: nameVisible ? "scale(1) translateY(0)" : "scale(1.15) translateY(-10px)",
            transition: "opacity 0.2s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          {name}
        </div>

        {/* Divider line */}
        <div
          style={{
            width: nameVisible ? "200px" : "0px",
            height: "2px",
            background: "linear-gradient(90deg, transparent, #915EFF, transparent)",
            margin: "20px auto",
            transition: "width 0.5s ease 0.3s",
          }}
        />

        {/* Cycling subtitle */}
        <div
          style={{
            fontFamily: "'Arial', 'Helvetica Neue', sans-serif",
            fontSize: "clamp(13px, 2vw, 20px)",
            fontWeight: 700,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "#c084fc",
            opacity: subtitleVisible ? 1 : 0,
            transform: subtitleVisible ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.4s ease, transform 0.4s ease",
            textAlign: "center",
            minHeight: "1.5em",
          }}
        >
          {titles[titleIndex]}
        </div>

        {/* Skip hint */}
        {phase === "revealed" && (
          <button
            onClick={() => {
              cancelRef.current = true;
              setIsDone(true);
              onComplete?.();
            }}
            style={{
              position: "absolute",
              bottom: "32px",
              right: "32px",
              background: "transparent",
              border: "1px solid rgba(145,94,255,0.4)",
              color: "rgba(145,94,255,0.7)",
              padding: "6px 16px",
              borderRadius: "20px",
              fontSize: "12px",
              letterSpacing: "0.1em",
              cursor: "pointer",
              fontFamily: "Arial, sans-serif",
              pointerEvents: "auto",
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = "#915EFF";
              e.target.style.color = "#915EFF";
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = "rgba(145,94,255,0.4)";
              e.target.style.color = "rgba(145,94,255,0.7)";
            }}
          >
            SKIP
          </button>
        )}
      </div>

      {/* Idle state — click to play */}
      {phase === "idle" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 20,
            background: "rgba(0,0,0,0.6)",
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "rgba(145,94,255,0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      <style>{`
        @keyframes marvelShine {
          0%   { background-position: -100% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </div>
  );
}
