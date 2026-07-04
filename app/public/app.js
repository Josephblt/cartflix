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

const auth = {
  form: document.querySelector("[data-auth-form]"),
  username: document.querySelector("[data-auth-username]"),
  displayName: document.querySelector("[data-auth-display-name]"),
  password: document.querySelector("[data-auth-password]"),
  submit: document.querySelector("[data-auth-submit]"),
  message: document.querySelector("[data-auth-message]"),
  session: document.querySelector("[data-auth-session]"),
  user: document.querySelector("[data-auth-user]"),
  logout: document.querySelector("[data-auth-logout]"),
  mode: "login"
};

function setAuthMessage(message) {
  if (auth.message) auth.message.textContent = message || "";
}

function setAuthBusy(busy) {
  if (auth.submit) auth.submit.disabled = busy;
  if (auth.logout) auth.logout.disabled = busy;
}

function showAuthForm(mode) {
  auth.mode = mode;
  if (!auth.form || !auth.session) return;

  auth.form.hidden = false;
  auth.session.hidden = true;
  auth.displayName.hidden = mode !== "setup";
  auth.displayName.required = mode === "setup";
  auth.password.autocomplete = mode === "setup" ? "new-password" : "current-password";
  auth.submit.textContent = mode === "setup" ? "Create user" : "Sign in";
  setAuthMessage("");
}

function showSession(user) {
  if (!auth.form || !auth.session) return;

  auth.form.hidden = true;
  auth.session.hidden = false;
  auth.user.textContent = user?.displayName || user?.username || "";
}

async function requestJson(path, options = {}) {
  const headers = {
    accept: "application/json",
    ...(options.headers || {})
  };

  if (options.body !== undefined) {
    headers["content-type"] = "application/json";
  }

  const response = await fetch(path, {
    ...options,
    headers,
    cache: "no-store"
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.error || "Request failed.");
  }

  return result;
}

async function loadAuthStatus() {
  if (!auth.form) return;

  try {
    const status = await requestJson("api/auth/status", {
      method: "GET"
    });

    if (status.authenticated) {
      showSession(status.user);
      return;
    }

    showAuthForm(status.setupRequired ? "setup" : "login");
  } catch {
    showAuthForm("login");
    setAuthMessage("Unable to check sign-in.");
  }
}

async function submitAuth(event) {
  event.preventDefault();
  setAuthBusy(true);
  setAuthMessage("");

  const path = auth.mode === "setup" ? "api/auth/setup" : "api/auth/login";
  const payload = {
    username: auth.username.value,
    password: auth.password.value
  };

  if (auth.mode === "setup") payload.displayName = auth.displayName.value;

  try {
    const result = await requestJson(path, {
      method: "POST",
      body: JSON.stringify(payload)
    });
    auth.password.value = "";
    showSession(result.user);
  } catch (error) {
    setAuthMessage(error.message);
  } finally {
    setAuthBusy(false);
  }
}

async function logout() {
  setAuthBusy(true);

  try {
    await requestJson("api/auth/logout", {
      method: "POST",
      body: "{}"
    });
    showAuthForm("login");
  } catch {
    setAuthMessage("Unable to sign out.");
  } finally {
    setAuthBusy(false);
  }
}

auth.form?.addEventListener("submit", submitAuth);
auth.logout?.addEventListener("click", logout);

loadOpeningQuip();
loadAuthStatus();
