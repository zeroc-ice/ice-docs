---
title: Communicators in PHP
---

## PHP Request Semantics

In PHP terminology, a _request_ is the execution of a PHP script on behalf of a Web client. Each request essentially
runs in its own instance of the PHP interpreter, isolated from any other requests. Upon the completion of a request, the
interpreter reclaims memory and other resources that were acquired during the request, including objects created by the
Ice for PHP extension.

## Using Communicators in PHP

A PHP script that needs to invoke an operation on a remote Ice object must initialize a communicator, obtain a proxy,
and make the invocation. For example, here is a minimal (but complete) Ice script:

```php
<?php
require_once 'Ice.php';
require_once 'Greeter.php';

$configFileProperties = Ice\createProperties();
$configFileProperties->load("config.client");
$initData = new Ice\InitializationData();
$initData->properties = Ice\createProperties($argv, $configFileProperties);

$communicator = Ice\initialize($initData);

$greeter = VisitorCenter\GreeterPrxHelper::uncheckedCast(
    $communicator->propertyToProxy("Greeter.Proxy"));

$greeting = $greeter->greet(get_current_user());
echo "$greeting\n";

$communicator->destroy(); // optional, see below
```

Ice for PHP automatically destroys any communicator that was created during a request. This means a script can usually
omit the call to `destroy` unless there is an application-specific reason to destroy the communicator explicitly.

Although the automatic destruction of communicators is convenient, it is important to consider the performance
characteristics of this script. Specifically, each execution of the script involves the following activities:

1. Create an Ice property set
2. Load and parse a property file
3. Initialize a communicator with the given configuration properties
4. Obtain a proxy for the remote Ice object
5. Establish a socket connection to the server
6. Send a request message and wait for the reply
7. Destroy the communicator, which closes the socket connection

Of primary concern are the activities that involve system calls, such as opening and reading files, creating and using
network connections, and so on. The overhead incurred by these calls may not matter if the script is only executed
infrequently, but for an application with high request rates it is necessary to minimize this overhead:

- A [pre-configured property set](#managing-property-sets-in-php) eliminates the need to parse a property file in each
  request.
- [Registering a communicator](#registered-communicators-in-php) avoids the need to create and destroy a communicator in
  every request.

## Managing Property Sets in PHP

A PHP application can manually construct a [property set](../../properties-and-configuration) for configuring its
communicator. The Ice for PHP extension also provides a PHP-specific property set API that helps to minimize the
overhead associated with initializing a communicator, allowing you to configure a default property set along with an
unlimited number of named property sets (or _profiles_).

You can populate a property set using a configuration file, command-line options, or both. Property sets are initialized
using the normal Ice semantics: command-line options override any settings from a configuration file.

Ice for PHP creates these property sets when the Ice for PHP extension is loaded, typically during web server startup,
which means any subsequent changes you might make to the configuration have no effect until the web server is restarted.
Also keep in mind that specifying a relative path name for a configuration file usually means the path name is evaluated
relative to the web server's working directory.

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

{% callout type="warning" %}

In modern PHP setups, it is recommended to run each application in its own PHP process pool and to avoid sharing
resources between untrusted applications. Using **PHP-FPM** is the preferred option for this setup.

{% /callout %}

### Using Property Sets in PHP

The `Ice\getProperties` function allows a script to obtain a copy of a property set. When called without an argument, or
with an empty string, the function returns the default property set. Otherwise, the function expects the name of a
configured profile and returns the property set associated with that profile. The return value is an instance of
`Ice\Properties`, or `null` if no matching profile was found.

Note that Ice for PHP always creates the default property set, which is empty if the `ice.config` and `ice.options`
directives are not defined. Also note that changes a script might make to a property set returned by this function have
no effect on other requests because the script is modifying a _copy_ of the original property set.

Now we can modify our script to use `Ice\getProperties` and avoid the need to load a configuration file in each request:

```php
<?php
require_once 'Ice.php';
require_once 'Greeter.php';

$initData = new Ice\InitializationData();
$initData->properties = Ice\createProperties($argv, Ice\getProperties());

$communicator = Ice\initialize($initData);

$greeter = VisitorCenter\GreeterPrxHelper::uncheckedCast(
    $communicator->propertyToProxy("Greeter.Proxy"));

$greeting = $greeter->greet(get_current_user());
echo "$greeting\n";
```

## Registered Communicators in PHP

When a request completes, the Ice extension destroys every communicator that the script created and did not register.
For example, a session-based PHP application can create a communicator for each new session and register it for reuse in
subsequent requests of the same session. Reusing a communicator in this way avoids the overhead associated with creating
and destroying a communicator in each request. Furthermore, it allows network connections established by the Ice
communicator to remain open and available for use in another request.

### Limitations of Registered Communicators in PHP

A communicator object is local to the process that created it, which in the case of PHP is usually a web server process.
The usefulness of a registered communicator is therefore limited to situations in which an application can ensure that
subsequent page requests are handled by the same web server process as the one that originally created the registered
communicator. For example, registered communicators would not be appropriate in a typical CGI configuration because the
CGI process terminates at the end of each request. A simple (but often impractical) solution is to configure your web
server to use a single persistent process. The topic of configuring a web server to take advantage of registered
communicators is outside the scope of this documentation.

### Using Registered Communicators in PHP

The API for registered communicators consists of three functions:

- `Ice\register($communicator, $name, $expires=0)` Registers a communicator with the given name. Returns false if
  another communicator is already registered with this name, and true otherwise.
- `Ice\find($name)` Returns the communicator registered with the given name, or `null` if there is none.
- `Ice\unregister($name)` Removes the registration with the given name. Returns true if a communicator was registered
  with this name, and false otherwise.

You can register a communicator with several names. The Ice extension destroys a registered communicator when one of the
following happens:

- **It expires.** When `$expires` is greater than zero, the Ice extension destroys the communicator and removes all its
  registrations once no script has retrieved it with `Ice\find` for `$expires` minutes. Each call to `Ice\register`
  replaces the expiration time of the communicator, and the default value, 0, means the communicator never expires.
- **You remove its last registration.** After `Ice\unregister` removes the last name of a communicator, the Ice
  extension destroys the communicator once every request that created it or retrieved it with `Ice\find` has completed.
- **The process terminates.**

Destroying a registered communicator yourself also removes all its registrations.

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

Note that communicators consume resources such as threads, sockets, and memory, therefore an application should be
designed to minimize the number of communicators it registers. Using a suitable expiration timeout prevents registered
communicators from accumulating indefinitely.

### Security Considerations for Registered Communicators in PHP

There are risks associated with allowing untrusted applications to gain access to a registered communicator. For
example, if a malicious script obtains a registered communicator that is configured with SSL credentials, the script
could potentially make secure invocations as if it were the trusted script.

{% callout type="warning" %}

In modern PHP setups, it is recommended to run each application in its own PHP process pool and to avoid sharing
resources between untrusted applications. Using **PHP-FPM** is the preferred option for this setup.

{% /callout %}
