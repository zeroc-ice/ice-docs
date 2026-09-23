---
id: icessl-properties
language: java
---

{% language-section name="lang-1" %}

# IceSSL.Alias

#### Synopsis

`IceSSL.Alias=alias` (Java)

#### Description

Selects a particular certificate from the key store specified by `IceSSL.Keystore`. IceSSL presents the certificate
identified by `alias` to the peer during authentication. If the alias does not name a key entry of the key store,
communicator initialization fails with an `InitializationException`.

If this property is not defined, IceSSL uses the first key entry of the key store that has a certificate chain.

{% /language-section %}

{% language-section name="lang-2" %}

{% /language-section %}

{% language-section name="lang-3" %}

# IceSSL.Keystore

#### Synopsis

`IceSSL.Keystore=file` (Java)

#### Description

Specifies a key store file containing certificates and their private keys. If the key store contains multiple
certificates, you should specify a particular one to use for authentication using `IceSSL.Alias`. IceSSL first attempts
to open `file` as a class loader resource and then as a regular file. If the given path is relative but does not exist,
IceSSL also attempts to locate it relative to the default directory defined by `IceSSL.DefaultDir`. The format of the
file is determined by `IceSSL.KeystoreType`.

If this property is not defined, the application will not be able to supply a certificate during SSL handshaking. As a
result, the application may not be able to negotiate a secure connection.

# IceSSL.KeystorePassword

#### Synopsis

`IceSSL.KeystorePassword=password` (Java)

#### Description

Specifies the password used to load the key store defined by `IceSSL.Keystore`. Depending on the key store type and
security provider, this password can be used to verify the store's integrity and to decrypt its contents, including
certificates and certificate chains.

This property is distinct from `IceSSL.Password`, which Ice uses to recover private keys. One property does not default
to the other.

If this property is not defined, the value of `IceSSL.KeystoreType` determines the password Ice passes to
`KeyStore.load`: the empty string for `PKCS12` and `BKS` in upper case, and null for any other value, including the
OpenJDK default `pkcs12`. See `IceSSL.KeystoreType` for what each password means.

If `IceSSL.Keystore` and `IceSSL.Truststore` have the same value, Ice uses `IceSSL.KeystorePassword` to load the shared
store; `IceSSL.TruststorePassword` is not used.

# IceSSL.KeystoreType

#### Synopsis

`IceSSL.KeystoreType=type` (Java)

#### Description

Specifies the type of the key store file defined by `IceSSL.Keystore`. Ice passes this value unchanged to
`KeyStore.getInstance(String)`, so it must name a key store type supplied by an installed security provider, such as
`PKCS12`, `JKS`, or `BKS` on Android. `KeyStore.getInstance` matches type names case-insensitively: `PKCS12` and
`pkcs12` select the same implementation.

If this property is not defined, Ice uses `KeyStore.getDefaultType()`, which returns the value of the Java security
property `keystore.type`:

- OpenJDK-based runtimes have configured `keystore.type=pkcs12` since Java 9. OpenJDK's PKCS12 implementation also reads
  JKS files, thanks to the `keystore.type.compat` security property, which is enabled by default. On such a runtime, you
  can leave this property unset for a JKS file and for a PKCS12 file loaded with `IceSSL.KeystorePassword`.
- Android configures `keystore.type=BKS`.

##### Store type and store password

When `IceSSL.KeystorePassword` is not defined, the key store type determines the password Ice passes to `KeyStore.load`:

| Key store type                   | Password passed to `KeyStore.load` |
| -------------------------------- | ---------------------------------- |
| `PKCS12` or `BKS`, in upper case | the empty string                   |
| any other value                  | null                               |

An omitted type is therefore `pkcs12` on an OpenJDK-based runtime, which takes the null path, and `BKS` on Android,
which takes the empty-string path. Since an empty `IceSSL.KeystorePassword` means "not defined", the type spelling is
the only way to make Ice pass the empty string.

A null password and an empty password mean different things to `KeyStore.load`. With null, the provider skips the
integrity check and reads only what it can read without a password. For OpenJDK's PKCS12 provider, that leaves out the
certificates, which a PKCS12 store encrypts with the store password: the key entries load without their certificate
chains. A JKS store uses the store password only for its integrity check, so null loads everything.

