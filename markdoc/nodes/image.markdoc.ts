// Copyright (c) ZeroC, Inc.

import { nodes } from '@markdoc/markdoc';

// Rendered by the image component rather than as a plain `img`, so the page
// can carry the image's size and the raster images go through the image
// optimizer.
const image = { ...nodes.image, render: 'Image' };

export default image;
