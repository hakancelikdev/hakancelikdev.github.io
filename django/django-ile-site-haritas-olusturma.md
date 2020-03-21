# Django Ile Site Haritası Oluşturma

### Site Haritası Nedir?

Site haritaları google gibi arama motorlarının sizin sitenizi'deki içeriklerin botları ile daha hızlı ve pratik bir şekilde tarama yapıp indexlemesini sağlayan .xml uzantılı bir dosyadır seo yani arama motoru optimizasyonu için oldukça önemli olup neredeyse her sitede bulunur, örneğin coogger'ın içerikler için kullandığı [/sitemap/content.xml/](https://www.coogger.com/sitemap/content.xml/) adresine tıklayarak inceleyebilirsiniz.

## Hadi Projemiz için Site Haritası Yapalım

Önce projenizin **settings.py** bölümünü açın ve  [INSTALLED_APP](https://docs.djangoproject.com/en/1.11/ref/settings/#std:setting-INSTALLED_APPS) kısmına django'da bulunan sitemap uygulamasının yolunu yazalım; `django.contrib.sitemaps`

[sites framework](https://docs.djangoproject.com/en/1.11/ref/contrib/sites/#module-django.contrib.sites)'ün yüklü olduğundan emin olun.

Daha sonra projenizin **myapp/templates** dizini içerisine **sitemap.xml** olarak bir dosya açalım ve içine şu satırları yazalım;

```html
<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">

{% spaceless %}
{% for url in urlset %}
  <url>
    <loc>{{ url.location }}</loc>
    {% if url.lastmod %}<lastmod>{{ url.lastmod|date:"Y-m-d" }}</lastmod>{% endif %}
    {% if url.changefreq %}<changefreq>{{ url.changefreq }}</changefreq>{% endif %}
    {% if url.priority %}<priority>{{ url.priority }}</priority>{% endif %}
   </url>
{% endfor %}
{% endspaceless %}
</urlset>
```

bu dosya bizim sitemap temamız ( template ) dır.

eğer siteniz bir haber sitesi ise **sitemap** temanız aşağıdaki gibi olmalıdır.

```html
<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
{% spaceless %}
{% for url in urlset %}
  <url>
    <loc>{{ url.location }}</loc>
    {% if url.lastmod %}<lastmod>{{ url.lastmod|date:"Y-m-d" }}</lastmod>{% endif %}
    {% if url.changefreq %}<changefreq>{{ url.changefreq }}</changefreq>{% endif %}
    {% if url.priority %}<priority>{{ url.priority }}</priority>{% endif %}
    <news:news>
      {% if url.item.time %}<news:publication_date>{{ url.item.time|date:"Y-m-d" }}</news:publication_date>{% endif %}
      {% if url.item.tag %}<news:keywords>{{ url.item.tag }}</news:keywords>{% endif %}
    </news:news>
   </url>
{% endfor %}
{% endspaceless %}
</urlset>
```

Şimdi **views.py** ye girelim, açıklamaları kodların içine yazdım.

```python
# views.py dosyanızın içine
from models import Blog
# model dosyamızdan Blog adlı sınıfı çağırıyoruz
# Blog model sınıfını örnek için veriyorum siz içeriklerinizi hangi model sınıfında tutuyorsanız yanı
# hangi model sınıfı için site haritası yapacaksanız onu çağırın
from django.contrib.sitemaps import Sitemap
# django nun sitemap sınıfını çağırıyoruz
class BlogSitemap(Sitemap):
# sınıf ismimizi verdik ve çağırdığımız Sitemap sınıfından miras alıyoruz
    changefreq = "daily" # bu değişkenimiz site haritasında yazacak olan ne
                         # sıklıkla tarayacağı bilgisini yazar { daily always weekly }
                         # gibi seçenekler vardır araştırın
    priority = 1.0    # priority değişkenimiz tarama önceliğini arama motorlarına belirtir
                      # 0.1 ,0.6 veya 1.0 gibi değerler verilebilir size kalmış
    def items(self):  # items fonksiyonu Blog nesnesindeki her öğeyi belirtir yani
                      # item.url , veya item.time diyerel modelinize ait değişkenleri alabilirsiniz
        return Blog.objects.all()
    def lastmod(self,obj): # lastmod fonksiyonu içeriğinizin en son değiştirilme tarihini gösterir.
        return Blog.objects.filter(user = obj.user)[0].lastmod
        # benim modelimde en son değişme tarihi bu şekilde kayıtlı
        # olduğu için ben bu şekilde aldım , kullanıcının yazmış olduğu en
        # son içerik tarihini alıyorum buda en son güncelleme zamanını vermiş oluyor ve bu bilgiyi return ile gönderiyorum
    def location(self,obj): # location fonksiyonu içerik adreslerinin tutulduğu yerdir
         return obj.url # items fonksiyonunda gönderdiğimiz model nesnemizin öğelerine erişmek için
            # (self,obj) şu parametreleri kullanıp obj değişkenindeki
            # ( bu bizim çağırdığımız model oluyor ) ögelere erişebiliyoruz bende içerik adreseri
            # Blog modelimde url değişkeninde olduğu için bu şekilde çağırdım.
```

views.py yi de ayarladığımıza göre urls.py bölümüne girip son ayarımızı yapıyoruz.

açıklamalar yine kodlar da mevcut:

```python
from django.contrib.sitemaps.views import sitemap
# urls.py için django sitemap fonksiyonunu ekledik.
from views import BlogSitemap # şeklinde views.py içindeki site harita sınıfımı çağırdım
# sizlerde import işlemleri urls.py ve views.py dosyalarının konumuna göre değişebilir
# bunu import etme kurallarını araştırıp sıkıntısız bir şekilde dahil edebilirsiniz
sitemaps = {
    "blog":BlogSitemap(),
}
"""
sitemaps adında bir sözlük (dict) tipinde bir değişken açtık ve
az önce views.py de ayarladığımız blog site harita sınıfını "blog" şeklinde sözlüğümüze gönderdik
eğer birden fazla site haritası ekleyecekseniz yine views.py de az önce yaptığımız işlemleri başka eklemek istediğiniz model sınıfınızı dahil ederek ayarlayıp o sınıfı urls.py içine çağırarak ( import ederek ) sitemaps sözlüğüne eklemeniz yetecektir.
 """
urlpatterns = [
    url(r'^sitemap\.xml$', sitemap, {'sitemaps': sitemaps}),
    # son olarak burada sitemap.xml adres kısmını oluşturduk ve django nun sitemap
    # fonksiyonunu koyduk ikinci paramatere olarak
    # daha sonra {'sitemaps': sitemaps} şu sözlük ile de yukarıda oluşturduğumuz sitemaps
    # oluşturduğum sitemap sınıflarını gönderdim ve işlem bitti hepsi bu kadar
]
```

şimdi  projenizden /sitemap.xml şeklinde ki adrese giderek site haritanızı görüntüleyebilirsiniz.


## Not
Seo için **robots.txt** dosyanıza site haritalarının adreslerini koymayı unutmayın

#### Kaynak
- https://docs.djangoproject.com/en/2.2/ref/contrib/sitemaps/
