{% language-section name="mapping" %}

```typescript
declare module "@zeroc/ice" {
    namespace Ice {
        function getProcessLogger(): Ice.Logger;
        function setProcessLogger(logger: Ice.Logger): void;
    }
}
```

{% /language-section %}
