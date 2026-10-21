---
title: Code Generation
---

The Ruby mapping supports two forms of code generation: dynamic and static.

## Dynamic Code Generation in Ruby

Using dynamic code generation, Slice files are "loaded" at runtime and dynamically translated into Ruby code, which is
immediately compiled and available for use by the application. This is accomplished using the `Ice::loadSlice` method,
as shown in the following example:

```ruby
Ice::loadSlice(["Color.ice"])
puts "My favorite color is #{M::Color::Blue.to_s}"
```

For this example, we assume that `Color.ice` contains the following definitions:

```slice
module M
{
    enum Color { red, green, blue }
}
```

### `Ice::loadSlice` Options in Ruby

The `Ice::loadSlice` method accepts command-line arguments in the same form as the Slice compiler. The arguments must
include at least one Slice file.

The function has the following Ruby definition:

```ruby
def loadSlice(args)
```

The `args` array holds the command-line arguments, one string per argument. The function always returns `nil`.

For example:

```ruby
Ice::loadSlice(["-I/opt/IceRuby/slice", "Color.ice"])
```

`Ice::loadSlice` accepts the following options:

- `-DNAME` Defines the preprocessor symbol `NAME`.
- `-DNAME=DEF` Defines the preprocessor symbol `NAME` with the value `DEF`.
- `-UNAME` Undefines the preprocessor symbol `NAME`.
- `-IDIR` Adds the directory `DIR` to the search path for `#include` directives.
- `-d, --debug` Prints debug information showing the operation of the Slice parser.
- `--all` Generates code for all Slice definitions, including those from included files.

Like `slice2rb`, `Ice::loadSlice` defines `__SLICE2RB__`.

### Locating Slice Files in Ruby

If your Slice files depend on Ice types, you can avoid hard-coding the path name of your Ice installation directory by
calling the `Ice::getSliceDir` function:

```ruby
Ice::loadSlice(["-I#{Ice::getSliceDir()}", "Color.ice"])
```

This function attempts to locate the `slice` subdirectory of your Ice installation using an algorithm that succeeds for
the following scenarios:

- Installation of a binary Ice archive
- Installation of an Ice source distribution using `make install`
- Installation via a Windows installer
- RPM installation on Linux
- Execution inside a compiled Ice source distribution

If the `slice` subdirectory can be found, `getSliceDir` returns its absolute path name, otherwise the function returns
`nil`.

### Loading Multiple Slice Files in Ruby

You can specify as many Slice files as necessary in a single invocation of `Ice::loadSlice`, as shown below:

```ruby
Ice::loadSlice(["Syscall.ice", "Process.ice"])
```

Alternatively, you can call `Ice::loadSlice` several times:

```ruby
Ice::loadSlice(["Syscall.ice"])
Ice::loadSlice(["Process.ice"])
```

If a Slice file includes another file, the default behavior of `Ice::loadSlice` generates Ruby code only for the named
file. For example, suppose `Syscall.ice` includes `Process.ice` as follows:

```slice
// Syscall.ice
#include <Process.ice>
...
```

If you call `Ice::loadSlice(["-I.", "Syscall.ice"])`, Ruby code is not generated for the Slice definitions in
`Process.ice` or for any definitions that may be included by `Process.ice`. If you also need code to be generated for
included files, one solution is to load them individually in subsequent calls to `Ice::loadSlice`. However, it is much
simpler, not to mention more efficient, to use the `--all` option instead:

```ruby
Ice::loadSlice(["--all", "-I.", "Syscall.ice"])
```

When you specify `--all`, `Ice::loadSlice` generates Ruby code for all Slice definitions included directly or indirectly
from the named Slice files.

There is no harm in loading a Slice file multiple times, aside from the additional overhead associated with code
generation. For example, this situation could arise when you need to load multiple top-level Slice files that happen to
include a common subset of nested files. Suppose that we need to load both `Syscall.ice` and `Kernel.ice`, both of which
include `Process.ice`. The simplest way to load both files is with a single call to `Ice::loadSlice`:

```ruby
Ice::loadSlice(["--all", "-I.", "Syscall.ice", "Kernel.ice"])
```

Although this invocation causes the Ice extension to generate code twice for `Process.ice`, the generated code is
structured so that the interpreter ignores duplicate definitions. We could have avoided generating unnecessary code with
the following sequence of steps:

```ruby
Ice::loadSlice(["--all", "-I.", "Syscall.ice"])
Ice::loadSlice(["-I.", "Kernel.ice"])
```

