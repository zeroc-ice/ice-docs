---
id: interface-inheritance
title: Interface Inheritance
---

# Interface Inheritance

Interfaces support inheritance. For example, we could extend our [Clock interface](../interfaces) to support the concept of an alarm clock:

```slice
module M
{
    interface AlarmClock extends Clock
    {
        idempotent TimeOfDay getAlarmTime();
        idempotent void setAlarmTime(TimeOfDay alarmTime)
            throws BadTimeValException;
    }
}
```

The semantics of this are the same as for C++ or Java: `AlarmClock` is a subtype of `Clock` and an `AlarmClock` proxy can be substituted wherever a `Clock` proxy is expected. Obviously, an `AlarmClock` supports the same `getTime` and `setTime` operations as a `Clock` but also supports the `getAlarmTime` and `setAlarmTime` operations.

Multiple interface inheritance is also possible. For example, we can construct a radio alarm clock as follows:

```slice
module M
{
    interface Radio
    {
        void setFrequency(long hertz) throws GenericException;
        void setVolume(long dB) throws GenericException;
    }

    enum AlarmMode { RadioAlarm, BeepAlarm }

    interface RadioClock extends Radio, AlarmClock
    {
        void setMode(AlarmMode mode);
        AlarmMode getMode();
    }
}
```

`RadioClock` extends both `Radio` and `AlarmClock` and can therefore be passed where a `Radio`, an `AlarmClock`, or a `Clock` is expected. The inheritance diagram for this definition looks as follows: RadioClock

![radioclock.gif](/attachments/3.8/interface-inheritance/radioclock.gif)

Interfaces that inherit from more than one base interface may share a common base interface. For example, the following definition is legal:

```slice
interface B { /* ... */ }
interface I1 extends B { /* ... */ }
interface I2 extends B { /* ... */ }
interface D extends I1, I2 { /* ... */ }
```

This definition results in the familiar diamond shape:DiamondShaped

![diamond.gif](/attachments/3.8/interface-inheritance/diamond.gif)

# Interface Inheritance Limitations

If an interface uses multiple inheritance, it must not inherit the same operation name from more than one base interface. For example, the following definition is illegal:

```slice
interface Clock
{
    void set(TimeOfDay time);                   // set time
}

interface Radio
{
    void set(long hertz);                       // set frequency
}

interface RadioClock extends Radio, Clock     // Illegal!
{
    // ...
}
```

This definition is illegal because `RadioClock` inherits two `set` operations, `Radio::set` and `Clock::set`. The Slice compiler makes this illegal because (unlike C++) many programming languages do not have a built-in facility for disambiguating the different operations. In Slice, the simple rule is that all inherited operations must have unique names. (In practice, this is rarely a problem because inheritance is rarely added to an interface hierarchy "after the fact". To avoid accidental clashes, we suggest that you use descriptive operation names, such as `setTime` and `setFrequency`. This makes accidental name clashes less likely.)

# Implicit Inheritance from Object

All Slice interfaces are ultimately derived from `Object`. For example, the [inheritance hierarchy](../interface-inheritance) would be shown more correctly as: bfde871b-f9b9-4d4c-b830-85c7c3d8e423

![implicit-object.gif](/attachments/3.8/interface-inheritance/implicit-object.gif)

Because all interfaces have a common base interface, we can pass any type of interface as that type. For example:

```slice
interface ProxyStore 
{
    idempotent void putProxy(string name, Object* o);
    idempotent Object* getProxy(string name);
}
```

`Object` is a Slice keyword (note the capitalization) that denotes the root type of the inheritance hierarchy. The `ProxyStore` interface is a generic proxy storage facility: the client can call `putProxy` to add a proxy of any type under a given name and later retrieve that proxy again by calling `getProxy` and supplying that name. The ability to generically store proxies in this fashion allows us to build general-purpose facilities, such as a [naming service](../icegrid) that can store proxies and deliver them to clients. Such a service, in turn, allows us to avoid hard-coding proxy details into clients and servers.

Inheritance from type `Object` is always implicit. For example, the following Slice definition is illegal:

```slice
interface MyInterface extends Object { /* ... */ } // Error!
```

It is understood that all interfaces inherit from type `Object`; you are not allowed to restate that.

Type `Object` is mapped to an abstract type by the various language mappings, so you cannot instantiate an Ice object of that type.

##### See Also

- [Operations](../operations)
