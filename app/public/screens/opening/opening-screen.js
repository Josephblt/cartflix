import { requestJson } from "../../utils/http.js";

export function createOpeningScreen() {
  const section = document.createElement("section");
  section.className = "screen-group brand-group";
  section.dataset.openingView = "";
  section.innerHTML = `
    <img class="brand-mark" src="images/c_logo.png" alt="" width="180" height="180">
    <h1 id="app-title">Cartflix</h1>
    <p class="opening-quip" data-opening-quip>The first rule of Cart Club is: You do not talk about Cart Club.</p>
  `;
  return section;
}

async function loadOpeningQuip() {
  const target = document.querySelector("[data-opening-quip]");
  if (!target) return;

  try {
    const result = await requestJson("api/quips/opening");
    const text = String(result?.quip?.text || "").trim();
    if (text) target.textContent = text;
  } catch {
    // Keep the static fallback quip.
  }
}

function showLoginScreen() {
  const openingView = document.querySelector("[data-opening-view]");
  const loginView = document.querySelector("[data-login-view]");

  if (openingView) openingView.hidden = true;
  if (loginView) loginView.hidden = false;
}

export function initOpeningScreen({ durationMs, onComplete }) {
  loadOpeningQuip();

  window.setTimeout(() => {
    showLoginScreen();
    onComplete?.();
  }, durationMs);
}
