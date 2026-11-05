{% language-section name="dependency-options" %}

- `--depend` Print dependency information in Makefile format to standard output by default, or to the file specified by
  the `--depend-file` option.
- `--depend-xml` Print dependency information in XML format to standard output by default, or to the file specified by
  the `--depend-file` option.
- `--depend-file FILE` Directs dependency information to the specified file. The output format depends on whether
  `--depend` or `--depend-xml` is specified.

{% /language-section %}

{% language-section name="common-options-3" %}

## The Slice Compiler for C++

The Slice-to-C++ compiler (`slice2cpp`) offers the following additional options:

### `--header-ext` `EXT`

Changes the file extension for the generated header files from the default `h` to the extension specified by `EXT`.

The `cpp:header-ext` file directive sets the header extension of one Slice file and takes precedence over this option.
When another Slice file includes this file, the generated `#include` directive uses the same extension. For example,
`Ice/BuiltinSequences.ice` contains `[["cpp:header-ext:h"]]`, so compiling

```slice
// example.ice
#include <Ice/BuiltinSequences.ice>
```

with `slice2cpp --header-ext=hpp -I/opt/Ice/slice example.ice` generates `example.hpp`, which includes
`Ice/BuiltinSequences.h`.

### `--source-ext` `EXT`

Changes the file extension for the generated source files from the default `cpp` to the extension specified by `EXT`.

### `--add-header HDR[,GUARD]`

This option adds an include directive for the specified header at the beginning of the generated source file (preceding
any other include directives). If `GUARD` is specified, the include directive is protected by the specified guard. For
example, `--add-header precompiled.h,__PRECOMPILED_H__` results in the following directives at the beginning of the
generated source file:

```cpp
#ifndef __PRECOMPILED_H__
#define __PRECOMPILED_H__
#include <precompiled.h>
#endif
```

The option can be repeated to create include directives for several files.

As suggested by the preceding example, this option is useful mainly to integrate the generated code with a compiler's
precompiled header mechanism.

### `--include-dir DIR`

Prepends the directory `DIR` to the path in the `#include` directive that the generated source file uses to include its
own header file.

## Include Directives

The `-I` and `--include-dir` options determine the paths of the `#include` directives that `slice2cpp` generates. The
`--output-dir` option determines where the compiler writes the generated files, but does not change their content.

### Header Files

The header generated from a Slice file includes the header generated from each Slice file it includes. The compiler
builds the path of this `#include` directive from the path of the included Slice file: when it finds the included file
in an `-I` directory, it removes the `-I` directory from the path, and when several `-I` directories contain the file,
it uses the one that gives the shortest path. For example, suppose `slice/inc/A.ice` contains:

```slice
// A.ice
#include <slice/inc/B.ice>
```

| Command                                             | `#include` directive in `A.h` |
| --------------------------------------------------- | ----------------------------- |
| `slice2cpp -I. slice/inc/A.ice`                     | `#include <slice/inc/B.h>`    |
| `slice2cpp -I. -Islice slice/inc/A.ice`             | `#include <inc/B.h>`          |
| `slice2cpp -I. -Islice -Islice/inc slice/inc/A.ice` | `#include <B.h>`              |

The `-I` option therefore plays two roles: it lets the compiler locate included Slice files, and it shortens the
generated `#include` directives. In the last two commands, `-I.` locates `slice/inc/B.ice`, and the other `-I` options
only shorten the generated directive.

When the compiler finds the included file relative to the including file instead, the generated directive keeps the path
of the Slice `#include` directive, in quotes, whatever the `-I` options: if `slice/inc/A.ice` contains
`#include "B.ice"`, `A.h` contains `#include "B.h"`.

### Source Files

The generated source file includes its own header by the base name of the header: compiling `inc/A.ice` generates
`#include "A.h"` in `A.cpp`. The `--include-dir` option adds a directory to this path: with
`slice2cpp --include-dir src -I. inc/A.ice`, `A.cpp` contains `#include "src/A.h"`. The directory of the Slice file,
`inc`, does not appear in either generated `#include` directive.

## Using Ice with CMake

Ice for C++ ships with a CMake package that defines an imported target for each Ice library and provides the
`slice2cpp_generate` function, which compiles the Slice files of a target as part of the build. See
[Using Ice with CMake](../../build-tools/cmake).

{% /language-section %}
