---
publishDate: 2026-10-30T09:33:00Z
author: Hakan Çelik
title: "Yapay Zeka Ses Çiftliği ile 17 Dilde Sesli Meal Üretimi Nasıl Yaptım"
excerpt: "Tek bir bilgisayarda aylar sürecek 17 dilde 54 meallik ses üretimini, gönüllülerin bilgisayarlarından kurduğum bir ağa dağıttım. Mimari, kalite kontrolü ve güvenlik."
category: Yapay Zeka
image: ~/assets/images/blog/ses-ciftligi.jpg
tags:
  - yapay-zeka
  - ses-sentezi
  - dagitik-sistemler
  - gonullu-hesaplama
  - vakit
---

Yaklaşık 1 yıl 3 aydır Vakit adında bir mobil uygulama geliştiriyorum. Kodundan içindeki görsellere, kaynaklara ve seslere, sosyal medya ve App Store için hazırlanan video ve görsellere kadar her işte yapay zekâdan yararlanıyorum. Aslen mobil geliştirici değilim, ama hep markette bir uygulamam olsun isterdim; yapay zekâ sayesinde bu mümkün oldu. Eskiden bu kadar işi tek bir kişinin yapması mümkün değildi. Bunu mümkün kılan ve hayalimi gerçekleştirmeme yardım eden yapay zekâya teşekkür ediyorum. Bu yazı da o işlerden birini anlatıyor: Vakit'teki meallere ses vermek için kurduğum gönüllü bilgisayar ağını.

