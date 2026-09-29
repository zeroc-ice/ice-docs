{% language-section name="lang-1" %}

### Java Gradle Projects

The `com.zeroc.gradle.ice-builder.slice` Gradle plugin used in Ice 3.7 Java Gradle projects have been replaced by a new
Gradle plugin `com.zeroc.ice.slice-tools`

The new `com.zeroc.ice.slice-tools` package includes the `slice2java` compiler for Linux, macOS and Windows and the Ice
Slice files. It is no longer necessary to install a separate _devel_ package to obtain the Slice compiler or the Slice
files.

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
      id("com.zeroc.ice.slice-tools") version "3.8.+"
  }

  sourceSets {
      main {
          slice {
              // Build all Slice files from the "../slice" subdirectory.
              srcDirs("../slice")
          }
      }
  }
  ```

- New configuration using Groovy DSL:

  ```groovy
  // build.gradle

  plugins {
      // Apply the Slice-tools plugin to enable Slice compilation.
      id "com.zeroc.ice.slice-tools" version "3.8.+"
  }

  sourceSets {
      main {
          slice {
              srcDirs "../slice"
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

{% /language-section %}
