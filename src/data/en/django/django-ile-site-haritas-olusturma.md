---
publishDate: 2022-04-12T00:00:00Z
author: Hakan Çelik
title: "Creating a Sitemap with Django"
excerpt: "A sitemap is an .xml file that allows search engine bots from engines like Google to crawl and index the content on your site faster and more efficiently. It is very important for SEO (search engine optimization) and is present on almost every site."
category: Django
image: ~/assets/images/blog/django.jpg
tags:
  - django
  - python
---

# Creating a Sitemap with Django

### What is a Sitemap?

A sitemap is an .xml file that allows search engine bots from engines like Google to
crawl and index the content on your site faster and more efficiently. It is very
important for SEO (search engine optimization) and is present on almost every site.
For example, you can inspect the sitemap that coogger uses for its content at
[/sitemap/content.xml/](https://www.coogger.com/sitemap/content.xml/).

## Let's Create a Sitemap for Our Project

First, open your project's **settings.py** file and add the path of Django's built-in
sitemap application to the
[INSTALLED_APPS](https://docs.djangoproject.com/en/1.11/ref/settings/#std:setting-INSTALLED_APPS)
section: `django.contrib.sitemaps`

Make sure the
[sites framework](https://docs.djangoproject.com/en/1.11/ref/contrib/sites/#module-django.contrib.sites)
is installed as well.

Next, create a file called **sitemap.xml** inside your project's **myapp/templates**
directory and add the following lines:

```markup
<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">

{% spaceless %}
{% for url in urlset %}
  <url>
    <loc></loc>
    {% if url.lastmod %}<lastmod></lastmod>{% endif %}
    {% if url.changefreq %}<changefreq></changefreq>{% endif %}
    {% if url.priority %}<priority></priority>{% endif %}
   </url>
{% endfor %}
{% endspaceless %}
</urlset>
```

This file is our sitemap template.

If your site is a news site, your **sitemap** template should look like this:

```markup
<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
{% spaceless %}
{% for url in urlset %}
  <url>
    <loc></loc>
    {% if url.lastmod %}<lastmod></lastmod>{% endif %}
    {% if url.changefreq %}<changefreq></changefreq>{% endif %}
    {% if url.priority %}<priority></priority>{% endif %}
    <news:news>
      {% if url.item.time %}<news:publication_date></news:publication_date>{% endif %}
      {% if url.item.tag %}<news:keywords></news:keywords>{% endif %}
    </news:news>
   </url>
{% endfor %}
{% endspaceless %}
</urlset>
```

Now let's open **views.py** — I've written the explanations inside the code comments.

```python
# Inside your views.py file
from models import Blog
# We import the Blog class from our model file
# The Blog model class is given as an example; import whichever model class holds your content,
# i.e. the model class you want to create a sitemap for
from django.contrib.sitemaps import Sitemap
# We import Django's Sitemap class
class BlogSitemap(Sitemap):
# We gave our class a name and inherit from the imported Sitemap class
    changefreq = "daily" # This variable writes the crawl frequency in the sitemap
                         # { daily, always, weekly } are among the available options — look them up
    priority = 1.0    # The priority variable tells search engines the crawl priority
                      # Values like 0.1, 0.6, or 1.0 can be given — it's up to you
    def items(self):  # The items function specifies each item in the Blog object;
                      # you can access your model's fields with item.url, item.time, etc.
        return Blog.objects.all()
    def lastmod(self, obj): # lastmod shows the last modification date of your content.
        return Blog.objects.filter(user=obj.user)[0].lastmod
        # In my model, the last modification date is stored this way,
        # so I retrieve it like this — I get the date of the user's most recently written
        # content, which gives us the last update time, and I send it with return
    def location(self, obj): # location is where the content URLs are stored
         return obj.url # To access the items of the model object we sent in the items function,
            # we use (self, obj) parameters and access the fields via the obj variable
            # (this is our called model). Since my content URLs are in
            # the url field of my Blog model, I call it this way.
```

Now that we've configured views.py, let's go to urls.py and make the final configuration.

Explanations are again in the code comments:

```python
from django.contrib.sitemaps.views import sitemap
# We added Django's sitemap function for urls.py.
from views import BlogSitemap # I imported my sitemap class from views.py
# Your import statements may differ depending on the locations of urls.py and views.py —
# look up the import rules and include it without issues
sitemaps = {
    "blog": BlogSitemap(),
}
"""
We created a variable called sitemaps of type dict and
sent the blog sitemap class we configured in views.py as "blog" in our dict.
If you want to add multiple sitemaps, just do the same steps we did in views.py
for other model classes you want to include, import them into urls.py,
and add them to the sitemaps dict.
 """
urlpatterns = [
    url(r'^sitemap\.xml$', sitemap, {'sitemaps': sitemaps}),
    # Finally, we created the sitemap.xml URL path here and placed Django's sitemap
    # function as the second parameter,
    # then sent the sitemaps dict we created above (containing our sitemap classes)
    # using {'sitemaps': sitemaps} — and that's it
]
```

Now you can navigate to /sitemap.xml in your project to view your sitemap.

## Note

Don't forget to add the sitemap URLs to your **robots.txt** file for SEO purposes.

#### Source

- [https://docs.djangoproject.com/en/2.2/ref/contrib/sitemaps/](https://docs.djangoproject.com/en/2.2/ref/contrib/sitemaps/)
