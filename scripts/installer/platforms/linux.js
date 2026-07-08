function pending(command) {
  console.log(`cartflix ${command}`);
  console.log("Platform: Linux");
  console.log("");
  console.log("Linux service support will use systemd --user. Not implemented yet.");
  process.exitCode = 2;
}

module.exports = {
  name: "Linux",
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
