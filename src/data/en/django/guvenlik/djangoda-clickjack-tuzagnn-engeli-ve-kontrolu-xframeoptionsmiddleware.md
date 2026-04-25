---
publishDate: 2022-06-07T00:00:00Z
author: Hakan Çelik
title: "Preventing and Controlling Clickjacking in Django - XFrameOptionsMiddleware"
excerpt: "If you need more information about what clickjacking is, how to protect against it, and what precautions to take, you can check out my list titled clickjacking."
category: Django
subcategory: Security
image: ~/assets/images/blog/django.jpg
tags:
  - django
  - python
---

# Preventing and Controlling Clickjacking in Django - XFrameOptionsMiddleware

If you need more information about what **clickjacking** is, how to protect against it,
and what precautions to take, you can
[check out my list titled clickjacking.](https://github.com/hakancelik96/blog/tree/a2daa68f9fcf2b6e6dae3f9d0e8b8bfc6369c349/clickjacking/README.md)

The clickjack middleware (intermediate layer) and decorators found in the **Django**
library provide easy-to-use protection against **clickjacking**.

If you haven't touched the **MIDDLEWARE** list in your Django application, your app is
already protected against this vulnerability. The protection is provided by the
`django.middleware.clickjacking.XFrameOptionsMiddleware` middleware. If you accidentally
deleted it, you should copy it back and add it to the **MIDDLEWARE** section.

By default, the **X-Frame-Options** header in the **middleware** is set to **SAMEORIGIN**
for all HTTP responses (HttpResponse). However, you can change this if you wish.

In **/settings.py**, writing `X_FRAME_OPTIONS = 'DENY'` will deny all incoming requests.

Even better — if you only want to allow all requests in certain cases, you should use
Django's decorator for this operation in the specific view function or class in your
**/views.py** file.

## Controlling Clickjacking Protection in a Function-Based View

It's very easy. In **/views.py** we import the decorator named
`xframe_options_exempt` from
`from django.views.decorators.clickjacking import xframe_options_exempt` and apply it
to the function we want to allow. An example is shown below.

```python
from django.http import HttpResponse
from django.views.decorators.clickjacking import xframe_options_exempt

@xframe_options_exempt
def ok_to_load_in_a_frame(request):
    return HttpResponse("This page is safe to embed in any site.")
```

Let's also see the other options:

```python
from django.views.decorators.clickjacking import xframe_options_deny, xframe_options_sameorigin, xframe_options_exempt
# @xframe_options_deny denies all framing
# @xframe_options_sameorigin allows framing from sites with the same origin
# @xframe_options_exempt allows framing from all sites
```

## Controlling Clickjacking Protection in a Class-Based View

Here, in addition to what we covered above, to be able to use the decorators made for
**X-Frame-Options** we need to include a decorator called `method_decorator` in our
project: `from django.utils.decorators import method_decorator`. The purpose of this
decorator is to allow us to use any decorator when coding class-based views as well.

```python
# django class based
from django.views.generic.base import TemplateView
# clickjacking
from django.views.decorators.clickjacking import xframe_options_deny, xframe_options_sameorigin, xframe_options_exempt
# decorators
from django.utils.decorators import method_decorator

@method_decorator(xframe_options_exempt, name='dispatch') # I passed the X-Frame-Options decorator I want to use as the first parameter and a name as the second — that's it; the rest of the code is about class-based views.
class Embed(TemplateView):
    template_name = "index.html"
    def get_context_data(self, **kwargs):
        context = super(Embed, self).get_context_data(**kwargs)
        context["note"] = "This page is safe to embed in any site."
        return context
```

The **/views.py** **url** address with the decorator can now be used by other sites and
embedded in them. I applied this permission only to the content detail page — let me
illustrate this.

When I add the following code to a site, it will embed the content from the `src` address
just like embedding a YouTube video:

```markup
<iframe scrolling="yes" frameborder="0" height="300px" width="100%" src="https://www.coogger.com/embed/@hakancelik96/clickjack-tuzagsaldrs-nedir/"></iframe>
```

Result:

### References

- [Clickjacking - docs.djangoproject.com](https://docs.djangoproject.com/en/2.1/ref/clickjacking/)
- [Class based Clickjacking - coogger | github](https://github.com/coogger/coogger/blob/7b0b6ee13f417a16bb196366287135bb9ab1cf1e/coogger/cooggerapp/views/detail.py)
