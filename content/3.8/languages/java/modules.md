---
id: modules
language: java
---

{% language-section name="lang-1" %}

A Slice module maps to a Java package with the same name. The mapping preserves the nesting of the Slice definitions.
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

This definition maps to the corresponding Java definition:

```java
package M1.M2;
// Definitions for M2 here...

package M1;
// Definitions for M1 here...
```

Note that these definitions appear in the appropriate source files; source files for definitions in module `M1` are
generated in directory `M1` underneath the top-level directory, and source files for definitions for module `M2` are
generated in directory `M1/M2` underneath the top-level directory. You can set the top-level output directory using the
`--output-dir` option with [slice2java](../using-the-slice-compiler).

### Custom Mapping

The `java:identifier` metadata directive allows you to map a module to a Java package of your choice. For example:

```slice
// module Time becomes package com.example.clock in Java
["java:identifier:com.example.clock"]
module Time
{
    // ...
}
```

You can only use `java:identifier` on a module with a simple name - this metadata directive is not compatible with the
nested module syntax.

{% /language-section %}
