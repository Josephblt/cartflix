export async function loadHtml(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Could not load ${path}`);
  }

  const template = document.createElement("template");
  template.innerHTML = await response.text();
  return template.content.firstElementChild;
}
