import { loadHtml } from "../../utils/html.js";

export function createWelcomeScreen() {
  return loadHtml("screens/welcome/welcome-screen.html");
}

export function setWelcomeUser(user) {
  const target = document.querySelector("[data-welcome-name]");
  if (!target) return;

  target.textContent = user?.displayName || user?.username || "Cartflix";
}
