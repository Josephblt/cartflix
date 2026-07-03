# Authentication Endpoints

Initial auth routes:

```text
POST /api/auth/login
GET  /api/auth/status
POST /api/auth/logout
POST /api/auth/change-password
```

## `POST /api/auth/login`

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

## `GET /api/auth/status`

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

## `POST /api/auth/logout`

Deletes the current session and clears the session cookie.

## `POST /api/auth/change-password`

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
