{% language-section name="packaging" %}

### Java Gradle Projects

The `com.zeroc.slice-tools` Gradle plugin replaces the `com.zeroc.gradle.ice-builder.slice` plugin used in Ice 3.7 Java
Gradle projects. It includes the `slice2java` compiler for Linux, macOS, and Windows and the Ice Slice files.

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
        srcDir = '../slice'
        include = ["${projectDir}/../common/slice"]
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

{% callout type="note" %}

Prefer the conventional layout: put your Slice files in `src/main/slice`.

With that layout, you can omit `srcDirs` entirely—the plugin discovers it automatically.

{% /callout %}

{% /language-section %}

{% language-section name="proxy-creation-1" %}

```diff
-ObjectPrx proxy = communicator.stringToProxy("greeter: tcp -h localhost -p 4061");
-var greeter = GreeterPrx.uncheckedCast(proxy);
+var greeter =
+    GreeterPrx.createProxy(communicator, "greeter:tcp -h localhost -p 4061");
```

{% /language-section %}

{% language-section name="proxy-creation-2" %}

## Java Mapping

### Java 17

Ice for Java 3.8 requires Java 17.

### Communicator Creation

`Communicator` is now a class with public constructors, and `Util.initialize` has fewer overloads. The
`InitializationData` overload covers every case: if your application passed both command-line arguments and an
`InitializationData` to `Util.initialize`, parse the arguments into the `properties` field first:

```diff
-Communicator communicator = Util.initialize(args, initData);
+initData.properties = new Properties(args, initData.properties);
+Communicator communicator = new Communicator(initData);
```

### Thread Interrupts

Ice for Java now always supports thread interrupts: interrupting a thread blocked in an Ice call throws
`OperationInterruptedException`. The `Ice.ThreadInterruptSafe` property, which enabled this behavior in Ice 3.7, has
been removed.

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

### Using null for a Struct or Enum

Ice 3.7 accepted `null` for a struct or enum parameter, return value, or field, and marshaled a default-constructed
struct or the first enumerator in its place. Ice 3.8 requires a non-null value.

### Slice Loaders

Ice 3.8 removes the `ValueFactory` and `ValueFactoryManager` interfaces. Set the `sliceLoader` field of
`InitializationData` to create your own instances of Slice classes during unmarshaling. See
[Slice Loaders](../slice/user-defined-types/classes/slice-loaders).

The `java:package` metadata is deprecated: `slice2java` warns when it sees it. Replace it with `java:identifier` on the
module. `java:identifier` gives the full name of the Java package, where `java:package` gave a prefix. To keep the
generated code unchanged, use the package that `java:package` produced:

```diff
-["java:package:com.example"]
+["java:identifier:com.example.VisitorCenter"]
module VisitorCenter
```

Your `Ice.Package.<module>` or `Ice.Default.Package` property then keeps locating the generated classes, as in Ice 3.7.
If you move the module to another package, such as `com.example.visitorcenter`, these properties no longer apply:
install a `ModuleToPackageSliceLoader` for this module instead:

```java
var initData = new InitializationData();
initData.sliceLoader = new ModuleToPackageSliceLoader("::VisitorCenter", "com.example.visitorcenter");

try (Communicator communicator = new Communicator(initData)) {
    // ...
}
```

A Slice class with a compact ID also needs a Slice loader: pass its generated class to a `ClassSliceLoader`. Combine
several loaders with a `CompositeSliceLoader`:

```java
var initData = new InitializationData();
initData.sliceLoader = new CompositeSliceLoader(
    new ClassSliceLoader(AtmosphericConditions.class),
    new ModuleToPackageSliceLoader("::VisitorCenter", "com.example.visitorcenter"));
```

{% /language-section %}
