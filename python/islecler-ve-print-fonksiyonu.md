# İşleçler Ve Print Fonksiyonu

### Neler Öğreneceğiz?

* İşleçler \( \*, /, -, +, %\)
* print Fonksiyonu \(Ekrana yazı yazmamızı sağlayan fonksiyon\)

### İşleçler

#### Matematiksel İşleçler

Matematiksel işleçler python'da matematiksel işlemleri yapmamızı sağlar, bir kaç tane örnek yaparak bu konuyu daha iyi anlayalım.

|  |  |
| :--- | :--- |
| + | Toplama |
| - | Çıkarma |
| \* | Çarpma |
| / | Bölme |
| \*\* | Kuvvet |
| % | Moduler bölme |
| // | Taban bölme |

```python
>>> 4 + 5 # toplama
9
>>> 4 - 5 # çıkarma
-1
>>> 4 * 5 # çarpma
20
>>> "Hakan "+"çelik" # iki string'i toplayabiliriz
'Hakan çelik'
>>> "-"*5 # string veriyi çarpabiliriz
----- # 5 tane tre olacaktır
>>> 4 / 5 #bölme
0.8
>>> 4 ** 5 # kuvvet
1024
>>> 4 % 5 #mod 4'ün 5 bölümünden kalanı verir
4
>>> 4 // 5 #taban bölme, 4'ün 5 bölümünden bölüm kısmını verir
0
```

#### Karşılaştırma işleçleri

Karşılaştırma işleçleri işlenenler arasında bir karşılaştırma işlemi yapmamızı sağlar, 3 büyüktür 2, 3 eşittir 3 gibi.

|  |  |
| :--- | :--- |
| == | Eşittir |
| != | Eşit Değildir |
| &gt; | Büyüktür |
| &lt; | Küçüktür |
| &gt;= | Büyük Eşittir |
| &lt;= | Küçük Eşittir |

Aşağıda ufak bir sayı tahmin script'i bulunmakta inceleyerek anlayabilirsiniz.

```python
num = 99 # bir sayı atadım
get_num = input("Bir sayı giriniz >> ") # kullanıcıdan bir sayı aldım
if get_num > num: # kullanıcının sayısı benim sayımdan büyük ise
    print("Daha küçük") # daha küçük diye ekrana yazdım
elif get_num < num: # kullanıcının sayısı daha küçük ise
    print("Daha büyük") # dha büyük diye ekrana yazdırdım
else: # hiç şart sağlamadı yani eşit ise
    print("Doğru bildin") # doğru bildin yazdırdım
```

#### Bool İşleçleri

Bilgisayarda 0 ve 1 den oluştuğunu hepimiz biliyoruz ikili sistem kullanılmata açık, kapalı, var yok, doğru yanlış gibi anlamlara gelebilir, bilgisayar bilimi bu iki adet iki değer üzerine kuruludur bu bool değerleri **True** ve **False** dır.

örnek olarak

```python
>>> 1 == 1 # atama değil matematik deki eşittir işareti anlamına gelen karşılaştırma işaretidir.
True
>>> 1 == 2 # bir ikiye eşit değildir
False
```

Bilgisayarlar biliminin 0 ve 1'in üzerine kurulduğunu söyledik ve bunlar True ve False'dır dedik burdan yola çıkarsak bilgisayarda her şeyin bir bool değerinin olduğu sonucu çıkar.

Bilgisayarda 0 ve boş karakter hariç her şeyin değeri True'dur, bunu **bool\(\)** adlı bir fonksiyon ile gösterelim.

```python
>>> bool(0)
False
>>> bool(-1)
True
>>> bool("")
False
>>> bool("selam")
True
>>> bool(1)
True
>>> bool("0") # bu karakterdir string olan 0 dır o yüzden True değerini döndürür
True
>>> 3 < 4
True
>>> "hakan" == "hakan"
True
>>> 1 == 1 and 1 > 0
True
```

|  |  |
| :--- | :--- |
| and | ve |
| not | değil, hayır, yok gibi anlamlar |
| or | veya |

```python
test_val = "01234"
if test_val == "01234" or test_val == "0":
    print("Doğru")
```

#### Değer Atama İşleçleri

Şimdiye kadar sadece bir tane atama işareti kullanıyorduk o işaret'te **=** buydu, bir veriyi değişkene atamamızı sağlayan atama işareti, aşağıda bütün atama işaretlerinin tablosu bulunmakta, inceledikten sonra bir kaç örnek yapalım.

|  |  |
| :--- | :--- |
| = | Atama işareti |
| += | Kendisi ile Arttırıp Atama İşareti |
| -= | Kendisi ile Azaltıp Atama İşareti |
| /= | Kendisi ile Bölüp Atama İşareti |
| \*= | Kendisi ile Çarpıp Atama İşareti |
| %= | Kendisi ile Modüler Bölme İşareti |
| \*\*= | Kendisi ile Kuvvet Alma İşareti |
| //= | Kendisi ile Taban Bölme İşareti |

```python
>>> a = 5
>>> a += 1 # bunun anlamı a = a + 1
6
>>> a -= 1 # anlamı a = a - 1 a'nın yeni değeri bir üst satırda 6 olduğu için burda tekrar 5 olacaktır.
5
>>> a /= 2 # a = a/2
2.5
```

#### Aitlik İşleçleri

Bu işlecin amacı bir verinin başka bir verinin içinde bulunup bulunmadığını sorgulamamızı sağlamaktır.

