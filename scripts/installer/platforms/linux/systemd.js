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

module.exports = {
  manager,
  serviceStatus,
  systemctl
};
