# Compiling Slice in a shared C++ development environment

Modernize `public/attachments/3.8/slice-compilation/slice-compilation.gif`. The reviewed design
explicitly replaces its subtle overlapping client/server build regions with a standalone shared
generated-files group.

## Composition

- A Slice developer provides `Printer.ice` to the Slice-to-C++ compiler.
- The compiler generates `Printer.h` and `Printer.cpp`.
- Put both generated files in one standalone `Generated files` group.
- Connect that group separately to both the client and server executables so sharing is explicit.
- The client developer provides `Client.cpp`, which connects to the client executable.
- The server developer provides `Server.cpp`, which connects to the server executable.
- The C++ Ice runtime library flows to both executables.
- The client executable sends an `RPC` to the server executable.

Do not duplicate the generated files into separate client and server copies.

## Presentation

- Use one subtly filled dashed boundary for the shared generated-files group.
- Use document shapes for all source files.
- Style `Printer.ice` as Slice input, `Printer.h` and `Printer.cpp` as generated code, and the developer
  files as neutral source.
- Set filenames in the shared monospace style and give document categories explicit headers.
- Style the compiler and runtime library as primary Ice components.
- Arrange client source, the runtime library, and server source as distinct peer inputs above the two
  executables.
- Replace the legacy lightning-like network symbol with a direct one-way connector labeled `RPC`.

Original reference: `public/attachments/3.8/slice-compilation/slice-compilation.gif`

Canonical SVG: `public/attachments/3.8/slice-compilation/slice-compilation.svg`
