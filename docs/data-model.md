# Data Model

Cartflix starts with a small item model.

## Item

An item is the product family: the thing the user means when they say "coffee",
"milk", or "rice".

```json
{
  "id": "instant_coffee",
  "name": "Instant Coffee",
  "aliases": [
    "coffee",
    "instant coffee"
  ],
  "variants": [
    {
      "id": "instant_coffee_160g_jar",
      "name": "160g jar",
      "aliases": [
        "160g",
        "small jar"
      ]
    },
    {
      "id": "instant_coffee_190g_jar",
      "name": "190g jar",
      "aliases": [
        "190g",
        "medium jar"
      ]
    }
  ]
}
```

## Fields

- `id`: stable item identifier.
- `name`: canonical display name.
- `aliases`: alternate names Carty can use to recognize the item.
- `variants`: known forms of the same item.

## Variant

A variant is a known form of an item, such as a specific jar, pack, bottle, or
box.

```json
{
  "id": "instant_coffee_160g_jar",
  "name": "160g jar",
  "aliases": [
    "160g",
    "small jar"
  ]
}
```

## Deliberate Omissions

The item model does not store quantity or unit as structured fields.

When an amount matters, it should appear in the variant name or aliases in a
human-readable form, such as `160g jar`, `1L bottle`, or `12 pack`.

This keeps the model small while still giving Carty enough context to interpret
common shopping requests and rough price comparisons.

## List

Cartflix has one permanent active list.

The list does not need an `id` or `name`. It is the current shopping intent.

```json
{
  "entries": [
    {
      "itemId": "instant_coffee",
      "variantId": "instant_coffee_190g_jar",
      "quantity": "2",
      "checked": false
    }
  ]
}
```

## Entry

An entry is an item currently wanted on the active list.

```json
{
  "itemId": "string",
  "variantId": "string | null",
  "quantity": "string | null",
  "checked": false
}
```

Fields:

- `itemId`: the item being requested.
- `variantId`: the specific variant, when known.
- `quantity`: how many units/packages are wanted, when specified.
- `checked`: whether this entry has been bought during the current shopping
  flow.

Checked entries remain visible until the user archives them.
