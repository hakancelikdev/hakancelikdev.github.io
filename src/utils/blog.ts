import type { PaginateFunction } from 'astro';
import { getCollection, render } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { Post } from '~/types';
import { APP_BLOG } from 'astrowind:config';
import { cleanSlug, trimSlash, BLOG_BASE, POST_PERMALINK_PATTERN, CATEGORY_BASE, TAG_BASE } from './permalinks';

const generatePermalink = async ({
  id,
  slug,
  publishDate,
  category,
}: {
  id: string;
  slug: string;
  publishDate: Date;
  category: string | undefined;
}) => {
  const year = String(publishDate.getFullYear()).padStart(4, '0');
  const month = String(publishDate.getMonth() + 1).padStart(2, '0');
  const day = String(publishDate.getDate()).padStart(2, '0');
  const hour = String(publishDate.getHours()).padStart(2, '0');
  const minute = String(publishDate.getMinutes()).padStart(2, '0');
  const second = String(publishDate.getSeconds()).padStart(2, '0');

  const permalink = POST_PERMALINK_PATTERN.replace('%slug%', slug)
    .replace('%id%', id)
    .replace('%category%', category || '')
    .replace('%year%', year)
    .replace('%month%', month)
    .replace('%day%', day)
    .replace('%hour%', hour)
    .replace('%minute%', minute)
    .replace('%second%', second);

  return permalink
    .split('/')
    .map((el) => trimSlash(el))
    .filter((el) => !!el)
    .join('/');
};

const getNormalizedPost = async (post: CollectionEntry<'post'>): Promise<Post> => {
  const { id, data } = post;
  const { Content, remarkPluginFrontmatter } = await render(post);

  const {
    publishDate: rawPublishDate = new Date(),
    updateDate: rawUpdateDate,
    title,
    excerpt,
    image,
    tags: rawTags = [],
    category: rawCategory,
    subcategory: rawSubcategory,
    author,
    draft = false,
    metadata = {},
    series,
    seriesIndex,
  } = data;

  // Derive language from path prefix (tr/... or en/...)
  const lang: 'tr' | 'en' = id.startsWith('en/') ? 'en' : 'tr';

  // Slug is only the filename part (last segment), not the full path
  const slug = cleanSlug(id.split('/').pop() || id);
  const publishDate = new Date(rawPublishDate);
  const updateDate = rawUpdateDate ? new Date(rawUpdateDate) : undefined;

  const category = rawCategory
    ? {
        slug: cleanSlug(rawCategory),
        title: rawCategory,
      }
    : undefined;

  const subcategory = rawSubcategory
    ? {
        slug: cleanSlug(rawSubcategory),
        title: rawSubcategory,
      }
    : undefined;

  const tags = rawTags.map((tag: string) => ({
    slug: cleanSlug(tag),
    title: tag,
  }));

  // For English posts, prefix permalink with 'en/'
  const basePermalink = await generatePermalink({ id, slug, publishDate, category: category?.slug });
  const permalink = lang === 'en' ? `en/${basePermalink}` : basePermalink;

  return {
    id: id,
    lang: lang,
    slug: slug,
    permalink: permalink,

    publishDate: publishDate,
    updateDate: updateDate,

    title: title,
    excerpt: excerpt,
    image: image,

    category: category,
    subcategory: subcategory,
    tags: tags,
    author: author,

    series: series,
    seriesIndex: seriesIndex,

    draft: draft,

    metadata,

    Content: Content,

    readingTime: remarkPluginFrontmatter?.readingTime,
    headings: remarkPluginFrontmatter?.headings,
  };
};

const load = async function (): Promise<Array<Post>> {
  const posts = await getCollection('post');
  const normalizedPosts = posts.map(async (post) => await getNormalizedPost(post));

  const results = (await Promise.all(normalizedPosts))
    .sort((a, b) => b.publishDate.valueOf() - a.publishDate.valueOf())
    .filter((post) => !post.draft);

  return results;
};

let _posts: Array<Post>;

// Cached per-language slices
let _trPosts: Array<Post>;
let _enPosts: Array<Post>;

/** */
export const isBlogEnabled = APP_BLOG.isEnabled;
export const isRelatedPostsEnabled = APP_BLOG.isRelatedPostsEnabled;
export const isBlogListRouteEnabled = APP_BLOG.list.isEnabled;
export const isBlogPostRouteEnabled = APP_BLOG.post.isEnabled;
export const isBlogCategoryRouteEnabled = APP_BLOG.category.isEnabled;
export const isBlogTagRouteEnabled = APP_BLOG.tag.isEnabled;

export const blogListRobots = APP_BLOG.list.robots;
export const blogPostRobots = APP_BLOG.post.robots;
export const blogCategoryRobots = APP_BLOG.category.robots;
export const blogTagRobots = APP_BLOG.tag.robots;

export const blogPostsPerPage = APP_BLOG?.postsPerPage;

/** Returns all posts (both languages) */
export const fetchPosts = async (): Promise<Array<Post>> => {
  if (!_posts) {
    _posts = await load();
  }
  return _posts;
};

