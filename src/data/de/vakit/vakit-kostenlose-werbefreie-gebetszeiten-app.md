---
publishDate: 2026-11-25T18:00:00Z
author: Hakan Çelik
translationKey: vakit-intro
title: 'Vakit: Eine kostenlose, werbefreie Gebetszeiten-App – warum ich sie gebaut habe und was sie kann'
excerpt: 'Gebetszeiten, Adhan, Qibla und Koran – ohne Werbung, ohne Bezahlschranke, ohne Konto und auch offline. Warum ich Vakit gebaut habe, was die App von anderen Gebets-Apps unterscheidet und was sie kann.'
category: Vakit
image: ~/assets/images/blog/vakit-intro-de.jpg
tags:
  - vakit
  - gebetszeiten
  - ios
  - android
  - datenschutz
---

Vakit ist eine App, die ich für Gebetszeiten und den Adhan gebaut habe – mit dem Koran, der Qibla, Dhikr und einem Kalender, der an die gesegneten Tage erinnert. Sie läuft auf iPhone, iPad, Apple Watch, Mac und Android; **sie ist kostenlos und werbefrei, braucht kein Konto, und die Gebetszeiten funktionieren offline.** Im App Store hat sie eine Bewertung von 4,8 bei 641 Bewertungen.

<div class="not-prose my-8 rounded-2xl bg-gray-100 dark:bg-stone-800 p-6 flex flex-col sm:flex-row gap-3 sm:items-center">
  <p class="flex-1 font-semibold">Hol dir Vakit kostenlos – ohne Werbung, ohne Konto.</p>
  <a class="inline-block rounded-full bg-primary text-white px-5 py-2 font-semibold text-center" href="https://apps.apple.com/app/id6748356813?pt=127947182&ct=blog-vakit-de-top">App Store</a>
  <a class="inline-block rounded-full bg-primary text-white px-5 py-2 font-semibold text-center" href="https://play.google.com/store/apps/details?id=com.hakancelikdev.vakit&referrer=utm_source%3Dvakit-site%26utm_medium%3Dweb%26utm_campaign%3Dblog-vakit-de-top">Google Play</a>
</div>

## Wie Vakit begann

Der Brief, der alle beim ersten Öffnen der App begrüßt, erzählt, wie es angefangen hat:

> Assalamu alaikum, ich bin Hakan.
>
> Jedes Mal, wenn meine Mutter mich sah, sagte sie: "Installier mir eine Gebetszeiten-App." Jedes Mal installierte ich eine andere, und mit keiner war sie zufrieden: Werbung beim Blick auf die Gebetszeit, Abo-Bildschirme beim Lesen des Korans, Pflichtkonten …
>
> So begann Vakit: Ich wollte, dass es so ist, wie eine Gebets-App sein sollte. Ich entwickle es seit 1 Jahr 4 Monaten allein und höre auf jede Rückmeldung. Ich habe keine Werbung eingebaut, keine Funktion gesperrt, und ich frage nicht, wer du bist. Die Kosten trage ich vorerst selbst.
>
> Ich tue das mit der Absicht, zu denen zu gehören, die "glauben und das Rechte tun …" (Al-Baqara 2:277). Gottesdienst ist das Recht aller, und sein Begleiter sollte es auch sein. Wenn Vakit auch dir nützt, kannst du mit einer Unterstützung, so viel du möchtest, dazu beitragen, dass es weiterlebt.
>
> — Hakan

## Warum noch eine Gebets-App?

Es gibt Hunderte Gebets-Apps. Und doch bin ich in fast allen auf dieselben Probleme gestoßen:

