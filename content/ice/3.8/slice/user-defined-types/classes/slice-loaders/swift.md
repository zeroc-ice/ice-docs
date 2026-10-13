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
