{% language-section name="lang-1" %}

A Slice structure maps to a JavaScript class with the same name. For each Slice field, the JavaScript instance contains
a corresponding field. As an example, here is our Employee structure once more:

```slice
struct Employee
{
    long number;
    string firstName;
    string lastName;
}
```

The mapping for this structure is equivalent to the following JavaScript code:

```js
// Generated JavaScript code

class Employee {
    constructor(number = 0n, firstName = "", lastName = "") {
        this.number = number;
        this.firstName = firstName;
        this.lastName = lastName;
    }
}
```

```typescript
// Generated TypeScript definition

class Employee {
    constructor(number?: bigint, firstName?: string, lastName?: string);
    clone():Employee;
    equals(other: any): boolean;
    hashCode(): number;

    number:bigint;
    firstName:string;
    lastName:string;
}
```

The generated class defines an `equals` method for comparison purposes and a `clone` method to create a shallow copy.
For structures that are also [legal dictionary key types](../dictionaries), the mapped class also defines a `hashCode`
function as required by the `Ice.HashMap` type.

### Generated Constructor

The generated constructor has one parameter for each field. This allows you to construct and initialize an instance in a
single statement (instead of first having to construct the instance and then assign to its fields).

All these parameters have also default values (see [Fields](../../fields)).

{% /language-section %}
