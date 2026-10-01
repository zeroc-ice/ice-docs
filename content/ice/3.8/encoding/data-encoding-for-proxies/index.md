---
title: Data Encoding for Proxies
---

## Encoding for Proxy Options

The encoding format of proxies changed in version 1.1.

### Proxy Encoding Version 1.0

The first component of an encoded proxy is a value of type `Ice::Identity`. If the proxy is a nil value, the `category`
and `name` members are empty strings, and no additional data is encoded. The encoding for a non-null proxy consists of
proxy options followed by endpoints.

The proxy options are encoded as if they were members of the following structure:

```slice
struct ProxyData
{
    Ice::Identity id;
    Ice::StringSeq facet;
    byte mode;
    bool secure;
}
```

The proxy options are described in the table below:

| **Option** | **Description**                                                                             |
| ---------- | ------------------------------------------------------------------------------------------- |
| `id`       | The [object identity](../object-identity)                                                   |
| `facet`    | The [facet](../versioning) name (zero- or one-element sequence)                             |
| `mode`     | The proxy mode (`0`=twoway, `1`=oneway, `2`=batch oneway, `3`=datagram, `4`=batch datagram) |
| `secure`   | Ignored. Kept for backwards compatibility.                                                  |

The `facet` field has either zero elements or one element. An empty sequence denotes the default facet, and a
one-element sequence provides the facet name in its first member. If a receiver receives a proxy with a `facet` field
with more than one element, it must throw a `ProxyUnmarshalException`.

### Proxy Encoding Version 1.1

Version 1.1 of the encoding adds two options to the existing proxy options in version 1.0: protocol and encoding
versions. The proxy options are encoded as if they were members of the following structure:

```slice
struct ProtocolVersion
{
    byte major;
    byte minor;
}

struct EncodingVersion
{
    byte major;
    byte minor;
}
struct ProxyData
{
    Ice::Identity id;
    Ice::StringSeq facet;
    byte mode;
    bool secure;
    ProtocolVersion protocol;
    EncodingVersion encoding;
}
```

The additional options are described in the table below:

| **Option** | **Description**                                                                           |
| ---------- | ----------------------------------------------------------------------------------------- |
| `protocol` | The maximum protocol version supported by the server. Currently this value is always 1.0. |
| `encoding` | The maximum encoding version supported by the server.                                     |

The encoding for [UDP endpoints](../data-encoding-for-proxies) also changed in version 1.1.

## Encoding for Endpoints

A proxy optionally contains an [endpoint list or an adapter identifier](../proxy-endpoints), but not both:

- If a proxy contains endpoints, they are encoded immediately following the proxy options. A
  [size](../basic-data-encoding) specifying the number of endpoints is encoded first, followed by the endpoints. Each
  endpoint is encoded as a `short` specifying the
  [endpoint type](https://code.zeroc.com/ice/3.8/api/slice/namespaceIce.html#var-members), followed by an
  [encapsulation](../basic-data-encoding) of type-specific endpoint options. The type-specific options for each endpoint
  type are presented in the sections that follow.
- If a proxy does not have endpoints, a single byte with value `0` immediately follows the proxy options and a string
  representing the object adapter identifier is encoded immediately following the zero byte.
- For a proxy to a [well-known object](../well-known-objects), which has neither endpoints nor an object adapter
  identifier, a single byte with value `0` immediately follows the proxy options and an empty string is encoded
  immediately following the zero byte.

Type-specific endpoint options are encapsulated because a receiver may not be capable of decoding them. For example, a
receiver can only decode BT endpoint options if it is configured with the [IceBT](../icebt) plug-in. However, the
receiver must be able to re-encode the proxy with all of its original endpoints, in the order they were received, even
if the receiver does not understand the type-specific options for an endpoint. Encapsulation of the endpoint into an
opaque endpoint allows the receiver to do this.

## Encoding for TCP Endpoints

A TCP endpoint is encoded as an encapsulation containing the following structure:

```slice
struct TCPEndpointData
{
    string host;
    int port;
    int timeout;
    bool compress;
}
```

The endpoint options are described in the following table.

| **Option** | **Description**                                                                                                          |
| ---------- | ------------------------------------------------------------------------------------------------------------------------ |
| `host`     | The server host (a host name or IP address)                                                                              |
| `port`     | The server port (`1`-`65535`)                                                                                            |
| `timeout`  | The timeout in milliseconds for socket operations. This field is no longer used but is kept for backwards compatibility. |
| `compress` | `true` if [compression](../protocol-compression) should be used (if possible), otherwise `false`                         |

## Encoding for UDP Endpoints

The encoding format of UDP endpoints changed in version 1.1.

### UDP Endpoint Encoding Version 1.0

A UDP endpoint is encoded as an encapsulation containing the following structure:

```slice
struct UDPEndpointData
{
    string host;
    int port;
    byte protocolMajor;
    byte protocolMinor;
    byte encodingMajor;
    byte encodingMinor;
    bool compress;
}
```

The endpoint options are described in the following table.

| **Option**      | **Description**                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------ |
| `host`          | The server host (a host name or IP address)                                                      |
| `port`          | The server port (`1`-`65535`)                                                                    |
| `protocolMajor` | The major protocol version supported by the endpoint                                             |
| `protocolMinor` | The highest minor protocol version supported by the endpoint                                     |
| `encodingMajor` | The major encoding version supported by the endpoint                                             |
| `encodingMinor` | The highest minor encoding version supported by the endpoint                                     |
| `compress`      | `true` if [compression](../protocol-compression) should be used (if possible), otherwise `false` |

### UDP Endpoint Encoding Version 1.1

Version 1.1 of the encoding omits the protocol and encoding versions because these options are handled as proxy options
instead:

```slice
struct UDPEndpointData
{
    string host;
    int port;
    bool compress;
}
```

The endpoint options are described in the following table.

| **Option** | **Description**                                                                                  |
| ---------- | ------------------------------------------------------------------------------------------------ |
| `host`     | The server host (a host name or IP address)                                                      |
| `port`     | The server port (`1`-`65535`)                                                                    |
| `compress` | `true` if [compression](../protocol-compression) should be used (if possible), otherwise `false` |

## Encoding for SSL Endpoints

An SSL endpoint is encoded as an encapsulation containing the following structure:

```slice
struct SSLEndpointData
{
    string host;
    int port;
    int timeout;
    bool compress;
}
```

The endpoint options are described in the following table.

| **Option** | **Description**                                                                                                          |
| ---------- | ------------------------------------------------------------------------------------------------------------------------ |
| `host`     | The server host (a host name or IP address)                                                                              |
| `port`     | The server port (`1`-`65535`)                                                                                            |
| `timeout`  | The timeout in milliseconds for socket operations. This field is no longer used but is kept for backwards compatibility. |
| `compress` | `true` if [compression](../protocol-compression) should be used (if possible), otherwise `false`                         |

## Encoding for WS Endpoints

A WebSocket endpoint is encoded as an encapsulation containing the following structure:

```slice
struct WSEndpointData
{
    string host;
    int port;
    int timeout;
    bool compress;
    string resource;
}
```

The endpoint options are described in the following table.

| **Option** | **Description**                                                                                                          |
| ---------- | ------------------------------------------------------------------------------------------------------------------------ |
| `host`     | The server host (a host name or IP address)                                                                              |
| `port`     | The server port (`1`-`65535`)                                                                                            |
| `timeout`  | The timeout in milliseconds for socket operations. This field is no longer used but is kept for backwards compatibility. |
| `compress` | `true` if [compression](../protocol-compression) should be used (if possible), otherwise `false`                         |
| `resource` | A URI representing the web server resource associated with this endpoint                                                 |

## Encoding for WSS Endpoints

A secure WebSocket endpoint is encoded as an encapsulation containing the following structure:

```slice
struct WSSEndpointData
{
    string host;
    int port;
    int timeout;
    bool compress;
    string resource;
}
```

The endpoint options are described in the following table.

| **Option** | **Description**                                                                                                          |
| ---------- | ------------------------------------------------------------------------------------------------------------------------ |
| `host`     | The server host (a host name or IP address)                                                                              |
| `port`     | The server port (`1`-`65535`)                                                                                            |
| `timeout`  | The timeout in milliseconds for socket operations. This field is no longer used but is kept for backwards compatibility. |
| `compress` | `true` if [compression](../protocol-compression) should be used (if possible), otherwise `false`                         |
| `resource` | A URI representing the web server resource associated with this endpoint                                                 |

## Encoding for BT Endpoints

A Bluetooth endpoint is encoded as an encapsulation containing the following structure:

```slice
struct BTEndpointData
{
    string addr;
    string uuid;
    int timeout;
    bool compress;
}
```

The endpoint options are described in the following table.

| **Option** | **Description**                                                                                                          |
| ---------- | ------------------------------------------------------------------------------------------------------------------------ |
| `addr`     | The Bluetooth address of the server                                                                                      |
| `uuid`     | The UUID of the target service                                                                                           |
| `timeout`  | The timeout in milliseconds for socket operations. This field is no longer used but is kept for backwards compatibility. |
| `compress` | `true` if [compression](../protocol-compression) should be used (if possible), otherwise `false`                         |

## Encoding for BTS Endpoints

A secure Bluetooth endpoint is encoded as an encapsulation containing the following structure:

```slice
struct BTSEndpointData
{
    string addr;
    string uuid;
    int timeout;
    bool compress;
}
```

The endpoint options are described in the following table.

| **Option** | **Description**                                                                                                          |
| ---------- | ------------------------------------------------------------------------------------------------------------------------ |
| `addr`     | The Bluetooth address of the server                                                                                      |
| `uuid`     | The UUID of the target service                                                                                           |
| `timeout`  | The timeout in milliseconds for socket operations. This field is no longer used but is kept for backwards compatibility. |
| `compress` | `true` if [compression](../protocol-compression) should be used (if possible), otherwise `false`                         |

## Encoding for iAP Endpoints

An iAP endpoint is encoded as an encapsulation containing the following structure:

```slice
struct IAPEndpointData
{
    string manufacturer;
    string modelNumber;
    string name;
    string protocol;
    int timeout;
    bool compress;
}
```

The endpoint options are described in the following table.

| **Option**     | **Description**                                                                                                          |
| -------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `manufacturer` | The accessory manufacturer                                                                                               |
| `modelNumber`  | The accessory model number                                                                                               |
| `name`         | The accessory name                                                                                                       |
| `protocol`     | The protocol implemented by the accessory                                                                                |
| `timeout`      | The timeout in milliseconds for socket operations. This field is no longer used but is kept for backwards compatibility. |
| `compress`     | `true` if [compression](../protocol-compression) should be used (if possible), otherwise `false`                         |

## Encoding for iAPS Endpoints

A secure iAP endpoint is encoded as an encapsulation containing the following structure:

```slice
struct IAPSEndpointData
{
    string manufacturer;
    string modelNumber;
    string name;
    string protocol;
    int timeout;
    bool compress;
}
```

The endpoint options are described in the following table.

| **Option**     | **Description**                                                                                                          |
| -------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `manufacturer` | The accessory manufacturer                                                                                               |
| `modelNumber`  | The accessory model number                                                                                               |
| `name`         | The accessory name                                                                                                       |
| `protocol`     | The protocol implemented by the accessory                                                                                |
| `timeout`      | The timeout in milliseconds for socket operations. This field is no longer used but is kept for backwards compatibility. |
| `compress`     | `true` if [compression](../protocol-compression) should be used (if possible), otherwise `false`                         |
