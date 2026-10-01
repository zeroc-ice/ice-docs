---
title: Command-Line Parsing and Initialization
---

When you [initialize the Ice runtime](../initialization-and-destruction) by calling `initialize`, you can pass the
application's arguments to the initialization call.

In most languages, this argument vector is an _in-out_ parameter. In C++, for example, `argc` is passed as a _reference_
to an `int`:

```cpp
CommunicatorPtr initialize(int& argc, const char* argv[], ...other parameters...);
```

`initialize` parses the argument vector and initializes the new communicator's properties accordingly. It also removes
all arguments that set Ice properties from the provided argument vector. For example, assume we invoke a C++ server as:

```shell
./server --myoption --Ice.Config=config -x a --Ice.Trace.Network=3 -y opt file
```

Initially, `argc` has the value `9`, and `argv` has ten elements: the first nine elements contain the program name and
the arguments, and the final element, `argv[argc]`, contains a null pointer (as required by the C++ standard). When
`Ice::initialize` returns, `argc` has the value `7` and `argv` contains the following elements:

```text
./server
--myoption
-x
a
-y
opt
file
0             # Terminating null pointer
```

This means that you should initialize the Ice runtime before you parse the command line for your application-specific
arguments. That way, the Ice-related options are stripped from the argument vector for you so you do not need to
explicitly skip them.

`initialize` parses the arguments the same way in all languages, but only the overloads that update the argument array
remove the options they consume. Other overloads leave the input unchanged or return the remaining arguments separately;
see [Communicator Initialization and Destruction](../initialization-and-destruction).

## See Also

- [Using Configuration Files](../using-configuration-files)
- [Communicator Initialization and Destruction](../initialization-and-destruction)
