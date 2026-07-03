# Quip Operation Definitions

Quips store short display lines for Cartflix's personality layer. Quip
operations act on `data/quips.json`; they do not affect grocery-list behavior
or Carty's operating rules.

Quips are ordered display data. They are usually selected by rotation or random
choice, so low-level quip mutations intentionally only support adding and
removing records. Rewording a quip is modeled as replacing the entry at an
index, not editing the existing record.

Quips are addressed by stable opaque UUIDs for removal and by zero-based index
for ordered reads and replacement workflows.

## Opening Quip Operations

Opening quips appear on Cartflix opening or login surfaces.

- `quips.openingQuip.add`
- `quips.openingQuip.getByIndex`
- `quips.openingQuip.remove`

## Carty Greeting Quip Operations

Carty greeting quips appear when the Carty chat surface opens.

- `quips.cartyGreetingQuip.add`
- `quips.cartyGreetingQuip.getByIndex`
- `quips.cartyGreetingQuip.remove`
