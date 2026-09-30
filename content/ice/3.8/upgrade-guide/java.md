{% language-section name="lang-1" %}

### Java Gradle Projects

The `com.zeroc.slice-tools` Gradle plugin replaces the `com.zeroc.gradle.ice-builder.slice` plugin used in Ice 3.7 Java
Gradle projects. The Ice Builder plugin remains compatible with Ice 3.8; we recommend the `com.zeroc.slice-tools` plugin
for better integration with Ice 3.8.

The `com.zeroc.slice-tools` plugin includes the `slice2java` compiler for Linux, macOS and Windows and the Ice Slice
files. It is no longer necessary to install a separate _devel_ package to obtain the Slice compiler or the Slice files.

The plugin adds a `slice` block to each Java or Android source set. In this block, `srcDir` or `srcDirs` sets the
directories that hold your Slice files, `includeSearchPath` replaces the `include` setting of the Ice Builder plugin,
and `compilerArgs` replaces `args`.

**Before (3.7) ice-builder:**

```groovy
plugins {
  id "com.zeroc.gradle.ice-builder.slice" version "1.5.0"
}

slice {
    java {
        include = ["${projectDir}"]
        srcDir = '.'
    }
}
```

**Now (3.8) slice-tools:**

- New configuration using Kotlin DSL:

  ```kotlin
  // build.gradle.kts

  plugins {
      // Apply the Slice-tools plugin to enable Slice compilation.
      id("com.zeroc.slice-tools") version "3.8.+"
  }

  sourceSets {
      main {
          slice {
              // Build all Slice files from the "../slice" subdirectory.
              srcDirs("../slice")
              // Search the "../common/slice" directory for included Slice files.
              includeSearchPath.from("../common/slice")
          }
      }
  }
  ```

- New configuration using Groovy DSL:

  ```groovy
  // build.gradle

  plugins {
      // Apply the Slice-tools plugin to enable Slice compilation.
      id "com.zeroc.slice-tools" version "3.8.+"
  }

  sourceSets {
      main {
          slice {
              srcDirs "../slice"
              includeSearchPath.from("../common/slice")
          }
      }
  }
  ```

{% callout type="info" %}

Prefer the conventional layout: put your Slice files in `src/main/slice`.

With that layout, you can omit `srcDirs` entirely—the plugin discovers it automatically.

{% /callout %}

{% /language-section %}

{% language-section name="lang-2" %}

```diff
-ObjectPrx proxy = communicator.stringToProxy("greeter: tcp -h localhost -p 4061");
-var greeter = GreeterPrx.uncheckedCast(proxy);
+var greeter =
+    GreeterPrx.createProxy(communicator, "greeter:tcp -h localhost -p 4061");
```

{% /language-section %}

{% language-section name="lang-3" %}

## Java Mapping

### Java 17

Ice for Java 3.8 requires Java 17. Ice for Java 3.7 required Java 8.

### Communicator Creation

`Communicator` is now a class with public constructors, and `Util.initialize` keeps only the overloads that accept no
argument, an argument array, an argument array with a list for the remaining arguments, or an `InitializationData`. When
your application passes both command-line arguments and an `InitializationData`, parse the arguments into the
`properties` field first:

```diff
-Communicator communicator = Util.initialize(args, initData);
+initData.properties = new Properties(args, initData.properties);
+Communicator communicator = new Communicator(initData);
```

Ice 3.8 removes the `com.zeroc.Ice.Application` and `com.zeroc.Glacier2.Application` helper classes. Create the
communicator in `main` with a `try`-with-resources statement, and register a shutdown hook when the application shuts
down the communicator on Ctrl+C:

```java
try (Communicator communicator = new Communicator(args)) {
    ObjectAdapter adapter = communicator.createObjectAdapterWithEndpoints("GreeterAdapter", "tcp -p 4061");
    adapter.add(new Chatbot(), new Identity("greeter", ""));
    adapter.activate();

    Thread mainThread = Thread.currentThread();
    Runtime.getRuntime().addShutdownHook(new Thread(() -> {
        communicator.shutdown();
        try {
            mainThread.join();
        } catch (InterruptedException e) {
            assert false;
        }
    }));

    communicator.waitForShutdown();
}
```

