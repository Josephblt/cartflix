# Authentication Data

File: runtime `auth.json`

This file stores local users and password-hash material for Cartflix
authentication. It describes persisted auth records only. Login behavior,
session behavior, and HTTP routes are documented under
[Authentication](../authentication/README.md).

Default location: `~/.local/share/cartflix/auth.json`.

The location can be changed with `CARTFLIX_DATA_DIR`.

## File Shape

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

## Fields

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

## File Rules

- `auth.json` must not contain plaintext passwords.
- `users[].salt` and `users[].hash` must not be returned from ordinary API
  responses.
- password changes generate a new salt and update only the current user's auth
  record.
- hashing parameters stay in this file so they can be migrated later.
