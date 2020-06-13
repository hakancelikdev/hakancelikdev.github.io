# Django'da Sayfalama - Pagination

## Sayfalamaya neden ihtiyaç var ?

Verilerin çokluğundan doğan bir ihtihaç sayfalama mantığını getirmiştir, bütün veriler
tek bir sayfada olmuş olsaydı

- sayfa geç yüklenir
- kullanıcılar uzun süre beklemek durumun da kalır
- sunucumuz fazla iş yapmış ve yorulmuş olur
- internet'de aynı zaman da fazla dan harcanmış olur
- tasarım açısından da pek hoş görünmez di.

bunların sonucunda ise kullanıcılar web sitelerinde uzun süre kalmaz ve ayrılırlar büyük
ihtimalle

Bu yüzden bu gün django'da bulunan \( from django.core.paginator import Paginator \)
paginator fonksiyonunu kullanmayı öğreneceğiz.

bence bu fonksiyonu tools.py adında bir dosya açıp paginator adında bir fonksiyon yazın
ve gerekli olan bütün yerlerde bu fonksiyonu çağırarak kullanın bu sayede hız kazanmış
olursunuz.

## Django ile sayfalama \( Pagination \) - Mantığını Anlamak

Öncelikle Paginator fonksiyonunu projemize dahil edelim,

```python
from django.core.paginator import Paginator
```

Objects adında bir liste tanımlayalım `objects = ['john', 'paul', 'george', 'ringo']`

Şimdi bu listeyi **Paginator** fonksiyonu yardımı ile sayfalıyalım ve mantığını
kavrayalım.

```python
p = Paginator(objects, 2)
```

p adında bir değişken oluşturduk ve objects listesini birinci argüman olarak Paginator
içine attık, Paginator' un ikinci değişkeni her sayfada kaç tane öğe görünmesini
istediğimizi belirler burada 2 yazdığımız için her sayfada sadece 2 öğe görünecektir.

```python
p.count
```

**count** ile p içindeki toplam nesne sayısını öğrenebiliriz burada çıktı olarak **4**
verecektir.

```python
p.num_pages
```

num_pages ile p değişkeninde bulunan verileri toplamda kaç sayfada göstereceğimiz
bilgisine ulaşabiliriz burada Paginator fonksiyonunun ikinci değişkenine 2 yazdığımız
için ve objects nesnesi 4 öğeden oluştuğu için toplam gösterilecek sayfa sayısı 4/2 = 2
dir yanı p.num_pages bize 2 çıktısını verecektir.

```python
p.page(1)
```

sayfa getirmek istersek **page\(\)** fonksiyonunu kullanıyoruz bu fonksiyon sadece bir
parametre alır oda getirmek istenilen sayfanın sayısıdır, çıktı olarak bize
`<Page 1 of 2>` bunu verecektir, getirdiğiniz sayfada bulunan verileri almak isterseniz,
**object_list** methodunu kullanmanız gerekir yanı sonuc olarak şöyle yapmanız gerek.

```python
page1 = p.page(1) # <Page 1 of 2>
page1.object_list # ['john', 'paul'] # çıktı olarak bunu verir
page2 = p.page(2)
page2.object_list  # ['george', 'ringo'] ikinci sayfadaki veriler
```

sayfaları tek tek çağırmak yerine sırayla bir sonraki sayfayı çağırmak için
**has_next\(\)** fonksiyonunu kullanmak gerek ,bir önceki sayfayı çağırmak yanı
verilerine erişmek için ise **has_previous\(\)**

bunlar eğer bir sonraki veya bir önceki sayfa mevcut ise True eğer çağrılan sayfalar yok
ise False değeri döndürür.

```python
page2.has_next()     #   False 3. sayfa olmadığı için False
page2.has_previous() #  True 2 den bir önceki sayfa yani 1.sayfa oldugu için True
```

verisi gelen sayfanın ilk verinin numarasını öğrenmek için **start_index\(\)** , gelen
verinin sonundaki veri numarasını öğrenmek için ise **end_index\(\)** fonksiyonu
kullanılır

### Örnek

```python
page2.start_index() # 3 çıktısını verir çunkü 2. sayfada ki ilk eleman objects listesinin 3. elemanıdır
page2.end_index() # 4 çıktısını verir çunkü 2. sayfada ki son eleman objects listesinin 4. elemanıdır
```

## Peki Bu Bilgileri Template'de Nasıl Kullanacağız ?

önce tools.py adında bir dosya oluşturun veya yazmak istediğiniz views.py içine
Paginator ve onun hata sınıflarını dahil edelim

```python
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
```

**PageNotAnInteger** sınıfı eğer gelen sayfa isteği sayı değil ise bu sınıfı kullanarak
hatayı yakalıyabiliyoruz

**EmptyPage** sınıfı ise gelen sayfa isteği bulunan sayfa sayısı dışında ise bu hatayı
yakalamamıza yardım eden sınıftır.

