{% language-section name="default-slice-loader" %}

The default Slice loader of Ice for Swift locates a generated class through a resolver method that `slice2swift`
generates for each Slice class and exception. The
[swift:class-resolver-prefix](../../../slice-metadata-directives#swift:class-resolver-prefix:prefix) file metadata adds
a prefix to the names of these methods, for example:

```slice
[["swift:class-resolver-prefix:Demo"]]
```

The default Slice loader that the communicator installs uses no prefix. To have a `DefaultSliceLoader` locate the
classes and exceptions defined in a Slice file with this metadata, create it with the same prefix and install it in the
same way as a custom Slice loader:

```swift
let communicator = try Ice.initialize(Ice.InitializationData(sliceLoader: DefaultSliceLoader("Demo")))
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

To combine a custom Slice loader with a `DefaultSliceLoader` created with a resolver prefix, use a
`CompositeSliceLoader`, which calls its Slice loaders in order:

```swift
let sliceLoader = CompositeSliceLoader(NodeLoader(), DefaultSliceLoader("Demo"))
```

{% /language-section %}
