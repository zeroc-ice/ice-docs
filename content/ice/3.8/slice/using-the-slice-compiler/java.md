{% language-section name="common-options-3" %}

## The Slice Compiler for Java

The Slice-to-Java compiler (`slice2java`) offers one additional option:

- `--list-generated` Emit a list of generated files in XML format.

## Compiling Slice Files with Gradle

The `com.zeroc.slice-tools` Gradle plugin compiles the Slice files of a Java or Android project with `slice2java` and
adds the generated Java files to the project's sources. Apply it after the Java or Android plugin:

```kotlin
plugins {
    java
    id("com.zeroc.slice-tools") version "3.8.+"
}
```

The plugin includes `slice2java` for Linux (x64 and arm64), macOS (arm64), and Windows (x64), and the Slice files of
Ice, Glacier2, IceBox, IceGrid, IceStorm, and DataStorm. It extracts them into the Gradle user home directory and passes
the directory of the Slice files to `slice2java` with `-I`, so your Slice files can include them, for example
`#include <Ice/Identity.ice>`.

### Project Settings

The `slice` block of the project holds the settings that apply to every Slice source set:

| Setting             | Description                                                                                                                                                                                                                                                                              |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `compilerArgs`      | Arguments the plugin passes to `slice2java`, such as `-D` options.                                                                                                                                                                                                                       |
| `includeSearchPath` | Directories the plugin passes to `slice2java` with `-I`.                                                                                                                                                                                                                                 |
| `sourceSets`        | The Slice source sets of the project, one for each Java or Android source set.                                                                                                                                                                                                           |
| `toolsPath`         | The directory that holds the `slice2java` compiler the plugin runs instead of the included one. With `toolsPath` set, the plugin passes only the directories of `includeSearchPath` to `slice2java` with `-I`; when your Slice files include Ice Slice files, add their directory to it. |

```kotlin
slice {
    includeSearchPath.from("../common/slice")
    compilerArgs.addAll("-DUSE_TRACING")
}
```

Set `toolsPath` on a platform for which the plugin includes no `slice2java`, such as macOS on x64.

### Slice Source Sets

The plugin adds a Slice source set to each Java source set, such as `main` and `test`, and to each Android source set,
such as `main`, `debug`, and `release`. A Slice source set compiles the `.ice` files under `src/<source set>/slice` by
default, and holds settings of its own:

| Setting             | Description                                                                                                         |
| ------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `srcDir`, `srcDirs` | Add directories of Slice files to the source set. `setSrcDirs` replaces the directories, including the default one. |
| `includeSearchPath` | Directories the plugin passes to `slice2java` with `-I` for this source set.                                        |
| `compilerArgs`      | Arguments the plugin passes to `slice2java` for this source set.                                                    |

For each source set, the plugin passes the include search path and the compiler arguments of the project, followed by
those of the source set. You configure a Slice source set in the `slice` block of its Java or Android source set:

```kotlin
sourceSets {
    main {
        slice {
            srcDirs("../slice")
            includeSearchPath.from("../common/slice")
        }
    }
}
```

The plugin registers a `compileSlice<SourceSet>` task for each source set, such as `compileSliceMain`, that generates
Java files into `build/generated/source/slice/<source set>`. The `compileSlice` task runs all of them.

### Java Projects

In a Java project, the plugin adds the Java files generated from each Slice source set to the Java sources of the same
source set: the Java compiler compiles the files generated from `src/test/slice` with the test classes.

### Android Projects

In an Android project, the plugin adds the generated Java files to the Java sources of each build variant, from the
Slice source sets that contribute to the variant: `main`, the build type, each product flavor, the combination of the
product flavors, and the combination of the product flavors and the build type. For example, the `freeDebug` variant of
a project with a `free` product flavor compiles the files generated from `src/main/slice`, `src/debug/slice`,
`src/free/slice`, and `src/freeDebug/slice`.

```groovy
android {
    sourceSets {
        main {
            slice {
                srcDir "../slice"
            }
        }
    }
}
```

{% /language-section %}
