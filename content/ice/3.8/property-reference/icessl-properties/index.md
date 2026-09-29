---
title: IceSSL.*
---

## IceSSL Property Overview

The IceSSL implementations for our supported platforms use many of the same configuration properties. However, there are
some properties that are specific to certain platforms or languages. For properties with such limitations, we list the
supported platforms or underlying SSL libraries in the synopsis and provide additional platform-specific notes if
necessary. You'll see the following platforms, languages and SSL libraries listed in the property reference:

- SChannel (C++ on Windows)
- SecureTransport (C++ on macOS and iOS)
- OpenSSL (C++ on Linux)
- Java
- .NET

A property is supported by all of the platforms above if no limitations are mentioned.

Finally, note that Ice for Swift and the Ice extensions for MATLAB, PHP, Python and Ruby use IceSSL for C++, therefore
they use the IceSSL properties for SChannel, SecureTransport or OpenSSL as appropriate for the target platform.

{% iflang langs="js" %}

{% callout type="info" title="JavaScript" %}

Ice for JavaScript does not support these IceSSL properties. Setting any of them throws `PropertyException`.

{% /callout %}

{% /iflang %}

{% iflang langs="cpp,python,ruby,php,matlab,swift" %}

## IceSSL.CAs

### Synopsis {% id="icessl.cas-synopsis" %}

`IceSSL.CAs=path` (SChannel, SecureTransport, OpenSSL)

### Description {% id="icessl.cas-description" %}

Specifies the path name of a file containing the certificates of trusted certificate authorities (CAs).

If you wish to use the CA certificates bundled with your platform, leave this property unset and enable
`IceSSL.UsePlatformCAs`.

### Platform Notes {% id="icessl.cas-platform-notes" %}

#### SChannel, SecureTransport {% id="icessl.cas-schannel-securetransport" %}

The file can be encoded using the DER or PEM formats. When using PEM, the file can contain multiple certificates. On
macOS, IceSSL loads only the CA certificates from the file.

IceSSL resolves a relative `path` under the default directory defined by `IceSSL.DefaultDir` when that property is set,
and relative to the working directory otherwise.

On iOS, IceSSL first looks for `path` in the application's resource bundle, under the `IceSSL.DefaultDir` subdirectory
when that property is set, before applying the rule above. It reads the file as PEM when its name contains `.pem`, and
as DER otherwise.

#### OpenSSL {% id="icessl.cas-openssl" %}

The file must be encoded using the PEM format and can contain multiple certificates. The `path` can also refer to a
directory prepared in advance using the OpenSSL utility `c_rehash`.

IceSSL resolves a relative `path` under the default directory defined by `IceSSL.DefaultDir` when that property is set,
and relative to the working directory otherwise.

## IceSSL.CertificateRevocationListFiles

### Synopsis {% id="icessl.certificaterevocationlistfiles-synopsis" %}

`IceSSL.CertificateRevocationListFiles=file[,file...]` (OpenSSL)

### Description {% id="icessl.certificaterevocationlistfiles-description" %}

Specifies the PEM files containing the certificate revocation lists (CRLs) that IceSSL uses for revocation checks.
Separate several files with commas or whitespace. A relative path is resolved under `IceSSL.DefaultDir` when that
property is set, and relative to the working directory otherwise.

IceSSL reads these files only when `IceSSL.RevocationCheck` is greater than zero, and then requires them: communicator
initialization fails with an `InitializationException` if a file is missing or contains no PEM-encoded CRL or
certificate. During the handshake, OpenSSL looks up the CRL of each certificate it checks in these files. If the CRL is
not there, the handshake fails.

## IceSSL.CertFile

### Synopsis {% id="icessl.certfile-synopsis" %}

`IceSSL.CertFile=file` (SecureTransport, SChannel, OpenSSL)

### Description {% id="icessl.certfile-description" %}

Specifies the file that contains the program's certificate and, unless `IceSSL.KeyFile` names a separate file, its
private key. The file name may be specified relative to the default directory defined by `IceSSL.DefaultDir`.

### Platform Notes {% id="icessl.certfile-platform-notes" %}

#### SChannel {% id="icessl.certfile-schannel" %}

