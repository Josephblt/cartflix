# Installer

Cartflix is installed as a local HTTP app. The installer should keep one command
surface across operating systems while delegating service/autostart behavior to
platform adapters.

## Command Surface

```text
cartflix doctor
cartflix install
cartflix uninstall
cartflix start
cartflix stop
cartflix restart
```

## Current Phase

The installer CLI skeleton exists. `doctor` is implemented for Linux and uses
the Linux platform adapter for `systemd --user` service inspection.

Current Linux checks:

- Node.js version
- required app files
- platform-aware runtime data directory
- local app response
- port availability
- `cartflix.service` install/active/enabled state

## Platform Adapters

```text
Linux   -> systemd --user
macOS   -> launchd LaunchAgent
Windows -> scheduled task
```

Linux is the first implementation target. macOS and Windows remain adapter
stubs until the Linux service lifecycle is proven.

## Runtime Data

Runtime data is stored outside the repository in the current platform's
per-user application data directory. `CARTFLIX_DATA_DIR` overrides the default
on every platform.
