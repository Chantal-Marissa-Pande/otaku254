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
    <section className="page-shell">
      <div className="page-container">
      <header className="page-header"><span className="eyebrow">Otaku254 / {category}</span><h1 className="page-title gradient-heading">{category}</h1><p className="page-intro">{intro}</p></header>

      {loading && <div className="empty-state">Loading articles…</div>}
      {error && <p className="py-16 text-red-300">{error}</p>}
      {!loading && !error && categoryPosts.length === 0 && (
        <div className="empty-state">
          No {category} articles yet. Check back soon.
        </div>
      )}
      {categoryPosts.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categoryPosts.map((post) => <BlogCard key={post.id} {...post} />)}
        </div>
      )}
      </div>
    </section>
  );
}
