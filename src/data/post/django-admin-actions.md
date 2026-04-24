---
publishDate: 2022-11-20T00:00:00Z
author: Hakan Çelik
title: Django Admin Actions
excerpt: "Django Admin'de seçilen nesneler üzerinde toplu işlem yapmanızı sağlayan 'Admin Actions' özelliğini nasıl kullanacağınızı öğrenin."
image: https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80
category: Django
tags:
  - django
  - python
  - admin
---

Admin action kısaca seçilen nesneler ile toplu iş uygulayabilme özelliğidir — örneğin seçili tüm kullanıcıları silmek veya toplu e-posta göndermek gibi.

## Basit Bir Örnek

Aşağıdaki gibi bir IP ban modelimiz olsun:

```python
# models.py
from django.db import models

class IPModel(models.Model):
    address = models.GenericIPAddressField(unique=True)
    ban = models.BooleanField(default=False)
```

## Action Fonksiyonu Yazımı

Action fonksiyonu 3 parametre alır: `ModelAdmin`, `HttpRequest`, `QuerySet`.

```python
# admin.py
from django.contrib import admin
from .models import IPModel

def ban_ips(modeladmin, request, queryset):
    queryset.update(ban=True)

ban_ips.short_description = "Seçili IP'leri banla"

@admin.register(IPModel)
class IPModelAdmin(admin.ModelAdmin):
    actions = [ban_ips]
```

Bu kadar! Django admin panelinde artık toplu ban işlemi yapabilirsiniz.
