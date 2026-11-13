---
title: IceBT
languages:
  - cpp
  - java
  - matlab
  - php
  - python
  - ruby
---

IceBT is a transport plug-in that allows clients and servers to communicate over Bluetooth RFCOMM connections. Ice
provides IceBT for C++ on Linux and for Java on Android. On Linux, Python, Ruby, PHP and MATLAB applications can also
load the IceBT shared library.

## Installing IceBT

Install the IceBT [plug-in](../plug-in-facility) in every client and server that communicates over Bluetooth.

{% language-section name="installing-icebt" /%}

## Bluetooth Services

IceBT registers each Bluetooth endpoint of an object adapter as a service with the Bluetooth Service Discovery Protocol
(SDP) of the server's device: the service has the endpoint's UUID and name, and the RFCOMM channel on which the object
adapter listens. A client needs the Bluetooth address of the server's device and the UUID of the service: IceBT queries
the SDP service of this device for the UUID, and connects to the RFCOMM channel it returns.

## Object Adapter Endpoints

For example, using the [syntax for Bluetooth endpoints](../../runtime/endpoint-syntax), you can configure an
[object adapter](../../runtime/dispatch) named `GreeterAdapter` as follows:

```config
GreeterAdapter.Endpoints=bt -u 4f140cef-d75e-4c93-b4e4-20ac111d36d1 --name "Greeter Service"
```

IceBT advertises this service with the UUID `4f140cef-d75e-4c93-b4e4-20ac111d36d1` and the name `Greeter Service`.
Generate your own UUID for each service and use the same UUID in your clients' proxies: without the `-u` option, IceBT
generates a random UUID. Without the `-a` option, the object adapter listens on the Bluetooth adapter given by
[Ice.Default.Host](../../property-reference/ice-default-properties#ice.default.host), or on the host's default Bluetooth
adapter when this property is not set. Without the `-c` option, IceBT selects an available RFCOMM channel.

## Proxy Endpoints

A Bluetooth endpoint in a proxy holds the UUID of the service and the Bluetooth address of the server's device:

```text
greeter:bt -u 4f140cef-d75e-4c93-b4e4-20ac111d36d1 -a "01:23:45:67:89:AB"
```

{% language-section name="using-icebt-1" /%}

Enclose the address in quotes: stringified proxies use the colon (`:`) as a separator. You can omit the `-a` option when
you set [Ice.Default.Host](../../property-reference/ice-default-properties#ice.default.host).

## Discovering Devices

Applications find the Bluetooth address of the server's device with the platform's Bluetooth API. On Linux, the
Bluetooth service must know the target device before IceBT can connect to it: discover or pair the device first.

{% language-section name="using-icebt-2" /%}

## Configuring IceBT

The [IceBT properties](../../property-reference/icebt-properties) include the sizes of a connection's send and receive
buffers; the defaults suit most applications. Establishing a Bluetooth connection can take several seconds, so keep this
in mind if you lower the connect timeout.

An application cannot open more than one Bluetooth connection to the same remote endpoint. Ice
[reuses an existing connection](../../runtime/connection-management/connection-establishment) to an endpoint by default;
an application that forces Ice to open new connections to the same endpoint cannot use Bluetooth.

## Security Notes for IceBT

The operating system manages Bluetooth pairing. IceBT uses the platform's Bluetooth connection APIs; applications manage
pairing through the operating system's facilities.

On Android, IceBT uses the secure RFCOMM APIs. Android can prompt the user to complete pairing while establishing a
connection. See
[Android's Bluetooth connection guide](https://developer.android.com/develop/connectivity/bluetooth/connect-bluetooth-devices).

For TLS over Bluetooth, use `bts` endpoints and the [SSL configuration](../../runtime/ssl-transport) for your language
mapping. IceBT installs both the `bt` and `bts` endpoint types.

## See Also

- [IceBT.*](../../property-reference/icebt-properties)
- [Plug-in Facility](../plug-in-facility)
- [Proxy and Endpoint Syntax](../../runtime/endpoint-syntax)
