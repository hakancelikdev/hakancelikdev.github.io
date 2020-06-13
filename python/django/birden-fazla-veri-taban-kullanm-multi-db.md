# Birden Fazla Veri Tabanı Kullanımı

Birden fazla veri tabanı kullanmak için öncelikle projemizin settings.py dosyasına
eklemeler yaparak bu veri tabanlarını tanımlamamız gerekiyor örnek olarak aşağıda bir
postgresql ve mysql veri tabanları için settings.py ayarı var birden fazla ve aynı
olmayan tür olmayan veri tabanlarınıda kullanabiliyoruz.

```python
DATABASES = {
    'default': { # varsayılan olarak ayarladığımız ver tabanımız
        'NAME': 'app_data', # veri tabanı ismi
        'ENGINE': 'django.db.backends.postgresql', # veri tabanı türü
        'USER': 'postgres_user', # kullanıcı
        'PASSWORD': 's3krit' # ve şifre bunları yazma amacımızı bende bilmiyorum bilen varsa yoruma yazarsa düzeltme eklerim
    },
    'users': { #sadece kullanıcları kayıt etmek için açmış olduğumuz ( erişme adı users olan user_data isimli )veri tabanı
        'NAME': 'user_data',
        'ENGINE': 'django.db.backends.mysql',
        'USER': 'mysql_user',
        'PASSWORD': 'priv4te'
    }
}
```

Tabiki varsayılan bir veri tabanı kullanmak istemiyorsanız kullanmaya bilirsiniz bunun
için default kısmını boş bırakmalısınız şu şekilde ;

```python
DATABASES = {
    'default': {},
    'users': {
        'NAME': 'user_data',
        'ENGINE': 'django.db.backends.mysql',
        'USER': 'mysql_user',
        'PASSWORD': 'superS3cret'
    },
    'customers': {
        'NAME': 'customer_data',
        'ENGINE': 'django.db.backends.mysql',
        'USER': 'mysql_cust',
        'PASSWORD': 'veryPriv@ate'
    }
}
```

## Veritabanlarınızı Senkronize Etme

Veri tabanı senkronizasyonu komutu bir seferde bir veritabanı üzerinde çalışır.
Varsayılan olarak, varsayılan veritabanı üzerinde çalışır, ancak —database seçeneğini
sağlayarak farklı bir veritabanını senkronize etmesini söyleyebilirsiniz. Dolayısıyla,
yukarıdaki ilk örnekteki tüm veritabanlarına tüm modelleri senkronize etmek için
aşağıdakileri gibi yapmanız gerekir.

```bash
$ ./manage.py migrate # varsayılan olarak ayarladığınız veri tabanı senkronize olur
$ ./manage.py migrate --database=users # erişme ismi users olan veri tabanı senkronize olur
```

Bu da bir diğer örnek varsayılanı boş yaptığımız için

```bash
$ ./manage.py migrate --database=users
$ ./manage.py migrate --database=customers
```

## Diğer Yönetim Komutlarını Kullanma

Veritabanı ile etkileşim kuran diğer çoğu django-admin komutu, taşıdıkça çalışır;
yalnızca bir defada yalnızca bir veritabanında çalışır; kullanılan veritabanı
denetiminde —database kullanılır.

Bu kuralın bir istisnası makemigrations komutudur. Yeni geçişler oluşturmadan önce
varolan taşıma dosyalarıyla \(bunları düzenlemeyle oluşabilecek\) sorunları yakalamak
için veritabanlarındaki geçiş geçmişini doğrular. Varsayılan olarak, yalnızca varsayılan
veritabanını denetler, ancak varsa yönlendiricilerin allow_migrate \(\) yöntemini
inceler.

## Otomatik Veritabanı Yönlendirme \( Routing \)

Birden çok veritabanını kullanmanın en kolay yolu, bir veritabanı yönlendirme şeması
oluşturmaktır. Varsayılan yönlendirme şeması, nesnelerin orijinal veritabanına
'yapışkan' kalmasını sağlar \(yani, foo veritabanından alınan bir nesne aynı
veritabanına kaydedilir\). Varsayılan yönlendirme şeması, bir veritabanı
belirtilmemişse, tüm sorgular varsayılan veritabanına geri dönmesini sağlar.

Varsayılan yönlendirme şemasını etkinleştirmek için herhangi bir şey yapmak zorunda
değilsiniz - her Django projesinde 'kutunun dışında' sağlanmaktadır. Bununla birlikte,
daha ilginç veritabanı tahsis davranışlarını uygulamak isterseniz, kendi veritabanı
yönlendiricilerinizi tanımlayabilir ve kurabilirsiniz.

### Veritabanı Yönlendiricileri

