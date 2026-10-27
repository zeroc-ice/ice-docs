{% language-section name="mapping" %}

JavaScript does not have an enumerated type, so a Slice enumeration is emulated using JavaScript objects where each
enumerator is an instance of the same type. For example:

```slice
enum Fruit { Apple, Pear, Orange }
```

The generated code is equivalent to the following JavaScript code:

```js
class Fruit { ... }
Fruit.Apple = new Fruit("Apple", 0);
Fruit.Pear = new Fruit("Pear", 1);
Fruit.Orange = new Fruit("Orange", 2);
```

And the generated TypeScript definition for the generated code looks like:

```typescript
export class Fruit extends Ice.EnumBase {
    static readonly Apple: Fruit;
    static readonly Pear: Fruit;
    static readonly Orange: Fruit;

    static valueOf(value: number): Fruit | undefined;
}
```

Each enumerator has the read-only `name` and `value` properties of `Ice.EnumBase`, which supply the enumerator's name
and ordinal value, and a `toString` method that returns its name. The static `valueOf` method converts an ordinal value
into its enumerator.

Suppose we modify the Slice definition to include a custom enumerator value:

```slice
enum Fruit { Apple, Pear = 3, Orange }
```

The generated code changes accordingly:

```js
class Fruit { ... }
Fruit.Apple = new Fruit("Apple", 0);
Fruit.Pear = new Fruit("Pear", 3);
Fruit.Orange = new Fruit("Orange", 4);
```

Given the above definitions, we can use enumerated values as follows:

```js
const f1 = Fruit.Apple;
const f2 = Fruit.Orange;

if (f1 === Fruit.Apple) { // Compare with constant
    // ...
}

if (f1 === f2) {         // Compare two enums
    // ...
}

switch(f2) {             // Switch on enum
    case Fruit.Apple:
        // ...
        break;
    case Fruit.Pear:
        // ...
        break;
    case Fruit.Orange:
        // ...
        break;
}

// Convert an ordinal value to its enumerator, or undefined if no match
const f = Fruit.valueOf(3);
console.log(f.name + " = " + f.value); // Outputs "Pear = 3"
```

{% callout type="note" %}

The TypeScript declarations describe the same generated code: `Fruit` is a class, not a TypeScript `enum`, and
`Fruit.Apple` is an instance of this class, not a number.

{% /callout %}

{% /language-section %}
