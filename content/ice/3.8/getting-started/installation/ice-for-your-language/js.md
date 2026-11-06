{% language-section name="language" %}

## Ice for JavaScript

The [@zeroc/ice](https://www.npmjs.com/package/@zeroc/ice) npm package provides Ice for JavaScript and its TypeScript
declarations, for Node.js and browsers. It includes the Slice-to-JavaScript compiler (`slice2js`) for Linux on x64 and
arm64, macOS on Apple silicon, and Windows on x64:

```shell
npm install @zeroc/ice
```

The [@zeroc/slice2js](https://www.npmjs.com/package/@zeroc/slice2js) package provides plug-ins that compile your Slice
files when [esbuild](https://esbuild.github.io/), [Rollup](https://rollupjs.org/), [Vite](https://vitejs.dev/), or
[webpack](https://webpack.js.org/) builds your application:

```shell
npm install --save-dev @zeroc/slice2js
```

See [Using the Slice Compiler](../../../slice/using-the-slice-compiler) for the plug-in settings.

{% /language-section %}
