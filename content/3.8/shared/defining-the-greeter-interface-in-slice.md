---
id: defining-the-greeter-interface-in-slice
title: Defining the Greeter Interface in Slice
---

The first step of writing an Ice application is to define the contract between our client and server using
[Slice](../the-slice-language). For this example, we just want a single operation that accepts a name, and returns a
greeting computed from this name. Let’s see how to express this in Slice.

## Slice Files

All Slice definitions must be stored in [Slice files](../slice-source-files), i.e. files ending with a `.ice` extension.
For this example, we write our definitions in a Slice file named `Greeter.ice`.

## Writing the `Greeter.ice` Slice File

We start by adding a [module](../modules) to our Slice file. Modules are containers that can be used to organize Slice
definitions into named groups. Slice requires that all definitions be contained within modules. So at this point, our
Slice file looks like:

{% language-section name="lang-1" /%}

Now that we have a module, there’s only one more thing we need before we can define our operation: an
[interface](../interfaces). Interfaces are at the core of Ice, as they specify the remote API (the ‘contract’) between
clients and servers. So how you split your operations among interfaces can have large implications for the structure of
your application. But, with only one operation, there are no such considerations in this example:

```slice
    interface Greeter
    {
        // ... operations go here
    }
```

Finally, we can write our operation. It should take a name and return a greeting. So we write an operation named `greet`
which takes a single `string` parameter (named `name`) and returns a `string`:

{% language-section name="lang-2" /%}

Notice that there is no implementation for our operation. Slice is only for defining the API between clients and
servers. How operations get called or implemented is not the domain of Slice, and will be covered separately in the
following pages.

Putting it all together (and adding some doc-comments), here is what our final Slice file looks like:

{% language-section name="lang-3" /%}