In more complex cases, however, it can be difficult or impossible to completely avoid this situation, and the overhead
of code generation is usually not significant enough to justify such an effort.

### Limitations of Dynamic Code Generation in Ruby

The `Ice::loadSlice` method must be called outside of any module scope. For example, the following code is incorrect:

```ruby
# WRONG
module M
    Ice::loadSlice(["--all", "-I.", "Syscall.ice", "Kernel.ice"])
    ...
end
```

## Static Code Generation in Ruby

You should be familiar with static code generation if you have used other Slice language mappings, such as C++ or Java.
Using static code generation, the Slice compiler [slice2rb](../using-the-slice-compiler) generates Ruby code from your
Slice definitions.

### Compiler Output in Ruby

For each Slice file `X.ice`, `slice2rb` generates Ruby code into a file named `X.rb` in the output directory. The
default output directory is the current working directory, but a different directory can be specified using the
`--output-dir` option.

### Include Files in Ruby

Without the `--all` option, the compiler generates no code for the Slice definitions in included files: it translates
each `#include` directive into a Ruby `require` or `require_relative` statement, depending on where the preprocessor
finds the included file.

When the preprocessor finds the included file in a directory named by an `-I` option, the compiler generates a `require`
statement for the Ruby file generated from it, using the shortest path of the included file relative to one of these
directories. For example, if the included file is `/opt/App/slice/OS/Process.ice` and you specify `-I/opt/App` and
`-I/opt/App/slice`, the compiler generates:

```ruby
require 'OS/Process.rb'
```

Choosing your `-I` options lets you avoid absolute paths and match the layout of your source files. Ruby looks up the
required file in its load path.

When the preprocessor finds the included file relative to the directory of the including Slice file, the compiler
generates a `require_relative` statement for the Ruby file generated from it, with that relative path:

```ruby
require_relative 'OS/Process.rb'
```

Ruby resolves this path relative to the directory of the generated file, so the generated files must keep the same
relative layout as the Slice files.

## Static Versus Dynamic Code Generation in Ruby

There are several issues to consider when evaluating your requirements for code generation.

### Application Considerations for Code Generation in Ruby

The requirements of your application generally dictate whether you should use dynamic or static code generation. Dynamic
code generation is convenient for a number of reasons:

- It avoids the intermediate compilation step required by static code generation.
- It makes the application more compact because the application requires only the Slice files, not the additional files
  produced by static code generation.
- It reduces complexity, which is especially helpful during testing, or when writing short or transient programs.

Static code generation, on the other hand, is appropriate in many situations:

- when an application uses a large number of Slice definitions and the startup delay must be minimized
- when it is not feasible to deploy Slice files with the application
- when a number of applications share the same Slice files
- when Ruby code is required in order to utilize third-party Ruby tools.

### Mixing Static and Dynamic Generation in Ruby

You can safely use a combination of static and dynamic translation in an application. For it to work properly, you must
correctly manage the include paths for Slice translation and the Ruby interpreter so that the statically-generated code
can be imported properly by `require`.

For example, suppose you want to dynamically load the following Slice definitions:

```slice
#include <Glacier2/Session.ice>

module MyApp
{
    interface MySession extends Glacier2::Session
    {
        // ...
    }
}
```

Whether the included file `Glacier2/Session.ice` is loaded dynamically or statically is determined by the presence of
the `--all` option:

```ruby
sliceDir = "-I#{ENV['ICE_HOME']}/slice"

# Load Glacier2/Session.ice dynamically:
Ice::loadSlice([sliceDir, "--all", "MySession.ice"])

# Load Glacier2/Session.ice statically:
Ice::loadSlice([sliceDir, "MySession.ice"])
```

In this example, the first invocation of `loadSlice` uses the `--all` option so that code is generated dynamically for
all included files. The second invocation omits `--all`, therefore the Ruby interpreter executes the equivalent of the
following statement:

```ruby
require "Glacier2/Session.rb"
```

As a result, before we can call `loadSlice` we must first ensure that the interpreter can locate the
statically-generated file `Glacier2/Session.rb`. We can do this in a number of ways, including:

- adding the parent directory (e.g., `/opt/IceRuby/ruby`) to the `RUBYLIB` environment variable
- specifying the `-I` option when starting the interpreter
- modifying the search path at runtime, as shown below:

  ```ruby
  $:.unshift("/opt/IceRuby/ruby")
  ```

## See Also

- [Using the Slice Compilers](../using-the-slice-compiler)
