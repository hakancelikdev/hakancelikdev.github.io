---
publishDate: 2026-11-25T18:00:00Z
author: Hakan Çelik
title: "Vakit: A Free, Ad-Free Prayer Times App — Why I Built It and What's Inside"
excerpt: "Prayer times, adhan, Qibla and the Quran — with no ads, no paywall, no account, and working offline. Why I built Vakit, how it differs from other prayer apps, and what it does."
category: Vakit
image: ~/assets/images/blog/vakit-intro.jpg
tags:
  - vakit
  - prayer-times
  - ios
  - android
  - privacy
---

Vakit is an app I built for prayer times and the adhan — with the Quran, the Qibla, dhikr and a calendar that remembers the blessed days. It runs on iPhone, iPad, Apple Watch, Mac and Android; **it is free, ad-free, needs no account, and prayer times work offline.** On the App Store it is rated 4.8 from 641 ratings.

<div class="not-prose my-8 rounded-2xl bg-gray-100 dark:bg-stone-800 p-6 flex flex-col sm:flex-row gap-3 sm:items-center">
  <p class="flex-1 font-semibold">Get Vakit for free — no ads, no account.</p>
  <a class="inline-block rounded-full bg-primary text-white px-5 py-2 font-semibold text-center" href="https://apps.apple.com/app/id6748356813?pt=127947182&ct=blog-vakit-en-top">App Store</a>
  <a class="inline-block rounded-full bg-primary text-white px-5 py-2 font-semibold text-center" href="https://play.google.com/store/apps/details?id=com.hakancelikdev.vakit&referrer=utm_source%3Dvakit-site%26utm_medium%3Dweb%26utm_campaign%3Dblog-vakit-en-top">Google Play</a>
</div>

## Why another prayer app?

There are hundreds of prayer apps. Yet in almost all of them I kept running into the same problems:

