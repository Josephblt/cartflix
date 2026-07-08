function pending(command) {
  console.log(`cartflix ${command}`);
  console.log("Platform: macOS");
  console.log("");
  console.log("macOS service support will use launchd LaunchAgents. Not implemented yet.");
  process.exitCode = 2;
}

module.exports = {
  name: "macOS",
  doctor() {
    pending("doctor");
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