|  |  |
| :--- | :--- |
| in | Aitlik İşleci |
| not in | Ait olmama işleci |

```python
>>> "1234" in "01234" # sol'daki ilk veri sağdaki verinin içinde bulunduğu için True değerini döndürmüştür, 1234 01234 içerisinde var mı?
True # evet var
>>> "1234" not in "0" # 1234 verisi 0 verisinin içinde yok mu ?
True # evet yok
```

#### Kimlik İşleçleri

Python’da her nesnenin bir kimlik numarası \(identity\) vardır. Bu kimlik numarası esasında o nesnenin bellekteki adresini gösterir. Nesnelerin id bilgisini gömülü olarak gelen **id\(\)** fonksiyonunu kullanarak bulabiliyoruz.

|  |  |
| :--- | :--- |
| id\(\) | İd Numarasını Veren Fonksiyon |
| is | Kimlik işleci |

```python
>>> a = 2.5
>>> id(a) # bellekte ki konumu
1510664639136
>>> id("merhaba dünya")
1510666808640
```

Gördüğünüz gibi her verinin bir id numarası konum bilgisi vardır, bir diğer kimlik işleci olan **is**'e bakalım birde.

```python
>>> a = 1
>>> a is 1
True
>>> a = 1000
>>> a is 1000 # neden False çıktı
False
```

Bunun sebebi **-5 ile 257** arasındaki olmayan sayılar için python her defasında tekrardan bir bellekleme çalışması yapıyor olmasıdır, yani şöyle anlatayım.

```python
>>> a = 1000 # versi 1000 olan yeni bir alan ( adres ) açtı
>>> a is 1000 # burda tekrardan açtığı için aynı veriye iki farklı adres oldu ve bu yüzden
False # false çıktısını aldık
```

## Print Fonksiyonu

print fonksiyonu'nun amacı ekrana yazı yazdırmaktır, fonksiyonlara kısa giriş dersini hatırlarsanız fonksiyonlar yapacağı göreve göre parametre alır veya almaz tıpkı matematik'te olduğu gibi, print fonksiyonu'da veri olarak sınırsız parametre alabilen aynı zamanda kendine özgü parametreleri bulunan bir fonksiyondur siz ona parametre olarak ne verirseniz print fonksiyonu sırası ile ekrana basacaktır.

> Sınırsız parametreli fonksiyonların nasıl yapılacağını ilerleyen derslerde yine gireceğim

```python
>>> text = "python programlama dilinin ismi yılan'dan gelmez"
>>> print(text)
python programlama dilinin ismi yılan'dan gelmez
>>> text2 = """python "açık kaynak kodlu" bir dildir"""
>>> print(text2)
python "açık kaynak kodlu" bir dildir
>>> print(1, 2, 3, 4, 5, 6, 7) # 7 parametre kullandım
1 2 3 4 5 6 7
```

### Print Fonksiyonunda Bulunan Diğer Parametreler

#### Sep

Sep parametresinin amacı print fonksiyonuna yazdığımız her bir veri değerinin sonuna eklemeler yapar, siz sep="0" yazarsanız python print içine paramtre olarak yazdığınız her bir verinin sonuna 0 yazacaktır örnek olarak.

**print\("veri", sep="str\_değer"\)** sep parametresi ya **None** yada string bir değer alır.

```python
>>> print(1, 2, 3, 4, 5, 6, 7, sep=" - ")
1 - 2 - 3 - 4 - 5 - 6 - 7 # gördüğünüz gibi hepsinin sonuna - işareti eklendi
```

#### End

End parametresinin görevi print fonksiyonuna verilen verinin sonuna eklenecek olan nesneyi yazmaktır.

**end** parametresi yine **None** veya str bir değer alır.

print fonksiyonunda default \(varsayılan olarak\) **print\(end="\n"\)** kaçış işareti vardır.

```python
>>> print("Buraya ne yazacağımı bulamadım", end="\n") # \n satır başı kaçış işareti
Buraya ne yazacağımı bulamadım
>>> print("Buraya ne yazacağımı bulamadım", end=" - ")
Buraya ne yazacağımı bulamadım - >>> print("Buraya ne yazacağımı bulamadım", end=" - \n")
Buraya ne yazacağımı bulamadım -
```

#### Print İle Ekrane Değil Dosyaya Yazdıralım

Python dosya işlemlerini ileride göreceğiz ama ufakta olsa burada değinmek iyi olacaktır, print fonksiyonu normalde ekrana çıktı verirken bunu değiştirip dosyaya yazmasını sağlayabiliyoruz.

**file parametresi**

verinin hangi dosyay yazılacağını söyler

```python
>>> dosya = open("test.txt", "w") # w = yazma modunda dosyamızı açtık
>>> print("ilk defa dosyaya veri yazıyorum", file = dosya) # yazdırdık
>>> dosya.close() # kapattık
```

#### flush

flush parametresi veriyi bekletmeden dosyaya yazmamızı sağlar

```python
>>> dosya = open("test.txt", "w") # w = yazma modunda dosyamızı açtık
>>> print("ikinci defa dosyaya veri yazıyorum", file = dosya) # dosyayı açıp baktığınızda boş olarak görürsünüz yazma işlemi "dosya.close()" bunu hyaptığınızda dosya kapanmadan önce yapılır fakat siz hemen yapılsın istiyorsanız
>>> print("ikinci defa dosyaya veri yazıyorum", file = dosya, flush=True) # bu şekilde yazmalısınız
>>> dosya.close()
```

