# Catalog Operation Definitions

Catalog operations manage durable grocery catalog entities.

Items and variants are addressed by stable opaque UUIDs. Aliases are addressed
by normalized alias text within their parent scope.

## Item Operations

Items are top-level catalog entities.

- `catalog.item.add`
- `catalog.item.edit`
- `catalog.item.remove`

## Item Alias Operations

Item aliases belong to an item. They are addressed by normalized alias text
inside that item.

- `catalog.itemAlias.add`
- `catalog.itemAlias.edit`
- `catalog.itemAlias.remove`

## Variant Operations

Variants belong to an item, but each variant still has its own opaque UUID.

- `catalog.variant.add`
- `catalog.variant.edit`
- `catalog.variant.remove`

## Variant Alias Operations

Variant aliases belong to a variant. They are addressed by normalized alias text
inside that variant.

- `catalog.variantAlias.add`
- `catalog.variantAlias.edit`
- `catalog.variantAlias.remove`
