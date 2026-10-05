{% language-section name="mapping" %}

The [Ice context demo](https://github.com/zeroc-ice/ice-demos/tree/3.8/matlab/Ice/context) provides a complete example
of using request context in MATLAB.

Using the Slice greeter definitions once again:

```slice
module VisitorCenter
{
    interface Greeter
    {
        string greet(string name);
    }
}
```

A client application can set a request context to send additional metadata:

```matlab
% Create a request context.
context = configureDictionary('string', 'string');

% We request a French greeting by setting 'language' in the context parameter.
context('language') = 'fr';
greeting = greeter.greet(name, context);
```

{% /language-section %}
