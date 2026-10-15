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

A proxy method also accepts an integer `number` for a `long` parameter. Pass a `bigint` for a value outside the range
`Number.MIN_SAFE_INTEGER` to `Number.MAX_SAFE_INTEGER`, where a `number` loses precision.

{% /language-section %}
