---
description: Method Operasyonları = Method Wrapper
---

# String Nesnesinin Methodları ve Method Operasyonları

## Str Nesnesinin Methodları Ve Method Operasyonları \( Method, Method-Wrapper \)

#### Giriş

Yukarıdaki resimde **str** tipinin aslında bir python nesnesi ve altında bir çok method \( nesneye ait fonksiyon\) ve method-wrapper olduğunu görebiliyoruz, sizlere bu yazımda anlatmak istediklerim resimde gördüğünüz herşeydir.

Bundan önceki yazılarımda python'a ve fonksiyonlara giriş yapmış, bir kaç fonksiyon kullanımını öğrenmiş, tipler konusuna değinmiş ve koşul durularını incelemiştik şimdi ise çok daha büyük ve güzel bir konuyu ele alacağız, eski içeriklerde python'da bulunan her şeyin bir nesne olduğunu ve str tipini öğrenmiştik şimdi gelin hep birlikte biraz derinlere dalalım.

#### Method Nedir?

Methodlar bir sınıf \( nesne, object \) altında bulunan fonksiyonlardır.

#### Method-wrapper Nedir

Kendileri yine bir method olup built-in \( yerleşik işlev \) objeleri için c katinda tanımlanmış edilmis ve belli operasyonların daha hızlı olmasını sağlayan methodlardır.

> Python c dili ile yazıldığından

Genellikle farkına varmadan kullanırız bu methodları örnek vermek gerekirse.

```python
>>> "string" <= "string"
>>> "1" == "1"
```

Bu gibi işlemleri yapmamızı sağlarlar.

## Method-Wrappers

### `__ne__` Eşit Değildir Operasyon Methodu \( Not Equal to Operation Method\)

python konsolunu açın ve şunlardan birini yazın.

* `"".__ne__`
* `str('').__ne__`
* `"test".__ne__`

`<method-wrapper '__ne__' of str object at 0x0000024D27BB7C70>` buna benzer bir çıktı göreceksiniz, burada **str** nesnesine ait olan `__ne__` nin bir **method-wrapper** olduğunu görüyoruz.

> Not: Daha önce açıklamadım galiba python'da nokta \(.\) işareti bir nesnenin methodlarını dolaşmamızı sağlar, örneğin hesap adında bir nesnem olsun ve isim adında bir methodum olsun hesap.isim yazdığımda çıktı olarak 'hakan' gibi bir şey verecektir, bu tam açıklayıcı değil ama şimdilik bu şekilde bilin.

peki bu method-wrapper'i nasıl kullanacağız ne işe yarar?

#### `__ne__` Method-Wrapper ne İşe Yarar, Nasıl Kullanılır?

Onuda konsoldan bulalım, şöyle yazın, bu wrapper'in amacına bakıyorum.

* `''.__ne__.__doc__` çıktım **'Return self!=value.'** bu wrapper'in amacı nesne olan kendisi ile, parametre olarak verilen nesne değeri eşit değil ise **True** çıktısını veriyormuş.

Örnek yapalım.

```python
>>> "".__ne__("") # Str nesnem ile verilen değer aynı bu yüzden False çıktısı vermesi gerek
>>> False
>>> "1".__ne__("") # Str nesnem ile değer 1 verilen ise boş karakter aynı değil True çıktısı verir
>>> True
```

Bu işlem başka nasıl yapılıyor ? işte aşağıdaki gibi.

```python
In [1]: "" != ""
Out[1]: False

In [2]: "1" != ""
Out[2]: True
```

Gördüğünüz gibi bu öğrenme yolunu takip ederek başka ek bir kaynağa gerek duymadan diğer bütün method ve fonksiyonları inceleyeceğiz.

### `__mul__` Çarpma Operasyon Methodu \(Multiplication Operation Method\)

Yine konsolu açıp şöyle yazıp inceliyoruz `str(1).__mull__.__doc__` çıktımız `Return self*value.`, çıtkımızdan da anlaşılacağı üzere **str** nesnemizin değerini girilen değer ile çarpıyormuş deneyelim bakalım.

```python
In [12]: str(1).__mul__(3)
Out[12]: '111'
In [13]: str("-").__mul__(13)
Out[13]: '-------------'
```

Peki bu işlemi başka nasıl yapıyoruz ? çok kolay

```python
In [15]: "-" * 13
Out[15]: '-------------'
```

Python bu işlemi yukarıdaki gördüğünüz wrapper'i kullanarak yapıyor, yani isterseniz  **'-' \* 30** işleminin sonucunu değiştirebilirsiniz.

