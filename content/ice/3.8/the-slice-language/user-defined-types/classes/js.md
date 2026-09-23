{% language-section name="language-mapping" %}

## Mapping for Classes

# Class Mapping

A Slice class is mapped to a JavaScript class with the same name. For each Slice field, the JavaScript instance contains
a corresponding field (just as for structures and exceptions). Consider the following class definition:

```slice
class TimeOfDay
{
    short hour;         // 0 - 23
    short minute;       // 0 - 59
    short second;       // 0 - 59
    string tz;          // e.g. GMT, PST, EDT...
}
```

The Slice compiler generates the following code for this definition:

```js
// JavaScript generated code.
class TimeOfDay extends Ice.Value {
    constructor(hour = 0, minute = 0, second = 0, tz = "") {
        super();
        this.hour = hour;
        this.minute = minute;
        this.second = second;
        this.tz = tz;
    }
}
```

```typescript
// TypeScript generated definition.
class TimeOfDay extends Ice.Value {
    constructor(hour?: number, minute?: number, second?: number, tz?: string);

    hour: number;
    minute: number;
    second: number;
    tz: string;
}
```

There are a number of things to note about the generated code:

1. The generated `TimeOfDay` class inherits from `Ice.Value`.
2. The generated class provides a constructor that accepts a value for each field.
3. The generated class defines a JavaScript field for each Slice field.

## Generated Constructor

The generated constructor has one parameter for each field. This allows you to construct and initialize an instance in a
single statement (instead of first having to construct the instance and then assign to its fields).

For example:

```js
const tod = new TimeOfDayI(14, 45, 00, "PST"); // 14:45pm PST
```

All these parameters have also default values (see [Fields](../fields)).

For derived classes, the constructor requires an argument for every field of the class, including inherited fields. For
example, consider the the definition from [Class Inheritance](../class-inheritance) once more:

```slice
class TimeOfDay
{
    short hour;         // 0 - 23
    short minute;       // 0 - 59
    short second;       // 0 - 59
    string tz;          // e.g. GMT, PST, EDT...
}

class DateTime extends TimeOfDay
{
    short day;          // 1 - 31
    short month;        // 1 - 12
    short year;         // 1753 onwards
}
```

The constructors generated for these classes are similar to the following:

```js
class DateTime extends TimeOfDay {
    constructor(hour, minute, second, tz, day = 0, month = 0, year = 0) {
        super(hour, minute, second, tz);
        this.day = day;
        this.month = month;
        this.year = year;
    }
}
```

##### **TypeScript**

```typescript
class DateTime extends TimeOfDay {
    constructor(
          hour?: number,
          minute?: number,
          second?: number,
          tz?: string,
          day?: number,
          month?: number,
          year?: number);

    day: number;
    month: number;
    year: number;
}
```

{% /language-section %}
