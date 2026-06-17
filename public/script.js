/* =========================================================
   Wednesday — Nevermore
   Vanilla JS handling auth, registration, scene reveal.
   ========================================================= */

// --- Predefined Wednesday scenes (at least 10) -----------
const WEDNESDAY_SCENES = [
  {
    title: "Wednesday's Rave'N Dance",
    shortDescription: "An unforgettable dance that breaks the internet.",
    detailedDescription:
      "Beneath a sky of falling black confetti, Wednesday takes the floor and performs a jagged, hypnotic dance that becomes instantly iconic. Every twitch and stomp tells a story of defiance, turning a school formal into a quiet rebellion.",
    mood: "Hypnotic & Defiant",
    location: "Nevermore Academy Gymnasium",
    significance: "Defines Wednesday's unapologetic identity in a single dance."
  },
  {
    title: "Arrival at Nevermore Academy",
    shortDescription: "Wednesday steps through the gothic gates for the first time.",
    detailedDescription:
      "Mist curls around the stone arches as Wednesday walks toward Nevermore in her crisp black uniform. The academy looms ahead like a cathedral of secrets, and from the first step she signals she will not be tamed.",
    mood: "Ominous & Curious",
    location: "Nevermore Academy Gates",
    significance: "Marks the beginning of her journey among outcasts."
  },
  {
    title: "Wednesday Meets Enid",
    shortDescription: "Two opposites collide in a rainbow-and-black dorm.",
    detailedDescription:
      "Enid throws open the door to a room split in two: half neon plush, half monastic black. Their first words are a duel of personalities, and yet beneath the friction the seed of an unlikely friendship is planted.",
    mood: "Tense & Playful",
    location: "Ophelia Hall Dorm Room",
    significance: "Establishes the show's central friendship."
  },
  {
    title: "Poe Cup Competition",
    shortDescription: "A chaotic boat race across Crackstone's Crypt lake.",
    detailedDescription:
      "Sabotage, splinters, and screaming fill the air as the houses of Nevermore battle on the water. Wednesday wields cunning like an oar, steering her crew toward an unexpected victory.",
    mood: "Chaotic & Triumphant",
    location: "Crackstone's Crypt Lake",
    significance: "Wednesday earns grudging respect from her peers."
  },
  {
    title: "Nightshade Library Discovery",
    shortDescription: "A secret society's hidden chamber unveiled.",
    detailedDescription:
      "Behind a moving bookshelf, candlelight flickers over a circular chamber etched with old symbols. Wednesday steps inside, and the academy's secret history begins to peel open like a forbidden book.",
    mood: "Mysterious & Reverent",
    location: "Nevermore's Hidden Library",
    significance: "Unlocks the mystery of the Nightshades."
  },
  {
    title: "Gates Mansion Investigation",
    shortDescription: "An abandoned mansion holds the key to everything.",
    detailedDescription:
      "Dust motes drift through broken light as Wednesday and Enid creep through the Gates estate. Every painting watches, every floorboard accuses, and the past begins whispering its names.",
    mood: "Eerie & Suspenseful",
    location: "Gates Family Mansion",
    significance: "Reveals the bloodline behind the conspiracy."
  },
  {
    title: "Hyde Monster Revelation",
    shortDescription: "The monster wears a familiar face.",
    detailedDescription:
      "In a single, breath-stealing moment, the Hyde's identity is laid bare. Trust collapses, and Wednesday realizes that the closest danger has been wearing the warmest smile.",
    mood: "Shocking & Cold",
    location: "Weathervane Café Backroom",
    significance: "Pivotal twist that reframes the entire season."
  },
  {
    title: "Thing Saving Wednesday",
    shortDescription: "A loyal hand intervenes at the perfect moment.",
    detailedDescription:
      "Just as the night closes in around her, Thing scuttles into the frame — fingers flexing, defiant. Small, severed, and entirely devoted, he proves that family is not measured in limbs.",
    mood: "Tender & Triumphant",
    location: "Nevermore Grounds",
    significance: "Cements Thing as Wednesday's truest ally."
  },
  {
    title: "Crackstone Battle",
    shortDescription: "Wednesday faces an ancient evil reborn.",
    detailedDescription:
      "Lightning splits the sky over Nevermore as Crackstone rises from centuries of silence. Wednesday stands at the front of her classmates, sword in hand, the past and future colliding in a single strike.",
    mood: "Epic & Defiant",
    location: "Nevermore Quad",
    significance: "Climactic confrontation of the season."
  },
  {
    title: "Final Nevermore Celebration",
    shortDescription: "A bittersweet farewell as the term ends.",
    detailedDescription:
      "The dust settles. Students gather under a bruised sky, packing trunks and trading promises. Wednesday allows herself the rarest expression of all — the faintest, most knowing smile.",
    mood: "Bittersweet & Hopeful",
    location: "Nevermore Courtyard",
    significance: "Sets the stage for what comes next."
  }
];

