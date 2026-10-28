{% language-section name="mapping" %}

Here is the definition of our EmployeeMap once more:

```slice
dictionary<long, Employee> EmployeeMap;
```

The following code is generated for this definition:

```swift
public typealias EmployeeMap = [Int64: Employee]
```

A Slice dictionary maps to a Swift dictionary, which you use like any other dictionary:

```swift
let stan = Employee(number: 42, firstName: "Stan", lastName: "Lippman")
let herb = Employee(number: 77, firstName: "Herb", lastName: "Sutter")

let em: EmployeeMap = [stan.number: stan, herb.number: herb]
```

{% /language-section %}
