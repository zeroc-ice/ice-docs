{% language-section name="lang-1" %}

```typescript
interface ObjectAdapter {
    ...

    addDefaultServant(servant: Ice.Object, category: string): void;

    removeDefaultServant(category: string): Ice.Object;
}
```

{% /language-section %}
