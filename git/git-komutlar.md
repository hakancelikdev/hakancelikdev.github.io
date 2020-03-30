# git-komutlar

Git'i kurduk konfigürasyon ayarlarımızı yaptık şimdi git komutlarını öğrenme zamanı geldi.

**Hatırlatma**

Tüm yerel depolar için kullanıcı bilgilerini yapılandırın

`$ git config --global user.name "name"`

Tüm yerel depolar için eposta bilgilerini yapılandırın

`$ git config --global user.email "email address"`

bu bilgiler git tarafından her değişiklik yaptığınızda yaptığınız değişiklikler ve tarih ile birlikte tutulurlar.

## Inıt

Yeni bir repo \( repository \) oluşturmak için `init` başlatıcı komutunu kullanın.

`git init` veya `git init proje-ismi`

## Clone

Uzak bir git sunucusundan projeyi ve tüm sürüm geçmişini indirmek için `clone` komutunu kullanın.

`git clone url`

**Github için örnek veriyorum**

`git clone https://github.com/{kullanıcı_adınız}/{repo_isminiz}.git`

## Add

Değiştirilmiş dosyaları almak için kullanılır.

`git add dosya_ismi.formatı`

Değiştirilmiş bütün dosyaları almak için.

`git add .`

## Commit

Yaptığınız değişikliği commit mesajı ile birlikte kayıt etmenizi sağlar.

`git commit -m "commit_mesajınız"`

## Status

Durum kontrolu için, size o anki durumunuzu gösterir, add mi yoksa commit komutunu mu çalıştırmanız gerektiğini burdan bakarak anlayabilirsiniz ve değişen dosyalarıda listeler

`git status`

## Log

Şuana kadar olan bütün değişiklikleri listelemek ve incelemek içindir.

`git log`

burda atılan commitlere ait

* Commit'in kim tarafından atıldığı
* Ne zaman atıldığı
* Commit mesajı
* Commit hash değeri

şeklinde çıktı alınır.

## Reset

Bir sorun yaşandığında eski bir sürüme geri gelmek için kullanılır, git log sonrası dönmek istediğiniz commit hash değerini kopyalar ve reset ile o sürüme dönersiniz.

`git reset commit_hash_değeri`

Değişiklikleri yerel olarak koruyarak, commit sonrasında verilen tüm commitleri geri alır.

`git reset --hard commit_hash_değeri`

Tüm geçmişi iptal eder ve belirtilen commit'i zamanına döner.

## Branch

Dalları listelemek yeni dal oluşturmak ve silmek için kullanılır.

### Dalları listelemek

`git branch`

### Yeni Dal Oluşturmak

`git branch yeni_dalınızın_ismi`

### Dal Silmek

`git branch -d dal_ismi`

## Checkout

Bir daldan diğer bir dala geçiş yapmanızı sağlar, master dalındasınız ve `yeni_dal` diye bir dalınız var ona geçmek istiyorsanız.

`git checkout yeni_dal`

## Merge

`yeni_dal` da yaptığınız değişiklikleri master dalı ile birleştirmek istiyorsanız.

`git checkout master` master dalına geçtim

`git merge yeni_dal` yeni\_dal daki değişiklikleri master ile birleştirdim.

## Pull

`clone` sonrası uzak sunucuda bulunan repodaki değişiklikleri almanıza \( sekronize \) etmenizi sağlar

## Push

Kendi localinizde \( bilgisayarınızda \) yaptığınız değişiklikleri uzak sunucuda bulunan repoya göndermenizi sağlar.

`git push`

## Gitignore Dosyası

Gitignore dosyası bizim bazı git tarafından izlenmesini istemediğimiz dosyalar olabilir bu dosyaları `.gitignore` dosyası yardımı ile git'e söylüyoruz.

Bu adreste programlama dilleri için gitignore dosyaları mevcut siz projelerinizde hangi dili kullanıyorsanız bu adresten esinlenerek gitignore dosyanızı oluşturabilir git'in takip etmesini istemediniz dosyalarınız kontrol altına alabilirsiniz.

[https://github.com/github/gitignore](https://github.com/github/gitignore)

