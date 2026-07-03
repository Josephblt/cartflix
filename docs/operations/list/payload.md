# List Operation Payloads

## `list.entry.add`

```json
{
  "itemId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0001",
  "variantId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0003",
  "quantity": "2",
  "checked": false
}
```

- `itemId`: item UUID.
- `variantId`: optional variant UUID.
- `quantity`: optional requested quantity.
- `checked`: optional bought state. Defaults to `false`.

## `list.entry.edit`

```json
{
  "entryId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0101",
  "patch": {
    "quantity": "3",
    "checked": true
  }
}
```

- `entryId`: list entry UUID.
- `patch.itemId`: optional replacement item UUID.
- `patch.variantId`: optional replacement variant UUID or `null`.
- `patch.quantity`: optional replacement quantity or `null`.
- `patch.checked`: optional bought state.

## `list.entry.remove`

```json
{
  "entryId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0101"
}
```

- `entryId`: list entry UUID.
