# Authentication

Cartflix uses simple local username/password authentication.

The goal is to protect family-facing access without turning the app into an
identity platform.

Auth is security infrastructure. It is separate from grocery operations and from
Carty workflow behavior.

## Decisions

- username/password login
- current implementation has users but no persisted roles yet
- planned roles are `owner` and `member`
- users stored in the runtime `auth.json`
- passwords stored as salted `scrypt` hashes
- no plaintext passwords in files, logs, docs, memory, or responses
- sessions use opaque server-generated tokens
- session token stored in an HTTP-only cookie
- password change supported
- first-user setup is available through the UI when no users exist
- first-user setup is local-only at the API layer

The runtime `auth.json` file shape is documented in
[Authentication data](../data/authentication.md).

Auth endpoints are documented in [Authentication endpoints](endpoints.md).

Auth error handling is documented in [Authentication errors](errors.md).

## Password Hashing

Cartflix hashes passwords with Node's `crypto.scrypt`.

Rules:

- generate a new random salt for every password set or password change
- never store plaintext passwords
- never return password hashes or salts from ordinary API responses
- compare hashes using timing-safe comparison
- keep hashing parameters in `auth.json` so they can be migrated later

## Sessions

On successful login, Cartflix creates an opaque random session token.

The token is sent as an HTTP-only cookie:

```text
cartflix_session=<token>
```

Cookie rules:

- `HttpOnly`
- `SameSite=Lax`
- `Secure` when served over HTTPS
- scoped to the app path
- expires after 30 days of inactivity

Initial implementation can keep sessions in memory. Restarting the app clears
active sessions.

## Current Access Control

The current implementation stores users without roles.

Rules:

- unauthenticated users can access only login/status routes and static login UI
- authenticated users can use the app
- all app data APIs require authentication

## Planned Management Access

Cartflix will use two roles:

- `owner`
- `member`

Members can use the app but cannot access management. Owners can access
management. Management permissions also depend on mode:

- local management: full owner maintenance, including host-level setup
- remote management: app-level owner administration only

The management model is documented in [Management](../management.md).

## Operational Notes

- `auth.json` should not contain plaintext passwords.
- auth APIs should not log submitted passwords.
- failed login responses should not reveal whether the username exists.
- rate limiting or cooldown can be added later if public exposure needs it.
