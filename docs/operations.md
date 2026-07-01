# Operations

Cartflix should expose a small set of low-level operations. These operations
describe what can change. A higher-level layer decides when they happen and how
user intent maps to them.

Carty, the UI, import tools, and future automations should all target this
operation layer instead of editing storage directly.

## Item Catalog Operations

Items and variants are addressed by stable opaque UIDs. Aliases are addressed
by normalized alias text within their parent scope.

- add item
- edit item
- remove item
- add alias
- edit alias
- remove alias
- add variant
- edit variant
- remove variant
- add variant alias
- edit variant alias
- remove variant alias

## List Operations

The active list is one permanent list. Operations target entries on that list.
Entries are addressed by stable opaque UIDs.

- add entry
- edit entry
- remove entry

## History Operations

History stores purchased entries and notable purchase metadata.

- add entry
- edit entry
- remove entry

## Abstraction Boundary

The operation layer should not decide user intent, policy, timing, or workflow.
It should only validate and apply explicit mutations.

Examples of higher-level decisions that belong above this layer:

- whether a plain-language request is an add, edit, or remove
- whether an unknown name should create a catalog item or ask for clarification
- whether a bought list entry should create or update a history entry
- whether an operation is safe, destructive, or requires confirmation
- how multiple operations are sequenced as one user-visible action
