# Python'da Döngüler

## While Döngüsü

Genel yapısı
```python
while <expr>:
    <statement(s)>
```
olup while döngüsü bir şart ile çalışan döngüdür, tıpkı if, elif veya else gibi while döngüsünün de önemsediği tek şey verilen şartın doğru olup olmadığıdır, eğer doğru ise çalışmaya devam eder, yanlış ise çalışmaz bu gibi yapılara karşı yanlış yapamazsınız, yaptınız an sizinle işinin bittiği andır.

Örneğin aşağıda bir while döngüsüne karşı yanlış yapalım bakalım bizi affedebilecek mi?

```python
while False:
	print("İnsansın sonuçta bana karşı yanlış yapabilirsin, önemli değil ben çalışmaya devam edebilirim")
```

çalıştırın bakalım içinde düşündüğü gibi sonuç verecekmi ? tabikide hayır bu yapılara yanlış yaparsanız affınız olmaz.

şimdide ona karşı doğru şeyler yapalım bakalım ne diyecek.

```python
while True:
	print("Bana iyi davrandığın için teşekkürler ben her zaman senin arkadaşın olacağım")
```

yukarıdaki kodu çalıştırdığınızda siz arkadaşlığınızı kesene kadar ( kapatana kadar ) çalışmaya devam edip sizin arkadaşınız olacaktır.

