{% language-section name="lang-1" %}

## IceSSL.CAs

### Synopsis

`IceSSL.CAs=path` (.NET)

### Description

Specifies the path name of a file containing the certificates of trusted certificate authorities (CAs). The file can be
encoded using the DER or PEM formats. When using PEM, the file can contain multiple certificates.

IceSSL attempts to locate `path` as specified; if the given path is relative but does not exist, IceSSL also attempts to
locate `path` relative to the default directory defined by `IceSSL.DefaultDir`.

If you wish to use the CA certificates bundled with your platform, leave this property unset and enable
`IceSSL.UsePlatformCAs`.

## IceSSL.CertFile

### Synopsis

`IceSSL.CertFile=file` (.NET)

### Description

Specifies a file that contains the program's certificate and the corresponding private key. The file must use the PFX
(PKCS#12) format. If a password is required to load the file, the application must supply the password using
`IceSSL.Password`.

IceSSL attempts to locate `file` as specified; if the given path is relative but does not exist, IceSSL also attempts to
locate `file` relative to the default directory defined by `IceSSL.DefaultDir`.

IceSSL imports the private key into the machine key set when `IceSSL.CertStoreLocation` is `LocalMachine`, and into the
user key set otherwise.

## IceSSL.CertStore

### Synopsis

`IceSSL.CertStore=name` (.NET)

### Description

Specifies the name of a certificate store to use when locating certificates via `IceSSL.FindCert`. Legal values for
`name` include `AddressBook`, `AuthRoot`, `CertificateAuthority`, `Disallowed`, `My`, `Root`, `TrustedPeople`, and
`TrustedPublisher`. You can also use an arbitrary value for `name`.

If not specified, the default value is `My`.

## IceSSL.CertStoreLocation

### Synopsis

`IceSSL.CertStoreLocation=CurrentUser|LocalMachine` (.NET)

### Description

Specifies the location of the certificate store to use when locating certificates via `IceSSL.FindCert`. The location
also selects the key set into which IceSSL imports the private key of the certificate loaded from `IceSSL.CertFile`: the
machine key set for `LocalMachine` and the user key set for `CurrentUser`.

If not specified, the default value is `CurrentUser`.

{% callout type="tip" %}

An Ice program running as a Windows service will typically need to set this property to `LocalMachine`.

{% /callout %}

{% /language-section %}

{% language-section name="lang-2" %}

## IceSSL.CheckCRL

### Synopsis

`IceSSL.CheckCRL=num` (.NET)

### Description

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

### Platform Notes

#### macOS

The Security framework queries OCSP responders but does not fetch CRLs from distribution points. A certificate that
publishes only a CRL therefore has an undeterminable revocation status: it is accepted with the value `1` and rejected
with the value `2`, whether or not it is revoked.

{% /language-section %}

{% language-section name="lang-3" %}

## IceSSL.FindCert

### Synopsis

`IceSSL.FindCert=criteria` (.NET)

### Description

Selects the program's certificate from a certificate store instead of loading it from a file. IceSSL ignores this
property when `IceSSL.CertFile` is defined.

IceSSL queries a certificate store for matching certificates. The settings for `IceSSL.CertStore` and
`IceSSL.CertStoreLocation` determine the target certificate store to be queried. Communicator initialization fails when
no certificate matches.

A server presents the first matching certificate. A client with several matching certificates presents the first one
whose issuer is among the issuers the server accepts, or the first one when none matches.

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

{% /language-section %}

{% language-section name="lang-4" %}

{% /language-section %}

{% language-section name="lang-5" %}

{% /language-section %}
