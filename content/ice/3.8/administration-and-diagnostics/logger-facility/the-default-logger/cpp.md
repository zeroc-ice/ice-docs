{% language-section name="lang-1" %}

On Windows, when the default C++ logger outputs a log message to the console, it converts this message from your narrow
string encoding (as defined by narrow string converter you installed, if any) to your console code page. This conversion
is disabled if you redirect standard error to a file with [Ice.StdErr](../ice-properties), or if you set
[Ice.LogStdErr.Convert](../ice-properties) to 0.

{% /language-section %}
