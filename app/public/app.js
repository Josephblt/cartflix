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

loadOpeningQuip();
