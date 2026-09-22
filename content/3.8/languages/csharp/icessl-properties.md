---
id: icessl-properties
language: csharp
---

{% language-section name="lang-1" %}

# IceSSL.CAs

#### Synopsis

`IceSSL.CAs=path` (SChannel, SecureTransport, OpenSSL, .NET)

#### Description

Specifies the path name of a file containing the certificates of trusted certificate authorities (CAs).

If you wish to use the CA certificates bundled with your platform, leave this property unset and enable
`IceSSL.UsePlatformCAs`.

#### Platform Notes

###### SChannel, SecureTransport, .NET

The file can be encoded using the DER or PEM formats. When using PEM, the file can contain multiple certificates.

IceSSL attempts to locate `path` as specified; if the given path is relative but does not exist, IceSSL also attempts to
locate `path` relative to the default directory defined by `IceSSL.DefaultDir`.

On iOS, IceSSL also attempts to open the specified CA certificate file as `Resources/DefaultDir/path` in the
application's resource bundle if `IceSSL.DefaultDir` is defined or as `Resources/path` if not defined.

###### OpenSSL

The file must be encoded using the PEM format and can contain multiple certificates. The `path` can also refer to a
directory prepared in advance using the OpenSSL utility `c_rehash`.

IceSSL attempts to locate `path` as specified; if the given path is relative but does not exist, IceSSL also attempts to
locate `path` relative to the default directory defined by `IceSSL.DefaultDir`.

# IceSSL.CertFile

#### Synopsis

`IceSSL.CertFile=file` (SecureTransport, SChannel, OpenSSL, .NET)

#### Description

Specifies a file that contains the program's certificate and the corresponding private key, the private key can be
specified separately using `IceSSL.Keyfile`. The file name may be specified relative to the default directory defined by
`IceSSL.DefaultDir`.

#### Platform Notes

###### SChannel

