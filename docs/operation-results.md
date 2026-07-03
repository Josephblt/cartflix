# Operation Results

This document defines the result shape for low-level operations.

Payloads describe what Cartflix should attempt. Results describe what actually
changed.

Read operations use the same success envelope, but may return `data` instead of
`changed` resources.

## Single Operation Response

A single operation response wraps one operation result.

```json
{
  "ok": true,
  "result": {
    "ok": true,
    "type": "catalog.item.add",
    "ids": {
      "itemId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0001"
    },
    "changed": [
      {
        "kind": "catalog.item",
        "id": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0001",
        "action": "created"
      }
    ],
    "warnings": []
  },
  "revision": "string"
}
```

Fields:

- `ok`: whether the request succeeded.
- `result`: result for the operation.
- `revision`: optional storage revision after the operation.

## Batch Operation Response

A batch response contains one result per operation, in request order.

```json
{
  "ok": true,
  "results": [
    {
      "ok": true,
      "type": "catalog.item.add",
      "ids": {
        "itemId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0001"
      },
      "changed": [
        {
          "kind": "catalog.item",
          "id": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0001",
          "action": "created"
        }
      ],
      "warnings": []
    }
  ],
  "revision": "string"
}
```

Batch execution should be atomic by default. Either every operation applies, or
none of them do. If Cartflix later supports non-atomic batch execution, that
mode should be explicit in the request.

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

## Changed Resource

`changed` entries describe concrete storage changes.

```json
{
  "kind": "catalog.variant",
  "id": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0003",
  "action": "updated"
}
```

Fields:

- `kind`: resource kind, such as `catalog.item`, `list.entry`,
  `history.entry`, or `quips.openingQuip`.
- `id`: UUID of the changed resource when it has one.
- `action`: one of `created`, `updated`, or `removed`.

Aliases do not have IDs. Alias changes still report their parent resource.

```json
{
  "kind": "catalog.itemAlias",
  "parentId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0001",
  "action": "created",
  "alias": "coffee"
}
```

Quip changes report the quip UUID.

```json
{
  "kind": "quips.cartyGreetingQuip",
  "id": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0202",
  "action": "created"
}
```

Quip reads return the selected index and quip.

```json
{
  "ok": true,
  "type": "quips.openingQuip.getByIndex",
  "ids": {
    "quipId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0201"
  },
  "changed": [],
  "data": {
    "index": 0,
    "quip": {
      "quipId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0201",
      "text": "May the cart be with you."
    }
  },
  "warnings": []
}
```

## Error Response

A failed request uses the same outer `ok` field and includes an `error`.

```json
{
  "ok": false,
  "error": {
    "code": "CATALOG_ITEM_NOT_FOUND",
    "message": "Catalog item not found.",
    "field": "payload.itemId"
  }
}
```

Fields:

- `code`: stable machine-readable error code.
- `message`: human-readable error message.
- `field`: optional field path related to the error.

## Batch Error Response

Atomic batch failures should return the failing operation index.

```json
{
  "ok": false,
  "error": {
    "code": "OPERATION_FAILED",
    "message": "Operation 2 failed.",
    "operationIndex": 2,
    "cause": {
      "code": "CATALOG_VARIANT_NOT_FOUND",
      "message": "Catalog variant not found.",
      "field": "payload.variantId"
    }
  }
}
```

`operationIndex` is zero-based.

No partial changes should be persisted for an atomic batch failure.

## Warning

Warnings are non-fatal notes.

```json
{
  "code": "ALIAS_NORMALIZED",
  "message": "Alias matched after normalization.",
  "field": "payload.alias"
}
```

Warnings should be stable enough for logs and debugging, but they do not need to
drive normal UI behavior.
