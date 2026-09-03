// Copyright (c) ZeroC, Inc.

import { Config } from '@markdoc/markdoc';

// Nodes
import { DocumentShell } from '@/components/ice/DocumentShell';
import { CodeBlock, AppLink, Heading, List } from '@/components';
import { TH, TR, TD, Table } from '@/components/nodes/table';

// Tags
import { Callout } from '@/components/tags/callout';
import { Card } from '@/components/tags/card';
import { Divider } from '@/components/divider';
import { Grid } from '@/components/tags/grid';
import { Aside } from '@/components/tags/aside';
import { Step } from '@/components/tags/step';
import { Prerequisites } from '@/components/tags/prerequisites';
import { NextSteps } from '@/components/tags/next-steps';

import * as nodes from './nodes';
import * as tags from './tags';
import nextSteps from './tags/next-steps.markdoc';

const config: Config = {
  tags: {
    ...tags,
    // Markup name is kebab-case, so it cannot be a module export identifier.
    'next-steps': nextSteps
  },
  nodes: {
    ...nodes
  },
  variables: {}
};

export const components = {
  AppLink,
  Aside,
  Callout,
  Card,
  CodeBlock,
  Divider,
  Document: DocumentShell,
  Grid,
  Heading,
  List,
  NextSteps,
  Prerequisites,
  Step,
  Table,
  TD,
  TH,
  TR
};

export default config;
