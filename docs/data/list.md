# Active List

File: `data/list.json`

Cartflix has one permanent active shopping list.

The list does not need an `id` or `name`. It is the current shopping intent.

## File Shape

```json
{
  "entries": [
    {
      "entryId": "entry_123",
      "itemId": "instant_coffee",
      "variantId": "instant_coffee_190g_jar",
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

- `entryId`: stable identifier shared with the matching history entry.
- `itemId`: the item being requested.
- `variantId`: the specific variant, when known.
- `quantity`: how many units/packages are wanted, when specified.
- `checked`: whether this entry has been bought during the current shopping
  flow.

Checked entries remain visible until the user removes bought items from the
active list.
