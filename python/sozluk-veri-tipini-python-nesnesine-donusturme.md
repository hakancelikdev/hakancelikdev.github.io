<img gnrl="center br-4" src="https://www.coogger.com/media/images/python.jpg">
<center><sub>[Kaynak](http://alikara.com)</sub></center>


### Neler öğreneceğiz ?
- python sınıf yapısı ( class )
- isinstance
```
>>> type(isinstance)
<class 'builtin_function_or_method'>
```
- setattr
```
>>> type(setattr)
<class 'builtin_function_or_method'>
```
- items
Bildiğiniz gibi items dict veri türündeki değişkenlerin öğelerini almak için kullanırız örneğin.
```python
for key,value in {1:2,3:4}.items():
	print(key,value)
```

### Gereksinimler
- sadece python3
> python 2 ise günceli takip etmek için python3 kullanmaya başlayın



### Isinstance nedir ?
isinstance,tıpkı type methodu gibi nesnelerin türünü bulmamızı ve bu bilgiyi kullanmamızı sağlar,

örneğin;

```python
num = 0
if type(num) == int: # num değişkenin veri türü eğer integer ise
	pass
```

Aynı şeyi **isinstance** ile şu şekilde yapabiliyoruz.

```python
numn = 0
if isinstance(num,int):
	pass

# veya

numn = 0
if isinstance(num,(int,str)):
	pass
```
Şeklinde yapabiliyoruz, bu kısım anlaşılmıştır umarım.

### Setattr nedir ?

**setattr** bir nesneye yeni bir değişken atamamızı sağlar, kullanımı şu şekilde dir. `setattr(object, name, value)`
>bunları bildiğimize göre asıl konumuza gelebiliriz.


## Sözlük veri tipini ( Dict ) python nesnesine dönüştürme
Bizlerin yapmak istediği şey şu elimizde şuan benzer bir dict olsun

`d = {"a":"b","c":"d"}`
Biz python ile bu sözlük veri türünü şu şekilde kullanamayız,

```python
>>> d = {"a":"b","c":"d"}
>>> d.a
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
AttributeError: 'dict' object has no attribute 'a'
```

**AttributeError: 'dict' object has no attribute 'a'** bizlere bu şekilde bir hata verecektir, o zaman yapmamız gereken şey ***attribute*** etmek.

Kodlarımızın tamamı.
```python
class DictToObject():
    def __init__(self, d):
        for key, value in d.items():
            if isinstance(value, (list, tuple)):
               setattr(self, key, [DictToObject(x) if isinstance(x, dict) else x for x in value])
            else:
               setattr(self, key, DictToObject(value) if isinstance(value, dict) else value)
```
Şimdi burada bir for döngüsü var sebebi şu, eğer **DictToObject** sınıfımıza vereceğimiz sözlük şu şekilde ise
`d = {'a': 1, 'b': {'c': 2}, 'd': ["hi", {'foo': "bar"}]}` for döngüsü ile iç içe bulunan dict leri de sınıfımıza attribute edebilmektir bu kısımlarıda tam olarak **5. ve 7.** satırlarda yapılıyor, yorum satırlarını kullanarak kodları baştan sona anlatayım.

--------

```python
class DictToObject(): # sınıfımızın ismi DictToObject
    def __init__(self, d): # d adı ile bir parametre belirliyoruz.
        for key, value in d.items(): # yukarıda itemi anlattığım kısım burada
            if isinstance(value, (list, tuple)): # isinstance ile gelen value list veya tuble ise,
				# yani [] veya () şeklinde birden fazla değer var ise
               setattr(self, key, [DictToObject(x) if isinstance(x, dict) else x for x in value])
			   # setattr kullanarak ilk parametresine yani nesne yazmamız gereken yere self yazıyoruz bu bulunduğumuz sınıfa ekleme yapmasını sağlayacaktır. ikinci parametre dict'den gelen key bilgisi ve value kısmı ise üçüncü parameter fakat buradaki olay şu gelen value list veya tuble olduğu için for içine alıyoruz **for x in value** ve demişki **if isinstance(x, dict) ** eğer for ile gelen veri dict ise tekrardan **DictToObject** sınıfımıza atıyoruz ve aynı şeyler onun için devam ediyor ve burada value yerine attr olarak sınıf göndermiş oluyoruz **else x** bu kısım ise eğer dict değil ise direk for ile gelen değeri direk setattr ile class içine işle diyoruz.
            else:
               setattr(self, key, DictToObject(value) if isinstance(value, dict) else value)
			   #bu kısım ise yukarda eğer value dict veya tuble değil ise burası çalışır.
			   # burda da gelen değişken *if isinstance(value, dict)* dict ise **DictToObject** tekrandan sınıfımıza geri gönderileri ve işlemler tekrar eder ve burada yine attr olarak sınıf göndermiş oluyoruz, eğer dict değilsede *else value* direk value değerini **setattr** ile  sınıfa işler.
```

Biraz karışık oldu, ama dikkatlı inceler ve okursanız anlayacağınızı tahmin ediyorum, bu kod ( sınıf ) benim çok işime yarayacak sizlerede anlatmak istedim.

### Nasıl kullanılır ?
Kodun çıktısını açıklıyorum, örnek ile anlatalım.

```python
>>> d = {"a": "b", "c": {"d": "e"}, "f": ["hi", {"foo": "bar"}]}
>>> x = DictToObject(d)
>>> x.c.d
e
>>> x.f[1].foo #bu kısım nasıl oldu derseniz
'bar'
# "f": ["hi", {"foo": "bar"}] bu kısım list olduğu için ve içinde dict olduğu için yukarıda anlattığım
# attr olarak sınıf göndermiş oluyoruz dediğim olaylar gerçekleşiyor.
# yani bu şekilde setattr(self, key, DictToObject(value))
# bu şekilde değil setattr(self, key, value)

>>> x.__dict__ # bu şekilde yaparak sınıf içindeki dict leri yani nesneleri görebilirsiniz.
{'a': 'b', 'c': <__main__.DictToObject object at 0x0000025095AB45C0>, 'f': ['hi', <__main__.DictToObject object at 0x0000025095AB45F8>]}
# burdan bakın normalde x.a yapınca b cıktısını alırız fakat x.c yapınca bize yine sınıf döndürecektir yada
# x.f yapınca bize bir liste döndürecektir bu listenin 1. elemanı ise yine bir sınıftır.
```
