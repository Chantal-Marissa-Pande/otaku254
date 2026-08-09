import { useMemo, useState } from "react";
import BlogCard from "../components/BlogCard";
import Hero from "../components/Hero";
import { usePosts } from "../hooks/usePosts";

const categories = ["All", "Anime", "Manga", "K-pop", "Merch"];

export default function Home() {
  const { posts, loading, error } = usePosts();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const filteredPosts = useMemo(() => posts.filter((post) => {
    const query = search.trim().toLowerCase();
    const text = `${post.title} ${post.description} ${post.tags?.join(" ") || ""}`.toLowerCase();
    return (filter === "All" || post.category === filter) && (!query || text.includes(query));
  }), [filter, posts, search]);
  const featuredPosts = filteredPosts.filter((post) => post.featured);
  const latestPosts = filteredPosts.filter((post) => !post.featured);

  return <div>
    <Hero />
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8"><h1 className="text-4xl font-bold">Otaku254</h1><p className="mt-2 text-gray-400">Anime · Manga · K-pop · Fandom Culture</p></div>
      <input value={search} onChange={(event) => setSearch(event.target.value)} className="mb-6 w-full rounded-xl border border-white/20 bg-black p-3 outline-none focus:border-purple-500" placeholder="Search anime, manga, K-pop..." aria-label="Search posts" />
      <div className="mb-10 flex flex-wrap gap-3">{categories.map((category) => <button key={category} onClick={() => setFilter(category)} className={`rounded-full border px-4 py-2 transition ${filter === category ? "border-purple-600 bg-purple-600" : "border-white/20 hover:border-purple-500"}`}>{category}</button>)}</div>
      {loading && <div className="py-20 text-center text-gray-400">Loading posts...</div>}
      {error && <div className="rounded-2xl border border-red-400/30 bg-red-400/10 p-6 text-red-100">{error}</div>}
      {!loading && !error && <>
        {featuredPosts.length > 0 && <section className="mb-14"><h2 className="mb-6 text-2xl font-bold">Featured Posts</h2><div className="grid gap-6 md:grid-cols-2">{featuredPosts.map((post) => <BlogCard key={post.id} {...post} />)}</div></section>}
        {filteredPosts.length === 0 ? <p className="rounded-2xl border border-dashed border-white/20 p-10 text-center text-gray-400">No posts match your search yet.</p> : <section><h2 className="mb-6 text-2xl font-bold">Latest Posts</h2><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{latestPosts.map((post) => <BlogCard key={post.id} {...post} />)}</div></section>}
      </>}
    </section>
  </div>;
}
