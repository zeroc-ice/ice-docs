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

For a password-protected PKCS12 key store, this property is generally required even when `IceSSL.Password` is configured, because the certificates in such a store are encrypted with the store password. Without it, the store either fails to load or loads with a private key but without its certificate chain. In both cases, communicator initialization fails with an `InitializationException`.

If this property is not defined, Ice loads the key store with an empty password when `IceSSL.KeystoreType` is exactly `PKCS12` or `BKS`, and with a null password otherwise. See `IceSSL.KeystoreType` for the consequences of each.

If `IceSSL.Keystore` and `IceSSL.Truststore` have the same value, Ice uses `IceSSL.KeystorePassword` to load the shared store; `IceSSL.TruststorePassword` is not used.

# IceSSL.KeystoreType

#### Synopsis

`IceSSL.KeystoreType=type` (Java)

#### Description

Specifies the type of the key store file defined by `IceSSL.Keystore`. Ice passes this value unchanged to `KeyStore.getInstance(String)`, so it must name a key store type supplied by an installed security provider, such as `PKCS12`, `JKS`, or `BKS` on Android. `KeyStore.getInstance` matches type names case-insensitively: `PKCS12` and `pkcs12` select the same implementation.

If this property is not defined, Ice uses `KeyStore.getDefaultType()`, which returns the value of the Java security property `keystore.type`:

- Standard JDK distributions have configured `keystore.type=pkcs12` since Java 9. The JDK's PKCS12 implementation also reads JKS files, thanks to the `keystore.type.compat` security property, which is enabled by default. On a JDK, you can therefore leave this property unset for both PKCS12 and JKS files.
- Android configures `keystore.type=BKS`. Android's BKS implementation does not read PKCS12 files: to use a PKCS12 key store on Android, set `IceSSL.KeystoreType=PKCS12`, in upper case.

#### Store type and store password

When `IceSSL.KeystorePassword` is not defined, the exact spelling of this property determines the password Ice passes to `KeyStore.load`:

| `IceSSL.KeystoreType` | Password passed to `KeyStore.load` |
| --- | --- |
| `PKCS12` or `BKS`, in upper case | an empty password |
| any other value, including the default | null |

Ice keeps this rule for compatibility with existing configurations. The two passwords behave differently:

- With the JDK's PKCS12 implementation, a null password skips the integrity check and leaves the encrypted content of the store unread. In a typical PKCS12 file, this content includes the certificates, so the store loads with its private keys but without their certificate chains. An empty password is a regular password: it loads a password-less PKCS12 file completely, and fails on a password-protected file.
- With a JKS file, loaded through `JKS` or through the JDK's PKCS12 compatibility mode, a null password skips the integrity check and loads all entries, while an empty password fails the integrity check.
- With the Bouncy Castle BKS implementation, both passwords skip the integrity check and load all entries.
- Android's Bouncy Castle PKCS12 implementation throws a `NullPointerException` on a null password when the store carries an integrity check, which is the norm.

In practice, with `IceSSL.KeystorePassword` not defined:

- A password-less PKCS12 key store loads only with `IceSSL.KeystoreType=PKCS12`, in upper case. With `pkcs12` or with the property unset, Ice loads the store with a null password, and the JDK skips its certificates.
- A JKS key store loads with the property unset (on a JDK) or set to `JKS`. Setting it to `PKCS12` makes the JKS integrity check fail.
- A password-protected PKCS12 key store does not load without its password: with a null password, the JDK skips its certificates, and with an empty password, the load fails. Set `IceSSL.KeystorePassword`.

After loading the key store, Ice checks that the selected key entry has a certificate chain. If it doesn't, communicator initialization fails with an `InitializationException` that points at `IceSSL.KeystorePassword` and, for a password-less PKCS12 store, at `IceSSL.KeystoreType=PKCS12`. Ice 3.8.2 and earlier load such a store silently, and every TLS handshake that uses it fails with an unrelated error.

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

For a password-protected PKCS12 trust store, this property is generally required, because the certificates in such a store are encrypted with the store password. Without it, the trust store either fails to load or loads without any certificate. In both cases, communicator initialization fails with an `InitializationException`.

If this property is not defined, Ice loads the trust store with an empty password when `IceSSL.TruststoreType` is exactly `PKCS12` or `BKS`, and with a null password otherwise. See `IceSSL.TruststoreType` for the consequences of each.

If `IceSSL.Truststore` and `IceSSL.Keystore` have the same value, Ice loads the shared store using `IceSSL.KeystorePassword`; `IceSSL.TruststorePassword` is not used.

# IceSSL.TruststoreType

#### Synopsis

`IceSSL.TruststoreType=type` (Java)

#### Description

Specifies the type of the trust store file defined by `IceSSL.Truststore`. Ice passes this value unchanged to `KeyStore.getInstance(String)`, so it must name a key store type supplied by an installed security provider, such as `PKCS12`, `JKS`, or `BKS` on Android. `KeyStore.getInstance` matches type names case-insensitively: `PKCS12` and `pkcs12` select the same implementation.

If this property is not defined, Ice uses `KeyStore.getDefaultType()`, which returns the value of the Java security property `keystore.type`: lower-case `pkcs12` on standard JDK distributions since Java 9, and `BKS` on Android. The JDK's PKCS12 implementation also reads JKS files, so on a JDK you can leave this property unset for both PKCS12 and JKS files. Android's BKS implementation does not read PKCS12 files: to use a PKCS12 trust store on Android, set `IceSSL.TruststoreType=PKCS12`, in upper case.

#### Store type and store password

When `IceSSL.TruststorePassword` is not defined, Ice loads the trust store with an empty password if this property is exactly `PKCS12` or `BKS`, and with a null password otherwise. `IceSSL.KeystoreType` describes how the security providers treat each password. The consequences for a trust store are:

- A password-less PKCS12 trust store loads only with `IceSSL.TruststoreType=PKCS12`, in upper case. With `pkcs12` or with the property unset, Ice loads the store with a null password, and the JDK skips its certificates.
- A JKS trust store loads with the property unset (on a JDK) or set to `JKS`. Setting it to `PKCS12` makes the JKS integrity check fail.
- A password-protected PKCS12 trust store does not load without its password: with a null password, the JDK skips its certificates, and with an empty password, the load fails. Set `IceSSL.TruststorePassword`.

After loading the trust store, Ice checks that it contains at least one certificate. If it doesn't, communicator initialization fails with an `InitializationException` that points at `IceSSL.TruststorePassword` and, for a password-less PKCS12 store, at `IceSSL.TruststoreType=PKCS12`.

If `IceSSL.Truststore` and `IceSSL.Keystore` have the same value, Ice loads the file once using `IceSSL.KeystoreType`. In this case, `IceSSL.TruststoreType` and `IceSSL.TruststorePassword` are not used.
{% /language-section %}
