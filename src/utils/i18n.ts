export type Lang = 'tr' | 'en';

export const defaultLang: Lang = 'tr';

export const ui = {
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
} as const;

export type UIKey = keyof (typeof ui)['tr'];

export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? ui[defaultLang][key] ?? key;
  };
}

/** Derives lang from an Astro URL pathname */
export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  if (first === 'en') return 'en';
  return 'tr';
}

/** Returns the alternate URL for language switching */
export function getAlternateUrl(url: URL): string {
  const lang = getLangFromUrl(url);
  const path = url.pathname;
  if (lang === 'en') {
    // /en/foo → /foo
    return path.replace(/^\/en/, '') || '/';
  } else {
    // /foo → /en/foo
    return `/en${path === '/' ? '' : path}`;
  }
}
