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
      "entryId": "01J2Z12N7ZBXAV8S9Y3Q6K5P4D",
      "itemId": "01J2Z0Y9QK7M3X5V8B1D4N6P2R",
      "variantId": "01J2Z0Z7D5P8W2R9N4X6K1T3VB",
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

- `entryId`: stable opaque UID copied from the active list entry.
- `itemId`: opaque UID of the purchased item.
- `variantId`: opaque UID of the purchased variant, when known.
- `quantity`: how many units/packages were bought, when specified.
- `price`: total price paid for this history entry, when known.
- `purchasedAt`: when the entry was checked as purchased.
- `purchaseLocation`: where the item was bought, when known.
