---
title: Writing a Browser Greeter Client
sidebarLabel: Writing a Browser Client
languages: [js]
---

This page shows how to write a Greeter client that runs in a web browser, as a React application written in TypeScript.
It calls the same `greet` operation as the [Node.js client](../writing-a-greeter-client); it differs in its transport,
in how it creates and destroys its communicator, and in how you build and run it.

You can find the complete source code for this client in the
[ice-demos repository](https://github.com/zeroc-ice/ice-demos/tree/3.8/js/Ice/react-greeter).

## Compile the Slice File During the Build

The client is built with [Vite](https://vite.dev). The `@zeroc/slice2js` package provides a Vite plug-in that runs
`slice2js` on `Greeter.ice` during the build, and generates `Greeter.js` and the TypeScript declarations in
`Greeter.d.ts`:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import slice2js from "@zeroc/slice2js/unplugin/vite";

export default defineConfig({
    plugins: [
        react(),
        slice2js({
            inputs: ["src/Greeter.ice"],
            args: ["--typescript"],
            outputDir: "src",
        }),
    ],
});
```

See [Using the Slice Compiler](../../slice/using-the-slice-compiler) for the plug-ins and the `slice2js` options.

## Client Implementation

The client is a React component, `GreeterApp`, with a form: you enter a name, click **Send Greeting**, and the component
displays the greeting returned by the server.

### 1. Create a Communicator and a Greeter Proxy

A browser application has no command line, so the client creates its communicator without arguments. It creates the
communicator and the proxy once, when the component mounts, and keeps them in refs so that each click reuses them:

```typescript
const communicatorRef = useRef<Ice.Communicator | null>(null);
const greeterRef = useRef<VisitorCenter.GreeterPrx | null>(null);

useEffect(() => {
    communicatorRef.current = new Ice.Communicator();
    greeterRef.current = new VisitorCenter.GreeterPrx(
        communicatorRef.current,
        "greeter:ws -h localhost -p 4061",
    );

    return () => {
        communicatorRef.current?.destroy();
    };
}, []);
```

The stringified proxy uses the `ws` transport: in a browser, Ice for JavaScript supports only the `ws` and `wss`
transports.

### 2. Make an Invocation

When you submit the form, the component calls `greet` on the proxy and awaits the greeting:

```typescript
const sendGreeting = useCallback(async () => {
    try {
        const greeting = await greeterRef.current!.greet(state.name.trim());
        // Display the greeting.
        // ...
    } catch (error) {
        // Display the error, for example when no server is listening on port 4061.
        // ...
    }
}, [state.name]);
```

### 3. Cleanup

The function returned by the `useEffect` callback runs when the component unmounts: it destroys the communicator, which
closes its connections.

## Running the Client

Ice for JavaScript has limited server-side support, so the client calls a Greeter server written in another language.
The Python Config server of the demos hosts a Greeter object with identity `greeter`, and its object adapter listens on
port 4061 with the transport set by `Ice.Default.Protocol`. The server is a [uv](https://docs.astral.sh/uv/) project.
From the root of an ice-demos `3.8` checkout, start it with the `ws` transport:

```shell
cd python/Ice/config/server
uv run slice2py ../slice/Greeter.ice
uv run main.py --Ice.Default.Protocol=ws
```

Then, in another terminal, install the client's dependencies and start the Vite development server:

```shell
cd js/Ice/react-greeter
npm install
npm run dev
```

Open <http://localhost:5173> in your browser and click **Send Greeting**. The page shows the greeting returned by the
server: `Hello, React!`.

## See Also

- [Writing a Greeter Client](../writing-a-greeter-client)
- [Transports](../../runtime/transports)
