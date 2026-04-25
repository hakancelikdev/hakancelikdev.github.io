---
publishDate: 2022-06-21T00:00:00Z
author: Hakan Çelik
title: "Pagination in Django"
excerpt: "The need for pagination arose from the sheer volume of data. If all data were displayed on a single page, the page would load slowly, users would have to wait a long time, the server would be overloaded, and the design would look poor."
category: Django
image: ~/assets/images/blog/django.jpg
tags:
  - django
  - python
---

# Pagination in Django

## Why Do We Need Pagination?

The need for pagination arose from the sheer volume of data. If all data were displayed
on a single page:

- the page would load slowly
- users would have to wait a long time
- the server would be overloaded and exhausted
- more bandwidth would be consumed
- and the design wouldn't look great either.

As a result, users would likely leave the website quickly rather than staying long.

That's why today we'll learn to use the paginator function available in Django
(`from django.core.paginator import Paginator`).

In my opinion, you should open a file called tools.py and write a function called
paginator, then call it wherever it's needed — this will save you time.

## Understanding Pagination with Django

First, let's import the Paginator function into our project:

```python
from django.core.paginator import Paginator
```

Let's define a list called objects: `objects = ['john', 'paul', 'george', 'ringo']`

Now let's paginate this list using the **Paginator** function and understand the logic.

```python
p = Paginator(objects, 2)
```

We created a variable called `p` and passed the objects list as the first argument to
Paginator. The second argument of Paginator determines how many items should appear per
page — since we wrote 2, only 2 items will appear per page.

```python
p.count
```

With **count** we can learn the total number of objects in `p` — here the output will be **4**.

```python
p.num_pages
```

With `num_pages` we can find out how many pages the data in variable `p` will be spread
across. Since we wrote 2 as the second argument to Paginator and the objects list has 4
items, the total number of pages is 4/2 = 2, so `p.num_pages` will output 2.

```python
p.page(1)
```

To get a specific page, we use the **page()** function. This function takes only one
parameter — the page number to retrieve. The output will be `<Page 1 of 2>`. To get the
data on the retrieved page, you need to use the **object_list** method — so the usage
looks like this:

```python
page1 = p.page(1) # <Page 1 of 2>
page1.object_list # ['john', 'paul'] # outputs this
page2 = p.page(2)
page2.object_list  # ['george', 'ringo'] data on the second page
```

Instead of calling pages one by one, to call the next page in sequence use
**has_next()**, and to call the previous page (access its data) use **has_previous()**.

These return True if the next or previous page exists, and False if the requested pages
don't exist.

```python
page2.has_next()     #   False, because there is no 3rd page
page2.has_previous() #  True, because there is a page before 2, namely page 1
```

To find out the number of the first item on the retrieved page, use **start_index()**;
to find out the number of the last item, use **end_index()**.

### Example

```python
page2.start_index() # outputs 3 because the first item on page 2 is the 3rd element of the objects list
page2.end_index() # outputs 4 because the last item on page 2 is the 4th element of the objects list
```

## How Do We Use This in a Template?

First, create a file called tools.py or add to your existing views.py — let's import
Paginator and its error classes:

```python
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
```

The **PageNotAnInteger** class lets us catch the error when the incoming page request is
not a number.

The **EmptyPage** class helps us catch the error when the incoming page request is
outside the range of existing pages.

Now let's create our function called **paginator** and shape it for reuse elsewhere.

The [www.coogger.com](https://www.coogger.com) paginator function looks like this —
it's also a slightly modified version of the code found in the Django documentation:

```python
def paginator(request, queryset, hmany=20):
    paginator = Paginator(queryset, hmany)
    page = request.GET.get('page')
    try:
        contacts = paginator.page(page)
    except PageNotAnInteger:
        contacts = paginator.page(1)
    except EmptyPage:
        contacts = paginator.page(paginator.num_pages)
    return contacts
```

It takes 3 parameters: the first is the incoming request, the second is our data to
paginate (data retrieved from the database), and the third is how many items should
appear per page.

We use try and except to catch errors — if the incoming page request is not a number,
we return the first page's data; if the incoming page number is out of range, we return
the last page.

Our template will look like this:

```python
<div class="pagination">
    <span class="step-links">
        {% if blog.has_previous %}
            <a class="step-links-a" href="?page=">back</a>
        {% endif %}
        <span class="current">
             | 
        </span> {% if blog.has_next %}
    <a class="step-links-a" href="?page=">next</a> {% endif %}
    </span>
</div>
```

You can modify this using what I explained above — I used just what I needed.

The **?page** in `<a class="step-links-a" href="?page` creates a new URL parameter,
and you can retrieve that value with:

`request.GET.get('page')` — that's how we fetched the requested page number.

Now let's use the template and paginator function we created:

```python
from models import Blog
from views import tools
queryset = Blog.objects.all()
blogs = tools.paginator(request, queryset)
return render(request, "blog/blogs.html", {"blogs": blogs})
```

Here we fetched all data from the Blog object (database), passed the data as the 2nd
parameter to our **paginator** function in tools.py, gave the incoming request as the
1st parameter, and since we wanted 20 items per page, we didn't need to specify the 3rd
parameter again.

The **paginator** function paginated the data and returned it in the `blogs` variable,
which we then sent to our `blogs.html` template under the name `blogs`.

That's all — hope it was helpful.

### Final Code

**tools.paginator**

```python
def paginator(request, queryset, hmany=20):
    paginator = Paginator(queryset, hmany)
    page = request.GET.get('page')
    try:
        contacts = paginator.page(page)
    except PageNotAnInteger:
        contacts = paginator.page(1)
    except EmptyPage:
        contacts = paginator.page(paginator.num_pages)
    return contacts
```

**blogs.html**

```markup
{% include 'home/head.html' %} {% include 'home/header.html' %} {% include 'home/nav.html' %} {% if blog %}
<div class="blogs">
    <div class="main-blog-cards">
        {% include 'blog/blog-cards.html' %}
    </div>
</div>
{% include "home/paginator.html" %} {% endif %}
```

We include paginator.html inside blogs.html.

**paginator.html**

```python
<div class="pagination">
    <span class="step-links">
        {% if blog.has_previous %}
            <a class="step-links-a" href="?page=">back</a>
        {% endif %}
        <span class="current">
             | 
        </span> {% if blog.has_next %}
    <a class="step-links-a" href="?page=">next</a> {% endif %}
    </span>
</div>
```

**style.css**

```css
.pagination {
  position: relative;
  width: max-content;
  padding: 30px 10px 30px 10px;
  margin: auto;
  margin-bottom: 60px;
}
.current {
  padding: 6px;
  border: 1px solid #f1f1f1;
  background: rgb(0, 0, 0);
  color: #fff;
  border-radius: 6px;
  margin-right: 14px;
}
.step-links-a {
  padding: 6px;
  color: #fff;
  background: blue;
  border: 1px solid #f1f1f1;
  border-radius: 6px;
}
```
