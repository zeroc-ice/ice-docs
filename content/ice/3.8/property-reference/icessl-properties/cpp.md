---
id: icessl-properties
language: cpp
---

{% language-section name="lang-1" %}

# IceSSL.CAs

#### Synopsis

`IceSSL.CAs=path` (SChannel, SecureTransport, OpenSSL)

#### Description

Specifies the path name of a file containing the certificates of trusted certificate authorities (CAs).

If you wish to use the CA certificates bundled with your platform, leave this property unset and enable
`IceSSL.UsePlatformCAs`.

#### Platform Notes

###### SChannel, SecureTransport

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

# IceSSL.CertificateRevocationListFiles

#### Synopsis

`IceSSL.CertificateRevocationListFiles=file[,file...]` (OpenSSL)

#### Description

Specifies the PEM files containing the certificate revocation lists (CRLs) that IceSSL uses for revocation checks.
Separate several files with commas or whitespace. A relative path is resolved under `IceSSL.DefaultDir` when that
property is set, and relative to the working directory otherwise.

IceSSL reads these files only when `IceSSL.RevocationCheck` is greater than zero, and then requires them: communicator
initialization fails with an `InitializationException` if a file is missing or contains no PEM-encoded CRL or
certificate. During the handshake, OpenSSL looks up the CRL of each certificate it checks in these files. If the CRL is
not there, the handshake fails.

# IceSSL.CertFile

#### Synopsis

`IceSSL.CertFile=file` (SecureTransport, SChannel, OpenSSL)

#### Description

Specifies a file that contains the program's certificate and the corresponding private key, the private key can be
specified separately using `IceSSL.KeyFile`. The file name may be specified relative to the default directory defined by
`IceSSL.DefaultDir`.

#### Platform Notes

###### SChannel

