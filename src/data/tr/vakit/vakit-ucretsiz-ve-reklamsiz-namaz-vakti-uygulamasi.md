---
publishDate: 2026-11-25T18:00:00Z
author: Hakan Çelik
title: "Vakit: Ücretsiz ve Reklamsız Bir Namaz Vakti Uygulaması — Neden Yaptım, İçinde Ne Var"
excerpt: "Namaz vakitleri, ezan, kıble ve Kur'an; reklamsız, paywall'sız, hesap istemeden ve internetsiz. Vakit'i neden yaptığımı, diğer uygulamalardan farkını ve içinde neler olduğunu anlatıyorum."
category: Vakit
image: ~/assets/images/blog/vakit-tanitim.jpg
tags:
  - vakit
  - namaz-vakitleri
  - ios
  - android
  - gizlilik
---

Vakit, namaz vakitleri ve ezan için yaptığım bir uygulama: Kur'an, kıble, zikir ve mübarek günleri hatırlayan bir takvimle birlikte. iPhone, iPad, Apple Watch, Mac ve Android'de çalışıyor; **ücretsiz, reklamsız, hesap istemiyor ve vakitler internetsiz çalışıyor.** App Store'da 641 değerlendirmeden 4,8 puanı var.

<div class="not-prose my-8 rounded-2xl bg-gray-100 dark:bg-stone-800 p-6 flex flex-col sm:flex-row gap-3 sm:items-center">
  <p class="flex-1 font-semibold">Vakit'i ücretsiz indir — reklam yok, hesap yok.</p>
  <a class="inline-block rounded-full bg-primary text-white px-5 py-2 font-semibold text-center" href="https://apps.apple.com/app/id6748356813?pt=127947182&ct=blog-vakit-tr-top">App Store</a>
  <a class="inline-block rounded-full bg-primary text-white px-5 py-2 font-semibold text-center" href="https://play.google.com/store/apps/details?id=com.hakancelikdev.vakit&referrer=utm_source%3Dvakit-site%26utm_medium%3Dweb%26utm_campaign%3Dblog-vakit-tr-top">Google Play</a>
</div>

## Neden bir namaz uygulaması daha?

Mağazada yüzlerce namaz uygulaması var. Ama hemen hepsinde aynı sorunlarla karşılaşıyordum:

- **Reklamlar.** Dini içeriğin hemen yanında kumar ve uygunsuz reklamlar çıkabiliyor. Ezan vaktine bakarken bir oyunun videosunu kapatmaya çalışmak ibadetin ruhuna aykırı.
- **Paywall.** Temel özellikler "premium" aboneliğin arkasına saklanıyor. İbadet etmek herkesin hakkı; kıble pusulasının ya da bir mealin ücretli olması bana hep yanlış geldi.
- **İnternet şartı.** Vakitler bir sunucudan çekildiği için uçakta, yurt dışında ya da şebekenin zayıf olduğu yerde uygulama işe yaramıyor.
- **Gizlilik.** 2020'de, milyonlarca kullanıcısı olan bir namaz uygulamasının konum verisinin bir veri aracısı üzerinden ABD ordusuyla çalışan şirketlere ulaştığı haberleri çıktı ([Al Jazeera](https://www.aljazeera.com/news/2020/11/17/report-us-military-buying-location-data-on-popular-muslim-apps)). Uygulama iddiayı reddetti ama veri ortaklıklarını sonlandırdı. İnsanların ibadet ederken nerede olduğu bir ürün olmamalı.

Vakit bu dört soruya verdiğim cevap.

## On ilke: İbadet uygulaması nasıl olmalı?

Vakit'i yazarken her kararı on ilkeye dayandırdım. Uygulamanın içinde de, sitesinde de [Vakit Manifestosu](https://vakit.hakancelik.dev/manifesto.html) olarak duruyor:

1. **İnternetsiz çalışmalı.** Vakitler, kıble ve zikir şebekesiz de eksiksiz çalışır; Kur'an ve hadis bir kez indirildikten sonra internetsiz okunur.
2. **Reklam olmamalı.** İbadet huşû ister. Uygulama tamamen reklamsızdır.
3. **Hiçbir özellik paranın arkasına saklanmamalı.** Kilitli özellik, ayrıcalıklı sürüm ya da deneme süresi yok.
4. **Herkes kullanabilmeli.** Ekran okuyucu, büyük punto, yüksek kontrast, dinlenebilir içerik.
5. **Doğru olmalı.** Namaz vakti "yaklaşık" olamaz. Diyanet, Umm Al-Qura, Singapur ve Moonsighting yöntemleri, yöntemi yayımlayan kurumun kendi takvimiyle karşılaştırılarak doğrulanır.
6. **Dünyanın her yerinde çalışmalı.** Güneşin günlerce batmadığı kuzeyde de, ekvatorda da, yolculukta da.
7. **Kimliğiniz sorulmamalı.** Hesap yok; adınız, e-postanız, telefonunuz sorulmaz.
8. **Sizi bunaltmamalı.** Bildirim yağmuru, seri bozma baskısı, rozet yarışı yok.
9. **Herkesin dilinde olmalı.** 25 dil, sağdan sola yazılanlar dahil.
10. **Kullanıcıların desteğiyle ayakta durmalı.** Büyük küçük demeden, herkesin katkısı bu hizmeti sürdürüyor.

