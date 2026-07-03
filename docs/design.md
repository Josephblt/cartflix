# Design Notes

Cartflix is the app. Carty is the agent.

The first implementation should keep those responsibilities separate:

- Cartflix owns storage, validation, and the user interface.
- Carty interprets requests and proposes or performs allowed list operations.
- The data model should stay small enough to understand without a framework.

## Initial Shape

```text
cartflix/
  app/      # Application code
  agent/    # Carty instructions, tools, and guardrails
  data/     # Local runtime data
  docs/     # Notes and design decisions
```

## Data Directory

Cartflix stores runtime data as JSON files under `data/`.

```text
data/
  items.json    # Item catalog
  list.json     # Permanent active shopping list
  history.json  # Purchase history
  quips.json    # Opening and Carty greeting quips
  auth.json     # Local users and password hashes
```

Each data file has a matching model document:

- `data/items.json`: [Item catalog](data/items.md)
- `data/list.json`: [Active list](data/list.md)
- `data/history.json`: [Purchase history](data/history.md)
- `data/quips.json`: [Quips](data/quips.md)
- `data/auth.json`: [Authentication](data/auth.md)

The item model is explicit: items and variants are durable catalog entities with
stable opaque UUIDs; aliases are lightweight strings addressed by normalized
text within their parent item or variant.

Quips are display data for Cartflix's personality layer. They are intentionally
separate from Carty instructions and from grocery-list operation data.

## Operation Layer

Cartflix should change or read data through explicit operations rather than
through ad-hoc file edits.

The low-level operation set is documented in
[Operations](operations/definitions.md). That layer defines explicit storage
actions. User intent, policy, confirmation, and sequencing belong above it.

Operation payload shapes are documented in
[Operation Payloads](operations/payload.md).
Operation result shapes are documented in
[Operation Results](operations/results.md).
Operation validation rules are documented in
[Operation Validation](operations/validation.md).

App-level workflow intent is documented in [App Intent Layer](app-intents.md).

Authentication is documented in [Authentication](data/auth.md).
