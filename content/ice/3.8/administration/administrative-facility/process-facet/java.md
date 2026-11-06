{% language-section name="mapping" %}

```java
// MyProcess implements com.zeroc.Ice.Process
communicator.removeAdminFacet("Process");
communicator.addAdminFacet(new MyProcess(communicator), "Process");
communicator.getAdmin();
```

{% /language-section %}
