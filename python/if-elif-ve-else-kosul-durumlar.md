# If, Elif Ve Else Koşul Durumları

Bu konunun anlaşılması için yazmış olduğum işleçler konusunda bulunan **Karşılaştırma işleçleri**'nin öğrenilmesi gerekiyor, isterseniz hemen işleçler konusunu tekrar edin ve tekrardan bu konuya gelin, bunun için size link bırakıyorum [@hakancelik/islecler-ve-print-fonksiyonu](https://www.coogger.com/@hakancelik/islecler-print-ve-input-fonksiyonlar-kacs-dizileri/)

### Koşullu Durumlar Nedir?

Her programlama dilinde bulunan ve kod yazım sırasında bir durumun çalışması için başka bir durumu kontrol etmemizi sağlayan kod bloklarıdır, bunları sözlü bir şekilde algoritmik olarak örneklersek şu mantık ile çalışır.

```text
st=>start: Yükün ağırlığını ölç
cond=>condition: Yük 30 kg'dan büyük mü?
single=>end: Git yardım çağır
help=>end: Kaldır

st->cond
cond(yes)->single
cond(no)->help
```

Yukarıda görüldüğü gibi **yes, no** şeklinde ayrılan ve gelen cevaba göre farklı işler yapan blok koşul durumu sayesinde gerçekleşir.

Python'da koşul durumları 3 tane olup aşağıya yazmış olduğum durum kodlarıdır.

* **if**
* **elif**
  * elif diğer programlama dillerinde **else if** olarak geçer, python bunun kısa halini kullanır.
* **else**

\[=====================\]

## If Koşul Durumu

