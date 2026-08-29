"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useBlogStore } from "@/lib/blog-store";
import type { Post } from "@/lib/blog-types";
import { Header } from "@/components/blog/header";
import { Ticker } from "@/components/blog/ticker";
import { Hero } from "@/components/blog/hero";
import { Feed } from "@/components/blog/feed";
import { Sidebar } from "@/components/blog/sidebar";
import { ArticleView } from "@/components/blog/article-view";
import { CategoryView } from "@/components/blog/category-view";
import { SearchView } from "@/components/blog/search-view";
import { StaticPageView } from "@/components/blog/static-pages";
import { Footer } from "@/components/blog/footer";
import { HomeBands } from "@/components/blog/bands";
import { Skeleton } from "@/components/ui/skeleton";

function HomeSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14">
      <Skeleton className="h-10 w-72 rounded-2xl mb-4" />
      <Skeleton className="h-5 w-full max-w-2xl rounded-full mb-2" />
      <Skeleton className="h-5 w-96 rounded-full mb-10" />
      <div className="grid lg:grid-cols-5 gap-5">
        <Skeleton className="lg:col-span-3 h-[440px] rounded-3xl" />
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-[212px] rounded-3xl" />
          <Skeleton className="h-[212px] rounded-3xl" />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const view = useBlogStore((s) => s.view);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao carregar artigos");
        return res.json();
      })
      .then((data) => {
        setPosts(data.posts);
        setError(null);
      })
      .catch(() => setError("Não foi possível carregar os artigos. Recarregue a página."))
      .finally(() => setLoading(false));
  }, []);

  // scroll to top whenever the view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [view]);

  const featured = useMemo(
    () =>
      posts
        .filter((p) => p.featured)
        .concat(posts.filter((p) => !p.featured).sort((a, b) => b.views - a.views))
        .slice(0, 3),
    [posts]
  );

  const popular = useMemo(
    () => [...posts].sort((a, b) => b.views - a.views),
    [posts]
  );

  const totalViews = useMemo(
    () => posts.reduce((acc, p) => acc + p.views, 0),
    [posts]
  );

  const currentPost =
    view.name === "article" ? posts.find((p) => p.slug === view.slug) : undefined;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {view.name === "home" && <Ticker />}

      <main className="flex-1">
        {error ? (
          <div className="max-w-2xl mx-auto px-6 py-24 text-center">
            <p className="font-display text-2xl font-bold mb-2">Ops! Algo deu errado</p>
            <p className="text-muted-foreground">{error}</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {view.name === "home" && (
              <motion.div
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {loading ? (
                  <HomeSkeleton />
                ) : (
                  <>
                    <Hero featured={featured} />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                      <div className="grid lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2">
                          <Feed
                            posts={posts}
                            activeCategory={activeCategory}
                            onCategoryChange={setActiveCategory}
                          />
                        </div>
                        <div>
                          <Sidebar popular={popular} />
                        </div>
                      </div>
                    </div>

                    <HomeBands totalViews={totalViews} totalPosts={posts.length} />
                  </>
                )}
              </motion.div>
            )}

            {view.name === "article" && currentPost && (
              <motion.div
                key={`article-${currentPost.slug}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ArticleView post={currentPost} allPosts={posts} />
              </motion.div>
            )}

            {view.name === "category" && (
              <motion.div
                key={`category-${view.category}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CategoryView
                  category={view.category}
                  posts={posts.filter((p) => p.category === view.category)}
                />
              </motion.div>
            )}

            {view.name === "search" && (
              <motion.div
                key="search"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <SearchView allPosts={posts} />
              </motion.div>
            )}

            {view.name === "page" && (
              <motion.div
                key={`page-${view.page}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <StaticPageView page={view.page} />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>

      <Footer />
    </div>
  );
}
