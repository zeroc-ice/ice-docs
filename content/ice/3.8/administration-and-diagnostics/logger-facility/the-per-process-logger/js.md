---
id: the-per-process-logger
language: js
---

{% language-section name="lang-1" %}

```typescript
declare module "@zeroc/ice" {
    namespace Ice {
        function getProcessLogger(): Ice.Logger;
        function setProcessLogger(logger: Ice.Logger): void;
    }
}
```

{% /language-section %}
