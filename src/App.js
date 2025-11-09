import { useEffect, useMemo, useState, useRef } from "react";
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

// Persist some UI state (notes) across page refresh
function useLocalStorage(key, initialValue) {
  const [val, setVal] = useState(() => {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : initialValue; }
    catch { return initialValue; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(val)); } catch { } }, [key, val]);
  return [val, setVal];
}

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
  {
    id: "menu",
    title: "Choose a path",
    options: [
      { text: "What are eating disorders?", expCount: 1, next: "eating1" },
      { text: "How do I notice signs of an eating disorder?", expCount: 3, next: "signs1" },
      { text: "What do I do when I know someone has an eating disorder?", expCount: 1, next: "help1" },
      { text: "How do I talk to someone who has an eating disorder?", expCount: 2, next: "talk1" },
      { text: "How do I talk to someone recovering from an eating disorder?", expCount: 1, next: "recover1" }
    ]
  },
  /* Signs story */
  {
    id: "signs1",
    title: "How do I notice signs of an eating disorder?",
    images: ["/assets/signs/cafe.jpg"],   // background can change later
    meta: { notePad: true },              // show Mental Note button in this arc
    dialogue: [
      { type: "narr", who: "", text: "It’s a sunny day and you could not be feeling better. The same cannot be said for one of your friends. As you notice certain things, you start to think “Do they have an eating disorder?”" }
    ],
    choices: [{ text: "Next", next: "signs2" }]
  },
  {
    id: "signs2",
    title: "Possible signs (overview)",
    images: ["/assets/signs/cafe.jpg"],
    meta: { notePad: true },
    dialogue: [
      { type: "narr", text: "Here are some signs that might indicate an eating disorder:" },
      { type: "narr", text: "• Changes in the way they treat food (refusing foods they used to love, avoiding food)." },
      { type: "narr", text: "• Changes in behaviour (mood swings, fixation on body shape/weight, withdrawal from social settings)." },
      { type: "narr", text: "• Physical symptoms (dramatic weight changes, upset stomachs, frequent vomiting)." }
    ],
    choices: [{ text: "Next", next: "signs3" }]
  },
  {
    id: "signs3",
    title: "Make a mental note",
    images: ["/assets/signs/cafe.jpg"],
    meta: { notePad: true },
    dialogue: [
      { type: "narr", text: "If you feel Ayesha, Gaurav or Harriet have exhibited signs of an eating disorder, make a mental note by clicking the Mental Note button and then clicking on their name." }
    ],
    choices: [{ text: "Next", next: "signsCafe" }]
  },
  {
    id: "signsCafe",
    title: "Café with friends",
    images: ["/assets/signs/cafe.jpg"],
    meta: { notePad: true },
    dialogue: [
      { type: "char", who: "Ayesha", text: "This week was the worst ever. I am so glad it is Saturday." },
      { type: "char", who: "Gaurav", text: "Wrestling practice was so hard. Coach practically made us run a 1000 kilometres." },
      { type: "char", who: "Harriet", text: "I bought a couple of dresses the other day. It made up for the stress I’ve been under." },
      { type: "char", who: "Ayesha", text: "That cake looks so good. We should absolutely get it." },
      { type: "char", who: "Gaurav", text: "I don’t know. I think I’ll get that salad instead." },
      { type: "char", who: "Harriet", text: "Gaurav, you should get it. You have been raving about it since we started coming here." },
      { type: "char", who: "Ayesha", text: "Ugh. I swear if Mr. Stevens gives us one more assignment, I'm gonna explode." },
      { type: "char", who: "Gaurav", text: "My coach is the same. He puts so much pressure on us to win. It makes me crazy." },
      { type: "char", who: "Harriet", text: "Hey, at least we have to spend only another year at the school before we leave for college." },
      { type: "char", who: "Ayesha", text: "I am going to miss you guys though." },
      { type: "char", who: "Gaurav", text: "For sure. I’m gonna go now. I have so much work to do." },
      { type: "char", who: "Harriet", text: "Gaurav, stay please. We have not all been together since so long." },
      { type: "narr", text: "Gaurav bolts for the restroom." },
      { type: "char", who: "Ayesha", text: "The coach has been putting so much pressure on him lately. I hope he is doing okay." },
      { type: "narr", text: "Gaurav returns briefly." },
      { type: "char", who: "Gaurav", text: "Bye guys. See you at school." },
      { type: "char", who: "Harriet", text: "Wait! At least tell me you are going to come to the camping trip with the others." },
      { type: "char", who: "Gaurav", text: "I might have to take a rain check on that." },
      { type: "narr", text: "Gaurav leaves the café." },
      { type: "char", who: "Ayesha", text: "He left so soon. I wanted to talk to him about the history assignment." },
      { type: "char", who: "Harriet", text: "He was looking forward to going on that camping trip with Josh. Now that he’s not going, I might not go too." }
    ],
    choices: [{ text: "Next", next: "signsReview" }]
  },
  {
    id: "signsReview",
    title: "Did you notice anything?",
    images: ["/assets/signs/cafe.jpg"],
    meta: { notePad: true, review: true }
  },
  {
    id: "signsReview2",
    title: "Why these are worth noting",
    images: ["/assets/signs/cafe.jpg"],
    meta: { notePad: true },
    dialogue: [
      { type: "narr", text: "Although they are not explicit signs and could have other explanations, the following things are worth taking note of:" },
      { type: "narr", text: "• Gaurav’s coach put a lot of pressure on him. External pressures can make controlling eating feel like the only thing someone can control—sometimes even contributing to the disorder." },
      { type: "narr", text: "• Gaurav fell sick so suddenly; he looked fine at the start." }
    ],
    choices: [{ text: "Back to menu", next: "menu" }]
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
  /* HELP path */
  {
    id: "help1",
    title: "What do I do when someone I know has an eating disorder?",
    images: ["/assets/help/Point1.png"],
    dialogue: [
      { type: "narr", text: "Point 1: Encourage them to get support/help from an adult." }
    ],
    choices: [{ text: "Next", next: "help1_people_intro" }]  // <— change target
  },
  {
    id: "help1_people_intro",
    title: "Who could be a good choice?",
    images: ["/assets/help/imagechoices.png"],
    dialogue: [
      { type: "narr", text: "Who do you think could be a good choice?" }
    ],
    choices: [{ text: "Next", next: "help1_people" }]
  },
  {
    id: "help1_people",
    title: "Who could be a good choice?",
    images: ["/assets/help/imagechoices.png"],
    meta: { notePad: false },
    dialogue: [],
    choices: [{ text: "Next", next: "help2_value" }]
  }
  ,
  {
    id: "help2_value",
    title: "Point 2: Let them know how much you value them.",
    images: ["/assets/help/Point2.png"],
    dialogue: [],
    choices: [{ text: "Open options", next: "help2_value_opts" }]
  },

  {
    id: "help2_value_opts",
    title: "How would you show they matter to you?",
    images: ["/assets/help/Point2.png"],
    dialogue: [],
    choices: [{ text: "Next", next: "help3_intro" }]
  },
  {
    id: "help3_intro",
    title: "Point 3: Do not change your behaviour towards them.",
    images: ["/assets/help/Point3.png"],
    dialogue: [
      { type: "narr", text: "Next up: choices that are supportive vs. harmful." },
      { type: "narr", text: "Drag each point into DOs or DON’Ts. Then press Check to see what’s right." }
    ],
    choices: [{ text: "Start sorting", next: "help3_sort" }]
  },

  {
    id: "help3_sort",
    title: "Point 3: Do not change your behaviour towards them.",
    images: ["/assets/help/Point3.png"],
    meta: { review: false },
    dialogue: [],
    choices: [{ text: "Next", next: "help4_listen_title" }]
  },
  {
    id: "help4_listen_title",
    title: "Point 4: LISTEN!",
    images: ["/assets/help/Point4.png"],   // Point4 image here
    dialogue: [
      { type: "narr", text: "LISTEN!" }
    ],
    choices: [{ text: "Next", next: "help4_listen" }]
  },
  {
    id: "help4_listen",
    title: "Point 4: LISTEN!",
    images: ["/assets/help/Point5.png"],
    dialogue: [
      { type: "narr", text: "So much of your loved one’s recovery depends on your support. Listening is the most important part of your journey together." },
      { type: "narr", text: "Hear them out, take note of their needs and help them where you can. However, remember that self-care is also important in this process. Recovery is not impossible!!" }
    ],
    choices: [{ text: "Back to menu", next: "menu" }]
  },
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

function MentalNotePanel({ open, onClose, notes, setNotes }) {
  if (!open) return null;

  const people = ["Ayesha", "Gaurav", "Harriet"];
  const [tab, setTab] = useState("Ayesha");
  const handle = (e) => setNotes({ ...notes, [tab]: e.target.value });
  const placeholder = "Write signs/notes you notice along the story here…";

  return (
    <div
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "absolute",
        top: 10, right: 10, bottom: 10, width: 320,
        background: "rgba(35,27,40,0.96)",
        border: "1px solid #ffffff22",
        borderRadius: 14,
        padding: 12,
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
        gap: 10,
        zIndex: 6
      }}
    >
      <div style={{ display: "flex", gap: 6 }}>
        {people.map((p) => (
          <button
            key={p}
            onClick={() => setTab(p)}
            style={{
              flex: 1,
              padding: "8px 10px",
              borderRadius: 10,
              border: "1px solid #ffffff22",
              background:
                tab === p
                  ? "var(--accent)"
                  : "color-mix(in oklab, var(--accent) 25%, transparent)",
              color: tab === p ? "#0b1020" : "var(--text)",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            {p}
          </button>
        ))}
        <button
          onClick={onClose}
          style={{
            padding: "8px 10px",
            borderRadius: 10,
            border: "1px solid #ffffff22",
            background: "var(--accent-2)",
            color: "#351f45",
            fontWeight: 700,
            cursor: "pointer"
          }}
        >
          Close
        </button>
      </div>

      {/* textarea area */}
      <div style={{ position: "relative", minHeight: 220 }}>
        {!notes[tab] && (
          <div
            style={{
              position: "absolute",
              inset: 12,
              pointerEvents: "none",
              color: "var(--muted)",
              fontStyle: "italic"
            }}
          >
            {placeholder}
          </div>
        )}
        <textarea
          value={notes[tab] ?? ""}
          onChange={handle}
          style={{
            width: "100%",
            height: "100%",
            resize: "none",
            background: "transparent",
            color: "var(--text)",
            border: "1px solid #ffffff22",
            borderRadius: 10,
            padding: 12,
            lineHeight: 1.45
          }}
        />
      </div>

      <div style={{ color: "var(--muted)", fontSize: 12 }}>
        Tip: jot down <strong>specific</strong> things (food avoidance, withdrawal, sudden illness, etc.).
      </div>
    </div>
  );
}

/* Simple “tap a choice → show feedback in the panel” helper */
function ChoiceWithFeedback({ title, prompt, options, onNext }) {
  const [picked, setPicked] = useState(null);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ color: "var(--text)", fontWeight: 800, fontSize: 18 }}>
        {title}
      </div>

      {prompt && (
        <div style={{ color: "var(--muted)", lineHeight: 1.35, marginTop: -2 }}>
          {prompt}
        </div>
      )}

      <div style={{
        display: "grid",
        gap: 10,
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))"
      }}>
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => setPicked(opt)}
            style={{
              background: "rgba(35,27,40,0.86)",
              color: "var(--text)",
              padding: "16px 14px",
              borderRadius: 12,
              border: "1px solid #ffffff22",
              textAlign: "left",
              cursor: "pointer",
              fontWeight: 700,
              minHeight: 54
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {picked && (
        <div
          style={{
            background: "rgba(35,27,40,0.86)",
            color: "var(--text)",
            border: "1px solid #ffffff22",
            borderRadius: 12,
            padding: 12
          }}
        >
          <div style={{ fontWeight: 800, marginBottom: 6 }}>{picked.label}</div>
          <div style={{ color: "var(--muted)" }}>{picked.feedback}</div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={onNext}
          style={{
            background: "var(--accent)",
            color: "#351f45",
            padding: "8px 12px",
            borderRadius: 10,
            border: "1px solid #ffffff22",
            cursor: "pointer",
            fontWeight: 700
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

/* DOs/DON’Ts sorter (button move, then grade) */
function DosDontsSorter({ items, answerKey, onContinue }) {
  const [uns, setUns] = useState(items.map((t, i) => ({ id: i, text: t })));
  const [dos, setDos] = useState([]);
  const [dont, setDont] = useState([]);
  const [graded, setGraded] = useState(false);

  const move = (from, setFrom, to, setTo, id) => {
    const idx = from.findIndex(x => x.id === id);
    if (idx === -1) return;
    const item = from[idx];
    setFrom(from.filter((_, i) => i !== idx));
    setTo([...to, item]);
  };
  const moveBack = (from, setFrom, id) => {
    const idx = from.findIndex(x => x.id === id);
    if (idx === -1) return;
    const item = from[idx];
    setFrom(from.filter((_, i) => i !== idx));
    setUns([...uns, item]);
  };

  const col = {
    background: "rgba(35,27,40,0.86)",
    border: "1px solid #ffffff22",
    borderRadius: 14,
    padding: 12,
    minHeight: 240,
    maxHeight: 320,
    overflowY: "auto"
  };
  const card = {
    color: "var(--text)",
    border: "1px solid #ffffff22",
    borderRadius: 12,
    padding: 12,
    background: "rgba(255,255,255,0.02)"
  };
  const chipRowBtn = { ...btnPrimary, padding: "6px 10px" };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {!graded ? (
        <>
          <div style={{ color: "var(--text)", fontWeight: 800 }}>Sort the points into DOs and DON’Ts</div>

          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "1fr 1fr 1fr"
            }}
          >
            {/* Unsorted */}
            <div style={col}>
              <div style={{ color: "var(--muted)", marginBottom: 8, fontWeight: 700 }}>Unsorted</div>
              <div style={{ display: "grid", gap: 10 }}>
                {uns.map(i => (
                  <div key={i.id} style={card}>
                    <div style={{ marginBottom: 10 }}>{i.text}</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button onClick={() => move(uns, setUns, dos, setDos, i.id)} style={chipRowBtn}>→ DOs</button>
                      <button onClick={() => move(uns, setUns, dont, setDont, i.id)} style={chipRowBtn}>→ DON’Ts</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DOs */}
            <div style={col}>
              <div style={{ color: "var(--muted)", marginBottom: 8, fontWeight: 700 }}>DOs</div>
              <div style={{ display: "grid", gap: 10 }}>
                {dos.map(i => (
                  <div key={i.id} style={card}>
                    <div style={{ marginBottom: 10 }}>{i.text}</div>
                    <button onClick={() => moveBack(dos, setDos, i.id)} style={chipRowBtn}>← Move back</button>
                  </div>
                ))}
              </div>
            </div>

            {/* DON’Ts */}
            <div style={col}>
              <div style={{ color: "var(--muted)", marginBottom: 8, fontWeight: 700 }}>DON’Ts</div>
              <div style={{ display: "grid", gap: 10 }}>
                {dont.map(i => (
                  <div key={i.id} style={card}>
                    <div style={{ marginBottom: 10 }}>{i.text}</div>
                    <button onClick={() => moveBack(dont, setDont, i.id)} style={chipRowBtn}>← Move back</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={() => setGraded(true)} style={btnPrimary}>Check</button>
          </div>
        </>
      ) : (
        <>
          <div style={{ color: "var(--text)", fontWeight: 800, marginBottom: 6 }}>What’s correct</div>
          <div style={{ display: "grid", gap: 8 }}>
            {[...dos, ...dont].map(i => {
              const should = answerKey[i.id];                 // "do" | "dont"
              const placed = dos.some(x => x.id === i.id) ? "do" : "dont";
              const ok = placed === should;
              return (
                <div key={i.id} style={{ color: "var(--text)" }}>
                  {i.text}
                  <span style={{
                    display: "inline-block",
                    marginLeft: 8,
                    padding: "2px 8px",
                    borderRadius: 999,
                    border: "1px solid #ffffff22",
                    background: ok ? "rgba(60,189,118,0.2)" : "rgba(220,85,85,0.2)",
                    color: ok ? "#c6f3d8" : "#ffd4d4",
                    fontSize: 12,
                    fontWeight: 800
                  }}>
                    {ok ? "✓ correct" : `✗ should be ${should === "do" ? "DO" : "DON’T"}`}
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={onContinue} style={btnPrimary}>Continue</button>
          </div>
        </>
      )}
    </div>
  );
}


function Checklist({ onContinue }) {
  const items = [
    { id: "cake", label: "Gaurav didn’t eat the cake he said he loves.", correct: true },
    { id: "ateLittle", label: "While Ayesha and Harriet ate, Gaurav hardly took a couple of bites.", correct: true },
    { id: "leftEarly", label: "He left the café early and backed out of the camping trip.", correct: true },
    { id: "assign", label: "They complained about assignments.", correct: false },
    { id: "college", label: "They mentioned going to college next year.", correct: false }
  ];

  const [picked, setPicked] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [summary, setSummary] = useState(null);

  const toggle = (id) => setPicked(p => ({ ...p, [id]: !p[id] }));

  const checkNotes = () => {
    const selected = items.filter(i => picked[i.id]);
    const correctSelected = selected.filter(i => i.correct).map(i => i.id);
    const wrongSelected = selected.filter(i => !i.correct).map(i => i.id);
    const missed = items.filter(i => i.correct && !picked[i.id]).map(i => i.id);

    setSummary({ correctSelected, wrongSelected, missed });
    setShowResults(true);
  };

  const pill = (ok) => ({
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    border: "1px solid #ffffff22",
    background: ok ? "rgba(60, 189, 118, 0.2)" : "rgba(220, 85, 85, 0.2)",
    color: ok ? "#c6f3d8" : "#ffd4d4",
    marginLeft: 8
  });

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {!showResults ? (
        <>
          <div style={{ color: "var(--text)" }}>
            Did you notice anything out of the ordinary? Tick what you think applied to Gaurav:
          </div>

          {/* All identical color BEFORE submit */}
          <div style={{ display: "grid", gap: 10 }}>
            {items.map(i => (
              <label
                key={i.id}
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                  color: "var(--text)",
                  cursor: "pointer"
                }}
              >
                <input
                  type="checkbox"
                  checked={!!picked[i.id]}
                  onChange={() => toggle(i.id)}
                  style={{ marginTop: 3 }}
                />
                <span>{i.label}</span>
              </label>
            ))}
          </div>

          <button
            onClick={checkNotes}
            style={{
              alignSelf: "end",
              background: "var(--accent)",
              color: "#351f45",
              padding: "8px 12px",
              borderRadius: 10,
              border: "1px solid #ffffff22",
              cursor: "pointer",
              fontWeight: 700
            }}
          >
            Check my notes
          </button>
        </>
      ) : (
        <>
          {/* AFTER submit: show which are correct/incorrect + missed */}
          <div style={{ color: "var(--text)", fontWeight: 700 }}>Your results</div>

          <div style={{ display: "grid", gap: 8 }}>
            {items.map(i => {
              const wasPicked = !!picked[i.id];
              const isCorrectPick = wasPicked && i.correct;
              const isWrongPick = wasPicked && !i.correct;
              const missedCorrect = !wasPicked && i.correct;

              let tag = null;
              if (isCorrectPick) tag = <span style={pill(true)}>✓ correct</span>;
              else if (isWrongPick) tag = <span style={pill(false)}>✗ not a sign</span>;
              else if (missedCorrect) tag = <span style={pill(true)}>✓ you missed this</span>;

              return (
                <div key={i.id} style={{ color: "var(--text)" }}>
                  {i.label} {tag}
                </div>
              );
            })}
          </div>

          <button
            onClick={onContinue}
            style={{
              justifySelf: "end",
              background: "var(--accent)",
              color: "#351f45",
              padding: "8px 12px",
              borderRadius: 10,
              border: "1px solid #ffffff22",
              cursor: "pointer",
              fontWeight: 700
            }}
          >
            Continue
          </button>
        </>
      )}
    </div>
  );
}



/* Scene view */
function SceneView({ scene, onChoose, setBackHandler }) {
  const [imgIndex, setImgIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [step, setStep] = useState(0);

  // ⬇ NEW: state for the notes panel (now correctly inside a component)
  const [notes, setNotes] = useLocalStorage("signs-notes", {
    Ayesha: "",
    Gaurav: "",
    Harriet: ""
  });
  const [noteOpen, setNoteOpen] = useState(false);

  const images = scene.images ?? [];
  const lines = Array.isArray(scene.dialogue) ? scene.dialogue : [];

  useEffect(() => { setImgIndex(0); setFeedback(null); setStep(0); }, [scene.id]);

  // let App's Back button pop a dialogue line first
  useEffect(() => {
    if (!setBackHandler) return;
    const handler = () => {
      if (feedback) return false;                  // when feedback is open, let parent handle scene back
      if (step > 0) { setStep(s => s - 1); return true; }  // consume one dialogue line
      return false;                                // not handled -> parent should go to previous scene
    };
    setBackHandler(handler);        // <-- store the actual function, not a wrapper
    return () => setBackHandler(null);
  }, [setBackHandler, step, feedback]);

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

    // narrator: plain text, no speaker pill
    if (line.type === "narr") {
      return <div style={{ color: "var(--text)" }}>{line.text}</div>;
    }

    if (line.type === "pc-internal") {
      return <div style={{ fontStyle: "italic", color: "#7a5a3a" }}>{line.text}</div>;
    }

    const isPC = line.type === "pc";
    return (
      <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
        <span
          style={{
            background: "color-mix(in oklab, var(--accent) 35%, transparent)",
            color: "var(--text)",
            padding: "2px 8px",
            borderRadius: 999,
            fontSize: 12,
            border: "1px solid #ffffff22",
            minWidth: 62,
            textAlign: "center",
          }}
        >
          {line.who || (isPC ? "PC" : "")}
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
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 20,
          position: "relative"
        }}
      >
        {/* Sticky Mental Note button (shows for scenes with meta.notePad) */}
        {scene.meta?.notePad && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setNoteOpen(true);
            }}
            style={{
              position: "absolute",
              right: 12,
              top: 12,
              zIndex: 5,
              background: "var(--accent)",
              color: "#0b1020",
              border: "1px solid #ffffff22",
              borderRadius: 12,
              padding: "8px 12px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Mental Note
          </button>
        )}

        <MentalNotePanel
          open={noteOpen}
          onClose={() => setNoteOpen(false)}
          notes={notes}
          setNotes={setNotes}
        />

        <h2 style={{ margin: 0, color: "var(--text)", textAlign: "center" }}>
          {scene.title}
        </h2>

        <div style={{ display: "grid", gap: 18, gridTemplateColumns: "1fr" }}>
          {scene.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => onChoose(opt.next)}
              style={{
                background: "rgba(35,27,40,0.86)",
                color: "var(--text)",
                padding: "28px 22px",
                borderRadius: 16,
                border: "1px solid #ffffff22",
                textAlign: "center",
                cursor: "pointer",
                fontSize: "1.2rem",
                fontWeight: 700,
              }}
            >
              <div>{opt.text}</div>
              <div
                style={{
                  fontSize: "1rem",
                  color: "var(--muted)",
                  marginTop: 8,
                }}
              >
                {opt.expCount}{" "}
                {opt.expCount === 1 ? "experience" : "experiences"}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // BLACK PANEL + overlay
  // BLACK PANEL + overlay
  return (
    <div
      style={{
        position: "relative",
        height: "74vh",
        borderRadius: 24,
        overflow: "hidden",
        background: "#000",
        border: "1px solid #ffffff22",
        maxWidth: 1200,
        margin: "0 auto"
      }}
      onClick={() => { if (canAdvance) setStep((s) => s + 1); }}
    >
      {/* ⬇️ NEW: Sticky Mental Note button on story panel */}
      {scene.meta?.notePad && (
        <button
          onClick={(e) => { e.stopPropagation(); setNoteOpen(true); }}
          style={{
            position: "absolute",
            right: 12,
            top: 12,
            zIndex: 5,
            background: "var(--accent)",
            color: "#0b1020",
            border: "1px solid #ffffff22",
            borderRadius: 12,
            padding: "8px 12px",
            fontWeight: 700,
            cursor: "pointer"
          }}
        >
          Mental Note
        </button>
      )}

      {/* ⬇️ NEW: The notes side panel itself */}
      <MentalNotePanel
        open={noteOpen}
        onClose={() => setNoteOpen(false)}
        notes={notes}
        setNotes={setNotes}
      />

      {/* background image */}
      {(() => {
        // Default: whatever the scene declared
        let imgPath = images[imgIndex];

        if (scene.id === "signsCafe") {
          // Helper to get a line's text safely
          const getText = (i) => (Array.isArray(lines) && lines[i] ? lines[i].text || "" : "");

          // Find the three key beats by scanning the dialogue once
          const idxGoNow = lines.findIndex(
            (l) => l?.who === "Gaurav" && l?.text?.startsWith("For sure. I’m gonna go now")
          );
          const idxReturns = lines.findIndex(
            (l) => l?.type === "narr" && l?.text?.toLowerCase().includes("gaurav returns briefly")
          );
          const idxLeaves = lines.findIndex(
            (l) => l?.type === "narr" && l?.text?.toLowerCase().includes("gaurav leaves the café")
          );

          // Start with ALL, then apply the timeline overrides
          imgPath = "/assets/signs/ALL.png";

          // After "I'm gonna go now" → Without
          if (idxGoNow !== -1 && step >= idxGoNow) {
            imgPath = "/assets/signs/WithoutGaurav.png";
          }
          // At "returns briefly" → back to ALL
          if (idxReturns !== -1 && step >= idxReturns) {
            imgPath = "/assets/signs/ALL.png";
          }
          // After "leaves the café" → Without again
          if (idxLeaves !== -1 && step >= idxLeaves) {
            imgPath = "/assets/signs/WithoutGaurav.png";
          }
        }

        return (
          <img
            src={resolveAsset(imgPath)}
            alt="Story panel"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        );
      })()}



      {/* bottom overlay */}
      <div
        style={{
          position: "absolute",
          left: 12,
          right: 12,
          bottom: 12,
          background: "rgba(35,27,40,0.86)",
          border: "1px solid #ffffff22",
          borderRadius: 14,
          padding: "12px 14px",
          display: "grid",
          gap: 10
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ color: "var(--muted)", fontSize: 12 }}>{scene.title}</div>
        {scene.meta?.review ? (
          <Checklist onContinue={() => onChoose("signsReview2")} />
        ) : scene.id === "help1_people" ? (
          <ChoiceWithFeedback
            title="Who do you think could be a good choice?"
            prompt="(Images show four people, but you can pick from the names below — we’ll explain why each might or might not be a good choice.)"
            options={[
              {
                label: "Mother",
                feedback:
                  "Caring and loving. Willing to talk things out. This depends on each individual—some might feel comfortable while others might need support from elsewhere. In this case, Gaurav does feel safe with his mom."
              },
              {
                label: "Gaurav’s Coach",
                feedback:
                  "Can be harsh; Gaurav feels pressured. The pressure and harshness can aggravate his behaviours. Time spent isn’t the key—focus on the person’s characteristics and how safe/supportive they feel."
              },
              {
                label: "Gaurav’s friend",
                feedback:
                  "Gaurav trusts him a lot and he’s playful/friendly. An adult can be more helpful in the uncertain stages of an eating disorder, but a good friend can still be a great support."
              },
              {
                label: "School Nurse",
                feedback:
                  "Efficient, kind, and a professional—often a good choice. Professional help plus kindness helps Gaurav feel more comfortable."
              }
            ]}
            onNext={() => onChoose("help2_value")}
          />
        ) : scene.id === "help2_value_opts" ? (
          <ChoiceWithFeedback
            title="Choose a way to show value and care"
            prompt="Pick an option to see why it helps (or doesn’t), then press Next."
            options={[
              {
                label: "Message them: “Hey! How are you?”",
                feedback: "A good starting point! Simple check-ins can open the door to conversation without pressure."
              },
              {
                label: "Meet at a restaurant to talk about their feelings.",
                feedback:
                  "A restaurant isn’t ideal when someone is struggling with an eating disorder—food context can add pressure and make opening up harder."
              },
              {
                label: "When you meet at school, give a warm hug and tell them you appreciate them and are proud of them.",
                feedback:
                  "Words of love and a supportive hug can go a long way. Affirmations help them feel valued beyond food or appearance."
              }
            ]}
            onNext={() => onChoose("help3_sort")}
          />
        ) : scene.id === "help3_sort" ? (
          <DosDontsSorter
            items={[
              "Discuss how they ‘look better’/‘look healthier’ or comment on your own body.",
              "Force them to talk.",
              "Force them to eat.",
              "Give them time when they need it.",
              "Talk when they are ready to.",
              "Skip meals or talk about your diet/wanting to lose weight in front of them.",
              "Compliment them on qualities other than physical ones.",
              "Speak openly and honestly.",
              "Walk on eggshells around them or treat them completely differently.",
              "Learn about eating disorders yourself."
            ]}
            /* Right answers: map index → 'do' or 'dont' */
            answerKey={{
              0: "dont", // comment on looks/body
              1: "dont", // force talk
              2: "dont", // force eat
              3: "do",   // give time
              4: "do",   // talk when ready
              5: "dont", // skip meals / diet talk in front of them
              6: "do",   // compliment non-physical qualities
              7: "do",   // speak openly and honestly
              8: "dont", // walk on eggshells or treat completely differently
              9: "do"    // learn about EDs yourself
            }}
            onContinue={() => onChoose("help4_listen")}
          />
        ) : feedback ? (
          /* existing feedback branch for wrong choices elsewhere */
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <div style={{ color: "var(--muted)" }}>{feedback.message}</div>
            <button
              onClick={() => { setFeedback(null); setImgIndex(0); }}
              style={{ background: "var(--accent-2)", color: "#351f45", padding: "8px 12px", borderRadius: 10, border: "1px solid #ffffff22", cursor: "pointer" }}
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            {/* current dialogue line */}
            {lines.length > 0 && renderLine(lines[step])}

            {/* Next button for line-by-line progression */}
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              {step < lines.length - 1 && !feedback && (
                <button
                  onClick={() => setStep((s) => s + 1)}
                  style={{ background: "var(--accent)", color: "#351f45", padding: "8px 12px", borderRadius: 10, border: "1px solid #ffffff22", cursor: "pointer" }}
                >
                  Next
                </button>
              )}
            </div>

            {/* Scene choices at the end */}
            {(!feedback && (lines.length === 0 || step >= lines.length - 1)) && scene.choices?.length > 0 && (
              <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
                {scene.choices.map((c, idx) => (
                  <button key={idx} onClick={() => handleChoice(c)} style={btnPrimary}>
                    {c.text}
                  </button>
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
  const backHandlerRef = useRef(null); // SceneView will register a handler
  const shell = { maxWidth: 1200, margin: "0 auto", padding: "12px 16px" };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      {!ack ? (
        <ContentWarningGate onContinue={() => setAck(true)} />
      ) : (
        <div style={shell}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={btnPrimary} onClick={() => { if (backHandlerRef.current && backHandlerRef.current()) return; back() }}>Back</button>
              <button style={btnPrimary} onClick={() => go("menu")}>Menu</button>
              <button style={btnPrimary} onClick={() => setAck(false)}>Exit</button>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={btnPrimary}>Credits</button>
              <button style={btnPrimary}>Settings</button>
            </div>
          </div>

          <SceneView
            scene={scene}
            onChoose={go}
            setBackHandler={(fn) => { backHandlerRef.current = fn; }}
          />
        </div>
      )}
    </div>
  );
}

