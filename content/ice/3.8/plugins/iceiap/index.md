---
title: IceIAP
---

IceIAP provides the `iap` and TLS-protected `iaps` transports for C++ and Swift clients on iOS. It uses
[Apple's External Accessory framework](https://developer.apple.com/documentation/externalaccessory) to communicate with
Ice servers on connected accessories. The accessory must provide the server side of the connection.

## Accessory Discovery

An accessory can be discovered based on a number of attributes:

- its name
- its manufacturer
- its model number
- an advertised protocol

IceIAP searches the accessories that iOS reports as connected. The accessory must advertise the endpoint's protocol,
which defaults to `com.zeroc.ice`. If you specify a name, manufacturer, or model number, each specified value must match
exactly.

## Installing IceIAP

{% language-section name="lang-1" /%}

## Using IceIAP

An iAP endpoint in a proxy specifies attributes that are used to find and connect to a matching accessory. An iAP
endpoint has the following syntax:

`iap [-p protocol] [-n name] [-m manufacturer] [-o modelNumber] [-z]`

For example, to invoke on a proxy for the `greeter` object running on an accessory that implements the
`com.example.visitor` protocol, use the following stringified proxy:

`greeter:iap -p com.example.visitor`

To use TLS over iAP, replace `iap` with `iaps` and configure the [SSL transport](../ssl-transport).

## See Also

- [Plug-in Facility](../plug-in-facility)
- [Proxy and Endpoint Syntax](../endpoint-syntax)
