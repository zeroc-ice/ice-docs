{% language-section name="endpoint-list-syntax-1" %}

Java's default network stack always accepts both IPv4 and IPv6 connections regardless of the settings of `Ice.IPv6`.
Thus, in Java, an object adapter endpoint that uses the IPv4 wildcard will accept both IPv4 and IPv6 connections. You
can configure the Java runtime to use only IPv4 by starting your application with the following JVM option:

```shell
java -Djava.net.preferIPv4Stack=true ...
```

{% /language-section %}
