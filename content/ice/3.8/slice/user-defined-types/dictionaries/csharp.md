{% language-section name="mapping" %}

### Default Mapping

Here is the definition of our EmployeeMap once more:

```slice
dictionary<long, Employee> EmployeeMap;
```

By default, the Slice-to-C# compiler maps the dictionary to the following type:

```csharp
// Standard Dictionary from System.Collections.Generic
Dictionary<long, Employee>
```

### Custom Mapping for Dictionaries

You can use the `"cs:generic:SortedDictionary"` or `"cs:generic:SortedList"` metadata directives to change the default
mapping to use a sorted dictionary or sorted list instead. For example:

```slice
["cs:generic:SortedDictionary"]
dictionary<long, Employee> EmployeeMap;
```

With this definition, the type of the dictionary becomes:

```csharp
// From namespace System.Collections.Generic
SortedDictionary<long, Employee>
```

`SortedDictionary` and `SortedList` sort the entries with the default comparer of the key type. The C# types generated
for Slice structures do not implement `IComparable`, so use these mappings for dictionaries whose key type is not a
structure.

{% /language-section %}
