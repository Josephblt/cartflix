const { runDoctor } = require("../../doctor");
const systemd = require("./systemd");

function requestStatus(config) {
  return new Promise((resolve) => {
    const req = require("node:http").get({
      hostname: config.host,
      port: config.port,
      path: `${config.basePath || ""}/api/auth/status`,
      timeout: 500
    }, (res) => {
      res.resume();
      resolve(res.statusCode >= 200 && res.statusCode < 500);
    });

    req.on("timeout", () => {
      req.destroy();
      resolve(false);
    });

    req.on("error", () => resolve(false));
  });
}

async function waitForLocalApp(config, timeoutMs = 5000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    if (await requestStatus(config)) return true;
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  return false;
}

module.exports = {
  name: "Linux",
  doctor(context) {
    return runDoctor({
      ...context,
      platformName: "Linux",
      service: {
        name: context.service.name,
        manager: systemd.manager,
        status: () => systemd.serviceStatus(context.service.name)
      }
    });
  },
  async install(context) {
    await systemd.installService(context);
    await systemd.startService(context.service.name);
    await waitForLocalApp(context.config);
    await this.doctor(context);
  },
  async restart(context) {
    await systemd.restartService(context.service.name);
    await waitForLocalApp(context.config);
    await this.doctor(context);
  },
  async start(context) {
    await systemd.startService(context.service.name);
    await waitForLocalApp(context.config);
    await this.doctor(context);
  },
  async stop(context) {
    await systemd.stopService(context.service.name);
    await this.doctor(context);
  },
  async uninstall(context) {
    await systemd.uninstallService(context);
    await this.doctor(context);
  }
};
