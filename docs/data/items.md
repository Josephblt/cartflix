# Item Catalog

File: `data/items.json`

The item catalog stores known grocery items and their variants.

Items and variants are durable entities and need stable opaque UUIDs. Aliases
are not durable entities. They are display strings addressed by their normalized
text inside their parent scope.

## File Shape

```json
{
  "items": [
    {
      "id": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0001",
      "name": "Instant Coffee",
      "aliases": [
        "coffee",
        "instant coffee"
      ],
      "variants": [
        {
          "id": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0002",
          "name": "160g jar",
          "aliases": [
            "160g",
            "small jar"
          ]
        },
        {
          "id": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0003",
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

## Identifier Policy

The item model has two durable entity types:

- item
- variant

Only those durable entities get IDs. Item aliases and variant aliases do not get
IDs.

IDs are opaque UUIDs, not names or slugs. They must not encode the product name,
variant name, category, or quantity. A renamed item keeps the same ID.

Use UUID strings for generated IDs. UUIDv7 is preferred when available because
it sorts naturally by creation time; UUIDv4 is acceptable if that is simpler.

## Item Model

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

- `id`: stable opaque item UUID.
- `name`: canonical display name.
- `aliases`: alternate names Carty can use to recognize the item. Aliases do
  not have IDs.
- `variants`: known forms of the same item.

## Variant Model

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

- `id`: stable opaque variant UUID within the item catalog.
- `name`: canonical display name for the variant.
- `aliases`: alternate names Carty can use to recognize the variant. Aliases do
  not have IDs.

## Alias Model

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
