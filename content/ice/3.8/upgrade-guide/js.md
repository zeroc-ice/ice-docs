{% language-section name="packaging" %}

### NPM Package

The Ice NPM package has been renamed and converted into a scoped package: `@zeroc/ice`. This new package also includes
the `slice2js` compiler for Linux, macOS, and Windows.

### Upgrade Steps

1. Uninstall the old packages:

   ```shell
   npm uninstall ice slice2js
   ```

2. For preview builds, add the ZeroC NPM feed to your project’s **.npmrc** file:

   ```ini
   # Use ZeroC nightly registry for @zeroc packages
   @zeroc:registry=https://download.zeroc.com/nexus/repository/npm-nightly/
   ```

3. Install the new package:

   ```shell
   npm install @zeroc/ice --save
   ```

{% callout type="note" %}

The `slice2js` compiler can be executed by running `npx slice2js`.

{% /callout %}

{% /language-section %}

{% language-section name="proxy-creation-1" %}

```diff
-const proxy = communicator.stringToProxy("greeter: tcp -h localhost -p 4061");
-const greeter = GreeterPrx.uncheckedCast(proxy);
+const greeter = new GreeterPrx(communicator, "greeter:tcp -h localhost -p 4061");
```

{% /language-section %}

{% language-section name="proxy-creation-2" %}

## ES Modules

The `@zeroc/ice` package contains ES modules that Node.js and browsers both load, and `slice2js` always generates ES
modules. The package has no CommonJS entry point and no `lib/Ice.js` browser script.

Replace each `require` call that loads Ice or generated code with an `import` statement:

```diff
-const Ice = require("ice").Ice;
-const Demo = require("./generated/Hello").Demo;
+import { Ice } from "@zeroc/ice";
+import { Demo } from "./generated/Hello.js";
```

A TypeScript application that imports `Ice` from `"ice"` now imports it from `"@zeroc/ice"`.

A web application that loaded `node_modules/ice/lib/Ice.js` and its generated files with `<script>` elements, and then
used the global `Ice` object, now uses the same `import` statements as a Node.js application, and a JavaScript bundler
resolves the `@zeroc/ice` package; see [Bundling](#bundling).

Remove the `js:es6-module` and `js:cjs-module` file metadata from your Slice files, then recompile your Slice files with
the `slice2js` compiler of Ice 3.8.

## Mapping for Slice long

Ice 3.8 maps Slice `long` to the JavaScript `bigint` type and no longer provides the `Ice.Long` class. Every `long` that
your application receives, such as a return value, an out parameter or a field, is a `bigint`. Your application can pass
a `number` or a `bigint` for a `long` parameter.

```diff
-const size = new Ice.Long(0, 1024);
-const next = size.toNumber() + 1;
+const size = 1024n;
+const next = size + 1n;
```

Code that builds an `Ice.Long` from its `high` and `low` words computes the `bigint` as follows:

```js
const value = BigInt.asIntN(64, (BigInt(high) << 32n) | BigInt(low));
```

Code that reads the `high` and `low` words of an `Ice.Long` extracts them from the `bigint` as follows:

```js
const high = Number(BigInt.asUintN(32, value >> 32n));
const low = Number(BigInt.asUintN(32, value));
```

A Slice dictionary with a `long` key now maps to the built-in `Map` type instead of `Ice.HashMap`. In TypeScript,
`dictionary<long, string>` maps to `Map<bigint, string>`. The keys of this map are `bigint` values: `map.get(1n)` finds
an entry that `map.get(1)` does not. A dictionary with a struct key still maps to `Ice.HashMap`.

## Null Structs and Enumerators

Ice 3.7 marshaled a default-initialized struct in place of a `null` struct, and the first enumerator of the enumeration
in place of a `null` enumerator. Ice 3.8 reports an error when it marshals `null` for a non-optional struct or
enumeration. Set each non-optional struct and enumeration parameter, field, sequence element, and dictionary key and
value to a value before your application sends it.

## Bundling

The `js:module` file metadata directive no longer generates bundles with the Gulp Ice Builder. Bundle your application,
the `@zeroc/ice` package and your generated code with a standard JavaScript bundler. The `js:module` directive still
controls how other generated code imports your generated code, as described in
[Slice Metadata Directives](../slice/slice-metadata-directives).

The optional `@zeroc/slice2js` package compiles your Slice files as a step of your build. It provides a plug-in for Vite
(`@zeroc/slice2js/unplugin/vite`), Rollup (`@zeroc/slice2js/unplugin/rollup`), webpack
(`@zeroc/slice2js/unplugin/webpack`) and esbuild (`@zeroc/slice2js/unplugin/esbuild`). Install it as a development
dependency:

```shell
npm install --save-dev @zeroc/slice2js
```

Then add the plug-in to the configuration of your bundler. For example, with Vite:

```js
// vite.config.js
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

| Option      | Description                                                               |
| ----------- | ------------------------------------------------------------------------- |
| `inputs`    | The Slice files to compile, as file names or glob patterns.               |
| `outputDir` | The directory for the generated files.                                    |
| `include`   | Additional directories for the include file search path of `slice2js`.    |
| `args`      | Additional `slice2js` command-line options.                               |
| `cwd`       | The base directory for relative paths. Defaults to the current directory. |

## Node.js and Browsers

The `@zeroc/ice` package requires Node.js 22.16.0 or later. Ice supports the WebSocket transport with Node.js 24 or
later. Ice 3.8 does not support Internet Explorer.

{% /language-section %}
