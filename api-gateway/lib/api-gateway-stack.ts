import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as S3Deployment from "aws-cdk-lib/aws-s3-deployment";
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';

export class APIGatewayStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create an S3 bucket configured for website hosting
    const bucket = new s3.Bucket(this, 'MyWebAppBucket', {
      enforceSSL: true,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'error.html',
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      accessControl: s3.BucketAccessControl.PRIVATE,
      cors: [
        {
          allowedMethods: [s3.HttpMethods.GET],
          allowedOrigins: ['*'],
          allowedHeaders: ['*'],
        },
      ],
    });

    // Create a CloudFront Distribution for our S3 hosted web site
    const oai = new cloudfront.OriginAccessIdentity(this, 'OAI');
    bucket.grantRead(oai);
  
    const distribution = new cloudfront.CloudFrontWebDistribution(this, 'BackendCF', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket,
            originAccessIdentity: oai,
          },
          behaviors: [{isDefaultBehavior: true}, { pathPattern: '/*', allowedMethods: cloudfront.CloudFrontAllowedMethods.GET_HEAD }]
        },
      ],
    });

    // Create a Lambda function using the assets in the Lambda directory
    const lambdaFunction = new lambda.Function(this, 'HelloWorldFunction', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'index.handler',
    });

    // Define the API Gateway resource
    const api = new apigateway.RestApi(this, 'HelloWorldApi', {
      restApiName: 'RestAPI',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS
      }
    });
        
    // Define the '/hello' resource with a GET method
    const helloResource = api.root.addResource('hello');
    const helloIntegration = new apigateway.LambdaIntegration(lambdaFunction);
    helloResource.addMethod('GET', helloIntegration);

    new S3Deployment.BucketDeployment(this, "Deployment", {
      sources: [
        S3Deployment.Source.asset(path.join(__dirname, '../../site_assets')),
        S3Deployment.Source.jsonData("config.json", { api_url: api.url }),],
      destinationBucket: bucket,
    });

    // Output the CloudFront distribution URL
    new cdk.CfnOutput(this, 'CloudFrontDistributionURL', {
      value: distribution.distributionDomainName,
    });

    // Output the API Gateway URL
    new cdk.CfnOutput(this, 'APIGatewayURL', {
      value: api.url,
    });
  }
}
