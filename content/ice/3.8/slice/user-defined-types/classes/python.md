{% language-section name="mapping" %}

A Slice class maps to a Python dataclass with the same name. The generated class contains a field for each Slice field
(just as for structures and exceptions). Consider the following class definition:

```slice
class TimeOfDay
{
    short hour;         // 0 - 23
    short minute;       // 0 - 59
    short second;       // 0 - 59
}
```

The Python mapping generates the following code for this definition:

```py
@dataclass(eq=False)
class TimeOfDay(Value):
    hour: int = 0
    minute: int = 0
    second: int = 0
    tz: str = ""

    # ...
```

The generated class `TimeOfDay` inherits from `Ice.Value`. This means that all classes implicitly inherit from
`Ice.Value`, which is the ultimate ancestor of all classes.

All mapped fields have default values, such as `0` and the empty string (see [Fields](../../fields) for details).

The mapped dataclass is configured with `eq=False` to provide reference-equality semantics like in other language
mappings: two class instances are equal only when they are actually the same instance.

{% /language-section %}

{% language-section name="hooks" %}

`Ice.Value` does not define `ice_preMarshal` or `ice_postUnmarshal`; Ice calls each method only when the instance has
it:

```py
class TimeOfDayI(TimeOfDay):
    seconds_since_midnight = 0

    def ice_preMarshal(self):
        self.hour, remainder = divmod(self.seconds_since_midnight, 3600)
        self.minute, self.second = divmod(remainder, 60)

    def ice_postUnmarshal(self):
        self.seconds_since_midnight = self.hour * 3600 + self.minute * 60 + self.second
```

{% /language-section %}
