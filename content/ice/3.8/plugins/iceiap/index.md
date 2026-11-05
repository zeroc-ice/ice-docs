---
title: IceIAP
---

IceIAP provides the `iap` and TLS-protected `iaps` transports for C++ and Swift clients on iOS. It uses
[Apple's External Accessory framework](https://developer.apple.com/documentation/externalaccessory) to communicate with
Ice servers on connected accessories. The accessory must provide the server side of the connection.

## Accessory Discovery

IceIAP connects to an accessory that iOS reports as connected, that advertises the endpoint's protocol (`com.zeroc.ice`
unless the endpoint specifies another), and that has the name, manufacturer, and model number the endpoint specifies, if
any.

## Installing IceIAP

{% language-section name="mapping" /%}

## Using IceIAP

An iAP endpoint in a proxy specifies attributes that are used to find and connect to a matching accessory. An iAP
endpoint has the following syntax:

`iap [-p protocol] [-n name] [-m manufacturer] [-o modelNumber] [-z]`

For example, to invoke on a proxy for the `greeter` object running on an accessory that implements the
`com.example.visitor` protocol, use the following stringified proxy:

`greeter:iap -p com.example.visitor`

The app's Info.plist lists the protocols the app uses, such as `com.example.visitor`, in the
[UISupportedExternalAccessoryProtocols](https://developer.apple.com/documentation/bundleresources/information-property-list/uisupportedexternalaccessoryprotocols)
key.

To use TLS over iAP, replace `iap` with `iaps` and configure the [SSL transport](../../runtime/ssl-transport).

## See Also

- [Plug-in Facility](../plug-in-facility)
- [Proxy and Endpoint Syntax](../../runtime/endpoint-syntax)
