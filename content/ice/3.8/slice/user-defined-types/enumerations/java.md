{% language-section name="lang-1" %}

A Slice enumeration maps to the corresponding enumeration in Java. For example:

```slice
enum Fruit { Apple, Pear, Orange }
```

The Java mapping for `Fruit` is shown below:

```java
public enum Fruit {
    Apple,
    Pear,
    Orange;

    public int value();

    public static Fruit valueOf(int v);

    // ...
}
```

Given the above definitions, we can use enumerated values as follows:

```java
Fruit f1 = Fruit.Apple;
Fruit f2 = Fruit.Orange;

if (f1 == Fruit.Apple) { // Compare with constant
    // ...
}

if (f1 == f2) { // Compare two enums
    // ...
}

switch (f2) {   // Switch on enum
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
```

The Java mapping includes two methods of interest. The `value` method returns the Slice value of an enumerator, which is
not necessarily the same as its ordinal value. The `valueOf` method translates a Slice value into its corresponding
enumerator, or returns `null` if no match is found.

In the `Fruit` definition above, the Slice value of each enumerator matches its ordinal value. This will not be true if
we modify the definition to include a custom enumerator value:

```slice
enum Fruit { Apple, Pear = 3, Orange }
```

The table below shows the new relationship between ordinal value and Slice value:

| **Enumerator** | **Ordinal** | **Slice** |
| -------------- | ----------- | --------- |
| `Apple`        | 0           | 0         |
| `Pear`         | 1           | 3         |
| `Orange`       | 2           | 4         |

{% callout type="tip" %}

Java enumerated types inherit implicitly from `java.lang.Enum`, which defines methods such as `ordinal` and `compareTo`
that operate on the _ordinal_ value of an enumerator, not its Slice value.

{% /callout %}

{% /language-section %}
