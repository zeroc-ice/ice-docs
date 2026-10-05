{% language-section name="common-options-1" %}

- `--depend` Print dependency information in Makefile format to standard output by default, or to the file specified by
  the `--depend-file` option.

{% /language-section %}

{% language-section name="common-options-3" %}

## The Slice Compiler for Python

The Slice-to-Python compiler (`slice2py`) supports the following additional options:

- `--build` `modules|index|all` Controls what type of Python files are generated from the compile Slice files.

  - `--build=modules` Generates only the Python module files for the Slice definitions.
  - `--build=index` Generates only the Python package index files (**init**.py).
  - `--build=all`. Generates both module and index files (this is the default if --build is omitted).

- `--list-generated` `modules|index|all` Lists the Python files that would be generated for the given Slice definitions,
  without producing any output files.

  - `--list-generated=modules` Generates only the Python module files for the Slice definitions.
  - `--list-generated=index` Generates only the Python package index files (**init**.py).
  - `--list-generated=all`. Generates both module and index files (this is the default if --build is omitted).

{% /language-section %}
