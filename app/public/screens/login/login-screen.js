import { requestJson } from "../../shared/http.js";

const selectors = {
  form: "[data-auth-form]",
  message: "[data-auth-message]",
  password: "[data-auth-password]",
  submit: "[data-auth-submit]",
  username: "[data-auth-username]"
};

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
