let installPromptEvent = null;

function createInstallButton() {
  const button = document.createElement("button");
  button.className = "install-prompt";
  button.type = "button";
  button.textContent = "Install";
  button.hidden = true;
  document.body.append(button);
  return button;
}

export function initInstallPrompt() {
  const button = createInstallButton();

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installPromptEvent = event;
    button.hidden = false;
  });

  window.addEventListener("appinstalled", () => {
    installPromptEvent = null;
    button.hidden = true;
  });

  button.addEventListener("click", async () => {
    if (!installPromptEvent) return;

    const promptEvent = installPromptEvent;
    installPromptEvent = null;
    button.hidden = true;
    await promptEvent.prompt();
  });
}
