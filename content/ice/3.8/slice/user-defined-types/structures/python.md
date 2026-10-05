{% language-section name="mapping" %}

A Slice structure maps to a Python dataclass with the same name. For each Slice field, the Python dataclass contains a
corresponding field. For example, here is our Employee structure once more:

```slice
struct Employee
{
    long number;
    string firstName;
    string lastName;
}
```

The Python mapping generates the following definition for this structure:

```py
@dataclass(order=True, unsafe_hash=True)
class Employee:
    number: int = 0
    firstName: str = ""
    lastName: str = ""
```

All mapped fields have default values, such as `0` and the empty string (see [Fields](../../fields) for details).

For structures that are also [legal dictionary key types](../dictionaries), the mapped dataclass is configured with
`order=True` and `unsafe_hash=True`, as shown in our example above. The hashing is “unsafe” because the mapped dataclass
is not frozen.

{% /language-section %}
