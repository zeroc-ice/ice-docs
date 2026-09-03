---
id: ice-connection-properties
title: Ice.Connection.*
---

The properties described on this page configure connections.

The outgoing connections created by a communicator are configured using `Ice.Connection.Client.*` properties, while the incoming connections accepted by an object adapter are configured using [adapter.Connection.*](../object-adapter-properties) properties. The `adapter.Connection.*` properties default to `Ice.Connection.Server.*` properties.

In the property descriptions below, replace `name` with `Client` or `Server`.

{% callout type="info" %}
These properties apply only to connections over connection-oriented transports such a TCP. They have no effect on UDP “connections”.
{% /callout %}

# Ice.Connection.*name*.CloseTimeout

#### Synopsis

`Ice.Connection.name.CloseTimeout=num` (in seconds)

#### Description

A graceful connection closure transitions to connection abort if it takes more than `num` seconds to complete.

Setting `num` to `0` or less disables this timeout entirely.

The default close timeout is `10` seconds.

# Ice.Connection.*name*.ConnectTimeout

#### Synopsis

`Ice.Connection.name.ConnectTimeout=num` (in seconds)

#### Description

A connection establishment fails if it takes more than `num` seconds to complete.

Setting `num` to `0` or less disables this timeout entirely.

The default connect timeout is `10` seconds.

# Ice.Connection.*name*.EnableIdleCheck

#### Synopsis

`Ice.Connection.name.EnableIdleCheck=num`

#### Description

When `num` is greater than `0`, the communicator or object adapter performs the connection idle check described in [Ice.Connection.name.IdleTimeout](../ice-connection-properties#ice.connection.name.idletimeout). Otherwise, no idle check is performed.

The default value for `num` is `1`.

# Ice.Connection.*name*.IdleTimeout

#### Synopsis

`Ice.Connection.name.IdleTimeout=num` (in seconds)

#### Description

Once a connection is established, this connection is considered healthy as long as it does not wait for more than `num` seconds to read a byte. If a connection waits for more than `num` seconds to read a byte, it's deemed idle and aborted when the idle check is enabled (see [Ice.Connection.name.EnableIdleCheck](../ice-connection-properties#ice.connection.name.enableidlecheck)).

Idle is never a good state. To prevent connections from becoming idle and getting aborted by the idle check, Ice generates regular write activity on established connections: if there is no write on a connection for `num / 2` seconds, Ice sends a heartbeat on this connection. A heartbeat is a oneway, unacknowledged, `ValidateConnection` message.

Setting `num` to `0` or less disables the idle check and the sending of heartbeats. This is not a recommended configuration.

The default idle timeout is `60` seconds.

{% callout type="info" %}
We recommend you use the same idle timeout for all clients and servers in your application. The default value (60 seconds) should be appropriate for most applications.
{% /callout %}

# Ice.Connection.*name*.InactivityTimeout

#### Synopsis

`Ice.Connection.name.InactivityTimeout=num` (in seconds)

#### Description

A connection is considered inactive when there is no application-level activity on this connection: there is no outstanding invocation (we're not waiting for a response to a request we've sent), there is no outstanding dispatch, and no request or response is being sent or received. Sending or receiving a heartbeat does not count as application-level activity. When a connection remains inactive for more than `num` seconds, this connection is closed gracefully.

Inactive is a good state: the connection is healthy but unused, so the communicator or object adapter shuts it down to reclaim resources.

Setting `num` to `0` or less disables the timeout entirely.

The default inactivity timeout is `300` seconds.

{% callout type="warning" %}
Make sure your inactivity timeout is greater than your idle timeout, as the implementation of the inactivity timeout relies on a smaller idle timeout value. If you disable the idle timeout by setting it to 0 or very large value (not something we recommend), you will effectively disable the inactivity timeout as well.
{% /callout %}

{% language-section name="lang-1" /%}
