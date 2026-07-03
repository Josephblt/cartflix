# History Operation Results

History mutation results follow the common operation result shape:

```json
{
  "ok": true,
  "type": "history.entry.add",
  "ids": {
    "entryId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0101"
  },
  "changed": [
    {
      "kind": "history.entry",
      "id": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0101",
      "action": "created"
    }
  ],
  "warnings": []
}
```

History entry changes use `kind: "history.entry"` and `action` values of
`created`, `updated`, or `removed`.
