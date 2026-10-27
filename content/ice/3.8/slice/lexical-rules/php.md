{% language-section name="mapping" %}

A Slice identifier maps to an identical PHP identifier, or a PHP identifier derived from this Slice identifier. For
example, the Slice-to-PHP compiler generates the PHP class `GreeterPrxHelper` for Slice interface `Greeter`.

A Slice identifier that is a PHP keyword keeps its name in the generated PHP code, which is then invalid when this
identifier names a PHP class, such as the class of a Slice structure. PHP keywords are case-insensitive, so the Slice
structure `List` conflicts with the PHP keyword `list`. Give this identifier a PHP name of your choice with the
`php:identifier` metadata directive:

```slice
["php:identifier:ItemList"]
struct List
{
    string name;
}
```

In the generated PHP code, the class for `List` is named `ItemList`.

{% /language-section %}
