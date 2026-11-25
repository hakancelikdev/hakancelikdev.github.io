---
publishDate: 2026-11-25T18:00:00Z
author: Hakan Çelik
translationKey: vakit-intro
title: "Vakit : une application d'horaires de prière gratuite et sans publicité — pourquoi je l'ai créée et ce qu'elle contient"
excerpt: "Horaires de prière, adhan, Qibla et Coran — sans publicité, sans paywall, sans compte, et hors ligne. Pourquoi j'ai créé Vakit, ce qui la distingue des autres applications de prière, et ce qu'elle fait."
category: Vakit
image: ~/assets/images/blog/vakit-intro-fr.jpg
tags:
  - vakit
  - horaires-de-priere
  - ios
  - android
  - confidentialite
---

Vakit est une application que j'ai créée pour les horaires de prière et l'adhan — avec le Coran, la Qibla, le dhikr et un calendrier qui se souvient des jours bénis. Elle fonctionne sur iPhone, iPad, Apple Watch, Mac et Android ; **elle est gratuite, sans publicité, ne demande aucun compte, et les horaires de prière fonctionnent hors ligne.** Sur l'App Store, elle est notée 4,8 sur 641 notes.

<div class="not-prose my-8 rounded-2xl bg-gray-100 dark:bg-stone-800 p-6 flex flex-col sm:flex-row gap-3 sm:items-center">
  <p class="flex-1 font-semibold">Obtenez Vakit gratuitement — sans publicité, sans compte.</p>
  <a class="inline-block rounded-full bg-primary text-white px-5 py-2 font-semibold text-center" href="https://apps.apple.com/app/id6748356813?pt=127947182&ct=blog-vakit-fr-top">App Store</a>
  <a class="inline-block rounded-full bg-primary text-white px-5 py-2 font-semibold text-center" href="https://play.google.com/store/apps/details?id=com.hakancelikdev.vakit&referrer=utm_source%3Dvakit-site%26utm_medium%3Dweb%26utm_campaign%3Dblog-vakit-fr-top">Google Play</a>
</div>

## Comment Vakit est né

La lettre qui accueille chacun à la première ouverture de l'app raconte comment tout a commencé :

> Assalamu alaykum, je suis Hakan.
>
> Chaque fois que ma mère me voyait, elle me disait : « Installe-moi une application d'heures de prière. » À chaque fois, j'en installais une autre, et aucune ne lui plaisait : des publicités en consultant l'heure de la prière, des écrans d'abonnement en lisant le Coran, des comptes obligatoires…
>
> C'est ainsi qu'est né Vakit : je voulais qu'il soit ce qu'une application d'adoration devrait être. Je le développe seul depuis 1 an 4 mois, à l'écoute de chaque retour. Je n'ai mis aucune publicité, je n'ai verrouillé aucune fonction et je ne te demande pas qui tu es. Pour l'instant, je couvre les frais moi-même.
>
> Je le fais avec l'intention d'être de « ceux qui ont la foi, ont fait de bonnes œuvres… » (Al-Baqara 2:277). L'adoration est le droit de chacun, et son compagnon devrait l'être aussi. Si Vakit t'est utile à toi aussi, tu peux contribuer à le faire vivre en le soutenant autant que tu le souhaites.
>
> — Hakan

## Pourquoi encore une application de prière ?

Il existe des centaines d'applications de prière. Pourtant, dans presque toutes, je retombais sur les mêmes problèmes :

- **La publicité.** Des publicités de casino et des publicités inappropriées peuvent s'afficher juste à côté de contenus religieux. Devoir fermer la bande-annonce d'un jeu alors qu'on voulait simplement voir l'heure de l'adhan va à l'encontre de l'esprit même de l'adoration.
- **Les paywalls.** Des fonctions de base se cachent derrière un abonnement « premium ». L'adoration est le droit de chacun ; une boussole Qibla ou une traduction du Coran ne devrait rien coûter.
- **La dépendance à Internet.** Quand les horaires sont récupérés sur un serveur, l'application ne sert plus à rien en avion, à l'étranger ou partout où le réseau est faible.
- **La vie privée.** En 2020, des enquêtes ont révélé que les données de localisation d'une application de prière comptant des millions d'utilisateurs étaient parvenues, par l'intermédiaire d'un courtier en données, à des entreprises travaillant avec l'armée américaine ([Al Jazeera](https://www.aljazeera.com/news/2020/11/17/report-us-military-buying-location-data-on-popular-muslim-apps)). L'application a démenti ces accusations, mais a mis fin à ses partenariats de données. L'endroit où l'on prie ne devrait jamais devenir un produit.

