{% language-section name="packaging" %}

### Python Static Code Generation

The Python static code generation has been improved in Ice 3.8 to follow a more typical Python package layout and to
better support type hints.

The following changes may require updates to your projects:

- The slice2py options **--all** and **--prefix** have been removed.
- The slice2py option **--build** replaces the **--no-package** and **--build-package** options.
- slice2py replaces the package index files (`__init__.py`) each time it generates them.
- The **python:package** and **python:pkgdir** metadata directives have been removed.
- The **name** and **location** of Python generated files has changed.

### Upgrade Steps

#### Replacing --all

If you were using `--all` to automatically compile included Slice files, you must now list all required files
explicitly.

**Before (3.7)**:

```shell
slice2py --all Root.ice
```

**Now (3.8)**:

```shell
slice2py Foo.ice Bar.ice Root.ice
```

Here `Foo.ice` and `Bar.ice` represent all files included by Root.ice.

#### Replacing --prefix

If you used `--prefix` to control the prefix of generated file names, remove it.

Instead:

- Use the **default mapping** for generated modules, and
- Apply the new **python:identifier** metadata when you need to remap a generated name (e.g., to avoid a collision with
  a Python builtin or standard library module).

#### Replacing python:package

If you used the **python:package** metadata directive to control the package of a generated module, remove it.

Instead, use **python:identifier** metadata, which works consistently with all Slice constructs (modules, classes,
enums, etc.), not just modules.

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

#### New File Layout

The Python mapping now generates a **Python module for each Slice-defined type**, placing it inside a package that
corresponds to the Slice module.

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

```text
./VisitorCenter/__init__.py
./Greeter_ice.py
```

**Generated output (3.8):**

```text
./VisitorCenter/__init__.py
./VisitorCenter/Greeter_forward.py
./VisitorCenter/Greeter.py
```

Key points:

- Generated files no longer use the `_ice` suffix.
- All generated files are placed inside the corresponding package directory.
- For Slice classes and interfaces, an additional `<name>_forward.py` file is generated for forward declarations.

  Applications **do not** need to import these _forward modules directly.

{% callout type="note" %}

Import semantics are unchanged:

```py
import VisitorCenter
```

works the same in 3.7 and 3.8.

{% /callout %}

#### Package Index Files

The package index file (`__init__.py`) that `slice2py` generates for a package exports the definitions of the Slice
files passed to that `slice2py` command. The Ice 3.7 compiler added the Slice file it compiled to the existing index
file, so a build could compile the Slice files of a module one at a time. The Ice 3.8 compiler replaces the index file
each time it generates it.

For example, when `Clock.ice` and `Alarm.ice` both define types in the Slice module `EarlyRiser`, the second command
below leaves `generated/EarlyRiser/__init__.py` with only the definitions of `Alarm.ice`:

```shell
slice2py --output-dir generated Clock.ice
slice2py --output-dir generated Alarm.ice
```

Compile all the Slice files that contribute to a package with one command:

```shell
slice2py --output-dir generated Clock.ice Alarm.ice
```

If your build compiles each Slice file with a separate command, generate only the modules with these commands, then
generate the index files with a command that lists all the Slice files:

```shell
slice2py --output-dir generated --build=modules Clock.ice
slice2py --output-dir generated --build=modules Alarm.ice
slice2py --output-dir generated --build=index Clock.ice Alarm.ice
```

#### Replacing --no-package and --build-package

The `--build` option replaces the `--no-package` and `--build-package` options. It accepts `modules`, `index` or `all`;
`all`, the default, generates the modules and the package index files. See
[Using the Slice Compiler](../slice/using-the-slice-compiler).

| Ice 3.7 option    | Ice 3.8 option    | Description                                                     |
| ----------------- | ----------------- | --------------------------------------------------------------- |
| `--no-package`    | `--build=modules` | Generates the modules and leaves the package index files as is. |
| `--build-package` | `--build=index`   | Generates only the package index files.                         |

#### Tracking Generated Files

The Ice 3.7 compiler generated one file per Slice file, `<name>_ice.py`, plus the package index files. To get the files
that the Ice 3.8 compiler generates from a set of Slice files, run `slice2py` with the `--list-generated` option and the
value `modules`, `index` or `all`:

```shell
slice2py --output-dir generated --list-generated=all Clock.ice Alarm.ice
```

With this option, `slice2py` generates no file. It prints the path of each file, relative to the output directory, on a
separate line.

## Package Imports

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

{% language-section name="proxy-creation-1" %}

```diff
-proxy = communicator.stringToProxy("greeter: tcp -h localhost -p 4061");
-greeter = GreeterPrx.uncheckedCast(proxy);
+greeter = GreeterPrx(communicator, "greeter:tcp -h localhost -p 4061")
```

{% /language-section %}

{% language-section name="proxy-creation-2" %}

## Loading Slice Files

`Ice.loadSlice` now takes a single argument: a list that holds one string per compiler argument. Ice 3.7 accepted a
command string, optionally followed by such a list.

```diff
-Ice.loadSlice("-I. Greeter.ice")
-Ice.loadSlice("-I.", ["Greeter.ice"])
+Ice.loadSlice(["-I.", "Greeter.ice"])
```

Like `slice2py`, `Ice.loadSlice` no longer accepts the `--all` option. Pass every Slice file of your application,
including the files that your other Slice files include:

```diff
-Ice.loadSlice("--all Root.ice")
+Ice.loadSlice(["Foo.ice", "Bar.ice", "Root.ice"])
```

See [Code Generation](../slice/code-generation).

## Arguments of Ice.initialize

`Ice.initialize` takes either an argument list, such as `Ice.initialize(sys.argv)`, or an `Ice.InitializationData`
object as the `initData` keyword argument.

To combine command-line arguments with an `InitializationData` object, create the properties of this object from the
arguments:

```diff
 initData = Ice.InitializationData()
 initData.logger = MyLogger()
-communicator = Ice.initialize(sys.argv, initData)
+initData.properties = Ice.createProperties(sys.argv, initData.properties)
+communicator = Ice.initialize(initData=initData)
```

To combine command-line arguments with a configuration file, add `--Ice.Config` to the arguments:

```diff
-communicator = Ice.initialize(sys.argv, "config.client")
+sys.argv.append("--Ice.Config=config.client")
+communicator = Ice.initialize(sys.argv)
```

## Optional Values

Ice 3.8 removes `Ice.Unset` and uses `None` in its place: Ice returns `None` for an optional parameter, return value or
field without a value, an optional field with no default value in Slice is initially `None`, and a `None` you pass for
an optional parameter or field means "not set".

```diff
-if greeting is not Ice.Unset:
+if greeting is not None:
     print(greeting)
```

## Enumerations

A generated enumeration now derives from the `enum.Enum` class of Python, and Ice 3.8 removes `Ice.EnumBase`. An
enumerator keeps its `name` and `value` attributes. Update the code that uses the following:

- `Color.valueOf(n)` becomes `Color(n)`.
- The `<`, `<=`, `>` and `>=` operators no longer work on enumerators: compare the `value` attributes.
- `str(Color.Red)` now returns `Color.Red`; use `Color.Red.name` to get `Red`.

```diff
-color = Color.valueOf(n)
-if color < Color.Blue:
+color = Color(n)
+if color.value < Color.Blue.value:
     ...
```

## Using None for a Struct

Marshaling `None` for a struct parameter, return value, or field that is not optional now fails with a `ValueError`. Ice
3.7 marshaled a default-constructed struct in this case. Pass an instance of the struct:

```diff
-clock.setTime(None)
+clock.setTime(TimeOfDay())
```

## Asynchronous Invocations

The synchronous proxy methods work as in Ice 3.7. For asynchronous invocations, we recommend the `Async` methods with
`asyncio`: create the communicator with the running event loop, then `await` the invocation. The code is as simple as
with the synchronous methods, and the event loop can run other tasks while the invocation is in progress:

```python
async def main():
    async with Ice.Communicator(sys.argv, eventLoop=asyncio.get_running_loop()) as communicator:
        greeter = GreeterPrx(communicator, "greeter:tcp -h localhost -p 4061")
        greeting = await greeter.greetAsync("alice")
        print(greeting)

asyncio.run(main())
```

Ice 3.8 removes the `begin_` and `end_` methods and `Ice.AsyncResult`. Without an event loop, an `Async` method returns
an `Ice.InvocationFuture`, as in Ice 3.7:

```diff
-result = greeter.begin_greet("alice")
-greeting = greeter.end_greet(result)
+future = greeter.greetAsync("alice")
+greeting = future.result()
```

Replace the `_response` and `_ex` callbacks of a `begin_` method with a callback registered with `add_done_callback` on
the future, and the `_sent` callback with a callback registered with `add_sent_callback`, which now receives a single
argument:

```diff
-def sent(future, sentSynchronously):
+def sent(sentSynchronously):
     ...

 future.add_sent_callback(sent)
```

## Sequence Metadata

The `python:seq:list`, `python:seq:tuple`, `python:seq:default` and `python:default` metadata directives have been
removed; `slice2py` ignores them with a warning. Replace `python:seq:list` and `python:seq:tuple` with `python:list` and
`python:tuple`, and remove `python:seq:default` and `python:default`. See the
[sequence mapping](../slice/user-defined-types/sequences).

```diff
-["python:seq:tuple"] sequence<string> StringSeq;
+["python:tuple"] sequence<string> StringSeq;
```

Ice 3.8 removes `Ice.createArray` and `Ice.createNumPyArray`, the factory functions that Ice 3.7 provided for the
`python:memoryview` metadata. To map a sequence to an `array.array` or to a NumPy array, use the `python:array.array` or
`python:numpy.ndarray` metadata instead:

```diff
-["python:memoryview:MyModule.createIntArray"] sequence<int> IntSeq;
+["python:numpy.ndarray"] sequence<int> IntSeq;
```

A factory function for `python:memoryview` now takes two parameters, the memory view and the element type; Ice 3.7
passed a third parameter, `copy`.

## Marshaled Results

The `marshaled-result` metadata no longer affects the generated Python code: `slice2py` no longer generates the
`MarshaledResult` helper methods, and the servant method returns the result itself:

```diff
 def getNode(self, current):
-    return Demo.Tree.GetNodeMarshaledResult(self._node, current)
+    return self._node
```

Keep the `marshaled-result` metadata in a Slice file that you also compile for another language mapping, where it still
applies.

{% /language-section %}
