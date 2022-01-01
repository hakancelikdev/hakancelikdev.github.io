Serverless Computing, Faas veya (Function As a Service) olarakta bilinir.

Function As a Service, uygulamanızı çalıştıran kaynakların (CPU, Memory, gibi) tamamen
Cloud Provider tarafından yönetilmesi , sizin sadece kodunuzu yazıp, hangi olaylar
karşısından tetikleyeneceğinin bilgisini verdiğiniz, ödeme yöntemi olarak kullandığın
kadar öde ( pay-as-you-go) mantığındaki mimari yapılardır.

FaaS e örnek olarak [aws lambda](https://aws.amazon.com/tr/lambda/) verilebilir.

Serverless, artık sunuculara gerek yok veya uygulamalar sunucularda çalışmayacak gibi
bir yaklaşım değil. Yazılım geliştirme ve yönetme açısından, sunucu kavramına daha az
kafa yormamızı sağlayan bir yaklaşım bir başka mimaridir. Ölçeklendirme, yük dağıtımı,
sunucu konfigürasyonları, hata yönetimi, deployment ve hatta run-time gibi konuları dert
etmeyin temeline dayanır ve mümkün oldukça az kaynak ile çalışıp minumum masraf
cıkarmaya çalışır

![](../assets/server-not-found.png)

Her apiyi veya görevi yerine getirecek bir serverless application yazabiliriz fakat
komplex işlerde önerildiğini pek okumadım, basit, tek bir görev için özelleşmiş
uygulamalar için önerildiğini gördüm. Sürekli çalışmayan çalışması için bir şey
tarafından tetiklenmeyi bekleyen uygulamar için daha uygun olacagını düşünüyorum,
örneğin alexa gibi, bir endpoint'e gelen istek gibi, yada kafka topic'e veri kayıt
olduğunda çalışmasını beklediğimiz bir uygulamamız varsa ve bu uygulamanın tek bir amacı
olup basit bir uygulama ise o zaman kullanmak daha makul olacaktır, hem devamlı çalısan
bir iş olmadığı için masrafımızı ve sunucu tarafında geçirdiğimiz zamanı azaltacaktır.
Buna periyodik işlerde dahil edilebilir, cron veya celery ile uğraşmaktansa bu kısmı
cloud provider a bırakabiliriz. Buna kendini tekrar eden görev parçaçıklarıda dahil
edilebilir, örneğin email gönderme cok sık kullanılan ve neredeyse her projeye tekrar ve
tekrar entegre edilen bir sistem, bunun yerine email gönderimi için application
yazabiliriz ve serverless hizmeti veren bir cloud provide ile yüklerimizi azaltabiliriz.

## Sonuç!

Serverless, serverless computing yada FaaS olarak bilinen, sunucuyu ortadan kaldırmayıp
bizlerin sucunu üzerindeki iş yükü azaltan application kısmı hariç geriye kalan bütün
işleri cloud provider kısmına bırakabiliceğimiz, ölçeklenebilir ve maliyeti azaltan bir
yaklaşımdır.
