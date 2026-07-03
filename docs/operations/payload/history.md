# History Operation Payloads

## `history.entry.add`

```json
{
  "entryId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0101",
  "itemId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0001",
  "variantId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0003",
  "quantity": "2",
  "price": "14.50",
  "purchasedAt": "2026-07-01T12:00:00Z",
  "purchaseLocation": "Corner Market"
}
```

- `entryId`: entry UUID shared with the active list entry when applicable.
- `itemId`: item UUID.
- `variantId`: optional variant UUID.
- `quantity`: optional purchased quantity.
- `price`: optional total price paid.
- `purchasedAt`: purchase timestamp.
- `purchaseLocation`: optional purchase location.

## `history.entry.edit`

```json
{
  "entryId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0101",
  "patch": {
    "price": "15.00",
    "purchaseLocation": "Market"
  }
}
```

- `entryId`: history entry UUID.
- `patch.itemId`: optional replacement item UUID.
- `patch.variantId`: optional replacement variant UUID or `null`.
- `patch.quantity`: optional replacement quantity or `null`.
- `patch.price`: optional replacement price or `null`.
- `patch.purchasedAt`: optional replacement purchase timestamp.
- `patch.purchaseLocation`: optional replacement purchase location or `null`.

## `history.entry.remove`

```json
{
  "entryId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0101"
}
```

- `entryId`: history entry UUID.
