{% language-section name="mapping" %}

```java
// MyProcess implements com.zeroc.Ice.Process
var myProcessFacet = new MyProcess(...);

communicator.removeAdminFacet("Process");
communicator.addAdminFacet(myProcessFacet, "Process");
communicator.getAdmin();
```

{% /language-section %}