/** Returns only Turkish posts */
export const fetchTrPosts = async (): Promise<Array<Post>> => {
  if (!_trPosts) {
    const all = await fetchPosts();
    _trPosts = all.filter((p) => p.lang === 'tr');
  }
  return _trPosts;
};

/** Returns only English posts */
export const fetchEnPosts = async (): Promise<Array<Post>> => {
  if (!_enPosts) {
    const all = await fetchPosts();
    _enPosts = all.filter((p) => p.lang === 'en');
  }
  return _enPosts;
};

/** */
export const findPostsBySlugs = async (slugs: Array<string>): Promise<Array<Post>> => {
  if (!Array.isArray(slugs)) return [];

  const posts = await fetchPosts();

  return slugs.reduce(function (r: Array<Post>, slug: string) {
    posts.some(function (post: Post) {
      return slug === post.slug && r.push(post);
    });
    return r;
  }, []);
};

/** */
export const findPostsByIds = async (ids: Array<string>): Promise<Array<Post>> => {
  if (!Array.isArray(ids)) return [];

  const posts = await fetchPosts();

  return ids.reduce(function (r: Array<Post>, id: string) {
    posts.some(function (post: Post) {
      return id === post.id && r.push(post);
    });
    return r;
  }, []);
};

/** Returns latest posts for a given language (defaults to 'tr') */
export const findLatestPosts = async ({ count, lang = 'tr' }: { count?: number; lang?: 'tr' | 'en' }): Promise<Array<Post>> => {
  const _count = count || 4;
  const posts = lang === 'en' ? await fetchEnPosts() : await fetchTrPosts();
  return posts ? posts.slice(0, _count) : [];
};

/** Returns the previous (older) and next (newer) posts within the same language. */
export const findAdjacentPosts = async (post: Post): Promise<{ prev: Post | null; next: Post | null }> => {
  const posts = post.lang === 'en' ? await fetchEnPosts() : await fetchTrPosts();
  const index = posts.findIndex((p) => p.slug === post.slug && p.lang === post.lang);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index < posts.length - 1 ? posts[index + 1] : null, // older
    next: index > 0 ? posts[index - 1] : null, // newer
  };
};

/** Returns all posts belonging to the given series, sorted by seriesIndex (same language). */
export const findPostsBySeries = async (seriesName: string, lang: 'tr' | 'en' = 'tr'): Promise<Post[]> => {
  const posts = lang === 'en' ? await fetchEnPosts() : await fetchTrPosts();
  return posts
    .filter((p) => p.series === seriesName)
    .sort((a, b) => (a.seriesIndex ?? 0) - (b.seriesIndex ?? 0));
};

export interface SeriesSummary {
  name: string;
  count: number;
  firstPost: Post;
  category?: Post['category'];
}

/** Returns all unique series with metadata, sorted by post count descending. */
export const findAllSeries = async (lang: 'tr' | 'en' = 'tr'): Promise<SeriesSummary[]> => {
  const posts = lang === 'en' ? await fetchEnPosts() : await fetchTrPosts();
  const map = new Map<string, Post[]>();
  for (const post of posts) {
    if (post.series) {
      const existing = map.get(post.series) ?? [];
      map.set(post.series, [...existing, post]);
    }
  }
  return Array.from(map.entries())
    .map(([name, seriesPosts]) => {
      const sorted = seriesPosts.sort((a, b) => (a.seriesIndex ?? 0) - (b.seriesIndex ?? 0));
      return { name, count: sorted.length, firstPost: sorted[0], category: sorted[0].category };
    })
    .sort((a, b) => b.count - a.count);
};

/** */
export const getStaticPathsBlogList = async ({ paginate, lang = 'tr' }: { paginate: PaginateFunction; lang?: 'tr' | 'en' }) => {
  if (!isBlogEnabled || !isBlogListRouteEnabled) return [];
  const posts = lang === 'en' ? await fetchEnPosts() : await fetchTrPosts();
  return paginate(posts, {
    params: { blog: BLOG_BASE || undefined },
    pageSize: blogPostsPerPage,
  });
};

/** Returns static paths for all blog posts (both languages). */
export const getStaticPathsBlogPost = async () => {
  if (!isBlogEnabled || !isBlogPostRouteEnabled) return [];
  return (await fetchPosts()).flatMap((post) => ({
    params: {
      blog: post.permalink,
    },
    props: { post },
  }));
};

/** */
export const getStaticPathsBlogCategory = async ({ paginate, lang = 'tr' }: { paginate: PaginateFunction; lang?: 'tr' | 'en' }) => {
  if (!isBlogEnabled || !isBlogCategoryRouteEnabled) return [];

  const posts = lang === 'en' ? await fetchEnPosts() : await fetchTrPosts();
  const categories = {};
  posts.map((post) => {
    if (post.category?.slug) {
      categories[post.category?.slug] = post.category;
    }
  });

  return Array.from(Object.keys(categories)).flatMap((categorySlug) =>
    paginate(
      posts.filter((post) => post.category?.slug && categorySlug === post.category?.slug),
      {
        params: { category: categorySlug, blog: CATEGORY_BASE || undefined },
        pageSize: blogPostsPerPage,
        props: { category: categories[categorySlug] },
      }
    )
  );
};

