import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

/* THEME */
const THEMES = {
  lilac: {
    "--bg": "#896790",
    "--panel": "#231b28cc",
    "--text": "#F9F7FB",
    "--muted": "#D9CBE0",
    "--accent": "#bfadcc",
    "--accent-2": "#ffe1f5",
    "--focus": "#dfbbda",
    "--extra": "#f2bae4"
  }
};
const defaultThemeKey = "lilac";

const resolveAsset = (p) =>
  p?.startsWith("http") ? p : `${process.env.PUBLIC_URL}${p?.startsWith("/") ? p : "/" + p}`;

/* CONTENT WARNING */
function ContentWarningGate({ onContinue }) {
  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ background: "color-mix(in oklab, var(--panel) 88%, transparent)", borderRadius: 20, padding: 32, maxWidth: 800, width: "90%", boxShadow: "0 8px 20px rgba(0,0,0,0.25)" }}
      >
        <h1 style={{ fontSize: 28, marginBottom: 12 }}>Gentle Content Reminder</h1>
        <p style={{ color: "var(--muted)", marginBottom: 12 }}>
          This interactive story touches on eating disorders and recovery. It is educational and not a substitute for professional help.
        </p>
        <ul style={{ color: "var(--muted)", paddingLeft: 18, marginBottom: 16 }}>
          <li>Skip any section that feels uncomfortable.</li>
          <li>Your choices won’t punish or shame you.</li>
          <li>Resources are available at the bottom of the screen.</li>
        </ul>
        <button onClick={onContinue} style={{ background: "var(--accent)", color: "#0b1020", padding: "10px 18px", borderRadius: 12, border: "none", fontWeight: 600, cursor: "pointer" }}>
          I understand — continue
        </button>
      </motion.div>
    </div>
  );
}

/* STORY */
const STORY = [
  { id: "menu",
    title: "Choose a path",
    options: [
      { text: "What are eating disorders?", expCount: 1, next: "eating1" },
      { text: "How do I notice signs of an eating disorder?", expCount: 3, next: "signs1" },
      { text: "What do I do when I know someone has an eating disorder?", expCount: 1, next: "help1" },
      { text: "How do I talk to someone who has an eating disorder?", expCount: 2, next: "talk1" },
      { text: "How do I talk to someone recovering from an eating disorder?", expCount: 1, next: "recover1" }
    ]
  },

  /* Recovery story */
  {
    id: "recover1",
    title: "How do I talk to a person recovering from an eating disorder?",
    images: ["/assets/recover/coffee-happy.png", "/assets/recover/coffee-sad.png"],
    dialogue: [
      { type: "pc", who: "PC", text: "So how have you been?" },
      { type: "char", who: "Ayesha", text: "I don’t know. It has just been hard. So many ups and downs lately." }
    ],
    choices: [
      { text: "Oh. Have you heard about Gina and Deepti’s fight?", feedback: "It’s not best to switch topics while Ayesha is trying to talk to you about her situation.", wrong: true },
      { text: "Do you wanna talk about it?", next: "recover2" },
      { text: "Hmm. Jessica had a similar situation.", feedback: "Ayesha may not want to hear about someone else right now. She needs your support.", wrong: true }
    ]
  },
  {
    id: "recover2",
    title: "Listening with care",
    images: ["/assets/recover/coffee-happy.png", "/assets/recover/coffee-sad.png"],
    dialogue: [
      { type: "char", who: "Ayesha", text: "Ever since I’ve been officially diagnosed, my parents have been distant from me. Maybe it’s my fault. I created this mess." }
    ],
    choices: [
      { text: "Stay silent.", feedback: "Ayesha is putting herself at unnecessary fault. It might be best to comfort her.", wrong: true },
      { text: "Why are your parents like this? Don’t they see how great you are?", feedback: "Instead of criticism of other people, Ayesha may respond better to supportive statements.", wrong: true },
      { text: "You are brave for starting your recovery. You cannot control how others react.", next: "recover3" }
    ]
  },
  {
    id: "recover3",
    title: "Encouragement",
    images: ["/assets/recover/coffee-happy.png", "/assets/recover/coffee-sad.png"],
    dialogue: [
      { type: "char", who: "Ayesha", text: "I feel like such a loser. Sometimes I can go so long without falling into my old mentality but I just keep relapsing. I don’t know if I’m ever gonna be free." }
    ],
    choices: [
      { text: "Why can’t you just control it?", feedback: "This is one of the worst things to say to Ayesha. She is in a difficult situation and this just aggravates her pain.", wrong: true },
      { text: "As long as you try, you are going to be the person you want to be. No matter how long it takes!", next: "recover4" },
      { text: "It’s hard to stop following old habits.", feedback: "There may be better options.", wrong: true }
    ]
  },
  {
    id: "recover4",
    title: "Fear of judgement",
    images: ["/assets/recover/coffee-happy.png", "/assets/recover/coffee-sad.png"],
    dialogue: [
      { type: "char", who: "Ayesha", text: "What will Hannah and Violet think of me?" }
    ],
    choices: [
      { text: "They will probably like you just the same.", next: "recover5" },
      { text: "I don’t know. But I am with you no matter what.", next: "recover5" },
      { text: "They will be jealous of your weight loss.", feedback: "The worst thing to say to Ayesha. Never comment on her weight in the process of her recovery.", wrong: true }
    ]
  },
  {
    id: "recover5",
    title: "Silent moment",
    images: ["/assets/recover/coffee-happy.png", "/assets/recover/coffee-sad.png"],
    dialogue: [
      { type: "char", who: "Ayesha", text: "…" }
    ],
    choices: [
      { text: "Stay silent.", next: "recoverEnd" },
      { text: "Hug her.", next: "recoverEnd" },
      { text: "Get her something to eat.", feedback: "This puts pressure on Ayesha. Let her recover on her own time.", wrong: true }
    ]
  },
  {
    id: "recoverEnd",
    title: "Ending",
    images: ["/assets/recover/coffee-happy.png"],
    dialogue: [
      { type: "char", who: "Ayesha", text: "Thank you for making the effort to learn how to support me." }
    ],
    choices: [{ text: "Back to menu", next: "menu" }]
  },

  /* placeholders for other paths */
  { id: "eating1", title: "What are eating disorders?", narrator: "Short overview and one experience.", choices: [{ text: "Back to menu", next: "menu" }] },
  { id: "signs1", title: "Noticing signs (1/3)", narrator: "Experience 1 about recognizing signs.", choices: [{ text: "Next", next: "signs2" }, { text: "Back to menu", next: "menu" }] },
  { id: "signs2", title: "Noticing signs (2/3)", narrator: "Experience 2 about recognizing signs.", choices: [{ text: "Next", next: "signs3" }, { text: "Back to menu", next: "menu" }] },
  { id: "signs3", title: "Noticing signs (3/3)", narrator: "Experience 3 about recognizing signs.", choices: [{ text: "Back to menu", next: "menu" }] },
  { id: "help1", title: "What do I do when I know?", narrator: "One experience about immediate steps.", choices: [{ text: "Back to menu", next: "menu" }] },
  { id: "talk1", title: "Talking (1/2)", narrator: "Experience 1 on talking.", choices: [{ text: "Next", next: "talk2" }, { text: "Back to menu", next: "menu" }] },
  { id: "talk2", title: "Talking (2/2)", narrator: "Experience 2 on talking.", choices: [{ text: "Back to menu", next: "menu" }] }
];

