import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Projeler',
      href: getPermalink('/#projects'),
    },
    {
      text: 'Blog',
      href: getBlogPermalink(),
    },
    {
      text: 'Hakkımda',
      href: getPermalink('/about'),
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
};

export const footerData = {
  links: [
    {
      title: 'Python Araçları',
      links: [
        { text: 'unimport', href: 'https://unimport.hakancelik.dev' },
        { text: 'unexport', href: 'https://unexport.hakancelik.dev' },
        { text: 'pydbm', href: 'https://pydbm.hakancelik.dev' },
        { text: 'defineif', href: 'https://defineif.hakancelik.dev' },
      ],
    },
    {
      title: 'Uygulamalar',
      links: [
        { text: 'Vakit', href: 'https://vakit.hakancelik.dev' },
        { text: 'SiteSeeker', href: 'https://siteseeker.hakancelik.dev' },
        { text: 'Meld', href: 'https://meld.hakancelik.dev' },
      ],
    },
    {
      title: 'İçerik',
      links: [
        { text: 'Blog', href: getBlogPermalink() },
        { text: 'Yazılar (Docs)', href: 'https://docs.hakancelik.dev' },
      ],
    },
    {
      title: 'Diğer',
      links: [
        { text: 'Hakkımda', href: getPermalink('/about') },
        { text: 'İletişim', href: 'mailto:hakancelikdev@gmail.com' },
        { text: 'GitHub', href: 'https://github.com/hakancelikdev' },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Gizlilik', href: getPermalink('/privacy') },
    { text: 'Kullanım Koşulları', href: getPermalink('/terms') },
  ],
  socialLinks: [
    { ariaLabel: 'X / Twitter', icon: 'tabler:brand-x', href: 'https://twitter.com/hakancelikdev' },
    { ariaLabel: 'LinkedIn', icon: 'tabler:brand-linkedin', href: 'https://www.linkedin.com/in/hakancelikdev' },
    { ariaLabel: 'GitHub', icon: 'tabler:brand-github', href: 'https://github.com/hakancelikdev' },
    { ariaLabel: 'Telegram', icon: 'tabler:brand-telegram', href: 'https://t.me/hakancelikdev' },
    { ariaLabel: 'E-posta', icon: 'tabler:mail', href: 'mailto:hakancelikdev@gmail.com' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
  ],
  footNote: `
    &copy; 2023 - 2026 <a class="text-blue-600 underline dark:text-muted" href="https://hakancelik.dev">Hakan Çelik</a>. Tüm hakları saklıdır.
  `,
};
