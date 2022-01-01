## Lambda Nedir?

> Lambda, sunucuları yönetmeden kod çalıştırmanıza izin veren bir bilgi işlem
> hizmetidir.

Lambda, kodunuzu yüksek kullanılabilirliğe sahip bir bilgi işlem altyapısında çalıştırır
sunucu, işletim sistemi bakımı, kapasite sağlama ve otomatik ölçeklendirme, monitoring
ve loggin dahil olmak üzere bilgi işlem kaynaklarının tüm yönetimini gerçekleştirir.
Lambda ile hemen hemen her tür uygulama veya arka uç hizmeti için kod
çalıştırabilirsiniz.

## Lambdanın Diğer Özellikleri

- Lambda, boyutu 10 GB'a kadar olan imageleri destekler.
- AWS tarafından sağlanan bir base image veya Alpine, Debian gibi alternatif bir temel
  imajı kullanabilirsiniz. -lambda bütün linux dagıtımları destekler.
- Diğer AWS hizmetlerini özel mantıkla genişletmek için AWS Lambda'yı kullanabilir veya
  AWS ölçeğinde, performansında ve güvenliğinde çalışan kendi arka uç hizmetlerinizi
  oluşturabilirsiniz.
- AWS Lambda, Amazon API Gateway aracılığıyla HTTP istekleri, Amazon Simple Storage
  Service (Amazon S3) paketlerindeki nesnelerde yapılan değişiklikler, Amazon
  DynamoDB'deki tablo güncellemeleri ve AWS Step Functions'taki durum geçişleri gibi
  birden çok olaya yanıt olarak kodu otomatik olarak çalıştırır.
- Lambda, kodunuzu yüksek kullanılabilirlikli bilgi işlem altyapısında çalıştırır ve
  işlem kaynaklarınızın tüm yönetimini gerçekleştirir. Buna sunucu ve işletim sistemi
  bakımı, kapasite sağlama ve otomatik scaling, kod ve güvenlik yaması dağıtımı ve kod
  monitoring ve logging dahildir. Tek yapmanız gereken kodu sağlamak.
- AWS Lambda, Java, Go, PowerShell, Node.js, C#, Python ve Ruby dillerini destekler.

## Automatic Scaling - Otomatik ölçeklendirme

AWS Lambda, kodunuzu yalnızca gerektiğinde çağırır ve herhangi bir manuel yapılandırma
olmadan gelen isteklerin oranını desteklemek için otomatik olarak ölçeklenir. Kodunuzun
işleyebileceği istek sayısında bir sınırlama yoktur. AWS Lambda, genellikle bir olayın
milisaniyesi içinde kodunuzu çalıştırmaya başlar. Lambda otomatik olarak
ölçeklendiğinden, olay sıklığı arttıkça performans tutarlı bir şekilde yüksek kalır.
Kodunuz durum bilgisiz olduğundan Lambda, uzun dağıtım ve yapılandırma gecikmeleri
olmadan gerektiği kadar çok örnek ( instance) başlatabilir.

## Fine-grained Control Over Performance - Performans Üzerinde Hassas Kontrol

Concurrency vardır işlerin paralel çalışmasını sağlayabilirsiniz, kullandıgınız
Concurrency miktarına göre ücretlendirme değişkenlik gösterir.

## Orchestrate Multiple Functions - Birden Çok İşlevi Yönetin

Karmaşık veya uzun süren görevler için birden çok AWS Lambda işlevini koordine etmek
için AWS Step Functions 'ı kullanabilirsiniz.

## Only Pay for What You Use - Yalnızca Kullandığınız Kadar Ödeyin

AWS lambda ile gelen istek sayısı ve fonksiyonununuz çalışması için harcanan süre
üzerinden ödeme yaparsanız. Concurrency ayarladıgınızda onun içinde ayrı olarak
faturalandırılırsınız.

Faturalandırma, bir milisaniyelik artışlarla ölçülür ve günde birkaç istekten saniyede
binlere kadar kolay ve uygun maliyetli otomatik ölçeklendirme sağlar.

## Flexible Resource Model - Esnek Kaynak Modeli

fonksiyonlara ayırmak istediğiniz bellek miktarını seçin ve AWS Lambda orantılı olarak
diğer ihtiyac duydugu kanakları ayarlayacaktır cpu gibi.
