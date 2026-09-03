---
id: the-active-servant-map
language: cpp
---

{% language-section name="lang-1" %}

```cpp
  template<typename Prx = ObjectPrx, ...> Prx 
  add(const ObjectPtr& servant, const Identity& id);
  
  template<typename Prx = ObjectPrx, ...>
  [[nodiscard]] Prx addWithUUID(ObjectPtr servant);
  
  ObjectPtr remove(const Identity& id);
```

{% /language-section %}
