# Active List

File: runtime `list.json`

Cartflix has one permanent active shopping list.

The list does not need an `id` or `name`. It is the current shopping intent.

## File Shape

```json
{
  "entries": [
    {
      "entryId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0101",
      "itemId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0001",
      "variantId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0003",
      "quantity": "2",
      "checked": false
    }
  ]
}
```

## List

```json
{
  "entries": []
}
```

Fields:

- `entries`: active list entries.

## ListEntry

A `ListEntry` is an item currently wanted on the active list.

```json
{
  "entryId": "string",
  "itemId": "string",
  "variantId": "string | null",
  "quantity": "string | null",
  "checked": false
}
```

Fields:

- `entryId`: stable opaque entry UUID shared with the matching history entry.
- `itemId`: opaque UUID of the item being requested.
- `variantId`: opaque UUID of the specific variant, when known.
- `quantity`: how many units/packages are wanted, when specified.
- `checked`: whether this entry has been bought during the current shopping
  flow.

Checked entries remain visible until the user removes bought items from the
active list.
