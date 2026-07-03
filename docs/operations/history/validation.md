# History Operation Validation

- `history.entry.add` requires an `entryId`.
- `history.entry.add` must not duplicate an existing history entry with the same
  `entryId`.
- `history.entry.add` requires an existing `itemId`.
- `history.entry.add` may include `variantId`; when present, the variant must
  exist and belong to the supplied item.
- `history.entry.add` requires `purchasedAt`.
- `history.entry.edit` requires an existing `entryId`.
- `history.entry.edit` must keep `itemId` and `variantId` consistent when
  either is changed.
- `history.entry.remove` requires an existing `entryId`.
- `quantity`, `price`, and `purchaseLocation` may be `null` or non-empty
  strings.
- `purchasedAt` must be a timestamp string when supplied.
