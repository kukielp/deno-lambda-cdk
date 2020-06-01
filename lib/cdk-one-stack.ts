import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigateway'; 

export class CdkOneStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //Create the Deno layer
    const layer = new lambda.LayerVersion(this, 'deno-layer', {
      code: lambda.Code.fromAsset('src/layer'),
      compatibleRuntimes: [lambda.Runtime.PROVIDED],
      license: 'Apache-2.0',
      description: 'A layer that enebales Deno to run in lambda',
    });

    const name = new lambda.Function(this, 'NameHandler', {
      runtime: lambda.Runtime.PROVIDED,
      code: lambda.Code.fromAsset('src/program'),
      handler: 'name.handler',
      layers: [layer],
    })

    // API Gateway 
    new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: name
    });

  }
}