The file must use the PFX (PKCS#12) format and contain the certificate and its private key or a PEM file containing the
certificate in which case the private key must be specified using `IceSSL.KeyFile`. If a password is required to load
the file, the application must supply the password using `IceSSL.Password`, otherwise IceSSL will reject the
certificate.

IceSSL attempts to locate `file` as specified; if the given path is relative but does not exist, IceSSL also attempts to
locate `file` relative to the default directory defined by `IceSSL.DefaultDir`.

###### SecureTransport

The file must use the PFX (PKCS#12) format and contain the certificate and its private key or a PEM file containing the
certificate in which case the private key must be specified using `IceSSL.KeyFile`. If a password is required to load
the file, macOS will use its default graphical password prompt unless the application has supplied the password using
`IceSSL.Password`. Define `IceSSL.Keychain` to import this certificate into the specified keychain.

IceSSL attempts to locate `file` as specified; if the given path is relative but does not exist, IceSSL also attempts to
locate `file` relative to the default directory defined by `IceSSL.DefaultDir`.

On iOS, IceSSL also attempts to open the specified certificate file as `Resources/DefaultDir/file` in the application's
resource bundle if `IceSSL.DefaultDir` is defined or as `Resources/file` if not defined.

###### OpenSSL

The file must use the PFX (PKCS#12) format and contain the certificate and its private key or a PEM file containing the
certificate in which case the private key must be specified using `IceSSL.KeyFile`. If a password is required to load
the file, the application must supply the password using `IceSSL.Password`.

IceSSL attempts to locate `file` as specified; if the given path is relative but does not exist, IceSSL also attempts to
locate `file` relative to the default directory defined by `IceSSL.DefaultDir`.

# IceSSL.CertStore

#### Synopsis

`IceSSL.CertStore=name` (SChannel)

#### Description

Specifies the name of a certificate store to use when locating certificates via `IceSSL.FindCert`. Legal values for
`name` include `AddressBook`, `AuthRoot`, `CertificateAuthority`, `Disallowed`, `My`, `Root`, `TrustedPeople`, and
`TrustedPublisher`. You can also use an arbitrary value for `name`.

If not specified, the default value is `My`.

# IceSSL.CertStoreLocation

#### Synopsis

`IceSSL.CertStoreLocation=CurrentUser|LocalMachine` (SChannel)

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

{% /language-section %}

{% language-section name="lang-3" %}

# IceSSL.FindCert

#### Synopsis

`IceSSL.FindCert=criteria` (SChannel, SecureTransport)

#### Description

Builds a collection of certificates that will be used for authentication.

A server requires a certificate for authentication purposes, therefore IceSSL selects the first certificate in the
accumulated collection. This is normally the certificate loaded via `IceSSL.CertFile`, if that property was defined.
Otherwise, IceSSL selects one of the certificates identified by `IceSSL.FindCert`.

#### Platform Notes

###### SChannel

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

# IceSSL.Keychain

#### Synopsis

`IceSSL.Keychain=name` (SecureTransport)

#### Description

Specifies the name of a keychain in which to import the certificate identified by `IceSSL.CertFile`. Set
`IceSSL.KeychainPassword` if the specified keychain has a password.

A relative path name is opened relative to the current working directory. If the specified keychain file does not exist,
a new file is created. If this property is not defined, IceSSL creates a private temporary keychain in the per-user
temporary directory with a random password. The temporary keychain and its enclosing directory are removed when the
communicator is destroyed.

On iOS this property is ignored, IceSSL uses the default device keychain.

# IceSSL.KeyFile

#### Synopsis

`IceSSL.KeyFile=file` (SChannel, SecureTransport, OpenSSL)

#### Description

Specifies a file that contains the program's private key. The file name may be specified relative to the default
directory defined by `IceSSL.DefaultDir`. The corresponding certificate must be specified using `IceSSL.CertFile`.

# IceSSL.KeychainPassword

#### Synopsis

`IceSSL.KeychainPassword=password` (SecureTransport)

#### Description

Specifies the password for the keychain identified by `IceSSL.Keychain`. If not defined, IceSSL attempts to open the
keychain without a password.

On iOS, this property is ignored.

{% /language-section %}

{% language-section name="lang-4" %}

# IceSSL.RevocationCheck

#### Synopsis

`IceSSL.RevocationCheck=num` (OpenSSL, SChannel, SecureTransport)

#### Description

Specifies whether IceSSL checks the certificates of the peer's chain for revocation:

| Value | Description                                                 |
| ----- | ----------------------------------------------------------- |
| 0     | Revocation checks are disabled (default).                   |
| 1     | Checks the revocation status of the peer's own certificate. |
| 2     | Checks the revocation status of the whole chain.            |

IceSSL aborts the connection when it finds a revoked certificate or cannot determine the revocation status of a
certificate.

#### Platform Notes

###### OpenSSL

The revocation status is looked up in the CRL files listed in `IceSSL.CertificateRevocationListFiles`, which must be set
when this property is greater than zero; otherwise communicator initialization fails. OpenSSL reports an error when it
finds no CRL for a certificate it checks, so with the value `2` the files must cover every issuer in the chain.

###### SChannel

The value `2` checks the whole chain except the root CA certificate. Revocation data is fetched from the CRL
distribution points and OCSP responders named in the certificates, subject to `IceSSL.RevocationCheckCacheOnly`.

###### SecureTransport

The values `1` and `2` are equivalent: the revocation policy applies to the whole chain. See
`IceSSL.RevocationCheckCacheOnly` for the revocation sources. The value `0` only leaves out IceSSL's revocation policy:
the macOS trust evaluation still performs its own best-effort check and rejects a certificate it finds revoked.

# IceSSL.RevocationCheckCacheOnly

#### Synopsis

`IceSSL.RevocationCheckCacheOnly=num` (SChannel, SecureTransport)

#### Description

Specifies whether revocation checks may access the network:

| Value | Description                                                                                                            |
| ----- | ---------------------------------------------------------------------------------------------------------------------- |
| 0     | Revocation checks may fetch CRLs from the distribution points and query the OCSP responders named in the certificates. |
| 1     | Revocation checks consult only the system's revocation cache (default).                                                |

With the default value, IceSSL rejects a certificate whose revocation status is not already in the system cache.

#### Platform Notes

###### SChannel

The value `1` also disables the retrieval of intermediate certificates through the Authority Information Access
extension, so the whole chain must be available locally.

###### SecureTransport

IceSSL requests any available revocation method. In practice, the macOS trust evaluation queries the OCSP responder
named in a certificate's Authority Information Access extension and does not fetch CRLs from distribution points, so
IceSSL cannot determine the revocation status of a certificate that publishes only a CRL, and rejects it.

{% /language-section %}

{% language-section name="lang-5" %}

{% /language-section %}
