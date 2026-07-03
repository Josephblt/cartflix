# Catalog Operation Errors

Catalog operation errors use stable machine-readable codes.

## Error Codes

- `CATALOG_ITEM_NOT_FOUND`: supplied `itemId` does not match an existing item.
- `CATALOG_VARIANT_NOT_FOUND`: supplied `variantId` does not match an existing
  variant.
- `ALIAS_NOT_FOUND`: supplied alias text does not match an existing alias after
  normalization.
- `DUPLICATE_ALIAS`: alias text would duplicate an existing alias in the same
  parent scope after normalization.
- `DUPLICATE_ITEM_NAME`: item name would duplicate another item after
  normalization.
- `DUPLICATE_VARIANT_NAME`: variant name would duplicate another variant under
  the same item after normalization.
- `REFERENCE_CONFLICT`: item or variant cannot be removed because active list
  entries or history entries still reference it.
