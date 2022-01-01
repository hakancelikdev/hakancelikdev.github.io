AWS Lambda üzerine serverless uygulama deployu için bir çok seçenek mevcut, bildiklerimi
sıralayacak olursak bunlar;

- https://www.serverless.com/
- https://aws.amazon.com/tr/cli/
- https://aws.amazon.com/tr/serverless/sam/
- AWS arayüzünü kullanarakta yapabilirsiniz

Ek olarak bunlardan birini uygularken, serverless uygulamanızı zip yada docker image'i
olarak aws ye gönderebilir ve deploy aşamasına bu şekilde devam edebilirsiniz.

Ben deploy sürecinde docker image'i ve sam'i kullanacağım.

## Sam ile İlk Serverless Uygulamamızı Deploy Edelim.

Bunu sadece aşağıda görmüş olduğunuz 3 basit komut ile yapabilirsiniz, tabiki öncesinde
aws ye bağlanmak için gerekli olan apikey vs gibi ayarları yapmış olmalısınız.

```bash
$ sam init
$ sam build --use-container
$ sam deploy --guided
```

bu komutlar sonrası basit bir hello world apisi oluşacak, docker dosyaları ve sam için
config dosyası oluşacak, sam dockerfile'i kullanarak image hazırlayıp amazon
[ecr](https://aws.amazon.com/tr/ecr/) ye gönderecek ve o image'i kullanarak apinizi
ayağa kaldırıp size denemeniz için apinin linkini verecektir. Daha sonra isterseni
domain bağlama işinide sam ile yapabilirsiniz.

uygulananızı localden test etmek isterseniz

```bash
$ sam local start-api
```

yazmanız yeterlidir.

## AWS Lambda nasıl çalışır.

Lambda, fonksiyon handlerinizi çağırdığında, Lambda runtime, fonksiyon handlerına iki
bağımsız değişken iletir: bunlar event ve context tir. event objesi json formatında
lambda fonksiyonuna ait bilgiler barından bir objedir, fonksiyonun çalıması için gerekli
bilgileri içerir, context ise lambda fonksiyonunuza ait function_name version gibi
bilgileri içeren bir objedir.

bir sonraki içeriği okuyarak deploy konusunda daha çok bilgiye ulaşabilirsiniz.
