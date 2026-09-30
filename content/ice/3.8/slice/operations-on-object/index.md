---
title: Operations on Object
---

The `Object` interface has a number of operations. We cannot define type `Object` in Slice because `Object` is a
keyword; regardless, here is what the definition of `Object` would look like if it were legal:

```slice
sequence<string> StringSeq;

interface Object // "Pseudo" Slice!
{
    idempotent void ice_ping();
    idempotent bool ice_isA(string typeId);
    idempotent string ice_id();
    idempotent StringSeq ice_ids();
}
```

Note that, apart from the illegal use of the keyword `Object` as the interface name, the four operations are standard
Slice operations and are mapped using the standard mapping rules.

## `ice_ping`

All Ice objects support the `ice_ping` operation. That operation is useful for debugging because it provides a basic
reachability test for an object: if the object exists and a message can successfully be dispatched to the object,
`ice_ping` simply returns without error. If the object cannot be reached or does not exist, the `ice_ping` invocation
throws a runtime exception that provides the reason for the failure.

## `ice_isA`

The `ice_isA` operation accepts a type ID (such as the string returned by `ice_id`) and tests whether the target object
implements this Slice interface returning `true` if it does. You can use this operation to check whether a target object
implements a particular interface. For example, referring to the diagram
[Implicit Inheritance from Object](../interface-inheritance) once more, assume that you are holding a proxy to a target
object of type `AlarmClock`. The table below illustrates the result of calling `ice_isA` on that proxy with various
arguments. (We assume that all types in the Implicit inheritance from Object diagram are defined in a module `Times`):

| **Argument**          | **Result** |
| --------------------- | ---------- |
| `::Ice::Object`       | `true`     |
| `::Times::Clock`      | `true`     |
| `::Times::AlarmClock` | `true`     |
| `::Times::Radio`      | `false`    |
| `::Times::RadioClock` | `false`    |

_Calling_`ice_isA`_on a proxy denoting an object of type AlarmClock._

As expected, `ice_isA` returns true for `::Times::Clock` and `::Times::AlarmClock` and also returns true for
`::Ice::Object`. Obviously, an `AlarmClock` supports neither the `Radio` nor the `RadioClock` interfaces, so `ice_isA`
returns false for these types.

## `ice_id`

The `ice_id` operation returns the [type ID](../type-ids) of the most-derived Slice interface implemented by the target
object.

## `ice_ids`

The `ice_ids` operation returns a sequence of [type IDs](../type-ids) that contains the type IDs of all Slice interfaces
implemented by the target object, in alphabetical order.

## See Also

- [Type IDs](../type-ids)
- [Interface Inheritance](../interface-inheritance)
