import { createLoginScreen, initLoginScreen } from "./login/login-screen.js";
import { createOpeningScreen, initOpeningScreen } from "./opening/opening-screen.js";
import { createWelcomeScreen, setWelcomeUser } from "./welcome/welcome-screen.js";
import { requestJson } from "../utils/http.js";
import { initInstallPrompt } from "../utils/install-prompt.js";
import { registerServiceWorker } from "../utils/service-worker.js";

const OPENING_DURATION_MS = 1600;
const appRoot = document.querySelector("[data-app-root]");

registerServiceWorker();
initInstallPrompt();

async function initApp() {
  if (!appRoot) return;

  const [openingScreen, loginScreen, welcomeScreen, authState] = await Promise.all([
    createOpeningScreen(),
    createLoginScreen(),
    createWelcomeScreen(),
    currentAuthState()
  ]);

  appRoot.append(openingScreen, loginScreen, welcomeScreen);

  initLoginScreen();
  appRoot.addEventListener("cartflix:login", (event) => {
    showWelcome(event.detail?.user);
  });

  initOpeningScreen({
    durationMs: OPENING_DURATION_MS,
    onComplete: () => {
      if (authState?.authenticated) {
        showWelcome(authState.user);
      } else {
        showLogin();
      }
    }
  });
}

initApp();

async function currentAuthState() {
  try {
    return await requestJson("api/auth/status");
  } catch {
    return { authenticated: false, user: null };
  }
}

function showLogin() {
  const loginView = document.querySelector("[data-login-view]");
  const welcomeView = document.querySelector("[data-welcome-view]");

  if (welcomeView) welcomeView.hidden = true;
  if (loginView) loginView.hidden = false;
  document.querySelector("[data-auth-username]")?.focus();
}

function showWelcome(user) {
  const loginView = document.querySelector("[data-login-view]");
  const welcomeView = document.querySelector("[data-welcome-view]");

  setWelcomeUser(user);
  if (loginView) loginView.hidden = true;
  if (welcomeView) welcomeView.hidden = false;
}
