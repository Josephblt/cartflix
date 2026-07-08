const linux = require("./platforms/linux/linux");
const macos = require("./platforms/macos/macos");
const windows = require("./platforms/windows/windows");

function getPlatformAdapter(platform = process.platform) {
  if (platform === "linux") return linux;
  if (platform === "darwin") return macos;
  if (platform === "win32") return windows;

  return {
    name: platform
  };
}

module.exports = {
  getPlatformAdapter
};
