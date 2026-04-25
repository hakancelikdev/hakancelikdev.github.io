---
publishDate: 2022-07-01T00:00:00Z
author: Hakan Çelik
title: "CLA"
excerpt: "CPython'a katkıda bulunmadan önce PSF Contributor Agreement'ı imzalamanız gerekir. Bu kısa yazıda CLA nedir, nasıl imzalanır ve onay süreci nasıl işler, adım adım anlattım."
category: CPython
image: /images/posts/capture.png
tags:
  - python
  - cpython
  - açık-kaynak
---

# CLA

CLA (Contributor License Agreement — Katılımcı Lisans Sözleşmesi), CPython'a
yapacağınız katkıların yasal olarak Python Software Foundation'a (PSF) ait olduğunu
kabul ettiğinizi gösteren bir belgedir.

## Neden Gerekli?

Açık kaynak projelere katkı yapıldığında telif hakkı meselesi ortaya çıkar. PSF CLA,
katkılarınızın Python lisansı (PSF License) altında dağıtılabilmesi için gerekli yasal
zemini sağlar. İmzalamadan gönderdiğiniz PR'lar kabul edilmez.

## Nasıl İmzalanır?

Sözleşmeyi okumak ve imzalamak için aşağıdaki adrese gidin:

**[PSF Contributor Agreement](https://www.python.org/psf/contrib/contrib-form/)**

Form tamamen çevrimiçi; ayrı bir belge imzalamanız gerekmiyor.

## Onay Süreci

İmzaladıktan sonra onay süreci **iş günlerinde** gerçekleşir ve zaman alabilir.
CPython'a ilk PR'ınızı açtığınızda
[the-knights-who-say-ni](https://github.com/the-knights-who-say-ni) adlı bot sizi
karşılar ve CLA durumunuz hakkında bir yorum bırakır.

PR label'larınız şu şekilde değişir:

- CLA imzalanmadan önce: **CLA not signed**
- CLA onaylandıktan sonra: **CLA signed**

![](/images/posts/capture-1.png)

## Tavsiye

PR açmak için CLA onayını beklemenize gerek yok. Sözleşmeyi mümkün olan en kısa
sürede imzalayın ve katkı çalışmalarınıza paralel devam edin; bot label'ı otomatik
olarak güncelleyecektir.

> **İpucu:** Herhangi bir sorun yaşarsanız [python/cpython](https://github.com/python/cpython)
> deposundaki issue'lardan ya da Python'un Discord sunucusundan destek isteyebilirsiniz.
