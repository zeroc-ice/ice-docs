{% language-section name="common-options-1" %}

- `--depend` Print dependency information in Makefile format to standard output by default, or to the file specified by
  the `--depend-file` option.

{% /language-section %}

{% language-section name="common-options-3" %}

## The Slice Compiler for C++

The Slice-to-C++ compiler (`slice2cpp`) offers the following additional options:

### `--header-ext` `EXT`

Changes the file extension for the generated header files from the default `h` to the extension specified by `EXT`.

The `cpp:header-ext` file directive sets the header extension of one Slice file and takes precedence over this option.
The compiler also uses it for the `#include` directive that it generates for this file when another Slice file includes
it. For example, `Ice/BuiltinSequences.ice` contains `[["cpp:header-ext:h"]]`, so compiling

```slice
// example.ice
#include <Ice/BuiltinSequences.ice>
```

with `slice2cpp --header-ext=hpp -I/opt/Ice/include example.ice` generates `example.hpp`, which includes
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

For each Slice file that a Slice file includes, the generated header includes the header generated from the included
file. The compiler builds the path of this `#include` directive from the path of the included Slice file: when an `-I`
directory contains the included file, the compiler removes this directory from the path, and when several do, it uses
the one that gives the shortest path. For example, suppose `slice/inc/A.ice` contains:

```slice
// A.ice
#include <slice/inc/B.ice>
```

| Command                                             | `#include` directive in `A.h` |
| --------------------------------------------------- | ----------------------------- |
| `slice2cpp -I. slice/inc/A.ice`                     | `#include <slice/inc/B.h>`    |
| `slice2cpp -I. -Islice slice/inc/A.ice`             | `#include <inc/B.h>`          |
| `slice2cpp -I. -Islice -Islice/inc slice/inc/A.ice` | `#include <B.h>`              |

The `-I` option therefore plays two roles: it lets the preprocessor locate included Slice files, and it shortens the
generated `#include` directives. In the last two commands, `-I.` locates `slice/inc/B.ice`, and the other `-I` options
only shorten the generated directive. Configure your C++ compiler so that it finds the headers by these paths.

When the preprocessor can locate an included file through several include directories, it uses the first one that
locates the file, and your `-I` options must match the directory it selects. Avoid include directories that let the
preprocessor locate a file in more than one way.

### Source Files

The generated source file includes its own header by the base name of the header: compiling `inc/A.ice` generates
`#include "A.h"` in `A.cpp`. The `--include-dir` option adds a directory to this path: with
`slice2cpp --include-dir src -I. inc/A.ice`, `A.cpp` contains `#include "src/A.h"`. The directory of the Slice file,
`inc`, does not appear in either directive.

## Using Ice with CMake

Ice for C++ ships with a CMake package that defines an imported target for each Ice library and the `slice2cpp_generate`
function, which compiles the Slice files of a target as part of the build. See
[Using Ice with CMake](../using-the-slice-compiler/using-ice-with-cmake).

{% /language-section %}
