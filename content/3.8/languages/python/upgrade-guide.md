---
id: upgrade-guide
language: python
---

{% language-section name="lang-1" %}

### **Python Static Code Generation**

The Python static code generation has been improved in Ice 3.8 to follow a more typical Python package layout and to better support type hints.

The following changes may require updates to your projects:

- The slice2py options **--all** and **--prefix** have been removed.
- The **python:package** and **python:pkgdir** metadata directives have been removed.
- The **name** and **location** of Python generated files has changed.

### Upgrade Steps

#### **Replacing --all**

If you were using `--all` to automatically compile included Slice files, you must now list all required files explicitly.

**Before (3.7)**:

```
slice2py --all Root.ice
```

**Now (3.8)**:

```
slice2py Foo.ice Bar.ice Root.ice
```

Here `Foo.ice` and `Bar.ice` represent all files included by Root.ice.

#### Replacing --prefix

If you used `--prefix` to control the prefix of generated file names, remove it.

Instead:

- Use the **default mapping** for generated modules, and
- Apply the new **python:identifier** metadata when you need to remap a generated name (e.g., to avoid a collision with a Python builtin or standard library module).

#### **Replacing python:package**

If you used the **python:package** metadata directive to control the package of a generated module, remove it.

Instead, use **python:identifier** metadata, which works consistently with all Slice constructs (modules, classes, enums, etc.), not just modules.

```diff
-["python:package:zeroc"]
+["python:identifier:zeroc.sys"]
module sys
{
    interface Process
    {
        // ...
    }
}
```

#### **New File Layout**

The Python mapping now generates a **Python module for each Slice-defined type**, placing it inside a package that corresponds to the Slice module.

```slice
module VisitorCenter
{
    interface Greeter
    {
        string greet(string name);
    }
}
```

**Generated output (3.7):**

```
./VisitorCenter/__init__.py
./Greeter_ice.py
```

**Generated output (3.8):**

```
./VisitorCenter/__init__.py
./VisitorCenter/Greeter_forward.py
./VisitorCenter/Greeter.py
```

Key points:

- Generated files no longer use the `_ice` suffix.
- All generated files are placed inside the corresponding package directory.
- For Slice classes and interfaces, an additional `<name>_forward.py` file is generated for forward declarations.
  
  Applications **do not** need to import these _forward modules directly.

{% callout type="info" %}
Import semantics are unchanged:

```
import VisitorCenter
```

works the same in 3.7 and 3.8.
{% /callout %}

## **Package Imports**

In Ice 3.7, Python generated packages would automatically export nested sub-packages.

This is no longer the case in Ice 3.8: you must explicitly import nested packages.

**Ice 3.7:**

```py
import Foo

# Nested subpackage is automatically available
c = Foo.Nested.Color.Red
```

**Ice 3.8:**

```py
from Foo import Nested

c = Nested.Color.Red
```

Or import only what you need:

```py
from Foo.Nested import Color

c = Color.Red
```

{% /language-section %}

{% language-section name="lang-2" %}

```diff
-proxy = communicator.stringToProxy("greeter: tcp -h localhost -p 4061");
-greeter = GreeterPrx.uncheckedCast(proxy);
+greeter = GreeterPrx(communicator, "greeter:tcp -h localhost -p 4061")
```

{% /language-section %}

{% language-section name="lang-3" %}

{% /language-section %}
