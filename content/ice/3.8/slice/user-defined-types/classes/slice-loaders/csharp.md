{% language-section name="custom-slice-loaders" %}

A custom Slice loader implements the `Ice.SliceLoader` interface. You install it by setting the `sliceLoader` property
of [InitializationData](api:Ice/InitializationData):

```csharp
class NodeLoader : Ice.SliceLoader
{
    public object? newInstance(string typeId) => typeId == "::Demo::Node" ? new MyNode() : null;
}

await using var communicator = new Ice.Communicator(new Ice.InitializationData { sliceLoader = new NodeLoader() });
```

{% /language-section %}
