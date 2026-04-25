---
publishDate: 2023-01-10T00:00:00Z
author: Hakan Çelik
title: "What Is Serverless?"
excerpt: "Serverless Computing is also known as FaaS or Function As a Service."
category: Cloud
image: /images/posts/server-not-found.png
tags:
  - cloud
  - aws
  - serverless
---

Serverless Computing is also known as FaaS or Function As a Service.

Function As a Service is an architectural approach in which the resources running your
application (CPU, memory, etc.) are fully managed by the cloud provider. You only write
your code and specify which events should trigger it, and you pay using a pay-as-you-go
model — meaning you only pay for what you use.

A popular example of FaaS is [AWS Lambda](https://aws.amazon.com/lambda/).

Serverless does not mean there are no servers, or that applications will no longer run on
servers. From a software development and management perspective, it is an approach that
lets us think less about the concept of servers. It is built on the principle of not
worrying about scaling, load distribution, server configuration, error handling,
deployment, or even runtime — aiming to run with as few resources as possible and at
minimum cost.

We can write a serverless application for every API or task, though I haven't seen it
widely recommended for complex workloads. It seems to be recommended for simple,
single-purpose applications. I think it is more suitable for applications that don't run
continuously and wait to be triggered by something — like Alexa, an incoming request to
an endpoint, or an application that should run when data is written to a Kafka topic and
has a single, simple purpose. In that case, since the job isn't running continuously, it
will reduce both our costs and the time we spend on the server side. Periodic tasks can
also be included in this; instead of dealing with cron or Celery, we can hand that part
off to the cloud provider. Repeating task pieces can be included here too — for example,
sending email is a system that is used very frequently and integrated into almost every
project over and over again. Instead, we can write an application for email sending and
reduce our workload with a cloud provider that offers serverless services.

## Conclusion

Serverless — also known as serverless computing or FaaS — is an approach that doesn't
eliminate servers but reduces the workload on us. Everything except the application code
itself can be handed off to the cloud provider. It is a scalable, cost-reducing approach.
