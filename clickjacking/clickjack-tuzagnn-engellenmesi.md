# Clickjack Tuzagının Engellenmesi

## Apache Yapılandırması

Apache'yi tüm sayfalara X-Frame-Options üstbilgisini gönderecek şekilde yapılandırmak için bunu sitenizin yapılandırmasına ekleyin:

* `Header always set X-Frame-Options "sameorigin"`
* `Header set X-Frame-Options "deny"`
* `Header set X-Frame-Options "allow-from https://example.com/"`

## Nginx Yapılandırması

Nginx'i X-Frame-Options başlığını gönderecek şekilde yapılandırmak için bunu http, sunucu veya konum yapılandırmanıza ekleyin

`add_header X-Frame-Options sameorigin`

## IIS Yapılandırması

IIS'yi X-Frame-Options başlığını gönderecek şekilde yapılandırmak için bunu sitenizin Web.config dosyasına ekleyin

```markup
<system.webServer>
  ...

  <httpProtocol>
    <customHeaders>
      <add name="X-Frame-Options" value="sameorigin" />
    </customHeaders>
  </httpProtocol>

  ...
</system.webServer>
```

## HAProxySection Yapılandırması

HAProxy'i X-Frame-Options üstbilgisini gönderecek şekilde yapılandırmak için bunu ön-uç \(front-end\), dinleme\(listen\) veya arka uç \(backend \) yapılandırmasına ekleyin.

* `rspadd X-Frame-Options:\ sameorigin`

Alternatif olarak, daha yeni sürümlerde:

* `http-response set-header X-Frame-Options sameorigin`

Konu ile alakalı başka bir yazı, bu korumayı django kütüphanesini kullanarak nasıl yapıldığını öğrenin, [Django'da Clickjack Tuzağının Engeli Ve Kontrolu - Xframeoptionsmiddleware](../python/django/djangoda-clickjack-tuzagnn-engeli-ve-kontrolu-xframeoptionsmiddleware.md) adlı yazıyıda bir göz atın.

