import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as S3Deployment from "aws-cdk-lib/aws-s3-deployment";
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import {HttpMethod} from "aws-cdk-lib/aws-events";

export class LambdaStack extends cdk.Stack {
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
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'index.handler',
      
    });
    // Add a public function URL to the Lambda function
    const functionURL = lambdaFunction.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      cors:
        {
          allowedMethods: [HttpMethod.GET],
          allowedOrigins: ['*'],
        },
    });

    new S3Deployment.BucketDeployment(this, "Deployment", {
      sources: [S3Deployment.Source.asset(path.join(__dirname, '../assets'))],
      destinationBucket: bucket,
    });

    // Output the CloudFront distribution URL
    new cdk.CfnOutput(this, 'CloudFrontDistributionURL', {
      value: distribution.distributionDomainName,
    });

    // Output the Lambda function URL
    new cdk.CfnOutput(this, 'LambdaFunctionURL', {
      value: functionURL.url,
    });
  }
}
