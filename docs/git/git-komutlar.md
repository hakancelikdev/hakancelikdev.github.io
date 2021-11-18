# Git Komutları

Git'i kurduk konfigürasyon ayarlarımızı yaptık şimdi git komutlarını öğrenme zamanı
geldi.

**Hatırlatma**

Tüm yerel depolar için kullanıcı bilgilerini yapılandırın

```bash
git config --global user.name "name"
```

Tüm yerel depolar için eposta bilgilerini yapılandırın

```bash
git config --global user.email "email address"
```

bu bilgiler git tarafından her değişiklik yaptığınızda yaptığınız değişiklikler ve tarih
ile birlikte tutulurlar.

## Inıt

Yeni bir repo \( repository \) oluşturmak için `init` başlatıcı komutunu kullanın.

```bash
git init
```

veya

```bash
git init proje-ismi
```

## Clone

Uzak bir git sunucusundan projeyi ve tüm sürüm geçmişini indirmek için `clone` komutunu
kullanın.

```bash
git clone uzak_repo_adresi
```

**Github için örnek veriyorum**

```bash
git clone https://github.com/{kullanıcı_adınız}/{repo_isminiz}.git
```

## Add

https://git-scm.com/docs/git-add

Değişiklik yaptığınız dosyaları staged bölümüne almanızı sağlar.

İlk argümanı olan `pathspec`'i dosya yolu ( path ) veya glob olarak verebilirsiniz.

```bash
git add foo/bar/file.ex
```

```bash
git add *.py
```

böyle yazarak bütün python dosyalarında yaptığınız değişiklikleri staged bölümüne
alabilirsiniz. `pathspec` argümanına `.` olarak verirseniz değişiklik olan bütün
dosyaları alır.

```bash
git add -p
```

