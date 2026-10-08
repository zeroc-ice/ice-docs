{% language-section name="connection-context" %}

A server can check for this entry and read the other connection entries from the request context:

```python
def unlockDoor(self, id: str, current: Ice.Current) -> None:
    certPEM = current.ctx.get("_con.peerCert")
    if certPEM is not None:
        address = current.ctx.get("_con.remoteAddress")
        port = current.ctx.get("_con.remotePort")
        if address is not None and port is not None:
            print(f"Client address = {address}:{port}")
        ...
    ...
```

If the client supplied a certificate, the server can decode and examine it using the techniques discussed for
[IceSSL](../../../runtime/ssl-transport).

{% /language-section %}
