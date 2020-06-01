## Requirements:
- CDK
```npm install -g aws-cdk```
- nodeJs - [Download](https://nodejs.org/en/download/)
- An AWS account
- Local credenitals ( unless using Cloud 9 )
- A Dino layer deployed
- jq [Download](https://stedolan.github.io/jq/)

# Overview

This is an example project showing:
- AWS CDK
- TypeScript
- Deploying a new layer in a CDK project

I have been followign Deno for a little while, it's nice to use stong typing in javascript however the transpilers are a slight overhead, Deno does away with this and allows the use of TypeScript with out compilation.

The CDK stack project is still usign typescript that is compiled however you can see in ```tsconfig.json``` that /srcprogram is excluded meanign we dont need to compile this.

The stack consist of:
- Lambda layer the enables Deno runtime
- A lambda function
- An API gateway

To satrt off run:
```
npm run watch

```
This will start monitoring the CDK stack TypCcript files and compile them to vanilla javascript.  Keep an eye on the terminal as it will complile the stack code as you make changes and save.

How do we define a layer in CDK?  I decide not to build the runetime in this example but show how to deploy a built runtime.  I took the latest release from: 
[https://github.com/hayd/deno-lambda/releases](https://github.com/hayd/deno-lambda/releases
) and unzipped the contents into src/layer folder.  In CDK we define a new layer:

```
const layer = new lambda.LayerVersion(this, 'deno-layer', {
    code: lambda.Code.fromAsset('src/layer'),
    compatibleRuntimes: [lambda.Runtime.PROVIDED],
    license: 'Apache-2.0',
    description: 'A layer that enables Deno to run in AWS Lambda',
});
```
# Lambda function:
We can see that AWS provide the 'lambda.Runtime.PROVIDED' value for use when we are leveraging a custom runtime.
The code will come from src/program folder, in this case a single file called "name.ts" this file directly is deployed as a typescript file.  When we create the function we pass in the layer defined above ( that value will be the ARB opf the layer ).  The handler is the name of the file ( eg name )

```
const name = new lambda.Function(this, 'NameHandler', {
      runtime: lambda.Runtime.PROVIDED,
      code: lambda.Code.fromAsset('src/program'),
      handler: 'name.handler',
      layers: layer,
    })
```

# Sample App:
The sample program is very simple, usign the good old Obejct Oriented "Person" example we create a  person, it shows private variables, and the use of a getter and a constructor.

```
import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult,
    Context
} from "https://deno.land/x/lambda/mod.ts";

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  return {
    statusCode: 200,
    headers: { "Content-Type": "text/json" },
    body: JSON.stringify(constructResponse(event)),
  };
}

class Person {
  private _fullName: string;
  get fullName(): string {
    return this._fullName + '!';
  }
  constructor(firstName: string, ) {
      this._fullName = firstName;
  }
}

class Result {
  user: Person;
  message: string;
  constructor(u: Person, m: string){
    this.message = m;
    this.user = u;
  }
}

const constructResponse = (event: APIGatewayProxyEvent) => {
  let name = event.path.replace("/","");
  let p = new Person(name);
  let r = new Result(p, `Hi ${p.fullName}, Welcome to deno ${Deno.version.deno} 🦕`);

  return r;
}
```
# Deploy
When you are ready to deploy run ```cdk bootstrap``` then ```cdk deploy```

Outputs will look like:
```
 ✅  CdkOneStack

Outputs:
CdkOneStack.Endpoint8024A810 = https://your-url/prod/
```

CdkOneStack is defined in:```/bin/cdk-one.ts``` you can change the name of the stack if you desire:
```#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { CdkOneStack } from '../lib/cdk-one-stack';

const app = new cdk.App();
new CdkOneStack(app, 'CdkOneStack');  // <- Stack name>
```

# Call your function!
You can call this by issuing the command:
```
curl https://your-url/prod/Your-Name-Here | jq
```

```
{
  "message": "Hi Your-Name-Here!, Welcome to deno 1.0.2 🦕",
  "user": {
    "_fullName": "Your-Name-Here"
  }
}

```

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template