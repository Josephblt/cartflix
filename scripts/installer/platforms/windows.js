function pending(command) {
  console.log(`cartflix ${command}`);
  console.log("Platform: Windows");
  console.log("");
  console.log("Windows service support will use a scheduled task. Not implemented yet.");
  process.exitCode = 2;
}

module.exports = {
  name: "Windows",
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
