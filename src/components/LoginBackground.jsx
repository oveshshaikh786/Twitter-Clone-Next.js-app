import { useEffect, useRef, useState } from "react";

export default function LoginBackground() {
  // 👉 Put these files in /public (recommended)
  const MP4 = "/215697_small.mp4";          // H.264 (Safari-friendly)
  const WEBM = "/215697_small.webm";        // VP9/AV1 (Chrome/Edge/Firefox) — optional
  const POSTER = "/215697_small.jpg";       // lightweight placeholder (150–300 KB)

  const videoRef = useRef(null);
  const [canPlay, setCanPlay] = useState(true); // assume ok; fallback if autoplay blocked

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // iOS requires these for autoplay; set defensively in JS too
    v.muted = true;
    v.playsInline = true;

    // Try to start playback — if blocked, show poster fallback
    const tryPlay = async () => {
      try {
        const p = v.play();
        if (p && typeof p.then === "function") await p;
        v.classList.add("ready"); // fade in when decoding starts
      } catch {
        setCanPlay(false);        // Low Power/Data Saver/OS policy → fallback
      }
    };
    tryPlay();
  }, []);

  return (
    <div className="bg" aria-hidden>
      {canPlay ? (
        <video
          ref={videoRef}
          className="vid"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"   /* quick first paint; use "auto" if you want instant motion */
          poster={POSTER}
          controls={false}
          disablePictureInPicture
        >
          {WEBM && <source src={WEBM} type="video/webm" />}
          <source src={MP4} type="video/mp4" />
        </video>
      ) : (
        <div className="poster" />
      )}

      {/* No-JS fallback */}
      <noscript>
        <style>{`.bg .poster-noscript{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}`}</style>
        <img className="poster-noscript" src={POSTER} alt="" />
      </noscript>

      <style jsx>{`
        .bg {
          position: fixed;
          inset: 0;
          z-index: 0;            /* lives behind your login UI */
          pointer-events: none;  /* never blocks clicks */
          background: #000;      /* hard fallback if everything fails */
          overflow: hidden;
        }
        .vid {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;     /* letterbox-free fill */
          opacity: 0;
          transition: opacity 300ms ease;
          filter: brightness(0.9) contrast(1.05) saturate(1.05);
        }
        .vid.ready { opacity: 1; }

        .poster {
          position: absolute;
          inset: 0;
          background: url(${POSTER}) center / cover no-repeat;
        }

        /* Respect users who prefer less motion */
        @media (prefers-reduced-motion: reduce) {
          .vid { display: none; }
          .poster { display: block; }
        }
      `}</style>
    </div>
  );
}
