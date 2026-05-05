import { useState } from "react";
import Hero from "../components/Hero";
import BlogCard from "../components/BlogCard";
import { usePosts } from "../hooks/usePosts";

export default function Home() {
  const { posts, loading } = usePosts();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = posts.filter((post) => {
    const matchesCategory =
      filter === "All" || post.category === filter;

    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <Hero />

      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-4">Featured Posts</h2>

        {/* SEARCH */}
        <input
          className="w-full p-3 mb-4 rounded-lg bg-black border border-white/20"
          placeholder="Search anime, K-pop, manga..."
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* FILTERS */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {["All", "Anime", "Manga", "K-pop"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full border ${
                filter === cat
                  ? "bg-purple-600"
                  : "border-white/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <p>Loading posts...</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {filtered.map((post) => (
              <BlogCard
                key={post.id}
                id={post.id}
                title={post.title}
                category={post.category}
                description={post.description}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}