{% language-section name="mapping" %}

```cpp
  template<typename Prx = ObjectPrx, ...> Prx
  add(const ObjectPtr& servant, const Identity& id);

  template<typename Prx = ObjectPrx, ...>
  [[nodiscard]] Prx addWithUUID(ObjectPtr servant);

  ObjectPtr remove(const Identity& id);
```

{% /language-section %}
