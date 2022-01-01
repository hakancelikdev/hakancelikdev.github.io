AWS Lambda üzerine Serverless uygulama deployu yaparken docker image'ı kullanarak deploy
etmeyi seçerseniz, aws nin sizin işinizi kolaylaştırması açısından bir tane base image'i
bulunmaktadır.

Uygulamanızı çalıştırmak için aws base imageini kullanabilirsiniz, genel olarak aws base
image'i uygulamanızı aws lambda ile çalışması için gerekli bileşenleri sağlar.

Aşağıdaki adreslerden base image'ini bulabilirsiniz.

- DockerHub: amazon/aws-lambda-provided
- ECR Public: public.ecr.aws/lambda/provided

Örneğin siz aşağıdaki gibi bir tane handler fonksiyonunuz var.

**app.py**

```python
def handler(evet, context):
    return {"hello": "world"}
```

**Dockerfile** dosyanız aşağıdaki gibi olması ve sam'i kullanmanız yeterli olacaktır.

```dockerfile
FROM public.ecr.aws/lambda/python:3.8

# Copy function code
COPY app.py ${LAMBDA_TASK_ROOT}

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "app.handler" ]
```

base image'i kullacaksanız bunlar yeterli oluyor, fakat eğer siz örnek veriyorum centos
üzerinde koşan python ile çalışmasını istiyorsanız veya kendi imagenizi oluşturmak
istiyorsunuz o halde Dockerfile dosyasınız üzerinde bir kaç değişikliğe daha ihtiyacınız
var.

öncelikle Dockerfile dan başlayalım, AWS Lambda nın base image'ine bakacak olursak,

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

Şimdi yukarıdaki base image'imiz ve biz onu Dockerfile da from ile aldıktan sonra
serverless uygulamamız için gerekli paketleri indiriyoruz daha sonrasındada CMD de
handler fonksiyonumuzu veriyoruz ve uygulamamız ayağa kalkıyor, burada kendi image'imizi
oluşturacaksak eğer dikkat etmemiz gereken noktalar şunlar;

- ENTRYPOINT
- CMD olmalı
- Uygulamamız AWS Lambda üzerinde koşabilmesi için, gerekli olan awslambdaric'i
  barındırmalı
- ve eğer serverless uygulamamızı fastapi kullanarak yazdıysak, app'imiz handler'e
  çeviren magnum kurulu olmalı.

bu durumda image'in son hali aşağıdaki gibi olacaktır.

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

Aşağıdaki template, sam templatedir daha fazla bilgi için lütfen araştırınız.

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

bütün bunlardan sonra

```shell
$ sam build
$ sam deploy --guided
```

yazdıktan sonra apinizin adresine tıklayarak sonucu görebilirsiniz.

bu komutlardan sonra samconfig dosyanız oluşacaktır, oda oluştuktan sonra apinizde
değişiklik yaptığınızda ve canlıya almak istediğinizde sadece

```shell
$ sam build
$ sam deploy
```

demeniz yeterli olacaktır.
