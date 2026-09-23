{% language-section name="lang-1" %}

A Slice dictionary maps to:

- A JavaScript Map when the Key is one of the Slice built-in types.
- To Ice.HashMap when the Key is a Slice struct.

This distinction is necessary because:

- JavaScript Map uses the `===` operator for key equality.
- `Ice.HashMap` allows custom comparators, so struct keys can use their equals method for equality.

### **Example: Dictionary with Built-in Key**

```slice
struct Employee
{
    long number;
    string firstName;
    string lastName;
}

dictionary<long, Employee> EmployeeMap;
```

In this example, `EmployeeMap` maps to a JavaScript `Map` with:

- key type = `BigInt` (from Slice `long`)
- value type = `Employee` (the JavaScript class generated from the Slice struct).

### **Example: Dictionary with Struct Key**

If the key is a Slice struct, the compiler generates code that uses
[Ice.HashMap](https://code.zeroc.com/ice/3.8/api/javascript/Ice/HashMap.html).

```slice
dictionary<Employee, string> EmployeeDeptMap;
```

Generated JavaScript/TypeScript code:

```js
class EmployeeDeptMap extends Ice.HashMap {
    constructor(h) {
        const keyComparator = ...;
        super(h || keyComparator);
    }
}
```

```typescript
class EmployeeDeptMap extends Ice.HashMap<Employee, string> { ... }
```

- `new EmployeeDeptMap()` automatically sets the comparators for struct keys and values.
- Using `new Ice.HashMap()` directly would require you to provide custom comparators yourself.

{% /language-section %}
