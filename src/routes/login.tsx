import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Nevermore — Login" },
      { name: "description", content: "Enter Nevermore Academy. A Wednesday-inspired gothic experience." },
      { property: "og:title", content: "Nevermore — Login" },
      { property: "og:description", content: "Sign in to enter the shadows." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  // Apply the page background class on mount and clean up on unmount.
  useEffect(() => {
    document.body.classList.add("page-login");
    return () => document.body.classList.remove("page-login");
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (username.trim().length < 3) next.username = "Username must be at least 3 characters.";
    if (password.length < 6) next.password = "Password must be at least 6 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;

    // Persist minimal session data
    localStorage.setItem(
      "wednesday.user",
      JSON.stringify({ username: username.trim(), loggedInAt: Date.now() })
    );
    navigate({ to: "/register" });
  }

  return (
    <main className="auth-shell fade-in">
      <section className="auth-card">
        <header className="auth-header">
          <p className="eyebrow">Nevermore Academy</p>
          <h1 className="title">Wednesday</h1>
          <p className="subtitle">Sign in to enter the shadows.</p>
        </header>

        <form className="form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="wednesday.addams"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <small className="error">{errors.username || ""}</small>
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <small className="error">{errors.password || ""}</small>
          </div>

          <button type="submit" className="btn btn-primary">Enter Nevermore</button>
        </form>

        <p className="foot-note">"I find social media to be a soul-sucking void of meaningless affirmation."</p>
      </section>
    </main>
  );
}
