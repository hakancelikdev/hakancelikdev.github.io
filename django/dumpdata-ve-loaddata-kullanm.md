# Dumpdata Ve Loaddata Kullanımı

## Dumpdata
> [Ana kaynak | djangoproject.com/en/2.1/](https://docs.djangoproject.com/en/2.1/ref/django-admin/#dumpdata)

**Dumdata** django'da varsayılan komutlar arasında bulunan ve **python manage.py** şeklinde erişebileceğimiz bir komuttur amacı ise belirlenen format ile veri tabanınızın yedeğini ( fixture ) sını almaktır eğer isterseniz bu aldığınız yedeği **loaddata** komutunu kullanarak yeni açmış olduğunuz veri tabanınıza yazabilirsiniz, **dumpdata** komutunun kodlarını merak edenler vermiş olduğum linki tıklayarak inceleyebilir 1.elden daha detaylı bilgiye ulaşabilir [dumpdata.py](https://github.com/django/django/blob/master/django/core/management/commands/dumpdata.py)

### Kullanımı
`python manage.py dumpdata [app_label[.ModelName] [app_label[.ModelName] ...]]` şeklinde genel bir kullanımı vardır

### Parametreler
- `--all -a` bu parametreler kullanıldığında django temel yöneticisini kullanarak bütün modelleri depolar
- `--format FORMAT` format parametresi ile depolanma sırasında hangi formatı kullanması gerektiğini girebiliriz varsayılan format **json** olup [üç tane](https://docs.djangoproject.com/en/2.1/topics/serialization/#serialization-formats) format çeşidi var bunlar **xlm, json, yaml**
- `--indent INDENT` Çıktının serileştirme ( Serialization )biçimini belirtir. Varsayılan olarak JSON. Desteklenen formatlar, Seri hale getirme formatlarında listelenir.
- `--exclude EXCLUDE, -e EXCLUDE` Yedek alma sırasında, bazı yerleri yedek almak istemeyebiliriz bu parametre bu işlem için var
- `--database DATABASE` Birden fazla veri tabanı kullananların imdadına yetişen bir parametre olup hangi veri tabanını kullanarak yedek alması gerektiğini belirtiriz varsayılan olarak **default** veri tabanını alır
- `--natural-foreign` Herhangi bir yabancı anahtarı (foreign key) ve yöntemi tanımlayan türdeki nesnelerle çoktan çoğa ilişkiyi (many-to-many) serileştirmek (serialize) için `natural_key()` model yöntemini kullanır. Eğer contrib.auth İzin nesnesini veya contrib.contenttypes ContentType nesnelerini damping ediyorsanız, muhtemelen bu bayrağı kullanmalısınız. Bu ve bir sonraki seçenek hakkında daha fazla ayrıntı için [doğal anahtarların](https://docs.djangoproject.com/en/2.1/topics/serialization/#topics-serialization-natural-keys) belgelerine bakın.
- `--natural-primary` Serileştirme sırasında hesaplanabildiğinden, bu nesnenin serileştirilmiş verilerindeki birincil anahtarı çıkarır.
- `--pks PRIMARY_KEYS` Yalnızca virgülle ayrılmış birincil anahtarlar (primary keys) listesi tarafından belirtilen nesneleri çıkarır. Bu, yalnızca bir model dökülürken (dumping) kullanılabilir. Varsayılan olarak, modelin tüm kayıtları çıktıdır.
- `--output OUTPUT, -o OUTPUT` Serileştirilmiş verileri yazmak için bir dosya belirtir. Varsayılan olarak, veriler standart çıktıya gider. `> output.json` gibi de kullanılabilir

### Örnek Kullanım
- `python manage.py dumpdata output.json --format json --database default`
Model ismi belirtmeden, bundan dolayı seçilen veri tabanını tamamen alır

- `python manage.py dumpdata auth output.json --format json --database default`
Sadece auth modelini alır

- `python manage.py dumpdata auth.user output.json --format json --database default`
Sadece auth modelindeki user bölümünü alır

- `python manage.py dumpdata --exclude admin  output.json --format json --database default`
admin harici bütün verileri alır

- `python manage.py dumpdata mymodel output.json --format json --database myseconddb`
Kullanmakta olduğum ikinici veri tabanı olan myseconddb isimli veri tabanımda bulunan mymodel adındaki verileri alır

### Uyarı
Dumdata komutu sırasında `RelatedObjectDoesNotExist` bu hatayı alırsanız bu adrese bir göz atın [https://code.djangoproject.com/ticket/28972](https://code.djangoproject.com/ticket/28972) ve `python manage.py  dumpdata -o output.json --format json` şekinde kullanın sorun çözülecektir.

## Loaddata
Loaddata komutu dumpdata ile oluşturduğumuz veriyi tekrar yeni oluşturduğumuz verii tabanına yüklememizi sağlar, loaddata'nın kodlarının adresi [loaddata.py](https://github.com/django/django/blob/master/django/core/management/commands/loaddata.py)

### Kullanımı
Genel kullanım `python manage.py loaddata fixture [fixture ...]` burdaki **fixture** **dumpdata** ile oluşturduğumuz dosyadır

### Parametreleri
- `--database DATABASE` yukarıdaki gibi veri tabanı seçebiliyoruz varsayılan olarak `default` veri tabanı ayarlanmıştır

- `--ignorenonexistent, -i`
alan ve modelleri görmezden (field and model) getirtebiliyoruz

- `--app APP_LABEL`
Belirli bir app ( uygulamamızın ) yüklenmesini sağlayabiliyoruz

- `--format FORMAT`
Dumpdata sonucu oluşturduğumuz dosya formatını giriyoruz

- `--exclude EXCLUDE, -e EXCLUDE`
Yine aynı amaç için yükleme esnasında uygulama veya model dışlamak için kullanılıyor

### Örnek Kullanım
- `python manage.py  loaddata mydata.json --format json`

- `python manage.py loaddata mydata.json --database mydb`

- `python manage.py loaddata mydata.json --format xml --database default`

- `python manage.py loaddata mydata.json --exclude auth --database default`

## Ne Zaman Kullanmalıyım
Bazen geliştirme sırasında **models.py** dosyamızda çok fazla değişiklikler yapabiliyoruz bu değişiklikleri migrate sırasında istediğimiz gibi gitmediğinde, normalde bir veri tabanı kullanıyorken birden fazla veri tabanı kullanma kararı aldığımızda eski verileri yeniden oluşturduğumuz 0 klometre veri tabanlarımıza eski verileri bu iki komut sayesinde hızla aktarabiliyoruz ben bu iki sorundan dolayı kullanmıştım.

## Sürüm
Django 2.1
