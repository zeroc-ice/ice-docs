{% language-section name="language-mapping-1" %}

Here are the sample constant definitions once more:

```slice
module Example
{
    const bool AppendByDefault = true;
    const byte LowerNibble = 0x0f;
    const string Advice = "Don't Panic!";
    const short TheAnswer = 42;
    const double PI = 3.1416;

    enum Fruit { Apple, Pear, Orange }
    const Fruit FavoriteFruit = Pear;
}
```

For each constant, the JavaScript mapping generates a read-only property with the same name in the JavaScript object
corresponding to the enclosing module:

```js
Object.defineProperty(Example, 'AppendByDefault', {value: true});
Object.defineProperty(Example, 'LowerNibble', {value: 15});
Object.defineProperty(Example, 'Advice', {value: "Don't Panic!"});
Object.defineProperty(Example, 'TheAnswer', {value: 42});
Object.defineProperty(Example, 'PI', {value: 3.1416});
Object.defineProperty(Example, 'FavoriteFruit', {value: Fruit.Pear});
```

The corresponding TypeScript declarations are:

```typescript
const AppendByDefault:boolean;
const LowerNibble:number;
const Advice:string;
const TheAnswer:number;
const PI:number;
const FavoriteFruit:Fruit;
```

Slice string literals that contain non-ASCII characters or universal character names are mapped to JavaScript string
literals with universal character names. For example:

```slice
const string Egg = "œuf";
const string Heart = "c\u0153ur";
const string Banana = "\U0001F34C";
```

is mapped to:

```js
Object.defineProperty(Example, 'Egg', {value: "\u0153uf"});
Object.defineProperty(Example, 'Heart', {value: "c\u0153ur"});
Object.defineProperty(Example, 'Banana', {value: "\ud83c\udf4c"});
```

{% /language-section %}
