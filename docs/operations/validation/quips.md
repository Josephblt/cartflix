# Quip Operation Validation

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
