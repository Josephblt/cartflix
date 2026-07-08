# Cartflix

Cartflix is a local-first grocery-list app paired with Carty, a purpose-built
AI agent for managing shopping workflows.

The project explores a simple pattern: small, focused software becomes more
useful when it has an equally focused agent beside it. Cartflix provides the
interface and data model. Carty understands the workflow, interprets natural
language requests, and helps keep the list useful without turning grocery
planning into a project.

## Project Status

Cartflix is an active local-first rewrite. The current app has the opening,
login, welcome, local auth, PWA shell, and quip foundation in place. Grocery
operations, Carty integration, and management tooling are still being designed
and implemented.

## What This Is

Cartflix is not trying to be a full household-management platform. It is a
small tool for a recurring job: keeping a grocery list accurate, usable, and
easy to update.

Carty is not a general chatbot. It is a narrow agent that works inside the
shopping-list domain, where constraints are more valuable than improvisation.

## Goals

- Keep the app local-first and simple to run.
- Make shopping-list management fast from both UI and conversation.
- Keep Carty narrow, practical, and predictable.
- Separate app code, agent behavior, runtime data, and documentation clearly.
- Avoid turning a household tool into enterprise theater.

## Planned Structure

```text
cartflix/
  app/              # Cartflix application code
  agent/            # Carty instructions, guardrails, and workflows
  docs/             # Design notes and implementation notes
```

Runtime data is not stored in the repository. By default, Cartflix stores local
runtime files in the standard per-user application data directory for the
current operating system. This can be changed with `CARTFLIX_DATA_DIR`.

## Data Models

The current data and app model notes live under `docs/`:

- [Item catalog](docs/data/items.md)
- [Active list](docs/data/list.md)
- [Purchase history](docs/data/history.md)
- [Quips](docs/data/quips.md)
- [Authentication data](docs/data/authentication.md)

The item model uses stable opaque UUIDs for items and variants. List entries also
use opaque UUIDs. Item aliases and variant aliases do not have IDs; they are
addressed by normalized text within their parent scope.

Quips are lightweight UI personality data. They store opening comic lines and
Carty greeting prompts without making them part of Carty's operating rules.
Quips can be added, removed, read by index, randomly selected for display, and
replaced by index through the app operation layer.

## Authentication

Authentication is documented separately from the grocery data model:
[Authentication](docs/authentication/README.md). It owns login, sessions,
password hashing, and access control. Auth endpoints are documented separately
in [Authentication endpoints](docs/authentication/endpoints.md), with failures
covered in [Authentication errors](docs/authentication/errors.md). The runtime
`auth.json` file shape remains documented with the other data files because it
is still local runtime data.

## Management

Cartflix will use two roles and two management modes:

- roles: `owner` and `member`
- modes: local management and remote management

Members can use the app but cannot access management. Owners can access
management. Local owner management can perform host-level setup and maintenance;
remote owner management is limited to app-level administration.

The management model is documented in [Management](docs/management.md).

## Cartflix and Carty

Cartflix is the application: the place where lists are stored, displayed, and
edited.

Carty is the agent: the constrained assistant that understands grocery-list
operations and can turn plain-language requests into structured intents for
Cartflix to apply.

The distinction matters. The app owns the data and UI. The agent helps operate
the workflow.

## License

Cartflix is released under the MIT License. See [LICENSE](LICENSE).
