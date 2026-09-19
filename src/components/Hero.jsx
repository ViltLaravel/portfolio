import Typewriter from "typewriter-effect";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";
import MarvelIntro from "./MarvelIntro"; // <-- import the component

// ─── ADD YOUR PHOTOS HERE ────────────────────────────────────────────────────
// Put 10-20 photos of yourself in your /public/photos/ folder,
// then list them here. Mix candids, professional shots, travel, work, etc.
const MY_PHOTOS = [
  "/photos/photo1.jpg",
  "/photos/photo2.jpg",
  "/photos/photo3.jpg",
  "/photos/photo4.jpg",
  "/photos/photo5.jpg",
  "/photos/photo6.jpg",
  "/photos/photo7.jpg",
  "/photos/photo8.jpg",
  "/photos/photo9.jpg",
  "/photos/photo10.jpeg",
  "/photos/photo11.jpg",
  "/photos/photo12.jpg",
  "/photos/photo13.jpg",
  "/photos/photo14.jpg",
  "/photos/photo15.jpg",
  "/photos/photo16.jpg",
  "/photos/photo17.jpg",
  "/photos/photo18.jpg",
  "/photos/photo19.jpg",
  "/photos/photo20.jpg",
  // add more as needed...
];
// ─────────────────────────────────────────────────────────────────────────────

export default function Hero() {
  const containerRef = useRef(null);
  const [init, setInit] = useState(false);
  const [introComplete, setIntroComplete] = useState(false); // <-- controls intro

  useEffect(() => {
    if (init) return;
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => setInit(true));
  }, [init]);

  const particlesLoaded = useCallback(
    (container) => {
      containerRef.current = container;
      window.particlesContainer = container;
    },
    [containerRef]
  );

  const options = useMemo(
    () => ({
      fullScreen: { zIndex: -1 },
      background: { color: "transparent" },
      particles: {
        number: { value: 30 },
        links: { enable: true },
        move: { enable: true },
      },
    }),
    []
  );

  return (
    <>
      {/* ── Marvel intro — renders on top of everything, disappears when done ── */}
      {!introComplete && (
        <MarvelIntro
          photos={MY_PHOTOS}
          name="Nicole Amoguis"
          titles={[
            "Software Engineer",
            "DevOps Engineer",
            "UI/UX Designer",
          ]}
          onComplete={() => setIntroComplete(true)}
        />
      )}

      <section className="w-full min-h-[calc(100svh-80px)] flex items-center justify-center px-4 py-12">
        {init && (
          <Particles
            id="tsparticles"
            particlesLoaded={particlesLoaded}
            options={options}
          />
        )}

        <div className="w-full flex flex-col items-center gap-8 text-center">
          <div className="w-full flex flex-col items-center gap-3">
            <h1
              className="max-w-full text-4xl md:text-6xl lg:text-7xl xl:text-9xl font-bold uppercase leading-tight break-words"
              style={{
                background: "linear-gradient(105deg, #915EFF 20%, #ffffff 40%, #c084fc 50%, #915EFF 70%)",
                backgroundSize: "250% auto",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "shimmer 2s linear infinite",
              }}
            >
              Nicole Amoguis
            </h1>
            <div
              style={{
                width: "60%",
                height: "4px",
                background: "linear-gradient(90deg, transparent 0%, #915EFF 30%, #c084fc 50%, #915EFF 70%, transparent 100%)",
                backgroundSize: "200% auto",
                animation: "shimmer 2s linear infinite",
                clipPath: "polygon(6% 0%, 100% 0%, 94% 100%, 0% 100%)",
                boxShadow: "0 0 12px rgba(145, 94, 255, 0.8)",
              }}
            />
          </div>
          <div className="w-full text-center text-white-100 text-xl md:text-4xl xl:text-7xl font-semibold">
            <Typewriter
              options={{
                strings: [
                  "Software Engineer",
                  "DevOps Engineer",
                  "UI/UX Designer",
                ],
                autoStart: true,
                loop: true,
              }}
            />
          </div>
        </div>
      </section>
    </>
  );
}
