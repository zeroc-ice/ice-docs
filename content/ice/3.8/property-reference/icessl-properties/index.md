---
id: icessl-properties
title: IceSSL.*
---

# IceSSL Property Overview

The IceSSL implementations for our supported platforms use many of the same configuration properties. However, there are
some properties that are specific to certain platforms or languages. For properties with such limitations, we list the
supported platforms or underlying SSL libraries in the synopsis and provide additional platform-specific notes if
necessary. You'll see the following platforms, languages and SSL libraries listed in the property reference:

- SChannel (C++ on Windows)
- SecureTransport (C++ on macOS and iOS)
- OpenSSL (C++ on Linux or Windows)
- Java
- .NET

A property is supported by all platforms if no limitations are mentioned.

Finally, note that Ice for Swift and the Ice extensions for Python, Ruby and PHP use IceSSL for C++, therefore they use
the IceSSL properties for SChannel, SecureTransport or OpenSSL as appropriate for the target platform.

{% callout type="info" title="JavaScript" %}

These IceSSL properties have no effect on JavaScript.

{% /callout %}

{% language-section name="lang-1" /%}

# IceSSL.CheckCertName

#### Synopsis

`IceSSL.CheckCertName=num`

#### Description

Specifies if certificate host name verification is enabled. The legal values are shown in the table below. If this
property is not defined, the default value is 0.

| 0   | Host name verification is disabled. |
| --- | ----------------------------------- |
| 1   | Host name verification is enabled.  |

This property has no effect on a server's validation of a client's certificate.

If the host name verification is performed and fails, IceSSL aborts the connection attempt and raises an exception.

The verification ensures the host name matches the certificate's subject alternative names or the subject's `CommonName`
if no subject alternative names are provided. Note the following difference in behavior for this check depending on the
platform or language:

- if the endpoint uses an IP address: the SecureTransport, and Java implementations only match the IP against the
  subject alternative names, they don't check the `CommonName`
- if the endpoint uses a DNS name: SecureTransport on macOS only matches the DNS name against the subject alternative
  names, it doesn't check the `CommonName`

{% language-section name="lang-2" /%}

# IceSSL.DefaultDir

#### Synopsis

`IceSSL.DefaultDir=path`

#### Description

Specifies the default directory in which to look for certificates, key stores, and other files. See the descriptions of
the relevant properties for more information.

{% language-section name="lang-3" /%}

# IceSSL.Password

#### Synopsis

`IceSSL.Password=password`

#### Description

Specifies the password necessary to decrypt the private key.

#### Platform Notes

###### SChannel, SecureTransport, OpenSSL

This property supplies the password that was used to secure the private key contained in the file defined by
`IceSSL.CertFile`.

###### Java

This property supplies the password that was used to secure the private key contained in the key store defined by
`IceSSL.Keystore`. All of the keys in the key store must use the same password.

###### .NET

This property supplies the password that was used to secure the file defined by `IceSSL.CertFile`.

###### iOS

This property supplies the password that was used to secure the file defined by `IceSSL.CertFile`.

{% language-section name="lang-4" /%}

# IceSSL.Trace.Security

#### Synopsis

`IceSSL.Trace.Security=num`

#### Description

The SSL plug-in trace level:

| 0   | No security tracing (default).                        |
| --- | ----------------------------------------------------- |
| 1   | Display diagnostic information about SSL connections. |

# IceSSL.TrustOnly

#### Synopsis

`IceSSL.TrustOnly=ENTRY[;ENTRY;...]`

#### Description

Identifies trusted and untrusted peers. This family of properties provides an additional level of authentication by
using the peer certificate's distinguished name (DN) to decide whether to accept or reject a connection.