Python'da nesnelere az çok giriş yaptık fakat bir nesne nasıl yazılıri sınıf nedir konularına değinmedik ilerde bunlara değineceğim ama ondan önce sizlere yukarıdaki "-" \* 30 işleminin sonucunu nasıl değiştirebildiğini kodlarda göstermek ve az da olsa sınıf'lara \( nesne kodlamasına veya object oriented programming - diğer adıyla nesne tabanlı programlamaya \) girmek istiyorum.

```python
class TStr(str): # TStr isimli bir nesne, object oluşturdum, ve str nesnemi miras aldım
        # bu şu demek TStr isimli nesne içinde str nesnemin özelliklerine erişip kullanabilirim

 def __mul__(self, times): # nesne içine __mul__ adında bir fonksiyon tanımladım
                # bu fonksiyon TStr isimli nesnemin bir methodudur.
 return times # nesnem ile girilen değeri çarpmak yerine kişinin çarpmak istediği
                # sayısı döndürdüm.

test_str = TStr("bu bir test sınıfıdır") # yeni sınıfımı kullanarak bir str değeri oluşturdum ve test_str isimli değişkene attım

print(test_str * 3) #ve str nesnemi 3 kere çarpıyorum yani , değeri 3 defa yan yana toplaması lazım, ama ben __mul__ wrapperimi değiştirdim bu yüzden öyle olmayacak çıktı olarak 3 vermesi gerek
```

Çıktım; `3`

gördüğünüz gibi istediğiniz şekilde değiştirebilirsiniz.

### `__lt__` Küçüktür Operasyon Methodu \(Less than Operation Method\)

Sıra `__lt__` Method-Wrapper'ine geldi bakalım bu neler yapabiliyormuş ?

```python
In [1]: "".__lt__.__doc__
Out[2]: 'Return self<value.'
```

Çıkan sonuca bakacak olursak eğer varsayılan `__lt__` method'u bizlere bunun \(`self<value`\) **bool** değerini veriyor.

yani biz konsolda veya programımızda elimizde bulunan **string** veri türümüzdeki verimiz ile şöyle bir işlem yaparsak `"123"<"234"` ne sonuç verir, bu işlemin bool değeri nedir ? `True`'dur işte `__lt__` methodu varsayılan olarak bunu sağlar, istersek bu işlemi değiştirebilirsiniz.

```python
In [1]: "".__lt__("123")
Out[2]: True
# buların ikisi aynı
In [1]: "" < "123"
Out[2]: True

In [3]: "123".__lt__("123")
Out[4]: False
In [1]: "" < "123"
Out[2]: True

In [5]: "12".__lt__("123")
Out[6]: True
In [1]: "" < "123"
Out[2]: True
```

#### `__lt__` Methodumuzun İşlemini Değiştirelim

Şimdi kendi nesnemi yazacam ve bu nesnem **str** nesnesini miras alacak bu sayede str nesnesinin özelliklerine erişebileceğim hatta istersem değiştirebileceğim bile.

```python
class MyStrClass(str): # MyStrClass isimli nesnemi yarattım ve str nesnemi miras aldım.

    def __lt__(self, text): # __lt__ methodunu değiştirmek için onu kendi nesnemde tekrar tanımladım ve text isimli 1 parametre verdim
        # bu sayede "" < "" işlemi yapıldığında str nesnesinin değil benim nesnemin __lt__ isimli methodu çalışacak
        return text # bu bölüm ise parametre olarak verilen veriyi tekrar döndürüyor.
        # yani "test"<"123" yapılırsa False yerine 123 çıktısı verecek
```

test edelim kendi **str** nesnemizi.

```python
>>> my_str = MyStrClass("bu benim str nesnem")
>>> print(my_str < "test string")
>>> 'test string' # çıktı olarak aynısını aldım gördüğünüz gibi işlemi değiştirdik.
```

### `__len__`  Uzunluk Bulma Operasyonu \(Length Finding Operation\)

`__len__` wrapper'inin ne yaptığına bakalım.

```python
>>> "".__len__.__doc__
'Return len(self).'
```

Çıktıdan anladığımıza göre verilen nesneyi parametre alarak len fonksiyonunu döndürüyor.

> len fonksiyonu verilen str veya list veri tipinin eleman sayısını döndürür

Yani `__len__` wrapper'i **len\(\)** fonksiyonu ile aynı işi yapıyormuş.

```python
>>> "33".__len__()
>>> 2
>>> [1, 2, 3].__len__()
3
```

Yukarıda 2 tane örnek verdim daha iyi anlaşılması açısından.

### `__le__`  Küçük Eşittir Operasyonu \(less Equals Operation\)

#### Görevi

```python
>>> "".__le__.__doc__
'Return self<=value.'
```

görevi `"hakan"<="celik".` bu işlem ile aynıdır, bu demek oluyor ki `__le__` wrapperini değiştirerek python'da bulunan `<=` işleminin sonucunu değiştirebiliriz, ve sonuç bir **bool** dur yani **True** veya **False**'dır.

