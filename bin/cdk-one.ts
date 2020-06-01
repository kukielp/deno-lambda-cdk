#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { CdkOneStack } from '../lib/cdk-one-stack';

const app = new cdk.App();
new CdkOneStack(app, 'CdkOneStack');
