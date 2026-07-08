# Design Notes

Cartflix is the app. Carty is the agent.

The first implementation should keep those responsibilities separate:

- Cartflix owns storage, validation, and the user interface.
- Carty interprets requests and proposes structured intents. Cartflix applies
  allowed operations.
- The data model should stay small enough to understand without a framework.

## Initial Shape

```text
cartflix/
  app/      # Application code
  agent/    # Carty instructions, tools, and guardrails
  docs/     # Notes and design decisions
```

## Data Directory

Cartflix stores runtime data as JSON files outside the repository.

Default locations:

```text
Linux:   ${XDG_DATA_HOME:-~/.local/share}/cartflix/
macOS:   ~/Library/Application Support/Cartflix/
Windows: %LOCALAPPDATA%\Cartflix\
```

The location can be overridden with `CARTFLIX_DATA_DIR`.

```text
<Cartflix data directory>/
  items.json    # Item catalog
  list.json     # Permanent active shopping list
  history.json  # Purchase history
  quips.json    # Opening and Carty greeting quips
  auth.json     # Local users and password hashes
```

Runtime data files have matching model documents:

- `items.json`: [Item catalog](data/items.md)
- `list.json`: [Active list](data/list.md)
- `history.json`: [Purchase history](data/history.md)
- `quips.json`: [Quips](data/quips.md)
- `auth.json`: [Authentication data](data/authentication.md)

The item model is explicit: items and variants are durable catalog entities with
stable opaque UUIDs; aliases are lightweight strings addressed by normalized
text within their parent item or variant.

Quips are display data for Cartflix's personality layer. They are intentionally
separate from Carty instructions and from grocery-list operation data.

The authentication data file only documents the persisted runtime `auth.json`
shape. Authentication behavior is documented separately because it owns login,
sessions, and access control: [Authentication](authentication/README.md).

## Current Server Library Layout

```text
app/lib/
  auth/
    auth.js
    passwords.js
    sessions.js
    storage.js
  helpers/
    body.js
    request-path.js
    responses.js
  quips/
    quips.js
  routes/
    auth-routes.js
    quip-routes.js
    router.js
    static-routes.js
  static/
    static-files.js
  config.js
```

## Operation Layer

Cartflix should change or read data through explicit operations rather than
through ad-hoc file edits.

The low-level operation set is documented in
[Operations](operations/README.md). That layer defines explicit storage actions.
User intent, policy, confirmation, and sequencing belong above it.

Each operation domain has its own actions, payload, results, validation, and
errors docs under `docs/operations/<domain>/`.

App-level workflow intent is documented in [App Intent Layer](app-intents.md).

Authentication is documented in [Authentication](authentication/README.md).

The planned management model is documented in [Management](management.md).

Integration setup notes:

- [Carty integration](integrations/carty.md)
- [Tailscale deployment](deployment/tailscale.md)