Vakit est ma réponse à ces quatre problèmes.

## Dix principes : à quoi devrait ressembler une application de culte ?

Chaque décision dans Vakit repose sur dix principes. Vous les trouverez dans l'application et sur le site, réunis dans [le Manifeste de Vakit](https://vakit.hakancelik.dev/fr/manifesto.html) :

1. **Elle devrait fonctionner sans internet.** Horaires de prière, Qibla et dhikr fonctionnent entièrement hors ligne ; le Coran et les hadiths, une fois téléchargés.
2. **Il ne devrait pas y avoir de publicité.** L'adoration demande le recueillement. L'application est entièrement sans publicité.
3. **Aucune fonction ne devrait se cacher derrière un paiement.** Pas de fonction verrouillée, pas de version privilégiée, pas de période d'essai.
4. **Tout le monde devrait pouvoir l'utiliser.** Lecteur d'écran, grands caractères, contraste élevé, contenu que l'on peut écouter.
5. **Elle devrait être juste.** Une heure de prière ne peut pas être « approximative ». Les méthodes Diyanet, Umm Al-Qura, Singapour et Moonsighting sont vérifiées avec les calendriers publiés par les autorités dont elles émanent.
6. **Elle devrait fonctionner partout dans le monde.** Dans le Grand Nord, où le soleil ne se couche pas pendant des jours, à l'équateur, en voyage.
7. **Elle ne devrait pas demander qui vous êtes.** Aucun compte ; ni votre nom, ni votre e-mail, ni votre téléphone ne vous sont jamais demandés.
8. **Elle ne devrait pas vous accabler.** Pas de pluie de notifications, pas de pression des séries, pas de course aux badges.
9. **Elle devrait parler la langue de chacun.** 25 langues, y compris celles qui s'écrivent de droite à gauche.
10. **Elle devrait tenir grâce au soutien de ses utilisateurs.** Grand ou petit, l'apport de chacun la fait vivre.

## Ce qu'elle contient

<div class="not-prose grid grid-cols-2 sm:grid-cols-4 gap-4 my-8">
  <figure><img class="rounded-2xl shadow-lg" src="/images/posts/vakit/fr/prayer-times.webp" alt="Écran des horaires de prière de Vakit" width="390" height="844" loading="lazy"><figcaption class="text-sm mt-2 text-center">Horaires de prière</figcaption></figure>
  <figure><img class="rounded-2xl shadow-lg" src="/images/posts/vakit/fr/widget.webp" alt="Écran verrouillé et widgets" width="390" height="844" loading="lazy"><figcaption class="text-sm mt-2 text-center">Écran verrouillé, widgets</figcaption></figure>
  <figure><img class="rounded-2xl shadow-lg" src="/images/posts/vakit/fr/qibla.webp" alt="Boussole Qibla" width="390" height="844" loading="lazy"><figcaption class="text-sm mt-2 text-center">Boussole Qibla</figcaption></figure>
  <figure><img class="rounded-2xl shadow-lg" src="/images/posts/vakit/fr/quran.webp" alt="Le Saint Coran" width="390" height="844" loading="lazy"><figcaption class="text-sm mt-2 text-center">Coran</figcaption></figure>
</div>

### Horaires de prière et adhan

