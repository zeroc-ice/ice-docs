// Copyright (c) ZeroC, Inc.

// Superscript text, such as an exponent. Write exponents with this tag rather
// than with Unicode superscript characters: the Inter subsets the site loads
// leave out the Superscripts and Subscripts block (U+2070 to U+209F), so the
// browser draws ⁰ and ⁴ to ⁹ in a fallback font.
const sup = {
  render: 'sup'
};

export default sup;
