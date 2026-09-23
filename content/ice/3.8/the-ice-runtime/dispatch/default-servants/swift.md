{% language-section name="lang-1" %}

```swift
public protocol ObjectAdapter: AnyObject, Sendable {
    ...

    func addDefaultServant(servant: Dispatcher, category: String) throws

    @discardableResult
    func removeDefaultServant(_ category: String) throws -> Dispatcher
}
```

{% /language-section %}