- **12 méthodes de calcul**, fuseaux horaires pris en compte, détection des voyages. Les horaires ne sont pas récupérés sur un serveur : c'est votre téléphone qui les calcule, selon la méthode que vous choisissez.
- **Sons d'adhan :** chaque prière est récitée dans son propre maqam — Fajr en saba, Dohr en uşşak, Asr en rast, Maghreb en segah, Icha en hicaz. Ils sont inclus dans l'application, et se jouent donc hors ligne.
- **Alarme avant la fin du temps :** elle sonne avant la fin du temps d'une prière si vous ne l'avez pas encore priée, et reste muette si c'est fait. Sur iOS 26, c'est une vraie alarme qui passe outre le mode Silencieux.
- **Écran verrouillé :** Activité en direct, Dynamic Island, En veille et 26 widgets. La prochaine prière d'un coup d'œil, sans déverrouiller.
- **Temps makrouh et horaires des prières surérogatoires**, au choix — Ichraq, Doha et Awwabin compris.

### Coran, hadiths et bibliothèque

- Les 114 sourates, l'analyse mot à mot, **72 traductions en 24 langues et 51 tafsirs en 20** ; vous choisissez chacun par le nom de son traducteur ou de son auteur.
- Le mushaf en graphie de Médine ou de Turquie, avec les couleurs du tajwid en option.
- La récitation à télécharger et des **traductions lues** — la Voix Vakit, naturelle, pour 13 traductions turques. (J'ai raconté comment ces voix ont été créées [dans un article à part](/en/building-a-volunteer-ai-voice-farm-for-audio-quran-translations), en anglais.)
- **Plus de 36 000 hadiths** issus de sept grands recueils, avec l'original arabe et des traductions en 16 langues.
- Une bibliothèque de plus de 180 ouvrages.

<div class="not-prose grid grid-cols-2 sm:grid-cols-4 gap-4 my-8">
  <figure><img class="rounded-2xl shadow-lg" src="/images/posts/vakit/fr/discover.webp" alt="Tous les outils réunis au même endroit" width="390" height="844" loading="lazy"><figcaption class="text-sm mt-2 text-center">Tous les outils</figcaption></figure>
  <figure><img class="rounded-2xl shadow-lg" src="/images/posts/vakit/fr/profile.webp" alt="Anneaux de pratique" width="390" height="844" loading="lazy"><figcaption class="text-sm mt-2 text-center">Anneaux de pratique</figcaption></figure>
  <figure><img class="rounded-2xl shadow-lg" src="/images/posts/vakit/fr/qada.webp" alt="Suivi des qada" width="390" height="844" loading="lazy"><figcaption class="text-sm mt-2 text-center">Suivi des qada</figcaption></figure>
  <figure><img class="rounded-2xl shadow-lg" src="/images/posts/vakit/fr/calendar.webp" alt="Calendrier hégirien" width="390" height="844" loading="lazy"><figcaption class="text-sm mt-2 text-center">Calendrier</figcaption></figure>
</div>

### Suivi de la pratique, Ramadan et guides

- **Anneaux de pratique :** prière, Coran, dhikr, hadiths et qada. La régularité est montrée avec douceur — sans culpabilité.
- **Suivi des qada :** les prières manquées par moment de prière, les jeûnes manqués jour par jour ; la dette diminue à mesure que vous les rattrapez, et vous voyez quand vous aurez terminé.
- **Ramadan :** un calendrier mensuel des horaires, une alarme du souhour (pendant le Ramadan, chaque jour ou les jours de jeûne recommandés) et le suivi du jeûne.
- **Calendrier :** l'hégirien et le grégorien ensemble, avec les nuits bénies, les Aïds et des rappels.
- **Guides :** 17 types de prière, illustrés ; ablutions, ghousl et tayammoum ; un guide du vendredi ; des calculateurs de zakat et de fitra.

### Sur chaque appareil, dans chaque langue

- **iPhone, iPad, Apple Watch, Mac et Android.** Qibla en direct et 14 complications sur la montre ; un décompte dans la barre des menus du Mac. Grâce à iCloud, vos données restent identiques sur tous vos appareils Apple.
- **25 langues** ; en arabe, en ourdou, en persan et en ouïghour, toute l'interface se lit de droite à gauche.

## Les autres applications et Vakit

|                  | La plupart des applications de prière                              | Vakit                                                                                 |
| ---------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| Publicité        | Publicités de casino et inappropriées à côté de contenus religieux | Entièrement sans publicité ; pas même facultative                                     |
| Coût             | Paywalls, abonnements, niveaux « premium »                         | Gratuit ; ni niveaux, ni vente forcée                                                 |
| Internet         | Les fonctions de base exigent une connexion                        | Horaires de prière, notifications, Qibla et dhikr hors ligne dès le premier lancement |
| Écran verrouillé | Les widgets cassent au fil des mises à jour d'iOS                  | Activité en direct, Dynamic Island, En veille                                         |
| Précision        | Erreurs au changement d'heure, peu de méthodes                     | 12 méthodes, fuseaux horaires pris en compte, détection des voyages                   |
| Appareils        | Téléphone seulement                                                | iPhone, iPad, Apple Watch, Mac, Android                                               |

## Vos données sont un dépôt confié

- **Vos coordonnées n'arrivent jamais sur mon serveur.** Seuls le pays, la ville et l'arrondissement y parviennent. Pour votre adresse et les mosquées à proximité, la position est envoyée uniquement à Plans d'Apple.
- **Les horaires de prière sont calculés sur votre téléphone**, et non récupérés sur un serveur.
- **Vos enregistrements** — registre des qada, khatm, signets, mosquées favorites — restent sur votre appareil et dans votre propre espace iCloud.
- Les données d'usage qui arrivent bien sur le serveur sont liées à un code pseudonyme, sans nom, ni e-mail, ni téléphone. Ce qui est envoyé est détaillé point par point dans la [politique de confidentialité](https://vakit.hakancelik.dev/fr/privacy.html) — et, pour être tout à fait clair : pseudonyme, pas anonyme.

## Comment reste-t-elle gratuite ?

Toute l'application est gratuite : pas de paywall, pas de « premium », pas de fonction verrouillée. Celles et ceux qui veulent la soutenir peuvent faire un don ponctuel ou mensuel ; un don ne débloque rien — rien n'est verrouillé. Ce qui fait vivre Vakit, c'est le soutien des personnes qui l'utilisent.

## Les horaires de prière de votre ville

J'ai rassemblé les horaires de prière du jour, le **calendrier du Ramadan 2027** et la direction de la Qibla pour 33 villes — de Londres à La Mecque, de Berlin à Kuala Lumpur — sur la page [horaires de prière par ville](https://vakit.hakancelik.dev/fr/horaires-priere/). Et pour savoir combien d'heures durera le jeûne dans chacune d'elles, voyez [Ramadan 2027 : durée du jeûne](https://vakit.hakancelik.dev/fr/horaires-priere/ramadan-2027-duree-du-jeune.html). L'application calcule tout cela partout dans le monde, là où vous êtes, hors ligne.

---

J'essaie de faire de Vakit ce qu'une application de culte devrait être. Si vous l'essayez, la plus grande aide que vous puissiez m'apporter, c'est de me dire ce qui manque, en m'écrivant depuis l'application.

<div class="not-prose my-8 rounded-2xl bg-gray-100 dark:bg-stone-800 p-6 flex flex-col sm:flex-row gap-3 sm:items-center">
  <p class="flex-1 font-semibold">Gratuit. Sans publicité. Sans compte. Les horaires de prière fonctionnent hors ligne.</p>
  <a class="inline-block rounded-full bg-primary text-white px-5 py-2 font-semibold text-center" href="https://apps.apple.com/app/id6748356813?pt=127947182&ct=blog-vakit-fr-bottom">Télécharger dans l'App Store</a>
  <a class="inline-block rounded-full bg-primary text-white px-5 py-2 font-semibold text-center" href="https://play.google.com/store/apps/details?id=com.hakancelikdev.vakit&referrer=utm_source%3Dvakit-site%26utm_medium%3Dweb%26utm_campaign%3Dblog-vakit-fr-bottom">Télécharger sur Google Play</a>
</div>

Plus : [vakit.hakancelik.dev](https://vakit.hakancelik.dev/fr/)
