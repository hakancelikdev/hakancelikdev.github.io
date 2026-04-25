---
publishDate: 2022-11-29T00:00:00Z
author: Hakan Çelik
title: "How to Deploy a Serverless Application on AWS Lambda"
excerpt: "There are many options for deploying a serverless application on AWS Lambda. Here are the ones I know of:"
category: Cloud
subcategory: AWS
image: ~/assets/images/blog/cloud.jpg
tags:
  - cloud
  - aws
  - serverless
---

There are many options for deploying a serverless application on AWS Lambda. Here are the
ones I know of:

- https://www.serverless.com/
- https://aws.amazon.com/cli/
- https://aws.amazon.com/serverless/sam/
- You can also do it through the AWS Management Console

In addition, while applying one of these, you can send your serverless application to AWS
as a zip file or a Docker image and continue the deployment process that way.

I will be using a Docker image and SAM during the deploy process.

## Let's Deploy Our First Serverless Application with SAM

You can do this with just the 3 simple commands shown below. Of course, you must have
already configured the necessary API keys and settings to connect to AWS.

```bash
$ sam init
$ sam build --use-container
$ sam deploy --guided
```

After these commands, a simple hello world API will be created. Docker files and a config
file for SAM will be generated. SAM will build an image using the Dockerfile, push it to
Amazon [ECR](https://aws.amazon.com/ecr/), and then use that image to bring up your API
and give you a link to test it. You can also attach a domain to it later using SAM.

If you want to test your application locally:

```bash
$ sam local start-api
```

That's all you need to write.

## How AWS Lambda Works

When Lambda invokes your function handler, the Lambda runtime passes two arguments to the
function handler: `event` and `context`. The `event` object is a JSON-format object that
contains information about the Lambda function and the data needed for the function to
run. The `context` object contains information about your Lambda function such as
`function_name` and `version`.

You can learn more about deployment by reading the next article.
