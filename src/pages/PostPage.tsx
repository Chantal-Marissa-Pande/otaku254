import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { Post } from "../types/post";

export default function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) { setLoading(false); return; }
      try {
        const snapshot = await getDoc(doc(db, "posts", id));
        if (snapshot.exists()) setPost({ id: snapshot.id, ...snapshot.data() } as Post);
      } catch (fetchError) {
        console.error("Error loading post:", fetchError);
        setError("We could not load this article right now.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <div className="page-shell"><div className="empty-state mx-auto max-w-3xl">Loading article…</div></div>;
  if (error) return <div className="p-10 text-red-200">{error}</div>;
  if (!post) return <div className="page-shell"><div className="empty-state mx-auto max-w-3xl">Post not found</div></div>;

  return (
    <article className="page-shell"><div className="mx-auto max-w-3xl">
      <span className="eyebrow">{post.category}</span>
      <h1 className="page-title">{post.title}</h1>
      <div className="mt-4 flex gap-3 text-sm text-[var(--otaku-muted)]"><span>By {post.author || "Otaku254"}</span>{post.readTime && <span>· {post.readTime}</span>}</div>
      {post.image && <img src={post.image} alt={post.title} className="mb-3 mt-9 h-72 w-full rounded-3xl object-cover shadow-2xl" />}
      <p className="mt-7 text-xl leading-8 text-[var(--otaku-muted)]">{post.description}</p>
      <div className="mt-9 whitespace-pre-wrap text-lg leading-8">{post.content}</div>
      {post.tags?.length > 0 && <div className="mt-10 flex flex-wrap gap-2">{post.tags.map((tag) => <span key={tag} className="rounded-full bg-purple-500/15 px-3 py-1 text-sm text-purple-200">#{tag}</span>)}</div>}
    </div></article>
  );
}