// --- Helpers ---------------------------------------------
function setError(name, message) {
  const el = document.querySelector(`[data-error-for="${name}"]`);
  if (el) el.textContent = message || "";
}
function clearErrors(form) {
  form.querySelectorAll(".error").forEach((e) => (e.textContent = ""));
}
function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

// --- Page routing ----------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const path = (location.pathname.split("/").pop() || "login.html").toLowerCase();

  if (path === "" || path === "login.html") initLogin();
  else if (path === "register.html") initRegister();
  else if (path === "scene.html") initScene();
});

// --- Login Page ------------------------------------------
function initLogin() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors(form);

    const username = form.username.value.trim();
    const password = form.password.value;

    let ok = true;
    if (username.length < 3) {
      setError("username", "Username must be at least 3 characters.");
      ok = false;
    }
    if (password.length < 6) {
      setError("password", "Password must be at least 6 characters.");
      ok = false;
    }
    if (!ok) return;

    // Persist minimal session data
    localStorage.setItem("wednesday.user", JSON.stringify({ username, loggedInAt: Date.now() }));
    window.location.href = "register.html";
  });
}

// --- Registration Page -----------------------------------
function initRegister() {
  const form = document.getElementById("registerForm");
  if (!form) return;

  // Greet the user if we have one
  const user = JSON.parse(localStorage.getItem("wednesday.user") || "null");
  const welcome = document.getElementById("welcomeLine");
  if (user && welcome) welcome.textContent = `Welcome, ${user.username}. Complete your enrollment.`;

  // Prefill if already registered
  const existing = JSON.parse(localStorage.getItem("wednesday.registration") || "null");
  if (existing) {
    form.fullName.value = existing.fullName || "";
    form.email.value = existing.email || "";
    form.age.value = existing.age || "";
    form.character.value = existing.character || "";
    toggleReveal(true);
  }

  const revealSection = document.getElementById("revealSection");
  const revealBtn = document.getElementById("revealBtn");

  function toggleReveal(show) {
    if (!revealSection) return;
    revealSection.classList.toggle("hidden", !show);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors(form);

    const fullName = form.fullName.value.trim();
    const email = form.email.value.trim();
    const age = parseInt(form.age.value, 10);
    const character = form.character.value;

    let ok = true;
    if (fullName.length < 2) { setError("fullName", "Please enter your full name."); ok = false; }
    if (!isValidEmail(email)) { setError("email", "Please enter a valid email."); ok = false; }
    if (!age || age < 10 || age > 120) { setError("age", "Enter an age between 10 and 120."); ok = false; }
    if (!character) { setError("character", "Pick a favorite character."); ok = false; }
    if (!ok) return;

    localStorage.setItem(
      "wednesday.registration",
      JSON.stringify({ fullName, email, age, character, registeredAt: Date.now() })
    );
    toggleReveal(true);
  });

  if (revealBtn) {
    revealBtn.addEventListener("click", () => {
      const scene = WEDNESDAY_SCENES[Math.floor(Math.random() * WEDNESDAY_SCENES.length)];
      localStorage.setItem("wednesday.scene", JSON.stringify(scene));
      window.location.href = "scene.html";
    });
  }
}

// --- Scene Page ------------------------------------------
function initScene() {
  const scene = JSON.parse(localStorage.getItem("wednesday.scene") || "null");
  if (!scene) {
    // No scene? Send them back to register.
    window.location.href = "register.html";
    return;
  }

  document.getElementById("sceneTitle").textContent = scene.title;
  document.getElementById("sceneShort").textContent = scene.shortDescription;
  document.getElementById("sceneMood").textContent = scene.mood;
  document.getElementById("sceneLocation").textContent = scene.location;
  document.getElementById("sceneSignificance").textContent = scene.significance;
  document.getElementById("sceneDetail").textContent = scene.detailedDescription;

  const again = document.getElementById("generateAnother");
  if (again) {
    again.addEventListener("click", () => {
      // Return to registration page to trigger another reveal
      localStorage.removeItem("wednesday.scene");
      window.location.href = "register.html";
    });
  }
}
