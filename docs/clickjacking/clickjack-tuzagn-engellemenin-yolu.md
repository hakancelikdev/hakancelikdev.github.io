# Clickjack Tuzagını Engellemenin Yolu

Araştırdığım zaman bu açığın bir kaç satır javascript kodu ile de engellenebildiğini ve
sağlıklı olmadığını okudum.

## X-Frame-Options Nedir?

Kendileri HTTP response header'i olup, **X-Frame-Options** Bir tarayıcının `<frame>`,
`<iframe>`, `<embed>` veya `<object>` içinde bir sayfa oluşturmasına izin verilip
verilmeyeceğini belirtmek için bu HTTP yanıt başlığı \(X-Frame-Options\) kullanılabilir.
Siteler, içeriğinin başka sitelere gömülmemesini sağlayarak, tıklatma saldırılarını \(
clickjack \) önlemek için bunu kullanır. Kısacası bu tuzağı engellemenın yolu
**X-Frame-Options**'dan geçer, peki ama nasıl?

**X-Frame-Options** için 3 olası sonuç vardır.

```markup
X-Frame-Options: deny
X-Frame-Options: sameorigin
X-Frame-Options: allow-from https://example.com/
```

- **deny** bütün alan adlarına izin verir
- **sameorigin** yalnızca sayfanın kendisi ile aynı kökene sahip bir çerçevede olduğunda
  izin verir, bundan dolayı kullanımı pek tavsiye edilmez, birden fazla siteye istemeden
  izin vermiş olabilirsiniz.
- **allow-from** [https://example.com/](https://example.com/) sadece example.com
  sitesine izin verir.

> Not; Html dosyamızda `<head> </head>` etiketleri arasına
> `<meta http-equiv="X-Frame-Options" content="deny">` yazarak engellenemez.

Örnek olarak stackoverflow'da bir arkadaşın isyanına bakabilirsiniz,
[x-frame-options-is-not-working-in-meta-tag](https://stackoverflow.com/questions/45454390/x-frame-options-is-not-working-in-meta-tag)
