---
title: Dynamic Invocation
languages: [cpp, csharp, java, python, swift]
---

A typed proxy marshals the parameters of an operation and unmarshals its results with code generated from the Slice
definition of the operation. The [`ice_invoke`](api:Ice/ObjectPrx.ice_invoke) method of [ObjectPrx](api:Ice/ObjectPrx)
invokes an operation by name instead: the application supplies the marshaled in-parameters and receives the marshaled
reply. An application that forwards requests it does not unmarshal, or that calls operations without the generated code
for the target interface, uses `ice_invoke`.

## Invoking an Operation

`ice_invoke` accepts the following arguments:

- the name of the operation
- the operation mode, `Normal` or `Idempotent`
- an encapsulation holding the marshaled in-parameters
- an optional [request context](../request-contexts)

{% language-section name="invoking-an-operation" /%}

### Operation Mode

The Ice runtime sends the operation mode with the request, and uses it to decide whether it can
[retry](../automatic-retries) an invocation that fails after the request was sent. Pass `Idempotent` when you know the
operation is idempotent, or when you forward a request that arrived with this mode.

## Marshaling the In-Parameters

You marshal the in-parameters into an
[encapsulation](../../../encoding/basic-data-encoding#encoding-for-encapsulations): the required parameters in the order
of their declaration, followed by the optional parameters in the order of their tags, each marshaled as described in
[Ice Encoding](../../../encoding). For an operation without in-parameters, you can pass an empty byte sequence; the Ice
runtime then sends an empty encapsulation.

{% language-section name="marshaling-the-in-parameters" /%}

{% iflang langs="cpp,csharp,java,swift" %}

[Input and Output Streams](../../input-and-output-streams) shows how to read and write each kind of Slice type with
these streams.

{% /iflang %}

## Reading the Reply

For a twoway invocation, `ice_invoke` returns a success flag and an encapsulation:

- When the flag is `true`, the operation completed successfully, and the encapsulation holds the required
  out-parameters, followed by the required return value, followed by the optional out-parameters and optional return
  value in the order of their tags.
- When the flag is `false`, the operation completed with a user exception, and the encapsulation holds the
  [marshaled user exception](../../../encoding/data-encoding-for-exceptions).

For any other failure, `ice_invoke` throws a [local or dispatch exception](../../local-and-dispatch-exceptions).

For a oneway or datagram invocation, `ice_invoke` returns `true` and an empty byte sequence once the transport accepts
the request. For a batch oneway or batch datagram invocation, it returns `true` and an empty byte sequence once it adds
the request to the batch; the Ice runtime sends the request when it [flushes](../invocation-mode/batched-invocations)
the batch.

{% language-section name="reading-the-reply" /%}

## Forwarding Requests

An application can forward the requests that its object adapter receives with `ice_invoke`, without unmarshaling their
parameters. The forwarding code takes the encapsulation of the in-parameters from the incoming request, calls
`ice_invoke` on the target proxy with the operation name, mode, and context of the incoming request, and builds the
response from the success flag and the encapsulation that `ice_invoke` returns.

{% language-section name="forwarding-requests" /%}

## See Also

- [Dispatcher API](../../dispatch/dispatcher-api)
- [Basic Data Encoding](../../../encoding/basic-data-encoding)
- [Reply Message Body](../../../protocol/protocol-messages#reply-message-body)
