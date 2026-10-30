{% language-section name="common-options-1" %}

- `--depend` Print dependency information in Makefile format to standard output by default, or to the file specified by
  the `--depend-file` option.

{% /language-section %}

{% language-section name="common-options-3" %}

## The Slice Compiler for Python

The Slice-to-Python compiler (`slice2py`) supports the following additional options:

- `--build=modules|index|all` Selects which Python files the compiler generates.
- `--list-generated=modules|index|all` Prints the paths of the Python files that the compiler would generate, relative
  to the output directory and one per line, without generating them.

The value selects the files:

| Value     | Files                                                   |
| --------- | ------------------------------------------------------- |
| `modules` | The Python module files for the Slice definitions.      |
| `index`   | The Python package index files (`__init__.py`).         |
| `all`     | Both module and index files. The default for `--build`. |

{% /language-section %}
