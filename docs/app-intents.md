# App Intent Layer

This document defines the app-level intent layer.

The intent layer belongs to Cartflix itself. It does not depend on any agent
behavior.

## Purpose

Low-level operations describe individual mutations. App intents describe
user-facing actions inside the application.

An app intent may map to:

- one operation
- multiple operations
- no operation, if validation fails or confirmation is required

The intent layer owns workflow decisions. The operation layer owns validation
and mutation.

## Rules

- App intents are internal application commands, not storage records.
- App intents should use app language, not operation language.
- App intents may sequence multiple low-level operations.
- App intents may require confirmation before producing operations.
- App intents should not bypass the operation executor.
- Agent behavior is out of scope for this layer.

## Catalog Intents

Catalog intents manage the item catalog from the app.

### Create Item

Creates a catalog item and optional aliases.

Possible operations:

- `catalog.item.add`

### Rename Item

Renames a catalog item.

Possible operations:

- `catalog.item.edit`

### Delete Item

Deletes a catalog item.

Possible operations:

- `catalog.item.remove`

The intent should require confirmation when the item exists. The operation layer
may still reject the removal when list or history entries reference the item.

### Add Item Alias

Adds an alias to an item.

Possible operations:

- `catalog.itemAlias.add`

### Edit Item Alias

Replaces an item alias display string.

Possible operations:

- `catalog.itemAlias.edit`

### Remove Item Alias

Removes an item alias.

Possible operations:

- `catalog.itemAlias.remove`

### Create Variant

Creates a variant under an item and optional aliases.

Possible operations:

- `catalog.variant.add`

### Rename Variant

Renames a variant.

Possible operations:

- `catalog.variant.edit`

### Delete Variant

Deletes a variant.

Possible operations:

- `catalog.variant.remove`

The intent should require confirmation when the variant exists. The operation
layer may still reject the removal when list or history entries reference the
variant.

### Add Variant Alias

Adds an alias to a variant.

Possible operations:

- `catalog.variantAlias.add`

### Edit Variant Alias

Replaces a variant alias display string.

Possible operations:

- `catalog.variantAlias.edit`

### Remove Variant Alias

Removes a variant alias.

Possible operations:

- `catalog.variantAlias.remove`

## List Intents

List intents manage the active shopping list.

### Add List Entry

Adds an item to the active list.

Possible operations:

- `list.entry.add`

### Edit List Entry

Changes a list entry's item, variant, quantity, or bought state.

Possible operations:

- `list.entry.edit`

### Remove List Entry

Removes one active list entry.

Possible operations:

- `list.entry.remove`

### Mark Entry Bought

Marks a list entry as bought and creates the matching history entry.

Possible operations:

- `list.entry.edit`
- `history.entry.add`

### Undo Bought Entry

Marks a list entry as not bought and removes the matching history entry.

Possible operations:

- `list.entry.edit`
- `history.entry.remove`

### Archive Bought Entries

Removes bought entries from the active list while keeping their history entries.

Possible operations:

- `list.entry.remove`

If archive metadata is supplied, such as purchase location, the intent may also
update matching history entries.

Possible operations:

- `history.entry.edit`

## History Intents

History intents manage purchase records.

### Edit History Entry

Changes purchase metadata.

Possible operations:

- `history.entry.edit`

### Remove History Entry

Removes a purchase record.

Possible operations:

- `history.entry.remove`

This intent should require confirmation.

## Intent Output

An intent resolves to an operation plan.

```json
{
  "intent": "markEntryBought",
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

## Out of Scope

This layer does not define conversational parsing, natural language behavior, or
agent autonomy.
