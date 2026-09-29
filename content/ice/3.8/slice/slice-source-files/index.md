---
title: Slice Source Files
---

Slice defines a number of rules for the naming and contents of Slice source files.

# File Naming

Files containing Slice definitions must end in a `.ice` file extension, for example, `Clock.ice` is a valid file name.
Other file extensions are rejected by the compilers.

For case-insensitive file systems, the file extension may be written as uppercase or lowercase, so `Clock.ICE` is legal.
For case-sensitive file systems (such as Unix), `Clock.ICE` is illegal. (The extension must be in lowercase.)

# File Format

Slice is a free-form language so you can use spaces, horizontal and vertical tab stops, form feeds, and newline
characters to lay out your code in any way you wish. (White space characters are token separators). Slice does not
attach semantics to the layout of a definition. You may wish to follow the style we have used for the Slice examples
throughout this book.

Slice files can be ASCII text files or use the UTF-8 character encoding with an optional byte order marker (BOM) at the
beginning of each file. However, Slice identifiers are limited to ASCII letters and digits; non-ASCII letters can appear
only in comments and string literals.

# Preprocessing

Slice supports the same preprocessor directives as C++, so you can use directives such as `#include` and macro
definitions. However, Slice permits `#include` directives only at the beginning of a file, before any Slice definitions.

If you use `#include` directives, it is a good idea to protect them with guards to prevent double inclusion of a file:

```slice
// File Clock.ice
#ifndef CLOCK_ICE
#define CLOCK_ICE

// #include directives here...
// Definitions here...

#endif CLOCK_ICE
```

The following `#pragma` directive offers a simpler way to achieve the same result:

```slice
// File Clock.ice
#pragma once

// #include directives here...
// Definitions here...
```

`#include` directives permit a Slice definition to use types defined in a different source file. The Slice compilers
parse all of the code in a source file, including the code in subordinate `#include` files. However, the compilers
generate code only for the top-level file(s) nominated on the command line. You must separately compile subordinate
`#include` files to obtain generated code for all the files that make up your Slice definition.

Also note that, if you include a path separator in a `#include` directive, you must use a forward slash:

```slice
#include <SliceDefs/Clock.ice>  // OK
```

You cannot use a backslash in `#include` directives:

```slice
#include <SliceDefs\Clock.ice>  // Illegal
```

## Detecting Ice Versions

The Slice compilers define the preprocessor macro `__ICE_VERSION__` with a numeric representation of the Ice version.
You can use this macro to make your Slice definitions backward-compatible with older Ice releases, while still taking
advantage of newer Ice features when possible. For example, the Slice definition shown below makes use of custom
enumerator values:

```slice
#if defined(__ICE_VERSION__) && __ICE_VERSION__ >= 030500
enum Fruit { Apple, Pear = 3, Orange }
#else
enum Fruit { Apple, Pear, Orange }
#endif
```

Although this example is intended to show how to use the `__ICE_VERSION__` macro, it also highlights a potential pitfall
that you must be aware of when trying to maintain backward compatibility: the two definitions of `Fruit` are not
wire-compatible.

## Detecting Slice Compilers

Each Slice compiler defines its own macro so that you can customize your Slice code for certain language mappings. The
macro name is `__<compiler name in upper case>__`, such as `__SLICE2CPP__` and `__SLICE2MATLAB__` for `slice2cpp` resp.
`slice2matlab`.

# Definition Order

Slice constructs, such as modules, interfaces, or type definitions, can appear in any order you prefer. However,
identifiers must be declared before they can be used.

##### See Also

- [Using the Slice Compilers](../using-the-slice-compiler)
