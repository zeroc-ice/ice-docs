---
id: constants-and-literals
language: csharp
---

{% language-section name="lang-1" %}
Here are the sample constant definitions once more:

```slice
const bool AppendByDefault = true;
const byte LowerNibble = 0x0f;
const string Advice = "Don't Panic!";
const short TheAnswer = 42;
const double PI = 3.1416;

enum Fruit { Apple, Pear, Orange }
const Fruit FavoriteFruit = Pear;
```

Here are the generated definitions for these constants:

```csharp
public abstract class AppendByDefault
{
    public const bool value = true;
}

public abstract class LowerNibble
{
    public const byte value = 15;
}

public abstract class Advice
{
    public const string value = "Don't Panic!";
}

public abstract class TheAnswer
{
    public const short value = 42;
}

public abstract class PI
{
    public const double value = 3.1416;
}

public enum Fruit { Apple, Pear, Orange }

public abstract class FavoriteFruit
{
    public const Fruit value = Fruit.Pear;
}
```

As you can see, each Slice constant is mapped to a class with the same name as the constant. The class contains a field named `value` that holds the value of the constant.

{% callout type="info" %}
The mapping to classes instead of to plain constants is necessary because C# does not permit constant definitions at namespace scope.
{% /callout %}

Slice string literals that contain non-ASCII characters or universal character names are mapped to C# string literals with universal character names. For example:

```slice
const string Egg = "œuf";
const string Heart = "c\u0153ur";
const string Banana = "\U0001F34C";
```

is mapped to:

```csharp
public abstract class Egg
{
    public const string value = "\u0153uf";
}
  
public abstract class Heart
{
    public const string value = "c\u0153ur";
}
  
public abstract class Banana
{
    public const string value = "\ud83c\udf4c";
}
```

{% /language-section %}

{% language-section name="lang-2" %}

{% /language-section %}
