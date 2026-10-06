{% language-section name="proxy-creation-1" %}

```diff
-proxy = communicator.stringToProxy("greeter: tcp -h localhost -p 4061");
-greeter = GreeterPrx.uncheckedCast(proxy);
+greeter = GreeterPrx(communicator, 'greeter:tcp -h localhost -p 4061');
```

{% /language-section %}

{% language-section name="proxy-creation-2" %}

## Dictionaries

A Slice dictionary now maps to a MATLAB `dictionary`. In Ice 3.7, it mapped to a `containers.Map`, or to a struct array
with `key` and `value` fields when the key type was a Slice struct.

Create the dictionary with `configureDictionary`, giving the mapped key type and the mapped value type. For example,
with `dictionary<long, Employee> EmployeeMap`, where `Employee` is a Slice struct:

```diff
-em = containers.Map('KeyType', 'int64', 'ValueType', 'any');
+em = configureDictionary('int64', 'Employee');
 em(31) = employee;
```

A dictionary keyed by a Slice struct takes the mapped struct as its key. With `dictionary<Point, string> PointNames`:

```diff
-names = struct('key', {}, 'value', {});
-names(1).key = Point(1, 2);
-names(1).value = 'start';
+names = configureDictionary('Point', 'string');
+names(Point(1, 2)) = 'start';
```

When the Slice value type is a sequence, a dictionary, a class or a proxy, the value type of the MATLAB dictionary is
`cell`, and each value is a cell that holds the mapped value. Use curly braces to store and retrieve the value itself.
With `dictionary<string, Greeter*> GreeterMap`:

```diff
-greeters = containers.Map('KeyType', 'char', 'ValueType', 'any');
-greeters('fr') = greeter;
-greeter = greeters('fr');
+greeters = configureDictionary('string', 'cell');
+greeters{'fr'} = greeter;
+greeter = greeters{'fr'};
```

A request context is a `dictionary` with `string` keys and `string` values:

```diff
-context = containers.Map('KeyType', 'char', 'ValueType', 'char');
+context = configureDictionary('string', 'string');
 context('language') = 'fr';
 greeting = greeter.greet('alice', context);
```

See [Dictionaries](../slice/user-defined-types/dictionaries) for the value type that corresponds to each Slice type.

## String Sequences

A generated proxy method now returns a `sequence<string>` as a string array and accepts a string array for a
`sequence<string>` parameter. In Ice 3.7, a `sequence<string>` mapped to a cell array of character vectors. Review the
code that indexes a returned sequence with curly braces.

```diff
 names = directory.list();
-first = names{1};
+first = names(1);
```

## Typed Arguments and Properties

A generated proxy method now validates the type of each argument, except for optional parameters. A generated class,
exception or struct declares a typed property for each field, except for optional fields and fields that hold class
instances.

Pass an empty array of the mapped type for a null proxy or a null class instance. In a typed property, represent a null
proxy with an empty array of the proxy type, and an empty sequence with an empty array of the mapped sequence type:

```diff
-registry.setGreeter([]);
-entry.greeter = [];
-entry.weights = [];
+registry.setGreeter(GreeterPrx.empty);
+entry.greeter = GreeterPrx.empty;
+entry.weights = int32.empty;
```

## Struct Properties

In a generated class, exception or struct, a non-optional field of Slice struct type is now empty by default. In Ice
3.7, it held a new instance of the mapped struct, so you could set the fields of this instance directly. Assign an
instance first:

```diff
 line = Line();
+line.start = Point();
 line.start.x = 10;
```

## Slice Loaders

Ice 3.8 locates the generated class for a Slice class or exception through a
[Slice loader](../slice/user-defined-types/classes/slice-loaders). The default Slice loader maps a Slice type ID such as
`::M::Node` to the MATLAB class `M.Node`. It cannot locate a class with a compact ID, or a class or exception whose name
or enclosing module you rename with the `matlab:identifier` metadata: for these, create an `Ice.ClassSliceLoader` from
the meta classes of the generated classes and give it to the communicator:

```matlab
communicator = Ice.Communicator(args, SliceLoader = Ice.ClassSliceLoader(?Compact, ?CompactExt));
```

{% /language-section %}
