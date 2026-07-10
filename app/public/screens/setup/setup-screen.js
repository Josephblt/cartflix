import { requestJson } from "../../utils/http.js";
import { loadHtml } from "../../utils/html.js";

const selectors = {
  displayName: "[data-setup-display-name]",
  form: "[data-setup-form]",
  message: "[data-setup-message]",
  password: "[data-setup-password]",
  submit: "[data-setup-submit]",
  username: "[data-setup-username]"
};

export function createSetupScreen() {
  return loadHtml("screens/setup/setup-screen.html");
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

async function submitSetup(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const displayName = element("displayName");
  const username = element("username");
  const password = element("password");

  setBusy(true);
  setMessage("");

  try {
    const result = await requestJson("api/auth/setup", {
      method: "POST",
      body: JSON.stringify({
        displayName: displayName?.value || "",
        username: username?.value || "",
        password: password?.value || ""
      })
    });
    if (password) password.value = "";
    form.dispatchEvent(new CustomEvent("cartflix:setup", {
      bubbles: true,
      detail: { user: result.user }
    }));
  } catch (error) {
    setMessage(error.message);
  } finally {
    setBusy(false);
  }
}

export function initSetupScreen() {
  element("form")?.addEventListener("submit", submitSetup);
}
