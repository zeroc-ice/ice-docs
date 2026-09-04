// Copyright (c) ZeroC, Inc.

const list = {
  render: 'List',
  attributes: {
    ordered: { type: Boolean },
    // The parser records which bullet or number style the source used. The
    // component does not care, but validation rejects an undeclared attribute.
    marker: { type: String, render: false }
  }
};

export default list;