/** */
export const getStaticPathsBlogSubcategory = async ({ paginate, lang = 'tr' }: { paginate: PaginateFunction; lang?: 'tr' | 'en' }) => {
  if (!isBlogEnabled || !isBlogCategoryRouteEnabled) return [];

  const posts = lang === 'en' ? await fetchEnPosts() : await fetchTrPosts();
  const pairs: Record<string, { category: { slug: string; title: string }; subcategory: { slug: string; title: string } }> = {};

  posts.forEach((post) => {
    if (post.category?.slug && post.subcategory?.slug) {
      const key = `${post.category.slug}__${post.subcategory.slug}`;
      pairs[key] = { category: post.category, subcategory: post.subcategory };
    }
  });

  return Object.entries(pairs).flatMap(([key, { category, subcategory }]) => {
    const [categorySlug, subcategorySlug] = key.split('__');
    return paginate(
      posts.filter((p) => p.category?.slug === categorySlug && p.subcategory?.slug === subcategorySlug),
      {
        params: {
          blog: CATEGORY_BASE || undefined,
          category: categorySlug,
          subcategory: subcategorySlug,
        },
        pageSize: blogPostsPerPage,
        props: { category, subcategory },
      }
    );
  });
};

/** */
export const getStaticPathsBlogTag = async ({ paginate, lang = 'tr' }: { paginate: PaginateFunction; lang?: 'tr' | 'en' }) => {
  if (!isBlogEnabled || !isBlogTagRouteEnabled) return [];

  const posts = lang === 'en' ? await fetchEnPosts() : await fetchTrPosts();
  const tags = {};
  posts.map((post) => {
    if (Array.isArray(post.tags)) {
      post.tags.map((tag) => {
        tags[tag?.slug] = tag;
      });
    }
  });

  return Array.from(Object.keys(tags)).flatMap((tagSlug) =>
    paginate(
      posts.filter((post) => Array.isArray(post.tags) && post.tags.find((elem) => elem.slug === tagSlug)),
      {
        params: { tag: tagSlug, blog: TAG_BASE || undefined },
        pageSize: blogPostsPerPage,
        props: { tag: tags[tagSlug] },
      }
    )
  );
};

/** */
export const findCategories = async (lang: 'tr' | 'en' = 'tr'): Promise<Array<{ slug: string; title: string; count: number }>> => {
  const posts = lang === 'en' ? await fetchEnPosts() : await fetchTrPosts();
  const map: Record<string, { slug: string; title: string; count: number }> = {};
  posts.forEach((post) => {
    if (post.category?.slug) {
      if (!map[post.category.slug]) {
        map[post.category.slug] = { slug: post.category.slug, title: post.category.title, count: 0 };
      }
      map[post.category.slug].count++;
    }
  });
  return Object.values(map).sort((a, b) => b.count - a.count);
};

/** Returns subcategories for a given category slug, sorted by post count. */
export const findSubcategories = async (
  categorySlug: string,
  lang: 'tr' | 'en' = 'tr'
): Promise<Array<{ slug: string; title: string; count: number }>> => {
  const posts = lang === 'en' ? await fetchEnPosts() : await fetchTrPosts();
  const map: Record<string, { slug: string; title: string; count: number }> = {};
  posts.forEach((post) => {
    if (post.category?.slug === categorySlug && post.subcategory?.slug) {
      const key = post.subcategory.slug;
      if (!map[key]) {
        map[key] = { slug: key, title: post.subcategory.title, count: 0 };
      }
      map[key].count++;
    }
  });
  return Object.values(map).sort((a, b) => b.count - a.count);
};

/** */
export async function getRelatedPosts(originalPost: Post, maxResults: number = 4): Promise<Post[]> {
  const allPosts = originalPost.lang === 'en' ? await fetchEnPosts() : await fetchTrPosts();
  const originalTagsSet = new Set(originalPost.tags ? originalPost.tags.map((tag) => tag.slug) : []);

  const postsWithScores = allPosts.reduce((acc: { post: Post; score: number }[], iteratedPost: Post) => {
    if (iteratedPost.slug === originalPost.slug) return acc;

    let score = 0;
    if (iteratedPost.category && originalPost.category && iteratedPost.category.slug === originalPost.category.slug) {
      score += 5;
    }

    if (iteratedPost.tags) {
      iteratedPost.tags.forEach((tag) => {
        if (originalTagsSet.has(tag.slug)) {
          score += 1;
        }
      });
    }

    acc.push({ post: iteratedPost, score });
    return acc;
  }, []);

  postsWithScores.sort((a, b) => b.score - a.score);

  const selectedPosts: Post[] = [];
  let i = 0;
  while (selectedPosts.length < maxResults && i < postsWithScores.length) {
    selectedPosts.push(postsWithScores[i].post);
    i++;
  }

  return selectedPosts;
}
