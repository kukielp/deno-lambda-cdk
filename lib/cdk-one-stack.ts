import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigateway'; 

export class CdkOneStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const layer = [ lambda.LayerVersion.fromLayerVersionArn(this, 'Layer',
      // You will need a Dino Layer
      // `<Your Dino Layer ARM Here>`
      `arn:aws:lambda:ap-southeast-2::layer:deno:1`  
      )
    ]

    const name = new lambda.Function(this, 'NameHandler', {
      runtime: lambda.Runtime.PROVIDED,
      code: lambda.Code.fromAsset('src'),
      handler: 'name.handler',
      layers: layer,
    })

    // API Gateway 
    new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: name
    });

  }
}
