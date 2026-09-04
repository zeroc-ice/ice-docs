---
id: modules
language: js
---

{% language-section name="lang-1" %}

Slice modules map to a **JavaScript object** with the same name and to a **TypeScript namespace** with the same name as
the Slice module. The mapping preserves the nesting of Slice definitions.

For example:

```slice
// Slice definitions in M.ice
module M1::M2 {
    // ...
}

module M1 { // Reopen M1
    // ...
}
```

The mapping for these definitions is equivalent to the following code:

```js
// Generated JavaScript code in M.js

export const M1 = {};
M1.M2 = {};

// definitions in M1 and M1.M2
```

```typescript
// Generated TypeScript definitions in M.d.ts

export namespace M1 {
    namespace M2 {
        // Definitions in M1.M2
    }
}

export namespace M1 { // Reopen M1
    // ...
}
```

The generated code always exports the top-level modules as **named exports**. You can import them with standard ES
module syntax, for example:

```js
import { M1 } from "./M";
```

### Custom Mapping

The `js:identifier` metadata directive allows you to map a module to a JavaScript name or TypeScript namespace or
sub-namespace of your choice. For example:

```slice
// module Time becomes object Remote.Clock in JavaScript and namespace
// Remote.Clock in TypeScript.
["js:identifier:Remote.Clock"]
module Time {
    // ...
}
```

You can only use `js:identifier` on a module with a simple name - this metadata directive is not compatible with the
nested module syntax.

{% /language-section %}
