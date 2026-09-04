---
id: fields
language: matlab
---

{% language-section name="lang-1" %}

A Slice field maps to a MATLAB property, with by default the same name. We often remap the field name with
`matlab:identifier` to convert the name to Pascal case.

The MATLAB class for the property is the mapped type, as presented earlier, except the following properties don’t
specify a MATLAB class:

- properties mapped from optional fields
- properties mapped from fields of class type or that reference class types.

The size and validation function(s) of each property depends on the field type:

| **Slice Field Type**                       | **MATLAB Size**    | **MATLAB Validation Function** | **Remarks**                                                                  |
| ------------------------------------------ | ------------------ | ------------------------------ | ---------------------------------------------------------------------------- |
| `bool`, numeric type, `enum`, `dictionary` | Scalar: `(1, 1)`   |                                |                                                                              |
| `string`                                   | `(1, :)`           |                                | An empty array (of char) represents an empty string.                         |
| `sequence`                                 | `(1, :)`           |                                | An empty array or an empty cell array represents an empty sequence.          |
| `class`, proxy                             | No size constraint | `{mustBeScalarOrEmpty}`        | An empty array represents a null class instance or null proxy.               |
| `struct`                                   | No size constraint | `{mustBeScalarOrEmpty}`        | An empty array is a temporary value. Replace this empty array with a scalar. |

For example:

```
class Address { ... }

struct Person
{
    ["matlab:identifier:Name"]
    string name;

    ["matlab:identifier:Address"]
    Address address;
}
```

maps to:

```matlab
classdef Address < Ice.Value
    ...
end

classdef (Sealed) Person
    properties
        Name    (1, :) char
        % empty corresponds to null
        Address {mustBeScalarOrEmpty} = Example.Address.empty
    end
    ...
end
```

## Optional Fields

An optional field maps to a MATLAB property just like a regular field, except you can also set this property to the
marker value `Ice.Unset`. The tag value is not mapped to MATLAB.

A well-behaved program must test a MATLAB property (mapped from an optional field) before using its value:

```matlab
obj = ...;
if obj.OptionalField ~= Ice.Unset
    fprintf('OptionalField = %s\n', obj.OptionalField);
else
    fprintf('OptionalField is unset\n');
end
```

## Default Values

Slice default values are mapped to default MATLAB property values.

For example:

```
struct Location
{
    ["matlab:identifier:Name"]
    string name;

    ["matlab:identifier:Point"]
    Point point;

    ["matlab:identifier:Display"]
    bool display = true;

    ["matlab:identifier:Source"]
    string source = "GPS";
}
```

maps to:

```matlab
classdef (Sealed) Location
    properties
        Name    (1, :) char
        Point          Example.Point {mustBeScalarOrEmpty} = Example.Point.empty
        Display (1, 1) logical = true
        Source  (1, :) char = sprintf('GPS')
    end
    methods
        function obj = Location(Name, Point, Display, Source)
            if nargin > 0
                assert(nargin == 4, 'Invalid number of arguments');
                obj.Name = Name;
                obj.Point = Point;
                obj.Display = Display;
                obj.Source = Source;
            end
       end
   ...
   end
end
```

When you don’t define a default value in Slice, and you initialize a property without providing a value for this
property, the generated code uses the following default:

| **Optional Field?** | **Slice Field Type**       | **MATLAB Default Value**                                                                                    |
| ------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------- |
| No                  | `bool`, numeric type       | 0 (implicit default)                                                                                        |
|                     | `string`                   | Empty 1-by-0 array of char (implicit default)                                                               |
|                     | `enum`                     | First enumerator (implicit default)                                                                         |
|                     | `Object*`, proxy           | `MappedPrx.empty`(implicit default)                                                                         |
|                     | `Value`, `class`, `struct` | `MappedType.empty`(implicit default when the MATLAB class is specified)                                     |
|                     | `sequence`                 | `MappedElementType.empty`(implicit default), or `{}` (implicit default when the MATLAB class is specified). |
|                     | `dictionary`               | `configureDictionary('keyType', 'valueType')`                                                               |
| Yes                 | Any                        | `Ice.Unset`                                                                                                 |

{% /language-section %}

{% language-section name="lang-2" %}

{% /language-section %}
