---
id: icessl-properties
language: csharp
---

{% language-section name="lang-1" %}

# IceSSL.CAs

#### Synopsis

`IceSSL.CAs=path` (.NET)

#### Description

Specifies the path name of a file containing the certificates of trusted certificate authorities (CAs). The file can be
encoded using the DER or PEM formats. When using PEM, the file can contain multiple certificates.

IceSSL attempts to locate `path` as specified; if the given path is relative but does not exist, IceSSL also attempts to
locate `path` relative to the default directory defined by `IceSSL.DefaultDir`.

If you wish to use the CA certificates bundled with your platform, leave this property unset and enable
`IceSSL.UsePlatformCAs`.

# IceSSL.CertFile

#### Synopsis

`IceSSL.CertFile=file` (.NET)

#### Description

Specifies a file that contains the program's certificate and the corresponding private key. The file must use the PFX
(PKCS#12) format. If a password is required to load the file, the application must supply the password using
`IceSSL.Password`.

IceSSL attempts to locate `file` as specified; if the given path is relative but does not exist, IceSSL also attempts to
locate `file` relative to the default directory defined by `IceSSL.DefaultDir`.

IceSSL imports the private key into the machine key set when `IceSSL.CertStoreLocation` is `LocalMachine`, and into the
user key set otherwise.

# IceSSL.CertStore

#### Synopsis

`IceSSL.CertStore=name` (.NET)

#### Description

Specifies the name of a certificate store to use when locating certificates via `IceSSL.FindCert`. Legal values for
`name` include `AddressBook`, `AuthRoot`, `CertificateAuthority`, `Disallowed`, `My`, `Root`, `TrustedPeople`, and
`TrustedPublisher`. You can also use an arbitrary value for `name`.

If not specified, the default value is `My`.

# IceSSL.CertStoreLocation

#### Synopsis

`IceSSL.CertStoreLocation=CurrentUser|LocalMachine` (.NET)

#### Description

Specifies the location of the certificate store to use when locating certificates via `IceSSL.FindCert`. The location
also selects the key set into which IceSSL imports the private key of the certificate loaded from `IceSSL.CertFile`: the
machine key set for `LocalMachine` and the user key set for `CurrentUser`.

If not specified, the default value is `CurrentUser`.

{% callout type="tip" %}

An Ice program running as a Windows service will typically need to set this property to `LocalMachine`.

{% /callout %}

{% /language-section %}

{% language-section name="lang-2" %}

# IceSSL.CheckCRL

#### Synopsis

`IceSSL.CheckCRL=num` (.NET)

#### Description

If `num` is a value greater than zero, IceSSL checks the certificate revocation list (CRL) to determine if the peer's
certificate has been revoked. The value for _num_ determines the resulting behavior:

| 0   | Disables CRL checking.                                                                                                                                                                                 |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | If a certificate is revoked, IceSSL aborts the connection, logs a message and raises an exception. If a certificate's revocation status is unknown, IceSSL logs a message but accepts the certificate. |
| 2   | If a certificate is revoked or its revocation status is unknown, IceSSL aborts the connection, logs a message and raises an exception.                                                                 |

The `IceSSL.Trace.Security` property must be set to a non-zero value to see CRL-related log messages. If
`IceSSL.CheckCRL` is not defined, the default value is zero.

{% /language-section %}

{% language-section name="lang-3" %}

# IceSSL.FindCert

#### Synopsis

`IceSSL.FindCert=criteria` (.NET)

#### Description

Builds a collection of certificates that will be used for authentication. IceSSL ignores this property when
`IceSSL.CertFile` is defined.

IceSSL queries a certificate store for matching certificates and adds them to the application's certificate collection.
The settings for `IceSSL.CertStore` and `IceSSL.CertStoreLocation` determine the target certificate store to be queried.
A server requires a certificate for authentication purposes, therefore IceSSL selects the first certificate in the
collection.

The value for `criteria` may be `*`, in which case all of the certificates in the store are selected. Otherwise,
`criteria` must be one or more `field:value` pairs separated by white space. The valid field names are described below:

| `Issuer`       | Matches a substring of the issuer's name.         |
| -------------- | ------------------------------------------------- |
| `IssuerDN`     | Matches the issuer's entire distinguished name.   |
| `Serial`       | Matches the certificate's serial number.          |
| `Subject`      | Matches a substring of the subject's name.        |
| `SubjectDN`    | Matches the subject's entire distinguished name.  |
| `SubjectKeyId` | Matches the certificate's subject key identifier. |
| `Thumbprint`   | Matches the certificate's SHA1 hash.              |

The field names are case-insensitive. If multiple criteria are specified, only certificates that match all criteria are
selected. Values must be enclosed in single or double quotes to preserve white space.

{% /language-section %}

{% language-section name="lang-4" %}

{% /language-section %}

{% language-section name="lang-5" %}

{% /language-section %}
