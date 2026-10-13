{% language-section name="common-options-3" %}

## The Slice Compiler for MATLAB

The Slice-to-MATLAB compiler offers two additional options:

- `--all` Generate code for all Slice definitions, including those from included files.
- `--list-generated` Emit a list of generated files in XML format.

`slice2matlab` does **not** support the `--depend` flag, although it does still support `--depend-xml` and
`--depend-file`.

### Running the Compiler

The Ice toolbox provides the Slice-to-MATLAB compiler and a `slice2matlab` function that runs it. You call this function
from the MATLAB console or from a MATLAB script. It adds the directory of the Ice Slice files to the include search
path, forwards its arguments to the compiler, and returns the compiler's exit status:

```matlab
slice2matlab Greeter.ice
status = slice2matlab('--output-dir', 'generated', 'Greeter.ice');
```

{% /language-section %}
