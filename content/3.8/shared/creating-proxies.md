---
id: creating-proxies
title: Creating Proxies
---

This page describes all the ways an application can create a proxy.

# Creating a Proxy from a String

{% language-section name="lang-1" /%}

# Creating a Proxy from a Property

Rather than hard-coding a stringified proxy as the previous example demonstrated, an application can gain more flexibility by externalizing the proxy in a configuration property. For example, we can define a property that contains our stringified proxy as follows:

```
Greeter.Proxy=greeter:tcp -h localhost -p 4051
```

{% language-section name="lang-2" /%}

As an added convenience, `propertyToProxy` allows you to define subordinate properties that configure the proxy's local settings. The properties below demonstrate this feature:

```
Greeter.Proxy=greeter:tcp -h localhost -p 4061
Greeter.Proxy.EndpointSelection=Ordered
```

These additional properties simplify the task of customizing a proxy (as you can with [proxy methods](https://code.zeroc.com/manual/Ice/ObjectPrx)) without the need to change the application's code. The properties shown above are equivalent to the following statements:

{% language-section name="lang-3" /%}

The list of [supported proxy properties](../proxy-properties) includes the most commonly-used proxy settings. The communicator prints a warning by default if it does not recognize a subordinate property.

Note that proxy properties can themselves have proxy properties. For example, the following sets the `EndpointSelection` property on the default locator's router:

```config
Ice.Default.Locator.Router.EndpointSelection=Ordered
```

# Receiving a Proxy from an Operation

An application can also receive a proxy as the result of an Ice invocation. Consider the following Slice definitions:

```slice
interface Account { ... }
interface Bank 
{
    Account* findAccount(string id);
}
```

Invoking the `findAccount` operation returns a proxy for an `Account` object.

For example:

{% language-section name="lang-4" /%}

##### See Also

- [Communicator](../communicator)
- [Syntax for Stringified Proxies](../syntax-for-stringified-proxies)
- [Proxy Properties](../proxy-properties)
