{% language-section name="mapping" %}

### Default Mapping

A Slice sequence maps to a **JavaScript array**.

- For JavaScript, the compiler does not generate a separate class or type.
- For TypeScript, it generates a type alias.

This allows you to take full advantage of the built-in functionality of JavaScript arrays.

For example:

```slice
sequence<Fruit> FruitPlatter;
```

Generates the following TypeScript declaration:

```typescript
export type FruitPlatter = Fruit[];
```

#### Usage

```js
// JavaScript
const platter = [Fruit.Apple];
platter.push(Fruit.Pear);
```

```typescript
// TypeScript
const platter:FruitPlatter  = [Fruit.Apple];
platter.push(Fruit.Pear);
```

### Mapping for Byte Sequences

As an optimization, `sequence<byte>` maps to the JavaScript `Uint8Array` type. This representation is more efficient
than regular arrays when working with binary data.

{% /language-section %}
