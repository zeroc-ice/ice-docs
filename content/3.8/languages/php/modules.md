---
id: modules
language: php
---

{% language-section name="lang-1" %}

A Slice module maps to a PHP namespace with the same name. The mapping preserves the nesting of the Slice definitions.
For example:

```slice
module M1::M2
{
    // ...
}

// ...

module M1    // Reopen M1
{
    // ...
}
```

This definition maps to the corresponding PHP definitions:

```php
namespace M1\M2
{
    // ...
}

// ...

namespace M1    // Reopen M1
{
    // ...
}
```

If a Slice module is reopened, the corresponding PHP namespace is reopened as well.

### Custom Mapping

The `php:identifier` metadata directive allows you to map a module to a PHP namespace or sub-namespace of your choice.
For example:

```slice
// module Time becomes namespace Remote\Clock in PHP.
["php:identifier:Remote\Clock"]
module Time
{
    // ...
}
```

You can only use `php:identifier` on a module with a simple name - this metadata directive is not compatible with the
nested module syntax.

{% /language-section %}
