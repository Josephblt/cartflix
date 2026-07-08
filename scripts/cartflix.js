#!/usr/bin/env node

const { runCommand } = require("./installer/commands");

runCommand(process.argv.slice(2)).catch((error) => {
  console.error(error?.message || error);
  process.exitCode = error?.exitCode || 1;
});
