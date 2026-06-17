import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Wednesday — Nevermore Academy" },
      { name: "description", content: "Enter the dark, gothic world of Wednesday Addams at Nevermore Academy." },
      { property: "og:title", content: "Wednesday — Nevermore Academy" },
      { property: "og:description", content: "Enter the dark, gothic world of Wednesday Addams at Nevermore Academy." },
    ],
  }),
  component: Index,
});

function Index() {
  // Redirect to the static gothic login page served from /public.
  useEffect(() => {
    window.location.replace("/login.html");
  }, []);
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif" }}>
      <noscript>
        <a href="/login.html" style={{ color: "#fff" }}>Enter Nevermore →</a>
      </noscript>
      <p style={{ opacity: 0.6 }}>Entering Nevermore…</p>
    </div>
  );
}
