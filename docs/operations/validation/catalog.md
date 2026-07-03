# Catalog Operation Validation

## Alias Normalization

Alias operations compare aliases by normalized text within their parent scope.

Normalization baseline:

- trim leading and trailing whitespace
- lowercase
- collapse repeated whitespace
- compare without accents/diacritics
- compare punctuation-insensitively

Alias validation:

- alias display text must be non-empty after trimming
- an item alias must be unique within its item by normalized text
- a variant alias must be unique within its variant by normalized text
- an alias must not normalize to the same value as its parent display name
- editing an alias must identify the existing alias by normalized text

## Items

- `catalog.item.add` requires a unique item name by normalized text.
- `catalog.item.edit` requires an existing `itemId`.
- `catalog.item.edit` must not rename an item to a normalized name already used
  by another item.
- `catalog.item.remove` requires an existing `itemId`.
- `catalog.item.remove` should be rejected while active list entries or history
  entries still reference that item or one of its variants.

## Item Aliases

- item alias operations require an existing `itemId`.
- `catalog.itemAlias.add` must not create a duplicate normalized alias within
  that item.
- `catalog.itemAlias.edit` requires an existing alias matched by normalized
  text.
- `catalog.itemAlias.edit` must not create a duplicate normalized alias within
  that item.
- `catalog.itemAlias.remove` requires an existing alias matched by normalized
  text.

## Variants

- `catalog.variant.add` requires an existing parent `itemId`.
- `catalog.variant.add` must not duplicate another variant name within the same
  item by normalized text.
- `catalog.variant.edit` requires an existing `variantId`.
- `catalog.variant.edit` must not rename a variant to a normalized name already
  used by another variant under the same item.
- `catalog.variant.remove` requires an existing `variantId`.
- `catalog.variant.remove` should be rejected while active list entries or
  history entries still reference that variant.

## Variant Aliases

- variant alias operations require an existing `variantId`.
- `catalog.variantAlias.add` must not create a duplicate normalized alias within
  that variant.
- `catalog.variantAlias.edit` requires an existing alias matched by normalized
  text.
- `catalog.variantAlias.edit` must not create a duplicate normalized alias
  within that variant.
- `catalog.variantAlias.remove` requires an existing alias matched by normalized
  text.