#### Örnek

```python
>>>  "test a".__le__("test a")
>>> True

>>> "test a e".__le__("test a")
>>> False
```

### `__eq__` Eşitlik Operasyonu \( Equality operation \)

String'imiz ile parametre olarak verilen veya `==` soldan sağa şeklinde ile kontrol edilerek çalışan bir operasyondur methodudur.

```python
>>> "hakan".__eq__("hakan")
True
>>> "hakan celik".__eq__("hakan")
False
>>> "hakan" == "hakan"
True
```

### `__ge__` Büyük Eşittir Operasyonu \(Greater Equal Operation\)

`"hakan">="celik".` işleminin gerçekleşmesini sağlar, veya `"hakan".__ge__("celik")` şeklinde yazabiliriz.

### `__gt__` Büyüktür Operasyonu \(Greater Operation\)

`"hakan">="celik".` işleminin gerçekleşmesini sağlar, veya `"hakan".__gt__("celik")` şeklinde yazabiliriz.

### `__iter__` İteratör Operasyonu

String'i iteratör haline getirir.

```python
>>> for i in "test".__iter__():
>>>     print(i)
```

```python
>>> for i in "test":
>>>     print(i)
```

Bu iki örnek aynı işlemi yapar biz `__iter__` methodunu fark etmeden kullanırız.

### `__init_subclass__` Methodu

Bu method str nesnesi miras alındığında çalışır.

### `__init__` Methodu

Bu method ise nesneler çağrıldığında çalışan ilk method'dur

## Methods

### Swapcase Methodu

Kısaca söylemek gerekirse `swapcase()` fonksiyonu string'de bulunan büyük karekterleri küçük, küçük karakteri ise büyük yapar.

> Convert uppercase characters to lowercase and lowercase characters to uppercase.

#### Kullanışı;

```python
>>> "AbCd ".swapcase()
>>> "aBcD "
```

### Partition Methodu

Bu method verilen parametre'yi kullanarak dizeyi 3 parçaya ayırır eğer verilen parametre dizede yok ise yine 3 parçaya böler ama 2 tane'si boş dize olarak belirlenir ve bir tuble olarak döner.

> Partition the string into three parts using the given separator. This will search for the separator in the string. If the separator is found, returns a 3-tuple containing the part before the separator, the separator itself, and the part after it. If the separator is not found, returns a 3-tuple containing the original string and two empty strings.

#### Örnek;

```python
>>> "1231 1".partition("2")
>>> ('1', '2', '31 1')
>>> "a".partition("a")
>>> ('', 'a', '')
>>> "aa".partition("a")
>>> ('', 'a', 'a')
>>> "aaa".partition("a")
>>> ('', 'a', 'aa')
>>> "aaab".partition("a")
>>> ('', 'a', 'aab')
>>> "abaab".partition("a")
>>> ('', 'a', 'baab')
```

#### Partition Methodunu Değiştirelim

Yine yukarıda diğer konularda yaptığımız gibi bir değişim yolu ile yapacağız, sadece yapılabildiği için yazıyorum sizlere belki farklı bir bakış açısı belki başka bir şey kazandırır diye.

```python
class str(str): # str nesnemi miras aldım ve str adında yeni bir nesne oluşturdum

    def partition(self, p): # varsayılan str nesnemin partition methodun aldım
        return "lalal" # ve lalal diye bir string döndürdüm

print(str("sd").partition("a"))
```

Çıktımız ne olur sizce ? tabiki `lalal` olur. Gönül isterki python'da bulunan str nesnesini varsayılan olarak değiştirebilelim belkide bu mümkündür ama bilmiyorum.

**Not**

Vermek istediğim mesajları verdiğim için bu kısımları daha hızlı anlatıp geçmeyi planlıyorum hem tekrarar düşmemek hemde sizleri sıkmamak için.

### Maketrans Methodu

Sadece 1 tane parametre alabilir ve türü **dict** olmalıdır, bu method `translate` methodu ile birlikte istenilen karakterleri değiştirmek için kullanılıyor.

```python
>>> str().maketrans(dict(a=1))
{97: 1}
```

Yukarıdaki örnek bizlere bir **dict** döndürdüğünü görüyoruz a değerinin acsii karşılığı key olarak verilmiş value olarak ise a değişkenine atadığımız değeri döndürüyor.

### Translate Methodu

**Translate** methodu translation çeviri tablosunu kullanarak verilen **string**'in her bir karakterini değiştirir. Çeviri tablosu **dict** türünden bir veri olmalıdır zaten bu kısmı bir üst kısımda anlattığım method yardımı ile oluşturabiliyoruz bizim teker teker girmemize gerek kalmıyor.