## İçinde neler var?

<div class="not-prose grid grid-cols-2 sm:grid-cols-4 gap-4 my-8">
  <figure><img class="rounded-2xl shadow-lg" src="/images/posts/vakit/tr/prayer-times.webp" alt="Vakit namaz vakitleri ekranı" width="390" height="844" loading="lazy"><figcaption class="text-sm mt-2 text-center">Namaz vakitleri</figcaption></figure>
  <figure><img class="rounded-2xl shadow-lg" src="/images/posts/vakit/tr/widget.webp" alt="Kilit ekranı ve widget'lar" width="390" height="844" loading="lazy"><figcaption class="text-sm mt-2 text-center">Kilit ekranı, widget</figcaption></figure>
  <figure><img class="rounded-2xl shadow-lg" src="/images/posts/vakit/tr/qibla.webp" alt="Kıble pusulası" width="390" height="844" loading="lazy"><figcaption class="text-sm mt-2 text-center">Kıble pusulası</figcaption></figure>
  <figure><img class="rounded-2xl shadow-lg" src="/images/posts/vakit/tr/quran.webp" alt="Kur'an-ı Kerim" width="390" height="844" loading="lazy"><figcaption class="text-sm mt-2 text-center">Kur'an</figcaption></figure>
</div>

### Namaz vakitleri ve ezan

- **12 hesaplama yöntemi**, zaman dilimine duyarlı ve seyahati algılayan. Vakitler bir sunucudan sorgulanmaz, seçtiğin yönteme göre telefonunda hesaplanır.
- **Ezan sesleri:** her vakit kendi makamında okunur — sabah saba, öğle uşşak, ikindi rast, akşam segah, yatsı hicaz. Ezanlar uygulamayla gelir, çalmaları internet gerektirmez.
- **Vakit çıkmadan alarm:** o namazı kılmadıysan vakit çıkmadan çalar, kıldıysan susar. iOS 26'da sessiz modu delen gerçek bir alarm.
- **Kilit ekranı:** Live Activity, Dynamic Island, StandBy ve 26 widget. Sonraki vakit, telefonu açmadan bir bakışta.
- **Kerahat ve nafile vakitleri** isteğe bağlı; işrak, kuşluk ve evvâbin dahil.

### Kur'an, hadis ve kitaplık

- 114 sure, kelime kelime analiz, **24 dilde 72 meal ve 20 dilde 51 tefsir**; kaynağı mütercim ya da müellif adıyla sen seçersin.
- Medine ya da Türkiye hattıyla mushaf, isteğe bağlı tecvid renkleri.
- İndirilebilen tilavet ve **sesli meal**: Türkçe 13 mealde doğal Vakit sesi. (O sesleri nasıl ürettiğimi [ayrı bir yazıda](/yapay-zeka-ses-ciftligi-ile-17-dilde-sesli-meal) anlattım.)
- Yedi büyük koleksiyondan **36 binden fazla hadis**, Arapça aslı ve 16 dilde tercümesiyle.
- 180'den fazla eserlik bir kitaplık; Türkçede Diyanet yayınları, Riyâzü's-Sâlihîn, Hısnü'l-Müslim dahil.

<div class="not-prose grid grid-cols-2 sm:grid-cols-4 gap-4 my-8">
  <figure><img class="rounded-2xl shadow-lg" src="/images/posts/vakit/tr/discover.webp" alt="Tüm araçlar tek yerde" width="390" height="844" loading="lazy"><figcaption class="text-sm mt-2 text-center">Tüm araçlar</figcaption></figure>
  <figure><img class="rounded-2xl shadow-lg" src="/images/posts/vakit/tr/profile.webp" alt="İbadet halkaları" width="390" height="844" loading="lazy"><figcaption class="text-sm mt-2 text-center">İbadet halkaları</figcaption></figure>
  <figure><img class="rounded-2xl shadow-lg" src="/images/posts/vakit/tr/qada.webp" alt="Kaza takibi" width="390" height="844" loading="lazy"><figcaption class="text-sm mt-2 text-center">Kaza takibi</figcaption></figure>
  <figure><img class="rounded-2xl shadow-lg" src="/images/posts/vakit/tr/calendar.webp" alt="Hicri takvim" width="390" height="844" loading="lazy"><figcaption class="text-sm mt-2 text-center">Takvim</figcaption></figure>
</div>

### İbadet takibi, Ramazan ve rehberler

