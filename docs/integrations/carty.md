# Carty Integration

Carty is optional. Cartflix must remain usable without Carty.

## Boundary

Cartflix owns storage, validation, UI, and grocery mutations.

Carty interprets natural-language grocery requests and returns structured
intents. Carty must not directly edit Cartflix runtime files or app code.

Example intent:

```json
{
  "intent": "activeList.product.add",
  "item": "milk",
  "quantity": "2"
}
```

Cartflix decides whether and how to apply the intent.

## Setup Modes

The management UI should support three Carty states:

- use Cartflix without Carty
- connect an existing Carty
- create or attach a new Carty when OpenClaw is available

## Existing Carty

When connecting an existing Carty, Cartflix should verify:

- OpenClaw is available locally
- Carty exists
- Carty has the expected guardrails
- Cartflix can send a test message
- Carty returns structured intent instead of editing files directly

## New Carty

When creating or attaching a new Carty, local management should:

- verify OpenClaw is installed and running
- create or select the Carty workspace
- install or verify Carty instructions
- register Carty as Cartflix's grocery assistant
- run a test prompt
- enable Cartflix chat only after the test succeeds

If OpenClaw is not available, Cartflix should continue without Carty and show
setup guidance.

## Management Access

Carty host provisioning belongs to local management only.

Remote owner management may show Carty status and safe app-level toggles after
Carty is already configured, but it must not run local OpenClaw setup actions.
