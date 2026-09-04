---
id: object-adapter-properties
title: Object Adapter Properties
---

{% language-section name="lang-1" /%}

# _adapter_.ProxyOptions

#### Synopsis

`adapter.ProxyOptions=options`

#### Description

Specifies the proxy options for proxies created by the object adapter. The value is a string representing the proxy
options as they would be specified in a stringified proxy.

# _adapter_.PublishedEndpoints

#### Synopsis

`adapter.PublishedEndpoints=endpoints`

#### Description

The published endpoints of an object adapter can be set using `adapter.PublishedEndpoints`. The exact algorithm is
described in [Published Object Adapter Endpoints](../object-adapter-endpoints).

{% language-section name="lang-2" /%}

# _adapter_.Router

#### Synopsis

`adapter.Router=router`

#### Description

Specifies a [router](../glacier2) for this object adapter. The value is a stringified proxy to an `Ice::Router` object.
Defining a router allows the object adapter to receive callbacks from the router over a
[bidirectional connection](../bidirectional-connections), thereby avoiding the need for the router to establish a
connection back to the object adapter.

A router can only be assigned to one object adapter. Specifying the same router for more than one object adapter results
in undefined behavior. The default value is no router.

As a proxy property, you can configure additional [aspects of the proxy](../proxy-properties) using properties.

{% language-section name="lang-3" /%}
