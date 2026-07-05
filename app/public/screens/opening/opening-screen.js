import { requestJson } from "../../utils/http.js";
import { loadHtml } from "../../utils/html.js";

export function createOpeningScreen() {
  return loadHtml("screens/opening/opening-screen.html");
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

function hideOpeningScreen() {
  const openingView = document.querySelector("[data-opening-view]");

  if (openingView) openingView.hidden = true;
}

export function initOpeningScreen({ durationMs, onComplete }) {
  loadOpeningQuip();

  window.setTimeout(() => {
    hideOpeningScreen();
    onComplete?.();
  }, durationMs);
}
