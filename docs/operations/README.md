# Operations

Cartflix exposes low-level operations as explicit storage actions. Most
operations mutate data; a few are narrow reads needed to support ordered
workflows.

Carty, the UI, import tools, and future automations should target this operation
layer instead of editing storage directly.

## Structure

```text
operations/
  catalog/
    actions.md
    payload.md
    results.md
    validation.md
    errors.md
  list/
    actions.md
    payload.md
    results.md
    validation.md
    errors.md
  history/
    actions.md
    payload.md
    results.md
    validation.md
    errors.md
  quips/
    actions.md
    payload.md
    results.md
    validation.md
    errors.md
```

## Domains

- Catalog: [actions](catalog/actions.md),
  [payload](catalog/payload.md), [results](catalog/results.md),
  [validation](catalog/validation.md), [errors](catalog/errors.md)
- List: [actions](list/actions.md), [payload](list/payload.md),
  [results](list/results.md), [validation](list/validation.md),
  [errors](list/errors.md)
- History: [actions](history/actions.md),
  [payload](history/payload.md), [results](history/results.md),
  [validation](history/validation.md), [errors](history/errors.md)
- Quips: [actions](quips/actions.md), [payload](quips/payload.md),
  [results](quips/results.md), [validation](quips/validation.md),
  [errors](quips/errors.md)

## Type Names

Operation types use this shape:

```text
<domain>.<entity>.<action>
```

Rules:

- `domain` is one of `catalog`, `list`, `history`, or `quips`
- `entity` is singular and lower camel case
- mutation `action` is one of `add`, `edit`, or `remove`
- read `action` may use a specific verb such as `getByIndex`
- compound entities use lower camel case, such as `itemAlias`
- type names describe low-level data actions, not user intent or UI wording

The operation layer should not decide user intent, policy, timing, or workflow.
It should only validate and apply explicit storage actions.

## Operation Envelope

Every operation has a `type` and a `payload`.

```json
{
  "type": "catalog.item.add",
  "payload": {}
}
```

Rules:

- add operations create new UUIDs inside Cartflix
- edit operations target an existing UUID or alias and carry a `patch`
- remove operations target an existing UUID or alias
- read operations return data without mutating storage
- omitted patch fields are unchanged
- explicit `null` clears nullable fields

## Operation Result

Each operation result has this shape:

```json
{
  "ok": true,
  "type": "string",
  "ids": {},
  "changed": [],
  "warnings": []
}
```

Fields:

- `ok`: whether this operation succeeded.
- `type`: operation type that was attempted.
- `ids`: primary IDs created or targeted by the operation.
- `changed`: list of changed resources.
- `data`: optional read result for non-mutating operations.
- `warnings`: non-fatal validation or interpretation notes.

A single operation response wraps one operation result.

```json
{
  "ok": true,
  "result": {
    "ok": true,
    "type": "catalog.item.add",
    "ids": {},
    "changed": [],
    "warnings": []
  },
  "revision": "string"
}
```

A batch response contains one result per operation, in request order.

```json
{
  "ok": true,
  "results": [],
  "revision": "string"
}
```

Batch execution should be atomic by default. Either every operation applies, or
none of them do. If Cartflix later supports non-atomic batch execution, that
mode should be explicit in the request.

## Validation Rules

- `type` must be a known operation type.
- `payload` must be an object.
- required fields must be present.
- string fields must trim to a non-empty value unless explicitly nullable.
- string fields must not contain newlines.
- unknown payload fields should be rejected.
- IDs supplied by callers must be valid UUID strings.
- add operations generate UUIDs inside Cartflix unless a future import mode
  explicitly allows caller-provided IDs.

Edit operations use `patch`.

- `patch` must be an object.
- `patch` must contain at least one known field.
- omitted patch fields are unchanged.
- explicit `null` is allowed only for nullable fields.
- unknown patch fields should be rejected.

## Common Error Codes

Validation errors should use stable machine-readable codes. Domain-specific
errors live under each operation domain.

Examples:

- `UNKNOWN_OPERATION_TYPE`
- `INVALID_PAYLOAD`
- `INVALID_UUID`
- `MISSING_REQUIRED_FIELD`
- `UNKNOWN_FIELD`
- `EMPTY_STRING`