Bir veri tabanı Yönlendirici, dört method sağlayan bir sınıftır: Buralar teknik bilgi
çok takılmayın daha aşağıda kodlarla örneklenecektir daha iyi anlarsınız

#### db_for_read \(model, \*\*hints\)

> okuma işlemleri için

Model tipli nesneleri okuma işlemleri için kullanılması gereken veritabanını bildirin

Bir veritabanı işlemi, bir veritabanını seçmede yardımcı olabilecek herhangi bir ilave
bilgi sağlayabilirse, **hints** sözlüğünde sağlanacaktır. Geçerli **hints** ile ilgili
ayrıntılar aşağıda verilmiştir.

Herhangi bir öneri yoksa **None** döndürür.

#### db_for_write \(model, \*\*hints\)

> yazma işlemleri için

Model modelindeki nesnelerin yazımında kullanılması gereken veritabanını bildirir3

Bir veritabanı işlemi, bir veritabanını seçmede yardımcı olabilecek herhangi bir ilave
bilgi sağlayabilirse, **hints** sözlüğünde sağlanacaktır. Geçerli ipuçları ile ilgili
ayrıntılar aşağıda verilmiştir.

Herhangi bir öneri yoksa **None** döndürür.

#### allow_relation \(obj1, obj2, \*\*hints\)

> veri tabanındaki nesne arasındaki ilişkiler için

**Obj1** ve **obj2** arasındaki bir ilişkiye izin verilirse `True` değerini döndürür,

İlişki önlenmeli ise `False` döndürür, `None` ise seçeneği yoktur.

Bu yanlızca bir doğrulama işlemi dir, **foreign** key ve **many to many** İki nesne
arasında bir ilişki olup olmadığının belirlenmesi sağlar.

#### allow_migrate\(db, app_label, model_name=None, \*\*hints\)

> \( migrate \) taşıma işlemleri için

Geçiş işleminin, takma ad \( db \) veritabanı ile veritabanında çalışmasına izin verilip
verilmeyeceğini belirler. İşlemi çalıştırması gerekiyorsa `True`, aksi halde çalışmaması
durumunda `False` veya yönlendiricinin \( router \) fikri yoksa `None` döndürür.

**app_label** konumsal argümanı, taşınan \( migrated yapılan \) uygulamanın etiketidir.

