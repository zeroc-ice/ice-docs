{% language-section name="common-options-1" %}

- `--depend` Print dependency information in Makefile format to standard output by default, or to the file specified by
  the `--depend-file` option.

{% /language-section %}

{% language-section name="common-options-3" %}

## The Slice Compiler for PHP

The Slice-to-PHP compiler (`slice2php`) offers one additional option:

- `--all` Generate code for all Slice definitions, including those from included files.

### Compiler Output

For each Slice file `X.ice`, `slice2php` generates PHP code into a file named `X.php` in the output directory. The
default output directory is the current working directory, but a different directory can be specified using the
`--output-dir` option.

### Include Files

Without the `--all` option, the compiler generates no code for the Slice definitions in included files: it translates
each `#include` directive into a PHP `require_once` statement for the PHP file generated from the included file, and
places these statements in a global `namespace` block.

When directories named by `-I` options contain the included file, the compiler uses the shortest path of the included
file relative to one of these directories. For example, if the included file is `/opt/App/slice/OS/Process.ice` and you
specify `-I/opt/App` and `-I/opt/App/slice`, the compiler generates:

```php
namespace
{
    require_once 'OS/Process.php';
}
```

Choosing your `-I` options lets you avoid absolute paths and match the layout of your source files. When no `-I`
directory contains the included file, the compiler uses the path from the `#include` directive:
`#include "../common/Shared.ice"` becomes `require_once '../common/Shared.php';`.

{% /language-section %}
