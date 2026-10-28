---
title: Class Inheritance
sidebarLabel: Inheritance
---

Unlike [structures](../../structures), classes support inheritance. For example:

```slice
module M
{
    class TimeOfDay
    {
        short hour;         // 0 - 23
        short minute;       // 0 - 59
        short second;       // 0 - 59
    }

    class DateTime extends TimeOfDay
    {
        short day;          // 1 - 31
        short month;        // 1 - 12
        short year;
    }
}
```

`DateTime` inherits the `hour`, `minute`, and `second` fields of `TimeOfDay`, and adds the fields of a date.

A class can extend only one base class, and a derived class cannot redefine a field of its base class.

## Implicit Inheritance from Value

All classes implicitly inherit from `Value`. This way, a `Value` parameter in an operation accepts any class instance.

## See Also

- [Structures](../../structures)
