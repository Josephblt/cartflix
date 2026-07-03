# Catalog Operation Results

Catalog mutation results follow the common operation result shape:

```json
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
```

Changed catalog resources use these `kind` values:

- `catalog.item`
- `catalog.itemAlias`
- `catalog.variant`
- `catalog.variantAlias`

Aliases do not have IDs. Alias changes report their parent resource.

```json
{
  "kind": "catalog.itemAlias",
  "parentId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0001",
  "action": "created",
  "alias": "coffee"
}
```
