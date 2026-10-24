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

Without the `--all` option, the compiler generates no code for Slice definitions in included files. Instead, it
translates each `#include` directive into a `require_once` statement for the PHP file generated from the included file,
and places these statements in a global `namespace` block.

Each `require_once` statement uses the shortest of these paths: the path from the `#include` directive, and the path of
the included file relative to each include directory (specified with `-I`) that contains it. For example, if
`/opt/App/slice/Main.ice` contains `#include <Process.ice>` and you specify `-I/opt/App/slice/OS` and
`-I/opt/App/slice`, the compiler generates:

```php
namespace
{
    require_once 'Process.php';
}
```

If `Main.ice` contains `#include "OS/Process.ice"` instead, the compiler generates `require_once 'OS/Process.php';` even
with `-I/opt/App`, because `OS/Process` is shorter than `slice/OS/Process`.

{% /language-section %}
