{% language-section name="mapping" %}

```swift
// MyProcess implements Ice.Process
try communicator.removeAdminFacet("Process")
try communicator.addAdminFacet(servant: MyProcess(communicator), facet: "Process")
_ = try communicator.getAdmin()
```

{% /language-section %}