The empty string is a password like any other. It opens an empty-password PKCS12 store, that is, a store created with
the empty string as its password. Such a store is the usual way to ship a PKCS12 file that needs no secret, such as a
trust store of public CA certificates; `openssl pkcs12 -export -passout pass:` creates one. On an OpenJDK-based runtime,
an empty-password PKCS12 store therefore loads only with `IceSSL.KeystoreType=PKCS12`, in upper case.

After loading the key store, Ice checks that the selected key entry has a certificate chain. If it doesn't, communicator
initialization fails with an `InitializationException` that points at `IceSSL.KeystorePassword` and, for an
empty-password PKCS12 store, at `IceSSL.KeystoreType=PKCS12`.

If `IceSSL.Keystore` and `IceSSL.Truststore` have the same value, Ice loads the file once using `IceSSL.KeystoreType`
and `IceSSL.KeystorePassword`. In this case, `IceSSL.TruststoreType` and `IceSSL.TruststorePassword` are not used.

{% /language-section %}

{% language-section name="lang-4" %}

{% callout type="info" title="Certificate revocation" %}

Ice for Java has no certificate revocation properties. IceSSL does not check certificate revocation itself; the
revocation checking configured in the JDK applies.

{% /callout %}

{% /language-section %}

{% language-section name="lang-5" %}

# IceSSL.Truststore

#### Synopsis

`IceSSL.Truststore=file` (Java)

#### Description

Specifies a key store file containing the certificates of trusted certificate authorities. IceSSL first attempts to open
`file` as a class loader resource and then as a regular file. If the given path is relative but does not exist, IceSSL
also attempts to locate it relative to the default directory defined by `IceSSL.DefaultDir`. The format of the file is
determined by `IceSSL.TruststoreType`.

If no truststore is specified the application will not be able to authenticate the peer's certificate during SSL
handshaking. As a result, the application may not be able to negotiate a secure connection.

# IceSSL.TruststorePassword

#### Synopsis

`IceSSL.TruststorePassword=password` (Java)

#### Description

Specifies the password used to load the trust store defined by `IceSSL.Truststore`. Depending on the key store type and
security provider, this password can be used to verify the store's integrity and to decrypt its contents, including
trusted CA certificates.

If this property is not defined, the value of `IceSSL.TruststoreType` determines the password Ice passes to
`KeyStore.load`: the empty string for `PKCS12` and `BKS` in upper case, and null for any other value, including the
OpenJDK default `pkcs12`. See `IceSSL.KeystoreType` for what each password means.

If `IceSSL.Truststore` and `IceSSL.Keystore` have the same value, Ice loads the shared store using
`IceSSL.KeystorePassword`; `IceSSL.TruststorePassword` is not used.

# IceSSL.TruststoreType

#### Synopsis

`IceSSL.TruststoreType=type` (Java)

#### Description

Specifies the type of the trust store file defined by `IceSSL.Truststore`. Ice passes this value unchanged to
`KeyStore.getInstance(String)`, so it must name a key store type supplied by an installed security provider, such as
`PKCS12`, `JKS`, or `BKS` on Android. `KeyStore.getInstance` matches type names case-insensitively: `PKCS12` and
`pkcs12` select the same implementation.

If this property is not defined, Ice uses `KeyStore.getDefaultType()`, as described under `IceSSL.KeystoreType`.

##### Store type and store password

When `IceSSL.TruststorePassword` is not defined, the trust store type determines the password Ice passes to
`KeyStore.load`: the empty string for `PKCS12` or `BKS` in upper case, and null for any other value. See
`IceSSL.KeystoreType` for what each password means. An empty-password PKCS12 trust store therefore loads only with
`IceSSL.TruststoreType=PKCS12`, in upper case.

After loading the trust store, Ice checks that it contains at least one certificate. A store loaded without its
certificates, such as a PKCS12 trust store loaded with a null password, fails this check, and communicator
initialization fails with an `InitializationException` that points at `IceSSL.TruststorePassword` and, for an
empty-password PKCS12 store, at `IceSSL.TruststoreType=PKCS12`.

If `IceSSL.Truststore` and `IceSSL.Keystore` have the same value, Ice loads the file once using `IceSSL.KeystoreType`.
In this case, `IceSSL.TruststoreType` and `IceSSL.TruststorePassword` are not used.

{% /language-section %}
