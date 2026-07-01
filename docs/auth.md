# Authentication

Cartflix uses simple local username/password authentication.

The goal is to protect family-facing access without turning the app into an
identity platform.

## Decisions

- username/password login
- no roles
- users stored in `data/auth.json`
- passwords stored as salted `scrypt` hashes
- no plaintext passwords in files, logs, docs, memory, or responses
- sessions use opaque server-generated tokens
- session token stored in an HTTP-only cookie
- password change supported

## Auth Data File

File: `data/auth.json`

```json
{
  "type": "users",
  "algorithm": "scrypt",
  "params": {
    "N": 16384,
    "r": 8,
    "p": 1,
    "keyLength": 64
  },
  "users": [
    {
      "id": "018f6a3d-7b8e-7a11-9f50-2c2c2edc1001",
      "username": "wagner",
      "displayName": "Wagner",
      "salt": "base64url",
      "hash": "base64url",
      "createdAt": "2026-07-01T12:00:00Z",
      "updatedAt": "2026-07-01T12:00:00Z"
    }
  ]
}
```

Fields:

- `type`: auth file type. Initial value is `users`.
- `algorithm`: password hashing algorithm. Initial value is `scrypt`.
- `params`: hashing parameters.
- `users`: configured users.
- `users[].id`: stable opaque user UUID.
- `users[].username`: login name.
- `users[].displayName`: display name.
- `users[].salt`: per-user salt.
- `users[].hash`: password hash.
- `users[].createdAt`: user creation timestamp.
- `users[].updatedAt`: last auth-record update timestamp.

## Password Hashing

Cartflix hashes passwords with Node's `crypto.scrypt`.

Rules:

- generate a new random salt for every password set or password change
- never store plaintext passwords
- never return password hashes or salts from ordinary API responses
- compare hashes using timing-safe comparison
- keep hashing parameters in `data/auth.json` so they can be migrated later

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

## Auth Routes

Initial auth routes:

```text
POST /api/auth/login
GET  /api/auth/status
POST /api/auth/logout
POST /api/auth/change-password
```

### `POST /api/auth/login`

Input:

```json
{
  "username": "wagner",
  "password": "plaintext submitted over HTTPS"
}
```

Behavior:

- find user by `username`
- hash submitted password with stored salt and params
- compare using timing-safe comparison
- create session on success
- return user identity without secret fields

### `GET /api/auth/status`

Returns whether the current request has a valid session.

```json
{
  "ok": true,
  "authenticated": true,
  "user": {
    "id": "018f6a3d-7b8e-7a11-9f50-2c2c2edc1001",
    "username": "wagner",
    "displayName": "Wagner"
  }
}
```

### `POST /api/auth/logout`

Deletes the current session and clears the session cookie.

### `POST /api/auth/change-password`

Input:

```json
{
  "currentPassword": "current plaintext submitted over HTTPS",
  "newPassword": "new plaintext submitted over HTTPS"
}
```

Behavior:

- requires an authenticated session
- verifies `currentPassword`
- generates a new salt
- hashes `newPassword`
- updates only the current user's auth record
- updates `updatedAt`
- does not store plaintext

## Access Control

There are no roles in the initial model.

Rules:

- unauthenticated users can access only login/status routes and static login UI
- authenticated users can use the app
- all app data APIs require authentication

## Operational Notes

- `data/auth.json` should not contain plaintext passwords.
- auth APIs should not log submitted passwords.
- failed login responses should not reveal whether the username exists.
- rate limiting or cooldown can be added later if public exposure needs it.