```python
>>> "b".translate(str().maketrans(dict(b="r")))
'r'
`
```

Burda `dict(b="r")` bu kısım sayesinde b karakteni r yapabiliyoruz

```python
>>> "b".translate("".maketrans(dict(c="r")))
'b'
`
```

Bu kısımda c karakteri olmadığı için replace işlemi yapamıyoruz

```python
>>> "bcca".translate(str().maketrans(dict(c="r")))
'brra'
`
```

Burda c olan her bir karakter r oluyor

### Ljust Methodu

Tek parametreli bir method olup `integer` türünden bir değier alır ve aldığı değer kadar soldan boşluk ekler.

```python
>>> "Hakan".ljust(11)
"Hakan           "
```

### Join Methodu

Join methodu gerçekten sık kullanılan ve kullanışlı bir method'dur, tek parametre alır `list` veya tuble türünde olmalıdır. Parametre olarak aldığı her bir liste elemanının bulunduğu `string`'e ekler.

Liste elemanları `string` olmalıdır.

```python
>>> str().join(["-","ş", "2", " ", "/"])
'-ş2 /'
```

```python
>>> "/".join(["path", "to"])
'path/to'
```

### Istitle Methodu

Bu method string nesnesinin Başlık \( Title \) formatında yazılıp yazılmadığını kontrol eder eğer doğru ise `True` sonucunu döndürür, başlık formatından kastımız ise bildiğimiz yazım kurallarını kapsar örnek olarak.

* Bu Bir Başlıktır
* Başlık

Baş harfleri büyük,

```python
>>> "Bu Bir Başlıktır".istitle()
True
>>> "Bu Bir başlıktır".istitle()
False
```

### Isspace Methodu

Eğer string'imiz sadece whitespace yani boşluk karakterleri ise `True` döndürür aksi halde `False` döndürür.

```python
>>> str().isspace()
False
>>> str("  ").isspace()
True
>>> str("  t").isspace()
False
```

### Islower Methodu

Eğer string'imiz sadece küçük karakterlerden oluşuyor ise `True` döndürür aksi halde `False` döndürür.

```python
>>> "Ab".islower()
False
>>> "ab".islower()
True
```

### Isdecimal Methodu

Eğer string'imiz sadece sayıya dönüşebilen karakterlerden oluşuyorsa `True` döndürür aksi halde `False` döndürür.

```python
>>> "1".isdecimal()
True
>>> "a 1".isdecimal()
False
>>> "1 2".isdecimal() # boşluk var
False
>>> "1234".isdecimal()
True
```

### Isascii Methodu

Eğer string'imiz sadece ascii karakterlerden oluşuyorsa `True` döndürür aksi halde `False` döndürür.

```python
>>> "asd".isascii()
True
>>> "asdı".isascii() # ı harfi ascii değildir
False
```

### Isalpha Methodu

Eğer string'imiz sadece karakterlerden oluşuyorsa `True` döndürür aksi halde `False` döndürür.

```python
>>> "123 a".isalpha()
False
>>> "123".isalpha()
False
>>> "asd".isalpha()
True
```

### Isalnum Methodu

Eğer string'imiz sadece karakterlerden veya sayılardan oluşuyorsa `True` döndürür aksi halde `False` döndürür.

```python
>>> "test a".isalnum() # boşluk var o yüzden False
False
>>> "12".isalnum()
False
>>> "12s".isalnum()
True
```

### Index Methodu

Parametre olarak verilen str türündeki verimizi string'imizde eşleştiği ilk konumu verir.

```python
# test a
# 012345 indexler
>>> "test a".index("a")
5
>>> "test ava".index("a") # yine ilk konumu verecek
5
```

### Expandtabs Methodu

String'imizde tab kaçış işareti bulduğunda onu boşluklar yardımı ile genişletir, tek parametre alır ve bu varsayılan olarak 8 dir.

> Tab kaçıi işarati `\t` dir.

```python
>>> "test \t".expandtabs()
'test    ' # 8 boşluk vardır
>>> "test \t\t".expandtabs() # iki tab kaçış işareti olduğu için
'test         ' # 16 boşluk var
>>> "test\t\t".expandtabs(0) # parametreye 0 yazdığım için 8 yerine 0 boşluk koyacak
'test' # hiç boşluk yok
```

### Count Methodu

Tek parametre alır ve aldığı str türündeki parametrenin verilen string'imizde kaç defa geçtiğini döndürür.

```python
>>> "I love you 3000".count("0")
3
>>> "I am iron man".count("a")
2
```

### Center Methodu

String'imizin parametre olarak girilen sayı uzunluğunda olmasını sağlar ve string'i ortalar, eğer parametre'ye yazılan sayı string'in uzunluğundan az ise değişmez.

```python
>>> "I do not feel good".center(3)
'I do not feel good'
>>> "I do not feel good".center(30)
'      I do not feel good      '
```

