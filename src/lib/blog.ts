import { blogArticles, type BlogArticle } from "@/data/blog-articles";

export function getAllBlogArticles(): BlogArticle[] {
  return [...blogArticles].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );
}

export function getBlogSlugs(): string[] {
  return blogArticles.map((a) => a.slug);
}

export function getBlogArticleBySlug(slug: string): BlogArticle | null {
  return blogArticles.find((a) => a.slug === slug) ?? null;
}
