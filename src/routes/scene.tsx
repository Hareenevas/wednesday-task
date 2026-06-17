import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { WednesdayScene } from "../lib/wednesday-scenes";

export const Route = createFileRoute("/scene")({
  head: () => ({
    meta: [
      { title: "Nevermore — Scene Revealed" },
      { name: "description", content: "A scene from Wednesday, revealed for you." },
      { property: "og:title", content: "Nevermore — Scene Revealed" },
      { property: "og:description", content: "A gothic scene from the Wednesday series." },
    ],
  }),
  component: ScenePage,
});

function ScenePage() {
  const navigate = useNavigate();
  const [scene, setScene] = useState<WednesdayScene | null>(null);

  useEffect(() => {
    document.body.classList.add("page-scene");
    return () => document.body.classList.remove("page-scene");
  }, []);

  // Pull the chosen scene from localStorage; bounce back if none.
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("wednesday.scene") || "null");
    if (!stored) {
      navigate({ to: "/register" });
      return;
    }
    setScene(stored);
  }, [navigate]);

  function generateAnother() {
    localStorage.removeItem("wednesday.scene");
    navigate({ to: "/register" });
  }

  if (!scene) return null;

  return (
    <main className="scene-shell fade-in">
      <section className="hero">
        <p className="eyebrow">A Scene Revealed</p>
        <h1 className="hero-title">{scene.title}</h1>
        <p className="hero-sub">{scene.shortDescription}</p>
      </section>

      <section className="scene-grid">
        <article className="scene-card">
          <h3>Mood</h3>
          <p>{scene.mood}</p>
        </article>
        <article className="scene-card">
          <h3>Location</h3>
          <p>{scene.location}</p>
        </article>
        <article className="scene-card">
          <h3>Significance</h3>
          <p>{scene.significance}</p>
        </article>
      </section>

      <section className="scene-detail">
        <h2>The Scene</h2>
        <p>{scene.detailedDescription}</p>
      </section>

      <div className="actions">
        <button type="button" className="btn btn-primary" onClick={generateAnother}>
          Generate Another Scene
        </button>
        <Link to="/login" className="btn btn-ghost">Sign Out</Link>
      </div>
    </main>
  );
}
