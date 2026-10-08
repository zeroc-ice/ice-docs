{% language-section name="connection-context" %}

A server can check for this entry and read the other connection entries from the request context:

```swift
func unlockDoor(id: String, current: Ice.Current) throws {
    if let certPEM = current.ctx["_con.peerCert"] {
        if let address = current.ctx["_con.remoteAddress"], let port = current.ctx["_con.remotePort"] {
            print("Client address = \(address):\(port)")
        }
        ...
    }
    ...
}
```

If the client supplied a certificate, the server can decode and examine it using the techniques discussed for
[IceSSL](../../../runtime/ssl-transport).

{% /language-section %}