The file must use the PFX (PKCS#12) format and contain the certificate and its private key, or be a PEM file containing
the certificate, with the private key in a separate PEM file named by `IceSSL.KeyFile`. If the file requires a password,
the application must supply it with `IceSSL.Password`; otherwise communicator initialization fails with an
`InitializationException`.

IceSSL resolves a relative `file` under the default directory defined by `IceSSL.DefaultDir` when that property is set,
and relative to the working directory otherwise.

#### SecureTransport {% id="icessl.certfile-securetransport" %}

The file must use the PFX (PKCS#12) format and contain the certificate and its private key. On macOS, it can instead be
a PEM file containing the certificate, with the private key in a separate PEM file named by `IceSSL.KeyFile`. If the
file requires a password, the application must supply it with `IceSSL.Password`; otherwise the import fails. On macOS,
IceSSL imports the certificate and its key into the keychain named by `IceSSL.Keychain`, or into a temporary keychain
when that property is not defined.

IceSSL resolves a relative `file` under the default directory defined by `IceSSL.DefaultDir` when that property is set,
and relative to the working directory otherwise.

On iOS, IceSSL first looks for `file` in the application's resource bundle, under the `IceSSL.DefaultDir` subdirectory
when that property is set, before applying the rule above.

#### OpenSSL {% id="icessl.certfile-openssl" %}

The file must use the PFX (PKCS#12) format and contain the certificate and its private key, or be a PEM file containing
the certificate. In the PEM case, IceSSL reads the private key from `IceSSL.KeyFile` when that property is defined, and
from the certificate file itself otherwise. If the file requires a password, the application must supply it with
`IceSSL.Password`.

IceSSL resolves a relative `file` under the default directory defined by `IceSSL.DefaultDir` when that property is set,
and relative to the working directory otherwise.

## IceSSL.CertStore

### Synopsis {% id="icessl.certstore-synopsis" %}

`IceSSL.CertStore=name` (SChannel)

### Description {% id="icessl.certstore-description" %}

Specifies the name of a certificate store to use when locating certificates via `IceSSL.FindCert`. Legal values for
`name` include `AddressBook`, `AuthRoot`, `CertificateAuthority`, `Disallowed`, `My`, `Root`, `TrustedPeople`, and
`TrustedPublisher`. You can also use an arbitrary value for `name`.

If not specified, the default value is `My`.

## IceSSL.CertStoreLocation

### Synopsis {% id="icessl.certstorelocation-synopsis" %}

`IceSSL.CertStoreLocation=CurrentUser|LocalMachine` (SChannel)

### Description {% id="icessl.certstorelocation-description" %}

This property is used for two different purposes:

- to specify the location of a certificate store to use when locating certificates via `IceSSL.FindCert`.
- to specify if certificate chain validation will use the machine context (HCCE_LOCAL_MACHINE) or the current user
  context (HCCE_CURRENT_USER).

If not specified, the default value is `CurrentUser`.

{% callout type="tip" %}

An Ice program running as a Windows service will typically need to set this property to `LocalMachine`.

{% /callout %}

{% /iflang %}

{% language-section name="lang-1" /%}

## IceSSL.CheckCertName

### Synopsis {% id="icessl.checkcertname-synopsis" %}

`IceSSL.CheckCertName=num`

### Description {% id="icessl.checkcertname-description" %}

Specifies if certificate host name verification is enabled. The legal values are shown in the table below. If this
property is not defined, the default value is 0.

| Value | Description                                                                           |
| ----- | ------------------------------------------------------------------------------------- |
| 0     | Host name verification is disabled.                                                   |
| 1     | Host name verification is enabled.                                                    |
| 2     | Host name verification is enabled. In Java, IceSSL also sends the host name with SNI. |

This property has no effect on a server's validation of a client's certificate.

If the host name verification is performed and fails, IceSSL aborts the connection attempt and raises an exception.

The verification ensures the host name matches the certificate's subject alternative names or the subject's `CommonName`
if no subject alternative names are provided. Note the following difference in behavior for this check depending on the
platform or language:

- if the endpoint uses an IP address: the SChannel, SecureTransport, OpenSSL and Java implementations only match the IP
  address against the subject alternative names, they don't check the `CommonName`
- if the endpoint uses a DNS name: SecureTransport on macOS only matches the DNS name against the subject alternative
  names, it doesn't check the `CommonName`

In Java, IceSSL verifies the host name only when `IceSSL.VerifyPeer` is greater than zero, and sends the host name to
the server through the TLS server name indication (SNI) extension only when this property is set to `2`. The C++ and
.NET implementations always send a DNS host name with SNI.

{% language-section name="lang-2" /%}

## IceSSL.DefaultDir

### Synopsis {% id="icessl.defaultdir-synopsis" %}

`IceSSL.DefaultDir=path`

### Description {% id="icessl.defaultdir-description" %}

Specifies the default directory in which to look for certificates, key stores, and other files. See the descriptions of
the relevant properties for more information.

{% iflang langs="cpp,python,ruby,php,matlab,swift" %}

## IceSSL.FindCert

### Synopsis {% id="icessl.findcert-synopsis" %}

`IceSSL.FindCert=criteria` (SChannel, SecureTransport)

### Description {% id="icessl.findcert-description" %}

Selects the program's certificate from a certificate store or keychain instead of loading it from a file. IceSSL ignores
this property when `IceSSL.CertFile` is defined.

### Platform Notes {% id="icessl.findcert-platform-notes" %}

#### SChannel {% id="icessl.findcert-schannel" %}

IceSSL queries a certificate store for matching certificates and passes all of them to SChannel, which selects the one
to present during the handshake. The settings for `IceSSL.CertStore` and `IceSSL.CertStoreLocation` determine the target
certificate store to be queried. Communicator initialization fails when no certificate matches.

The value for `criteria` may be `*`, in which case all of the certificates in the store are selected. Otherwise,
`criteria` must be one or more `field:value` pairs separated by white space. The valid field names are described below:

| Field          | Description                                       |
| -------------- | ------------------------------------------------- |
| `Issuer`       | Matches a substring of the issuer's name.         |
| `IssuerDN`     | Matches the issuer's entire distinguished name.   |
| `Serial`       | Matches the certificate's serial number.          |
| `Subject`      | Matches a substring of the subject's name.        |
| `SubjectDN`    | Matches the subject's entire distinguished name.  |
| `SubjectKeyId` | Matches the certificate's subject key identifier. |
| `Thumbprint`   | Matches the certificate's SHA1 hash.              |

The field names are case-insensitive. If multiple criteria are specified, only certificates that match all criteria are
selected. Values must be enclosed in single or double quotes to preserve white space.

#### SecureTransport {% id="icessl.findcert-securetransport" %}

IceSSL queries the keychain for a matching certificate and uses the first match. IceSSL uses the keychain identified in
`IceSSL.Keychain`, or the user's default keychain if `IceSSL.Keychain` is not defined.

The value for `criteria` must be one or more `field:value` pairs separated by white space. The valid field names are
described below:

| Field          | Description                                       |
| -------------- | ------------------------------------------------- |
| `Label`        | Matches the user-visible label.                   |
| `Serial`       | Matches the certificate's serial number.          |
| `Subject`      | Matches a substring of the subject's name.        |
| `SubjectKeyId` | Matches the certificate's subject key identifier. |

The field names are case-insensitive. If multiple criteria are specified, only certificates that match all criteria are
selected. Values must be enclosed in single or double quotes to preserve white space.

## IceSSL.Keychain

### Synopsis {% id="icessl.keychain-synopsis" %}

`IceSSL.Keychain=name` (SecureTransport)

### Description {% id="icessl.keychain-description" %}

Specifies the name of a keychain in which to import the certificate identified by `IceSSL.CertFile`. Set
`IceSSL.KeychainPassword` if the specified keychain has a password.

A relative path name is opened relative to the current working directory. If the specified keychain file does not exist,
a new file is created. If this property is not defined, IceSSL creates a private temporary keychain in the per-user
temporary directory with a random password. The temporary keychain and its enclosing directory are removed when the
communicator is destroyed.

On iOS this property is ignored, IceSSL uses the default device keychain.

## IceSSL.KeyFile

### Synopsis {% id="icessl.keyfile-synopsis" %}

`IceSSL.KeyFile=file` (SChannel, SecureTransport, OpenSSL)

### Description {% id="icessl.keyfile-description" %}

Specifies a file that contains the program's private key. The file name may be specified relative to the default
directory defined by `IceSSL.DefaultDir`. The corresponding certificate must be specified using `IceSSL.CertFile`.

## IceSSL.KeychainPassword

### Synopsis {% id="icessl.keychainpassword-synopsis" %}

`IceSSL.KeychainPassword=password` (SecureTransport)

### Description {% id="icessl.keychainpassword-description" %}

Specifies the password for the keychain identified by `IceSSL.Keychain`. If not defined, IceSSL attempts to open the
keychain without a password.

On iOS, this property is ignored.

{% /iflang %}

{% language-section name="lang-3" /%}

## IceSSL.Password

### Synopsis {% id="icessl.password-synopsis" %}

`IceSSL.Password=password`

### Description {% id="icessl.password-description" %}

Specifies the password necessary to decrypt the private key.

### Platform Notes {% id="icessl.password-platform-notes" %}

#### SChannel, SecureTransport, OpenSSL {% id="icessl.password-schannel-securetransport-openssl" %}

This property supplies the password that was used to secure the private key contained in the file defined by
`IceSSL.CertFile`.

#### Java {% id="icessl.password-java" %}

This property supplies the password that was used to secure the private key contained in the key store defined by
`IceSSL.Keystore`. All of the keys in the key store must use the same password.

#### .NET {% id="icessl.password-.net" %}

This property supplies the password that was used to secure the file defined by `IceSSL.CertFile`.

#### iOS {% id="icessl.password-ios" %}

This property supplies the password that was used to secure the file defined by `IceSSL.CertFile`.

{% iflang langs="cpp,python,ruby,php,matlab,swift" %}

## IceSSL.RevocationCheck

### Synopsis {% id="icessl.revocationcheck-synopsis" %}

`IceSSL.RevocationCheck=num` (OpenSSL, SChannel, SecureTransport)

### Description {% id="icessl.revocationcheck-description" %}

Specifies whether IceSSL checks the certificates of the peer's chain for revocation:

| Value | Description                                                 |
| ----- | ----------------------------------------------------------- |
| 0     | Revocation checks are disabled (default).                   |
| 1     | Checks the revocation status of the peer's own certificate. |
| 2     | Checks the revocation status of the whole chain.            |

IceSSL aborts the connection when it finds a revoked certificate or cannot determine the revocation status of a
certificate.

### Platform Notes {% id="icessl.revocationcheck-platform-notes" %}

#### OpenSSL {% id="icessl.revocationcheck-openssl" %}

The revocation status is looked up in the CRL files listed in `IceSSL.CertificateRevocationListFiles`, which must be set
when this property is greater than zero; otherwise communicator initialization fails. OpenSSL reports an error when it
finds no CRL for a certificate it checks, so with the value `2` the files must cover every issuer in the chain.

#### SChannel {% id="icessl.revocationcheck-schannel" %}

The value `2` checks the whole chain except the root CA certificate. Revocation data is fetched from the CRL
distribution points and OCSP responders named in the certificates, subject to `IceSSL.RevocationCheckCacheOnly`.

#### SecureTransport {% id="icessl.revocationcheck-securetransport" %}

The values `1` and `2` are equivalent: the revocation policy applies to the whole chain. See
`IceSSL.RevocationCheckCacheOnly` for the revocation sources. The value `0` only leaves out IceSSL's revocation policy:
the macOS trust evaluation still performs its own best-effort check and rejects a certificate it finds revoked.

## IceSSL.RevocationCheckCacheOnly

### Synopsis {% id="icessl.revocationcheckcacheonly-synopsis" %}

`IceSSL.RevocationCheckCacheOnly=num` (SChannel, SecureTransport)

### Description {% id="icessl.revocationcheckcacheonly-description" %}

Specifies whether revocation checks may access the network:

| Value | Description                                                                                                            |
| ----- | ---------------------------------------------------------------------------------------------------------------------- |
| 0     | Revocation checks may fetch CRLs from the distribution points and query the OCSP responders named in the certificates. |
| 1     | Revocation checks consult only the system's revocation cache (default).                                                |

With the default value, IceSSL rejects a certificate whose revocation status is not already in the system cache.

### Platform Notes {% id="icessl.revocationcheckcacheonly-platform-notes" %}

#### SChannel {% id="icessl.revocationcheckcacheonly-schannel" %}

The value `1` also disables the retrieval of intermediate certificates through the Authority Information Access
extension, so the whole chain must be available locally.

#### SecureTransport {% id="icessl.revocationcheckcacheonly-securetransport" %}

IceSSL requests any available revocation method. In practice, the macOS trust evaluation queries the OCSP responder
named in a certificate's Authority Information Access extension and does not fetch CRLs from distribution points, so
IceSSL cannot determine the revocation status of a certificate that publishes only a CRL, and rejects it.

{% /iflang %}

{% language-section name="lang-4" /%}

## IceSSL.Trace.Security

### Synopsis {% id="icessl.trace.security-synopsis" %}

`IceSSL.Trace.Security=num`

### Description {% id="icessl.trace.security-description" %}

The SSL plug-in trace level:

| Value | Description                                                                                                                                                     |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0     | No security tracing (default).                                                                                                                                  |
| 1     | Displays a summary of each SSL connection, the reason a connection is rejected, and the peer's distinguished name when an `IceSSL.TrustOnly*` property applies. |
| 2     | Additionally displays the `IceSSL.TrustOnly*` entries evaluated against the peer's distinguished name. .NET displays these at level `1`.                        |

## IceSSL.TrustOnly

### Synopsis {% id="icessl.trustonly-synopsis" %}

`IceSSL.TrustOnly=ENTRY[;ENTRY;...]`

### Description {% id="icessl.trustonly-description" %}

Identifies trusted and untrusted peers. This family of properties provides an additional level of authentication by
using the peer certificate's distinguished name (DN) to decide whether to accept or reject a connection.

IceSSL on iOS cannot read the distinguished name of a peer certificate, so any `IceSSL.TrustOnly*` entry fails every
connection it applies to with a `FeatureNotSupportedException`.

Each `ENTRY` in the property value consists of relative distinguished name (RDN) components, formatted according to the
rules in [RFC 2253](https://www.rfc-editor.org/rfc/rfc2253.txt). Specifically, the components must be separated by
commas, and any component that contains a comma must be escaped or enclosed in quotes. For example, the following two
property definitions are equivalent:

```config
IceSSL.TrustOnly=O="Acme, Inc.",OU=Sales
IceSSL.TrustOnly=O=Acme\, Inc.,OU="Sales"
```

Use a semicolon to separate multiple entries in a property:

```config
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

```config
IceSSL.TrustOnly=O=Acme\, Inc.,OU=Sales;O=Acme\, Inc.,OU=Marketing
```

If it later becomes necessary to deny access to certain individuals in these departments, you can add a rejection entry
and restart the program:

```config
IceSSL.TrustOnly=O=Acme\, Inc.,OU=Sales; O=Acme\, Inc.,OU=Marketing; !O=Acme\, Inc.,CN=John Smith
```

While testing your trust configuration, you may find it helpful to set the `IceSSL.Trace.Security` property to a
non-zero value, which causes IceSSL to display the DN of each peer during connection establishment.

This property affects incoming and outgoing connections. IceSSL also supports similar properties that affect only
incoming connections or only outgoing connections.

## IceSSL.TrustOnly.Client

### Synopsis {% id="icessl.trustonly.client-synopsis" %}

`IceSSL.TrustOnly.Client=ENTRY[;ENTRY;...]`

### Description {% id="icessl.trustonly.client-description" %}

Identifies trusted and untrusted peers for outgoing (client) connections. The entries defined in this property are
combined with those of `IceSSL.TrustOnly`.

## IceSSL.TrustOnly.Server

### Synopsis {% id="icessl.trustonly.server-synopsis" %}

`IceSSL.TrustOnly.Server=ENTRY[;ENTRY;...]`

### Description {% id="icessl.trustonly.server-description" %}

Identifies trusted and untrusted peers for incoming ("server") connections. The entries defined in this property are
combined with those of `IceSSL.TrustOnly`. To configure trusted and untrusted peers for a particular object adapter, use
`IceSSL.TrustOnly.Server.AdapterName`.

## IceSSL.TrustOnly.Server._AdapterName_

### Synopsis {% id="icessl.trustonly.server.adaptername-synopsis" %}

`IceSSL.TrustOnly.Server.AdapterName=ENTRY[;ENTRY;...]`

### Description {% id="icessl.trustonly.server.adaptername-description" %}

Identifies trusted and untrusted peers for incoming (server) connections to the object adapter `AdapterName`. The
entries defined in this property are combined with those of `IceSSL.TrustOnly` and `IceSSL.TrustOnly.Server`.

{% language-section name="lang-5" /%}

## IceSSL.UsePlatformCAs

### Synopsis {% id="icessl.useplatformcas-synopsis" %}

`IceSSL.UsePlatformCAs=num`

### Description {% id="icessl.useplatformcas-description" %}

If `num` is a value greater than zero, IceSSL uses the platform's bundled Root Certificate Authorities. This setting is
ignored if `IceSSL.CAs` is defined.

If not defined, the default value is zero.

## IceSSL.VerifyPeer

### Synopsis {% id="icessl.verifypeer-synopsis" %}

`IceSSL.VerifyPeer=num`

### Description {% id="icessl.verifypeer-description" %}

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

### Platform Notes {% id="icessl.verifypeer-platform-notes" %}

#### Java {% id="icessl.verifypeer-java" %}

With the value `0`, a client accepts a server that does not present a certificate and does not check the server's host
name (see `IceSSL.CheckCertName`). A certificate the server does present is still verified.
