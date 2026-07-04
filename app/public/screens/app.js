import { createLoginScreen, initLoginScreen } from "./login/login-screen.js";
import { createOpeningScreen, initOpeningScreen } from "./opening/opening-screen.js";

const OPENING_DURATION_MS = 1600;
const appRoot = document.querySelector("[data-app-root]");

async function initApp() {
  if (!appRoot) return;

  const [openingScreen, loginScreen] = await Promise.all([
    createOpeningScreen(),
    createLoginScreen()
  ]);

  appRoot.append(openingScreen, loginScreen);

  initLoginScreen();
  initOpeningScreen({
    durationMs: OPENING_DURATION_MS,
    onComplete: () => {
      document.querySelector("[data-auth-username]")?.focus();
    }
  });
}

initApp();
