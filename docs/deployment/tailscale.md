# Tailscale Deployment

Cartflix should not depend on Tailscale as a core app assumption.

Cartflix runs as a local HTTP app. Tailscale is the current exposure layer for
Wagner's deployment.

## Current Deployment Shape

The current public Cartflix URL uses a Tailscale-managed HTTPS hostname.

The app itself should continue to work without Tailscale when accessed locally.

## Setup Philosophy

Tailscale setup belongs in local management, not in the public app.

Local management may help with:

- detecting whether the `tailscale` CLI is installed
- detecting whether Tailscale is running
- detecting whether the machine is logged in to a Tailnet
- checking Serve/Funnel status
- configuring Serve/Funnel through a project-owned setup script
- verifying the resulting Cartflix URL

Cartflix must not store Tailscale account credentials.

## Public vs Private Access

Tailscale private Tailnet access usually requires users to be in the Tailnet.

Tailscale Funnel can expose Cartflix publicly over HTTPS. In that mode, visitors
do not need Tailscale accounts, but the owner configuring Funnel does.

## Management Access

Tailscale setup is host-level management and must be local-only.

Remote owner management may show Tailscale status, but it must not configure
Serve/Funnel or run local shell commands.
