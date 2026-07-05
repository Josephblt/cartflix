import { requestJson } from "../../utils/http.js";
import { loadHtml } from "../../utils/html.js";

const selectors = {
  form: "[data-auth-form]",
  message: "[data-auth-message]",
  password: "[data-auth-password]",
  submit: "[data-auth-submit]",
  username: "[data-auth-username]"
};

export function createLoginScreen() {
  return loadHtml("screens/login/login-screen.html");
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
    const result = await requestJson("api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        username: username?.value || "",
        password: password?.value || ""
      })
    });
    if (password) password.value = "";
    event.currentTarget.dispatchEvent(new CustomEvent("cartflix:login", {
      bubbles: true,
      detail: { user: result.user }
    }));
  } catch (error) {
    setMessage(error.message);
  } finally {
    setBusy(false);
  }
}

export function initLoginScreen() {
  element("form")?.addEventListener("submit", submitLogin);
}
