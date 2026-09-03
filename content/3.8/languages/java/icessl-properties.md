---
id: icessl-properties
language: java
---

{% language-section name="lang-1" %}

# IceSSL.Alias

#### Synopsis

`IceSSL.Alias=alias` (Java)

#### Description

Selects a particular certificate from the key store specified by `IceSSL.Keystore`. The certificate identified by `alias` is presented to the peer request during authentication.
{% /language-section %}

{% language-section name="lang-2" %}

{% /language-section %}

{% language-section name="lang-3" %}

# IceSSL.Keystore

#### Synopsis

`IceSSL.Keystore=file` (Java)

#### Description

Specifies a key store file containing certificates and their private keys. If the key store contains multiple certificates, you should specify a particular one to use for authentication using `IceSSL.Alias`. IceSSL first attempts to open `file` as a class loader resource and then as a regular file. If the given path is relative but does not exist, IceSSL also attempts to locate it relative to the default directory defined by `IceSSL.DefaultDir`. The format of the file is determined by `IceSSL.KeystoreType`.

If this property is not defined, the application will not be able to supply a certificate during SSL handshaking. As a result, the application may not be able to negotiate a secure connection.

# IceSSL.KeystorePassword

#### Synopsis

`IceSSL.KeystorePassword=password` (Java)

#### Description

Specifies the password used to load the key store defined by `IceSSL.Keystore`. Depending on the key store type and security provider, this password can be used to verify the store's integrity and to decrypt its contents, including certificates and certificate chains.

This property is distinct from `IceSSL.Password`, which Ice uses to recover private keys. One property does not default to the other.

For a password-protected PKCS12 key store, this property is required even when `IceSSL.Password` is configured, because the certificates in such a store are encrypted with the store password. Without it, the store either fails to load or loads with a private key but without its certificate chain. In both cases, communicator initialization fails with an `InitializationException`.

If this property is not defined, Ice loads the key store with the empty string as password when the key store type in effect, set with `IceSSL.KeystoreType` or defaulted, is exactly `PKCS12` or `BKS`, and with a null password otherwise. An empty value for this property is the same as not defining it. See `IceSSL.KeystoreType` for what each password means.

If `IceSSL.Keystore` and `IceSSL.Truststore` have the same value, Ice uses `IceSSL.KeystorePassword` to load the shared store; `IceSSL.TruststorePassword` is not used.

# IceSSL.KeystoreType

#### Synopsis

`IceSSL.KeystoreType=type` (Java)

#### Description

Specifies the type of the key store file defined by `IceSSL.Keystore`. Ice passes this value unchanged to `KeyStore.getInstance(String)`, so it must name a key store type supplied by an installed security provider, such as `PKCS12`, `JKS`, or `BKS` on Android. `KeyStore.getInstance` matches type names case-insensitively: `PKCS12` and `pkcs12` select the same implementation.

If this property is not defined, Ice uses `KeyStore.getDefaultType()`, which returns the value of the Java security property `keystore.type`:

- OpenJDK-based runtimes have configured `keystore.type=pkcs12` since Java 9. OpenJDK's PKCS12 implementation also reads JKS files, thanks to the `keystore.type.compat` security property, which is enabled by default. On such a runtime, you can leave this property unset for a JKS file and for a PKCS12 file loaded with `IceSSL.KeystorePassword`. An empty-password PKCS12 store needs `IceSSL.KeystoreType=PKCS12`, as described below.
- Android configures `keystore.type=BKS`. Android's BKS implementation does not read PKCS12 files: to use a PKCS12 key store on Android, set `IceSSL.KeystoreType=PKCS12`, in upper case.

##### Store type and store password

When `IceSSL.KeystorePassword` is not defined, the key store type in effect, whether set with this property or obtained from `KeyStore.getDefaultType()`, determines the password Ice passes to `KeyStore.load`:

| Key store type in effect | Password passed to `KeyStore.load` |
| --- | --- |
| `PKCS12` or `BKS`, in upper case | the empty string |
| any other value | null |

An omitted type is therefore `pkcs12` on an OpenJDK-based runtime, which takes the null path, and `BKS` on Android, which takes the empty-string path. Since an empty `IceSSL.KeystorePassword` means "not defined", the type spelling is the only way to make Ice pass the empty string.

A null password and an empty password mean different things to `KeyStore.load`. Null means "no password": the provider skips the integrity check and reads only what it can read without a password. An empty password is the password `""`: the provider checks the store's integrity with it and decrypts the content with it, so the load succeeds only for a store created with the empty string as its password. This page calls such a store an empty-password store; `openssl pkcs12 -export -passout pass:` creates an empty-password PKCS12 store. From there:

- PKCS12 with OpenJDK's provider: the certificates are normally encrypted with the store password. Null loads the key entries without their chains. Empty fully loads an empty-password store and fails on any other.
- JKS, directly or through OpenJDK's PKCS12 compatibility mode: nothing is encrypted with the store password, which only seeds an integrity digest. Null loads everything without the check. Empty fails the check unless the store was saved with the empty string.
- BKS with Bouncy Castle: both load everything without a check.
- PKCS12 with Bouncy Castle on Android: null fails with a `NullPointerException` when the store carries an integrity check, which is the norm.

In practice, with `IceSSL.KeystorePassword` not defined:

