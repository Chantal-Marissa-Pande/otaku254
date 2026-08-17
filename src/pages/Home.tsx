import { useMemo, useState } from "react";
import BlogCard from "../components/BlogCard";
import Hero from "../components/Hero";
import { usePosts } from "../hooks/usePosts";

const categories = ["All", "Anime", "Manga", "K-pop", "Merch"];
export default function Home() {
  const { posts, loading, error } = usePosts();
  const [filter, setFilter] = useState("All"); const [search, setSearch] = useState("");
  const filteredPosts = useMemo(() => posts.filter((post) => { const query = search.trim().toLowerCase(); const text = `${post.title} ${post.description} ${post.tags?.join(" ") || ""}`.toLowerCase(); return (filter === "All" || post.category === filter) && (!query || text.includes(query)); }), [filter, posts, search]);
  const featuredPosts = filteredPosts.filter((post) => post.featured); const latestPosts = filteredPosts.filter((post) => !post.featured);
  return <div><Hero /><section id="discover" className="mx-auto max-w-7xl px-6 py-14 sm:py-20">
    <div className="mb-9 flex flex-col gap-5"><div><span className="eyebrow">Discover what&apos;s hot</span><h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">Stories for every fandom</h2></div>
      <label className="search-shell"><span aria-hidden="true">⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search anime, manga, K-pop..." aria-label="Search posts" /></label>
      <div className="flex flex-wrap items-center gap-2">{categories.map((category) => <button key={category} onClick={() => setFilter(category)} className={`filter-chip ${filter === category ? "active" : ""}`}>{category}</button>)}<span className="ml-auto text-sm text-[var(--otaku-muted)]">{filteredPosts.length} result{filteredPosts.length === 1 ? "" : "s"}</span></div>
    </div>
    {loading && <div className="empty-state">Loading the latest stories…</div>}{error && <div className="rounded-2xl border border-red-400/30 bg-red-400/10 p-6 text-red-400">{error}</div>}
    {!loading && !error && <>{featuredPosts.length > 0 && <section className="mb-14"><div className="section-kicker" /><h2 className="mb-6 text-2xl font-extrabold">Featured posts</h2><div className="grid gap-6 md:grid-cols-2">{featuredPosts.map((post) => <BlogCard key={post.id} {...post} />)}</div></section>}{filteredPosts.length === 0 ? <div className="empty-state"><div className="mb-3 text-4xl">🔍</div><strong className="block text-lg text-[var(--otaku-text)]">No stories found</strong><span>Try another search or category.</span></div> : <section><div className="section-kicker" /><h2 className="mb-6 text-2xl font-extrabold">{filter === "All" ? "Trending now" : filter}</h2><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{latestPosts.map((post) => <BlogCard key={post.id} {...post} />)}</div></section>}</>}
  </section></div>;
}
