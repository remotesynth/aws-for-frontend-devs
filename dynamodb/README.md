### Deploying Locally to LocalStack

_Please note that a LocalStack Pro account is required to run these examples due to features used in the CDK deployment to push local assets to S3 and Lambda. Be sure that you have enabled your [auth token](https://docs.localstack.cloud/getting-started/auth-token/) to access the Pro features._

Once you have [LocalStack installed](https://docs.localstack.cloud/getting-started/installation/) and have Docker running, you can use the LocalStack CLI to build and deploy each of the examples. You will need the [AWS CDK CLI for LocalStack](https://docs.localstack.cloud/user-guide/integrations/aws-cdk/#aws-cdk-cli-for-localstack) installed as well.

Once the prerequisites are installed, you can follow the same basics steps to deploy each example.

Start LocalStack from the terminal:

```bash
localstack start
```

Next, bootstrap the deployment.

```bash
cdklocal bootstrap
```

Once the bootstrapping has completed, you can then run the deploy:

```bash
cdklocal deploy
```

After the deploy is completed, you will see some outputs in the terminal displaying the CloudFront distribution URL and the API Gateway URL. You can use the CloudFront distribution URL to load the web site which should automatically return the response from the Lambda function via the API Gateway endpoint returning data loaded from DynamoDB. However, alternatively you can view the response from the Lambda by opening the API Gateway URL directly in your browser for the endpoint `hello` (i.e. you'll need to append this to the end of the URL).

* If you get an error during the bootstrap, this can commonly be caused by either LocalStack or Docker not running. Be sure that you are successfully started LocalStack and Docker before bootstrapping.
* If your deployment fails to load the assets required to run the site (i.e. into S3 and Lambda), be sure that you have successfully added your auth token. When you start up LocalStack in the terminal, you should see a message reading something like `Successfully activated cached license`.

### Deploying Remotely to AWS

You will need to have the [AWS CLI](https://github.com/aws/aws-cli/tree/v2?tab=readme-ov-file#installation) installed and configured for your account (you will likely need to set up an IAM user and obtain an access key). Finally, you will need to install the [AWS CDK CLI](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html#getting_started_install).

Once these prerequisites are installed, you can bootstrap the deployment:

```bash
cdk bootstrap
```

Once the bootstrapping has completed, you can then run the deploy:

```bash
cdk deploy
```

After the deploy is completed, you will see some outputs in the terminal displaying the CloudFront distribution URL and the API Gateway URL. You can use the CloudFront distribution URL to load the web site which should automatically return the response from the Lambda function via the API Gateway endpoint returning data loaded from DynamoDB. However, alternatively you can view the response from the Lambda by opening the API Gateway URL directly in your browser for the endpoint `hello` (i.e. you'll need to append this to the end of the URL).