// Copyright (c) ZeroC, Inc.

// Nodes
import { DocumentShell } from '@/components/ice/DocumentShell';
import { CodeBlock, AppLink, Heading, List } from '@/components';
import { TH, TR, TD, Table } from '@/components/nodes/table';

// Tags
import { Callout } from '@/components/tags/callout';
import { Card } from '@/components/tags/card';
import { Divider } from '@/components/divider';
import { Grid } from '@/components/tags/grid';
import { LangBlock } from '@/components/tags/lang-block';
import { Aside } from '@/components/tags/aside';
import { Step } from '@/components/tags/step';
import { Prerequisites } from '@/components/tags/prerequisites';
import { NextSteps } from '@/components/tags/next-steps';
import { Release, Releases } from '@/components/tags/releases';
import { Selection } from '@/components/tags/selection';
import { Showcase } from '@/components/tags/showcase';

import config from './config.ts';

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
  LangBlock,
  List,
  NextSteps,
  Prerequisites,
  Release,
  Releases,
  Selection,
  Showcase,
  Step,
  Table,
  TD,
  TH,
  TR
};

export default config;
