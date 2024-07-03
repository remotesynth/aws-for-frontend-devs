import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as S3Deployment from "aws-cdk-lib/aws-s3-deployment";
import * as path from 'path';

export class S3Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create an S3 bucket configured for website hosting
    const bucket = new s3.Bucket(this, 'MyWebAppBucket', {
      enforceSSL: true,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'error.html',
      publicReadAccess: true,
      blockPublicAccess: {
        blockPublicPolicy: false,
        blockPublicAcls: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      },
      cors: [
        {
          allowedMethods: [s3.HttpMethods.GET],
          allowedOrigins: ['*'],
          allowedHeaders: ['*'],
        },
      ],
    });

    new S3Deployment.BucketDeployment(this, "Deployment", {
      sources: [S3Deployment.Source.asset(path.join(__dirname, '../assets'))],
      destinationBucket: bucket,
      destinationKeyPrefix: 'web/static',
    });

    // Output the bucket website URL
    new cdk.CfnOutput(this, 'BucketWebsiteURL', {
      value: bucket.bucketWebsiteUrl,
    });
  }
}
