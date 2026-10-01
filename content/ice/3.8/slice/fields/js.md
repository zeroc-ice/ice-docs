{% language-section name="lang-1" %}

A Slice field maps to a JavaScript class field with the same name. The type of the JavaScript field is the mapped Slice
type.

For example:

```slice
class Address { string city; }

struct Person {
    string name;
    Address address;
}
```

Generates the following JavaScript code:

```js
M.Person = class {
    constructor(name = "", address = null) {
        this.name = name;
        this.address = address;
    }
    ....
};
```

And the corresponding TypeScript declarations:

```typescript
export class Address extends Ice.Value {
    constructor(city?: string);
    ...
    city: string;
}

export class Person {
    constructor(name?: string, address?: Address);
    ...
    name: string;
    address: Address | null;
}
```

### Optional Fields {% id="language-mapping-optional-fields" %}

An optional field maps to a JavaScript class field with the same name. The mapped field’s type is optional, and the tag
value is not mapped to JavaScript.

For example:

```slice
class C
{
    optional(2) string alternateName;
    optional(5) int overrideCode;
    optional(1) Widget* favoriteWidgetProxy;
}
```

Generates the following JavaScript code:

```js
M.C = class extends Ice.Value {
    constructor(
        alternateName = undefined,
        overrideCode = undefined,
        favoriteWidgetProxy = undefined) {
        super();
        this.alternateName = alternateName;
        this.overrideCode = overrideCode;
        this.favoriteWidgetProxy = favoriteWidgetProxy;
    }
    ...
}
```

And the corresponding TypeScript declarations:

```typescript
export class C extends Ice.Value {
    constructor(
        alternateName?: string,
        overrideCode?: number,
        favoriteWidgetProxy?: WidgetPrx);

        alternateName?: string;
        overrideCode?: number;
        favoriteWidgetProxy?: WidgetPrx | null;
    ...
}
```

### Default Values {% id="language-mapping-default-values" %}

Slice default values map to default values in JavaScript.

For example:

```slice
class Point { int x; int y; }

struct Location
{
    string name;
    Point point;
    bool display = true;
    string source = "GPS";
}
```

Generates the following JavaScript code:

```js
M.Location = class {
    constructor(name = "", point = null, display = true, source = "GPS") {
        this.name = name;
        this.point = point;
        this.display = display;
        this.source = source;
    }
    ...
}
```

Generates the following JavaScript code:

```typescript
export class Location {
    constructor(name?: string, point?: Point, display?: boolean, source?: string);

    name: string;
    point: Point | null;
    display: boolean;
    source: string;
}
```

When you don’t define a default value in Slice, and you initialize a field without providing a value for this field, the
generated code uses the following default:

| **Optional Field?** | **Slice Field Type**                     | **Default JavaScript Value**          |
| ------------------- | ---------------------------------------- | ------------------------------------- |
| No                  | `string`                                 | Empty string                          |
|                     | `enum`                                   | First enumerator in enumeration       |
|                     | `struct`                                 | New instance created with no argument |
|                     | Numeric                                  | `0`                                   |
|                     | `bool`                                   | `false`                               |
|                     | `sequence`, `dictionary`, `class`, proxy | `null`                                |
| Yes                 | Any                                      | undefined                             |

{% /language-section %}

{% language-section name="lang-2" %}

{% /language-section %}
