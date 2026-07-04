import { requestJson } from "../../shared/http.js";

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
