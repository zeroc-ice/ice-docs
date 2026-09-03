---
id: classes
language: cpp
---

{% language-section name="language-mapping" %}

## Mapping for Classes

# Class Mapping

A Slice class is mapped to a C++ class with the same name. The generated class contains a public data member for each Slice field (just as for [structures](../structures) and [exceptions](../exceptions)). Consider the following class definition:

```slice
class TimeOfDay
{
    short hour;         // 0 - 23
    short minute;       // 0 - 59
    short second;       // 0 - 59
    string tz;          // e.g. GMT, PST, EDT...
}
```

The Slice compiler generates the following code for this definition:

```cpp
class TimeOfDay;
using TimeOfDayPtr = std::shared_ptr<TimeOfDay>;

class TimeOfDay : public Ice::Value
{
public:
    TimeOfDay() noexcept = default;
    TimeOfDay(
        std::int16_t hour, 
        std::int16_t minute, 
        std::int16_t second, 
        std::string tz) noexcept;
    
    [[nodiscard]] TimeOfDayPtr ice_clone() const;
    
    std::int16_t hour;
    std::int16_t minute;
    std::int16_t second;
    std::string tz;
};
```

There are a number of things to note about this generated code:

1. The generated class `TimeOfDay` inherits from `Ice::Value`. `Ice::Value` is the ultimate ancestor of all mapped classes.
2. The generated class contains a public data member for each Slice field.
3. The generated class has a constructor that takes one argument for each data member, as well as a default constructor.
4. The generated class has a function, `ice_clone`, which returns a shallow polymorphic copy of this class instance.

## Generated Constructors

Classes have two constructors:

- a default constructor that default-constructs each data member
  This default constructor is no-op and implemented as `= default`. Members having a complex type, such as strings, sequences, and dictionaries, are initialized by their own default constructor. However, the default constructor performs no initialization for members having one of the simple built-in types boolean, integer, floating point, or enumeration. For such a member, it is not safe to assume that the member has a reasonable default value. This is especially true for enumerated types as the member's default value may be outside the legal range for the enumeration, in which case an exception will occur during marshaling unless the member is explicitly set to a legal value.
  To ensure that data members of primitive types are initialized to reasonable values, you can declare default values in your [Slice definition](../classes), and the Slice compiler will generate data member initializers for the corresponding C++ data members.
- a constructor with one parameter for each data member (the *one-shot* constructor)
  This constructor allows you to construct and initialize a class instance in a single statement.

For derived classes, the one-shot constructor has one parameter for each of the base class's data members, plus one parameter for each of the derived class's data members, in base-to-derived order. For example:

```slice
class Base 
{
    int i;
}

class Derived extends Base
{
    string s;
    string greeting = "hello";
}
```

This generates:

```cpp
class Base;
using BasePtr = std::shared_ptr<Base>;

class Derived;
using DerivedPtr = std::shared_ptr<Derived>;

class Base : public Ice::Value
{
public:
    Base() noexcept = default;
    explicit Base(std::int32_t i) noexcept;

    [[nodiscard]] BasePtr ice_clone() const;
 
    std::int32_t i;
};

class Derived : public Base
{
public:
    Derived() noexcept = default;
    Derived(std::int32_t i, std::string s, std::string greeting) noexcept;

    [[nodiscard]] DerivedPtr ice_clone() const;

    std::string s;
    std::string greeting{"hello"};
};
```

Note that single-parameter constructors are defined as `explicit`, to prevent implicit argument conversions.

## Printing Classes

You can print any class instance by calling `ice_print` on this instance. `ice_print` is defined on `Ice::Value`. Alternatively, you can print a shared pointer to a class instance (for example, a `TimeOfDayPtr`) with `operator<<`:

```cpp
TimeOfDayPtr breakTime = ...;
cout << "Taking a break at " << breakTime << endl;
```

`operator<<` just calls `Value::ice_print` when the shared pointer is not null.

You can use the metadata directive `”cpp:custom-print”` to tell the Slice compiler that you want to use your own custom print implementation. For example:

```
["cpp:custom-print"]
class TimeOfDay { ... }
```

The Slice compiler then generates an `ice_print` override declaration in the mapped C++ class, and you are responsible to implement this member function.
{% /language-section %}
