# Operations

Cartflix should expose a small set of low-level operations. These operations
describe explicit storage actions: mostly mutations, plus narrow reads needed
to support ordered workflows. A higher-level layer decides when they happen and
how user intent maps to them.

Carty, the UI, import tools, and future automations should all target this
operation layer instead of editing storage directly.

Payload shapes are documented in [Operation Payloads](payload.md).
Result shapes are documented in [Operation Results](results.md).
Validation rules are documented in
[Operation Validation](validation.md).

## Operation Type Names

Operation types use this shape:

```text
<domain>.<entity>.<action>
```

Rules:

- `domain` is one of `catalog`, `list`, `history`, or `quips`
- `entity` is singular and lower camel case
- mutation `action` is one of `add`, `edit`, or `remove`
- read `action` may use a specific verb such as `getByIndex`
- compound entities use lower camel case, such as `itemAlias`
- type names describe low-level data actions, not user intent or UI wording

Examples:

```text
catalog.item.add
catalog.itemAlias.edit
catalog.variantAlias.remove
list.entry.add
history.entry.remove
quips.openingQuip.add
quips.cartyGreetingQuip.getByIndex
```

## Item Catalog Operations

Items and variants are addressed by stable opaque UUIDs. Aliases are addressed
by normalized alias text within their parent scope.

### Item Operations

Items are top-level catalog entities.

- `catalog.item.add`
- `catalog.item.edit`
- `catalog.item.remove`

### Item Alias Operations

Item aliases belong to an item. They are addressed by normalized alias text
inside that item.

- `catalog.itemAlias.add`
- `catalog.itemAlias.edit`
- `catalog.itemAlias.remove`

### Variant Operations

Variants belong to an item, but each variant still has its own opaque UUID.

- `catalog.variant.add`
- `catalog.variant.edit`
- `catalog.variant.remove`

### Variant Alias Operations

Variant aliases belong to a variant. They are addressed by normalized alias text
inside that variant.

- `catalog.variantAlias.add`
- `catalog.variantAlias.edit`
- `catalog.variantAlias.remove`

## List Operations

The active list is one permanent list. Operations target entries on that list.
Entries are addressed by stable opaque UUIDs.

### List Entry Operations

- `list.entry.add`
- `list.entry.edit`
- `list.entry.remove`

## History Operations

History stores purchased entries and notable purchase metadata.

### History Entry Operations

- `history.entry.add`
- `history.entry.edit`
- `history.entry.remove`

## Quip Operations

Quips store short display lines for Cartflix's personality layer. Quip
operations act on `data/quips.json`; they do not affect grocery-list behavior
or Carty's operating rules.

Quips are ordered display data. They are usually selected by rotation or random
choice, so low-level quip mutations intentionally only support adding and
removing records. Rewording a quip is modeled as replacing the entry at an
index, not editing the existing record.

Quips are addressed by stable opaque UUIDs for removal and by zero-based index
for ordered reads and replacement workflows.

### Opening Quip Operations

Opening quips appear on Cartflix opening or login surfaces.

- `quips.openingQuip.add`
- `quips.openingQuip.getByIndex`
- `quips.openingQuip.remove`

### Carty Greeting Quip Operations

Carty greeting quips appear when the Carty chat surface opens.

- `quips.cartyGreetingQuip.add`
- `quips.cartyGreetingQuip.getByIndex`
- `quips.cartyGreetingQuip.remove`

## Abstraction Boundary

The operation layer should not decide user intent, policy, timing, or workflow.
It should only validate and apply explicit storage actions.

Examples of higher-level decisions that belong above this layer:

- whether a plain-language request is an add, edit, or remove
- whether an unknown name should create a catalog item or ask for clarification
- whether a bought list entry should create or update a history entry
- whether an operation is safe, destructive, or requires confirmation
- how multiple operations are sequenced as one user-visible action
- whether quips should be shown randomly, rotated, or filtered by future
  editorial metadata
- whether a quip replacement should be performed by reading an index, removing
  the old quip, and inserting the new quip at the same index