- An empty-password PKCS12 key store loads only with `IceSSL.KeystoreType=PKCS12`, in upper case. With `pkcs12` or with the property unset on an OpenJDK-based runtime, Ice loads the store with a null password, and OpenJDK skips its certificates.
- A JKS key store loads with the property unset on an OpenJDK-based runtime, or set to `JKS`. With `PKCS12`, the integrity check fails unless the store was saved with the empty string as its password.
- A password-protected PKCS12 key store does not load without its password: with a null password, OpenJDK skips its certificates, and with an empty password, the load fails. Set `IceSSL.KeystorePassword`.

After loading the key store, Ice checks that the selected key entry has a certificate chain. If it doesn't, communicator initialization fails with an `InitializationException` that points at `IceSSL.KeystorePassword` and, for an empty-password PKCS12 store, at `IceSSL.KeystoreType=PKCS12`.

If `IceSSL.Keystore` and `IceSSL.Truststore` have the same value, Ice loads the file once using `IceSSL.KeystoreType` and `IceSSL.KeystorePassword`. In this case, `IceSSL.TruststoreType` and `IceSSL.TruststorePassword` are not used.
{% /language-section %}

{% language-section name="lang-4" %}

{% /language-section %}

{% language-section name="lang-5" %}

# IceSSL.Truststore

#### Synopsis

`IceSSL.Truststore=file` (Java)

#### Description

Specifies a key store file containing the certificates of trusted certificate authorities. IceSSL first attempts to open `file` as a class loader resource and then as a regular file. If the given path is relative but does not exist, IceSSL also attempts to locate it relative to the default directory defined by `IceSSL.DefaultDir`. The format of the file is determined by `IceSSL.TruststoreType`.

If no truststore is specified the application will not be able to authenticate the peer's certificate during SSL handshaking. As a result, the application may not be able to negotiate a secure connection.

# IceSSL.TruststorePassword

#### Synopsis

`IceSSL.TruststorePassword=password` (Java)

#### Description

Specifies the password used to load the trust store defined by `IceSSL.Truststore`. Depending on the key store type and security provider, this password can be used to verify the store's integrity and to decrypt its contents, including trusted CA certificates.

For a password-protected PKCS12 trust store, this property is required, because the certificates in such a store are encrypted with the store password. Without it, the trust store either fails to load or loads without any certificate. In both cases, communicator initialization fails with an `InitializationException`.

If this property is not defined, Ice loads the trust store with the empty string as password when the trust store type in effect, set with `IceSSL.TruststoreType` or defaulted, is exactly `PKCS12` or `BKS`, and with a null password otherwise. An empty value for this property is the same as not defining it. See `IceSSL.KeystoreType` for what each password means.

If `IceSSL.Truststore` and `IceSSL.Keystore` have the same value, Ice loads the shared store using `IceSSL.KeystorePassword`; `IceSSL.TruststorePassword` is not used.

# IceSSL.TruststoreType

#### Synopsis

`IceSSL.TruststoreType=type` (Java)

#### Description

Specifies the type of the trust store file defined by `IceSSL.Truststore`. Ice passes this value unchanged to `KeyStore.getInstance(String)`, so it must name a key store type supplied by an installed security provider, such as `PKCS12`, `JKS`, or `BKS` on Android. `KeyStore.getInstance` matches type names case-insensitively: `PKCS12` and `pkcs12` select the same implementation.

If this property is not defined, Ice uses `KeyStore.getDefaultType()`, which returns the value of the Java security property `keystore.type`: lower-case `pkcs12` on OpenJDK-based runtimes since Java 9, and `BKS` on Android. OpenJDK's PKCS12 implementation also reads JKS files, so on an OpenJDK-based runtime you can leave this property unset for a JKS file and for a PKCS12 file loaded with `IceSSL.TruststorePassword`. Android's BKS implementation does not read PKCS12 files: to use a PKCS12 trust store on Android, set `IceSSL.TruststoreType=PKCS12`, in upper case.

##### Store type and store password

When `IceSSL.TruststorePassword` is not defined, the trust store type in effect, whether set with this property or obtained from `KeyStore.getDefaultType()`, determines the password Ice passes to `KeyStore.load`: the empty string for `PKCS12` or `BKS` in upper case, and null for any other value. `IceSSL.KeystoreType` describes what each password means to the security providers and the resulting configuration for each kind of store. The same applies to a trust store, with `IceSSL.TruststoreType` and `IceSSL.TruststorePassword` in place of `IceSSL.KeystoreType` and `IceSSL.KeystorePassword`. In particular, an empty-password PKCS12 trust store loads only with `IceSSL.TruststoreType=PKCS12`, in upper case.

After loading the trust store, Ice checks that it contains at least one certificate. A store loaded without its certificates, such as a PKCS12 trust store loaded with a null password, fails this check, and communicator initialization fails with an `InitializationException` that points at `IceSSL.TruststorePassword` and, for an empty-password PKCS12 store, at `IceSSL.TruststoreType=PKCS12`.

If `IceSSL.Truststore` and `IceSSL.Keystore` have the same value, Ice loads the file once using `IceSSL.KeystoreType`. In this case, `IceSSL.TruststoreType` and `IceSSL.TruststorePassword` are not used.
{% /language-section %}
