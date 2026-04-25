import { getRssString } from '@astrojs/rss';

import { SITE, APP_BLOG } from 'astrowind:config';
import { fetchEnPosts } from '~/utils/blog';
import { getPermalink } from '~/utils/permalinks';

export const GET = async () => {
  if (!APP_BLOG.isEnabled) {
    return new Response(null, { status: 404, statusText: 'Not found' });
  }

  const posts = await fetchEnPosts();

  const rss = await getRssString({
    title: `${SITE.name}'s Blog (EN)`,
    description: 'Articles on Python, Django, OpenCV, Cloud and more.',
    site: import.meta.env.SITE,

    items: posts.map((post) => ({
      link: getPermalink(post.permalink, 'post'),
      title: post.title,
      description: post.excerpt,
      pubDate: post.publishDate,
    })),

    trailingSlash: SITE.trailingSlash,
  });

  return new Response(rss, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
