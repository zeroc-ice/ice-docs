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
