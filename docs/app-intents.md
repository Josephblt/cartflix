# App Intent Layer

This document defines the app-level intent layer.

The intent layer belongs to Cartflix itself. It does not depend on any agent
behavior.

## Purpose

Low-level operations describe individual storage actions. App intents describe
user-facing actions inside the application.

An app intent may map to:

- one operation
- multiple operations
- no operation, if app-level validation fails or confirmation is required
- a read result, if the intent only retrieves display data

The intent layer owns workflow decisions. The operation layer owns storage
actions.

## Rules

- App intents are internal application commands, not storage records.
- App intents should use app language, not operation language.
- App intents may sequence multiple low-level operations.
- App intents may require confirmation before producing operations.
- App intents should not bypass the operation executor.
- Agent behavior is out of scope for this layer.

## High-Level App Operations

The app has a deliberately small user-facing operation set:

- `activeList.product.add`
- `activeList.product.editQuantity`
- `activeList.product.remove`
- `activeList.product.setChecked`
- `activeList.checked.removeAll`
- `quips.openingQuip.replace`
- `quips.openingQuip.getQuip`
- `quips.cartyGreetingQuip.replace`
- `quips.cartyGreetingQuip.getQuip`

## `activeList.product.add`

User adds a product to the active list.

Possible low-level operations:

- `catalog.item.add`
  - creates `item.name` if the product is not known
- `catalog.variant.add`
  - creates `variant.name` if the added product implies a specific variant
- `catalog.itemAlias.add`
  - adds alias text if the submitted product name should point to an item
- `catalog.variantAlias.add`
  - adds alias text if the submitted product name should point to a variant
- `list.entry.add`
  - creates the active list entry with `itemId`, optional `variantId`,
    `quantity`, and `checked=false`

## `activeList.product.editQuantity`

User edits the quantity of an unchecked product in the active list.

Possible low-level operations:

- `list.entry.edit`
  - edits `entry.quantity`

App-level rule:

- checked products cannot have their quantity edited

## `activeList.product.remove`

User removes an unchecked product from the active list.

Possible low-level operations:

- `list.entry.remove`
  - removes the active list entry

App-level rule:

- checked products cannot be removed individually

## `activeList.product.setChecked`

User checks or unchecks a product in the active list.

When checking, the user may set the product price.

### Checking A Product

Possible low-level operations:

- `list.entry.edit`
  - edits `entry.checked=true`
- `history.entry.add`
  - creates a history entry with the same `entryId`, `itemId`, `variantId`,
    `quantity`, `purchasedAt`, and optional `price`

### Unchecking A Product

Possible low-level operations:

- `list.entry.edit`
  - edits `entry.checked=false`
- `history.entry.remove`
  - removes the matching history entry by `entryId`

## `activeList.checked.removeAll`

User removes all checked products from the active list.

When removing checked products, the user may set the purchase location for those
products.

Possible low-level operations:

- `history.entry.edit`
  - edits `history.purchaseLocation` for each checked entry when a location is
    provided
- `list.entry.remove`
  - removes each checked entry from the active list

## `quips.openingQuip.replace`

User replaces an opening quip at a known position.

Input:

```json
{
  "index": 0,
  "text": "Come with me if you want to shop."
}
```

Possible low-level operations:

- `quips.openingQuip.getByIndex`
  - reads the quip currently stored at `index`
- `quips.openingQuip.remove`
  - removes the current quip by `quipId`
- `quips.openingQuip.add`
  - inserts the new quip text at the same `index`

App-level rule:

- replacement is atomic; if any step fails, the original quip list remains
  unchanged

## `quips.cartyGreetingQuip.replace`

User replaces a Carty greeting quip at a known position.

Input:

```json
{
  "index": 0,
  "text": "Report the pantry situation."
}
```

Possible low-level operations:

- `quips.cartyGreetingQuip.getByIndex`
  - reads the quip currently stored at `index`
- `quips.cartyGreetingQuip.remove`
  - removes the current quip by `quipId`
- `quips.cartyGreetingQuip.add`
  - inserts the new quip text at the same `index`

App-level rule:

- replacement is atomic; if any step fails, the original quip list remains
  unchanged

## `quips.openingQuip.getQuip`

App requests one opening quip for display.

Behavior:

- chooses a random opening quip from `openingQuips`
- returns no mutation operations
- avoids returning the same quip twice in a row when the caller supplies the
  previous `quipId` and more than one option exists
- falls back to a built-in default if the configured collection is empty or
  invalid

## `quips.cartyGreetingQuip.getQuip`

App requests one Carty greeting quip for display.

Behavior:

- chooses a random Carty greeting quip from `cartyGreetingQuips`
- returns no mutation operations
- avoids returning the same quip twice in a row when the caller supplies the
  previous `quipId` and more than one option exists
- falls back to a built-in default if the configured collection is empty or
  invalid

## Intent Output

Mutation intents resolve to an operation plan.

```json
{
  "intent": "activeList.product.setChecked",
  "operations": [
    {
      "type": "list.entry.edit",
      "payload": {
        "entryId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0101",
        "patch": {
          "checked": true
        }
      }
    },
    {
      "type": "history.entry.add",
      "payload": {
        "entryId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0101",
        "itemId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0001",
        "variantId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0003",
        "quantity": "2",
        "price": "14.50",
        "purchasedAt": "2026-07-01T12:00:00Z",
        "purchaseLocation": null
      }
    }
  ],
  "requiresConfirmation": false
}
```

Fields:

- `intent`: app intent name.
- `operations`: low-level operations to execute atomically.
- `requiresConfirmation`: whether the app must ask before executing.

Read intents may resolve directly to display data.

```json
{
  "intent": "quips.openingQuip.getQuip",
  "data": {
    "index": 0,
    "quip": {
      "quipId": "018f6a3d-7b8e-7a11-9f50-2c2c2edc0201",
      "text": "May the cart be with you."
    },
    "source": "configured"
  }
}
```

Fields:

- `intent`: app intent name.
- `data.index`: zero-based quip index when the quip came from configured data.
- `data.quip`: selected quip.
- `data.source`: either `configured` or `default`.

## Out of Scope

This layer does not define conversational parsing, natural language behavior, or
agent autonomy.
