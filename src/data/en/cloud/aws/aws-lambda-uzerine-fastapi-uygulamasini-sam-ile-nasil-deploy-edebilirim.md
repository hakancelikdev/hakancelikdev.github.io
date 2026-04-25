---
publishDate: 2022-11-15T00:00:00Z
author: Hakan Çelik
title: "How to Deploy a FastAPI Application on AWS Lambda with SAM"
excerpt: "If you wrote your serverless application with FastAPI and want to run it on AWS Lambda, you need to make it compatible with Lambda. The library you need for this is mangum."
category: Cloud
subcategory: AWS
image: ~/assets/images/blog/cloud.jpg
tags:
  - cloud
  - aws
  - serverless
---

If you wrote your serverless application with FastAPI and want to run it on AWS Lambda,
you need to make it compatible with Lambda. The library you need for this is
[mangum](https://github.com/jordaneremieff/mangum).

Mangum takes your app and converts it into a handler function — the format that AWS Lambda
expects.

Let's start with an example. Suppose you have an app file called **main.py** with your
FastAPI code and app, just like the following:

```python
from typing import Optional

from fastapi import FastAPI
from mangum import Mangum

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

handler = Mangum(app)
```

By writing it this way, we defined our app and used Mangum to create a variable called
`handler`. This handler is fully compatible with the handler that AWS Lambda expects in
its configuration.

Next, we updated our **Dockerfile** as follows:

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
RUN pip install -r requirements.txt
RUN pip install awslambdaric mangum

RUN chmod +x ./lambda-entrypoint.sh
ENTRYPOINT [ "./lambda-entrypoint.sh" ]
CMD [ "main.handler" ]
```

The rest is just:

```shell
$ sam build
$ sam deploy --guided
```

That's all there is to it.
