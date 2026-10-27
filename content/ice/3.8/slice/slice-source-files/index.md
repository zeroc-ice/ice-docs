---
title: Slice Source Files
sidebarLabel: Source Files
---

## File Naming and Format

Files containing Slice definitions must end in a `.ice` file extension, for example `Greeter.ice`.

Slice is a free-form language: white space separates tokens, and the layout of a definition has no meaning.

Slice files use the UTF-8 character encoding, with an optional byte order mark (BOM) at the beginning of the file.
Identifiers are limited to ASCII characters; non-ASCII characters can appear only in comments and string literals. See
[Identifiers](../lexical-rules#identifiers) for the characters an identifier can use.

## Including Other Slice Files

An `#include` directive lets the definitions of one Slice file use the types defined in another file. For example,
`Greeter.ice` can use a structure defined in `Types.ice`:

```slice
// File Types.ice
#pragma once

module VisitorCenter
{
    struct Greeting
    {
        string message;
    }
}
```

```slice
// File Greeter.ice
#pragma once

#include "Types.ice"

module VisitorCenter
{
    interface Greeter
    {
        Greeting greet(string name);
    }
}
```

A Slice compiler parses the files that a file includes, but generates code only for the files you give it on the command
line. In this example, compiling `Greeter.ice` generates no code for `Greeting`: compile `Types.ice` as well. The
[`-I` option](../using-the-slice-compiler) of the Slice compilers adds a directory to the include search path.

`#include` directives must come before any Slice definitions in a file. In a path, use a forward slash as the separator:

```slice
#include "SliceDefs/Types.ice"  // OK
#include "SliceDefs\Types.ice"  // Illegal
```

### Preventing Double Inclusion

A file that several files include must be read only once in a compilation. Start it with `#pragma once`, as in the
example above, or protect its contents with a guard:

```slice
// File Types.ice
#ifndef TYPES_ICE
#define TYPES_ICE

// #include directives here...
// Definitions here...

#endif // TYPES_ICE
```

## Conditional Compilation

Slice supports the same preprocessor directives as C++, such as `#define`, `#if`, and `#ifdef`.

### Detecting Ice Versions

The Slice compilers define the preprocessor macro `__ICE_VERSION__` as the Ice version expressed as the decimal number
`major * 10000 + minor * 100 + patch`; for example, `30800` for Ice 3.8.0. You can use this macro to make your Slice
definitions backward-compatible with older Ice releases, while still taking advantage of newer Ice features when
possible. For example, the Slice definition shown below applies the `["oneway"]` metadata directive, introduced in Ice
3.8.2, only when the compiler supports it:

```slice
interface Logger
{
#if __ICE_VERSION__ >= 30802
    ["oneway"]
#endif
    void log(string message);
}
```

### Detecting Slice Compilers

Each Slice compiler defines a macro named after the compiler in upper case, such as `__SLICE2CPP__` for `slice2cpp` and
`__SLICE2MATLAB__` for `slice2matlab`. Use these macros to include definitions or metadata only when you compile for one
language mapping. The operations and types that a client and a server use to communicate must be the same in both
mappings.

## Definition Order

Slice constructs, such as modules, interfaces, or type definitions, can appear in any order you prefer. However,
identifiers must be declared before they can be used.

## See Also

- [Using the Slice Compilers](../using-the-slice-compiler)
- [Lexical Rules](../lexical-rules)
