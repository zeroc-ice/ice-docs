{% language-section name="mapping" %}

```swift
// MyProcess implements Ice.Process
let myProcessFacet = MyProcess(...)

try communicator.removeAdminFacet("Process")
try communicator.addAdminFacet(servant: myProcessFacet, facet: "Process")
_ = try communicator.getAdmin()
```

{% /language-section %}
