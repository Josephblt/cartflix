# Active List

File: `data/list.json`

Cartflix has one permanent active shopping list.

The list does not need an `id` or `name`. It is the current shopping intent.

## File Shape

```json
{
  "entries": [
    {
      "entryId": "01J2Z12N7ZBXAV8S9Y3Q6K5P4D",
      "itemId": "01J2Z0Y9QK7M3X5V8B1D4N6P2R",
      "variantId": "01J2Z0Z7D5P8W2R9N4X6K1T3VB",
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

- `entryId`: stable opaque entry UID shared with the matching history entry.
- `itemId`: opaque UID of the item being requested.
- `variantId`: opaque UID of the specific variant, when known.
- `quantity`: how many units/packages are wanted, when specified.
- `checked`: whether this entry has been bought during the current shopping
  flow.

Checked entries remain visible until the user removes bought items from the
active list.
