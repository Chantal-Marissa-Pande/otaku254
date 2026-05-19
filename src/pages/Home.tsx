import { useState } from "react";
import Hero from "../components/Hero";
import BlogCard from "../components/BlogCard";
import { usePosts } from "../hooks/usePosts";

export default function Home() {
  const { posts, loading } = usePosts();

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  // FILTER LOGIC
  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      filter === "All" || post.category === filter;

    const matchesSearch =
      post.title
        .toLowerCase()
        .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // FEATURED POSTS
  const featuredPosts = filteredPosts.filter(
    (post) => post.featured
  );

  // NORMAL POSTS
  const normalPosts = filteredPosts.filter(
    (post) => !post.featured
  );

  return (
    <div>
      <Hero />

      <section className="max-w-7xl mx-auto px-6 py-12">

        {/* PAGE TITLE */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Otaku254
          </h1>

          <p className="text-gray-400 mt-2">
            Anime • Manga • K-pop • Fandom Culture
          </p>
        </div>

        {/* SEARCH */}
        <input
          className="
            w-full
            p-3
            mb-6
            rounded-xl
            bg-black
            border
            border-white/20
            outline-none
            focus:border-purple-500
          "
          placeholder="Search anime, manga, K-pop..."
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* FILTERS */}
        <div className="flex gap-3 mb-10 flex-wrap">
          {["All", "Anime", "Manga", "K-pop"].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`
                  px-4
                  py-2
                  rounded-full
                  border
                  transition
                  ${
                    filter === cat
                      ? "bg-purple-600 border-purple-600"
                      : "border-white/20 hover:border-purple-500"
                  }
                `}
              >
                {cat}
              </button>
            )
          )}
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="text-center py-20">
            Loading posts...
          </div>
        ) : (
          <>
            {/* FEATURED POSTS */}
            {featuredPosts.length > 0 && (
              <div className="mb-14">

                <h2 className="text-2xl font-bold mb-6">
                  🔥 Featured Posts
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  {featuredPosts.map((post) => (
                    <BlogCard
                      key={post.id}
                      {...post}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* LATEST POSTS */}
            <div>

              <h2 className="text-2xl font-bold mb-6">
                Latest Posts
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                {normalPosts.map((post) => (
                  <BlogCard
                    key={post.id}
                    {...post}
                  />
                ))}
              </div>

            </div>
          </>
        )}
      </section>
    </div>
  );
}