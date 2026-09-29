---
title: Modules
---

# Modules Reduce Clutter

A common problem in large systems is pollution of the global namespace: over time, as isolated systems are integrated,
name clashes become quite likely. Slice provides the `module` construct to alleviate this problem:

```slice
module ZeroC
{
    module Client
    {
        // Definitions here...
    }

    module Server
    {
        // Definitions here...
    }
}
```

A module can contain any legal Slice construct, including other module definitions. Using modules to group related
definitions together avoids polluting the global namespace and makes accidental name clashes quite unlikely. (You can
use a well-known name, such as a company or product name, as the name of the outermost module.)

# Modules are Mandatory

Slice requires all definitions to be nested inside a module, that is, you cannot define anything other than a module at
global scope. For example, the following is illegal:

```slice
interface I   // Error: only modules can appear at global scope
{
    // ...
}
```

Definitions at global scope are prohibited because they cause problems with some implementation languages (such as
Python, which does not have a true global scope).

{% callout type="info" %}

Throughout the Ice manual, you will occasionally see Slice definitions that are not nested inside a module. This is to
keep the examples short and free of clutter. Whenever you see such a definition, assume that it is nested in module `M`.

{% /callout %}

# Nested Module Syntax

You can define a nested module directly. For example:

```slice
module ClearSky::Ephemerides
{
    // ...
}
```

is a concise notation for the following modules:

```slice
module ClearSky
{
    module Ephemerides
    {
        // ...
    }
}
```

# Reopening Modules

Modules can be reopened:

```slice
module ZeroC
{
    // Definitions here...
}

// Possibly in a different source file:

module ZeroC // OK, reopened module
{
    // More definitions here...
}
```

Reopened modules are useful for larger projects: they allow you to split the contents of a module over several different
[source files](../slice-source-files). The advantage of doing this is that, when a developer makes a change to one part
of the module, only files dependent on the changed part need be recompiled (instead of having to recompile all files
that use the module).

# Language Mapping

{% language-section name="lang-1" /%}

##### See Also

- [Slice Source Files](../slice-source-files)
