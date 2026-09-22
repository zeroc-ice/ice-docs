---
id: starting-the-icebox-server
title: Starting the IceBox Server
---

Incorporating everything we discussed previously, we can now configure and start IceBox servers.

# Starting the IceBox Server

{% language-section name="lang-1" /%}

# IceBox Server Failures

At startup, an IceBox server inspects its configuration for all properties having the prefix
[IceBox.Service](../icebox-properties) and initializes each service. If initialization fails for a service, the IceBox
server invokes the `stop` operation on any initialized services, reports an error, and terminates.

##### See Also

- [IceBox.*](../icebox-properties)
