---
publishDate: 2022-12-27T00:00:00Z
author: Hakan Çelik
title: "Deploying to AWS Lambda with SAM Using a Custom Docker Image"
excerpt: "When deploying a serverless application on AWS Lambda using a Docker image, AWS provides a base image to make your work easier."
category: Cloud
subcategory: AWS
image: ~/assets/images/blog/cloud.jpg
tags:
  - cloud
  - aws
  - serverless
---

When deploying a serverless application on AWS Lambda using a Docker image, AWS provides
a base image to make your work easier.

You can use the AWS base image to run your application. In general, the AWS base image
provides the necessary components for your application to work with AWS Lambda.

You can find the base image at the following addresses:

- DockerHub: amazon/aws-lambda-provided
- ECR Public: public.ecr.aws/lambda/provided

For example, suppose you have a handler function like this:

**app.py**

```python
def handler(event, context):
    return {"hello": "world"}
```

Your **Dockerfile** just needs to look like the following, and using SAM will be
sufficient:

```dockerfile
FROM public.ecr.aws/lambda/python:3.8

# Copy function code
COPY app.py ${LAMBDA_TASK_ROOT}

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "app.handler" ]
```

If you are using the base image, that is enough. However, if — for example — you want to
run Python on CentOS, or you want to build your own image, then you need a few more
changes to your Dockerfile.

Let's start with the Dockerfile. If we look at the AWS Lambda base image:

```dockerfile
ADD file:7a22bebe0eb1979ae7e1a5345aaf33a07c60da54de060b073094bc3d02737863
ADD file:4baa3b5a5a1aa8592a734dbb214bc36c8418e911d81d0327fb81d8816dd6e50d
ADD file:89b37157418d607de3cb040839dfdeb3f8d312c464c19215dc468a861f7576cc
ADD file:cbc023ce63975263ac3037a209069cec3e364cedbba9ccdeb668607ee9f2dd8f
WORKDIR /var/task
ENV LANG=en_US.UTF-8
ENV TZ=:/etc/localtime
ENV PATH=/var/lang/bin:/usr/local/bin:/usr/bin/:/bin:/opt/bin
ENV LD_LIBRARY_PATH=/var/lang/lib:/lib64:/usr/lib64:/var/runtime:/var/runtime/lib:/var/task:/var/task/lib:/opt/lib
ENV LAMBDA_TASK_ROOT=/var/task
ENV LAMBDA_RUNTIME_DIR=/var/runtime
ENTRYPOINT [ "/lambda-entrypoint.sh" ]
```

Now, after we take this base image with `FROM` in our Dockerfile, we download the
necessary packages for our serverless application and then provide the handler function in
`CMD` so our application starts up. If we are building our own image, the key points to
pay attention to are:

- `ENTRYPOINT` must be set
- `CMD` must be set
- The application must include `awslambdaric`, which is required to run on AWS Lambda
- If our serverless application was written using FastAPI, `mangum` must be installed to
  convert our app to a handler

In this case, the final version of the image will look like this:

**Dockerfile**

```dockerfile
FROM python:3.8.10

RUN apt-get update && \
  apt-get install -y \
  g++ \
  make \
  cmake \
  unzip \
  libcurl4-openssl-dev

COPY . /app
WORKDIR /app

RUN pip install --upgrade pip
RUN pip install awslambdaric

RUN chmod +x ./lambda-entrypoint.sh
ENTRYPOINT [ "./lambda-entrypoint.sh" ]
CMD [ "main.handler" ]
```

**main.py**

```python
def handler(event, context):
    return {"hello": "world"}
```

**lambda-entrypoint.sh**

```shell
#!/bin/sh
if [ -z "${AWS_LAMBDA_RUNTIME_API}" ]; then
  exec /usr/local/bin/aws-lambda-rie /usr/local/bin/python -m awslambdaric $@
else
  exec /usr/local/bin/python -m awslambdaric $@
fi
```

The following template is a SAM template — please research further for more information.

**template.yaml**

```yaml
AWSTemplateFormatVersion: "2010-09-09"
Transform: AWS::Serverless-2016-10-31
Description: SAM Template for myapi

Resources:
  MyAPIFunction:
    Type: AWS::Serverless::Function
    Properties:
      Events:
        MYAPI:
          Properties:
            RestApiId:
              Ref: SSLAPIFunctionGateway
            Path: /{proxy+}
            Method: ANY
          Type: Api
      FunctionName: MyAPI
      Timeout: 300 # timeout of your lambda function
      MemorySize: 128 # memory size of your lambda function
      PackageType: Image
      Role: !Sub arn:aws:iam::751347607460:role/lambda-role

    Metadata:
      Dockerfile: Dockerfile
      DockerContext: .
      DockerTag: latest

  MyAPInGateway:
    Type: AWS::Serverless::Api
    Properties:
      StageName: dev
      OpenApiVersion: "3.0.0"
```

After all of this, run:

```shell
$ sam build
$ sam deploy --guided
```

and you can click the API address to see the result.

After these commands, your `samconfig` file will be created. Once it is created, whenever
you make changes to your API and want to go live, you only need to run:

```shell
$ sam build
$ sam deploy
```
