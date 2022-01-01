Eğer Serverless uygulamanızı fastapi ile yazdıysanız ve aws lambda kullanarak ayağa
kaldırmak istiyorsanız yine aws lambda ya uygun hale getirmeniz gerekiyor, bunun için
ihtiyacınız olan kütüphane [mangum](https://github.com/jordaneremieff/mangum) dur.

Mangum sizin için sizin app'inizi alır ve AWS Lambda nın anlayacağı format olan handler
fonksiyonuna çevirir.

Bir örnek ile başlayalım, farz edelim ki sizin **main.py** adında bir app dosyanız var,

ve burada fastapi kodlarınız ve app'iniz var diyelim tıpkı aşağıdaki gibi

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

bu şekilde yazarak app imizi yazdık ve mangum u kullanarak handler adında bir değişken
tanımladık, bu handler tamamen aws lambdanın cmd de beklediği handler'a uygun!

sonrasında **Dockerfile** ımızı aşağıdaki gibi güncelledik,

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

gerisi

```shell
$ sam build
$ sam deploy --guided
```

hepsi bu kadar.
