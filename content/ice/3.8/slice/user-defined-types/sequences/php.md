{% language-section name="mapping" %}

A Slice sequence maps to a native PHP indexed array. The first element of the Slice sequence is contained at index 0
(zero) of the PHP array, followed by the remaining elements in ascending index order.

Consider this example:

```slice
sequence<Fruit> FruitPlatter;
```

You can create an instance of `FruitPlatter` as shown below:

```php
// Make a small platter with one Apple and one Orange
$platter = array(Fruit::Apple, Fruit::Orange);
```

The Ice runtime validates the elements of an array to ensure that they are compatible with the declared type and throws
`InvalidArgumentException` if an incompatible type is encountered.

{% /language-section %}
