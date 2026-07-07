# Management

Cartflix separates user role from access mode.

## Roles

Cartflix has two roles:

- `owner`
- `member`

Members can use the grocery app. Members cannot access management.

Owners can access management. What an owner can do depends on whether the
request is local or remote.

## Management Modes

Cartflix has two management modes:

- local management
- remote management

Local management is for actions that affect the host machine or bootstrap the
instance. Remote management is for authenticated app-level administration.

## Permission Shape

```text
Action                 owner local   owner remote   member
Use grocery app        yes           yes            yes
Manage members         yes           yes            no
App settings           yes           yes            no
View health            yes           yes            no
Carty app settings     yes           limited        no
Export backup          yes           maybe          no
Restore backup         yes           no             no
First-user setup       yes           no             no
Tailscale setup        yes           no             no
OpenClaw/Carty setup   yes           no             no
Reset auth             yes           no             no
Delete app data        yes           no             no
Run local commands     yes           no             no
```

## Local Management

Local management should be available only from trusted local access, such as
`localhost`, `127.0.0.1`, or `[::1]`.

Local management can perform:

- first-user setup
- Tailscale setup/status
- OpenClaw/Carty setup/status
- backup restore
- auth reset
- destructive maintenance
- service and deployment checks

When Cartflix is behind a proxy, local checks must not rely only on socket
address. A public proxy can make requests appear local to the app server. The
local management gate should also require a local host/origin.

## Remote Management

Remote management is available to authenticated owners over the public app URL.
It can manage app-level state, but it must not perform host-level actions.

Remote management can perform:

- member management
- app settings
- non-sensitive health/status views
- integration status views
- safe Carty app-level toggles after Carty is already configured

Remote management must not perform:

- first-user setup
- Tailscale setup
- OpenClaw/Carty host provisioning
- local shell commands
- auth reset
- destructive data reset
- backup restore

## First-Time Setup

First-time setup should use the Cartflix UI, but only through local management.

When no users exist:

- local requests can show the first-user setup form
- remote requests should explain that local setup is required
- the setup API must enforce the same local-only rule server-side

After first setup succeeds, the first user becomes the owner.
