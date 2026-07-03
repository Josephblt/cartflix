const fs = require("node:fs/promises");
const path = require("node:path");

const DEFAULT_OPENING_QUIPS = [
  {
    quipId: "default-opening-quip",
    text: "The first rule of Cart Club is: You do not talk about Cart Club."
  }
];

function cleanQuip(quip) {
  const quipId = String(quip?.quipId || "").trim();
  const text = String(quip?.text || "").trim();

  if (!quipId || !text || text.includes("\n")) return null;
  return { quipId, text };
}

function chooseRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

async function readQuipFile(config) {
  const quipsPath = path.join(config.dataDir, "quips.json");
  return JSON.parse(await fs.readFile(quipsPath, "utf8"));
}

async function getOpeningQuip(config) {
  try {
    const data = await readQuipFile(config);

    if (data?.type !== "cartflixQuips" || data?.version !== 1) {
      return chooseRandom(DEFAULT_OPENING_QUIPS);
    }

    const openingQuips = Array.isArray(data.openingQuips)
      ? data.openingQuips.map(cleanQuip).filter(Boolean)
      : [];

    return chooseRandom(openingQuips.length > 0 ? openingQuips : DEFAULT_OPENING_QUIPS);
  } catch {
    return chooseRandom(DEFAULT_OPENING_QUIPS);
  }
}

module.exports = {
  getOpeningQuip
};
