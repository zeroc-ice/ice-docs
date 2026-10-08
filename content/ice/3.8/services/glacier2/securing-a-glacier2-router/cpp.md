{% language-section name="connection-context" %}

A server can check for this entry and read the other connection entries from the request context:

```cpp
void unlockDoor(string id, const Ice::Current& current) override
{
    auto p = current.ctx.find("_con.peerCert");
    if (p != current.ctx.end())
    {
        string certPEM = p->second;
        auto address = current.ctx.find("_con.remoteAddress");
        auto port = current.ctx.find("_con.remotePort");
        if (address != current.ctx.end() && port != current.ctx.end())
        {
            cout << "Client address = " << address->second << ":" << port->second << endl;
        }
        ...
    }
    ...
}
```

If the client supplied a certificate, the server can decode and examine it using the techniques discussed for
[IceSSL](../../../runtime/ssl-transport).

{% /language-section %}
