import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';
import type { Lang } from './utils/i18n';

export const getHeaderData = (lang: Lang = 'tr') => ({
  links: [
    {
      text: lang === 'en' ? 'Projects' : 'Projeler',
      href: lang === 'en' ? '/en#projects' : getPermalink('/#projects'),
    },
    {
      text: 'Blog',
      href: lang === 'en' ? '/en/blog' : getBlogPermalink(),
    },
    {
      text: lang === 'en' ? 'About' : 'Hakkımda',
      href: lang === 'en' ? getPermalink('/en/about') : getPermalink('/about'),
    },
  ],
  actions: [
    {
      text: 'GitHub',
      href: 'https://github.com/hakancelikdev',
      target: '_blank',
      icon: 'tabler:brand-github',
    },
  ],
});

export const getFooterData = (lang: Lang = 'tr') => ({
  links: [
    {
      title: lang === 'en' ? 'Python Tools' : 'Python Araçları',
      links: [
        { text: 'unimport', href: 'https://unimport.hakancelik.dev' },
        { text: 'unexport', href: 'https://unexport.hakancelik.dev' },
        { text: 'pydbm', href: 'https://pydbm.hakancelik.dev' },
        { text: 'defineif', href: 'https://defineif.hakancelik.dev' },
      ],
    },
    {
      title: lang === 'en' ? 'Apps' : 'Uygulamalar',
      links: [
        { text: 'Vakit', href: 'https://vakit.hakancelik.dev' },
        { text: 'SiteSeeker', href: 'https://siteseeker.hakancelik.dev' },
        { text: 'Meld', href: 'https://meld.hakancelik.dev' },
      ],
    },
    {
      title: lang === 'en' ? 'Content' : 'İçerik',
      links: [
        { text: 'Blog', href: lang === 'en' ? '/en/blog' : getBlogPermalink() },
        { text: lang === 'en' ? 'Articles (Docs)' : 'Yazılar (Docs)', href: 'https://docs.hakancelik.dev' },
      ],
    },
    {
      title: lang === 'en' ? 'Other' : 'Diğer',
      links: [
        { text: lang === 'en' ? 'About' : 'Hakkımda', href: lang === 'en' ? getPermalink('/en/about') : getPermalink('/about') },
        { text: lang === 'en' ? 'Contact' : 'İletişim', href: 'mailto:hakancelikdev@gmail.com' },
        { text: 'GitHub', href: 'https://github.com/hakancelikdev' },
      ],
    },
  ],
  secondaryLinks: [
    { text: lang === 'en' ? 'Privacy' : 'Gizlilik', href: lang === 'en' ? getPermalink('/en/privacy') : getPermalink('/privacy') },
    { text: lang === 'en' ? 'Terms' : 'Kullanım Koşulları', href: lang === 'en' ? getPermalink('/en/terms') : getPermalink('/terms') },
  ],
  socialLinks: [
    { ariaLabel: 'X / Twitter', icon: 'tabler:brand-x', href: 'https://twitter.com/hakancelikdev' },
    { ariaLabel: 'LinkedIn', icon: 'tabler:brand-linkedin', href: 'https://www.linkedin.com/in/hakancelikdev' },
    { ariaLabel: 'GitHub', icon: 'tabler:brand-github', href: 'https://github.com/hakancelikdev' },
    { ariaLabel: 'Telegram', icon: 'tabler:brand-telegram', href: 'https://t.me/hakancelikdev' },
    { ariaLabel: lang === 'en' ? 'E-mail' : 'E-posta', icon: 'tabler:mail', href: 'mailto:hakancelikdev@gmail.com' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: lang === 'en' ? '/en/rss.xml' : getAsset('/rss.xml') },
  ],
  footNote: lang === 'en'
    ? `&copy; 2023 - 2026 <a class="text-blue-600 underline dark:text-muted" href="https://hakancelik.dev">Hakan Çelik</a>. All rights reserved.`
    : `&copy; 2023 - 2026 <a class="text-blue-600 underline dark:text-muted" href="https://hakancelik.dev">Hakan Çelik</a>. Tüm hakları saklıdır.`,
});

// Backwards-compatible aliases (default TR)
export const headerData = getHeaderData('tr');
export const footerData = getFooterData('tr');
