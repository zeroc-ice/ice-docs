---
title: Slice Keywords
sidebarLabel: Keywords
---

The following identifiers are Slice keywords. Keywords are lowercase, except `Object` and `Value`, and must be spelled
as shown. To use a keyword as an identifier, escape it with a backslash; see
[Escaped Identifiers](../lexical-rules#escaped-identifiers).

## Definitions

- [`class`](../user-defined-types/classes)
- [`const`](../constants-and-literals)
- [`dictionary`](../user-defined-types/dictionaries)
- [`enum`](../user-defined-types/enumerations)
- [`exception`](../exceptions)
- [`extends`](../interfaces/interface-inheritance), also for [classes](../user-defined-types/classes/class-inheritance)
  and [exceptions](../exceptions#exception-inheritance)
- [`interface`](../interfaces)
- [`module`](../modules)
- [`sequence`](../user-defined-types/sequences)
- [`struct`](../user-defined-types/structures)

## Operations

- [`idempotent`](../operations#idempotent-operations)
- [`optional`](../operations#optional-parameters-and-return-values), also for [fields](../fields#optional-fields)
- [`out`](../operations#operation-syntax)
- [`throws`](../exceptions#exception-specification-in-operations)
- [`void`](../operations#operation-syntax)

## Types

- [`bool`](../basic-types#booleans), [`byte`](../basic-types#bytes), [`short`](../basic-types#integer-types),
  [`int`](../basic-types#integer-types), [`long`](../basic-types#integer-types),
  [`float`](../basic-types#floating-point-types), [`double`](../basic-types#floating-point-types),
  [`string`](../basic-types#strings)
- [`Object`](../interfaces/interface-inheritance#implicit-inheritance-from-object), the base of all interfaces
- [`Value`](../user-defined-types/classes/class-inheritance#implicit-inheritance-from-value), the base of all classes

## Literals

- [`true`](../basic-types#booleans), [`false`](../basic-types#booleans)
