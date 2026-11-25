/**
 * Post languages. Turkish lives at the root, every other language under /<lang>/.
 * Only tr and en have the whole site (home, lists, about); the others have posts
 * (src/data/<lang>/) — written for readers abroad, e.g. the Vakit app's languages.
 */
export const LANGS = ['tr', 'en', 'de', 'nl', 'fr', 'ar', 'ur', 'ru', 'sq', 'az', 'id', 'ms'] as const;
export type Lang = (typeof LANGS)[number];

export const LANG_INFO: Record<Lang, { name: string; htmlLang: string; og: string; dir: 'ltr' | 'rtl' }> = {
  tr: { name: 'Türkçe', htmlLang: 'tr', og: 'tr_TR', dir: 'ltr' },
  en: { name: 'English', htmlLang: 'en', og: 'en_US', dir: 'ltr' },
  de: { name: 'Deutsch', htmlLang: 'de', og: 'de_DE', dir: 'ltr' },
  nl: { name: 'Nederlands', htmlLang: 'nl', og: 'nl_NL', dir: 'ltr' },
  fr: { name: 'Français', htmlLang: 'fr', og: 'fr_FR', dir: 'ltr' },
  ar: { name: 'العربية', htmlLang: 'ar', og: 'ar_AR', dir: 'rtl' },
  ur: { name: 'اردو', htmlLang: 'ur', og: 'ur_PK', dir: 'rtl' },
  ru: { name: 'Русский', htmlLang: 'ru', og: 'ru_RU', dir: 'ltr' },
  sq: { name: 'Shqip', htmlLang: 'sq', og: 'sq_AL', dir: 'ltr' },
  az: { name: 'Azərbaycan', htmlLang: 'az', og: 'az_AZ', dir: 'ltr' },
  id: { name: 'Bahasa Indonesia', htmlLang: 'id', og: 'id_ID', dir: 'ltr' },
  ms: { name: 'Bahasa Melayu', htmlLang: 'ms', og: 'ms_MY', dir: 'ltr' },
};

/** Languages with the whole site; the rest fall back to English for navigation. */
export const siteLang = (lang: Lang): 'tr' | 'en' => (lang === 'tr' ? 'tr' : 'en');

/** A post's address in another language. */
export interface Alternate {
  lang: Lang;
  url: string;
}

export const defaultLang: Lang = 'tr';

export const ui: Record<'tr' | 'en', Record<string, string>> & Partial<Record<Lang, Record<string, string>>> = {
  tr: {
    'nav.blog': 'Blog',
    'nav.about': 'Hakkımda',
    'nav.contact': 'İletişim',
    'blog.readMore': 'Devamını Oku',
    'blog.readingTime': 'dk okuma',
    'blog.category': 'Kategori',
    'blog.subcategory': 'Alt Kategori',
    'blog.tags': 'Etiketler',
    'blog.publishedOn': 'Yayınlanma',
    'blog.updatedOn': 'Güncelleme',
    'blog.allPosts': 'Tüm Yazılar',
    'blog.relatedPosts': 'İlgili Yazılar',
    'blog.prevPost': 'Önceki',
    'blog.nextPost': 'Sonraki',
    'blog.series': 'Seri',
    'blog.posts': 'yazı',
    'blog.search': 'Ara',
    'blog.searchPlaceholder': 'Yazılarda ara...',
    'blog.searchHint': 'Aramak istediğiniz kelimeyi yazın...',
    'blog.noResults': 'için sonuç bulunamadı.',
    'blog.searchClose': 'Kapat',
    'blog.copyCode': 'Kopyala',
    'blog.codeCopied': 'Kopyalandı!',
    'blog.toc': 'İçindekiler',
    'blog.newer': 'Daha yeni',
    'blog.older': 'Daha eski',
    'lang.switch': 'English',
    'lang.switchTo': 'en',
  },
  en: {
    'nav.blog': 'Blog',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'blog.readMore': 'Read More',
    'blog.readingTime': 'min read',
    'blog.category': 'Category',
    'blog.subcategory': 'Subcategory',
    'blog.tags': 'Tags',
    'blog.publishedOn': 'Published',
    'blog.updatedOn': 'Updated',
    'blog.allPosts': 'All Posts',
    'blog.relatedPosts': 'Related Posts',
    'blog.prevPost': 'Previous',
    'blog.nextPost': 'Next',
    'blog.series': 'Series',
    'blog.posts': 'posts',
    'blog.search': 'Search',
    'blog.searchPlaceholder': 'Search posts...',
    'blog.searchHint': 'Type something to search...',
    'blog.noResults': 'No results found for',
    'blog.searchClose': 'Close',
    'blog.copyCode': 'Copy',
    'blog.codeCopied': 'Copied!',
    'blog.toc': 'Table of Contents',
    'blog.newer': 'Newer',
    'blog.older': 'Older',
    'lang.switch': 'Türkçe',
    'lang.switchTo': 'tr',
  },
  de: { 'blog.readingTime': 'Min. Lesezeit' },
  nl: { 'blog.readingTime': 'min lezen' },
  fr: { 'blog.readingTime': 'min de lecture' },
  ar: { 'blog.readingTime': 'دقائق قراءة' },
  ur: { 'blog.readingTime': 'منٹ مطالعہ' },
  ru: { 'blog.readingTime': 'мин чтения' },
  sq: { 'blog.readingTime': 'min lexim' },
  az: { 'blog.readingTime': 'dəq oxuma' },
  id: { 'blog.readingTime': 'menit baca' },
  ms: { 'blog.readingTime': 'minit bacaan' },
};

export type UIKey = string;

export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang]?.[key] ?? ui[siteLang(lang)][key] ?? key;
  };
}

/** Derives lang from an Astro URL pathname */
export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  return (LANGS as readonly string[]).includes(first) && first !== 'tr' ? (first as Lang) : 'tr';
}

/** A date in the post's language, e.g. "25 Kas 2026" / "25 Nov 2026". */
export function formatDate(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(LANG_INFO[lang].htmlLang, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/**
 * The same page in the other site language (tr ↔ en), or null when it has none:
 * categories, tags and posts are named differently per language, so guessing
 * "/en" + path pointed Google at pages that don't exist. Posts pass their real
 * translations (findTranslations) instead.
 */
export function getAlternateUrl(url: URL): string | null {
  const lang = getLangFromUrl(url);
  const path = url.pathname.replace(/\/$/, '') || '/';
  const tr = lang === 'en' ? path.replace(/^\/en/, '') || '/' : path;
  if (lang !== 'tr' && lang !== 'en') return null;
  const twins: Record<string, string> = { '/': '/en', '/seriler': '/en/series' };
  for (const page of ['/about', '/contact', '/privacy', '/terms']) twins[page] = `/en${page}`;
  const isBlogList = /^\/blog(\/\d+)?$/.test(tr);
  if (lang === 'tr') return twins[tr] ?? (isBlogList ? `/en${tr}` : null);
  const back = Object.entries(twins).find(([, en]) => en === path)?.[0];
  return back ?? (isBlogList ? tr : null);
}
