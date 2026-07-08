const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { execFile } = require("node:child_process");
const { promisify } = require("node:util");

const execFileAsync = promisify(execFile);
const manager = "systemd --user";

async function systemctl(args, options = {}) {
  try {
    const result = await execFileAsync("systemctl", ["--user", ...args], {
      timeout: options.timeout || 2000
    });

    return {
      ok: true,
      stdout: result.stdout.trim(),
      stderr: result.stderr.trim()
    };
  } catch (error) {
    return {
      ok: false,
      code: error.code,
      stdout: String(error.stdout || "").trim(),
      stderr: String(error.stderr || "").trim()
    };
  }
}

async function systemdAnalyze(args, options = {}) {
  try {
    const result = await execFileAsync("systemd-analyze", ["--user", ...args], {
      timeout: options.timeout || 3000
    });

    return {
      ok: true,
      stdout: result.stdout.trim(),
      stderr: result.stderr.trim()
    };
  } catch (error) {
    return {
      ok: false,
      code: error.code,
      stdout: String(error.stdout || "").trim(),
      stderr: String(error.stderr || "").trim()
    };
  }
}

function userSystemdDir(env = process.env) {
  const configHome = env.XDG_CONFIG_HOME || path.join(os.homedir(), ".config");
  return path.join(configHome, "systemd", "user");
}

function serviceFilePath(serviceName, env = process.env) {
  return path.join(userSystemdDir(env), serviceName);
}

function quoteSystemdValue(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
}

function environmentLine(key, value) {
  return `Environment="${key}=${quoteSystemdValue(value)}"`;
}

function serviceFile(context) {
  const { config, paths } = context;

  return [
    "[Unit]",
    "Description=Cartflix local HTTP app",
    "After=network.target",
    "",
    "[Service]",
    "Type=simple",
    `WorkingDirectory=${paths.repoRoot}`,
    `ExecStart=${process.execPath} ${paths.appEntry}`,
    "Restart=on-failure",
    "RestartSec=3",
    environmentLine("HOST", config.host),
    environmentLine("PORT", config.port),
    environmentLine("CARTFLIX_DATA_DIR", config.dataDir),
    "",
    "[Install]",
    "WantedBy=default.target",
    ""
  ].join("\n");
}

function assertSystemctl(result, action) {
  if (result.ok) return;

  const detail = result.stderr || result.stdout || result.code || "unknown error";
  const error = new Error(`${action} failed: ${detail}`);
  error.exitCode = 1;
  throw error;
}

function assertSystemdAnalyze(result, action) {
  if (result.ok) return;
  if (result.code === "ENOENT") {
    console.log("systemd-analyze is not available; skipping service file verification.");
    return;
  }

  const detail = result.stderr || result.stdout || result.code || "unknown error";
  const error = new Error(`${action} failed: ${detail}`);
  error.exitCode = 1;
  throw error;
}

async function serviceStatus(serviceName) {
  const cat = await systemctl(["cat", serviceName]);
  const active = await systemctl(["is-active", serviceName]);
  const enabled = await systemctl(["is-enabled", serviceName]);

  return {
    installed: cat.ok,
    active: active.ok ? active.stdout : active.stdout || "inactive",
    enabled: enabled.ok ? enabled.stdout : enabled.stdout || "disabled"
  };
}

async function daemonReload() {
  assertSystemctl(await systemctl(["daemon-reload"]), "systemctl daemon-reload");
}

async function enableService(serviceName) {
  assertSystemctl(await systemctl(["enable", serviceName]), `enable ${serviceName}`);
}

async function startService(serviceName) {
  assertSystemctl(await systemctl(["start", serviceName]), `start ${serviceName}`);
}

async function stopService(serviceName) {
  const result = await systemctl(["stop", serviceName]);
  if (!result.ok && !/not loaded|not-found|does not exist/i.test(`${result.stderr}\n${result.stdout}`)) {
    assertSystemctl(result, `stop ${serviceName}`);
  }
}

async function restartService(serviceName) {
  assertSystemctl(await systemctl(["restart", serviceName]), `restart ${serviceName}`);
}

async function disableService(serviceName) {
  const result = await systemctl(["disable", serviceName]);
  if (!result.ok && !/not loaded|not-found|does not exist/i.test(`${result.stderr}\n${result.stdout}`)) {
    assertSystemctl(result, `disable ${serviceName}`);
  }
}

async function installService(context) {
  const serviceName = context.service.name;
  const servicePath = serviceFilePath(serviceName, context.env);
  const statusBefore = await serviceStatus(serviceName);
  const nextServiceFile = serviceFile(context);
  let existingServiceFile = null;

  try {
    existingServiceFile = await fs.readFile(servicePath, "utf8");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }

  await fs.mkdir(context.config.dataDir, { recursive: true });
  await fs.mkdir(path.dirname(servicePath), { recursive: true });

  const changed = existingServiceFile !== nextServiceFile;
  if (changed) {
    await fs.writeFile(servicePath, nextServiceFile, "utf8");
    assertSystemdAnalyze(await systemdAnalyze(["verify", servicePath]), `verify ${serviceName}`);
  }

  await daemonReload();
  await enableService(serviceName);

  console.log(changed ? `Configured ${serviceName}` : `${serviceName} is already configured`);
  console.log(`Service file: ${servicePath}`);

  return {
    changed,
    servicePath,
    statusBefore
  };
}

async function uninstallService(context) {
  const serviceName = context.service.name;
  const servicePath = serviceFilePath(serviceName, context.env);

  await stopService(serviceName);
  await disableService(serviceName);
  await fs.rm(servicePath, { force: true });
  await daemonReload();

  console.log(`Uninstalled ${serviceName}`);
  console.log(`Runtime data left intact: ${context.config.dataDir}`);
}

module.exports = {
  daemonReload,
  disableService,
  enableService,
  installService,
  manager,
  restartService,
  serviceFile,
  serviceFilePath,
  serviceStatus,
  startService,
  stopService,
  systemdAnalyze,
  uninstallService,
  systemctl
};
