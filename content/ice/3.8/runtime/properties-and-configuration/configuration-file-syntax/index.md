---
title: Configuration File Syntax
sidebarLabel: File Syntax
---

A configuration file holds one property per line, as `name=value`; Ice ignores the white space around the name and the
value. Ice ignores empty lines, and the `#` character starts a comment that extends to the end of the line. For example:

```config
# Example config file for Ice

Ice.MessageSizeMax = 2048    # Largest message size is 2 MiB
Ice.Trace.Network=3          # Highest level of tracing for network
Ice.Trace.Protocol=          # Disable protocol tracing
```

A configuration file is a text file in UTF-8, with an optional byte order mark (BOM) at the beginning.

When a file sets the same property more than once, the last setting overrides the previous ones. An empty value removes
the property from the property set: the example above leaves `Ice.Trace.Protocol` unset.

## Special Characters

`=` separates the name of a property from its value, and `#` starts a comment. Escape these characters with a backslash
to use them in a name, and escape `#` to use it in a value; an `=` in a value needs no escape. A backslash followed by
`\`, `=`, `#`, or a space stands for that character, and Ice keeps any other backslash as written:

```config
foo\=bar=1                  # Name is "foo=bar", value is "1"
C=5=\#6 # 7                 # Name is "C", value is "5=#6"
AServer=\\\\server\dir      # Value is "\\server\dir"
```

## See Also

- [Using Configuration Files](../using-configuration-files)
- [Setting Properties on the Command Line](../setting-properties-on-the-command-line)