- **İbadet halkaları:** namaz, Kur'an, zikir, hadis ve kaza. Süreklilik nazikçe gösterilir — suçlandırma yok.
- **Kaza takibi:** kaza namazını vakit bazlı, kaza orucunu gün bazlı takip et; kıldıkça erir, ne zaman biteceği görünür.
- **Ramazan:** imsakiye, sahur alarmı (Ramazan'da, her gün ya da sünnet oruç günlerinde), oruç takibi.
- **Takvim:** Hicri ve Miladi birlikte; kandiller, bayramlar, arefeler ve hatırlatmaları.
- **Rehberler:** resimli 17 namaz türü, abdest-gusül-teyemmüm, Cuma rehberi; zekât ve fitre hesaplayıcı.

### Her cihazda, her dilde

- **iPhone, iPad, Apple Watch, Mac ve Android.** Watch'ta canlı kıble ve 14 komplikasyon; Mac'te menü çubuğunda geri sayım. Kayıtların iCloud üzerinden bütün Apple cihazlarında aynı.
- **25 dil**; Arapça, Urduca, Farsça ve Uygurca'da arayüz baştan sona sağdan sola.

## Diğer uygulamalar ve Vakit

| | Çoğu namaz uygulaması | Vakit |
|---|---|---|
| Reklam | Dini içeriğin yanında kumar ve uygunsuz reklamlar | Tamamen reklamsız; isteğe bağlısı da yok |
| Maliyet | Paywall, abonelik, "premium" seviyeler | Ücretsiz; seviye yok, upsell yok |
| İnternet | Temel özellikler internet ister | Vakitler, bildirimler, kıble ve zikir ilk açılıştan internetsiz |
| Kilit ekranı | Widget'lar güncellemelerde bozulur | Live Activity, Dynamic Island, StandBy |
| Doğruluk | Yaz/kış saati hataları, sınırlı hesaplama | 12 yöntem, zaman dilimi bilinci, seyahat algılama |
| Cihazlar | Yalnız telefon | iPhone, iPad, Apple Watch, Mac, Android |

## Verilerin bir emanet

- **Koordinatların sunucuma gelmez.** Konum olarak yalnız ülke, il ve ilçe gider. Adresin ve yakındaki camiler için konum yalnız Apple Haritalar'a gider.
- **Vakitler telefonunda hesaplanır**, bir sunucudan sorgulanmaz.
- **Kayıtların** — kaza defteri, hatim, yer imleri, favori camiler — yalnızca cihazında ve kendi iCloud alanında durur.
- Sunucuya giden kullanım verisi ad, e-posta ya da telefon içermeyen takma bir kullanıcı koduna bağlı. Neyin gittiği [gizlilik politikasında](https://vakit.hakancelik.dev/privacy.html) tek tek yazılı; açık söyleyeyim: takma kimlik, anonim değil.

## Nasıl ücretsiz kalıyor?

Uygulamanın tamamı ücretsiz: paywall yok, "premium" yok, kilitli özellik yok. Destek olmak isteyen tek seferlik ya da aylık bağış yapabilir; bağış hiçbir şeyin kilidini açmaz — zaten kilitli bir şey yok. Vakit'i ayakta tutan, onu kullanan insanların desteği.

## Bulunduğun şehrin vakitleri

Berlin'den Londra'ya, Mekke'den Kuala Lumpur'a 33 şehrin bugünkü namaz vakitlerini, **Ramazan 2027 imsakiyesini** ve kıble yönünü [şehir şehir namaz vakitleri](https://vakit.hakancelik.dev/namaz-vakitleri/) sayfasında topladım. Uygulama ise bunları dünyanın her yerinde, bulunduğun yere göre ve internetsiz hesaplıyor.

---

Vakit'i bir ibadet uygulaması nasıl olmalıysa öyle yapmaya çalışıyorum. Denersen, eksik bulduğun ne varsa uygulamadaki geri bildirimden yazman en büyük destek olur.

<div class="not-prose my-8 rounded-2xl bg-gray-100 dark:bg-stone-800 p-6 flex flex-col sm:flex-row gap-3 sm:items-center">
  <p class="flex-1 font-semibold">Ücretsiz. Reklamsız. Hesap yok. Vakitler internetsiz.</p>
  <a class="inline-block rounded-full bg-primary text-white px-5 py-2 font-semibold text-center" href="https://apps.apple.com/app/id6748356813?pt=127947182&ct=blog-vakit-tr-bottom">App Store'dan İndir</a>
  <a class="inline-block rounded-full bg-primary text-white px-5 py-2 font-semibold text-center" href="https://play.google.com/store/apps/details?id=com.hakancelikdev.vakit&referrer=utm_source%3Dvakit-site%26utm_medium%3Dweb%26utm_campaign%3Dblog-vakit-tr-bottom">Google Play'den İndir</a>
</div>

Daha fazlası: [vakit.hakancelik.dev](https://vakit.hakancelik.dev/)
