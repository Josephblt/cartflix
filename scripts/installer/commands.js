const { getPlatformAdapter } = require("./platform");

const COMMANDS = new Set([
  "doctor",
  "install",
  "restart",
  "start",
  "stop",
  "uninstall"
]);

function usage() {
  return [
    "Usage: cartflix <command>",
    "",
    "Commands:",
    "  doctor      Check whether Cartflix can run on this machine",
    "  install     Install Cartflix as a local user service",
    "  uninstall   Remove the local Cartflix service",
    "  start       Start the local Cartflix service",
    "  stop        Stop the local Cartflix service",
    "  restart     Restart the local Cartflix service"
  ].join("\n");
}

function notImplemented(command, platform) {
  console.log(`cartflix ${command}`);
  console.log(`Platform: ${platform.name}`);
  console.log("");
  console.log("This command is part of the installer CLI skeleton and is not implemented yet.");
  process.exitCode = 2;
}

async function runCommand(args) {
  const command = args[0] || "help";

  if (command === "help" || command === "--help" || command === "-h") {
    console.log(usage());
    return;
  }

  if (!COMMANDS.has(command)) {
    const error = new Error(`Unknown command: ${command}\n\n${usage()}`);
    error.exitCode = 2;
    throw error;
  }

  const platform = getPlatformAdapter();

  if (typeof platform[command] !== "function") {
    notImplemented(command, platform);
    return;
  }

  await platform[command]({ args: args.slice(1) });
}

module.exports = {
  runCommand,
  usage
};