[islecler-ve-print-fonksiyonu](https://www.coogger.com/@hakancelik96/islecler-ve-print-fonksiyonu/) bu yazımda diğer bool değerleri nasıl elde edildiğini python'un onları nasıl anladığını ve her nesnenin veya değerin bir bool değeri olduğundan bahsetmiştim, yukarıda `True` veya `False` yazdığımız yerlere bu içeriktek öğrendiğiniz şekilde yazarsanız yazdığınız şartın bool değerine bakıp `True` ise çalışmaya devam edip `False` ise çalışmayacaktır yine aynı şekilde, bu anlattığım konuları ayrı ayrı tutmak yerine bağdaştırın.

### While Örneği

```python
password = "123"
while (password != str(input("lütfen şifrenizi yazınız >> "))):
	pass
```

yukarıdaki örneği inceleyelim;

- Bir şifre belirledik
	> password = "123"

- Şart olarak girilen yazının bizim şifremize eşit olmama durumunu yazdık
> (password != str(input("lütfen şifrenizi yazınız >> "))) şart olarak

- Şart gereği şifre doğru değilse ise çalışmaya devam edecektir.

- Hiç bir şey yapmadan çalışmaya devam etmesi için pass keyword'unu kullandık.

- Şart sağlandığı anda yani şifreler eşleştiği anda verilen şart doğru olmadığı zamanlar çalış dediği için doğru olduğunda çalışmayı bıraktı.

eğer aşağıdaki gibi yazıp bıraksaydım hata alırdım çünkü while döngüsü ne iş yapacak ? o kısmı kodlamamışım hata verir bu yüzden.

```python
password = "123"
while (password != str(input("lütfen şifrenizi yazınız >> "))):
```

`pass` yerine aşağıdaki gibi de yapabilirdik.

```python
password = "123"
while (password != str(input("lütfen şifrenizi yazınız >> "))):
	"Bu döngü ile şifre doğrulaması yapıyoruz"
```

> Not; döngüler içinde if, elif, else döngüler gibi yapıları kullanabilirsiniz anlatılan herşeyi bağdaştırın ve bunu bir dil olduğunu unutmayın diller esnektir istediğinizi yapmakta özgürsünüz.

örnek olarak

```python
stop = False
count = 0
while not stop:
	count += 1
	print("count", count, "stop", stop)
	if count == 10:
		while count:
			print("count", count, "stop", stop)
			count -= 1
		stop = True
		print("count", count, "stop", stop)
```

## For Döngüsü

For döngümüz aslında gelişmiş bir while döngüsüdür genel yapısı

```python
for <değişken ismimiz> in <list veya str veya tuple>:
	<statement(s)>
```

for döngümüzde `<list, str, tuple veya dict>` bu kısım kısacası **iterator** bir nesne olması gerekiyor.

### Iteratorlerin Çalışma Mantığı

```python
>>> x = iter([1, 2, 3]) # x değişkenimiz artık bir iterator
>>> x
<listiterator object at 0x1004ca850>
>>> x.next() # iterator nesnemizin altındaki next fonksiyonun her çağırmamızda bir sonraki öğeyi döndürür bize
1
>>> x.next()
2
>>> x.next()
3
>>> x.next() # öğe bitince hata verecektir
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
StopIteration
```

Burda **iter** built-in fonksiyonlarından olup **iterable** bir nesne alır ve **iterator** olarak döndürür ( return )

aslında bu anlatılanlar for döngüsünün çalışma mantığıdır, sizde while döngüsünü kullanarak bir for döngüsü elde edebilirsiniz.

### For Döngüsüne Örnekler

#### Str Iterator
```python
for i in "1234":
	print(i)
```

Burdaki her bir döngümüzde i değerimiz sırası ile 1, 2, 3 ve 4 olacaktır.

Bu örnekte anlayacağınız gibi for döngüleri verilen **iterator'ün** uzunlukları kadar çalışırlar bir şarta ihtiyaçları yoktur.

#### list Iterator
```python
my_list = ["1", "2", "3"]
for i in my_list:
	print(i)
```

Burda mesela eleman sayım 3 o zaman for döngüsü 3 defa çalışacak ve her çalışmasında `["1", "2", "3"]` iterator'e çevirdiği bu nesnenin altındaki `next()` methodunu kullanarak i değişkenimiz sırası ile 1, 2 ve 3 olacaktır.

#### Dict Iterator
```python
my_dict = dict(a=1, b=2, c=3)
for key, value in my_dict.items():
	print(key, value)
```

Burdaki eleman sayım yine 3, for döngüsü 3 defa çalışacak, bu sefer i yerine `key, value`adında iki tane değişken kullanıyorum çünkü iteratorüm bir sözlük ve her next çalışmasında bana key', ve value'su olacak şekilde bir tuple döndürecektir.

> Not her döngüde kullanılan 'i' index'in baş harfi olan 'i' dir, genel olarak bu şekilde kullanılır, tabi burdaki değişken ismini istediğiniz gibi seçebilirsiniz.

## İlgili Fonksiyonlar, Keywordler
### Range
Range bir **built-in** fonksiyonu olup parametrelere olarak girilen sayıları alıp bir iterator döndürür.

```python
>>> for i in range(5):
...     print(i)
...
0
1
2
3
4
```

Yukarıdaki ilgili yere aşağıdaki örnekler ile yer değiştirirseniz alacağınız sonuçları ile birlikte yazılmıştır.
```python
range(5, 10)
   5, 6, 7, 8, 9

range(0, 10, 3)
   0, 3, 6, 9

range(-10, -100, -30)
  -10, -40, -70
```

Veya değişken türümüzün **list** olduğu bir örnek yapalım

```python
>>> a = ['Mary', 'had', 'a', 'little', 'lamb']
>>> for i in range(len(a)):
...     print(i, a[i])
...
0 Mary
1 had
2 a
3 little
4 lamb
```

Burdaki **len** fonksiyonu parametre olarak verilen değişkenin uzunluğunu, eleman sayısını döndürür.

burda her bir döngüde i değişkeni 0, 1 ... olurken **a[i]** şeklinde yazarak listemizin elemanlarını alıyoruz

>Not: Bir iterator'ü list tipimizin içine atarsak onu listeye çevirir.

```python
>>> list(range(5))
[0, 1, 2, 3, 4]
```

### Break
Break keyword'ü bir üstündeki döngüyü durdurmaya yarar.

#### While Döngüsünde Break

```python
count = 0
while True:
	count += 1
	print(count)
	if count == 10:
		break
```

Yukarıdaki örneğimizde count değişkeninin değeri 10'a ulaştığında if koşullu durumu çalışacaktır buna bağlı olarak `break` keywordüde çalışacağından bir üstündeki while döngüsü kapanacak, çıkılacaktır.

#### For Döngüsünde Break

```python
for i in range(100):
	print(i)
	if i == 10:
		break
```

Yine aynı şekilde yukarıdaki gibi sonuç verecektir.

peki iki tane döngü kullansak

```python
count = 0
while True:
	count += 1
	print("count", count)
	for i in range(count):
		print("i", i)
		if i == 10:
			break
```
Bu döngüdeki `break` for döngüsünü şart sağladığında durdursa bile en üstteki `while` döngüsünü durduramayacağından her zaman çalışacaktır.

### Continue
Continue kelime anlamı gibi devam et özelliğini taşır python'da bunu da örnek ile anlatalım.

```python
for i in range(20):
	if i == 10:
		continue
	print("i 10 ilen bu yazı ekrana gelmez", i)
```

Yukarıdaki örnekte eğer i değeri 10 olursa devam et dedik yani bir satır aşağıya bakma iteratorumüzdeki bir sonraki next değerini çalıştır, demiş olduk.

### Else
For döngümüzün içinde bir if koşul durumu kullandığımızı düşünün fakat biz şöyle bir iş yapmak istiyoruz eğer döngü boyunca bu şart sağlanmaz ise döngü sonunda şunu çalıştır, işte burada yine else yetişiyor yardıma.

```python
for i in range(20):
	if i == 21: #döngü boyunca bu şart sağlanmaz ise
		continue
else:
	print("Bu satırı çalıştır")
```


### Pass
Pass keyword'üne daha önce bakmıştık zaten hiç bir şey yapma ama bu satırda boş kalmasın çünkü hata verir dediğiniz anda yardımınıza koşar.

#### Örnekler

Döngülerde
```python
>>> while True:
...     pass  # Busy-wait for keyboard interrupt (Ctrl+C)
...
```

Sınıf tanımlarken
```python
>>> class MyEmptyClass:
...     pass
...
```

Fonksiyon tanımlarken
```python
>>> def initlog(*args):
...     pass   # Remember to implement this!
...
```
