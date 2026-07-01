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

## First Slice

The first useful version should support:

- viewing the list
- adding an item
- checking an item off
- removing an item
- persisting the list locally

Agent integration should wait until the app has a stable data contract.
