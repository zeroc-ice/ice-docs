---
id: dispatcher-api
language: swift
---

{% language-section name="lang-1" %}
The [Dispatcher](../terminology) abstraction corresponds to the Swift [Dispatcher protocol](https://code.zeroc.com/ice/3.8/api/swift/documentation/ice/dispatcher)

```swift
public protocol Dispatcher: Sendable {
    func dispatch(_ request: sending IncomingRequest) async throws ->
      OutgoingResponse
}
```

A dispatcher is any type that implements this protocol.
{% /language-section %}

{% language-section name="lang-2" %}
swift
{% /language-section %}
