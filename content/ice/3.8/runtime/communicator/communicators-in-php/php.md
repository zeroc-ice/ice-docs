---
title: Communicators in PHP
sidebarLabel: In PHP
---

## PHP Request Semantics

In PHP terminology, a _request_ is the execution of a PHP script on behalf of a web client. Each request has its own
execution context, and PHP releases the resources a request acquired, including the objects created by the Ice for PHP
extension, when the request completes. A PHP worker process, for example in a PHP-FPM pool, handles many requests over
its lifetime.

## Using Communicators in PHP

A PHP script that needs to invoke an operation on a remote Ice object must initialize a communicator, obtain a proxy,
and make the invocation. For example:

```php
<?php
require_once 'Ice.php';
require_once 'Greeter.php';

$properties = Ice\createProperties();
$properties->load("config.client");

$initData = new Ice\InitializationData();
$initData->properties = $properties;

$communicator = Ice\initialize($initData);

$greeter = VisitorCenter\GreeterPrxHelper::uncheckedCast(
    $communicator->propertyToProxy("Greeter.Proxy"));

echo $greeter->greet("alice"), "\n";
```

When a request completes, Ice for PHP destroys every communicator that the request created and did not
[register](#registered-communicators-in-php), so a script usually does not call `destroy`.

Creating a communicator in each request means loading its configuration and opening its connections in each request, and
closing these connections when the request completes. Ice for PHP provides two ways to avoid this overhead:

- A [pre-configured property set](#managing-property-sets-in-php) avoids parsing a configuration file in each request.
- A [registered communicator](#registered-communicators-in-php) keeps its connections open between the requests that the
  same PHP process handles.

## Managing Property Sets in PHP

A PHP application can manually construct a [property set](../../properties-and-configuration) for configuring its
communicator. The Ice for PHP extension also provides a PHP-specific property set API that helps to minimize the
overhead associated with initializing a communicator, allowing you to configure a default property set along with an
unlimited number of named property sets (or _profiles_).

You can populate a property set using a configuration file, command-line options, or both. Property sets are initialized
using the normal Ice semantics: command-line options override any settings from a configuration file.

Ice for PHP creates these property sets when the PHP process loads the Ice for PHP extension, so changes to their
configuration take effect only when the PHP processes restart. A relative path name for a configuration file is usually
evaluated relative to the working directory of the PHP process.

### Default Property Set in PHP

The INI directives `ice.config` and `ice.options` specify the configuration file and the command-line options for the
default property set, respectively. These directives must appear in PHP's configuration file, which is usually named
`php.ini`:

```ini
; Snippet from php.ini on Linux
extension=IcePHP.so
ice.config=/opt/MyApp/default.cfg
ice.options="--Ice.Trace.Network=1"
```

### Profiles in PHP

Profiles are useful when several unrelated applications execute in the same web server, or when a script needs to choose
among multiple configurations. To configure your profiles, add an `ice.profiles` directive to PHP's configuration file.
The value of this directive is a file containing profile definitions:

```ini
; Snippet from php.ini on Linux
ice.profiles=/opt/MyApp/profiles
```

The profile definition file uses INI syntax:

```ini
[Production]
config=/opt/MyApp/prod.cfg
options="..."

[Debug]
config=/opt/MyApp/debug.cfg
options="--Ice.Trace.Network=3 ..."
```

The name of each profile is enclosed in square brackets. The configuration file and command-line options for each
profile are defined using the `config` and `options` entries, respectively.

### Using Property Sets in PHP

The `Ice\getProperties` function allows a script to obtain a copy of a property set. When called without an argument, or
with an empty string, the function returns the default property set. Otherwise, the function expects the name of a
configured profile and returns the property set associated with that profile. The return value is an instance of
`Ice\Properties`, or `null` if no matching profile was found.

Note that Ice for PHP always creates the default property set, which is empty if the `ice.config` and `ice.options`
directives are not defined. Also note that changes a script might make to a property set returned by this function have
no effect on other requests because the script is modifying a _copy_ of the original property set.

The following script uses the default property set instead of loading a configuration file in each request:

```php
<?php
require_once 'Ice.php';
require_once 'Greeter.php';

$initData = new Ice\InitializationData();
$initData->properties = Ice\getProperties();

$communicator = Ice\initialize($initData);

$greeter = VisitorCenter\GreeterPrxHelper::uncheckedCast(
    $communicator->propertyToProxy("Greeter.Proxy"));

echo $greeter->greet("alice"), "\n";
```

## Registered Communicators in PHP

A registered communicator outlives the request that created it: later requests that the same PHP process handles can
retrieve it by name and reuse it, with its open connections. A registered communicator is local to the process that
created it. PHP-FPM and similar servers spread requests over a pool of worker processes, so two requests, even from the
same session, can run in different processes, and each process creates and registers its own communicator.

The API for registered communicators consists of three functions:

- `Ice\register($communicator, $name, $expires=0)` Registers a communicator with the given name. Returns false if
  another communicator is already registered with this name, and true otherwise. You can register the same communicator
  under several names.
- `Ice\find($name)` Returns the communicator registered with the given name, or `null` if there is none.
- `Ice\unregister($name)` Removes the registration with the given name. Returns true if a communicator was registered
  with this name, and false otherwise.

An application typically uses registered communicators as follows:

```php
<?php
require_once 'Ice.php';
...

$communicator = Ice\find('Greeter');
if ($communicator === null) {
    $communicator = Ice\initialize();
    Ice\register($communicator, 'Greeter');
}
```

If another request of the same process registers a communicator named `Greeter` in the meantime, `Ice\register` returns
false, and this request uses its own communicator, which Ice for PHP destroys when the request completes.

Note that communicators consume resources such as threads, sockets, and memory, therefore an application should be
designed to minimize the number of communicators it registers. Using a suitable expiration timeout prevents registered
communicators from accumulating indefinitely.

### Lifetime of a Registered Communicator in PHP

Ice for PHP destroys a registered communicator when one of the following happens:

- **It expires.** When `$expires` is greater than zero, Ice for PHP destroys the communicator and removes all its
  registrations once no script has retrieved it with `Ice\find` for `$expires` minutes. Each call to `Ice\register`
  replaces the expiration time of the communicator, and the default value, 0, means the communicator never expires.
- **You remove its last registration.** After `Ice\unregister` removes the last name of a communicator, Ice for PHP
  destroys the communicator once every request that created it or retrieved it with `Ice\find` has completed.
- **The process terminates.**

Destroying a registered communicator yourself also removes all its registrations.

### Security Considerations for Registered Communicators in PHP

Any script that runs in the same PHP process can retrieve a registered communicator by its name: a registration name is
not an access control. For example, if a malicious script obtains a registered communicator that is configured with SSL
credentials, it can make secure invocations as if it were the trusted script. Run applications that do not trust each
other in separate PHP processes, such as separate PHP-FPM pools.
