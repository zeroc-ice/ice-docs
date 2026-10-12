{% language-section name="mapping" %}

The Slice built-in types are mapped to JavaScript and TypeScript types as follows:

| **Slice** | **JavaScript** | **TypeScript** |
| --------- | -------------- | -------------- |
| bool      | `Boolean`      | `boolean`      |
| byte      | `Number`       | `number`       |
| short     | `Number`       | `number`       |
| int       | `Number`       | `number`       |
| long      | `BigInt`       | `bigint`       |
| float     | `Number`       | `number`       |
| double    | `Number`       | `number`       |
| string    | `String`       | `string`       |

A proxy method also accepts a `number` for a `long` parameter. Ice converts this number with `BigInt`, so the invocation
fails with a `RangeError` when the number is not an integer. The conversion cannot restore the precision of a number
beyond `Number.MAX_SAFE_INTEGER`.

{% /language-section %}
