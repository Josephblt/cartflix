# Operation Payloads

This document defines the payload shape for each low-level operation type.

Transport is separate. These objects can be sent through one endpoint, replayed
from a log, or produced internally by Carty or the UI.

## Operation Envelope

Every operation has a `type` and a `payload`.

```json
{
  "type": "catalog.item.add",
  "payload": {}
}
```

Rules:

- add operations create new UUIDs inside Cartflix
- edit operations target an existing UUID or alias and carry a `patch`
- remove operations target an existing UUID or alias
- omitted patch fields are unchanged
- explicit `null` clears nullable fields

## Catalog Item Payloads

### `catalog.item.add`

```json
{
  "name": "Instant Coffee",
  "aliases": ["coffee"]
}
```

Fields:

- `name`: canonical display name for the item.
- `aliases`: optional item aliases.

### `catalog.item.edit`

```json
{
  "itemId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0001",
  "patch": {
    "name": "Coffee"
  }
}
```

Fields:

- `itemId`: item UUID.
- `patch.name`: optional replacement display name.

### `catalog.item.remove`

```json
{
  "itemId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0001"
}
```

Fields:

- `itemId`: item UUID.

## Catalog Item Alias Payloads

### `catalog.itemAlias.add`

```json
{
  "itemId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0001",
  "text": "coffee"
}
```

Fields:

- `itemId`: item UUID.
- `text`: display text for the new alias.

### `catalog.itemAlias.edit`

```json
{
  "itemId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0001",
  "alias": "coffee",
  "text": "instant coffee"
}
```

Fields:

- `itemId`: item UUID.
- `alias`: existing alias text, matched by normalized text.
- `text`: replacement display text.

### `catalog.itemAlias.remove`

```json
{
  "itemId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0001",
  "alias": "coffee"
}
```

Fields:

- `itemId`: item UUID.
- `alias`: existing alias text, matched by normalized text.

## Catalog Variant Payloads

### `catalog.variant.add`

```json
{
  "itemId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0001",
  "name": "190g jar",
  "aliases": ["190g", "medium jar"]
}
```

Fields:

- `itemId`: parent item UUID.
- `name`: canonical display name for the variant.
- `aliases`: optional variant aliases.

### `catalog.variant.edit`

```json
{
  "variantId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0003",
  "patch": {
    "name": "190g glass jar"
  }
}
```

Fields:

- `variantId`: variant UUID.
- `patch.name`: optional replacement display name.

### `catalog.variant.remove`

```json
{
  "variantId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0003"
}
```

Fields:

- `variantId`: variant UUID.

## Catalog Variant Alias Payloads

### `catalog.variantAlias.add`

```json
{
  "variantId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0003",
  "text": "190g"
}
```

Fields:

- `variantId`: variant UUID.
- `text`: display text for the new alias.

### `catalog.variantAlias.edit`

```json
{
  "variantId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0003",
  "alias": "190g",
  "text": "190 gram jar"
}
```

Fields:

- `variantId`: variant UUID.
- `alias`: existing alias text, matched by normalized text.
- `text`: replacement display text.

### `catalog.variantAlias.remove`

```json
{
  "variantId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0003",
  "alias": "190g"
}
```

Fields:

- `variantId`: variant UUID.
- `alias`: existing alias text, matched by normalized text.

## List Entry Payloads

### `list.entry.add`

```json
{
  "itemId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0001",
  "variantId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0003",
  "quantity": "2",
  "checked": false
}
```

Fields:

- `itemId`: item UUID.
- `variantId`: optional variant UUID.
- `quantity`: optional requested quantity.
- `checked`: optional bought state. Defaults to `false`.

### `list.entry.edit`

```json
{
  "entryId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0101",
  "patch": {
    "quantity": "3",
    "checked": true
  }
}
```

Fields:

- `entryId`: list entry UUID.
- `patch.itemId`: optional replacement item UUID.
- `patch.variantId`: optional replacement variant UUID or `null`.
- `patch.quantity`: optional replacement quantity or `null`.
- `patch.checked`: optional bought state.

### `list.entry.remove`

```json
{
  "entryId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0101"
}
```

Fields:

- `entryId`: list entry UUID.

## History Entry Payloads

### `history.entry.add`

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

Fields:

- `entryId`: entry UUID shared with the active list entry when applicable.
- `itemId`: item UUID.
- `variantId`: optional variant UUID.
- `quantity`: optional purchased quantity.
- `price`: optional total price paid.
- `purchasedAt`: purchase timestamp.
- `purchaseLocation`: optional purchase location.

### `history.entry.edit`

```json
{
  "entryId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0101",
  "patch": {
    "price": "15.00",
    "purchaseLocation": "Market"
  }
}
```

Fields:

- `entryId`: history entry UUID.
- `patch.itemId`: optional replacement item UUID.
- `patch.variantId`: optional replacement variant UUID or `null`.
- `patch.quantity`: optional replacement quantity or `null`.
- `patch.price`: optional replacement price or `null`.
- `patch.purchasedAt`: optional replacement purchase timestamp.
- `patch.purchaseLocation`: optional replacement purchase location or `null`.

### `history.entry.remove`

```json
{
  "entryId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0101"
}
```

Fields:

- `entryId`: history entry UUID.

## Opening Quip Payloads

### `quips.openingQuip.add`

```json
{
  "text": "May the cart be with you."
}
```

Fields:

- `text`: display text for the new opening quip.

### `quips.openingQuip.edit`

```json
{
  "quipId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0201",
  "patch": {
    "text": "Come with me if you want to shop."
  }
}
```

Fields:

- `quipId`: opening quip UUID.
- `patch.text`: optional replacement display text.

### `quips.openingQuip.remove`

```json
{
  "quipId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0201"
}
```

Fields:

- `quipId`: opening quip UUID.

## Carty Greeting Quip Payloads

### `quips.cartyGreetingQuip.add`

```json
{
  "text": "What does the fridge deny needing?"
}
```

Fields:

- `text`: display text for the new Carty greeting quip.

### `quips.cartyGreetingQuip.edit`

```json
{
  "quipId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0202",
  "patch": {
    "text": "Report the pantry situation."
  }
}
```

Fields:

- `quipId`: Carty greeting quip UUID.
- `patch.text`: optional replacement display text.

### `quips.cartyGreetingQuip.remove`

```json
{
  "quipId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0202"
}
```

Fields:

- `quipId`: Carty greeting quip UUID.
