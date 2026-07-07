# Purchase History

File: runtime `history.json`

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
      "entryId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0101",
      "itemId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0001",
      "variantId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0003",
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

- `entryId`: stable opaque UUID copied from the active list entry.
- `itemId`: opaque UUID of the purchased item.
- `variantId`: opaque UUID of the purchased variant, when known.
- `quantity`: how many units/packages were bought, when specified.
- `price`: total price paid for this history entry, when known.
- `purchasedAt`: when the entry was checked as purchased.
- `purchaseLocation`: where the item was bought, when known.