Yaptığınız değişikliklere bakarak ( diff'i gösterilir ) onay sonrası o değişikliği
staged bölümüne almanızı sağlar.

## Commit

https://git-scm.com/docs/git-commit

Staged bölgesinde bulunan değişiklikleri bir mesajı ile birlikte kayıt etmenizi sağlar.

`git commit -m "commit_mesajınız"`

eğer değişiklikleri bir önceki commit üzerine yazmak istiyorsanız ( aslında tam olarak
üzerine yazmaz yeni bir commit atar )

`git commit --amend`

`--amend` argümanı kullandığınızda `-m` argümanını kullanmazsanız bir önceki commit
mesajınız ne ise onu alır, `-m` kullanır ve commit mesajı girerseniz, teoride bir önceki
commit mesajını düzenlemiş olursunuz.

`git commit --amend -m "messages"`

Eğer [git-hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) kullanıyor
iseniz ( veya git-hooks'u kullanan bir teknoloji kullanıyor iseniz, örneğin
[pre-commit](https://pre-commit.com/))

`--no-verify` argümanı eğer hookları es geçerek commit atmanızı sağlar.

## Status

Durum kontrolu için, size o anki durumunuzu gösterir, add mi yoksa commit komutunu mu
çalıştırmanız gerektiğini burdan bakarak anlayabilirsiniz ve değişen dosyalarıda
listeler

```bash
git status
```

## Log

Şuana kadar olan bütün değişiklikleri listelemek ve incelemek içindir.

```bash
git log
```

burda atılan commitlere ait

- Commit'in kim tarafından atıldığı
- Ne zaman atıldığı
- Commit mesajı
- Commit hash değeri

şeklinde çıktı alınır.

## Reset

Bir sorun yaşandığında eski bir sürüme geri gelmek için kullanılır, git log sonrası
dönmek istediğiniz commit hash değerini kopyalar ve reset ile o sürüme dönersiniz.

```bash
git reset commit_hash_değeri
```

Değişiklikleri yerel olarak koruyarak, commit sonrasında verilen tüm commitleri geri
alır.

```bash
git reset --hard commit_hash_değeri
```

Tüm geçmişi iptal eder ve belirtilen commit'i zamanına döner.

## Branch

Dalları listelemek yeni dal oluşturmak ve silmek için kullanılır.

### Dalları listelemek

```bash
git branch
```

### Yeni Dal Oluşturmak

```bash
git branch yeni_dalınızın_ismi
```

### Yeni Dal Oluştur ve Ona geçiş Yap

```bash
git checkout -b yeni_dalınızın_ismi
```

### Dal Silmek

```bash
git branch -d dal_ismi
```

## Checkout

Bir daldan diğer bir dala geçiş yapmanızı sağlar, master dalındasınız ve `yeni_dal` diye
bir dalınız var ona geçmek istiyorsanız.

```bash
git checkout yeni_dal
```

## Merge

**yeni_dal** da yaptığınız değişiklikleri master dalı ile birleştirmek istiyorsanız.

```bash
git checkout master
```

master dalına geçtim

```bash
git merge yeni_dal
```

**yeni_dal** daki değişiklikleri master ile birleştirdim.

veyahut

```bash
git pull origin master
```

yazarak bulunduğunuz dala master dalındaki değişiklikleri çekebilirsiniz.

## Pull

Uzak sunucuda bulunan repodaki değişiklikleri almanızı \( sekronize \) sağlar

```bash
git pull
```

veya

```bash
git pull origin master
```

## Push

Kendi localinizde \( bilgisayarınızda \) yaptığınız değişiklikleri uzak sunucuda bulunan
repoya göndermenizi sağlar.

```bash
git push
```

eğer gönderdiğiniz değişiklikler uzak sunucudaki ile çakışır size push yapmadan önce
pull yapmanız gerektiği ile ilgili bir uyarı mesajı verirsee git ve siz yinede
yaptığınız değişiklikleri uzak sunucudaki silinse bile yapmak istiyorsanız.

```bash
git push -f
```

burdaki **-f force** anlamına gelir.

## Remote

https://git-scm.com/docs/git-remote

Git reponuzdaki diğer repoları yönetmenizi sağlar.

Bu şu demek birden fazla git reposuna bağlı şekilde çalışabilirsiniz, bunlardan biri
orginal repo diğeri ise upstream repo olabilir. Upstream repo sizin forkladığınız
repodur, bu sayede orginal repodaki yeni güncellemeleri kendi fork'unuza çekebilir ve
güncel bir şekilde geliştirmeye devam edebilirsiniz.

`git remote -v` yazarak git reponuzda bağlı olan repoların isimlerini ve adreslerini
görebilirsiniz.

`git remote add {remote name} {repo adresi}` örneğin;
`git remote add upstream https://github.com/user/repo.git`

`git remote remove {remote name}` yazarak eklenen repoları silebilirsiniz.

## Rebase

https://git-scm.com/docs/git-rebase

Daha önceden atmış olduğunuz commit'i git history'i düzenleyerek en üste taşımanızı
sağlar.

`git rebase` bulunduğunuz branch'da ( dal ) atmış olduğunuz en son commit'i en üste
taşımanızı sağlar. Bunu ne zaman kullanabiliriz derseniz, `git pull` sonrası yeni
commitleri reponuza çektikten sonra sizin uzan repoya göndermediğiniz değişiklikleri en
üste taşımaki için kullanabilirsiniz.

## Gitignore Dosyası

Gitignore dosyası bizim bazı git tarafından izlenmesini istemediğimiz dosyalar olabilir
bu dosyaları **.gitignore** dosyası yardımı ile git'e söylüyoruz.

Bu adreste programlama dilleri için gitignore dosyaları mevcut siz projelerinizde hangi
dili kullanıyorsanız bu adresten esinlenerek gitignore dosyanızı oluşturabilir git'in
takip etmesini istemediniz dosyalarınız kontrol altına alabilirsiniz.

[https://github.com/github/gitignore](https://github.com/github/gitignore)
