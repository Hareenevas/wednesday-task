import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { WEDNESDAY_SCENES } from "../lib/wednesday-scenes";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Nevermore — Registration" },
      { name: "description", content: "Register at Nevermore Academy." },
      { property: "og:title", content: "Nevermore — Registration" },
      { property: "og:description", content: "Complete your enrollment at Nevermore." },
    ],
  }),
  component: RegisterPage,
});

const CHARACTERS = [
  "Wednesday Addams", "Enid Sinclair", "Thing", "Morticia Addams", "Gomez Addams",
  "Xavier Thorpe", "Tyler Galpin", "Bianca Barclay", "Principal Weems", "Uncle Fester",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function RegisterPage() {
  const navigate = useNavigate();
  const [welcome, setWelcome] = useState("Complete your enrollment.");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [character, setCharacter] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    document.body.classList.add("page-register");
    return () => document.body.classList.remove("page-register");
  }, []);

  // Hydrate from storage on the client.
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("wednesday.user") || "null");
    if (user?.username) setWelcome(`Welcome, ${user.username}. Complete your enrollment.`);

    const existing = JSON.parse(localStorage.getItem("wednesday.registration") || "null");
    if (existing) {
      setFullName(existing.fullName || "");
      setEmail(existing.email || "");
      setAge(existing.age != null ? String(existing.age) : "");
      setCharacter(existing.character || "");
      setRevealed(true);
    }
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    const ageNum = parseInt(age, 10);
    if (fullName.trim().length < 2) next.fullName = "Please enter your full name.";
    if (!EMAIL_RE.test(email.trim())) next.email = "Please enter a valid email.";
    if (!ageNum || ageNum < 10 || ageNum > 120) next.age = "Enter an age between 10 and 120.";
    if (!character) next.character = "Pick a favorite character.";
    setErrors(next);
    if (Object.keys(next).length) return;

    localStorage.setItem(
      "wednesday.registration",
      JSON.stringify({
        fullName: fullName.trim(),
        email: email.trim(),
        age: ageNum,
        character,
        registeredAt: Date.now(),
      })
    );
    setRevealed(true);
  }

  function reveal() {
    const scene = WEDNESDAY_SCENES[Math.floor(Math.random() * WEDNESDAY_SCENES.length)];
    localStorage.setItem("wednesday.scene", JSON.stringify(scene));
    navigate({ to: "/scene" });
  }

  return (
    <main className="auth-shell fade-in">
      <section className="auth-card wide">
        <header className="auth-header">
          <p className="eyebrow">Student Registration</p>
          <h1 className="title">Join Nevermore</h1>
          <p className="subtitle">{welcome}</p>
        </header>

        <form className="form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="fullName">Full Name</label>
            <input id="fullName" type="text" placeholder="Wednesday Addams"
              value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <small className="error">{errors.fullName || ""}</small>
          </div>

          <div className="grid-2">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" placeholder="you@nevermore.edu"
                value={email} onChange={(e) => setEmail(e.target.value)} />
              <small className="error">{errors.email || ""}</small>
            </div>

            <div className="field">
              <label htmlFor="age">Age</label>
              <input id="age" type="number" min={10} max={120} placeholder="16"
                value={age} onChange={(e) => setAge(e.target.value)} />
              <small className="error">{errors.age || ""}</small>
            </div>
          </div>

          <div className="field">
            <label htmlFor="character">Favorite Wednesday Character</label>
            <select id="character" value={character} onChange={(e) => setCharacter(e.target.value)}>
              <option value="">Select a character…</option>
              {CHARACTERS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <small className="error">{errors.character || ""}</small>
          </div>

          <button type="submit" className="btn btn-primary">Complete Registration</button>
        </form>

        <div className={`reveal${revealed ? "" : " hidden"}`}>
          <p className="reveal-note">Welcome to Nevermore. The shadows have something to show you.</p>
          <button type="button" className="btn btn-ghost" onClick={reveal}>
            Reveal a Wednesday Scene
          </button>
        </div>
      </section>
    </main>
  );
}