Each `ENTRY` in the property value consists of relative distinguished name (RDN) components, formatted according to the
rules in [RFC 2253](https://www.rfc-editor.org/rfc/rfc2253.txt). Specifically, the components must be separated by
commas, and any component that contains a comma must be escaped or enclosed in quotes. For example, the following two
property definitions are equivalent:

```
IceSSL.TrustOnly=O="Acme, Inc.",OU=Sales
IceSSL.TrustOnly=O=Acme\, Inc.,OU="Sales"
```

Use a semicolon to separate multiple entries in a property:

```
IceSSL.TrustOnly=O=Acme\, Inc.,OU=Sales;O=Acme\, Inc.,OU=Marketing
```

By default, each entry represents an acceptance entry. A `!` character appearing at the beginning of an entry signifies
a rejection entry. The order of the entries in a property is not important.

After the SSL engine has successfully completed its authentication process, IceSSL evaluates the relevant
`IceSSL.TrustOnly` properties in an attempt to find an entry that matches the peer certificate's DN. For a match to be
successful, the peer DN must contain an exact match for all of the RDN components in an entry. An entry may contain as
many RDN components as you wish, depending on how narrowly you need to restrict access. The order of the RDN components
in an entry is not important.

The connection semantics are described below:

1. IceSSL aborts the connection if any rejection or acceptance entries are defined and the peer does not supply a
   certificate.
2. IceSSL aborts the connection if the peer DN matches any rejection entry. (This is true even if the peer DN also
   matches an acceptance entry.)
3. IceSSL accepts the connection if the peer DN matches any acceptance entry, or if no acceptance entries are defined.

Our original example limits access to people in the sales and marketing departments:

```
IceSSL.TrustOnly=O=Acme\, Inc.,OU=Sales;O=Acme\, Inc.,OU=Marketing
```

If it later becomes necessary to deny access to certain individuals in these departments, you can add a rejection entry
and restart the program:

```
IceSSL.TrustOnly=O=Acme\, Inc.,OU=Sales; O=Acme\, Inc.,OU=Marketing; !O=Acme\, Inc.,CN=John Smith
```

While testing your trust configuration, you may find it helpful to set the `IceSSL.Trace.Security` property to a
non-zero value, which causes IceSSL to display the DN of each peer during connection establishment.

This property affects incoming and outgoing connections. IceSSL also supports similar properties that affect only
incoming connections or only outgoing connections.

# IceSSL.TrustOnly.Client

#### Synopsis

`IceSSL.TrustOnly.Client=ENTRY[;ENTRY;...]`

#### Description

Identifies trusted and untrusted peers for outgoing (client) connections. The entries defined in this property are
combined with those of `IceSSL.TrustOnly`.

# IceSSL.TrustOnly.Server

#### Synopsis

`IceSSL.TrustOnly.Server=ENTRY[;ENTRY;...]`

#### Description

Identifies trusted and untrusted peers for incoming ("server") connections. The entries defined in this property are
combined with those of `IceSSL.TrustOnly`. To configure trusted and untrusted peers for a particular object adapter, use
`IceSSL.TrustOnly.Server.AdapterName`.

# IceSSL.TrustOnly.Server._AdapterName_

#### Synopsis

`IceSSL.TrustOnly.Server.AdapterName=ENTRY[;ENTRY;...]`

#### Description

Identifies trusted and untrusted peers for incoming (server) connections to the object adapter `AdapterName`. The
entries defined in this property are combined with those of `IceSSL.TrustOnly` and `IceSSL.TrustOnly.Server`.

{% language-section name="lang-5" /%}

# IceSSL.UsePlatformCAs

#### Synopsis

`IceSSL.UsePlatformCAs=num`

#### Description

If `num` is a value greater than zero, IceSSL uses the platform's bundled Root Certificate Authorities. This setting is
ignored if `IceSSL.CAs` is defined.

If not defined, the default value is zero.

# IceSSL.VerifyPeer

#### Synopsis

`IceSSL.VerifyPeer=num`

#### Description

Specifies whether an object adapter accepting an incoming connection requests a certificate from the client, and whether
the client must supply one. The legal values are shown in the table below; any other value causes communicator
initialization to fail with an `InitializationException`. If this property is not defined, the default value is `2`.

| Value | Description                                                                                                                                                                                    |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0     | The server does not request a certificate from the client.                                                                                                                                     |
| 1     | The server requests a certificate from the client and accepts a client that supplies none. If the client supplies one, the server verifies it and aborts the connection if verification fails. |
| 2     | The server requires a certificate from the client and aborts the connection if the client supplies none or if verification fails.                                                              |

This property has no effect on outgoing connections (except in Java, see below): a client always requires and verifies
the server's certificate.

#### Platform Notes

###### Java

With the value `0`, a client accepts a server that does not present a certificate and does not check the server's host
name (see `IceSSL.CheckCertName`). A certificate the server does present is still verified.
