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
- CDK
- Typescript
- Using an exisitng layer in a CDK project

I have been followign Dino for a little while, it's nice to use stong typing in javascript however the transpilers are a slgiht overhead, Dino does away with this and allows the use of typescript with out compilation.

The CDK stack project is still usign typescript that is compiled howvere you cna see in ```tsconfig.json``` that ./src is excluded meanign we dont need to compile this.

The stack consist of:
- A lambda function
- An API gateway

How do we define an exisitng layer in CDK?

```
const layer = [ lambda.LayerVersion.fromLayerVersionArn(this, 'Layer',
      `<Your Dino Layer ARM Here>`
      // Example: `arn:aws:lambda:ap-southeast-2:X123456789:layer:deno:1`   
      )
    ]
```

We can see that AWS provide the 'lambda.Runtime.PROVIDED' value for use when we are leveraging a custom runtime.
The code will come from src folder, in this case a single file called name.ts this file directly is deployed as a typescript file.  When we create teh function we pass in the layer defined above.  The handler is the name of the file ( eg name )

```
const name = new lambda.Function(this, 'NameHandler', {
      runtime: lambda.Runtime.PROVIDED,
      code: lambda.Code.fromAsset('src'),
      handler: 'name.handler',
      layers: layer,
    })
```

The sample program is very simple, usign the good old "Person" example we createa  person, it shows private vairables, and the use of a getter.

When you are ready to deploy run ```cdk bootstrap``` then ```cdk deploy```

Outputs will look like:
```
 ✅  CdkOneStack

Outputs:
CdkOneStack.Endpoint8024A810 = https://your-url/prod/
```

You can call this by issuing the command:
```
curl https://your-url/prod/0Your-Name-Here0 | jq
```

```
{
  "message": "Hi 0Your-Name-Here0!, Welcome to deno 1.0.2 🦕",
  "user": {
    "_fullName": "0Your-Name-Here0"
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