# Purchase History

File: `data/history.json`

History stores purchased entries.

When a `ListEntry` is checked, Cartflix creates a matching history entry with
the same `entryId`. When that `ListEntry` is unchecked, Cartflix removes the
matching history entry.

Removing bought items only removes checked entries from the active list. Their
history entries remain. If a purchase location is provided during that archive
action, it is stored on the matching history entries.

## File Shape

```json
{
  "entries": [
    {
      "entryId": "entry_123",
      "itemId": "instant_coffee",
      "variantId": "instant_coffee_190g_jar",
      "quantity": "2",
      "price": "14.50",
      "purchasedAt": "2026-07-01T12:00:00Z",
      "purchaseLocation": "Corner Market"
    }
  ]
}
```

## History

```json
{
  "entries": []
}
```

Fields:

- `entries`: purchased entries.

## HistoryEntry

```json
{
  "entryId": "string",
  "itemId": "string",
  "variantId": "string | null",
  "quantity": "string | null",
  "price": "string | null",
  "purchasedAt": "string",
  "purchaseLocation": "string | null"
}
```

Fields:

- `entryId`: stable identifier copied from the active list entry.
- `itemId`: the purchased item.
- `variantId`: the purchased variant, when known.
- `quantity`: how many units/packages were bought, when specified.
- `price`: total price paid for this history entry, when known.
- `purchasedAt`: when the entry was checked as purchased.
- `purchaseLocation`: where the item was bought, when known.
