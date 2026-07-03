# Quip Operation Errors

Quip operation errors use stable machine-readable codes.

## Error Codes

- `QUIP_NOT_FOUND`: supplied `quipId` does not match an existing quip in the
  target quip collection.
- `QUIP_INDEX_OUT_OF_RANGE`: supplied index does not exist in the target quip
  collection, or an insertion index is outside the allowed range.
- `DUPLICATE_QUIP_TEXT`: quip text would duplicate another quip in the same
  collection after normalization.
