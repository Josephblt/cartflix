import { requestJson } from "../../utils/http.js";

const selectors = {
  form: "[data-auth-form]",
  message: "[data-auth-message]",
  password: "[data-auth-password]",
  submit: "[data-auth-submit]",
  username: "[data-auth-username]"
};

export function createLoginScreen() {
  const section = document.createElement("section");
  section.className = "screen-group login-group";
  section.dataset.loginView = "";
  section.hidden = true;
  section.innerHTML = `
    <form class="auth-form" data-auth-form>
      <input class="auth-input" data-auth-username name="username" autocomplete="username" placeholder="Username" required>
      <input class="auth-input" data-auth-password name="password" autocomplete="current-password" placeholder="Password" type="password" required>
      <button class="auth-submit" data-auth-submit type="submit">Login</button>
      <p class="auth-message" data-auth-message aria-live="polite" hidden></p>
    </form>
  `;
  return section;
}

function element(name) {
  return document.querySelector(selectors[name]);
}

function setBusy(busy) {
  const submit = element("submit");
  if (submit) submit.disabled = busy;
}

function setMessage(message) {
  const target = element("message");
  if (!target) return;

  target.textContent = message || "";
  target.hidden = !message;
}

async function submitLogin(event) {
  event.preventDefault();

  const username = element("username");
  const password = element("password");

  setBusy(true);
  setMessage("");

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
    setMessage(error.message);
  } finally {
    setBusy(false);
  }
}

export function initLoginScreen() {
  element("form")?.addEventListener("submit", submitLogin);
}
