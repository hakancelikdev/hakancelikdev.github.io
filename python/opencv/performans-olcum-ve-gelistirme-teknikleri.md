# Performans Ölçüm Ve Geliştirme Teknikleri

Herkese merhaba arkadaşlar bu bölümde opencv'de yaptığımız çalışmaları nasıl daha
permormanslı yani daha hızlı vb olayları öğrenmeye çalışacağız.Biliyor olmanız gerektiği
gibi opencv gibi teknolojilerle kodlama yaparken bir çok sayıda işlem yapılıyor bizim
genel hedefimiz amacımıza uygun olarak doğru sonucu bulmak oluyor fakat en hızlı ve en
güvenilir sekilde bu doğru sonucu elde etmek biz yazılımcıların çalışma sistemi olması
gerek neyse konuya geçelim.

## Hedefler

- Kodunuzun performansını ölçmek için
- Kodunuzun performansını artırmak için bazı ipuçları
- Ve son olarak bu fonksiyonları öğrenip işlemi bitireceğiz **cv2.getTickCount**,
  **cv2.getTickFrequency** vs.

## OpenCV ile Performans Ölçümü

İlk olarak **cv2.getTickCount\(\)** fonksiyonu,saat devir sayısını veriyor, örnek olarak
şu şekilde çıktı alıyoruz, bu fonksiyon bir referasn olayından sonra \( siz bir düymeyi
açmişsiniz gibi \) bu fonksiyonu çağırana kadar geçen saat devrim sayısını döndürüyor,
dolayısı ile bu yapılacak olan kodlamadan önce ve sonra çağrılarak geçen saat devrim
sayıları alınıp aradaki fark'a bakara performans ile ilgili bir fikir edinebiliyorsunuz.

```python
>>> import cv2
>>> e1 = cv2.getTickCount()
>>> e2 = cv2.getTickCount()
>>> e1
311581540258
>>> e2
311594815111
```

ikinci olarak **cv2.getTickFrequency\(\)** fonksiyonu saat çevrimlerinin frekansını veya
saniyedeki saat çevrim sayısını döndürür. Saniye olarak yürütme süresini bulmak için
şunları yapabilirsiniz.

```python
>>> e1 = cv2.getTickCount()
# burada sizin kodlarınızın olması gerek
>>> e2 = cv2.getTickCount()
>>> time = (e2-e1)/cv2.getTickFrequency()
>>> time # burada geçen zamanı bulmuş oluyoruz
0.6719153391030833
```

dökümandaki örneğe bakıcak olursak Aşağıdaki örnek, 5 ila 49 arasında değişen tek
boyutlu bir çekirdek ile medyan filtreleme uygular. \(sonuç önemsiz çünkü bu bizim
amacımız değil\):

```python
import cv2
img1 = cv2.imread('messi5.jpg')
e1 = cv2.getTickCount() # kodlarımızı çalıştırmadan önce tick sayısını alıyoruz
for i in xrange(5,49,2):           # kodlarımız
    img1 = cv2.medianBlur(img1,i)  # kodlarımız ne yaptığı umrumuzda bile değil,çünkü amacımız bu işlemi kaç sanıyede yaptığı
e2 = cv2.getTickCount() # işlem bittikten sonra ikinci tick 'imizi alıyoruz
t = (e2 - e1)/cv2.getTickFrequency() # geçen zamanı hesaplıyoruz ,tick arasındaki fark ve 1 saniyede geçen tick sayısına bölerek geçen zamanı buluyoruz
print t
# sonuç 0.521107655 saniye çıkıyor, sizde deneyin sonuç fazla çıkarsa resmin boyutunu küçültün ,küçülme işlemi için python'un bir başka kütüphanesi olan PIl'i kullanabilirsiniz,bir şeyler yapın işte en hızlı hesaplamasını sağlayın amacımız bu değilmi ?
```

Aslında sizin şu sıralarda ulan ne gerek var ben bu zaman hesaplamasını python'un time
modulü ile de yaparım demeniz gerek, evet yapabilirsiniz yine aynı şekilde kodlarınızı
yazmadan önce e1 = time.time\(\) diyip daha sonra kodlar bittikten sonra yine e2 =
time.time\(\) diyerek aradaki farka bakıp ne kadar süre geçtiğini bulabilirsiniz.

## OpenCV'de Varsayılan Optimizasyon

OpenCV işlevlerinin birçoğu **SSE2**, **AVX** vb. Kullanılarak optimize edilmiştir.
Ayrıca optimize edilmemiş kod içerir. Dolayısıyla, sistemimiz bu özellikleri
destekliyorsa onları kullanmalıyız \(hemen hemen tüm modern işlemciler onları
destekliyor\). Derleme sırasında varsayılan olarak etkindir. Yani **OpenCV** optimize
edilmiş kod etkinse çalıştırır, aksi takdirde optimize edilmemiş kodu çalıştırır.
**Cv2.useOptimized\(\)** işlevinin etkin / devre dışı olup olmadığını kontrol etmek ve
**cv2.setUseOptimized\(\)** işlevini etkinleştirmek / devre dışı bırakmak için
kullanabilirsiniz. Basit bir örnek görelim.

```python
# bu kodlar galiba Ipython kullanılarak yapılmış pek emin değilim
import cv2
# kontrol ediyoruz eğer optimizasyon açık ise
# 5.satırada bu yüzden büyük ihtimal daha önceki satırlarda resmi yani img 'i  tanımlamış
In [5]: cv2.useOptimized()# önce optimizasyon açık iken kodları çalıştıracağız ve zaman bilgisini alacağız Ipython zaten her işlemden sonra bunu bize veriyor ama Ipython kullanmıyorsanız yukarıtaki anlatılanlar veya time modulünü kullanarak geçen zamanı hesaplayabilirsiniz.
Out[5]: True
In [6]: %timeit res = cv2.medianBlur(img,49)
10 loops, best of 3: 34.9 ms per loop # geçen süre 34.9 saniye iken
# devre dışı bırakıyoruz
In [7]: cv2.setUseOptimized(False) # optimizasyonu kapatıp deniyoruz
In [8]: cv2.useOptimized()
Out[8]: False # kapalı şuan
In [9]: %timeit res = cv2.medianBlur(img,49)
10 loops, best of 3: 64.1 ms per loop # ve 64.1 saniye , yani optimizasyon iyidir onu sevin
```
