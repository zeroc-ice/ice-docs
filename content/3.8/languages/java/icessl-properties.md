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

Specifies the password used to load the key store defined by `IceSSL.Keystore`. Depending on the key store type and security provider, this password can be used to verify the store’s integrity and to decrypt its contents, including certificates and certificate chains.

This property is distinct from `IceSSL.Password`, which Ice uses to recover private keys. One property does not default to the other.

For a password-protected PKCS12 key store, this property is generally required even when `IceSSL.Password` is configured. Without the correct key store password, initialization can fail or the store can be loaded without its certificates, leaving a private key without a usable certificate chain and causing TLS authentication to fail.

If this property is not defined, the result depends on the key store type and security provider. The provider may skip integrity checking, load only unencrypted contents, or reject the key store.

If `IceSSL.Keystore` and `IceSSL.Truststore` have the same value, Ice uses `IceSSL.KeystorePassword` to load the shared store; `IceSSL.TruststorePassword` is not used.

{% callout type="warning" %}
It is a security risk to use a plain-text password in a configuration file.
{% /callout %}

# IceSSL.KeystoreType

#### Synopsis

`IceSSL.KeystoreType=type` (Java)

#### Description

Specifies the Java key store type used to load the file defined by `IceSSL.Keystore`. Ice passes this value to `KeyStore.getInstance(String)`. The value must therefore identify a key store type supplied by an installed security provider and capable of loading the configured file.

Common values include:

- PKCS12 on standard JDKs and Android
- JKS on standard JDKs
- BKS on Android

If this property is not defined, Ice uses `KeyStore.getDefaultType()`. This default is controlled by the Java security property keystore.type. In standard JDK distributions, the configured default has been PKCS12 since Java 9; Android configures BKS.

The JDK reference implementation enables JKS/PKCS12 compatibility mode by default, allowing its default PKCS12 implementation to load JKS files. This behavior is implementation- and configuration-dependent.

On Android, omitting this property makes Ice instantiate a BKS key store. The BKS implementation does not probe the input stream for PKCS12 data. To use a PKCS12 key store on Android, set:

```
IceSSL.KeystoreType=PKCS12
```

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

Specifies the password used to load the trust store defined by `IceSSL.Truststore`. Depending on the key store type and security provider, this password can be used to verify the store’s integrity and to decrypt its contents, including trusted CA certificates.

For a password-protected PKCS12 trust store, this property is generally required to make its certificates available. Without the correct password, initialization can fail or the trust store can contain no usable trust anchors, causing peer certificate validation to fail.

If this property is not defined, the result depends on the key store type and security provider. The provider may skip integrity checking, load only unencrypted contents, or reject the trust store.

If `IceSSL.Truststore` and `IceSSL.Keystore` have the same value, Ice loads the shared store using `IceSSL.KeystorePassword`; `IceSSL.TruststorePassword` is not used.

{% callout type="warning" %}
It is a security risk to use a plain-text password in a configuration file.
{% /callout %}

# IceSSL.TruststoreType

#### Synopsis

`IceSSL.TruststoreType=type` (Java)

#### Description

Specifies the Java key store type used to load the file defined by `IceSSL.Truststore`. Ice passes this value to `KeyStore.getInstance(String)`. The value must therefore identify a key store type supplied by an installed security provider and capable of loading the configured file.

Common values include:

- `PKCS12` and `JKS` on standard JDKs and Android
- `BKS` on Android

If this property is not defined, Ice uses `KeyStore.getDefaultType()`. This default is controlled by the Java security property `keystore.type`. Standard JDK distributions have normally used `PKCS12` since Java 9, while Android uses `BKS`.

On standard JDK distributions, JKS/PKCS12 compatibility mode is enabled by default, allowing the default PKCS12 implementation to load JKS files. This behavior is implementation- and configuration-dependent.

Android’s default BKS implementation does not load PKCS12 data through the stream-based API used by Ice. To use a PKCS12 trust store on Android, set:

```properties
IceSSL.TruststoreType=PKCS12
```

If `IceSSL.Truststore` and `IceSSL.Keystore` have the same value, Ice loads the file once using `IceSSL.KeystoreType`. In this case, `IceSSL.TruststoreType` and `IceSSL.TruststorePassword` are not used.
{% /language-section %}
