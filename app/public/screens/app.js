import { initLoginScreen } from "./login/login-screen.js";
import { initOpeningScreen } from "./opening/opening-screen.js";

const OPENING_DURATION_MS = 1600;

initLoginScreen();
initOpeningScreen({
  durationMs: OPENING_DURATION_MS,
  onComplete: () => {
    document.querySelector("[data-auth-username]")?.focus();
  }
});
