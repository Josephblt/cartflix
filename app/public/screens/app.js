import { createLoginScreen, initLoginScreen } from "./login/login-screen.js";
import { createOpeningScreen, initOpeningScreen } from "./opening/opening-screen.js";

const OPENING_DURATION_MS = 1600;
const appRoot = document.querySelector("[data-app-root]");

if (appRoot) {
  appRoot.append(createOpeningScreen(), createLoginScreen());

  initLoginScreen();
  initOpeningScreen({
    durationMs: OPENING_DURATION_MS,
    onComplete: () => {
      document.querySelector("[data-auth-username]")?.focus();
    }
  });
}