The file must use the PFX (PKCS#12) format and contain the certificate and its private key or a PEM file containing the
certificate in which case the private key must be specify using `IceSSL.Keyfile`. If a password is required to load the
file, the application must supply the password using `IceSSL.Password`, otherwise IceSSL will reject the certificate.

IceSSL attempts to locate `file` as specified; if the given path is relative but does not exist, IceSSL also attempts to
locate `file` relative to the default directory defined by `IceSSL.DefaultDir`.

###### SecureTransport

The file must use the PFX (PKCS#12) format and contain the certificate and its private key or a PEM file containing the
certificate in which case the private key must be specify using `IceSSL.Keyfile`. If a password is required to load the
file, macOS will use its default graphical password prompt unless the application has supplied the password using
`IceSSL.Password`. Define `IceSSL.Keychain` to import this certificate into the specified keychain.

IceSSL attempts to locate `file` as specified; if the given path is relative but does not exist, IceSSL also attempts to
locate `file` relative to the default directory defined by `IceSSL.DefaultDir`.

On iOS, IceSSL also attempts to open the specified certificate file as `Resources/DefaultDir/file` in the application's
resource bundle if `IceSSL.DefaultDir` is defined or as `Resources/file` if not defined.

###### OpenSSL

The file must use the PFX (PKCS#12) format and contain the certificate and its private key or a PEM file containing the
certificate in which case the private key must be specify using `IceSSL.Keyfile`. If a password is required to load the
file, the application must supply the password using `IceSSL.Password`.

IceSSL attempts to locate `file` as specified; if the given path is relative but does not exist, IceSSL also attempts to
locate `file` relative to the default directory defined by `IceSSL.DefaultDir`.

###### .NET

The file must use the PFX (PKCS#12) format and contain the certificate and its private key. The password for the file
must be supplied using `IceSSL.Password`.

IceSSL attempts to locate `file` as specified; if the given path is relative but does not exist, IceSSL also attempts to
locate `file` relative to the default directory defined by `IceSSL.DefaultDir`.

# IceSSL.CertStore

#### Synopsis

`IceSSL.CertStore=name` (SChannel, .NET)

#### Description

Specifies the name of a certificate store to use when locating certificates via `IceSSL.FindCert`. Legal values for
`name` include `AddressBook`, `AuthRoot`, `CertificateAuthority`, `Disallowed`, `My`, `Root`, `TrustedPeople`, and
`TrustedPublisher`. You can also use an arbitrary value for `name`.

If not specified, the default value is `My`.

# IceSSL.CertStoreLocation

#### Synopsis

`IceSSL.CertStoreLocation=CurrentUser|LocalMachine` (SChannel, .NET)

#### Description

This property is used for two different purposes:

- to specify the location of a certificate store to use when locating certificates via `IceSSL.FindCert`.
- to specify if certificate chain validation will use the machine context (HCCE_LOCAL_MACHINE) or the current user
  context (HCCE_CURRENT_USER).

If not specified, the default value is `CurrentUser.`

{% callout type="tip" %}

An Ice program running as a Windows service will typically need to set this property to `LocalMachine`.

{% /callout %}

{% /language-section %}

{% language-section name="lang-2" %}

# IceSSL.CheckCRL

#### Synopsis

`IceSSL.CheckCRL=num` (.NET)

#### Description

Specifies whether IceSSL checks the revocation status of the certificates in the peer's chain, and what happens when the
revocation status of a certificate cannot be determined. The legal values are shown in the table below. If
`IceSSL.CheckCRL` is not defined, the default value is zero.

| Value | Description                                                                                                                                    |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 0     | Disables revocation checking.                                                                                                                  |
| 1     | Checks revocation online. A revoked certificate aborts the connection. A certificate whose revocation status cannot be determined is accepted. |
| 2     | Checks revocation online. A revoked certificate, or a certificate whose revocation status cannot be determined, aborts the connection.         |

The revocation status of a certificate cannot be determined when the certificate carries no revocation information, or
when its OCSP responder or CRL distribution point cannot be reached.

If `IceSSL.Trace.Security` is set to a non-zero value, IceSSL logs the certificate chain status of a rejected
connection.

The revocation sources are those of the platform, since .NET delegates certificate chain building to Windows CryptoAPI,
to its own OpenSSL-based chain builder on Linux, and to the Security framework on macOS. Windows and Linux fetch CRLs
from the distribution points and query the OCSP responders named in the certificates.

#### Platform Notes

###### macOS

The Security framework queries OCSP responders but does not fetch CRLs from distribution points. A certificate that
publishes only a CRL therefore has an undeterminable revocation status: it is accepted with the value `1` and rejected
with the value `2`, whether or not it is revoked.

{% /language-section %}

{% language-section name="lang-3" %}

# IceSSL.FindCert

#### Synopsis

`IceSSL.FindCert=criteria` (SChannel, SecureTransport, .NET)

#### Description

Builds a collection of certificates that will be used for authentication.

A server requires a certificate for authentication purposes, therefore IceSSL selects the first certificate in the
accumulated collection. This is normally the certificate loaded via `IceSSL.CertFile`, if that property was defined.
Otherwise, IceSSL selects one of the certificates identified by `IceSSL.FindCert`.

#### Platform Notes

###### SChannel, .NET

IceSSL queries a certificate store for matching certificates and adds them to the application's certificate collection.
The settings for `IceSSL.CertStore` and `IceSSL.CertStoreLocation` determine the target certificate store to be queried.

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

###### SecureTransport

IceSSL queries the keychain for matching certificates and adds them to the application's certificate collection. IceSSL
uses the keychain identified in `IceSSL.Keychain`, or the user's default keychain if `IceSSL.Keychain` is not defined.

The value for `criteria` must be one or more `field:value` pairs separated by white space. The valid field names are
described below:

| `Label`        | Matches the user-visible label.                   |
| -------------- | ------------------------------------------------- |
| `Serial`       | Matches the certificate's serial number.          |
| `Subject`      | Matches a substring of the subject's name.        |
| `SubjectKeyId` | Matches the certificate's subject key identifier. |

The field names are case-insensitive. If multiple criteria are specified, only certificates that match all criteria are
selected. Values must be enclosed in single or double quotes to preserve white space.

On iOS, matching on the `Subject` field is not supported.

{% /language-section %}

{% language-section name="lang-4" %}

{% /language-section %}

{% language-section name="lang-5" %}

{% /language-section %}
