---
id: structures
language: matlab
---

{% language-section name="lang-1" %}

A Slice structure maps to a MATLAB value class containing a public property for each field of the structure. For
example, here is our Employee structure once more:

```slice
struct Employee
{
    ["matlab:identifier:Number"]
    long number;

    ["matlab:identifier:FirstName"]
    string firstName;

    ["matlab:identifier:LastName"]
    string lastName;
}
```

The MATLAB mapping generates the following definition for this structure:

```matlab
classdef Employee
    properties
        Number    (1, 1) int64
        FirstName (1, :) char
        LastName  (1, :) char
    end
    methods
        function obj = Employee(Number, FirstName, LastName)
            ...
        end
    end
    ...
end
```

## Generated Constructor

The generated constructor has one parameter for each property. You must either call this constructor with no arguments
or with arguments for all the properties.

If you call the generated constructor with no argument, the constructor assigns default values to all properties (see
[Fields](../fields)).

{% /language-section %}
