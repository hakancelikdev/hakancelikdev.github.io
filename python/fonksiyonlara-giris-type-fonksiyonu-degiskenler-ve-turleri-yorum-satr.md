<center>![](https://www.coogger.com/media/images/python.jpg)</center>

## Fonksiyon
Yazılım dillerindeki fonksiyonlar bildiğimiz matematik deki fonksiyonlar ile aynıdır, aslında genel olarak bakıldığında matematik ile yazılım zaten aynı şeydir, bilgisayar denen makinenin bir matematik ürünü olduğunu unutmamak gerekiyor.
Bu bölümde hafif bir fonksiyonlardan bahsedip geçeceğiz, bunun amacı bu içerikte neler döndüğünü anlamanızı sağlamaktır ilerleyen zamanlarda fonksiyon konusuna tekrar geleceğiz ve daha detaylı bir şekilde inceleyeceğiz.

Fonksiyonların genel bir amacı olup matematikde de olduğu gibi bir, birden fazla veya hiç parametre olmayabilir alınan parametreleri kullanan fonksiyon bir sonuca varır ve biz bu sonucu alırız örnek olarak **f(x) = x^2 + x** buradaki fonksiyon tek parametre alır, parametre ismi **X** dir ve amacı girilen değerin karesini alıp kendisi ile toplamaktır, bu fonksiyonu birde python ile yazalım, buralara çok takılmayın sadece böyle bir şeyin olduğunu bilin anlayın ve geçin.

```python
def f(x):
	return x*x+x # oluşan sonucun alınmasını sağlar *return** çok takılmayın
```

işte bu kadar gördüğünüz gibi hafif bir söz dizimi farklılığı dışında pek bir farklılık yok, söz dizimi dışında herşey aynı

bu fonksiyonu kullanalım yani çağıralım.
```python
>>> f(3)
12
>>> f(x=3) # bu şekildede yazabilirsiniz
12
```
gördüğünüz gibi bu kadar, x parametresine 3 verdim ve fonksiyon karesini alıp kendisi ile topladı sonuç 9.

## type Fonksiyonu
type python'da bulunan başka kullanışlı bir fonksiyondur ve bunun amacı yukarıda anlattığımız f fonksiyonunun amacından biraz farklı olup amacı parametre olarak verilen değişken/değer vs 'in türünü vermektir/söylemektir.

örnek olarak yukarıdaki **f** fonksiyonunu parametre olarak kullanalım

```python
>>> type(f)
<class 'function'> # türü fonksiyon muş
```
işte bu fonksiyonu kullanarak elimizdeki değişkenlerin türüne bakacağız.

## Değişken ve Türleri

### Değişkenleri Anlayalım
Python programlama dilinde değişken tanımlarken karmaşık olamayan ve matematikte alışık olduğumuz gibi bir tanımlama sistemi kullanılıyor hemen bakalım.

mesela ben size söyle bir şey yapsam
**x = 3** siz bana hemen x'in 3'e eşit olduğunu söylersiniz, ben size x kaçtır dediğimde 3, nedir dediğimde değişken, türü nedir dediğimde ise tam sayı olduğunu söylersiniz, bakalım python'da da öylemi ?

```python
>>> x = 3 # x değişkenine 3'ü atatım
>>> x # x değişkenini çağırdım
3 # sonuç 3 olarak döndü
>>> type(x) # türüne bakmak için parametre olarak değişkeni yazdım
<class 'int'> # evet sonuç integer yani tam sayı
```
Gördüğünüz gibi matematik aslında yazılımmış, yoksa yazılım matematik mi ?:D

### Değişken Türleri

4 farklı madde türü olduğu gibi (katı, sıvı, gaz ve plazma) burdada 4 farklı değişken türü var bunlar,

- int (integer - sayı)
- str (string - karakter)
- dict (dictionary - sözlük)
- list (list - liste)


#### int (integer - sayı)

Integer veri tibini 3 farklı şekilde tanımlayabiliriz.

```python
>>> x = 5 # x değişkenine 5'ü atatım
>>> x # x değişkenini çağırdım
3 # sonuç 3 olarak döndü
>>> type(x) # türüne bakmak için parametre olarak değişkeni yazdım
<class 'int'> # evet sonuç integer yani tam sayı
>>> int(5) # 5 sayısı zaten interger olduğu için aslında x = 5 şekinde kullanılır anlamanız için bu şekilde de yazmak istedim
5
>>> int("5") # bu şekilde yaparak string olan veri türünü eğer matematiksel olarak mümkün ise integer'a çevirir
5
>>> int("a") # bu matematiksel olarak mümkün olmadığı için hata verecektir.
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
ValueError: invalid literal for int() with base 10: 'a'
```

#### str (string - karakter)

Python'da string değişkenimizi 5 farklı şekilde tanımlayabiliyoruz

```python
>>> "string" # değişkenimize tek satırlık string veri türü atarken
>>> 'string' # değişkenimize tek satırlık string veri türü atarken
>>> """string""" # değişkenimize birden fazla satırlık string veri türü atarken
>>> '''string''' # değişkenimize birden fazla satırlık string veri türü atarken
>>> str(8) # str() türünü kullanarak ta string nesnemizi oluşturabiliriz
>>> str("hakan") # veya
>>> type(str) # bu şekilde yazar ve str'in ne olduğuna bakmak istersek
<class 'type'> # bizlere bunun bit tip olduğunu söyleyecektir
```

String veri türü yukarıda gördüğünüz gibi tırnak işaretleri kullanılarak tanımlanır python yazılan verinin string olduğunu bu şekilde anlar, hızlı bir örnek yapalım.

```python
>>> string_variable = "string" # değişkenime string veri türünde karakter ataması yaptım
>>> type(string_variable) # türünün ne olduğuna bakıyorum
<class 'str'>
>>> string_variable2 = "10" # bunu int sanmayın tırnak içinde yazdığım için bunun türü string dir
>>> type(string_variable) # türünün ne olduğuna bakıyorum
<class 'str'>
```




#### dict (dictionary - sözlük)

Dict veri tipini iki farklı şekilde tanımlayabiliriz **{}** süsle parantez kullanarak tanımlıyoruz yada direk tip nesnesini kullanarak yapabiliriz.

- **dict(value="key")** veya **{"value": "key"}** genel hat budur.

```python
>>> my_first_dict = {"name": "hakan", "surname": "çelik", "no": 201555573}
# sözlük veri tibini bu şekilde tanımlıyoruz, ben my_first_dict değişkenine atatım
# bunu bu şekilde de yapabilirim
>>> my_first_dict = dict(name="hakan", surname="çelik", no=201555573) # dict tipi nesnesini kullanarak dict veri türümü oluşturdum
# açıklamak gerekirse dict() sınırsız parametre alan bir fonksiyon gibi davranır ve parametre olarak verdiğiniz değerler dict nesnenizin value bölümlerini oluşturur.
```

peki veriyi değişkene atadık şimdide kullanalım.

```python
>>> type(my_first_dict)
<class 'dict'>  # evet türü dict
```

örneğin ben **my_first_dict** bu değişkenime atadığım verinin içindeki **hakan** verisini almak istiyorum bunu bu şekilde yapmalıyım

- **variable["value"]** bu şekilde çağırdığımda bana variable değişkeninde bulunan value ön eki ile kayıt ettiğim değeri verir, yani value'e bağlı olan key'i verir.

Şimdi bu anlattığım bilgileri kullanarak **hakan** key'i ni alalım

```python
>>> my_first_dict["name"] # değişken["value"] olarak yazdım, değişkenim içinde "name":"hakan"
# olduğu için sonuç hakan olarak dönmesi gerek.
'hakan'
```

Birde okul numaramı alalım

```python
>>> my_first_dict["no"] # no mu string olarak değil integer olarak kayıt etmiştim
201555573 # evet string olarak gelmedi.
```

##### Dict Verimizi Güncelleyelim

değişkenimize kayıt ettiğimiz verimizi güncellemek için 2 farklı yöntem bulunmakta.

```python
>>> my_first_dict["no"] = 0 # atama yaparak değiştirebiliriz, tıpkı değişkenlerde yaptığımız gibi
>>> my_first_dict["no"] # cağırıp değişkenin değerine bakalım
0  # evet güncellenmiş
```

İkinci yöntem **dict nesnemizin update fonksiyonunu kullanarak yapıyoruz**, değişken.update(value="key") şekilden güncelliyoruz

```python
>>> my_first_dict.update(no=12) # güncelledik
>>> my_first_dict["no"] # cağırıp değişkenin değerine bakalım
12  # evet güncellenmiş
```

##### Dict Verimizden Nesne Silelim

Örnek olarak ben **surname** kısmını silmek istiyorum değişkenimden bunun için **del** metodunu kullanarak yapabiliriz, **del değişken["value"]** şeklinde yaptıgınızda silinmiş olacaktır.

```python
>>> del my_first_dict["surname"] # sildik
>>> my_first_dict # çağırıp sonuca bakalım
{'name': 'hakan', 'surname': 'çelik'} # evet silinmiş
```

Bu şekilde methodlara kısaca girmiş olalım **.update()** bir dict nesnesine ait bir sınıftır bu dür fonksiyonları ( method ları ) list, str ve int içinde ilerleyen zamanlarda daha detaylı göreceğiz daha dict için de başka kullanışlı foksiyonlar bulunmakta şimdilik sadece kafanızda bulunsun o kadar.

#### list (list - liste)

Liste tanımlamayı yine iki farklı şekilde yapıyoruz
- **[]** köşeli parantez kullanarak
- **list** nesnemizi kullanarak yapabiliyoruz

```python
>>> my_firs_list = [0, 1, 2, 3, 4] # 5 öğeye sahip ilk listemizi kodladık
>>> my_firs_list # ekrana basalım
[0, 1, 2, 3, 4]
```

Birde **list** nesnesini kullanarak tanımlayalım

```python
>>> my_firs_list = list((0, 1, 2, 3, 4, 5)) # list nesnesi tek parametre alır ve burada parametre olarak verdiğimiz değer = (0, 1, 2, 3, 4, 5) budur bu tuble olarak geçen başka bri type ( tiptir )
>>> my_firs_list # ekrana basalım
[0, 1, 2, 3, 4, 5]

>>> my_firs_list = list([0, 1, 2, 3, 4, 5]) # bu şekilde de tanımlayabiliriz
>>> my_firs_list = list("hakan") # veya bu şekilde de tanımlayabiliriz her karakter bir öğe olacak şekilde liste nesnemizi oluşturacaktır
["h", "a", "k", "a", "n"] # sonuç
```

##### Liste Verimizi Okuyalım

Bu işlem için **değişken[index]**, **değişken[firs_index:last_index]**, **değişken[:]**, şeklinde okuyabiliriz

```python
>>> my_firs_list[0] # ilk nesnesini okudum
0 # ilk nesne 0 dı
>>> my_firs_list[-1] # son nesnesi
5 # 5 ti
>>> my_firs_list[2:4] # 2 den 4'e kadar olan kısmı okudum
[2, 3] # 2 ve 3
>>> my_firs_list[:] #hepsini okudum
[0, 1, 2, 3, 4, 5]
```

##### Liste Verimizi Güncelleyelim

Yine dict türünde yaptığımız gibi atama yaparak güncelleyebilirsiniz
```python
>>> my_firs_list[2:4] = [1, 2] # yaparsam
>>> my_firs_list[2:4] #bakalım sonuca
[1, 2] #güncellenmiş
```

## Yorum ve Açıklama Cümleleri

Yukarıda sizlere kodların ne işe yaradığını anlatmak için notlar yazdığımı gördünüz ve onları okudunuz kodların içine notlar yazmışım pyhton o yazdığım yorumları görmezden gelir ve yazılan yazının kod mu yoksa yorum/açıklama satırı olup olmadığını **#** bu işaretten anlat

```python
# bu bir yorum satırıdır
x = 0 # bu kısım ise kod satırıdır ama bu yazı yine yorum satırıdır.
```

Yorum bırakmak için illa **#** işareti kullanmanız gerekmez string formatında'da yorum yazabilirsiniz örneğin

```python
x = 0
"burası yorum satırıdır ama string formatında ve bu veriyi herhangi bir değişkene atmadığım için sıkıntı yok"
```

<div general="txt-xl center c-turquoise">Python'da Herşey Bir Nesnedir</div>
