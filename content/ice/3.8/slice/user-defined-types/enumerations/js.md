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
class Fruit
{
    static readonly Apple:Fruit;
    static readonly Pear:Fruit;
    static readonly Orange:Fruit;

    static valueOf(value:number):Fruit | undefined;

    equals(other:any):boolean;
    hashCode():number;
    toString():string;

    readonly name:string;
    readonly value:number;
}
```

Each enumerator defines `name` and `value` properties that supply the enumerator's name and ordinal value, respectively.
Enumerators also define `hashCode`, `equals` and `toString` methods, and the enumerated type itself defines a `valueOf`
method that converts ordinal values into their corresponding enumerators.

Suppose we modify the Slice definition to include a custom enumerator value:

```slice
enum Fruit { Apple, Pear = 3, Orange }
```

The generated code changes accordingly:

```js
class Fruit = { ... };
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

TypeScript has an enumerated type, but the TypeScript definitions must match the JavaScript generated code, using
enumerated types in TypeScript is identical to use them in JavaScript.

{% /callout %}

{% /language-section %}
