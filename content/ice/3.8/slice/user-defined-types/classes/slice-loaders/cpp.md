{% language-section name="custom-slice-loaders" %}

A custom Slice loader derives from `Ice::SliceLoader` and overrides `newClassInstance`, `newExceptionInstance`, or both.
You install it by setting the `sliceLoader` field of [InitializationData](api:Ice/InitializationData):

```cpp
class NodeLoader final : public Ice::SliceLoader
{
public:
    [[nodiscard]] Ice::ValuePtr newClassInstance(std::string_view typeId) const final
    {
        return typeId == "::Demo::Node" ? std::make_shared<MyNode>() : nullptr;
    }
};

Ice::InitializationData initData;
initData.sliceLoader = std::make_shared<NodeLoader>();
Ice::CommunicatorHolder ich{std::move(initData)};
```

{% /language-section %}
