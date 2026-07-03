# Catalog Operation Payloads

## `catalog.item.add`

```json
{
  "name": "Instant Coffee",
  "aliases": ["coffee"]
}
```

- `name`: canonical display name for the item.
- `aliases`: optional item aliases.

## `catalog.item.edit`

```json
{
  "itemId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0001",
  "patch": {
    "name": "Coffee"
  }
}
```

- `itemId`: item UUID.
- `patch.name`: optional replacement display name.

## `catalog.item.remove`

```json
{
  "itemId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0001"
}
```

- `itemId`: item UUID.

## `catalog.itemAlias.add`

```json
{
  "itemId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0001",
  "text": "coffee"
}
```

- `itemId`: item UUID.
- `text`: display text for the new alias.

## `catalog.itemAlias.edit`

```json
{
  "itemId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0001",
  "alias": "coffee",
  "text": "instant coffee"
}
```

- `itemId`: item UUID.
- `alias`: existing alias text, matched by normalized text.
- `text`: replacement display text.

## `catalog.itemAlias.remove`

```json
{
  "itemId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0001",
  "alias": "coffee"
}
```

- `itemId`: item UUID.
- `alias`: existing alias text, matched by normalized text.

## `catalog.variant.add`

```json
{
  "itemId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0001",
  "name": "190g jar",
  "aliases": ["190g", "medium jar"]
}
```

- `itemId`: parent item UUID.
- `name`: canonical display name for the variant.
- `aliases`: optional variant aliases.

## `catalog.variant.edit`

```json
{
  "variantId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0003",
  "patch": {
    "name": "190g glass jar"
  }
}
```

- `variantId`: variant UUID.
- `patch.name`: optional replacement display name.

## `catalog.variant.remove`

```json
{
  "variantId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0003"
}
```

- `variantId`: variant UUID.

## `catalog.variantAlias.add`

```json
{
  "variantId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0003",
  "text": "190g"
}
```

- `variantId`: variant UUID.
- `text`: display text for the new alias.

## `catalog.variantAlias.edit`

```json
{
  "variantId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0003",
  "alias": "190g",
  "text": "190 gram jar"
}
```

- `variantId`: variant UUID.
- `alias`: existing alias text, matched by normalized text.
- `text`: replacement display text.

## `catalog.variantAlias.remove`

```json
{
  "variantId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0003",
  "alias": "190g"
}
```

- `variantId`: variant UUID.
- `alias`: existing alias text, matched by normalized text.
