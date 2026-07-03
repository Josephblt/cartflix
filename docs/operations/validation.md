# Operation Validation

This document defines validation rules for low-level operations.

Validation happens before an operation is applied. For atomic batches, all
operations must validate before any changes are persisted.

## General Rules

- `type` must be a known operation type.
- `payload` must be an object.
- required fields must be present.
- string fields must trim to a non-empty value unless explicitly nullable.
- string fields must not contain newlines.
- unknown payload fields should be rejected.
- IDs supplied by callers must be valid UUID strings.
- add operations generate UUIDs inside Cartflix unless a future import mode
  explicitly allows caller-provided IDs.

## Patch Rules

Edit operations use `patch`.

- `patch` must be an object.
- `patch` must contain at least one known field.
- omitted patch fields are unchanged.
- explicit `null` is allowed only for nullable fields.
- unknown patch fields should be rejected.

## Alias Normalization

Alias operations compare aliases by normalized text within their parent scope.

Normalization baseline:

- trim leading and trailing whitespace
- lowercase
- collapse repeated whitespace
- compare without accents/diacritics
- compare punctuation-insensitively

Alias validation:

- alias display text must be non-empty after trimming.
- an item alias must be unique within its item by normalized text.
- a variant alias must be unique within its variant by normalized text.
- an alias must not normalize to the same value as its parent display name.
- editing an alias must identify the existing alias by normalized text.

## Catalog Validation

### Items

- `catalog.item.add` requires a unique item name by normalized text.
- `catalog.item.edit` requires an existing `itemId`.
- `catalog.item.edit` must not rename an item to a normalized name already used
  by another item.
- `catalog.item.remove` requires an existing `itemId`.
- `catalog.item.remove` should be rejected while active list entries or history
  entries still reference that item or one of its variants.

### Item Aliases

- item alias operations require an existing `itemId`.
- `catalog.itemAlias.add` must not create a duplicate normalized alias within
  that item.
- `catalog.itemAlias.edit` requires an existing alias matched by normalized
  text.
- `catalog.itemAlias.edit` must not create a duplicate normalized alias within
  that item.
- `catalog.itemAlias.remove` requires an existing alias matched by normalized
  text.

### Variants

- `catalog.variant.add` requires an existing parent `itemId`.
- `catalog.variant.add` must not duplicate another variant name within the same
  item by normalized text.
- `catalog.variant.edit` requires an existing `variantId`.
- `catalog.variant.edit` must not rename a variant to a normalized name already
  used by another variant under the same item.
- `catalog.variant.remove` requires an existing `variantId`.
- `catalog.variant.remove` should be rejected while active list entries or
  history entries still reference that variant.

### Variant Aliases

- variant alias operations require an existing `variantId`.
- `catalog.variantAlias.add` must not create a duplicate normalized alias within
  that variant.
- `catalog.variantAlias.edit` requires an existing alias matched by normalized
  text.
- `catalog.variantAlias.edit` must not create a duplicate normalized alias within
  that variant.
- `catalog.variantAlias.remove` requires an existing alias matched by normalized
  text.

## List Validation

- `list.entry.add` requires an existing `itemId`.
- `list.entry.add` may include `variantId`; when present, the variant must exist
  and belong to the supplied item.
- `list.entry.add` generates a new `entryId`.
- `list.entry.edit` requires an existing `entryId`.
- `list.entry.edit` must keep `itemId` and `variantId` consistent when either is
  changed.
- `list.entry.remove` requires an existing `entryId`.
- `quantity` may be `null` or a non-empty string.
- `checked` must be boolean when supplied.

## History Validation

- `history.entry.add` requires an `entryId`.
- `history.entry.add` must not duplicate an existing history entry with the same
  `entryId`.
- `history.entry.add` requires an existing `itemId`.
- `history.entry.add` may include `variantId`; when present, the variant must
  exist and belong to the supplied item.
- `history.entry.add` requires `purchasedAt`.
- `history.entry.edit` requires an existing `entryId`.
- `history.entry.edit` must keep `itemId` and `variantId` consistent when either
  is changed.
- `history.entry.remove` requires an existing `entryId`.
- `quantity`, `price`, and `purchaseLocation` may be `null` or non-empty strings.
- `purchasedAt` must be a timestamp string when supplied.

## Quip Validation

- quip add operations generate a new `quipId`.
- quip add operations may include an optional zero-based insertion `index`.
- omitted add indexes append the new quip to the matching collection.
- add indexes must be between `0` and the collection length, inclusive.
- quip remove operations require an existing `quipId` in the matching quip
  collection.
- quip get-by-index operations require an existing zero-based index in the
  matching quip collection.
- `text` must be a non-empty string after trimming.
- `text` must not contain newlines.
- adding a quip should reject duplicate text within the same quip collection
  after normalization.
- opening quip operations must not target Carty greeting quips, and Carty
  greeting quip operations must not target opening quips.

## Error Codes

Validation errors should use stable machine-readable codes.

Examples:

- `UNKNOWN_OPERATION_TYPE`
- `INVALID_PAYLOAD`
- `INVALID_UUID`
- `MISSING_REQUIRED_FIELD`
- `UNKNOWN_FIELD`
- `EMPTY_STRING`
- `CATALOG_ITEM_NOT_FOUND`
- `CATALOG_VARIANT_NOT_FOUND`
- `LIST_ENTRY_NOT_FOUND`
- `HISTORY_ENTRY_NOT_FOUND`
- `QUIP_NOT_FOUND`
- `QUIP_INDEX_OUT_OF_RANGE`
- `ALIAS_NOT_FOUND`
- `DUPLICATE_ALIAS`
- `DUPLICATE_ITEM_NAME`
- `DUPLICATE_VARIANT_NAME`
- `DUPLICATE_QUIP_TEXT`
- `REFERENCE_CONFLICT`
