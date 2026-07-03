# History Operation Errors

History operation errors use stable machine-readable codes.

## Error Codes

- `HISTORY_ENTRY_NOT_FOUND`: supplied `entryId` does not match an existing
  history entry.
- `DUPLICATE_HISTORY_ENTRY`: add would duplicate an existing history entry with
  the same `entryId`.
- `CATALOG_ITEM_NOT_FOUND`: supplied `itemId` does not match an existing catalog
  item.
- `CATALOG_VARIANT_NOT_FOUND`: supplied `variantId` does not match an existing
  catalog variant.
- `REFERENCE_CONFLICT`: supplied `variantId` does not belong to the supplied
  `itemId`.