Hatırlarsanız [@hakancelik96/islecler-ve-print-fonksiyonu](https://www.coogger.com/@hakancelik96/islecler-print-ve-input-fonksiyonlar-kacs-dizileri/) bu içerikte python'da bulunan her nesnenin bir **bool** değeri yani **True** ve **False** değeri olduğunu söylemiştik işte bu konuda şimdi bu bilgiyi kullanacağız, ama nasıl? Aslında **koşul durumlarının önemsediği tek şey onlara şart olarak verilen nesnenin doğru olup olmadığıdır** bütün mesele budur.

Örnek vermek gerekirse **if "hakan"**  şeklinde yazdığımızda python **if** koşul durumuna verilen şartın \( yani "hakan" nesnesinin \)sadece doğru olup olmadığına bakar ve eğer şart doğru ise **if** durumu çalışır, yanlış ise çalışmaz.

Aşağıdaki kodları inceleyerek daha iyi anlayabiliriz.

```python
if True: # koşul durumundaki şart doğru ( True )
    print("if koşul durumdaki koşul doğru") # bu yüzden kod çalışır
print("bu kısım if durumunun dışında kalan kısımdır.")
```

Çıktımız :

`"if koşul durumdaki koşul doğru"`

```python
if False: # koşul durumdaki şart yanlış ( False )
    print("if koşul durumdaki koşul yanlış") # bu yüzden bu kod çalışmaz
```

Yukarıdaki script'in herhangi bir çıktısı olmaz çünkü koşul olarak verilen durum False'dur

Ek olarak fark etmiş olmalısınız ki **if** durumunun altındaki kod bloğunun if'in bloğu olduğunu belirlemek için 4 boşluk bıraktık ve `if <şart durumu>:` şeklinde yazdık python bu boşluklara ve **:** iki nokta üs üste durumuna bakarak hangi bloğun kime ait olduğunu anlar, zaten atom gibi editörler kullanıyorsanız siz **:** nokta bırakıp enter tuşuna bastığınızda oto 4 boşluk bırakacaktır, örnek verecek olursa c++ programlama dilinde yukarıda ki kod aşağıdaki gibi yazılır.

```c
if (true){
    // bu bölüm if durumu doğru ise çalışacak bölüm
    cout<<"if koşul durumdaki koşul doğru"<<endl;
}
// bu bölüm ise if doğru olsada olmasa çalışacak olan bölüm, if durumunun dışında kalan bölüm
```

c++ **{}** parantezlere bakarak anlar fakat python boşluklu yapısına bakara anlar ve 4 boşluk olması zorunlu değildir istediğiniz kadar yapabilirsiniz, fakat pep8 kuralı olarak 4 konulmuş ve herkes tarafından kullanılmaktadır.

if koşul durumu her daim kontrol edilen bir durumdur, bu ne demek diyorsanız elif ve else konularını okuyunca daha iyi anlayacaksınız ama yinede basit bir örnek ile şimdi bir ön hazırlık yapmış olalım.

```python
if True:
    print("ilk true")
if False:
    print("Çalışmayan satır")
if True:
    print("ikinci doğru")
if False:
    print("çalışmayan ikinci satır.")
```

yukarıda 4 tane if durumu var ve python bu script'i yukarıdan aşağıya doğru okurken gördüğü her if koşul durumuna verilen koşulun True mu oksa False mı olduğuna bakar ve True olan her durumu çalıştırır \( bu durum elif ve else de farklı \) bu yüzden çıktımız aşağıdaki gibi olacaktır.

```python
"ilk true"
"ikinci doğru"
```

## Elif Koşul Durumu

**elif** koşul durumunun **if** koşul durumundan çok az farkı vardır, bu fark da sözlü olarak şudur eğer **if** koşul durumuna verilen koşul **False** ise bir sonraki **elif** koşul durumuna bak ve koşul olarak verilen nesne **True** ise çalıştır, eğer elif çalışırsa bir sonraki elif'e bakma çalışmaz ise bir sonraki elif' durumuna bak, kodlar ile anlatayım.

```python
if False:
    print("çalışmayacak")
elif True:
    print("elif çalıştı")
elif True:
    print("ikinci elif çalışmadı çünkü zaten bir tane elif çalıştı.")
```

Sonuç ise `"elif çalıştı"` olacaktır, olayı tam kavrayamadınız ise bir sonrakine bakın.

```python
if True:
    print("elifler çalışmayacak sadece bu çalışacak")
elif True:
    print("elif çalışmayacak çünkü if durumu doğru")
elif True:
    print("elif çalışmayacak çünkü if durumu doğru")
```

çıktımız `"elifler çalışmayacak sadece bu çalışacak"` olacaktır çünkü dediği gibi if durumu doğru bu yüzden python bir sonraki elif durumlarına bakmayacak bile, son bir örnek daha

```python
if False:
    print("çalışmaz")
elif False:
    print("False olduğu için buda çalışmaz")
elif True:
    print("çalışır")
if True:
    print("bu başka bir if buda çalışır, hatırlarsanız python her if'i kontrol eder ve koşul True ise çalıştırır demiştim")
```

İf konusunu anlatırken yazdığım not şimdi anlaşılmıştır umarım.

## Else Koşul Durumu

* **else** koşul durumu **if** çalışmadığında yani if'durumu **False** olduğunda ve koşul durumlarının hiç biri çalışmadığında çalışan koşul durumudur.
* if ve elif de olduğu gibi önüne şart nesnesi almaz çünkü **else** koşul durumunun çalışma şartı bir üste yazdığım şarttır, bundan dolayı ek olarak belirtilmez ve python buna izin vermez.

```python
if False:
    print("çalışmaz")
elif False:
    print("çalışmaz")
elif False:
    print("çalışmaz")
else:
    print("else çalışır")
```

Hiç bir şart çalışmadığı için else koşul durumu çalıştı.

```python
if False:
    print("çalışmaz")
else:
    print("else çalışır")
```

İşleçleri kullanarak son bir örnek verip konuyu bitirelim, ben konunun daha iyi anlaşılması ve koşul durumlarının tek önemsediği şeyin nesnelerin bool değerleri olduğunu görün diye yukarıda hep True ve False örnekleri verdim, şimdide işleçleri ve diğer şeyleri kullanarak bir örnek verelim, konu bitsin.

```python
if 2>1:
    print("2 birden büyüktür")
else:
    print("1 ikiden büyüktür")
if 3 == 2:
    print("3 2'ye eşittir")
elif 3 != 4:
    print("3 4'e eşit değildir")

if "hakan":
    print("gördüğünüz gibi hakan'ın bool değeri",bool("hakan"), "dur")

if 0:
    print("koşul olarak 0 nesnesi yazılmış")
else:
    print("0 nesnesinin bool değeri", bool(0), "dur")
```