> modelname çoğu taşıma \( migrations \) işlemi tarafından taşınan modelin
> model.\_meta.model_name \(model_name 'in küçük harfli versiyonu\) değerine ayarlanır .

İpuçlarını \( hints \) kullanmadığı sürece, **RunPython** ve **RunSQL** işlemleri için
`None` değerini döndürür.

ipuçları \( hints \) yönlendiriciye ek bilgi iletmek için bazı işlemler tarafından
kullanılır.

Model_name ayarlı olduğunda, ipuçları normalde 'model' anahtarının altındaki model
sınıfını içerir. Tarihsel bir model olabileceğini ve bu nedenle herhangi bir özel
nitelik, yöntem veya yöneticinin olmadığını unutmayın. Sadece \_meta'ya güvenmelisin.

Bu yöntem, belirli bir veritabanında bir modelin kullanılabilirliğini belirlemek için de
kullanılabilir.

`makemigrations` her zaman model değişiklikleri için geçişler oluşturur, ancak
`allow_migrate()` yanlış döndürürse, db için geçiş işlemi gerçekleştirilirken model_name
için yapılan tüm taşıma işlemleri sessizce atlanır. Zaten geçiş götüren modeller için
`allow_migrate()` işlevinin değiştirilmesi, yabancı anahtarların, ek tabloların veya
eksik tabloların kopmasına neden olabilir. Makemigrations, geçiş geçmişini
doğruladığında hiçbir uygulamanın geçiş yapmasına izin verilmeyen veritabanlarını atlar.

Yönelticinin tüm bu yöntemleri sunması gerekmez - bir veya daha fazlasını atlayabilir.
Yöntemlerden biri atlanırsa, Django ilgili denetimi yaparken bu yönlendirici
atlayacaktır.

#### Hints \( İpuçlar\)

Veritabanı yönlendiricisi tarafından alınan ipuçları, hangi veritabanının belirli bir
isteği alması gerektiğine karar vermek için kullanılabilir.

Şu anda, sağlanacak tek ipucu, yürütülmekte olan okuma veya yazma işlemi ile ilişkili
bir nesne örneği. Bu kaydedilen örnek olabilir veya çoktan çoklu ilişkide eklenen bir
örnek olabilir. Bazı durumlarda hiçbir örnek ipucu verilmez. Yöneltici bir örnek ipucu
varlığını denetler ve bu ipucunun yönlendirme davranışını değiştirmek için kullanılıp
kullanılmayacağını belirler.

### Yönlendiricileri Kullanma

Veritabanı yönlendiricileri, `DATABASE_ROUTERS` ayarı kullanılarak yüklenir
**settings.py** de ayarlanması gerekir. Bu ayar, her biri ana yönlendirici
`(django.db.router)` tarafından kullanılmak üzere bir yönlendirici belirterek sınıf
adlarının bir listesini tanımlar.

Ana yönlendirici, veritabanı kullanımını tahsis etmek için Django'nun veritabanı
işlemleri tarafından kullanılır. Bir sorgu hangi veritabanını kullanacağını bilmeye
ihtiyaç duyduğunda, bir model ve bir ipucu \(varsa\) sağlayarak ana yönlendirici
çağırır. Django, daha sonra bir veritabanı önerisi bulunana kadar her yönlendiriciyi
dener. Hiçbir öneri bulunamazsa, ipucu örneğinin geçerli \_state.db dosyasını dener. Bir
ipucu örneği sağlanmazsa veya örnek şu anda veritabanı durumuna sahip değilse, ana
yönlendirici varsayılan veritabanını tahsis edecektir.

#### Settings.py

`DATABASE_ROUTERS = [] # şeklinde olmalı`

Örnek verelim ve bu örneğin veri tabanı ayarları nasıl olacak bakalım;

```python
DATABASES = {
    'default': {}, # varsayılan bir veri tabanı kullanmıyoruz bu yüzden boş
    'auth_db': {
        'NAME': 'auth_db',
        'ENGINE': 'django.db.backends.mysql',
        'USER': 'mysql_user',
        'PASSWORD': 'swordfish',
    },
    'primary': {
        'NAME': 'primary',
        'ENGINE': 'django.db.backends.mysql',
        'USER': 'mysql_user',
        'PASSWORD': 'spam',
    },
    'replica1': {
        'NAME': 'replica1',
        'ENGINE': 'django.db.backends.mysql',
        'USER': 'mysql_user',
        'PASSWORD': 'eggs',
    },
    'replica2': {
        'NAME': 'replica2',
        'ENGINE': 'django.db.backends.mysql',
        'USER': 'mysql_user',
        'PASSWORD': 'bacon',
    },
}
```

Şimdi rota ayarlamamız gerekiyor. İlk önce, auth uygulaması için sorgular gönderilmesini
bilen bir router'ı **auth_db** için ayarlayacağız.

```python
class AuthRouter(object):
# AuthRouter isminde sadece auth_db kullanma ismini verdiğimiz veri tabanı rauterini ayarlayacağız
# yani sadece auth_db isimli veri tabanı içindir bu
    """
     Tüm veritabanı işlemlerini kontrol eden yönlendirici
     kimlik doğrulama uygulamasının modeldir.
    """
    def db_for_read(self, model, **hints):
        """
        auth_db'ye giden yetkili modelleri (auth models) Okumaya çalışır.
        """
        if model._meta.app_label == 'auth':
            return 'auth_db'
        return None
    def db_for_write(self, model, **hints):
        """
        Attempts to write auth models go to auth_db.
        """
        if model._meta.app_label == 'auth':
            return 'auth_db'
        return None
    def allow_relation(self, obj1, obj2, **hints):
        """
        Yetkilendirme uygulamasındaki bir model dahil edilirse ilişkilere izin ver.
        iki nesne de auth a ait ise ilişkiye izin veriyor
        """
        if obj1._meta.app_label == 'auth' or \
           obj2._meta.app_label == 'auth':
           return True
        return None
    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """
        Auth uygulamasının yalnızca 'auth_db' veritabanında göründüğünden emin olun.
        """
        if app_label == 'auth':
            return db == 'auth_db'
        return None
```

Ayrıca diğer tüm uygulamaları birincil / çoğaltma yapılandırmasına gönderen bir
yönlendirici istiyoruz ve aşağıdakileri okumak için rasgele bir kopya seçiyor:

```python
import random
class PrimaryReplicaRouter(object):
    def db_for_read(self, model, **hints):
        """
        Okumalar, rasgele seçilen kopyaya gidiyor.
        """
        return random.choice(['replica1', 'replica2'])
    def db_for_write(self, model, **hints):
        """
        Yazmak için daima primary'w gidiyor.
        """
        return 'primary'
    def allow_relation(self, obj1, obj2, **hints):
        """
        Her iki nesne primary/replica havuzunda bulunuyorsa,
        nesneler arasındaki ilişkilere izin verilir.
        """
        db_list = ('primary', 'replica1', 'replica2')
        if obj1._state.db in db_list and obj2._state.db in db_list:
            return True
        return None
    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """
        Tüm auth olmayan modeller bu havuza girer.
        """
        return True
```

Diğer veri tabanlarını içinde rauter tanımladığımıza göre son olarak, ayarlar dosyasında
aşağıdakileri ekliyebiliriz \(yönlendiricilerin tanımlandığı modüllere / noktalara
gerçek Python yolunu değiştirerek\):

```python
DATABASE_ROUTERS = ['path.to.AuthRouter', 'path.to.PrimaryReplicaRouter']
```

sınıf isimlerini veriyoruz burası önem li çünkü yanlış girerseniz django sınıf yolunu
bulamaz \(yönlendiricilerin tanımlandığı modüllere / noktalara gerçek Python yolunu
değiştirerek\)yazın

## Veritabanı El İle Seçme

Django, kodunuzda veritabanı kullanımı üzerinde tam kontrol sahibi olmanızı sağlayan bir
API de sağlar. Elle belirlenen bir veritabanı tahsisi, bir yönlendirici tarafından
ayrılan bir veritabanına göre öncelik taşır.

### Bir QuerySet İçin Bir Veritabanı El İle Seçme

Bunun için `using()` fonksiyonunu kullancağız, örnek olarak

```python
>>> # bu kod varsayılan olarak ayarladığınız veri tabanından nesne çeker
>>> Author.objects.all()
>>> # ve bu
>>> Author.objects.using('default').all()
>>> # ama bu other olarak ayarlanan veri tabanından veri çeker
>>> Author.objects.using('other').all()
```

veri tabanlarına yeni veriyi kayıt etmek içinde using\(\) kullanılır örnek

```python
my_object.save(using='legacy_users')
# bu kod aldığı veriyi "legacy_users" adlı veri tabanına kayıt eder
```

silme işlemi için yine aynı

```python
u = User.objects.using('legacy_users').get(username='fred')
u.delete() # `legacy_users` veri tabanındaki veriyi siler
```

## Birden Fazla Veri Tabanı İçin Admin Arayüzü Ayarı

```python
class MultiDBModelAdmin(admin.ModelAdmin):
    # Alternatif veritabanı adı için kullanışlı bir sabit.
    using = 'other' # kullanılacak olan veri tabanı ismi
    def save_model(self, request, obj, form, change):
        # django ya kayıt yapılacak nesne veri tabanının 'other' olduğunu söyler
        obj.save(using=self.using)
    def delete_model(self, request, obj):
        #djangoya silme işlemi için 'other' veri tabanı olduğunu söyler
        obj.delete(using=self.using)
    def get_queryset(self, request):
        #Django'ya 'diğer' veritabanındaki nesneleri aramasını söyler.
        return super(MultiDBModelAdmin, self).get_queryset(request).using(self.using)
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        # Django'ya bir Sorgu kullanarak ForeignKey widget'lerini yerleştirmesini söyler
        # 'other' veri tabanında tabikide
        return super(MultiDBModelAdmin, self).formfield_for_foreignkey(db_field, request, using=self.using, **kwargs)
    def formfield_for_manytomany(self, db_field, request, **kwargs):
        #Django'ya, 'other' veritabanında bir sorgu kullanarak ManyToMany
        # widget'lerini doldurmasını söyle.
        return super(MultiDBModelAdmin, self).formfield_for_manytomany(db_field, request, using=self.using, **kwargs)
```

```python
class MultiDBTabularInline(admin.TabularInline):
    using = 'other'
    def get_queryset(self, request):
        # Django'ya 'other' veritabanındaki satıriçi nesneleri aramasını söyle.
        return super(MultiDBTabularInline, self).get_queryset(request).using(self.using)
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        # Django'ya, 'other' veritabanında bir sorgu kullanarak
        # ForeignKey widget'lerini yerleştirmesini söyle.
        return super(MultiDBTabularInline, self).formfield_for_foreignkey(db_field, request, using=self.using, **kwargs)
    def formfield_for_manytomany(self, db_field, request, **kwargs):
        # Django'ya, "other" veritabanında bir sorgu kullanarak
        # ManyToMany widget'lerini doldurmasını söyle.
        return super(MultiDBTabularInline, self).formfield_for_manytomany(db_field, request, using=self.using, **kwargs)
```

yine admin py de yaptığımız sınıfları register ile yolluyoruz

```python
from django.contrib import admin
# Belirli modellerle kullanmak için multi-db admin nesnelerini özelleştirme
class BookInline(MultiDBTabularInline):
    model = Book
class PublisherAdmin(MultiDBModelAdmin):
    inlines = [BookInline]
admin.site.register(Author, MultiDBModelAdmin)
admin.site.register(Publisher, PublisherAdmin)
othersite = admin.AdminSite('othersite')
othersite.register(Publisher, MultiDBModelAdmin)
```

#### [Source](https://docs.djangoproject.com/en/1.11/topics/db/multi-db/)
