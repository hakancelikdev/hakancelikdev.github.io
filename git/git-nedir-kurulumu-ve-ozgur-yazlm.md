# Git Nedir Kurulumu ve Özgür Yazılım

## Git Nedir ?

Git, küçük projelerden çok büyük projelere kadar her şeyi hızlı ve verimli bir şekilde ele almak için tasarlanmış ücretsiz ve açık kaynaklı dağıtık sürüm kontrol sistemidir. \( version control system \)

Git linux çekirdeğini yazan [Linus torvalds](https://www.google.com/search?q=linus+torvalds) tarafından yazılmıştır.

Linus torvalds'ı daha yakından tanımanız için bir kaç tane video adresi bırakıyorum.

* [Github Hesabı](https://github.com/torvalds)
* [TED konuşması \| The mind behind Linux - Linus Torvalds](https://www.youtube.com/watch?v=o8NPllzkFhE)
* [Tech Talk: Linus Torvalds on git](https://www.youtube.com/watch?v=4XpnKHJAok8&t=2001s)

## Sürüm Kontrol Sistemi Nedir ?

Bir sürüm kontrol sistemi veya VCS, insanlar ve ekipler projeler üzerinde birlikte çalıştıkça değişikliklerin geçmişini izler. Proje geliştikçe, ekipler testler yapabilir, hataları giderebilir ve herhangi bir sürümün herhangi bir zamanda kurtarılabileceğine güvenerek yeni koda katkıda bulunabilir. Geliştiriciler şunları bulmak için proje geçmişini inceleyebilir:

* Hangi değişiklikler yapıldı?
* Değişiklikleri kim yaptı?
* Değişiklikler ne zaman yapıldı?
* Neden değişikliklere ihtiyaç duyuldu?

## Dağıtık Sürüm Kontrol Sistemi Nedir ?

**DVCS** olarak geçen bu kısaltmada olay şudur, git projeye yönelik dosyaları tek bir yerde, merkezi olmasına izin vermez git ile çalışan insanlar herhangi bir bağlantıya ihtiyaç duymadan bütün geçmişi ellerinde tutarlar ve uzak bir sunucu yardımı ile sekronize edebilirler. Merkezi olmamasından dolayı bu olaya dağıtık denir.

## Neden Git ?

Git tek sürüm kontrol sistemi değildir, git gibi sürüm kontrol sistemleri vardır merkezi veya dağıtık olacak şekilde bile.

Git [stackoverflow](https://insights.stackoverflow.com/survey/2018#work-_-version-control) verilerine göre yazılımcıların 87.2%'i git'i kullanıyor bu da onu en çok kullanılan VCS yapıyor.

## Neden İhtiyaç Duyuyoruz ?

* Bir şirkette işe başladığınızı ve 5 kişinin çalıştığı bir projede görev aldığınızı düşünün bütün çalışanlar aynı şehirde bile değil fakat aynı projede geliştirme yapmanız ve işlerin karışmaması gerek işte burda git devreye giriyor.
* Tek başınıza bir proje yapıyorsunuz ve bittiğine eminsiniz bir kaç gün sonra bir hata veya eksik bir şey fark ediyorsunuz sonra eski proje dosyalarını kaybetmemek için bir yere yedeğini alıyorsunuz ve diğeri ile devam ediyorsunuz ve bu devam ediyor günün sonunda elinizde şöyle bir çalışma dizini olabilir.

  * Bu son
  * Bu sefer kesin bitti
  * Bütün hatalar giderildi işlem bitti
  * Bittiğine eminim

  isimlerinde bir sürü proje yedeğiniz olabilir bu noktadada git devreye giriyor.

## Kimler Kullanabilir ?

Git yazılım sektöründe duyulmuş ve sürekli kullanılan bir teknoloji olsa bile git'i bilgisayar kullanan herkes kullanabilir, not alırken, resimlerinizi saklarken, verilerinizi saklarken, çizim yaparken vs.

Yaptığınız değişiklikleri görmek bunları saklamak, yönetmek ve istediğiniz zaman geçmişe dönmek istiyorsanız git kullanmalısınız.

## Açık Kaynağın Önemi ?

### Richard Stallman Kimdir ?

Richard Matthew Stallman \(İnternet ortamında kullanılan kısaltması **rms**; d. 16 Mart 1953\), ABD'li özgür yazılım aktivisti, sistem uzmanı ve yazılım geliştiricisi. [GNU Projesi](https://www.gnu.org/home.en.html) ve Özgür Yazılım Vakfı'nın kurucusudur.

* [TED \| Free software, free society: Richard Stallman at TEDxGeneva 2014](https://www.youtube.com/watch?v=Ag1AKIl_2GM)

### Özgür Yazılım \( Free Software \)

[Özgür Yazılım Nedir?](https://www.gnu.org/philosophy/free-sw.html)

Kendimce bir kaç şey söylemek istiyorum, genel olarak teknolojiyi çok iyi yerlere getirdiklerine inanılan ve toplumun hayran olduğu bazı isimler var.Bu insanlar özgür yazılımdan ve toplumdan faydalanmış, fakat topluma herhangi bir fayda sağlamadan güzel, şık tasarımlar elde etmiş, şirketler kurmuşlardır. Ayrıca bu tasarım ve şirketlerle toplumun gözünü boyayarak kendilerine saygı duyulmasını, insanların onlara özenmesini sağlıyorlar. Bununla birlikte asıl gerçek saygıyı ve özenmeyi özgür yazılım savunucuları hak ediyor çünkü teknolojinin bu kadar hızlı gelişmesini, insanların bir bilgiyi çok hızlı öğrenmesini sağlayan onlardır.

Örnek vermek gerekirse ben sizden taş ve sopa istesem, siz bunu bana getirseniz ben bunları kullanarak tekerlek üretsem ve sonra satış yapsam ama kimseye nasıl ürettiğimi söylemesem güzel tasarımlı, şık kullanışlı lastikleri satsam o toplumda teknoloji ilerler mi ? birlikten güç doğar boşuna söylenmiş bir cümle değil.

Yapacağınız projeleri açık kaynak veya özgür yaparsanız diğer insanlar sizlerin yaptıklarına bakarak ilham alabilir, yeni şeyler öğrenebilir, katkı göndererek gelişiminize yardımcı olabilir, deneyim kazanırsınız, referanslarınız olur cv'nize yazacağınız projeleriniz olur, bildiğinizi söylediğiniz teknolojileri kanıtlamış olursunuz bu yüzden işe alım süreçleriniz de daha hızlı olur.

## Kurulum

### Mac OS X'e Kurulum

Git'i Mac'e kurmanın birkaç yolu var. Aslında, **XCode**'u yüklediyseniz \( veya Komut Satırı Araçları \), Git zaten yüklenmiş olabilir. Öğrenmek için bir terminal açın ve `git --version` yazın.

```text
$ git --version
git version 2.7.0 (Apple Git-66)
```

Yüklü değil ise

* En son sürüm'den [Mac için Git'i indirin](https://sourceforge.net/projects/git-osx-installer/files/)
* Kurulum işlemi için talimatları izleyin.
* Terminali açın ve başarılı bir şekilde kurulduğundan emin olun `git --version`.

```text
$ git --version
git version 2.9.2
```

ve konfigürasyon ayarlarını yapın aşağıdaki örneği referans alarak.

```text
$ git config --global user.name "Hakan Çelik"
$ git config --global user.email "hakancelik96@outlook.com"
```

### Windows'a Kurulum

[https://gitforwindows.org/](https://gitforwindows.org/) adresinden indirme işlemini yapın bütün ayarlar önerilenlerde olacak şekilde kurulumu tamamlayın, arama yerine git yazarak **Git Bash**'i açın ve konfigürasyonu yazın.

```text
$ git config --global user.name "Hakan Çelik"
$ git config --global user.email "hakancelik96@outlook.com"
```

### Linux'a Kurulum

#### Debian / Ubuntu \(apt-get\)

Git paketleri apt tarafından tanımlıdır, shell'inizden `apt-get`'i kullanarak indirebilirsiniz

```text
$ sudo apt-get update
$ sudo apt-get install git
```

konsolunuza `git --version` yazarak yüklemeyi doğrulayın:

```text
$ git --version
git version 2.9.2
```

ve konfigürasyon ayarlarını yapın

```text
$ git config --global user.name "Hakan Çelik"
$ git config --global user.email "hakancelik96@outlook.com"
```

#### Fedora \(dnf/yum\)

Git paketleri **yum** ve **dnf** de tanımlıdır. Shell'inizden git'i dnf'i kullanarak indirebilirsiniz \( Fedora'nın daha eski sürümlerinde yum'ı \)

```text
sudo dnf install git
```

veya

```text
sudo yum install git
```

kurulumun başarılı olup olmadıgını kontrol edelim.

```text
$ git --version
git version 2.9.2
```

Konfigürasyon ayarlarını yapalım

```text
$ git config --global user.name "Hakan Çelik"
$ git config --global user.email "hakancelik96@outlook.com"
```

## EK Kaynaklar

* [https://www.atlassian.com/git/tutorials](https://www.atlassian.com/git/tutorials)
* [https://try.github.io/](https://try.github.io/)
* [https://www.youtube.com/watch?v=rWG70T7fePg&list=PLPrHLaayVkhnNstGIzQcxxnj6VYvsHBH](https://www.youtube.com/watch?v=rWG70T7fePg&list=PLPrHLaayVkhnNstGIzQcxxnj6VYvsHBH)

