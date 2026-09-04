---
id: modules
language: ruby
---

{% language-section name="lang-1" %}

A Slice module maps to a Ruby module with the same name. The mapping preserves the nesting of the Slice definitions. For
example:

```slice
module M1::M2
{
    // ...
}

// ...

module M1    // Reopen M1
{
    // ...
}
```

This definition maps to the corresponding Ruby definitions:

```ruby
module M1::M2
    # ...
end

module M1
    # ...
end
```

If a Slice module is reopened, the corresponding Ruby module is reopened as well.

### Custom Mapping

The `ruby:identifier` metadata directive allows you to map a module to a Ruby module or nested module of your choice.
For example:

```slice
// module Time becomes module Remote::Clock in Ruby.
["ruby:identifier:Remote::Clock"]
module Time
{
    // ...
}
```

You can only use `ruby:identifier` on a module with a simple name - this metadata directive is not compatible with the
nested module syntax.

{% /language-section %}
