{% language-section name="language" %}

## Ice for Java

Ice for Java is a set of JAR files on Maven Central, in the `com.zeroc` group, for Java 17 and later. The Slice Tools
Gradle plugin, `com.zeroc.slice-tools`, compiles the Slice files of your project with the Slice-to-Java compiler
(`slice2java`) as part of the build. For example, in `build.gradle.kts`:

```kotlin
plugins {
    // Compiles the Slice files in src/main/slice.
    id("com.zeroc.slice-tools") version "3.8.+"
}

dependencies {
    implementation("com.zeroc:ice:3.8.+")
}
```

| Artifact                                                                                             | Contents                              |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------- |
| [com.zeroc:ice](https://central.sonatype.com/artifact/com.zeroc/ice)                                 | The Ice runtime.                      |
| [com.zeroc:glacier2](https://central.sonatype.com/artifact/com.zeroc/glacier2)                       | The Glacier2 client API.              |
| [com.zeroc:icebox](https://central.sonatype.com/artifact/com.zeroc/icebox)                           | The IceBox server and the IceBox API. |
| [com.zeroc:icebt](https://central.sonatype.com/artifact/com.zeroc/icebt)                             | The Bluetooth transport, for Android. |
| [com.zeroc:icediscovery](https://central.sonatype.com/artifact/com.zeroc/icediscovery)               | The IceDiscovery plug-in.             |
| [com.zeroc:icegrid](https://central.sonatype.com/artifact/com.zeroc/icegrid)                         | The IceGrid client API.               |
| [com.zeroc:icelocatordiscovery](https://central.sonatype.com/artifact/com.zeroc/icelocatordiscovery) | The IceLocatorDiscovery plug-in.      |
| [com.zeroc:icestorm](https://central.sonatype.com/artifact/com.zeroc/icestorm)                       | The IceStorm client API.              |

See the [Slice Tools plugin documentation](https://github.com/zeroc-ice/ice/tree/3.8/java/tools/slice-tools) for its
settings.

{% /language-section %}
