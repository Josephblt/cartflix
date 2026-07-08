const { runDoctor } = require("../doctor");
const systemd = require("./linux-systemd");

function pending(command) {
  console.log(`cartflix ${command}`);
  console.log("Platform: Linux");
  console.log("");
  console.log("Linux service support will use systemd --user. Not implemented yet.");
  process.exitCode = 2;
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
  install() {
    pending("install");
  },
  restart() {
    pending("restart");
  },
  start() {
    pending("start");
  },
  stop() {
    pending("stop");
  },
  uninstall() {
    pending("uninstall");
  }
};
