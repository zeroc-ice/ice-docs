{% language-section name="lang-1" %}

Ice for C# supports several different mappings for sequences. By default, sequences are mapped to arrays. You can use
metadata directives to map sequences to a number of alternative types:

- `System.Collections.Generic.List`
- `System.Collections.Generic.LinkedList`
- `System.Collections.Generic.Queue`
- `System.Collections.Generic.Stack`
- User-defined custom types that derive from `System.Collections.Generic.IEnumerable<T>`.

The different mappings allow you to map a sequence to a container type that provides the correct performance trade-off
for your application.

## Array Mapping for Sequences

By default, the Slice-to-C# compiler maps sequences to arrays. Interestingly, no code is generated in this case; you
simply define an array of elements to model the Slice sequence. For example:

```slice
sequence<Fruit> FruitPlatter;
```

Given this definition, to create a sequence containing an apple and an orange, you could write:

```csharp
Fruit[] fp = { Fruit.Apple, Fruit.Orange };
```

Or, alternatively:

```csharp
Fruit fp[] = new Fruit[2];
fp[0] = Fruit.Apple;
fp[1] = Fruit.Orange;
```

The array mapping for sequences is both simple and efficient, especially for sequences that do not need to provide
insertion or deletion other than at the end of the sequence.

## Mapping to Predefined Generic Containers

With metadata directives, you can change the default mapping for sequences to use generic containers provided by C#. For
example:

```slice
["cs:generic:List"] sequence<string> StringSeq;
["cs:generic:LinkedList"] sequence<Fruit> FruitSeq;
["cs:generic:Queue"] sequence<int> IntQueue;
["cs:generic:Stack"] sequence<double> DoubleStack;
```

The `"cs:generic:`<_type_>`"` metadata directive causes the `slice2cs` compiler to the map the corresponding sequence to
one of the containers in the `System.Collections.Generic` namespace. For example, the `Queue` sequence maps to
`System.Collections.Generic.Queue<int>` due to its metadata directive.

The predefined containers allow you to select an appropriate space-performance trade-off, depending on how your
application uses a sequence. In addition, if a sequence contains value types, such as `int`, the generic containers do
not incur the cost of boxing and unboxing and so are quite efficient. (For example,
`System.Collections.Generic.List<int>` performs within a few percentage points of an integer array for insertion and
deletion at the end of the sequence, but has the advantage of providing a richer set of operations.)

Generic containers can be used for sequences of any element type except classes. For sequences of classes, only `List`
is supported because it provides the functionality required for efficient unmarshaling. Metadata that specifies any
other generic type is ignored with a warning:

```slice
class MyClass
{
    // ...
}

["cs:generic:List"]
sequence<MyClass> MyClassList; // OK

["cs:generic:LinkedList"]
sequence<MyClass> MyClassLinkedList; // Ignored
```

In this example, sequence type `MyClassList` maps to the generic container `System.Collections.Generic.List<MyClass>`,
but sequence type `MyClassLinkedList` uses the default array mapping.

## Mapping to Custom Types

If the array mapping and the predefined containers are unsuitable for your application (for example, because you may
need a priority queue, which does not come with .NET), you can implement your own custom containers and direct
`slice2cs` to map sequences to these custom containers. For example:

```slice
["cs:generic:MyTypes.PriorityQueue"] sequence<int> Queue;
```

This metadata directive causes the Slice `Queue` sequence to be mapped to the type `MyTypes.PriorityQueue`. You must
specify the fully-qualified name of your custom type following the `cs:generic:` prefix. This is because the generated
code prepends a `global::` qualifier to the type name you provide; for the preceding example, the generated code refers
to your custom type as `global::MyTypes.PriorityQueue<int>`.

Your custom type can have whatever interface you deem appropriate, but it must meet the following requirements:

- The custom type must derive from `System.Collections.Generic.IEnumerable<T>`.
- The custom type must provide a readable `Count` property that returns the number of elements in the collection.
- The custom type must provide an `Add` method that appends an element to the end of the collection.
- If (and only if) the Slice sequence contains elements that are Slice classes, the custom type must provide an indexer
  that sets the value of an element at a specific index. (Indexes, as usual, start at zero.)

As an example, here is a minimal class (omitting implementation) that meets these criteria:

```csharp
public class PriorityQueue<T> : IEnumerable<T>
{
    public IEnumerator<T> GetEnumerator();

    public int Count { get; }

    public void Add(T element);

    public T this[int index] { get; set; } // Needed for class elements only.

    // Other methods and data members here...
}
```

## Multi-Dimensional Sequences

Slice permits you to define sequences of sequences, for example:

```slice
enum Fruit { Apple, Orange, Pear }
["cs:generic:List"] sequence<Fruit> FruitPlatter;
["cs:generic:LinkedList"] sequence<FruitPlatter> Cornucopia;
```

If we use these definitions as shown, the type of FruitPlatter in the generated code is:

```csharp
System.Collections.Generic.LinkedList<System.Collections.Generic.List<Fruit>>
```

Here the outer sequence contains elements of type `List<Fruit>`, as you would expect.

Now let us modify the definition to change the mapping of `FruitPlatter` to an array:

```slice
enum Fruit { Apple, Orange, Pear }
sequence<Fruit> FruitPlatter;
["cs:generic:LinkedList"] sequence<FruitPlatter> Cornucopia;
```

With this definition, the type of `Cornucopia` becomes:

```csharp
System.Collections.Generic.LinkedList<Fruit[]>
```

The generated code now no longer mentions the type `FruitPlatter` anywhere and deals with the outer sequence elements as
an array of `Fruit` instead.

{% /language-section %}
