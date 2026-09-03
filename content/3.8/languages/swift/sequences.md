---
id: sequences
language: swift
---

{% language-section name="lang-1" %}
Here is the definition of our FruitPlatter sequence once more:

```slice
sequence<Fruit> FruitPlatter;
```

The Slice compiler generates the following definition for the `FruitPlatter` sequence:

```swift
public typealias FruitPlatter = [Fruit]
```

As you can see, the sequence simply maps to a standard array, so you can use the sequence like any other array. For example:

```swift
// Make a small platter with one Apple and one Orange
//
let platter: FruitPlatter = [.Apple, .Orange]
```

There is a single exception to this mapping rule: a sequence of bytes maps to Foundation.Data and not `[UInt8]`:

```slice
sequence<byte> ByteSeq;
```

becomes:

```swift
public typealias ByteSeq = Foundation.Data
```

{% /language-section %}
