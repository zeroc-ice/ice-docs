{% language-section name="lang-1" %}

A Slice enumeration maps to the corresponding enumeration in MATLAB. For example:

```slice
enum Fruit { Apple, Pear, Orange }
```

The MATLAB mapping for `Fruit` is shown below:

```matlab
classdef Fruit < uint8
    enumeration
        Apple (0)
        Pear (1)
        Orange (2)
    end
    methods(Static)
        function r = ice_getValue(v)
            switch v
                case 0
                    r = Example.Fruit.Apple;
                case 1
                    r = Example.Fruit.Pear;
                case 2
                    r = Example.Fruit.Orange;
                otherwise
                    throw(Ice.MarshalException(...
                        sprintf('enumerator value %d is out of range', v)));
            end
        end
    end
end
```

Given the above definitions, we can use enumerated values as follows:

```matlab
f1 = Fruit.Apple;
f2 = Fruit.Orange;

if f1 == Fruit.Apple % Compare with constant
    % ...
end

if f1 == f2          % Compare two enums
    % ...
end

switch f2            % Switch on enum
    case Fruit.Apple
        % ...
    case Fruit.Pear
        % ...
    case Fruit.Orange
        % ...
end
```

You can obtain the ordinal value of an enumerator using the `uint8` function:

```matlab
val = uint8(Fruit.Pear);
assert(val == 1);
```

To convert an integer into its equivalent enumerator, call the `ice_getValue` function:

```matlab
f = Fruit.ice_getValue(2);
assert(f == Fruit.Orange);
```

This function throws an exception if the given integer does not match any of the enumerators.

The `Fruit` definition above shows the ordinal values assigned by default to the enumerators. Suppose we modify the
definition to include a custom enumerator value:

```slice
enum Fruit { Apple, Pear = 3, Orange }
```

The generated code changes accordingly:

```matlab
classdef Fruit < uint8
    enumeration
        Apple (0)
        Pear (3)
        Orange (4)
    end
    ...
end
```

{% /language-section %}
