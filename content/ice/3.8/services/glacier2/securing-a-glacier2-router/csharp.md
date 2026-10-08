{% language-section name="connection-context" %}

A server can check for this entry and read the other connection entries from the request context:

```csharp
public override void UnlockDoor(string id, Ice.Current current)
{
    if (current.ctx.TryGetValue("_con.peerCert", out string? certPEM))
    {
        if (current.ctx.TryGetValue("_con.remoteAddress", out string? address) &&
            current.ctx.TryGetValue("_con.remotePort", out string? port))
        {
            Console.WriteLine($"Client address = {address}:{port}");
        }
        ...
    }
    ...
}
```

If the client supplied a certificate, the server can decode and examine it using the techniques discussed for
[IceSSL](../../../runtime/ssl-transport).

{% /language-section %}
