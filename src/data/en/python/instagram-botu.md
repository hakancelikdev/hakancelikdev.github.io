---
publishDate: 2021-07-13T00:00:00Z
author: Hakan Çelik
title: "Instagram Bot"
excerpt: "We will reinforce the class structure by building an Instagram bot, learn the @staticmethod decorator, and build a neat bot using the requests library."
category: Python
image: ~/assets/images/blog/python.jpg
tags:
  - python
---

> **⚠️ WARNING (2024):** The code examples in this article no longer work. Instagram has disabled the internal endpoints used here, such as `accounts/login/ajax/` and similar. For current Instagram API integration, use the [Instagram Graph API](https://developers.facebook.com/docs/instagram-api) and the OAuth2 flow. This article is left as a historical reference only for learning `@staticmethod`, `requests.Session`, class structure, and Python OOP concepts.

# Instagram Bot

### What We Will Learn:

- Reinforcing the class structure by building an Instagram bot.
- Learning the @staticmethod decorator found in class structures.
- Building a neat bot using the requests library.

### What Our Bot Can Currently Do

- Log in with your username and password (two-factor authentication has not been added yet).
- Access a user's information by entering their username — if the account is private, you
  need to be logged in and following the person to get more information.
- Create a new account.
- Follow or unfollow users by their usernames.
- Log out.

> Our bot can also get a random user-agent and perform operations as if they come from
> different locations by rotating proxies. This means that if you prepared a keyword list
> and wrote a brute-force script with this bot, when the target person receives a
> notification saying "someone tried to log into your account", it would show a fake
> location instead of your real one. However, Instagram blocks you after about 19
> requests even if you use a proxy, and even if you enter the correct password it won't
> let you in — the person can only log in from their phone for a while. How does it do
> this? It may have separated web from mobile, issued cookies accordingly, recorded the
> number of requests arriving with a timestamp, and applied an algorithm like "if 19
> requests come from web in any form within 2 hours, block and don't allow web login even
> if the password is correct" — I think that's how it works.

## Let's Build This Blasted Bot.

You can follow developments at this address.

First let's include the required libraries in our project:

```python
import time
import sys
import random
import json
import requests
from lib import fake
```

> If you're wondering what lib/fake is — it's a long dictionary containing user-agent information.

The address is:

[fake.py](https://github.com/hakancelik96/instagram/blob/e9d1919b2f0cd3e299b997d6fe7314f9dfdfd73c/src/lib/fake.py)

Download it from there.

```python
class Instagram():
    def __init__(self, username, password, proxy = False):
        self.username = username
        self.password = password
        self.isloggedin = False
        self.instagram_url = "https://www.instagram.com/"
        self.instagram_login_url = "https://www.instagram.com/accounts/login/ajax/"
        self.instagram_signup_url = "https://www.instagram.com/accounts/web_create_ajax/"
        self.instagram_logout_url = "https://www.instagram.com/accounts/logout/"
        self.user_info_url = "https://www.instagram.com/{}/?__a=1"
        self.follow_url = "https://www.instagram.com/web/friendships/{}/follow/"
        self.unfollow_url = "https://www.instagram.com/web/friendships/{}/unfollow/"
        self.useragent = self.random_ua()["User-Agent"] # function that generates a random user-agent
        self.s = requests.Session() # session
        self.s.proxies = self.random_proxy() if proxy else {} # if the person wrote True for the 3rd parameter (proxy), we get a random address from the random_proxy function
        self.s_get = self.s.get("https://www.instagram.com/") # and we connect to instagram.com
```

First we defined a class named Instagram and gave it 3 parameters, which we wrote in the
**init** function. As you know, in classes the init function runs when the class is
instantiated and does not return a value. The variables we write with the `self.` prefix
can be accessed with the `self.` prefix in all functions that are not defined as
@classmethod or @staticmethod, once the class is instantiated. Now there are a few
addresses here for Instagram operations — where did I find these addresses? Whatever
operation I want to perform, I go to instagram.com, look at the outgoing and incoming
requests visible in the network tab as shown in the image, and then use the requests
library to mimic those requests. That's the general way we build a bot. For example, if
we're going to implement the follow action, we go to a user's profile, press the follow
button, find the address of the outgoing request, check whether it used POST or GET, and
then replicate it.

Now we have taken the username and password above and found the relevant endpoints. Let's
move on to building the other functions of our class — there are some unfinished functions
in the init function, so let's build those and the others now.

#### Functions Used in the Init Function

```python
    @staticmethod
    def random_ua():
        explorer = ["chrome", "opera", "firefox", "internetexplorer", "safari"]
        ex = fake.ua["browsers"][explorer[random.randrange(len(explorer))]] # we fetch from our dictionary-type file imported as fake
        useragent = ex[random.randrange(len(ex))]
        return {'User-Agent': useragent}

    @staticmethod
    def random_proxy():
        json_data = requests.get("https://freevpn.ninja/free-proxy/json").json()
        # possible alternate proxies
        # "https://gimmeproxy.com/api/getProxy"
        # "https://getproxylist.com/"

        json_ip = []
        # We are just selecting https and http types
        for i in json_data:
            if i["type"] in ["http", "https"]:
                json_ip.append({"type": i["type"], "proxy": i["proxy"]})

        if len(json_ip) == 0: # If we dont have any http / https proxies
            return {}

        num = random.randrange(len(json_ip))
        json_proxy = json_ip[num]
        return {json_proxy["type"]: "{}://{}".format(json_proxy["type"], json_proxy["proxy"])}
```

Functions defined inside a class with the @staticmethod decorator are still members of
the class but have little to do with the class itself. @staticmethod decorators do not
take a `self` parameter because, as we just said, they have no business with the class's
own attributes. These functions can be called without instantiating the class —
like this: _**Instagram.random_ua()**_ — and it will give you a random user-agent.

If you're wondering how the _**random_ua()**_ function above works — it randomly selects
one of **["chrome", "opera", "firefox", "internetexplorer", "safari"]** from the
dictionary-type user-agent data in our **fake.py** file (using the random module) and
then randomly picks an agent string from that browser's list according to the dictionary
structure.

The **random_proxy()** function is also a static function. It fetches addresses in JSON
format from
[https://freevpn.ninja/free-proxy/json](https://freevpn.ninja/free-proxy/json), randomly
selects a proxy from all the addresses it retrieved, and returns it in the format
[https://123.123.12.12](https://123.123.12.12). If it can't find an IP, it returns empty.

I would love to explain every step, but I'm assuming you know a few things before reading
this article because there are tons of beginner resources, videos, and courses. I can't
explain how random works here (although I do touch on it — but I can't go step by step
through dictionary and list operations). If you don't know these things, please learn them
first.

Now let's write a function for our JSON outputs so the code doesn't repeat itself.

```python
    def json_loads(self, req):
        r = {}
        try:
            r = json.loads(req.text)
        except Exception as e:
            print("An Error Occured! Details :\n",sys.exc_info())
        try:
            if r["authenticated"] == True:
                self.isloggedin = True
        except:
            pass
        finally:
             self.s_get = self.s.get(self.instagram_url)
        return r
```

We put the incoming data into `req`. If we tried to output the raw response from
Instagram without doing this, we'd get something like status codes. We took the `req` data
as text using `req.text` and converted it to JSON format using `json.loads()`.

If there were errors we printed them to screen.

Then we checked `r["authenticated"]` — this is the information about whether the person
is logged in. If it's True, the person is logged in. If they are, we informed the
`isloggedin` variable of the status, and then we called `self.s.get(self.instagram_url)`
again to retrieve fresh cookie/session data — we do this because if the person has just
logged in and this function has run, we update the cookie information that Instagram
provided upon login.

### Login()

```python
     def login(self):
        form_data={"username": self.username, "password": self.password}
        self.s.headers.update({
            'UserAgent': self.useragent,
            'x-instagram-ajax': '1',
            'X-Requested-With': 'XMLHttpRequest',
            'origin': self.instagram_url,
            'ContentType': 'application/x-www-form-urlencoded',
            'Connection': 'keep-alive',
            'Accept': '*/*',
            'Referer': 'https://www.instagram.com/accounts/login/',
            'authority': 'www.instagram.com',
            'Host' : 'www.instagram.com',
            'Accept-Language': 'en-US;q=0.6,en;q=0.4',
            'Accept-Encoding': 'gzip, deflate'
            })
        self.s.headers.update({'X-CSRFToken': self.s_get.cookies.get_dict()['csrftoken']})
        r = self.s.post(self.instagram_login_url, data=form_data)
        return self.json_loads(r)
```

Keeping it simple: the form data sent contains only the username and password. Then
there is the headers information we need to mimic — this is visible in the developer
console when you open it, and we filled in the required fields. We update these with
`self.s.headers.update` — `self.s` always maintains the cookie, session, and IP
address (proxy) information and makes requests accordingly. That's why we always use it
this way. We also retrieve the csrftoken (also found in Django) from the site before our
request using
`self.s.headers.update({'X-CSRFToken': self.s_get.cookies.get_dict()['csrftoken']})`
and update the header again. Finally, `self.s.post` makes our POST request based on this
information, and at this point we are logged in.

### Logout()

```python
    def logout(self):
        r = self.s.get(self.instagram_logout_url)
        self.isloggedin = False
        return r
```

There's not much going on for logging out — we simply use `self.s` to make a GET request
to `self.instagram_logout_url`, which handles logging us out. We also set `isloggedin`
to False. Why can we log out so easily? Because all the information that belongs to us is
already inside `self.s`, so nothing extra is needed.

### Userinfo()

```python
    def userinfo(self,username):
        if self.isloggedin: # information accessible after login
            user_info = self.user_info_url.format(username)
            req = self.s.get(user_info)
        else: # information accessible without login
            user_info = "https://www.instagram.com/{}/?__a=1".format(username)
            req = requests.get(user_info)
        info = json.loads(req.text)
        return info
```

Here we used the `isloggedin` variable to track whether the user is logged in. With
`if self.isloggedin` we check: if logged in, we'll make the request using `self.s` which
holds our cookie, session, and similar information — this way, if we're logged in and the
target user follows us, we can access more detailed information. If we're not logged in,
we just do a regular `requests.get` and access the user's publicly available information.

### Follow()

The code has comments explaining it:

```python
    def follow(self,username = False, userid = None):
        if self.isloggedin:
            if userid is not None: # if the person wants to follow by user_id, user_id won't be None
                follow_url = self.follow_url.format(userid) # and we assign the incoming user_id to the address (follow_url points to this address)
            elif userid is None and username: # if userid is None and username is True (i.e., entered)
                userid = self.userinfo(username)["user"]["id"] # we only need the id number
                # so we get the data from userinfo function we defined above
                follow_url = self.follow_url.format(userid) # we created follow_url by getting the id number
            else:
                return "you can not enter two parameters at the same time"
            self.s.headers.update({'X-CSRFToken': self.s_get.cookies.get_dict()['csrftoken']})
            r = self.s.post(follow_url) # and we send the follow request via a POST request
            return self.json_loads(r)
        else:
            print("You must login first")
```

This is a function that allows us to send a follow request for a person based on their
username or user_id. The parameters it takes:

- username
- userid

It cannot take both at the same time. If it does, **else: return "you can not enter two
parameters at the same time"** runs — i.e., it doesn't allow that. The other explanations
are written inside the code. If you're wondering what other information can be retrieved
from userinfo, check the **userinfo.md** file at the GitHub address I provided.

### Unfollow()

Unfollow works exactly the same as follow — the only difference is the address, which
becomes the unfollow URL we defined in init.

### Signup()

Very similar to the Login function:

```python
    def signup(self, first_name, email):
        form_data={
            "email": email,
            "password": self.password,
            "username": self.username,
            "firs_name": full_name,
            "seamless_login_enabled": "1"
            }
        self.s.headers.update({
            'UserAgent': self.useragent,
            'x-instagram-ajax': '1',
            'X-Requested-With': 'XMLHttpRequest',
            'Host': self.instagram_url,
            'ContentType': 'application/x-www-form-urlencoded',
            'Connection': 'keep-alive',
            'Accept': '*/*',
            'Referer': self.instagram_url,
            'authority': 'www.instagram.com',
            'Host' : 'www.instagram.com',
            'Accept-Language': 'en-US;q=0.6,en;q=0.4',
            'Accept-Encoding': 'gzip, deflate'
        })
        self.s.headers.update({'X-CSRFToken': self.s_get.cookies.get_dict()['csrftoken']})
        r = self.s.post(self.instagram_signup_url, data=form_data)
        return self.json_loads(r)
```

As you know, when registering on instagram.com there are 4 questions: email, password,
username, and full name.

You can find the form field names in Firefox under the Params tab when you look at the
relevant address. If you fill out the registration form randomly and look at the outgoing
requests to
[https://www.instagram.com/accounts/web_create_ajax/](https://www.instagram.com/accounts/web_create_ajax/),
the form field names appear in the Params tab:

- "email"
- "password"
- "username"
- "firs_name"
- "seamless_login_enabled": "1"

Those are the fields. The rest of the process is the same as in login.

I got pretty tired explaining this bot — I hope it is useful and helpful to you, valued
readers. I've already left the GitHub link. Good luck to everyone, see you next time!

## Bot Usage:

```python
from instagram import Instagram as I
# imported like this
user_info = I.userinfo(username  = "hakancelik.py") # or
user_info = I.userinfo("hakancelik.py")
# to access the public information of a specific user without logging in,
# we use the userinfo function, which takes 1 parameter: the username of the person
# whose information we want to retrieve
user_info["logging_page_id"]
# the userinfo function returns data in JSON format; to see what information is inside,
# you need to check this file: [userinfo.md](https://github.com/hakancelik96/instagram/blob/e9d1919b2f0cd3e299b997d6fe7314f9dfdfd73c/userinfo.md)
# for example, to get this user's id number:
user_info["user"]["id"]
# you may wonder what the id number is useful for — we use it for actions like
# sending follow requests based on the person's id number
# for the person's full name:
user_info["user"]["full_name"]
# if you want to know whether the person you're looking up has blocked you,
# you must be logged in and then check the relevant info, for example:
I = I("hakancelik.py", "password")  # I wrote my username and password, then to log in:
I.login() # when I call login() I am logged in
I.userinfo("hakancelik.py")["user"]["blocked_by_viewer"] # if it returns false, you have not been blocked
# to send a follow request to someone:
I.follow(username="hakancelik.py") # this will send me a follow request
# to unfollow:
I.follow(username="hakancelik.py") # if you follow me, this will unfollow me
# to send a follow request by user_id:
I.follow(userid = 3) # doing this will follow someone named Kevin
# to log out:
I.logout()
# to check whether you are logged in or logged out:
# I.isloggedin # true means you are logged in, false means you are logged out
# to create a new user before logging in:
I.signup(first_name="first_name",email="email") # run this and fill in the required fields to create a new account
```

```python
from instagram import Instagram as I
user_info = I.userinfo("hakancelik.py") # get information before signing in
oturum açmadan bilgi alıyoruz
 user_info["logging_page_id"] # page_id
user_info["user"]["id"] # for user id
 user_info["user"]["full_name"] # for full name
# etc ... for more information read userinfo.md
I = I("username", "password")
# if you want to use proxy I("username", "password", True)
I.username
username
I.password
password
I.useragent
# gives random useragent
I.s
# gives requests session
I.s.proxies
# you gives fake proxy ex: 165.321.51.21:8050
I.login() # to login instagram
I.logout() # to logout instagram
I.isloggedin  # To check whether loggedin or not
False # or True
I.follow(userid = 3) # for @kevin
{'result': 'following', 'status': 'ok'}
I.follow(username = "hakancelik.py") # for me
{'result': 'following', 'status': 'ok'}
I.unfollow(userid = 3) # for #kevin
{'status': 'ok'}
I.unfollow("hakancelik.py") # for me
{'status': 'ok'}
I.signup(first_name="first_name",email="email") # to signup for instagram
```

That's all for now — see you next time, and thanks for reading.
