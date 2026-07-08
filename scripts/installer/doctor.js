const fs = require("node:fs/promises");
const http = require("node:http");
const net = require("node:net");
const path = require("node:path");

const REQUIRED_APP_FILES = [
  "app/server.js",
  "app/lib/config.js",
  "app/public/index.html"
];

function nodeMajor(version = process.version) {
  const match = /^v(\d+)/.exec(version);
  return match ? Number(match[1]) : 0;
}

function line(label, status, detail = "") {
  const padded = `${label}:`.padEnd(24, " ");
  console.log(`${padded}${status}${detail ? ` ${detail}` : ""}`);
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function checkRequiredFiles(repoRoot) {
  const missing = [];

  for (const relativePath of REQUIRED_APP_FILES) {
    if (!(await pathExists(path.join(repoRoot, relativePath)))) {
      missing.push(relativePath);
    }
  }

  return {
    ok: missing.length === 0,
    missing
  };
}

async function nearestExistingParent(targetPath) {
  let current = path.resolve(targetPath);

  while (!(await pathExists(current))) {
    const parent = path.dirname(current);
    if (parent === current) return current;
    current = parent;
  }

  return current;
}

async function checkDataDir(dataDir) {
  if (await pathExists(dataDir)) {
    try {
      await fs.access(dataDir, fs.constants.W_OK);
      return { ok: true, exists: true, detail: "exists and is writable" };
    } catch {
      return { ok: false, exists: true, detail: "exists but is not writable" };
    }
  }

  const parent = await nearestExistingParent(path.dirname(dataDir));

  try {
    await fs.access(parent, fs.constants.W_OK);
    return {
      ok: true,
      exists: false,
      detail: `missing; ${parent} is writable`
    };
  } catch {
    return {
      ok: false,
      exists: false,
      detail: `missing; ${parent} is not writable`
    };
  }
}

function requestStatus(config) {
  return new Promise((resolve) => {
    const req = http.get({
      hostname: config.host,
      port: config.port,
      path: `${config.basePath || ""}/api/auth/status`,
      timeout: 1000
    }, (res) => {
      res.resume();
      resolve({
        ok: res.statusCode >= 200 && res.statusCode < 500,
        statusCode: res.statusCode
      });
    });

    req.on("timeout", () => {
      req.destroy();
      resolve({ ok: false, error: "timeout" });
    });

    req.on("error", (error) => {
      resolve({ ok: false, error: error.code || error.message });
    });
  });
}

function checkPort(host, port) {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once("error", (error) => {
      resolve({
        available: false,
        error: error.code || error.message
      });
    });

    server.once("listening", () => {
      server.close(() => resolve({ available: true }));
    });

    server.listen(port, host);
  });
}

function verdict({ files, dataDir, app, port, service }) {
  if (!files.ok) return "Cartflix app files are incomplete.";
  if (!dataDir.ok) return "Cartflix runtime data path is not writable.";
  if (app.ok) return "Cartflix is responding locally.";
  if (!port.available) return "Cartflix is not responding and the port is occupied.";
  if (service?.installed) return "Cartflix service exists but the app is not responding.";
  return "Cartflix is not installed or not running yet.";
}

async function runDoctor({ config, paths, platformName, service }) {
  const nodeOk = nodeMajor() >= 20;
  const files = await checkRequiredFiles(paths.repoRoot);
  const dataDir = await checkDataDir(config.dataDir);
  const app = await requestStatus(config);
  const port = app.ok
    ? { available: false, inUseByCartflix: true }
    : await checkPort(config.host, config.port);
  const serviceStatus = typeof service?.status === "function"
    ? await service.status()
    : null;

  console.log("Cartflix doctor");
  console.log("");
  line("Platform", "ok", platformName);
  line("Node.js", nodeOk ? "ok" : "fail", process.version);
  line("App files", files.ok ? "ok" : "fail", files.ok ? "" : `missing ${files.missing.join(", ")}`);
  line("Runtime data", dataDir.ok ? "ok" : "fail", `${config.dataDir} (${dataDir.detail})`);
  line("Local URL", "info", `http://${config.host}:${config.port}${config.basePath || "/"}`);

  if (app.ok) {
    line("Local app", "ok", `HTTP ${app.statusCode}`);
    line("Port", "ok", `${config.port} in use by Cartflix`);
  } else {
    line("Local app", "info", app.error || "not responding");
    line("Port", port.available ? "ok" : "warn", port.available ? `${config.port} available` : `${config.port} occupied (${port.error})`);
  }

  if (serviceStatus) {
    line("Service", serviceStatus.installed ? "ok" : "info", serviceStatus.installed ? service.name : `${service.name} not installed`);
    line("Service active", serviceStatus.active === "active" ? "ok" : "info", serviceStatus.active);
    line("Service enabled", serviceStatus.enabled === "enabled" ? "ok" : "info", serviceStatus.enabled);
  }

  console.log("");
  console.log(`Verdict: ${verdict({ files, dataDir, app, port, service: serviceStatus })}`);

  if (!nodeOk || !files.ok || !dataDir.ok || (!app.ok && !port.available)) {
    process.exitCode = 1;
  }
}

module.exports = {
  runDoctor
};
