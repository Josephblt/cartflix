# List Operation Validation

- `list.entry.add` requires an existing `itemId`.
- `list.entry.add` may include `variantId`; when present, the variant must
  exist and belong to the supplied item.
- `list.entry.add` generates a new `entryId`.
- `list.entry.edit` requires an existing `entryId`.
- `list.entry.edit` must keep `itemId` and `variantId` consistent when either
  is changed.
- `list.entry.remove` requires an existing `entryId`.
- `quantity` may be `null` or a non-empty string.
- `checked` must be boolean when supplied.
