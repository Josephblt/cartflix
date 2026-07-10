import { createLoginScreen, initLoginScreen } from "./login/login-screen.js";
import { createOpeningScreen, initOpeningScreen } from "./opening/opening-screen.js";
import { createSetupScreen, initSetupScreen } from "./setup/setup-screen.js";
import { createWelcomeScreen, setWelcomeUser } from "./welcome/welcome-screen.js";
import { requestJson } from "../utils/http.js";
import { registerServiceWorker } from "../utils/service-worker.js";

const OPENING_DURATION_MS = 1600;
const appRoot = document.querySelector("[data-app-root]");

registerServiceWorker();

async function initApp() {
  if (!appRoot) return;

  const [openingScreen, loginScreen, setupScreen, welcomeScreen, authState] = await Promise.all([
    createOpeningScreen(),
    createLoginScreen(),
    createSetupScreen(),
    createWelcomeScreen(),
    currentAuthState()
  ]);

  appRoot.append(openingScreen, loginScreen, setupScreen, welcomeScreen);

  initLoginScreen();
  initSetupScreen();
  appRoot.addEventListener("cartflix:login", (event) => {
    showWelcome(event.detail?.user);
  });
  appRoot.addEventListener("cartflix:setup", (event) => {
    showWelcome(event.detail?.user);
  });

  initOpeningScreen({
    durationMs: OPENING_DURATION_MS,
    onComplete: () => {
      if (authState?.authenticated) {
        showWelcome(authState.user);
      } else if (authState?.setupRequired) {
        showSetup(authState.setupAllowed);
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
  const setupView = document.querySelector("[data-setup-view]");
  const welcomeView = document.querySelector("[data-welcome-view]");

  if (setupView) setupView.hidden = true;
  if (welcomeView) welcomeView.hidden = true;
  if (loginView) loginView.hidden = false;
  document.querySelector("[data-auth-username]")?.focus();
}

function showSetup(allowed) {
  const loginView = document.querySelector("[data-login-view]");
  const setupView = document.querySelector("[data-setup-view]");
  const welcomeView = document.querySelector("[data-welcome-view]");
  const form = document.querySelector("[data-setup-form]");
  const message = document.querySelector("[data-setup-message]");

  if (loginView) loginView.hidden = true;
  if (welcomeView) welcomeView.hidden = true;
  if (setupView) setupView.hidden = false;

  if (!allowed) {
    if (form) form.hidden = true;
    if (message) {
      message.textContent = "Open Cartflix locally on the host machine to finish setup.";
      message.hidden = false;
    }
    return;
  }

  if (form) form.hidden = false;
  if (message) message.hidden = true;
  document.querySelector("[data-setup-display-name]")?.focus();
}

function showWelcome(user) {
  const loginView = document.querySelector("[data-login-view]");
  const setupView = document.querySelector("[data-setup-view]");
  const welcomeView = document.querySelector("[data-welcome-view]");

  setWelcomeUser(user);
  if (loginView) loginView.hidden = true;
  if (setupView) setupView.hidden = true;
  if (welcomeView) welcomeView.hidden = false;
}
