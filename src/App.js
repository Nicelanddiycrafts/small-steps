import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

// --- Theme Colors ---
const THEMES = {
  lilac: {
    name: "Soothing Lilac",
    "--bg": "#896790",
    "--panel": "#231b28cc",
    "--text": "#F9F7FB",
    "--muted": "#D9CBE0",
    "--accent": "#bfadcc",
    "--accent-2": "#ffe1f5",
    "--focus": "#dfbbda",
    "--extra": "#f2bae4",
  },
};
const defaultThemeKey = "lilac";

// --- Content Warning Gate ---
function ContentWarningGate({ onContinue }) {
  return (
    <div 
      style={{ 
        background: "var(--bg)", 
        color: "var(--text)", 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center" 
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ 
          background: "color-mix(in oklab, var(--panel) 88%, transparent)",
          borderRadius: "20px",
          padding: "32px",
          maxWidth: "800px",
          width: "90%",
          boxShadow: "0 8px 20px rgba(0,0,0,0.25)"
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Gentle Content Reminder</h1>
        <p style={{ color: "var(--muted)", marginBottom: "1rem" }}>
          This interactive story touches on eating disorders and recovery. It is educational and not a substitute for professional help.
        </p>
        <ul style={{ color: "var(--muted)", paddingLeft: "1.2rem", marginBottom: "1rem" }}>
          <li>Skip any section that feels uncomfortable.</li>
          <li>Your choices won’t punish or shame you.</li>
          <li>Resources are available at the bottom of the screen.</li>
        </ul>
        <button 
          onClick={onContinue} 
          style={{ 
            background: "var(--accent)", 
            color: "#0b1020", 
            padding: "10px 18px", 
            borderRadius: "12px", 
            border: "none", 
            fontWeight: "500",
            cursor: "pointer" 
          }}
        >
          I understand — continue
        </button>
      </motion.div>
    </div>
  );
}


// --- Story Data ---
const STORY = [
  { id: "intro", title: "Homeroom", images: ["/assets/bg/classroom.png"], narrator: "First bell. You choose a gentle start: notice, not judge.", choices: [{ text: "Play – begin the story", next: "scene2" }] },
  { id: "scene2", title: "Hallway", images: ["/assets/bg/hallway.png", "/assets/bg/hallway2.png"], narrator: "You walk through the hallway, feeling the hum of conversation.", choices: [{ text: "Back to Homeroom", next: "intro" }] },
];

// --- Hooks ---
function useTheme(themeKey) {
  const theme = useMemo(() => THEMES[themeKey] ?? THEMES[defaultThemeKey], [themeKey]);
  useEffect(() => {
    Object.entries(theme).forEach(([k, v]) => {
      if (k.startsWith("--")) document.documentElement.style.setProperty(k, v);
    });
  }, [theme]);
  return theme;
}

function useSceneEngine(initialId = STORY[0].id) {
  const idToIndex = useMemo(() => Object.fromEntries(STORY.map((s, i) => [s.id, i])), []);
  const [index, setIndex] = useState(idToIndex[initialId] ?? 0);
  const [history, setHistory] = useState([idToIndex[initialId] ?? 0]);
  const go = (nextId) => { const i = idToIndex[nextId]; if (i != null) { setIndex(i); setHistory((h) => [...h, i].slice(-50)); } };
  const back = () => { setHistory((h) => { if (h.length <= 1) return h; const nh = h.slice(0, -1); setIndex(nh[nh.length - 1]); return nh; }); };
  return { index, scene: STORY[index], go, back, total: STORY.length };
}

// --- Button Styles ---
const btnPrimary = { padding: "8px 14px", borderRadius: 12, background: "var(--accent)", color: "#0b1020", border: "none", fontWeight: 500, cursor: "pointer" };

// --- Scene View ---
function SceneView({ scene, onChoose }) {
  const [imgIndex, setImgIndex] = useState(0);
  const images = scene.images ?? [];
  useEffect(() => setImgIndex(0), [scene.id]);

  const nextImg = () => setImgIndex((i) => (images.length ? (i + 1) % images.length : 0));
  const prevImg = () => setImgIndex((i) => (images.length ? (i - 1 + images.length) % images.length : 0));

  const navBtnStyle = {
    background: "#e9e4ec", // light neutral background
    borderRadius: "12px",
    border: "none",
    padding: "6px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
  };

  return (
    <>
      {/* Dialogue ABOVE the panel */}
      <div style={{ marginBottom: 12, borderRadius: 16, padding: 16, background: "rgba(35,27,40,0.86)", border: "1px solid #ffffff22" }}>
        <h2 style={{ margin: 0, marginBottom: 6, color: "var(--text)" }}>{scene.title}</h2>
        <p style={{ marginTop: 0, color: "var(--muted)" }}>{scene.narrator}</p>
        <div style={{ marginTop: 8, display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {scene.choices?.map((c, idx) => (
            <button key={idx} onClick={() => onChoose(c.next)} style={btnPrimary}>{c.text}</button>
          ))}
        </div>
      </div>

      {/* BLACK-FRAMED STORY PANEL */}
      <div
        style={{
          position: "relative",
          height: "58vh",      // shorter than before
          maxHeight: 620,      // caps panel height
          borderRadius: 24,
          overflow: "hidden",
          background: "#000000",
          border: "1px solid #ffffff22"
        }}
      >

        {images.length ? (
          <img src={images[imgIndex]} alt="Story panel" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        ) : <div style={{ width: "100%", height: "100%" }} />}

        {/* Left/Right buttons */}
        {images.length > 1 && (
          <div style={{ position: "absolute", insetInline: 0, top: "50%", transform: "translateY(-50%)", display: "flex", justifyContent: "space-between", paddingInline: 12 }}>
            <button onClick={prevImg} style={navBtnStyle}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="20" height="20" rx="4" fill="#e9e4ec"/><path d="M14.5 6.5L8.5 12L14.5 17.5" stroke="#bfadcc" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button onClick={nextImg} style={navBtnStyle}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="20" height="20" rx="4" fill="#e9e4ec"/><path d="M9.5 6.5L15.5 12L9.5 17.5" stroke="#bfadcc" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// --- Main App ---
export default function EDStoryApp() {
  const [themeKey, setThemeKey] = useState(defaultThemeKey);
  useTheme(themeKey);
  const [ack, setAck] = useState(false);
  const { scene, go, back } = useSceneEngine("intro");

  // one container to rule them all 
  const shell = {
    maxWidth: "900px",   // adjust this to taste (800–1000px looks great)
    margin: "0 auto",    // centers everything
    padding: "0 16px",   // small side gutters
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", padding: 20 }}>
      {!ack ? (
        <ContentWarningGate onContinue={() => setAck(true)} />
      ) : (
        <div style={shell}>
          {/* Top Navigation (now centered & contained) */}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={btnPrimary} onClick={() => go("intro")}>Play</button>
              <button style={btnPrimary} onClick={back}>Back</button>
              <button style={btnPrimary} onClick={() => setAck(false)}>Exit</button>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={btnPrimary}>Credits</button>
              <button style={btnPrimary}>Settings</button>
            </div>
          </div>

          {/* Everything else inherits the same width */}
          <SceneView scene={scene} onChoose={go} />
        </div>
      )}
    </div>
  );
}
