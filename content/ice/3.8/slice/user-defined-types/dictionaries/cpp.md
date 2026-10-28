{% language-section name="mapping" %}

### Default Dictionary Mapping

Here is the definition of our EmployeeMap once more:

```slice
dictionary<long, Employee> EmployeeMap;
```

The following code is generated for this definition:

```cpp
using EmployeeMap = std::map<std::int64_t, Employee>;
```

A Slice dictionary maps to a `std::map`, which you use like any other `map`:

```cpp
EmployeeMap em;
Employee e;

e.number = 42;
e.firstName = "Stan";
e.lastName = "Lippman";
em[e.number] = e;

e.number = 77;
e.firstName = "Herb";
e.lastName = "Sutter";
em[e.number] = e;
```

### Customizing the Dictionary Mapping with `cpp:type`

You can override the default mapping of Slice dictionaries to C++ with a `cpp:type` metadata directive, for example:

```slice
[["cpp:include:unordered_map"]]

["cpp:type:std::unordered_map<std::int64_t, Employee>"]
dictionary<long, Employee> EmployeeMap;
```

The `cpp:type` directive maps `EmployeeMap` to a `std::unordered_map`, and the `cpp:include` file directive adds the
matching include directive to the generated header:

```cpp
#include <unordered_map>

using EmployeeMap = std::unordered_map<std::int64_t, Employee>;
```

Instead of `std::unordered_map`, you can specify a type of your own as the dictionary type, for example:

```slice
[["cpp:include:CustomMap.h"]]

["cpp:type:MyCustomMap<std::int64_t, Employee>"]
dictionary<long, Employee> EmployeeMap;
```

With these metadata directives, the compiler will use a C++ type `MyCustomMap` as the dictionary type, and add an
include directive for the header file `CustomMap.h` to the generated code.

The class or template class you provide must meet the following requirements:

- The class must have a default constructor.
- The class must have a copy constructor.
- The class must provide nested types named `key_type`, `mapped_type` and `value_type`.
- The class must provide `iterator` and `const_iterator` types and provide `begin` and `end` member functions with the
  usual semantics; these iterators must be comparable for equality and inequality.
- The class must provide a `clear` function.
- The class must provide a `size` function that returns the number of entries.
- The class must provide an `insert` function that takes an `iterator` (as location hint) plus a `value_type` parameter,
  and returns an `iterator` to the new entry or to the existing entry with the given key.

In addition to modifying the type of a dictionary itself, you can also modify the mapping for particular
[return values or parameters](../../operations). For example, with the `cpp:include:unordered_map` file directive and
the default mapping for `EmployeeMap`:

```slice
interface Office
{
    ["cpp:type:std::unordered_map<std::int64_t, Employee>"]
    EmployeeMap getAllEmployees();
}
```

With this definition, `getAllEmployees` returns an `unordered_map`, while other unqualified parameters of type
`EmployeeMap` use the default mapping (to a `std::map`).

{% /language-section %}
