{% language-section name="dependency-options" %}

- `--depend` Print dependency information in Makefile format to standard output by default, or to the file specified by
  the `--depend-file` option.
- `--depend-xml` Print dependency information in XML format to standard output by default, or to the file specified by
  the `--depend-file` option.
- `--depend-file FILE` Directs dependency information to the specified file. The output format depends on whether
  `--depend` or `--depend-xml` is specified.

{% /language-section %}

{% language-section name="common-options-3" %}

## The Slice Compiler for Python

The Slice-to-Python compiler (`slice2py`) supports the following additional options:

- `--build=modules|index|all` Selects which Python files the compiler generates.
- `--list-generated=modules|index|all` Prints the paths of the Python files that the compiler would generate, relative
  to the output directory and one per line, without generating them.

The value selects the files:

| Value     | Files                                                                       |
| --------- | --------------------------------------------------------------------------- |
| `modules` | The Python module files for the Slice definitions.                          |
| `index`   | The Python package index files (`__init__.py`).                             |
| `all`     | Both module and index files. What the compiler generates without `--build`. |

{% /language-section %}
