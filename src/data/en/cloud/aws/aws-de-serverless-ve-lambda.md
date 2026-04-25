---
publishDate: 2022-11-01T00:00:00Z
author: Hakan Çelik
title: "Serverless and Lambda on AWS"
excerpt: "Lambda is a compute service that lets you run code without managing servers."
category: Cloud
subcategory: AWS
image: ~/assets/images/blog/cloud.jpg
tags:
  - cloud
  - aws
  - serverless
---

## What Is Lambda?

> Lambda is a compute service that lets you run code without managing servers.

Lambda runs your code on a high-availability compute infrastructure and handles all of
the administration of the compute resources, including server and operating system
maintenance, capacity provisioning and automatic scaling, monitoring, and logging. With
Lambda, you can run code for virtually any type of application or backend service.

## Other Features of Lambda

- Lambda supports images up to 10 GB in size.
- You can use an AWS-provided base image or an alternative base image such as Alpine or
  Debian. Lambda supports all Linux distributions.
- You can use AWS Lambda to extend other AWS services with custom logic, or create your
  own backend services that operate at AWS scale, performance, and security.
- AWS Lambda automatically runs code in response to multiple events such as HTTP requests
  via Amazon API Gateway, modifications to objects in Amazon Simple Storage Service
  (Amazon S3) buckets, table updates in Amazon DynamoDB, and state transitions in AWS
  Step Functions.
- Lambda runs your code on high-availability compute infrastructure and performs all the
  administration of your compute resources. This includes server and operating system
  maintenance, capacity provisioning and automatic scaling, code and security patch
  deployment, and code monitoring and logging. All you need to do is supply the code.
- AWS Lambda supports Java, Go, PowerShell, Node.js, C#, Python, and Ruby.

## Automatic Scaling

AWS Lambda invokes your code only when needed and automatically scales to support the
rate of incoming requests without any manual configuration. There is no limit to the
number of requests your code can handle. AWS Lambda typically starts running your code
within milliseconds of an event. Since Lambda scales automatically, performance remains
consistently high as the event frequency increases. Because your code is stateless, Lambda
can start as many instances as needed without long deployment and configuration delays.

## Fine-Grained Control Over Performance

Concurrency is available, allowing you to run tasks in parallel. Pricing varies based on
the amount of concurrency you use.

## Orchestrate Multiple Functions

You can use AWS Step Functions to coordinate multiple AWS Lambda functions for complex or
long-running tasks.

## Only Pay for What You Use

With AWS Lambda, you pay based on the number of requests for your functions and the
duration — the time it takes for your code to run. When you configure concurrency, that
is billed separately.

Billing is metered in increments of one millisecond, providing easy and cost-effective
automatic scaling from a few requests per day to thousands per second.

## Flexible Resource Model

Choose the amount of memory you want to allocate to your functions, and AWS Lambda
will automatically allocate proportional CPU power and other resources it needs.
