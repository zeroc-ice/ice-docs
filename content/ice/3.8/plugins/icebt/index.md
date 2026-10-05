---
title: IceBT
---

IceBT is a transport plug-in that allows clients and servers to communicate via Bluetooth RFCOMM connections on Android
and Linux platforms.

## IceBT Overview

IceBT is an [Ice plug-in](../plug-in-facility) that must be installed in the clients and servers that need to
communicate over Bluetooth. This section reviews some concepts that will help you as you learn more about IceBT.

### Service Discovery

The Bluetooth specification defines a standard mechanism for discovering services called the Service Discovery Protocol
(SDP). It's a flexible but complex specification that accommodates a wide range of Bluetooth device functionality and
requirements. Fortunately, Ice users only need a passing familiarity with SDP.

The operating system's Bluetooth stack implements an SDP service that provides two basic functions: query and
registration. IceBT considers each object adapter endpoint in an Ice server to be a service and adds a corresponding
entry for it in the local SDP registry. This entry associates a UUID with a human-friendly name and an RFCOMM channel.
For example, an entry might contain:

```text {% title="SDP Entry" %}
Name: My Bluetooth Service
UUID: 1c6a142a-aae6-4d58-bef8-33196f531da7
RFCOMM: Channel #8
```

The SDP entry automatically expires when its service terminates.

An Ice client requires two values to connect to a server:

1. The server's Bluetooth device address (such as `01:23:45:67:89:AB`)
2. The UUID of the desired service

To establish a connection, the client first queries the SDP service on the server device for an entry matching the
target UUID. If a match is found, the SDP service returns the server's current RFCOMM channel, and the client open a
connection to that channel.

IceBT takes care of all of this for you during server initialization and connection establishment.

### Device Discovery

When developing a client application, you'll normally hard-code the UUIDs of the remote services that your client
requires because those UUIDs must match the ones advertised by your servers. However, in addition to a UUID, a client
also needs to know the device address on which a service is running. Typically the client will use the system's
Bluetooth API to initiate device discovery and present the results to the user. We discuss this further in the "Using
IceBT" section below.

## Installing IceBT

The IceBT plug-in must be installed in every client and server that needs to communicate via Bluetooth.

{% language-section name="installing-icebt" /%}

## Configuring IceBT

The IceBT plug-in provides a number of [configuration properties](../../property-reference/icebt-properties), including
settings to modify the size of the send and receive buffers for a connection. The default settings should be sufficient
for most applications.

Developers should also be aware of some core Ice properties that can affect Bluetooth connections:

- Default device address – If you omit a device address from an object adapter endpoint or proxy endpoint, the plug-in
  defaults to the address specified by the property [Ice.Default.Host](../../property-reference/ice-default-properties).
- Connect timeout – Establishing a Bluetooth connection can take several seconds to complete. Ice's default timeout
  settings give plenty of time for a connection to succeed, but an application could experience problems if it
  configures custom timeouts that are too small for Bluetooth connections.

## Using IceBT

This section describes how to incorporate IceBT into your Ice applications.

### Object Adapter Endpoints

A Bluetooth "service" corresponds to an Ice endpoint, and each endpoint requires its own UUID.

{% callout type="warning" %}

On Linux, you can use the `uuidgen` command to generate new UUIDs. Web-based UUID generators are also available.

{% /callout %}

For example, using the [syntax for Bluetooth endpoints](../../runtime/endpoint-syntax), you can configure an
[object adapter](../../runtime/dispatch) named `GreeterAdapter` as follows:

```config
GreeterAdapter.Endpoints=bt -u 4f140cef-d75e-4c93-b4e4-20ac111d36d1 --name "Greeter Service"
```

We're associating the UUID `4f140cef-d75e-4c93-b4e4-20ac111d36d1` with our service. At runtime, this service will be
advertised in the Service Discovery Protocol (SDP) registry along with the descriptive name `Greeter Service`. We
omitted a device address, so the plug-in will listen on the host's default Bluetooth adapter. We also did not specify a
particular RFCOMM channel (using the `-c` option) and therefore the plug-in will automatically select an available
channel.

If you omit the `-u UUID` option from the object adapter's endpoint, the plug-in will automatically generate a random
UUID for use in the SDP registry. Note however that your clients will still need some way of discovering this UUID.
Generally speaking, you should generate and use your own well-known UUIDs instead.

{% callout type="warning" %}

On Linux, use the `sdptool` command to view the contents of the SDP registry on a device:

```shell
sdptool browse local
sdptool browse 01:23:45:67:89:AB
```

The first command displays the active services of the local host, and the second command shows the active services of a
remote device.

{% /callout %}

### Proxy Endpoints

A Bluetooth endpoint in a proxy must include a UUID and a device address:

```cpp
GreeterPrx greeter{
  communicator,
  "greeter:bt -u 4f140cef-d75e-4c93-b4e4-20ac111d36d1 -a \"01:23:45:67:89:AB\""};
```

{% language-section name="using-icebt-1" /%}

The UUID specified with the `-u` option must match the one you assigned to your object adapter endpoint.

Notice that the device address given by the `-a` option is enclosed in quotes; this is necessary because colon (`:`)
characters are used as separators in stringified proxies.

{% callout type="warning" %}

You can omit a device address if you define [Ice.Default.Host](../../property-reference/ice-default-properties).

{% /callout %}

Refer to [Proxy and Endpoint Syntax](../../runtime/endpoint-syntax) for complete details on the format of a Bluetooth
endpoint.

Applications are responsible for determining the Bluetooth address of the device hosting the target service, as
described in the next section.

### Implementing Discovery

Device discovery is a platform-specific activity that applications are responsible for implementing.

{% language-section name="using-icebt-2" /%}

### Connection Limitations

Be aware of the following limitation when using IceBT:

- An application cannot open multiple Bluetooth connections to the same remote endpoint. This is not a limitation in Ice
  but rather in the Bluetooth stack. Normally this limitation won't impact your application because Ice's default
  behavior is to [reuse an existing connection](../../runtime/connection-management/connection-establishment) to an
  endpoint whenever possible in preference to opening a new connection. However, some application designs may attach
  additional semantics to a connection, and use Ice APIs to override the default behavior and force the establishment of
  new connections to the same endpoint. This strategy will not work when using Bluetooth.

## Security Notes for IceBT

The Bluetooth stack performs its own encryption of transmitted data using keys generated during the pairing process. Two
devices must already be paired before Ice applications on those devices can communicate with one another. IceBT does not
implement or provide an API for pairing; rather, this is something that is normally done at the user level. However,
it's possible that an Ice connection attempt will _initiate_ a pairing process that the user must then complete.

Android provides two APIs for establishing a connection: a secure version and an insecure version. The difference
between the two lies in the pairing behavior, where the secure version causes the system to prompt the user (if
necessary) and the insecure version does not. IceBT always uses the secure API.

For added security, you can use SSL over Bluetooth with the transport protocol named `bts`. You can use the usual the
SSL configuration with `bts` to define your security settings.

## See Also

- [IceBT.*](../../property-reference/icebt-properties)
- [Plug-in Facility](../plug-in-facility)
- [Proxy and Endpoint Syntax](../../runtime/endpoint-syntax)
