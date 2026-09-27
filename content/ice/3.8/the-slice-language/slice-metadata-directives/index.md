---
title: Slice Metadata Directives
---

# Overview

Slice has the concept of a _metadata_ directive. For example:

```slice
["java:type:java.util.LinkedList<Integer>"] sequence<int> IntSeq;
```

A metadata directive can appear as a prefix to any Slice definition. Metadata directives appear in a pair of square
brackets and contain one or more string literals separated by commas. For example, the following is a syntactically
valid metadata directive containing two strings:

```slice
["a", "b"] interface Example {}
```

Metadata directives are not part of the Slice language per se: the presence of a metadata directive has no effect on the
client-server contract, that is, metadata directives do not change the Slice type system in any way. Instead, metadata
directives are targeted at specific back-ends, such as the code generator for a particular language mapping. In the
preceding example, the `java:` prefix indicates that the directive is targeted at the Slice to Java compiler.

Metadata directives permit you to provide supplementary information that does not change the Slice types being defined,
but somehow influences how the compiler will generate code for these definitions. For example, a metadata directive
`["java:type:java.util.LinkedList<T>"]` instructs the Slice to Java compiler to map a sequence to a linked list instead
of an array (which is the default).

Apart from metadata directives that are attached to a specific definition, there are also file metadata directives. For
example:

```slice
[["cpp:dll-export:WIDGET_API"]]
```

Note that a file metadata directive is enclosed by double square brackets, whereas a local metadata directive (one that
is attached to a specific definition) is enclosed by single square brackets. File metadata directives are used to pass
instructions that affect the entire Slice file. File metadata directives must precede any definitions in a file (but can
appear following any `#include` directives).

We describe below the metadata directives you can use.

# General Metadata Directives

### `amd`

This directive applies to interfaces and operations.

In C++, C#, and Java, this directive instructs the Slice compiler to generate an asynchronous method in the skeleton
class or interface instead of the default synchronous method. You could alternatively make your servant class derive
from an async skeleton, and not rely on this metadata directive. See [Operations](../operations) for details.

This directive is ignored by other Slice compilers.

### `deprecated[:message]`

`deprecate[:message]`

This directive allows you to emit a [deprecation warning for Slice constructs](../deprecating-slice-definitions).

### `format`

This directive defines the [encoding format](../slicing-values-and-exceptions) used for any classes or exceptions
marshaled as the arguments or results of an operation. The tag can be applied to an interface, which affects all of its
operations, or to individual operations. Legal values for the tag are `format:sliced`, `format:compact`, and
`format:default`. A tag specified for an operation overrides any setting applied to its enclosing interface. The
[Ice.Default.SlicedFormat](../ice-default-properties) property defines the behavior when no tag is present.

### `marshaled-result`

This directive applies to operations and changes the return type of mapped skeleton methods in C++, C#, and Java. It has
no effect on the client-side mapping.

With this directive, the mapped skeleton method returns a “marshaled result” struct or class that marshals the return
value and out parameters immediately in its constructor. This allows you to perform the marshaling in a thread-safe
manner, typically while holding a mutex lock.

For example:

```
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
```

{% language-section name="lang-1" /%}

{% callout type="warning" %}

A marshaled-result instance is specific to a request. Do not cache a marshaled result and return it for another request.

{% /callout %}

### `suppress-warning`

This file directive allows to suppress Slice compiler warnings. It applies to all definitions in the Slice file that
includes this directive. If one or more categories are specified (for example "`suppress-warning:invalid-metadata"` or
`"suppress-warning:deprecated, invalid-metadata"`) only warnings matching these categories will be suppressed, otherwise
all warnings are suppressed. The categories are described in the following table:

| **Suppress Warning Category** | **Description**                                                               |
| ----------------------------- | ----------------------------------------------------------------------------- |
| `all`                         | Suppress all Slice compiler warnings. Equivalent to `[["suppress-warning"]]`. |
| `deprecated`                  | Suppress warnings related to deprecated features.                             |
| `invalid-comment`             | Suppress warnings related to invalid doc-comments.                            |

### `oneway`

The `oneway` metadata is used to ensure that a proxy operation is only called by a one-way proxy.

A one-way request is a "fire and forget" request: the request is considered successful as soon as it's sent
successfully.

This directive can only be applied to operations that do not return data (no return type, out parameters, or exception
specification). `OnewayOnlyException` is thrown if an operation with this metadata is invoked using a two-way proxy.

It has no effect on the server-side generated code.

# Language-Specific Metadata Directives

{% language-section name="lang-2" /%}