### Executor

The `dispatcher` field of `InitializationData` is now named `executor`. Its type is unchanged.

```diff
-initData.dispatcher = (runnable, connection) -> SwingUtilities.invokeLater(runnable);
+initData.executor = (runnable, connection) -> SwingUtilities.invokeLater(runnable);
```

### Thread Hooks and Interrupts

Ice 3.8 removes the `ThreadHookPlugin` class. Set the `threadStart` and `threadStop` fields of `InitializationData`
instead.

Ice 3.8 removes the `Ice.ThreadInterruptSafe` property: Ice for Java 3.8 supports thread interrupts without it. Remove
this property from your configuration: setting it now fails, like setting any other unknown Ice property.

### Exceptions

Ice 3.8 removes the `com.zeroc.Ice.Exception` class, the base class of `com.zeroc.Ice.LocalException` in Ice 3.7.
`LocalException` now derives directly from `java.lang.RuntimeException`, and `com.zeroc.Ice.UserException` derives from
`java.lang.Exception` as in Ice 3.7. Catch `LocalException` where your code caught `com.zeroc.Ice.Exception`:

```diff
 try {
     greeter.greet("alice");
-} catch (com.zeroc.Ice.Exception ex) {
+} catch (com.zeroc.Ice.LocalException ex) {
     ex.printStackTrace();
 }
```

### Proxy Timeouts

The `ice_getInvocationTimeout` and `ice_getLocatorCacheTimeout` proxy methods now return a `java.time.Duration`. In Ice
3.7, they returned an `int`: a number of milliseconds for the invocation timeout and a number of seconds for the locator
cache timeout.

```diff
-int invocationTimeout = greeter.ice_getInvocationTimeout();
-int locatorCacheTimeout = greeter.ice_getLocatorCacheTimeout();
+long invocationTimeout = greeter.ice_getInvocationTimeout().toMillis();
+long locatorCacheTimeout = greeter.ice_getLocatorCacheTimeout().toSeconds();
```

The `ice_invocationTimeout` and `ice_locatorCacheTimeout` proxy methods accept an `int`, as in Ice 3.7, or a `Duration`.

### Null Structs and Enums

Marshaling a `null` struct or a `null` enum value now throws `NullPointerException`. Ice 3.7 marshaled a
default-constructed struct or the first enumerator of the enumeration in its place. Set each struct and enum parameter,
return value and field to a non-null value before your application sends it.

### Custom Loggers

The `Logger` interface now extends `java.lang.AutoCloseable`, so a class that implements `Logger` must implement
`close`. Ice calls `close` on a logger installed with a `LoggerPlugin` when it destroys the communicator. Your
application closes a logger that it sets in the `logger` field of `InitializationData`.

### Slice Loaders

Ice 3.8 removes the `ValueFactory` and `ValueFactoryManager` interfaces, and the `compactIdResolver` field of
`InitializationData`. Set the `sliceLoader` field of `InitializationData` to create your own instances of Slice classes
during unmarshaling:

```diff
-communicator.getValueFactoryManager().add(typeId -> new NodeI(), Node.ice_staticId());
+initData.sliceLoader = typeId -> Node.ice_staticId().equals(typeId) ? new NodeI() : null;
```

Ice 3.8 locates the generated class for a Slice class with a compact ID only through a Slice loader that you install. A
Slice class or exception that you remap with the `java:identifier` metadata needs one too. Pass the generated classes to
a `ClassSliceLoader`, which resolves their type IDs and compact IDs. When `java:identifier` remaps a whole Slice module
to a Java package, a `ModuleToPackageSliceLoader` resolves the type IDs of all the classes and exceptions in this
module:

```java
var initData = new InitializationData();
initData.sliceLoader = new CompositeSliceLoader(
    new ClassSliceLoader(AtmosphericConditions.class),
    new ModuleToPackageSliceLoader("::VisitorCenter", "com.example.visitorcenter"));

try (Communicator communicator = new Communicator(initData)) {
    // ...
}
```

The `Ice.Package.<module>` and `Ice.Default.Package` properties still locate the classes and exceptions of a module
remapped with the deprecated `java:package` metadata. See [Slice Loaders](../slice-loaders) for more information.

{% /language-section %}
