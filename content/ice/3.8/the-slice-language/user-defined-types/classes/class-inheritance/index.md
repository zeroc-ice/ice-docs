---
title: Class Inheritance
---

# Simple Inheritance

Unlike [structures](../structures), classes support inheritance. For example:

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
        short year;         // 1753 onwards
    }
}
```

This example illustrates one major reason for using a class: a class can be extended by inheritance, whereas a structure
is not extensible. The previous example defines `DateTime` to extend the `TimeOfDay` class with a date.

{% callout type="info" %}

If you are puzzled by the comment about the year 1753, search the Web for "1752 date change". The intricacies of
calendars for various countries prior to that year can keep you occupied for months...

{% /callout %}

Classes only support single inheritance. The following is illegal:

```slice
class TimeOfDay
{
    short hour;         // 0 - 23
    short minute;       // 0 - 59
    short second;       // 0 - 59
}

class Date
{
    short day;
    short month;
    short year;
}

class DateTime extends TimeOfDay, Date   // Error!
{
    // ...
}
```

A derived class cannot redefine a field of its base class:

```slice
class Base
{
    int integer;
}

class Derived extends Base
{
    int integer;                // Error, integer redefined
}
```

# Implicit Inheritance from Value

All classes implicitly inherit from `Value`. This way, a `Value` parameter in an operation accepts any class instance.

##### See Also

- [Structures](../structures)
