{% language-section name="common-options-1" %}

- `--depend` Print dependency information in Makefile format to standard output by default, or to the file specified by
  the `--depend-file` option.

{% /language-section %}

{% language-section name="common-options-2" %}

- `--depend-json` Print dependency information in JSON format to standard output by default, or to the file specified by
  the `--depend-file` option.

{% /language-section %}

{% language-section name="common-options-3" %}

## The Slice Compiler for JavaScript

The Slice-to-JavaScript compiler (`slice2js`) offers the following command-line options in addition to the standard
options:

- `--stdout` Print generated code to standard output.
- `--typescript` Generate TypeScript declaration file.
- `--depend-json` Print dependency information in JSON format to standard output by default, or to the file specified by
  the `--depend-file` option. No code is generated when this option is specified. The output consists of the complete
  list of Slice files that the input Slice files depend on through direct or indirect inclusion.

## Running slice2js

The `@zeroc/ice` package includes the `slice2js` compiler for Linux (x64 and arm64), macOS (arm64) and Windows (x64).
Run it with `npx`:

```shell
npx slice2js --output-dir src/generated slice/Greeter.ice
```

The `slice2js` command adds the Slice files of Ice, which the package includes, to the include search path, so your
Slice files can include them, as in `#include <Ice/Identity.ice>`.

## Compiling Slice Files During the Build

The optional `@zeroc/slice2js` package provides a plug-in that compiles your Slice files at the start of each build of a
Vite, Rollup, webpack or esbuild project. Install it as a development dependency:

```shell
npm install --save-dev @zeroc/slice2js
```

This package runs the compiler through its plug-in and its programmatic API; the `slice2js` command comes from
`@zeroc/ice`.

Import the plug-in for your bundler from its entry point:

| Bundler | Entry point                        |
| ------- | ---------------------------------- |
| Vite    | `@zeroc/slice2js/unplugin/vite`    |
| Rollup  | `@zeroc/slice2js/unplugin/rollup`  |
| webpack | `@zeroc/slice2js/unplugin/webpack` |
| esbuild | `@zeroc/slice2js/unplugin/esbuild` |

Then add the plug-in to the configuration of your bundler. For example, with Vite:

```js {% title="vite.config.js" %}
import slice2js from "@zeroc/slice2js/unplugin/vite";

export default {
    plugins: [
        slice2js({
            inputs: ["slice/*.ice"],
            outputDir: "src/generated",
            include: ["slice"],
            args: ["--typescript"],
        }),
    ],
};
```

The plug-in accepts the following options:

| Option      | Description                                                                                                                       |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `inputs`    | The Slice files to compile, as file names or glob patterns. Required.                                                             |
| `outputDir` | The directory for the generated files. The plug-in creates it if it doesn't exist. Required.                                      |
| `include`   | Additional directories for the include search path of `slice2js`.                                                                 |
| `args`      | Additional `slice2js` command-line options, such as `--typescript`.                                                               |
| `cwd`       | The directory against which the relative paths in `inputs`, `outputDir` and `include` resolve. Defaults to the current directory. |
| `toolsPath` | The directory of a `slice2js` executable that replaces the one in the package.                                                    |
| `slicePath` | The directory of Slice files that replaces the Slice files of Ice in the include search path.                                     |

The plug-in skips the compilation when no file matches `inputs`, and fails the build when `slice2js` reports an error.

To compile Slice files from your own build script, call `runSlice2js` from `@zeroc/slice2js/unplugin`, which takes the
same options as the plug-in, or `compile` from `@zeroc/slice2js`, which takes the `slice2js` command-line arguments and
returns the exit code of the compiler:

```js
import { runSlice2js } from "@zeroc/slice2js/unplugin";

await runSlice2js({ inputs: ["slice/*.ice"], outputDir: "src/generated", args: ["--typescript"] });
```

{% /language-section %}
