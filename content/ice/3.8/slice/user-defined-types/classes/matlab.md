{% language-section name="mapping" %}

A Slice class is mapped to a MATLAB class with the same name. The generated class contains a public property for each
Slice field (just as for structures and exceptions).

Consider the following class definition:

```slice
class TimeOfDay
{
    ["matlab:identifier:Hour"]
    short hour;         // 0 - 23

    ["matlab:identifier:Minute"]
    short minute;       // 0 - 59

    ["matlab:identifier:Second"]
    short second;       // 0 - 59

    ["matlab:identifier:TZ"]
    string tz;          // e.g. GMT, PST, EDT...
}
```

The Slice compiler generates the following code for this definition:

```matlab
classdef TimeOfDay < Ice.Value
    properties
        Hour    (1, 1) int16
        Minute  (1, 1) int16
        Second  (1, 1) int16
        TZ      (1, :) char
    end
    methods
        function obj = TimeOfDay(Hour, Minute, Second, TZ)
            if nargin > 0
                assert(nargin == 4, 'Invalid number of arguments');
                % ...
            end
        end
        % ...
    end
end
```

There are several things to note about the generated code:

1. The generated class `TimeOfDay` inherits from `Ice.Value`. This means that all classes implicitly inherit from
   `Value`, which is the ultimate ancestor of all classes.
2. The generated class contains a public property for each Slice field.
3. The generated class has a constructor that takes one argument for each field.

### Generated Constructor

If a Slice class declares or inherits any field, the generated constructor accepts one parameter for each property so
that you can construct and initialize an instance in a single statement (instead of first having to construct the
instance and then assign to its properties). For a derived class, the constructor accepts one argument for each base
class property, plus one argument for each derived class property, in base-to-derived order.

You must either call the constructor with no arguments or with arguments for all of the parameters.

Calling the constructor with no argument assigns default values to the properties (see [Fields](../../fields)).

{% /language-section %}

{% language-section name="hooks" %}

`Ice.Value` defines `ice_preMarshal` and `ice_postUnmarshal` as methods that do nothing. You override them in a class
derived from the generated class:

```matlab
classdef TimeOfDayI < TimeOfDay
    properties (Access = private)
        SecondsSinceMidnight (1, 1) int32 = 0
    end
    methods
        function ice_preMarshal(obj)
            obj.Hour = int16(idivide(obj.SecondsSinceMidnight, int32(3600)));
            obj.Minute = int16(mod(idivide(obj.SecondsSinceMidnight, int32(60)), 60));
            obj.Second = int16(mod(obj.SecondsSinceMidnight, 60));
        end
        function ice_postUnmarshal(obj)
            obj.SecondsSinceMidnight = int32(obj.Hour) * 3600 + int32(obj.Minute) * 60 + int32(obj.Second);
        end
    end
end
```

{% /language-section %}
