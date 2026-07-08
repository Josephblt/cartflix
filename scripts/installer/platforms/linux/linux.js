const { runDoctor } = require("../../doctor");
const { checkPort, requestStatus, waitForLocalApp } = require("../../health");
const systemd = require("./systemd");

async function ensurePortUsable(config) {
  if ((await requestStatus(config, 500)).ok) return;

  const port = await checkPort(config.host, config.port);
  if (port.available) return;

  const error = new Error([
    `Port ${config.port} on ${config.host} is already in use, but Cartflix is not responding there.`,
    "Stop the conflicting process or choose a different Cartflix port before continuing."
  ].join(" "));
  error.exitCode = 1;
  throw error;
}

async function reportAfterStart(context) {
  const ready = await waitForLocalApp(context.config);
  if (!ready) {
    console.log("Cartflix service started, but the local app did not respond before the readiness timeout.");
  }
  await module.exports.doctor(context);
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
    const status = await systemd.serviceStatus(context.service.name);
    if (status.active !== "active") await ensurePortUsable(context.config);

    const install = await systemd.installService(context);
    if (install.statusBefore.active === "active") {
      await systemd.restartService(context.service.name);
    } else {
      await systemd.startService(context.service.name);
    }
    await reportAfterStart(context);
  },
  async restart(context) {
    await systemd.restartService(context.service.name);
    await reportAfterStart(context);
  },
  async start(context) {
    await ensurePortUsable(context.config);
    await systemd.startService(context.service.name);
    await reportAfterStart(context);
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
