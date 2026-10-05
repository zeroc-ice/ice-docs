{% language-section name="mapping" %}

```swift
@discardableResult
func add(servant: Dispatcher, id: Identity) throws -> ObjectPrx

@discardableResult
func addWithUUID(_ servant: Dispatcher) throws -> ObjectPrx

@discardableResult
func remove(_ id: Identity) throws -> Dispatcher
```

{% /language-section %}
