import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as iam from 'aws-cdk-lib/aws-iam';


export class CdkConfStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create an S3 bucket for hosting the SvelteKit application
    const websiteBucket = new s3.Bucket(this, 'rogue-prince-of-persia-toolkit', {
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // This will delete the bucket when the stack is deleted
    });


    // Define the bucket policy
    const bucketPolicy = new iam.PolicyStatement({
      sid: 'PublicReadGetObject',
      effect: iam.Effect.ALLOW,
      principals: [new iam.ArnPrincipal('*')],
      actions: ['s3:GetObject'],
      resources: [`${websiteBucket.bucketArn}/*`],
    });

    // Attach the policy to the bucket
    websiteBucket.addToResourcePolicy(bucketPolicy);


    // Deploy the built SvelteKit app to the S3 bucket
    new s3deploy.BucketDeployment(this, 'rogue-prince-of-persia-toolkit-deployment', {
      sources: [s3deploy.Source.asset('../build')],
      destinationBucket: websiteBucket,
    });

    new cdk.CfnOutput(this, 'BucketURL', {
      value: websiteBucket.bucketWebsiteUrl,
      description: 'The URL of the SvelteKit app',
    });
  }
}
