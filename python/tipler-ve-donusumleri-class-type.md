![python](https://www.coogger.com/media/images/python.jpg?style=center)

#### Hatırlatma
Öncelikle python'da hangi veri tipleri vardı onları hatırlayalım, aşağıda python'da var olan veri tiplerinin listesi ve örnekler yazılmıştır bu konunun daha iyi anlaşılması için lütfen dikkatli inceleyiniz.

> Not: Python ile alakalı terimlerin türkçesini yazmayacağım, ingilizcesini öğrenmek daha yararlı olduğunu düşünüyorum.

- Numbers
	- **int()**
		- `variable = 1`
	- **float()**
		- `variable = 0.1`
		- `variable = 0.00012`
- String
	- **str()**
		- `variable = "string"`
		- `variable = 'string'`
		- `variable = """long string"""`
		- `variable = '''long string'''`
- List
	- **list()**
		- `variable = [1, 2, 3, 4]`
		- `variable = ["1", "2", "3", "4"]`
		- `variable = ['1', '2', '3', '4']`
		- `variable = [1.1, 2.2, 3.3, 4.4]`
		- `variable = [{1: 2}, {2: 3}, {3: 4}]`
		- `variable = [{"1": 2}, {"2": 3}, {3: "4"}]`
- Tuple
	- `variable = 1, 2, 3, 4`
	- `variable = (1, 2, 3, 4)`
	- `variable = "1", "2", "3", "4"`
	- `variable = [1], [2, 2], [3], {4}`
	- `variable = 1, 2, 3, 4`
	- `variable = "a", 2, "3", 4`
- Dictionary
	- **dict()**
		- `variable = {1: 2, "a": "b", "c": 2}`
		- `variable = dict(a=1, b=2, c=3)`
		- `variable = {1: [3, 4], "a": "b", "c": 2}`

---------------

## Python'da Tip Dönüşümleri
Yukarıda güzel bir hatırlatma sağladığımıza göre asıl konuya geçebiliriz, aslında bu işlemler gerçekten çok kolay size kısaca şöyle anlatayım.

Elinizde bir değişken ve değişkene atadığınız bir veri var bu verinin tipini biliyorsunuz veya **type()** metodu kullanarak onun tipini buluyorsunuz daha sonra dönültürmek istediğiniz veri tipin method'unu ( fonksiyonunu ) kullanarak dönüştürmek istediğiniz veri tipine dönüştürmüş oluyorsunuz.

Bu içerikte [input-fonksiyonu-ozellikleri-ve-detayl-inceleme](https://www.coogger.com/@hakancelik96/input-fonksiyonu-ozellikleri-ve-detayl-inceleme/) input fonksiyonunu incelemiş ve input ile aldığımız ( kullanıcı tarafından ) her verinin bir karakter dizisi olduğunu yani tipinin **string** olduğunu söylemiştik.

İşte sorun burada başlıyor, ben kullanıcıdan bir sayı girilmesini istesem o da bunun için **2049** girse bu bana yani değişkenime sayı olarak gitmeyecek bir string olarak gidecektir, ve benim bunu denetlemem ve tip dönüşümü uygulamam gerekiyor.

```python
string_data = input("Please enter a any number what you want ? >> ")
# yukarıda string_data adında bir değişken tanımladım '=' atama işaretini kullanarak input fonksiyonundan gelecek olan veriye atadım, kullanıcının bir şeyler yazmasını bekliyorum.
print(type(string_data))
# veri türünü ekrana bastık
print(string_data/1)
# burada gelen veriyi '1' e bölüyorum eğer gelen veri sayı değil ise hata verecektir.
```
Aldığımız hata **TypeError** hatası olacaktır, yani tip hatası yaptık, string ile int bir veriyi bölmeye çalıştık.

```
<class 'str'>
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: unsupported operand type(s) for /: 'str' and 'int'
```

Bizim burada gelen veriyi **int** veya **float** tipine dönüştürmemiz gerekiyor, bir kez daha yapalım.

```python
string_data = input("Please enter a any number what you want ? >> ")
# gelen veriyi 'int' tipine dönüştürmek istiyorum o halde int() fonksiyonunu kullanmalıyım,
# int(string_data) bu şekilde yazarsam string olan verim int'a dönüşecektir.
string_data = int(string_data)/1
print(type(string_data))
# tekrar veri türünü ekrana bastık
print(string_data)
```
Sonuç;
```
<class 'int'>
2049
```
Herhangi bir hata almadık, konu anlaşıldı ise diğerlerine de bakalım.

### int()
> int() argument must be a string, a bytes-like object or a number

**int()** fonksiyonu parametre olarak verilen nesneyi yapabiliyor ise **int** veri tipine çevirir.

Parametre olarak string veya number ( sayı ) değeri alır.

```python
>>> int("10")
10
>>> int(0.21)
0
```

> Not: `int("10.1")` bu gibi string formatinda bulunan float veri tipi int çevrilemez, önce float veri tipine çevirmek gerek.

### float()
> float() argument must be a string or a number

**float()** fonksiyonu parametre olarak verilen nesneyi yapabiliyor ise **float** veri tipine çevirir.

Parametre olarak string veya number ( sayı ) değeri alır.

```python
>>> float("10")
10.0
>>> float("10.1")
10.1
>>> float("0.21")
0.21
>>> float(0.21)
0.21
```

### str()
**str()** fonksiyonu parametre olarak verilen her nesneyi **string** veri tipine çevirir.

```python
>>> str(10)
'10'
>>> str("10")
'10'
>>> str(10.1)
'10.1'
>>> str(False)
'False'
>>> str(int)
"<class 'int'>"
>>> str({1: 2})
'{1: 2}'
>>> str([1, 2])
'[1, 2]'
```

### complex()
> first argument must be a string or a number

İki parametre alır sadece bir parametre yazılacak ise string tipinde sayı int veya float olabilir , iki parametre birden yazılacaksa ilk parametre string olamaz , ikinci parametre ise kompleks sayımızın i'li kısmıdır.

**complex()** fonksiyonu parametre olarak verilen string veya sayıları **complex** veri tipine çevirir.

```python
>>> complex(10)
(10+0j)
>>> complex("10")
(10+0j)
>>> complex(10.1)
(10.1+0j)
>>> complex(1, 2)
(1+2j)
>>> complex(3.4, 4)
(3.4+4j)
>>> complex(0.2)
(0.2+0j)
```

### dict()
Girilen parametre isimlerini ve değerlerini kullanarak **dict** veri tipi oluşturur.

```python
>>> dict(a=1)
{'a': 1}
>>> dict(name="hakan", no=0.538)
{'name': 'hakan', 'no': 0.538}
```

### list()
**Tuble** veya **string** veri tipini **list** tipine dönüştürür, bir parametre alır.

```python
>>> list("test")
['t', 'e', 's', 't']
>>> list((1, 2))
[1, 2]
```
