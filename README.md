# An Intro to AWS for Front-end Developers

This repository contains a series of examples that support an (upcoming) article introducing core AWS primitives that are used in web development for web developers. The example goes from the very basics for hosting a static site to implementing a serverless backend with data.

The demos build upon one another, so, if you'd like to follow along, you can try them via the subfolders in this order:

1. _s3_ – This is just setting up a basic S3 bucket for web hosting static assets.
2. _cf-s3_ – This adds a Cloudfront distribution in front of the S3 bucket to implement edge caching of static assets.
3. _lambda_ – This adds a simple Lambda with function URL to handle backend calls for the site.
4. _api-gateway_ – This assumes you'll have a larger backend than a single function that you'd like to put behind an API Gateway with logical endpoints.
5. _dynamodb_ – This adds a data backend stored in DynamoDB that provides data through the Lambda to the site.

The _site_assets_ folder contains an extremely simple web site example that is built through these steps. It attempts to load details about the API through a `config.json` file that gets written during deployment. If the API is available it will show the results of calling the lambda function on the page.

## Running the Examples

Each of the examples are built using the [AWS CDK](https://aws.amazon.com/cdk/) to generate the necessary AWS infrastructure and services required to run the example. The examples are designed to be tested locally using [LocalStack](https://localstack.cloud) or deployed remotely to AWS.

### Deploying Locally with LocalStack for AWS

_Please note that a paid LocalStack for AWS account is required to run these examples due to features used in the CDK deployment to push local assets to S3 and Lambda. Be sure that you have enabled your [auth token](https://docs.localstack.cloud/getting-started/auth-token/) to access these features._

Once you have [LocalStack for AWS installed](https://docs.localstack.cloud/getting-started/installation/) and have Docker running, you can use the LocalStack CLI to build and deploy each of the examples. You will need the [AWS CDK CLI for LocalStack](https://docs.localstack.cloud/user-guide/integrations/aws-cdk/#aws-cdk-cli-for-localstack) installed as well.

To install all of the prerequisites, you can use the Makefile:

```bash
make install
```

Once the prerequisites are installed, you can follow the same basics steps to deploy each example.

Start LocalStack from the terminal:

```bash
localstack start
```

Next, bootstrap the deployment. For example, to bootstrap the initial S3 example:

```bash
cd s3
cdklocal bootstrap
```

Once the bootstrapping has completed, you can then run the deploy:

```bash
cdklocal deploy
```

After the deploy is completed, you will see some outputs in the terminal. For example for the S3 example, it will output the S3 URL that you can open in your browser to view the static web page.

- If you get an error during the bootstrap, this can commonly be caused by either LocalStack or Docker not running. Be sure that you are successfully started LocalStack and Docker before bootstrapping.
- If your deployment fails to load the assets required to run the site (i.e. into S3 and Lambda), be sure that you have successfully added your auth token. When you start up LocalStack in the terminal, you should see a message reading something like `Successfully activated cached license`.

### Deploying Remotely to AWS

You will need to have the [AWS CLI](https://github.com/aws/aws-cli/tree/v2?tab=readme-ov-file#installation) installed and configured for your account (you will likely need to set up an IAM user and obtain an access key). Finally, you will need to install the [AWS CDK CLI](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html#getting_started_install).

Once these prerequisites are installed, you can bootstrap the deployment. For example, to bootstrap the initial S3 example:

```bash
cd s3
cdk bootstrap
```

Once the bootstrapping has completed, you can then run the deploy:

```bash
cdk deploy
```

After the deploy is completed, you will see some outputs in the terminal. For example for the S3 example, it will output the S3 URL that you can open in your browser to view the static web page deployed to AWS.
