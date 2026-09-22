---
title: Code Generation
---

The Python mapping supports two forms of code generation: **dynamic** and **static**.

# Dynamic Code Generation in Python

With dynamic code generation, Slice files are compiled at run time and the generated Python code is immediately
evaluated by the Python interpreter.

In this mode, **no Python source files are created** by the Slice compiler. Instead, you load Slice files directly with
the Ice.loadSlice function.

For example:

```py
import Ice

Ice.loadSlice(["Greeter.ice"])

...

import VisitorCenter

greeter = VisitorCenter.GreeterPrx(
    communicator,
    "greeter:tcp -h localhost -p 4061")
```

Here, the `VisitorCenter` module becomes available only after the Slice file is loaded and translated into Python.
Attempting to import it before calling `Ice.loadSlice` would fail.

For this example, assume that `Greeter.ice` contains the following Slice definitions:

```
module VisitorCenter
{
    /// Represents a simple greeter.
    interface Greeter
    {
        /// Creates a personalized greeting.
        /// @param name The name of the person to greet.
        /// @return The greeting.
        string greet(string name);
    }
}
```

## `Ice.loadSlice` Options in Python

The `Ice.loadSlice` function behaves like the Slice compiler: it accepts command-line arguments for specifying
preprocessor options and controlling code generation. The arguments must include at least one Slice file.

The function is defined as:

```py
def Ice.loadSlice(args:[str])
```

The args parameter supports all standard Slice compiler options.

For example:

```py
Ice.loadSlice(["-I.", "Greeter.ice"])
```

The supported arguments are the same as those documented for the **Slice for Python compiler** under
[standard compiler options](../using-the-slice-compiler).

## Locating Slice Files in Python

If your Slice files depend on Ice’s built-in types, you don’t need to hard-code the path to your Ice installation.
Instead, you can call the `Ice.getSliceDir` function to obtain the directory where the standard Ice Slice files are
installed.

For example:

```py
Ice.loadSlice([f"-I{Ice.getSliceDir()}", "Greeter.ice")
```

This ensure the application remains portable and does not rely on a fixed installation path.

## Loading Multiple Slice Files in Python

You can specify multiple Slice files in a single invocation of `Ice.loadSlice`:

```py
Ice.loadSlice(["Syscall.ice", "Process.ice"])
```

Alternatively, you can call `Ice.loadSlice` several times:

```py
Ice.loadSlice(["Syscall.ice"])
Ice.loadSlice(["Process.ice"])
```

Note that the Slice for Python compiler does **not** generate code for included files. It only generates code for the
Slice files explicitly passed in the args parameter.

# Static Code Generation in Python

With static code generation, Slice files are compiled into Python source files using the **Slice for Python compiler**
(slice2py). The generated Python code is stored in .py files, which are then imported and compiled by the Python
interpreter along with the rest of your application code.

## Compiler Output in Python

The Slice for Python compiler generates a Python module for each Slice definition. Each module is placed within a Python
package that corresponds to the Slice module containing the definition.

For Slice classes and interfaces, the compiler also generates a second Python module named `<name>_forward`, which
contains forward declarations for the generated types.

Each generated package includes an `__init__.py` file that re-exports all definitions from the modules it contains. This
allows you to import definitions directly from the package without referencing individual modules.

Using the Slice definitions from the `Ice/callback` demo as an example:

```
module EarlyRiser
{
    enum ButtonPressed { Snooze, Stop }

    interface AlarmClock
    {
        ButtonPressed ring(string message);
    }

    interface WakeUpService
    {
        void wakeMeUp(AlarmClock* alarmClock, long timeStamp);
    }
}
```

(Doc comments omitted for brevity—see the demo for the full Slice definitions.)

The Slice compiler generates the following files:

```
EarlyRiser/AlarmClock.py
EarlyRiser/AlarmClock_forward.py
EarlyRiser/ButtonPressed.py
EarlyRiser/WakeUpService.py
EarlyRiser/WakeUpService_forward.py
EarlyRiser/__init__.py
```

- `AlarmClock.py` – contains the definitions for `AlarmClockPrx` proxy type, and the `AlarmClock` servant skeleton.
- `AlarmClock_forward.py` – contains the forward declaration for the `AlarmClockPrx` proxy type. There is never a need
  to manually import `_forward` files.
- `ButtonPressed.py` – contains the `ButtonPressed` enum.
- `WakeUpService.py` – contains the definitions for `WakeUpServicePrx` proxy type, and the `WakeUpService` servant
  skeleton.
- `WakeUpService_forward.py` – contains the forward declaration for the `WakeUpServicePrx` proxy type. There is never a
  need to manually import `_forward` files.
- `__init__.py` – is the package index and re-exports all definitions from the other modules.

{% callout type="info" %}

All code is generated relative to the output directory, which defaults to the current directory. You can change this
location using the --output-dir compiler option.

{% /callout %}

The **init**.py file for each generated package re-exports all definitions from the modules within the package. For this
reason, you must compile **all Slice files that contribute to a given package** in the same invocation of the Slice
compiler.

If you compile only a subset of the Slice files, the generated `__init__.py` will be incomplete, and some definitions
may be missing from the package.

A related situation arises when a Python package contains a mix of Slice-generated code and manually written code. In
this case, you should avoid generating an **init**.py file with the Slice compiler, since it will not account for your
manually written code.

The Slice compiler `--build` option allows you to control what kind of files are generated:

- `--build=modules` Generates only the Python module files for the Slice definitions.
- `--build=index` Generates only the Python package index files (**init**.py).
- `--build=all`. Generates both module and index files (this is the default if --build is omitted).

## Customizing Compiler Output using Metadata in Python

By default, the Slice for Python compiler generates Python modules and packages using the layout described in the
previous section.

Sometimes, however, you may need to map a Slice definition to a different Python package than the one produced by the
default mapping. This is typically necessary when the default mapping would:

- collide with another module already in use, or
- conflict with a Python built-in module.

In such cases, you can use the `python:identifier` metadata to remap the Slice identifier. The generated Python code
will then consistently use the remapped identifier instead of the original Slice identifier.

##### See Also

- [Using the Slice Compilers](../using-the-slice-compiler)
- [Slice Metadata Directives](../slice-metadata-directives)
