const fs = require("node:fs/promises");
const path = require("node:path");

const DEFAULT_QUIP_DATA = {
  type: "cartflixQuips",
  version: 1,
  openingQuips: [
    {
      quipId: "018f6a3d-7b8e-7a11-9f50-2c2c2edc0201",
      text: "The first rule of Cart Club is: You do not talk about Cart Club."
    }
  ],
  cartyGreetingQuips: []
};

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

async function ensureQuipFile(config) {
  const quipsPath = path.join(config.dataDir, "quips.json");

  await fs.mkdir(config.dataDir, { recursive: true });

  try {
    await fs.writeFile(quipsPath, `${JSON.stringify(DEFAULT_QUIP_DATA, null, 2)}\n`, {
      encoding: "utf8",
      flag: "wx"
    });
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
  }
}

async function getOpeningQuip(config) {
  try {
    const data = await readQuipFile(config);

    if (data?.type !== "cartflixQuips" || data?.version !== 1) {
      return chooseRandom(DEFAULT_QUIP_DATA.openingQuips);
    }

    const openingQuips = Array.isArray(data.openingQuips)
      ? data.openingQuips.map(cleanQuip).filter(Boolean)
      : [];

    return chooseRandom(openingQuips.length > 0 ? openingQuips : DEFAULT_QUIP_DATA.openingQuips);
  } catch {
    return chooseRandom(DEFAULT_QUIP_DATA.openingQuips);
  }
}

module.exports = {
  ensureQuipFile,
  getOpeningQuip
};