- **Werbung.** Glücksspiel- und unpassende Werbung kann direkt neben religiösen Inhalten auftauchen. Wer nur kurz nachsehen will, wann der Adhan ist, und dabei erst einen Spieletrailer wegklicken muss – das widerspricht dem Geist des Gebets.
- **Bezahlschranken.** Grundfunktionen verstecken sich hinter einem „Premium“-Abo. Ibada ist das Recht jedes Menschen; ein Qibla-Kompass oder eine Koranübersetzung sollte kein Geld kosten.
- **Abhängigkeit vom Internet.** Wenn die Zeiten von einem Server geholt werden, ist die App im Flugzeug, im Ausland oder überall dort nutzlos, wo der Empfang schwach ist.
- **Datenschutz.** 2020 wurde berichtet, dass Standortdaten einer Gebets-App mit Millionen Nutzern über einen Datenhändler bei Firmen gelandet sind, die mit dem US-Militär zusammenarbeiten ([Al Jazeera](https://www.aljazeera.com/news/2020/11/17/report-us-military-buying-location-data-on-popular-muslim-apps)). Die App wies die Vorwürfe zurück, beendete aber ihre Datenpartnerschaften. Wo Menschen sind, wenn sie beten, darf niemals ein Produkt sein.

Vakit ist meine Antwort auf diese vier Probleme.

## Zehn Grundsätze: Wie sollte eine App für die Ibada sein?

Jede Entscheidung in Vakit beruht auf zehn Grundsätzen. Sie stehen in der App und auf der Website als [das Vakit-Manifest](https://vakit.hakancelik.dev/de/manifesto.html):

1. **Sie sollte ohne Internet funktionieren.** Gebetszeiten, Qibla und Dhikr funktionieren vollständig offline, Koran und Hadith nach einem einmaligen Download.
2. **Es sollte keine Werbung geben.** Ibada braucht Ruhe. Die App ist komplett werbefrei.
3. **Keine Funktion sollte hinter einer Bezahlung liegen.** Keine gesperrte Funktion, keine bevorzugte Stufe, keine Testphase.
4. **Jeder sollte sie nutzen können.** Bildschirmleser, große Schrift, hoher Kontrast, Inhalte zum Anhören.
5. **Sie sollte richtig sein.** Eine Gebetszeit darf nicht „ungefähr“ stimmen. Die Methoden Diyanet, Umm al-Qura, Singapur und Moonsighting werden mit den Kalendern abgeglichen, die die jeweils zuständigen Stellen veröffentlichen.
6. **Sie sollte überall auf der Welt funktionieren.** Im hohen Norden, wo die Sonne tagelang nicht untergeht, am Äquator, auf Reisen.
7. **Sie sollte nicht fragen, wer du bist.** Kein Konto; nach Name, E-Mail oder Telefonnummer wird nie gefragt.
8. **Sie sollte dich nicht überfordern.** Keine Flut von Mitteilungen, kein Serien-Druck, kein Wettlauf um Abzeichen.
9. **Sie sollte die Sprache aller sprechen.** 25 Sprachen, auch solche, die von rechts nach links geschrieben werden.
10. **Sie sollte von der Unterstützung ihrer Nutzer getragen werden.** Ob groß oder klein – jeder Beitrag hält sie am Leben.

## Was drin ist

<div class="not-prose grid grid-cols-2 sm:grid-cols-4 gap-4 my-8">
  <figure><img class="rounded-2xl shadow-lg" src="/images/posts/vakit/de/prayer-times.webp" alt="Gebetszeiten-Bildschirm von Vakit" width="390" height="844" loading="lazy"><figcaption class="text-sm mt-2 text-center">Gebetszeiten</figcaption></figure>
  <figure><img class="rounded-2xl shadow-lg" src="/images/posts/vakit/de/widget.webp" alt="Sperrbildschirm und Widgets" width="390" height="844" loading="lazy"><figcaption class="text-sm mt-2 text-center">Sperrbildschirm, Widgets</figcaption></figure>
  <figure><img class="rounded-2xl shadow-lg" src="/images/posts/vakit/de/qibla.webp" alt="Qibla-Kompass" width="390" height="844" loading="lazy"><figcaption class="text-sm mt-2 text-center">Qibla-Kompass</figcaption></figure>
  <figure><img class="rounded-2xl shadow-lg" src="/images/posts/vakit/de/quran.webp" alt="Der Koran" width="390" height="844" loading="lazy"><figcaption class="text-sm mt-2 text-center">Koran</figcaption></figure>
</div>

### Gebetszeiten und Adhan

- **12 Berechnungsmethoden**, zeitzonenbewusst, mit Reiseerkennung. Die Zeiten werden nicht von einem Server abgefragt; dein Telefon berechnet sie mit der Methode, die du wählst.
- **Adhan-Klänge:** Jedes Gebet erklingt in seinem eigenen Makam – Fajr in Saba, Dhuhr in Uşşak, Asr in Rast, Maghrib in Segah, Isha in Hicaz. Die Aufnahmen sind in der App enthalten und spielen daher auch offline.
- **Wecker vor Ende der Zeit:** Er klingelt, bevor die Zeit eines Gebets abläuft, wenn du es noch nicht verrichtet hast, und bleibt still, wenn du schon gebetet hast. Unter iOS 26 ist es ein echter Wecker, der den Stummmodus durchbricht.
- **Sperrbildschirm:** Live-Aktivität, Dynamic Island, StandBy und 26 Widgets. Das nächste Gebet auf einen Blick, ohne Entsperren.
- **Makruh-Zeiten und Zeiten freiwilliger Gebete**, optional – samt Ischraq, Duha und Awwabin.

### Koran, Hadith und Bibliothek

- Alle 114 Suren, Wort-für-Wort-Analyse, **72 Übersetzungen in 24 Sprachen und 51 Tafsir-Werke in 20**; du wählst jede Quelle nach ihrem Übersetzer oder Autor.
- Mushaf in Medina- oder Türkei-Schrift, mit optionalen Tadschwid-Farben.
- Rezitation zum Herunterladen und **gesprochene Übersetzungen** – eine natürliche Vakit-Stimme für 13 türkische Übersetzungen. (Wie diese Stimmen entstanden sind, habe ich [in einem eigenen Beitrag](/en/building-a-volunteer-ai-voice-farm-for-audio-quran-translations) auf Englisch beschrieben.)
- **Über 36.000 Hadithe** aus sieben großen Sammlungen, im arabischen Original und mit Übersetzungen in 16 Sprachen.
- Eine Bibliothek mit über 180 Werken.

<div class="not-prose grid grid-cols-2 sm:grid-cols-4 gap-4 my-8">
  <figure><img class="rounded-2xl shadow-lg" src="/images/posts/vakit/de/discover.webp" alt="Alle Werkzeuge an einem Ort" width="390" height="844" loading="lazy"><figcaption class="text-sm mt-2 text-center">Alle Werkzeuge</figcaption></figure>
  <figure><img class="rounded-2xl shadow-lg" src="/images/posts/vakit/de/profile.webp" alt="Ibada-Ringe" width="390" height="844" loading="lazy"><figcaption class="text-sm mt-2 text-center">Ibada-Ringe</figcaption></figure>
  <figure><img class="rounded-2xl shadow-lg" src="/images/posts/vakit/de/qada.webp" alt="Qada-Buch" width="390" height="844" loading="lazy"><figcaption class="text-sm mt-2 text-center">Qada-Buch</figcaption></figure>
  <figure><img class="rounded-2xl shadow-lg" src="/images/posts/vakit/de/calendar.webp" alt="Hidschri-Kalender" width="390" height="844" loading="lazy"><figcaption class="text-sm mt-2 text-center">Kalender</figcaption></figure>
</div>

### Ibada-Tracking, Ramadan und Leitfäden

- **Ibada-Ringe:** Gebet, Koran, Dhikr, Hadith und Qada. Beständigkeit wird sanft gezeigt – ohne Schuldgefühle.
- **Qada-Buch:** versäumte Gebete je Gebetszeit, versäumte Fastentage je Tag; die Schuld wird kleiner, während du nachholst, und du siehst, wann du fertig sein wirst.
- **Ramadan:** eine Imsakiye für den ganzen Monat, ein Suhur-Wecker (im Ramadan, jeden Tag oder an den Sunna-Fastentagen) und Fasten-Tracking.
- **Kalender:** Hidschri und gregorianisch zusammen, mit den gesegneten Nächten, den Festtagen und Erinnerungen.
- **Leitfäden:** 17 Gebetsarten, illustriert; Wudū, Ghusl und Tayammum; ein Freitagsleitfaden; Rechner für Zakat und Fitr-Gabe.

### Auf jedem Gerät, in jeder Sprache

- **iPhone, iPad, Apple Watch, Mac und Android.** Qibla live und 14 Komplikationen auf der Watch; ein Countdown in der Menüleiste des Mac. Über iCloud bleiben deine Einträge auf deinen Apple-Geräten gleich.
- **25 Sprachen**; auf Arabisch, Urdu, Persisch und Uigurisch läuft die gesamte Oberfläche von rechts nach links.

## Andere Apps und Vakit

|                 | Die meisten Gebets-Apps                                       | Vakit                                                                   |
| --------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Werbung         | Glücksspiel- und unpassende Werbung neben religiösen Inhalten | Komplett werbefrei – nicht einmal freiwillige Werbung                   |
| Kosten          | Bezahlschranken, Abos, „Premium“-Stufen                       | Kostenlos; keine Stufen, kein Upselling                                 |
| Internet        | Grundfunktionen brauchen eine Verbindung                      | Gebetszeiten, Mitteilungen, Qibla und Dhikr ab dem ersten Start offline |
| Sperrbildschirm | Widgets gehen bei iOS-Updates kaputt                          | Live-Aktivität, Dynamic Island, StandBy                                 |
| Genauigkeit     | Fehler bei der Zeitumstellung, wenige Methoden                | 12 Methoden, zeitzonenbewusst, Reiseerkennung                           |
| Geräte          | Nur das Telefon                                               | iPhone, iPad, Apple Watch, Mac, Android                                 |

## Deine Daten sind anvertrautes Gut

- **Deine Koordinaten erreichen nie meinen Server.** Nur Land, Stadt und Bezirk. Für deine Adresse und Moscheen in der Nähe geht der Standort nur an Apple Karten.
- **Die Gebetszeiten werden auf deinem Telefon berechnet**, nicht von einem Server abgefragt.
- **Deine Einträge** – Qada-Buch, Chatm, Lesezeichen, Lieblingsmoscheen – bleiben auf deinem Gerät und in deinem eigenen iCloud-Speicher.
- Die Nutzungsdaten, die den Server erreichen, hängen an einem pseudonymen Code ohne Name, E-Mail oder Telefonnummer. Was gesendet wird, steht Punkt für Punkt in der [Datenschutzerklärung](https://vakit.hakancelik.dev/de/privacy.html) – und um es klar zu sagen: pseudonym, nicht anonym.

## Wie bleibt die App kostenlos?

Die ganze App ist kostenlos: keine Bezahlschranke, kein „Premium“, keine gesperrten Funktionen. Wer sie unterstützen möchte, kann einmalig oder monatlich spenden; eine Spende schaltet nichts frei – es ist ja nichts gesperrt. Was Vakit am Leben hält, ist die Unterstützung der Menschen, die die App nutzen.

## Gebetszeiten für deine Stadt

Die heutigen Gebetszeiten, den **Ramadan-Kalender 2027** und die Qibla-Richtung für 33 Städte – von London bis Mekka, von Berlin bis Kuala Lumpur – habe ich unter [Gebetszeiten nach Städten](https://vakit.hakancelik.dev/de/gebetszeiten/) zusammengestellt. Wie lange in jeder dieser Städte am ersten und letzten Ramadantag gefastet wird, siehst du auf der Seite [Ramadan 2027: Fastenzeiten](https://vakit.hakancelik.dev/de/gebetszeiten/ramadan-2027-fastenzeiten.html). Die App berechnet all das überall auf der Welt für deinen Standort, offline.

---

Ich versuche, Vakit zu dem zu machen, was eine App für die Ibada sein sollte. Wenn du sie ausprobierst, hilfst du mir am meisten, wenn du mir über das Feedback in der App sagst, was noch fehlt.

<div class="not-prose my-8 rounded-2xl bg-gray-100 dark:bg-stone-800 p-6 flex flex-col sm:flex-row gap-3 sm:items-center">
  <p class="flex-1 font-semibold">Kostenlos. Werbefrei. Kein Konto. Gebetszeiten offline.</p>
  <a class="inline-block rounded-full bg-primary text-white px-5 py-2 font-semibold text-center" href="https://apps.apple.com/app/id6748356813?pt=127947182&ct=blog-vakit-de-bottom">Laden im App Store</a>
  <a class="inline-block rounded-full bg-primary text-white px-5 py-2 font-semibold text-center" href="https://play.google.com/store/apps/details?id=com.hakancelikdev.vakit&referrer=utm_source%3Dvakit-site%26utm_medium%3Dweb%26utm_campaign%3Dblog-vakit-de-bottom">Laden bei Google Play</a>
</div>

Mehr: [vakit.hakancelik.dev](https://vakit.hakancelik.dev/de/)
