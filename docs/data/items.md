# Item Catalog

File: `data/items.json`

The item catalog stores known grocery items and their variants.

Items and variants are durable entities and need stable IDs. Aliases are not
durable entities. They are display strings addressed by their normalized text
inside their parent scope.

## File Shape

```json
{
  "items": [
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
  ]
}
```

## Item

An item is the product family: the thing the user means when they say "coffee",
"milk", or "rice".

```json
{
  "id": "string",
  "name": "string",
  "aliases": ["string"],
  "variants": []
}
```

Fields:

- `id`: stable item identifier.
- `name`: canonical display name.
- `aliases`: alternate names Carty can use to recognize the item. Aliases do
  not have IDs.
- `variants`: known forms of the same item.

## Variant

A variant is a known form of an item, such as a specific jar, pack, bottle, or
box.

```json
{
  "id": "string",
  "name": "string",
  "aliases": ["string"]
}
```

Fields:

- `id`: stable variant identifier within the item catalog.
- `name`: canonical display name for the variant.
- `aliases`: alternate names Carty can use to recognize the variant. Aliases do
  not have IDs.

## Alias Identity

Aliases are identified by normalized text within their parent scope:

- item aliases are scoped to an item
- variant aliases are scoped to a variant

Normalization is an internal comparison form, not the display text. The exact
implementation can evolve, but the intended baseline is:

- trim leading and trailing whitespace
- lowercase
- collapse repeated whitespace
- compare without accents/diacritics
- compare punctuation-insensitively

Examples:

```text
"  Instant   Coffee " -> "instant coffee"
"Café em Pó" -> "cafe em po"
"Tomate-cereja" -> "tomate cereja"
```

The stored alias should preserve the human-readable display string. Cartflix can
compute normalized values when loading the catalog or building lookup indexes.

## Deliberate Omissions

The item catalog does not store quantity or unit as structured fields.

When an amount matters, it should appear in the variant name or aliases in a
human-readable form, such as `160g jar`, `1L bottle`, or `12 pack`.

This keeps the model small while still giving Carty enough context to interpret
common shopping requests and rough price comparisons.
