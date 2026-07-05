let installPromptEvent = null;

function isIosDevice() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
    || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

function isAndroidDevice() {
  return /android/i.test(navigator.userAgent);
}

function isStandaloneApp() {
  return window.navigator.standalone === true
    || window.matchMedia("(display-mode: standalone)").matches;
}

function createInstallButton() {
  const button = document.createElement("button");
  button.className = "install-prompt";
  button.type = "button";
  button.textContent = "Install";
  button.hidden = true;
  document.body.append(button);
  return button;
}

function createIosInstallNotice() {
  const notice = document.createElement("section");
  notice.className = "ios-install-notice";
  notice.hidden = true;

  const copy = document.createElement("p");
  const title = document.createElement("strong");
  title.textContent = "Install on iPhone";
  copy.append(title, "Use Share, then Add to Home Screen.");

  const close = document.createElement("button");
  close.className = "ios-install-dismiss";
  close.type = "button";
  close.setAttribute("aria-label", "Dismiss install notice");
  close.title = "Dismiss";
  close.textContent = "x";

  notice.append(copy, close);
  document.body.append(notice);
  return { close, notice };
}

function createAndroidInstallNotice() {
  const notice = document.createElement("section");
  notice.className = "android-install-notice";
  notice.hidden = true;

  const copy = document.createElement("p");
  const title = document.createElement("strong");
  title.textContent = "Install on Android";
  copy.append(title, "Open Chrome menu, then Install app or Add to Home screen.");

  const close = document.createElement("button");
  close.className = "manual-install-dismiss";
  close.type = "button";
  close.setAttribute("aria-label", "Dismiss install notice");
  close.title = "Dismiss";
  close.textContent = "x";

  notice.append(copy, close);
  document.body.append(notice);
  return { close, notice };
}

export function initInstallPrompt() {
  const button = createInstallButton();
  const iosNotice = createIosInstallNotice();
  const androidNotice = createAndroidInstallNotice();
  const standalone = isStandaloneApp();
  const iosDismissed = localStorage.getItem("cartflix:iosInstallDismissed") === "true";
  const androidEligible = isAndroidDevice() && !standalone;

  iosNotice.notice.hidden = iosDismissed || !isIosDevice() || standalone;
  button.hidden = !androidEligible;

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installPromptEvent = event;
    button.hidden = false;
    iosNotice.notice.hidden = true;
    androidNotice.notice.hidden = true;
  });

  window.addEventListener("appinstalled", () => {
    installPromptEvent = null;
    button.hidden = true;
    iosNotice.notice.hidden = true;
    androidNotice.notice.hidden = true;
  });

  iosNotice.close.addEventListener("click", () => {
    localStorage.setItem("cartflix:iosInstallDismissed", "true");
    iosNotice.notice.hidden = true;
  });

  androidNotice.close.addEventListener("click", () => {
    localStorage.setItem("cartflix:androidInstallDismissed", "true");
    androidNotice.notice.hidden = true;
  });

  button.addEventListener("click", async () => {
    if (!installPromptEvent) {
      androidNotice.notice.hidden = localStorage.getItem("cartflix:androidInstallDismissed") === "true" || !androidEligible;
      return;
    }

    const promptEvent = installPromptEvent;
    installPromptEvent = null;
    button.hidden = true;
    await promptEvent.prompt();
  });
}