/* hooks */
function useTheme(themeKey) {
  const theme = useMemo(() => THEMES[themeKey] ?? THEMES[defaultThemeKey], [themeKey]);
  useEffect(() => { Object.entries(theme).forEach(([k, v]) => { if (k.startsWith("--")) document.documentElement.style.setProperty(k, v); }); }, [theme]);
}

function useSceneEngine(initialId = STORY[0].id) {
  const idToIndex = useMemo(() => Object.fromEntries(STORY.map((s, i) => [s.id, i])), []);
  const [index, setIndex] = useState(idToIndex[initialId] ?? 0);
  const [history, setHistory] = useState([idToIndex[initialId] ?? 0]);
  const go = (nextId) => { const i = idToIndex[nextId]; if (i != null) { setIndex(i); setHistory((h) => [...h, i].slice(-50)); } };
  const back = () => { setHistory((h) => { if (h.length <= 1) return h; const nh = h.slice(0, -1); setIndex(nh[nh.length - 1]); return nh; }); };
  return { scene: STORY[index], go, back };
}

/* styles */
const btnPrimary = { padding: "8px 14px", borderRadius: 12, background: "var(--accent)", color: "#0b1020", border: "none", fontWeight: 600, cursor: "pointer" };

/* Scene view */
function SceneView({ scene, onChoose }) {
  const [imgIndex, setImgIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [step, setStep] = useState(0);

  const images = scene.images ?? [];
  const lines = Array.isArray(scene.dialogue) ? scene.dialogue : [];

  useEffect(() => { setImgIndex(0); setFeedback(null); setStep(0); }, [scene.id]);

  const handleChoice = (c) => {
    if (c.wrong) {
      setFeedback({ message: c.feedback || "It might help to choose a more supportive option right now." });
      if (images.length > 1) setImgIndex(1);
    } else if (c.next) {
      onChoose(c.next);
    }
  };

  const renderLine = (line) => {
    if (!line) return null;
    if (line.type === "pc-internal") return <div style={{ fontStyle: "italic", color: "#7a5a3a" }}>{line.text}</div>;
    const isPC = line.type === "pc";
    return (
      <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
        <span style={{ background: "color-mix(in oklab, var(--accent) 35%, transparent)", color: "var(--text)", padding: "2px 8px", borderRadius: 999, fontSize: 12, border: "1px solid #ffffff22", minWidth: 62, textAlign: "center" }}>
          {line.who || (isPC ? "PC" : "—")}
        </span>
        <span style={{ color: isPC ? "#D9CBE0" : "var(--text)" }}>{line.text}</span>
      </div>
    );
  };

  const canAdvance = step < lines.length - 1 && !feedback;
  const showChoices = !feedback && (lines.length === 0 || step >= lines.length - 1);

  // MENU
  if (scene.options) {
    return (
      <div style={{ maxWidth: 1100, margin: "0 auto", minHeight: "70vh", display: "flex", flexDirection: "column", justifyContent: "center", gap: 20 }}>
        <h2 style={{ margin: 0, color: "var(--text)", textAlign: "center" }}>{scene.title}</h2>
        <div style={{ display: "grid", gap: 18, gridTemplateColumns: "1fr" }}>
          {scene.options.map((opt, i) => (
            <button key={i} onClick={() => onChoose(opt.next)} style={{ background: "rgba(35,27,40,0.86)", color: "var(--text)", padding: "28px 22px", borderRadius: 16, border: "1px solid #ffffff22", textAlign: "center", cursor: "pointer", fontSize: "1.2rem", fontWeight: 700 }}>
              <div>{opt.text}</div>
              <div style={{ fontSize: "1rem", color: "var(--muted)", marginTop: 8 }}>
                {opt.expCount} {opt.expCount === 1 ? "experience" : "experiences"}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // BLACK PANEL + overlay
  return (
    <div style={{ position: "relative", height: "74vh", borderRadius: 24, overflow: "hidden", background: "#000", border: "1px solid #ffffff22", maxWidth: 1200, margin: "0 auto" }}
         onClick={() => { if (canAdvance) setStep((s) => s + 1); }}>
      {images.length ? (
        <img src={resolveAsset(images[imgIndex])} alt="Story panel" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      ) : (
        <div style={{ width: "100%", height: "100%" }} />
      )}

      <div style={{ position: "absolute", left: 12, right: 12, bottom: 12, background: "rgba(35,27,40,0.86)", border: "1px solid #ffffff22", borderRadius: 14, padding: "12px 14px", display: "grid", gap: 10 }}
           onClick={(e) => e.stopPropagation()}>
        <div style={{ color: "var(--muted)", fontSize: 12 }}>{scene.title}</div>

        {feedback ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <div style={{ color: "var(--muted)" }}>{feedback.message}</div>
            <button onClick={() => { setFeedback(null); setImgIndex(0); }} style={{ background: "var(--accent-2)", color: "#351f45", padding: "8px 12px", borderRadius: 10, border: "1px solid #ffffff22", cursor: "pointer" }}>
              Try again
            </button>
          </div>
        ) : (
          <>
            {lines.length > 0 && renderLine(lines[step])}
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              {canAdvance && (
                <button onClick={() => setStep((s) => s + 1)} style={{ background: "var(--accent)", color: "#351f45", padding: "8px 12px", borderRadius: 10, border: "1px solid #ffffff22", cursor: "pointer" }}>
                  Next
                </button>
              )}
            </div>
            {showChoices && scene.choices?.length > 0 && (
              <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
                {scene.choices.map((c, idx) => (
                  <button key={idx} onClick={() => handleChoice(c)} style={btnPrimary}>{c.text}</button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* APP */
export default function EDStoryApp() {
  useTheme(defaultThemeKey);
  const [ack, setAck] = useState(false);
  const { scene, go, back } = useSceneEngine("menu");

  const shell = { maxWidth: 1200, margin: "0 auto", padding: "12px 16px" };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      {!ack ? (
        <ContentWarningGate onContinue={() => setAck(true)} />
      ) : (
        <div style={shell}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={btnPrimary} onClick={() => go("menu")}>Play</button>
              <button style={btnPrimary} onClick={back}>Back</button>
              <button style={btnPrimary} onClick={() => setAck(false)}>Exit</button>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={btnPrimary}>Credits</button>
              <button style={btnPrimary}>Settings</button>
            </div>
          </div>
          <SceneView scene={scene} onChoose={go} />
        </div>
      )}
    </div>
  );
}
