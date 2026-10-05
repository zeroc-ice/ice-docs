{% language-section name="mapping" %}

Here is the definition of our EmployeeMap once more:

```slice
dictionary<long, Employee> EmployeeMap;
```

The following code is generated for this definition:

```swift
public typealias EmployeeMap = [Int64: Employee]
```

Again, there are no surprises here: a Slice dictionary simply maps to a standard Swift dictionary. As a result, you can
use the dictionary like any other dictionary, for example:

```swift
let stan = Employee(number: 42, firstName: "Stan", lastName: "Lippman")
let herb = Employee(number: 77, firstName: "Herb", lastName: "Sutter")

let em = [stan.number: stan, herb.number: herb]
```

{% /language-section %}
