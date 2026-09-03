---
id: sequences
language: matlab
---

{% language-section name="lang-1" %}
The MATLAB mapping for a Slice sequence depends on the element type of the sequence:

| **Element Type (Slice)** | **Mapped Sequence Type (MATLAB)** |
| --- | --- |
| `bool`, numeric types, `enum`, `struct` | vector (1-by-n array) of the mapped element type |
| `string` | vector of `string` |
| All other types: `class`, proxies, `dictionary`, `sequence` | 1-by-n cell array of the mapped element type |

{% callout type="warning" %}
An empty sequence corresponds to a 1-by-0 array or cell array. It has the same type as a non-empty sequence.
{% /callout %}
{% /language-section %}
