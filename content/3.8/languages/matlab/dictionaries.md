---
id: dictionaries
language: matlab
---

{% language-section name="lang-1" %}
A Slice dictionary maps to a MATLAB dictionary.

The key type of the MATLAB dictionary is the mapped type for the Slice dictionary key. For example, a Slice `string` key maps to a MATLAB `char` key, which MATLAB interprets as a `string` type.

The value type of the MATLAB dictionary depends on the Slice value type:

| **Slice Value Type** | **MATLAB Value Type** |
| --- | --- |
| `bool`, numeric type, `enum`, `struct` | Corresponding MATLAB type |
| `string` | MATLAB `string` |
| `class`, proxy, `sequence`, `dictionary` | Cell of the corresponding MATLAB type |

Consider the definition of our `EmployeeMap` once more:

```slice
struct Employee
{
    ["matlab:identifier:Number"]
    long number;

    ["matlab:identifier:FirstName"]
    string firstName;

    ["matlab:identifier:LastName"]
    string lastName;
}

dictionary<long, Employee> EmployeeMap;
```

`EmployeeMap` maps to a dictionary with key type = `int64` and value type = `Employee` (a MATLAB class mapped from a Slice struct).

```matlab
em = configureDictionary('int64', 'M.Employee');
 
e = M.Employee();
e.Number = 31;
e.FirstName = 'James';
e.LastName = 'Gosling';
 
em(e.Number) = e;
```

{% /language-section %}
