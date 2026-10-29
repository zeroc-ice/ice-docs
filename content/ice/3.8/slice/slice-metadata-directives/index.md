---
title: Slice Metadata Directives
sidebarLabel: Metadata
---

## Overview

A metadata directive gives the Slice compilers an instruction about a Slice definition or a Slice file. Most directives
customize the code generated for one language mapping, and start with the prefix of this mapping, such as `java:`:

```slice
["java:type:java.util.LinkedList<Integer>"] sequence<int> IntSeq;
```

The general directives have no prefix. Some of them also change what Ice does: `format` selects how Ice marshals class
instances, and `oneway` restricts how a client can invoke an operation.

You place directives in square brackets before the definition they apply to, separated by commas:

```slice
["amd", "deprecated"]
interface Greeter
{
    string greet(string name);
}
```

A file directive applies to a whole Slice file. You place it in double square brackets before any definition in this
file; it can follow `#include` directives:

```slice
[["cpp:dll-export:WIDGET_API"]]
```

Each directive applies only to certain kinds of definitions, listed in its description below. The Slice compiler warns
about a directive applied to a definition it does not apply to.

## General Metadata Directives

### amd

`["amd"]`. Applies to interfaces and operations.

In C++, C#, and Java, the skeleton provides an asynchronous method for the operation, or for each operation of the
interface, instead of a synchronous method. Instead of using this directive, you can also derive your servant class from
the asynchronous skeleton; see [Operations](../operations). The other Slice compilers ignore this directive.

### deprecated

`["deprecated"]` or `["deprecated:message"]`. Applies to interfaces, operations, classes, exceptions, structs,
sequences, dictionaries, enumerations, enumerators, constants, and fields.

This directive marks a definition as deprecated; see [Deprecating Slice Definitions](../deprecating-slice-definitions).

### format

`["format:compact"]` or `["format:sliced"]`. Applies to interfaces and operations.

This directive selects the [encoding format](../user-defined-types/classes/slicing-values-and-exceptions) of the class
instances marshaled as the arguments or result of an operation: `format:compact` selects the compact format, and
`format:sliced` selects the sliced format. On an interface, it applies to all the operations of the interface; on an
operation, it overrides the `format` directive of the enclosing interface. Ice always marshals user exceptions in the
sliced format.

When neither an operation nor its enclosing interface selects a format, the
[Ice.Default.SlicedFormat](../../property-reference/ice-default-properties#ice.default.slicedformat) property selects
it.

### marshaled-result

`["marshaled-result"]`. Applies to interfaces and operations.

This directive lets a servant marshal the results of an operation as soon as it computes them, typically while it holds
the lock that protects the data it returns. The mapped skeleton method returns a “marshaled result” struct or class
whose constructor marshals the return value and out parameters immediately.

On an interface, this directive applies to every operation that the interface defines. The Slice compiler changes the
mapping of an operation only when its return type or one of its out parameters is a class, structure, sequence, or
dictionary. This directive affects the server-side mapping in C++, C#, and Java, and has no effect on the client-side
mapping.

For example:

```slice
module M
{
    sequence<int> IntSeq;
    sequence<IntSeq> IntIntSeq;
    sequence<string> StringSeq;

    class Grid
    {
        StringSeq xLabels;
        StringSeq yLabels;
        IntIntSeq values;
    }

    interface GridIntf
    {
        // We want to marshal the returned Grid object within a lock,
        // and return a consistent object not affected by concurrent calls to
        // clearValues.
        ["marshaled-result"]
        ["cs:identifier:GetGrid"]
        Grid getGrid();

        void clearValues();
    }
}
```

{% language-section name="general-metadata-directives" /%}

{% callout type="warning" %}

A marshaled-result instance is specific to a request. Do not cache a marshaled result and return it for another request.

{% /callout %}

### oneway

`["oneway"]`. Applies to operations.

This directive restricts an operation to oneway invocations: invoking the operation on a twoway proxy throws
`OnewayOnlyException`. The operation cannot have a return type, out parameters, or an exception specification. This
directive does not change the server-side mapping.

### suppress-warning

`[["suppress-warning"]]` or `[["suppress-warning:category, ..."]]`. Applies to a Slice file.

This directive suppresses Slice compiler warnings for all the definitions in the Slice file. Without a category, it
suppresses all warnings; with one or more categories, it suppresses only the warnings in these categories:

| **Category**      | **Description**                                                               |
| ----------------- | ----------------------------------------------------------------------------- |
| `all`             | Suppress all Slice compiler warnings. Equivalent to `[["suppress-warning"]]`. |
| `deprecated`      | Suppress warnings related to deprecated features.                             |
| `invalid-comment` | Suppress warnings related to invalid doc comments.                            |

## Language-Specific Metadata Directives

{% language-section name="language-specific-metadata-directives" /%}
