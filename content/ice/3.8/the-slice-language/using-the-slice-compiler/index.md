---
title: Using the Slice Compiler
---

# Common Options

Ice provides a Slice compiler for each language mapping. The compilers share a similar command-line syntax:

```shell
slice2<name> [options] file...
```

Regardless of which compiler you use, a number of command-line options are common to the compilers for any language
mapping:

- `-h, --help` Displays a help message.
- `-v, --version` Displays the compiler version.
- `-DNAME` Defines the preprocessor symbol `NAME`.
- `-DNAME=DEF` Defines the preprocessor symbol `NAME` with the value `DEF`. Each compiler always predefines the
  `__<compiler name in upper case>__` macro when compiling Slice file. For example, slice2cpp predefines
  `__SLICE2CPP__`.
- `-UNAME` Undefines the preprocessor symbol `NAME`.
- `-IDIR` Add the directory `DIR` to the search path for `#include` directives.
- `--output-dir` `DIR` Place the generated files into directory `DIR`, which must already exist.
- `-d, --debug` Print debug information showing the operation of the Slice parser.

{% language-section name="lang-1" /%}

- `--depend-xml` Print dependency information in XML format to standard output by default, or to the file specified by
  the `--depend-file` option.

{% language-section name="lang-2" /%}

- `--depend-file FILE` Directs dependency information to the specified file. The output format depends on whether
  `--depend`, `--depend-xml`, or `--depend-json` is specified.
- `--validate` Checks the provided command-line options for correctness, and does not generate any code.

The Slice compilers permit you to compile more than a single source file, so you can compile several Slice definitions
at once, for example:

```shell
slice2cpp -I. file1.ice file2.ice file3.ice
```

{% language-section name="lang-3" /%}

##### See Also

- [Slice Compilation](../slice-compilation)
