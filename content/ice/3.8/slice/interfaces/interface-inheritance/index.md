---
title: Interface Inheritance
sidebarLabel: Inheritance
---

Interfaces support inheritance. For example, we could extend our [Clock interface](..) to support the concept of an
alarm clock:

```slice
module M
{
    interface AlarmClock extends Clock
    {
        TimeOfDay getAlarmTime();
        void setAlarmTime(TimeOfDay alarmTime);
    }
}
```

`AlarmClock` inherits all the operations of `Clock`: an `AlarmClock` object provides the `getTime` and `setTime`
operations in addition to its own `getAlarmTime` and `setAlarmTime` operations.

Multiple interface inheritance is also possible. For example, we can construct a radio alarm clock as follows:

```slice
module M
{
    interface Radio
    {
        void setFrequency(long hertz);
        void setVolume(long dB);
    }

    enum AlarmMode { RadioAlarm, BeepAlarm }

    interface RadioClock extends Radio, AlarmClock
    {
        void setMode(AlarmMode mode);
        AlarmMode getMode();
    }
}
```

`RadioClock` extends both `Radio` and `AlarmClock`, so a `RadioClock*` proxy can be used where a `Radio*`, an
`AlarmClock*`, or a `Clock*` proxy is expected. The inheritance diagram for this definition looks as follows:

![RadioClock inherits from Radio and AlarmClock, while AlarmClock inherits from Clock.](/images/ice/3.8/interface-inheritance/radioclock.svg)

_Radio clock interface inheritance._

Interfaces that inherit from more than one base interface may share a common base interface. For example, the following
definition is legal:

```slice
interface B { /* ... */ }
interface I1 extends B { /* ... */ }
interface I2 extends B { /* ... */ }
interface D extends I1, I2 { /* ... */ }
```

This definition results in the familiar diamond shape:

![D inherits from I1 and I2, which both inherit from B. Hollow arrowheads point toward each base interface.](/images/ice/3.8/interface-inheritance/diamond.svg)

## Interface Inheritance Limitations

An interface must not inherit operations with the same name, or with names that differ only in capitalization, from
unrelated base interfaces. An operation inherited through several paths from a common base interface, as in the diamond
above, is not a conflict. For example, the following definition is illegal:

```slice
interface Clock
{
    void set(TimeOfDay time);                   // set time
}

interface Radio
{
    void set(long hertz);                       // set frequency
}

interface RadioClock extends Radio, Clock     // Illegal!
{
    // ...
}
```

`RadioClock` inherits two `set` operations, `Radio::set` and `Clock::set`, and many programming languages cannot
disambiguate them. Descriptive operation names, such as `setTime` and `setFrequency`, avoid such clashes.

## Implicit Inheritance from Object

All Slice interfaces are ultimately derived from `Object`. For example, the radio clock inheritance hierarchy shown
earlier would be shown more correctly as:

![Radio and Clock implicitly inherit from Object. AlarmClock inherits from Clock, and RadioClock inherits from Radio and AlarmClock. Hollow arrowheads point toward the base interfaces.](/images/ice/3.8/interface-inheritance/implicit-object.svg)

Because all interfaces have this common base interface, an `Object*` parameter accepts a proxy of any type. For example:

```slice
interface ProxyStore
{
    idempotent void putProxy(string name, Object* o);
    idempotent Object* getProxy(string name);
}
```

`Object` is a Slice keyword (note the capitalization) that denotes the root type of the inheritance hierarchy: the
`ProxyStore` interface can store and return a proxy of any type. Inheritance from `Object` is always implicit: an
interface cannot list `Object` as a base interface.

Every interface inherits the four [operations of `Object`](../../operations-on-object): `ice_ping`, `ice_isA`, `ice_id`,
and `ice_ids`.

## See Also

- [Operations](../../operations)
