# Quip Operation Payloads

## `quips.openingQuip.add`

```json
{
  "text": "May the cart be with you.",
  "index": 0
}
```

- `text`: display text for the new opening quip.
- `index`: optional zero-based insertion index. If omitted, the quip is
  appended.

## `quips.openingQuip.getByIndex`

```json
{
  "index": 0
}
```

- `index`: zero-based opening quip index.

## `quips.openingQuip.remove`

```json
{
  "quipId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0201"
}
```

- `quipId`: opening quip UUID.

## `quips.cartyGreetingQuip.add`

```json
{
  "text": "What does the fridge deny needing?",
  "index": 0
}
```

- `text`: display text for the new Carty greeting quip.
- `index`: optional zero-based insertion index. If omitted, the quip is
  appended.

## `quips.cartyGreetingQuip.getByIndex`

```json
{
  "index": 0
}
```

- `index`: zero-based Carty greeting quip index.

## `quips.cartyGreetingQuip.remove`

```json
{
  "quipId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0202"
}
```

- `quipId`: Carty greeting quip UUID.