Detaylı bilgi için: [vakit.hakancelik.dev](https://vakit.hakancelik.dev/)

Uygulamadaki Kur'an meallerini dinlenebilir yapmak istiyordum; bu konuda çok geri bildirim de almıştım. Uygulamada meal dinlenemediği için kullanıcılar başka kaynaklara yöneliyordu.

Tek bir meal 114 sûre, yaklaşık 20 saat ses. Hedefimiz 17 dilde 54 meal. Uygulamada daha çok dilde daha çok meal var, ama kullandığımız yapay zekâ modeli Vakit'in sunduğu dillerden yalnızca 17'sinde hizmet veriyor. Bu kadar mealin insan sesiyle okunmuş kaydını bulmak zor; bulunsa bile her biri için ayrı ayrı izin almak gerekiyor. Yapay zekâyla üretmek mümkün, ama ses hem gerçekçi hem kaliteli olsun dediğimde bu iş benim M1 iMac'imde aylar sürüyordu.

Çözüm şuydu: işi parçalara bölüp Vakit'e destek olmak isteyenlerin bilgisayarlarına dağıtmak. 23 Ekim'de başladık; 30 Ekim itibarıyla:

- 🎙️ **17 dilde 3.954 sûre**, **705 saat** ses (hedefin %64'ü)
- ✅ **34 meal** tamamlandı
- 🔍 **3.950** kalite kontrolü
- 📝 **3.828** sûrede kelime kelime takip
- 💻 **48** bilgisayar: ilk nesil M1 Mac'lerden RTX 5090'lı oyun bilgisayarlarına, ekran kartı olmayan masaüstlerine kadar

Bu yazıda sistemin nasıl çalıştığını ve güvenliği nasıl sağladığımızı anlatıyorum.

Önce büyük resim; aşağıdaki bölümler bu resmin parçalarını tek tek anlatıyor.

![Büyük resim: kurulumdan uygulamaya bir sûrenin bütün yolu.](/images/posts/yapay-zeka/ses-ciftligi-akis.jpg)

_Büyük resim: kurulumdan uygulamaya bir sûrenin bütün yolu._

## 1. Katılmak tek satır

Gönüllü terminale tek bir komut yapıştırıyor:

```bash
curl -fsSL https://farm-vakit.hakancelik.dev/install.sh | bash
```

(Windows'ta PowerShell'de tek satırlık karşılığı var.) Sonrasında hiçbir şey yapması gerekmiyor. Komut makineyi tanıyor (Apple Silicon Mac mi, NVIDIA kartlı ya da kartsız Windows/Linux mu), uygun motoru indiriyor ve arka planda çalışmaya başlıyor. Yönetici (sudo) izni istemiyor; Mac'te kullanıcı servisi, Linux'ta kullanıcı düzeyinde systemd, Windows'ta kullanıcının başlangıç kaydıyla her açılışta kendiliğinden başlıyor. Kaldırmak için aynı satırın sonuna `-s -- --uninstall` eklemek yetiyor.

Bilgisayarı kullanan kişiyi rahatsız etmemesi baştan kuraldı. Düşük öncelikte ve aynı anda tek bir üretim işiyle çalışıyor. Boş bellek %20'nin altındaysa iş almıyor; iş ortasında %10'un altına inerse işi bırakıp bir dakika sonra temiz başlıyor. Dizüstü bilgisayar pile geçince ya da kapağı kapanınca duruyor, açılınca kaldığı yerden devam ediyor: uzun bir sûre parça parça kaydedildiği için yarıda kalan iş baştan başlamıyor. Sunucuya yalnızca makinenin adı, donanım bilgisi (ekran kartı, bellek, sürücü), iş hızı ve çiftliğin kendi hata kayıtları gidiyor; kişisel dosyalara dokunulmuyor.

### Komuttan sonra bilgisayarda neler oluyor?

Mac'te komut sırayla şunları yapıyor. Windows ve Linux'ta adımlar aynı, yalnızca araçların adı değişiyor.

1. **Makineye bakıyor.** İşlemciyi, belleği, ekran kartını ve işletim sistemi sürümünü okuyor. Bilgisayar ses üretemeyecekse hiçbir şey indirmeden çıkıyor ve nedenini söylüyor.
2. **Kendine ayrı bir Python kuruyor.** Sistemdeki Python'a dokunmuyor. `uv` adlı araçla, yalnızca ev klasöründeki `vakit-meal-worker` klasörünün içine ayrı bir Python ortamı kuruyor. İndirilen `uv` dosyasının da özeti doğrulanıyor.
3. **Kendini kaydettiriyor.** Sunucuya makinenin adını ve donanımını bildirip o makineye özel bir anahtar alıyor. Sonraki her istekte kendini bu anahtarla tanıtıyor.
4. **Başlatıcıyı indiriyor.** Asıl çalışan program, imzalı paketteki başlatıcı (launcher). İmzası ve özeti tutmazsa kurulum duruyor.
5. **Arka plan servisi olarak kaydediyor.** Mac'te launchd, Linux'ta systemd, Windows'ta Görev Zamanlayıcı. Bilgisayar her açıldığında kendiliğinden başlıyor; terminali kapatmak hiçbir şeyi durdurmuyor.
6. **Kontrol aracını kuruyor.** Apple Silicon Mac'te, başka makinelerin ürettiği sesi dinleyebilmek için konuşma tanıma aracını kuruyor. Kurulamazsa makine yalnızca ses üretiyor.

Kurulum birkaç dakika sürüyor. Büyük dosyalar ilk işle birlikte bir kez iniyor: yaklaşık 3 GB'lık ses modeli, Windows/Linux'ta NVIDIA motoru, kontrol yapan makinelerde de konuşma tanıma modeli. Hepsinin özeti doğrulanmadan kullanılmıyor. Bundan sonra başlatıcı, asıl işi yapan işçi programını (worker) çalıştırıyor ve ayakta tutuyor: çökerse yeniden başlatıyor, yeni sürüm gelirse imzasını doğrulayıp güncelliyor.

## 2. Mimari: bir koordinatör, çok sayıda işçi

Sistem iki parçadan oluşuyor:

- **Koordinatör:** Küçük bir bulut sunucusunda çalışan tek bir Python süreci ve tek dosyalık bir SQLite veritabanı. Hangi sûrenin hangi aşamada olduğunu, hangi makinenin ne iş yaptığını burada tutuyor.
- **İşçiler (worker):** Gönüllülerin bilgisayarları. Hepsi aynı kodu çalıştırıyor; Mac, Windows, Linux farkını yalnızca motor katmanı biliyor. Gerektiğinde saatlik kiralanan bir bulut GPU'su da aynı koddan işçi olarak katılabiliyor.

Bağlantı tek yönlü: işçi koordinatöre gidiyor, koordinatör kimseye gitmiyor. Gönüllünün modeminde port açmaya, sabit IP'ye gerek yok. Koordinatörün de dışarıya açık bir portu yok; trafik Cloudflare tüneli üzerinden geliyor.

Her iş bir makineye **10 dakikalığına emanet ediliyor**; makine çalıştıkça "hâlâ buradayım" diyerek süreyi uzatıyor. Makine kapanır, internet koparsa süre doluyor ve iş kendiliğinden başka bir makineye geçiyor. İş başka bir makineye geçtiyse eski makinenin geç gelen sonucu reddediliyor; aynı işi iki makine birden teslim edemiyor.

Sesi üreten motor açık kaynak bir model (VoxCPM2). 8-bit sıkıştırılmış hâliyle Mac'te Apple'ın grafik birimi, Windows/Linux'ta NVIDIA kartı üzerinde çalışıyor; böylece 8 GB ekran kartı olan bir oyun bilgisayarı da katkı verebiliyor. Birden çok kartı olan makinede her karta ayrı bir işçi açılıyor. Ekran kartı olmayan Windows/Linux bilgisayarlar da aynı motoru işlemcide çalıştırıyor. Kartlı bir makineden çok daha yavaşlar, bu yüzden koordinatör onlara kısa sûreleri veriyor; yavaş da olsa her sûre bir katkı.

## 3. Bir sûrenin yolculuğu

Bir sûreyi, örneğin Türkçe bir mealin Yâsîn sûresini, baştan sona izleyelim.

**Sıraya girmek.** Bir meal çiftliğe eklendiğinde 114 sûresinin her biri sunucudaki veritabanına ayrı bir iş olarak yazılıyor. Her dilin ilk işi ise "çapa": o dilin okuyucu sesini belirleyen kısa bir örnek ses. Bütün sûreler bu sese benzetilerek üretiliyor; böylece bir mealin 114 sûresi aynı kişi okuyormuş gibi duyuluyor.

**İşi almak.** Ortada elle çalıştırılan bir komut ya da indirilen bir liste yok. İşçi program döngü hâlinde sunucuya HTTPS üzerinden "bana iş var mı?" diye soruyor. Soruyla birlikte makinesinin ne yapabildiğini de söylüyor: kaç GB belleği var, ses kontrol edebiliyor mu, hangi sürümü çalıştırıyor. Hangi işi vereceğine sunucu karar veriyor. İş varsa cevap işin kendisini taşıyor: hangi mealin hangi sûresi, okunacak metin (âyet âyet, uzun âyetler cümle cümle bölünmüş), ses ayarları ve o dilin örnek sesinin özeti. Gönüllünün bilgisayarına meal veritabanı ya da depolama anahtarı gitmiyor; işçi yalnızca o sûrenin metnini görüyor. İş yoksa biraz bekleyip yeniden soruyor.

**Sesi üretmek.** İşçi önce dilin örnek sesini indiriyor ve özetini doğruluyor. Sonra metni parça parça modele okutuyor. Her parça bittiğinde diske kaydediyor; bilgisayar kapanırsa iş kaldığı yerden sürüyor. Bu sırada arka planda dakikada bir sunucuya "hâlâ çalışıyorum" diyor ki iş elinden alınmasın. Süresi tuhaf çıkan bir âyet (çok kısa ya da çok uzun) farklı bir rastgelelik tohumuyla (seed) yeniden üretiliyor.

**Teslim etmek.** Bütün parçalar bitince işçi onları birleştirip sıkıştırılmış bir ses dosyasına (m4a) çeviriyor ve her âyetin seste başladığı ve bittiği milisaniyelerle birlikte sunucuya yüklüyor. Sunucu sesi kabul etmeden önce dosyanın özetini, metnin özetini, ses ayarlarının sürümünü ve âyet sayısını doğruluyor; tutmazsa reddediyor. İşçi sunucuya o an ulaşamazsa dosyayı kendi diskinde bekletip bağlantı gelince gönderiyor.

**Kontrol, onarım, hizalama.** Kabul edilen ses kontrol kuyruğuna giriyor. Bir sonraki "iş var mı?" sorusunda **başka bir makine** bu sesi kontrol işi olarak alıyor (ayrıntısı bir sonraki bölümde). Tutmayan âyet varsa onarım işi açılıyor. Kontrolden geçen sûre için de hizalama işi açılıyor: her kelimenin seste hangi saniyede başladığı hesaplanıyor ve uygulamada meal okunurken o an söylenen kelime vurgulanıyor.

**Yayın.** Hizalanan sûre depolamaya (Cloudflare R2) yükleniyor ve sunucudan siliniyor. Mealin 114 sûresi de bitince ses dizini tek seferde güncelleniyor; dosya yolları içeriğin özetiyle adlandırıldığı için yarım bir yayın hiçbir zaman görünmüyor. Biten meal, uygulamanın bir sonraki sürümüyle kullanıcıya ulaşıyor.

Sunucu "iş var mı?" sorusuna cevap verirken de bu sırayı gözetiyor: önce örnek ses, sonra kontrol, onarım ve hizalama, en son yeni üretim. Yani yarım kalan sûrenin işi yeni sûreden önce bitiyor ve sunucuda ses birikmiyor.

## 4. Asıl zor kısım: ses doğru mu?

Her sûre yayından önce başka bir makinede dinleniyor. Bu şart, çünkü yapay zekâyla ses üretmenin sinsi bir sorunu var: model bazen bir kelimeyi atlıyor, bir cümleyi iki kez okuyor ya da hiç olmayan bir şey söylüyor. Üstelik aynı metni her çalıştırmada biraz farklı okuyor.

Kontrol eden makine sesi indiriyor, âyet sınırlarından dilimliyor ve her âyeti konuşma tanıma modeliyle (Qwen3-ASR) yazıya döküyor; sesin örnek sesle aynı kişi gibi duyulup duyulmadığını da ölçüyor. Döküm sunucuya gidiyor ve karşılaştırmayı sunucu yapıyor: duyulan metinle asıl metni harf harf karşılaştırıyor. Başa anlamsız bir söz eklenmesi, sondaki kelimelerin düşmesi, âyetin gevelenmesi ya da sessiz kalması hata sayılıyor. Rakamın yazıyla okunması gibi konuşma tanımanın bilinen yanılgıları ise eleniyor. Türkçe ve İngilizce dışındaki bir dil açılmadan önce o dilin örnek sûrelerini ikinci bir model (Whisper) de dinliyor; sesin doğallığı ve hızı da ölçülüyor.

Bir âyet tutmazsa sûrenin tamamı baştan üretilmiyor. **Yalnızca o âyet** üç farklı denemeyle yeniden üretiliyor, metne en yakın olanı seçilip sesin içine, tam yerine ekleniyor; arkasından gelen âyetlerin zamanları kaydırılıyor ve sûre tekrar kontrole giriyor. Onarımla da düzelmeyen âyet (çoğu rakam ya da mukattaa harfi gibi yanlış alarm) kulakla dinlenmek üzere ayrı bir listeye düşüyor.

Rakamlar bunun neden şart olduğunu gösteriyor: kabaca **her altı sûreden birinde** en az bir hatalı âyet çıktı. Bunların yaklaşık üçte ikisi ilk onarımda düzeldi; kalanlara iki tur daha deneniyor. Bu döngü olmasaydı ya bu sesler hatalı yayınlanacaktı ya da her seferinde koca sûreler baştan üretilecekti.

## 5. Güvenlik: iki yönlü güven sorunu

Gönüllü ağında güven iki yönlü. Gönüllü, makinesine kurduğu koda güvenebilmeli; ben de gönüllünün gönderdiği sese güvenebilmeliyim. İkisini ayrı ayrı ele aldık.

### Gönüllüyü korumak: makinesine ne girdiği belli olmalı

- **İmzalı güncellemeler.** Her sürüm benim bilgisayarımda Ed25519 anahtarıyla imzalanıyor. Gönüllünün makinesindeki başlatıcı, imzayı içine gömülü açık anahtarla ve her dosyanın özetini tek tek doğrulamadan hiçbir kodu çalıştırmıyor. Sunucu ele geçirilse bile kurulu makinelere imzasız kod ulaşamıyor. (İlk kurulum betiği hâlâ sunucudan geliyor; o tek adımda güven, HTTPS ve alan adına dayanıyor. Çekinen, betiği önce indirip okuyabilir.)
- **Sabitlenmiş indirmeler.** Ses motoru ve yapay zekâ modelleri belirli bir sürüme sabitli; motor dosyalarının özeti imzalı paketin içinde yazılı, uymayan dosya kullanılmıyor.
- **Bozuk sürümden kendiliğinden dönüş.** Yeni sürüm açıldıktan sonraki ilk iki dakikada üç kez çökerse makine önceki sürüme dönüyor ve o sürümü kara listeye alıyor. İki farklı makine aynı sürümden geri dönerse sürüm herkes için geri çekiliyor.
- **Uzaktan komut yok, sabit liste var.** Koordinatör bir makineye yalnızca önceden tanımlı beş şey söyleyebiliyor: yeniden başla, güncelle, yeniden kur, kontrol ortamını sıfırla, günlüğü gönder. Uzaktan keyfi komut çalıştırmak mümkün değil.
- **Yetki istemiyor.** Kurulum ve çalışma kullanıcı hesabıyla; yönetici izni hiç istenmiyor.

### Sesi korumak: hiçbir makineye körü körüne güvenilmiyor

- **Makine başına kimlik.** Her makine kurulumda kendi anahtarını alıyor; sunucu yalnızca anahtarın özetini saklıyor. Kötü davranan bir makine tek başına kapatılabiliyor. Aynı adresten saatte yapılabilecek kayıt sayısı sınırlı.
- **Hiçbir makine kendi sesini onaylayamaz.** Bir sûreyi üreten ya da onaran makine, o sûrenin kontrolünü alamıyor; bu kural koordinatörün iş dağıtım sorgusunun içinde.
- **Teslimde tutarlılık.** Ses, metnin özeti ve ses ayarlarının sürümü işle birebir tutmazsa reddediliyor. Bu, eski ya da hatalı bir istemcinin yanlış metinle ürettiği sesi içeri almıyor.
- **Yetkiler ayrı.** Gönüllü anahtarı yalnızca iş alıp sonuç gönderebiliyor; yönetim, yeniden kuyruğa alma ve yayın ayrı bir yönetici anahtarı istiyor.

Bu yaklaşım, gönüllü hesaplamanın klasik çözümünden (her işi iki makinede yapıp sonuçları karşılaştırmak) daha ucuz: sesi iki kez üretmek yerine bir kez üretip başka bir makinede bir kez dinletiyoruz. Yapay zekâ aynı metni her seferinde farklı okuduğu için iki sesi birebir karşılaştırmak zaten işe yaramazdı.

## 6. Uzaktan görmek

Kayıtlı 62 bilgisayarın (48'i üretime, kontrole, onarıma ya da hizalamaya katkı verdi) çoğuna erişimim yok, ama sağlık durumlarını görüyorum. Kurulumun her adımı, işçinin açılışta bulduğu donanım, ilk işin hızı ve her hatanın son kayıtları yönetim sayfasına düşüyor. Bir gönüllü "çalışmıyor" demeden önce sorunun nerede olduğunu çoğu zaman biliyorum. Herkese açık sayfada da her mealin ne kadar ilerlediği ve kaç makinenin çalıştığı canlı görünüyor.

## 7. Neler öğrendim

- **Yavaş makine de değerli.** Eski bir M1 Mac yalnızca 31 sûre üretti ama 318 sûreyi kontrol etti. Hızlı makineler üretiyor, yavaşlar dinliyor; herkesin bir işi var.
- **Kontrol, üretimden ucuz.** Bir sesi yazıya dökmek onu üretmekten çok daha hızlı. Güveni bunun üzerine kurmak maliyeti ikiye katlamadan doğrulama sağlıyor.
- **Uzun metni tek seferde seslendirmeyin.** Model uzun metinde yarım dakika civarında susuyor; birkaç âyeti birlikte üretince de arkaya uğultu ekliyor, ses tonu ve yüksekliği kayıyordu. Bu yüzden her âyet ayrı ayrı, hep aynı örnek sese bakarak üretiliyor. Böylece 286 âyetlik Bakara'nın sonu da başı gibi duyuluyor, bozulan bir âyet de tek başına onarılabiliyor.
- **Gönüllüye hiçbir şey yaptırmayın.** Kurulumdan sonra tek bir komut bile istememek, katılmayı kolaylaştıran şey oldu. Güncellemenin ve geri dönüşün kendiliğinden olması da bunun parçası.
- **Basit altyapı yetiyor.** Tek süreç ve tek dosyalık bir veritabanı, bugünkü ölçekte onlarca makineyi rahatça yönetiyor. Kuyruk sistemi, ayrı bir veritabanı sunucusu ya da konteyner orkestrasyonu gerekmedi.

## Sırada ne var?

Hedefteki 54 mealin kalan 20'si sırada. Bilgisayarınızı bağlamak isterseniz:

1. Apple Silicon bir Mac (16 GB ve üzeri bellek) ya da Windows/Linux bir bilgisayar yeterli: 8 GB ve üzeri NVIDIA kartı varsa 16 GB bellek, kart yoksa en az 8 GB bellek (işlemcide, daha yavaş üretir).
2. **[farm-vakit.hakancelik.dev](https://farm-vakit.hakancelik.dev/)** adresindeki tek satırı yapıştırın.
3. Gerisi kendiliğinden: kurulum bitince makine iş almaya başlar.

Biten mealler Vakit'in yeni sürümüyle gelecek: [App Store'da Vakit](https://apps.apple.com/app/id6748356813)

Bu sistemi açık kaynak yapmayı da düşünüyorum; sesli kitap, eğitim içeriği ya da başka diller için kullanılabilir. İlgilenirseniz yazın, hangi kullanım sizin için önemli, onu da söyleyin.

## Son söz

Her şey, uygulamada meal dinlemek isteyen kullanıcıların geri bildirimleriyle başladı. Tek bir bilgisayarda aylar sürecek iş, bir haftada 48 bilgisayarla 34 meale ulaştı. Bilgisayarını bu işe açan herkese teşekkür ederim: biten her meal, sizin katkınızla kullanıcılara ulaşıyor.

İlk günlerde katkı veren bilgisayar sayısı iyiydi, ama son günlerde epey azaldı ve henüz %100'e ulaşamadık. Bu yazıyı okuyorsanız [farm-vakit.hakancelik.dev](https://farm-vakit.hakancelik.dev/) adresini ziyaret edip kurulum komutunu çalıştırmanız, sesli mealleri çok daha hızlı şekilde kullanıcılara ulaştırmamı sağlar. Desteğiniz ve bu yazıyı okuduğunuz için teşekkürler.

_Bu yazı ilk olarak [X'te](https://x.com/hakancelikdev/status/2116101103964062193) yayınlandı._
