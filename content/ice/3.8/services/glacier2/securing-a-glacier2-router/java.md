{% language-section name="connection-context" %}

A server can check for this entry and read the other connection entries from the request context:

```java
public void unlockDoor(String id, Current current) {
    String certPEM = current.ctx.get("_con.peerCert");
    if (certPEM != null) {
        String address = current.ctx.get("_con.remoteAddress");
        String port = current.ctx.get("_con.remotePort");
        if (address != null && port != null) {
            System.out.println("Client address = " + address + ":" + port);
        }
        ...
    }
    ...
}
```

If the client supplied a certificate, the server can decode and examine it using the techniques discussed for
[IceSSL](../../../runtime/ssl-transport).

{% /language-section %}
