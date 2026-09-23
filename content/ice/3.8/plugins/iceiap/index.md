---
title: IceIAP
---

IceIAP is a transport plug-in that enables clients to communicate via the Apple iAP protocol reserved for accessories.

iAP allows iOS client applications to communicate with accessories over Bluetooth, the Apple Lightning connector, or the
Apple 30-pin connector. This section reviews some concepts that will help you as you learn more about IceIAP.

The IceIAP transport is based on
[Apple's External Accessory](https://developer.apple.com/documentation/externalaccessory) framework and enables Ice
clients running on iOS devices to communicate with Ice servers running on connected accessories. This transport is a
client-side only transport for iOS. It doesn't for instance provide the server-side transport that is required on the
accessory side. For information on how to implement the server side, you need to be a MFI licensee and get in touch with
ZeroC.

# Accessory Discovery

An accessory can be discovered based on a number of attributes:

- its name
- its manufacturer
- its model number
- an advertised protocol

An accessory endpoint can be configured with any of these attributes to find an accessory.

# Installing IceIAP

{% language-section name="lang-1" /%}

# Using IceIAP

An iAP endpoint in a proxy specifies attributes that are used to find and connect to a matching accessory. An iAP
endpoint has the following syntax:

`iap [-p` `PROTOCOL] [-n` `NAME] [-m` `MANUFACTURER] [-o` `MODELNUMBER]`

For example, to invoke on a proxy for the `greeter` object running on an accessory that implements the
`com.example.visitor` protocol, use the following stringified proxy:

`hello:iap -p com.example.visitor`

To use the secured iAP endpoint, replace `iap` with `iaps`.

##### See Also

- [Plug-in Facility](../plug-in-facility)
- [Proxy and Endpoint Syntax](../endpoint-syntax)
