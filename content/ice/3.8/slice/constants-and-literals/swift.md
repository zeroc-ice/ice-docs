{% language-section name="lang-1" %}

{% /language-section %}

{% language-section name="lang-2" %}

Slice constant definitions map to corresponding Swift constant definitions. For example:

```slice
const bool AppendByDefault = true;
const byte LowerNibble = 0x0f;
const string Advice = "Don't Panic!";
const short TheAnswer = 42;
const double PI = 3.1416;

enum Fruit { Apple, Pear, Orange }
const Fruit FavoriteFruit = Pear;
```

Here are the generated Swift definitions for these constants:

```swift
public let AppendByDefault: Bool = true
public let LowerNibble: UInt8 = 15
public let Advice: String = "Don't Panic!"
public let TheAnswer: Int16 = 42
public let PI: Double = 3.1416

public enum Fruit: UInt8 { ... }
public let FavoriteFruit: Fruit = Fruit.Pear
```

Slice string literals that contain non-ASCII characters or universal character names are mapped to Swift string literals
with Unicode escape sequences. For example:

```slice
const string Egg = "œuf";
const string Heart = "c\u0153ur";
const string Banana = "\U0001F34C";
```

is mapped to:

```swift
public let Egg: String = "\u{153}uf"
public let Heart: String = "c\u{153}ur"
public let Banana: String = "\u{1f34c}"
```

{% /language-section %}