- **Ads.** Gambling and inappropriate ads can appear right next to religious content. Closing a game trailer while checking the time of the adhan goes against the spirit of worship.
- **Paywalls.** Basic features hide behind a "premium" subscription. Worship is everyone's right; a Qibla compass or a Quran translation should not cost money.
- **Needing the internet.** When times are fetched from a server, the app is useless on a plane, abroad, or wherever the signal is weak.
- **Privacy.** In 2020 reports showed that location data from a prayer app with millions of users reached companies working with the US military through a data broker ([Al Jazeera](https://www.aljazeera.com/news/2020/11/17/report-us-military-buying-location-data-on-popular-muslim-apps)). The app denied the claims but ended its data partnerships. Where people are when they pray should never be a product.

Vakit is my answer to those four problems.

## Ten principles: what should a worship app be like?

Every decision in Vakit rests on ten principles. They live in the app and on the site as [the Vakit Manifesto](https://vakit.hakancelik.dev/en/manifesto.html):

1. **It should work without internet.** Prayer times, Qibla and dhikr work fully offline; the Quran and hadith once downloaded.
2. **There should be no ads.** Worship asks for stillness. The app is completely ad-free.
3. **No feature should sit behind a payment.** No locked feature, no privileged tier, no trial period.
4. **Everyone should be able to use it.** Screen reader, large type, high contrast, content you can listen to.
5. **It should be correct.** A prayer time cannot be "about right". The Diyanet, Umm Al-Qura, Singapore and Moonsighting methods are verified against the calendars published by the authorities behind them.
6. **It should work anywhere in the world.** In the far north where the sun does not set for days, at the equator, on a journey.
7. **It should not ask who you are.** No account; your name, e-mail and phone are never asked.
8. **It should not overwhelm you.** No flood of notifications, no streak pressure, no badge race.
9. **It should speak everyone's language.** 25 languages, right-to-left ones included.
10. **It should stand on its users' support.** Large or small, everyone's contribution keeps it going.

## What's inside

<div class="not-prose grid grid-cols-2 sm:grid-cols-4 gap-4 my-8">
  <figure><img class="rounded-2xl shadow-lg" src="/images/posts/vakit/en/prayer-times.webp" alt="Vakit prayer times screen" width="390" height="844" loading="lazy"><figcaption class="text-sm mt-2 text-center">Prayer times</figcaption></figure>
  <figure><img class="rounded-2xl shadow-lg" src="/images/posts/vakit/en/widget.webp" alt="Lock Screen and widgets" width="390" height="844" loading="lazy"><figcaption class="text-sm mt-2 text-center">Lock Screen, widgets</figcaption></figure>
  <figure><img class="rounded-2xl shadow-lg" src="/images/posts/vakit/en/qibla.webp" alt="Qibla compass" width="390" height="844" loading="lazy"><figcaption class="text-sm mt-2 text-center">Qibla compass</figcaption></figure>
  <figure><img class="rounded-2xl shadow-lg" src="/images/posts/vakit/en/quran.webp" alt="The Quran" width="390" height="844" loading="lazy"><figcaption class="text-sm mt-2 text-center">Quran</figcaption></figure>
</div>

### Prayer times and the adhan

- **12 calculation methods**, time-zone aware, with travel detection. Times are not looked up on a server; your phone calculates them with the method you choose.
- **Adhan sounds:** each prayer is recited in its own maqam — Fajr in saba, Dhuhr in ushshaq, Asr in rast, Maghrib in segah, Isha in hijaz. They ship with the app, so they play offline.
- **Before-the-time-ends alarm:** it rings before a prayer's time runs out if you haven't prayed it yet, and stays silent if you have. On iOS 26 it is a real alarm that breaks through silent mode.
- **Lock Screen:** Live Activity, Dynamic Island, StandBy and 26 widgets. The next prayer at a glance, without unlocking.
- **Makruh and voluntary prayer times**, optional — Ishraq, Duha and Awwabin included.

### Quran, hadith and library

- All 114 surahs, word-by-word analysis, **72 translations in 24 languages and 51 tafsirs in 20**; you choose each by its translator or author.
- Mushaf in the Medina or Turkish script, with optional tajweed colours.
- Downloadable recitation and **audio translations** — a natural Vakit voice for 13 Turkish translations. (I wrote about how those voices were made [in a separate post](/en/building-a-volunteer-ai-voice-farm-for-audio-quran-translations).)
- **More than 36,000 hadith** from seven major collections, with the Arabic original and translations in 16 languages.
- A library of more than 180 works.

<div class="not-prose grid grid-cols-2 sm:grid-cols-4 gap-4 my-8">
  <figure><img class="rounded-2xl shadow-lg" src="/images/posts/vakit/en/discover.webp" alt="Every tool in one place" width="390" height="844" loading="lazy"><figcaption class="text-sm mt-2 text-center">Every tool</figcaption></figure>
  <figure><img class="rounded-2xl shadow-lg" src="/images/posts/vakit/en/profile.webp" alt="Worship rings" width="390" height="844" loading="lazy"><figcaption class="text-sm mt-2 text-center">Worship rings</figcaption></figure>
  <figure><img class="rounded-2xl shadow-lg" src="/images/posts/vakit/en/qada.webp" alt="Qada tracking" width="390" height="844" loading="lazy"><figcaption class="text-sm mt-2 text-center">Qada tracking</figcaption></figure>
  <figure><img class="rounded-2xl shadow-lg" src="/images/posts/vakit/en/calendar.webp" alt="Hijri calendar" width="390" height="844" loading="lazy"><figcaption class="text-sm mt-2 text-center">Calendar</figcaption></figure>
</div>

### Worship tracking, Ramadan and guides

- **Worship rings:** prayer, Quran, dhikr, hadith and qada. Consistency is shown gently — no guilt.
- **Qada tracking:** missed prayers by prayer time, missed fasts by day; the debt shrinks as you make them up, and you can see when it will be done.
- **Ramadan:** a monthly timetable, a suhoor alarm (in Ramadan, every day, or on sunnah fasting days) and fast tracking.
- **Calendar:** Hijri and Gregorian together, with the blessed nights, Eids and reminders.
- **Guides:** 17 kinds of prayer, illustrated; wudu, ghusl and tayammum; a Friday guide; zakat and fitra calculators.

### On every device, in every language

- **iPhone, iPad, Apple Watch, Mac and Android.** Live Qibla and 14 complications on the Watch; a countdown in the Mac menu bar. Your records stay the same across your Apple devices through iCloud.
- **25 languages**; the interface runs right-to-left throughout in Arabic, Urdu, Persian and Uyghur.

## Other apps and Vakit

| | Most prayer apps | Vakit |
|---|---|---|
| Ads | Gambling and inappropriate ads next to religious content | Completely ad-free; not even optional ones |
| Cost | Paywalls, subscriptions, "premium" tiers | Free; no tiers, no upsell |
| Internet | Basic features need a connection | Prayer times, notifications, Qibla and dhikr offline from the first launch |
| Lock Screen | Widgets break with iOS updates | Live Activity, Dynamic Island, StandBy |
| Accuracy | Daylight-saving errors, limited methods | 12 methods, time-zone aware, travel detection |
| Devices | Phone only | iPhone, iPad, Apple Watch, Mac, Android |

## Your data is a trust

- **Your coordinates never reach my server.** Only country, province and district do. For your address and nearby mosques, the location goes to Apple Maps only.
- **Prayer times are calculated on your phone**, not looked up on a server.
- **Your records** — qada log, khatm, bookmarks, favourite mosques — stay on your device and in your own iCloud space.
- The usage data that does reach the server is tied to a pseudonymous code with no name, e-mail or phone. What is sent is listed item by item in the [privacy policy](https://vakit.hakancelik.dev/en/privacy.html) — and to be plain about it: pseudonymous, not anonymous.

## How does it stay free?

The whole app is free: no paywall, no "premium", no locked features. Anyone who wants to support it can make a one-time or monthly donation; donating unlocks nothing — nothing is locked. What keeps Vakit going is the support of the people who use it.

## Prayer times for your city

I gathered today's prayer times, the **Ramadan 2027 timetable** and the Qibla direction for 33 cities — from London to Mecca, from Berlin to Kuala Lumpur — on [prayer times by city](https://vakit.hakancelik.dev/en/prayer-times/). The app calculates all of this anywhere in the world, for wherever you are, offline.

---

I'm trying to make Vakit what a worship app should be. If you try it, the biggest help is to tell me what's missing through the feedback inside the app.

<div class="not-prose my-8 rounded-2xl bg-gray-100 dark:bg-stone-800 p-6 flex flex-col sm:flex-row gap-3 sm:items-center">
  <p class="flex-1 font-semibold">Free. Ad-free. No account. Prayer times offline.</p>
  <a class="inline-block rounded-full bg-primary text-white px-5 py-2 font-semibold text-center" href="https://apps.apple.com/app/id6748356813?pt=127947182&ct=blog-vakit-en-bottom">Download on the App Store</a>
  <a class="inline-block rounded-full bg-primary text-white px-5 py-2 font-semibold text-center" href="https://play.google.com/store/apps/details?id=com.hakancelikdev.vakit&referrer=utm_source%3Dvakit-site%26utm_medium%3Dweb%26utm_campaign%3Dblog-vakit-en-bottom">Get it on Google Play</a>
</div>

More: [vakit.hakancelik.dev](https://vakit.hakancelik.dev/en/)