Şimdi **paginator** adlı fonksiyonumuzu oluşturalım ve başka yerlerde sürekli bunu
kullanmak için şekillendirelim.

[www.coogger.com](https://www.coogger.com) sayfalama fonksiyonu şu şekilde bu aynı
zamanda django dökümanlarında bulunan kodlardırın biraz değiştirilmiş halidir.

```python
def paginator(request,queryset,hmany=20):
    paginator = Paginator(queryset, hmany)
    page = request.GET.get('page')
    try:
        contacts = paginator.page(page)
    except PageNotAnInteger:
        contacts = paginator.page(1)
    except EmptyPage:
        contacts = paginator.page(paginator.num_pages)
    return contacts
```

şimdi 3 tane parametre alıyor birincisi gelen istekler olan request, ikincisi sayfalamak
istediğimiz verimiz \( bu veriler veri tabanından aldıgımız verilerdir \) üçüncüsü bir
sayfada kaç tane veri görünmesi gerektiği.

try ve except ile hataları yakalıyoruz , eğer gelen sayfa isteği sayı değil ise birinci
sayfanın verilerini veriyoruz , eğer gelen sayfa isteği bulunan sayfa sayısı dışında ise
son sayfayı veriyoruz.

template' ımız de şu şekilde olacak

```python
<div class="pagination">
    <span class="step-links">
        {% if blog.has_previous %}
            <a class="step-links-a" href="?page={{ blog.previous_page_number }}">geri</a>
        {% endif %}
        <span class="current">
            {{ blog.number }} | {{ blog.paginator.num_pages }}
        </span> {% if blog.has_next %}
    <a class="step-links-a" href="?page={{ blog.next_page_number }}">ileri</a> {% endif %}
    </span>
</div>
```

Yükarıda anlattıklarımı kullanarak bunu değiştirebilirsiniz bana sadece bu gerektiği
için ben bunu kullandım.

`<a class="step-links-a" href="?page` buradaki **?page** i kullanarak yeni bir url
yapmadan burdaki veriyi

`request.GET.get('page')` bu kod ile çekebilirsiniz bizde istenilen sayfa sayısını bu
şekilde çektik.

Şimdi bu oluşturduğumuz temayı ve paginator fonksiyonunu kullanalım.

```python
from models import Blog
from views import tools
queryset = Blog.objects.all()
blogs = tools.paginator(request,queryset)
return render(request,"blog/blogs.html",{"blogs":blogs})
```

burada Blog nesnesinden \( veri tabanından \) bütün verileri çektik çekilen verileri
tools.py modulumuzdeki **paginator** adlı fonksiyonun 2. paremetresine attık ,1
.parametreye gelen istekler olan request i verdik ve sayfamızda 20 tane içerik
görünmesini istediğimiz için 3. parametreyi tekrar yazma ihtiyacı duymadık

**paginator** fonksiyonu bize sayfaladı ve veriyi çıktı olarak verip blogs değişkenine
attı bizde onu blogs.html adlı temamıza blogs ismi ile yolladık.

işlem bu kadar arkadaşlar kolay gelsin görüşmek üzere.

### Kodların son hali

**tools.paginator**

```python
def paginator(request,queryset,hmany=20):
    paginator = Paginator(queryset, hmany)
    page = request.GET.get('page')
    try:
        contacts = paginator.page(page)
    except PageNotAnInteger:
        contacts = paginator.page(1)
    except EmptyPage:
        contacts = paginator.page(paginator.num_pages)
    return contacts
```

**blogs.html**

```markup
{% include 'home/head.html' %} {% include 'home/header.html' %} {% include 'home/nav.html' %} {% if blog %}
<div class="blogs">
    <div class="main-blog-cards">
        {% include 'blog/blog-cards.html' %}
    </div>
</div>
{% include "home/paginator.html" %} {% endif %}
```

blogs.html içinde paginator.html ı dahil ediyoruz

**paginator.html**

```python
<div class="pagination">
    <span class="step-links">
        {% if blog.has_previous %}
            <a class="step-links-a" href="?page={{ blog.previous_page_number }}">geri</a>
        {% endif %}
        <span class="current">
            {{ blog.number }} | {{ blog.paginator.num_pages }}
        </span> {% if blog.has_next %}
    <a class="step-links-a" href="?page={{ blog.next_page_number }}">ileri</a> {% endif %}
    </span>
</div>
```

**style.css**

```css
.pagination {
  position: relative;
  width: max-content;
  padding: 30px 10px 30px 10px;
  margin: auto;
  margin-bottom: 60px;
}
.current {
  padding: 6px;
  border: 1px solid #f1f1f1;
  background: rgb(0, 0, 0);
  color: #fff;
  border-radius: 6px;
  margin-right: 14px;
}
.step-links-a {
  padding: 6px;
  color: #fff;
  background: blue;
  border: 1px solid #f1f1f1;
  border-radius: 6px;
}
```
