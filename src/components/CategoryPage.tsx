import BlogCard from "./BlogCard";
import { usePosts } from "../hooks/usePosts";
import type { PostCategory } from "../types/post";

interface Props {
  category: PostCategory;
  intro: string;
}

export default function CategoryPage({ category, intro }: Props) {
  const { posts, loading, error } = usePosts();
  const categoryPosts = posts.filter((post) => post.category === category);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-400">
        Otaku254 / {category}
      </p>
      <h1 className="mt-3 text-4xl font-bold">{category}</h1>
      <p className="mt-3 max-w-2xl text-gray-400">{intro}</p>

      {loading && <p className="py-16 text-gray-400">Loading articles...</p>}
      {error && <p className="py-16 text-red-300">{error}</p>}
      {!loading && !error && categoryPosts.length === 0 && (
        <div className="mt-10 rounded-2xl border border-dashed border-white/20 p-10 text-center text-gray-400">
          No {category} articles yet. Check back soon.
        </div>
      )}
      {categoryPosts.length > 0 && (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categoryPosts.map((post) => <BlogCard key={post.id} {...post} />)}
        </div>
      )}
    </section>
  );
}
