# Authentication Errors

Authentication errors are separate from operation errors. They protect access to
Cartflix; they do not describe grocery data mutations.

## Error Shape

Target error shape:

```json
{
  "ok": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid username or password."
  }
}
```

Fields:

- `ok`: always `false` for failed auth requests.
- `error.code`: stable machine-readable error code.
- `error.message`: human-readable message safe to show in the UI.
- `error.field`: optional field name for validation errors.

Auth errors must never include password values, password hashes, salts, session
tokens, or stack traces.

Current implementation note: server route errors currently return a simpler
shape:

```json
{
  "ok": false,
  "error": "Invalid username or password."
}
```

The stable coded envelope above is still the intended shape for the next auth
hardening pass.

## Status Codes

- `400 Bad Request`: malformed request body or missing required fields.
- `401 Unauthorized`: authentication is missing, expired, or invalid.
- `403 Forbidden`: authenticated user or request mode is not allowed to perform
  the action.
- `429 Too Many Requests`: login or password-change cooldown, if rate limiting
  is added later.
- `500 Internal Server Error`: unexpected server failure. Response must stay
  generic.

## Error Codes

- `INVALID_AUTH_PAYLOAD`: request body is missing, malformed, or has unknown
  fields.
- `MISSING_USERNAME`: login request did not include a username.
- `MISSING_PASSWORD`: login or password-change request did not include a
  required password field.
- `INVALID_CREDENTIALS`: username is unknown or password is wrong.
- `AUTH_REQUIRED`: request requires a valid session.
- `SESSION_INVALID`: supplied session token is missing, expired, or not known.
- `CURRENT_PASSWORD_INVALID`: password-change request supplied the wrong current
  password.
- `PASSWORD_UNCHANGED`: new password is the same as the current password, if
  Cartflix chooses to reject that case.
- `AUTH_RATE_LIMITED`: auth attempt was blocked by a future cooldown or rate
  limit.
- `AUTH_STORAGE_UNAVAILABLE`: runtime `auth.json` could not be read or written.

## Non-Disclosure Rules

- Login failure must use `INVALID_CREDENTIALS` for both unknown usernames and
  wrong passwords.
- Failed login responses must not reveal whether a username exists.
- Password-change failure may use `CURRENT_PASSWORD_INVALID` because the caller
  is already authenticated.
- Logs may record error codes and user IDs when known, but must not record
  plaintext passwords, password hashes, salts, or session tokens.
- Unexpected failures should return a generic message and keep implementation
  details in server logs only.
