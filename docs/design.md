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
```

Each data file has a matching model document:

- `data/items.json`: [Item catalog](data/items.md)
- `data/list.json`: [Active list](data/list.md)
- `data/history.json`: [Purchase history](data/history.md)

The item model is explicit: items and variants are durable catalog entities with
stable opaque UUIDs; aliases are lightweight strings addressed by normalized
text within their parent item or variant.

## Operation Layer

Cartflix should mutate data through explicit operations rather than through
ad-hoc file edits.

The low-level operation set is documented in [Operations](operations.md). That
layer defines what can change. User intent, policy, confirmation, and sequencing
belong above it.
