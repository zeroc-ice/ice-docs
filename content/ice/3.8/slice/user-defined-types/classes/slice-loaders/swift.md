{% language-section name="default-slice-loader" %}

The default Slice loader of Ice for Swift locates the generated classes of the Slice files compiled without the
[`swift:class-resolver-prefix`](../../../slice-metadata-directives#swift:class-resolver-prefix:prefix) file metadata.
For a Slice file with this metadata, the Slice compiler generates resolver functions whose names include the prefix:
create a `DefaultSliceLoader` with the same prefix and install it as your custom Slice loader (see below):

```slice
[["swift:class-resolver-prefix:Inventory"]]
```

```swift
let communicator = try Ice.initialize(
    Ice.InitializationData(sliceLoader: DefaultSliceLoader("Inventory")))
```

{% /language-section %}

{% language-section name="custom-slice-loaders" %}

A custom Slice loader conforms to the `SliceLoader` protocol. You install it by setting the `sliceLoader` property of
[InitializationData](api:Ice/InitializationData):

```swift
final class NodeLoader: SliceLoader {
    func newInstance(_ typeId: String) -> AnyObject? {
        typeId == "::Demo::Node" ? MyNode() : nil
    }
}

let communicator = try Ice.initialize(Ice.InitializationData(sliceLoader: NodeLoader()))
```

{% /language-section %}
