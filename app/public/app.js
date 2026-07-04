const OPENING_DURATION_MS = 1600;

async function loadOpeningQuip() {
  const target = document.querySelector("[data-opening-quip]");
  if (!target) return;

  try {
    const response = await fetch("api/quips/opening", {
      headers: {
        accept: "application/json"
      },
      cache: "no-store"
    });

    if (!response.ok) return;

    const result = await response.json();
    const text = String(result?.quip?.text || "").trim();
    if (text) target.textContent = text;
  } catch {
    // Keep the static fallback quip.
  }
}

function showLoginScreen() {
  const openingView = document.querySelector("[data-opening-view]");
  const loginView = document.querySelector("[data-login-view]");
  const username = document.querySelector("[data-auth-username]");

  if (openingView) openingView.hidden = true;
  if (loginView) loginView.hidden = false;
  username?.focus();
}

function setAuthBusy(busy) {
  const submit = document.querySelector("[data-auth-submit]");
  if (submit) submit.disabled = busy;
}

function setAuthMessage(message) {
  const target = document.querySelector("[data-auth-message]");
  if (!target) return;

  target.textContent = message || "";
  target.hidden = !message;
}

async function requestJson(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      ...(options.headers || {})
    },
    cache: "no-store"
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.error || "Request failed.");
  }

  return result;
}

async function submitLogin(event) {
  event.preventDefault();

  const username = document.querySelector("[data-auth-username]");
  const password = document.querySelector("[data-auth-password]");

  setAuthBusy(true);
  setAuthMessage("");

  try {
    await requestJson("api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        username: username?.value || "",
        password: password?.value || ""
      })
    });
    if (password) password.value = "";
  } catch (error) {
    setAuthMessage(error.message);
  } finally {
    setAuthBusy(false);
  }
}

document.querySelector("[data-auth-form]")?.addEventListener("submit", submitLogin);

loadOpeningQuip();
setTimeout(showLoginScreen, OPENING_DURATION_MS);
