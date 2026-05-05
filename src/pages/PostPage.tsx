import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

type Post = {
  title: string;
  category: string;
  description: string;
  content: string;
  image?: string;
};

export default function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      const ref = doc(db, "posts", id);
      const snapshot = await getDoc(ref);

      if (snapshot.exists()) {
        setPost(snapshot.data() as Post);
      }

      setLoading(false);
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return <div className="p-10 text-white">Loading...</div>;
  }

  if (!post) {
    return <div className="p-10 text-white">Post not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-white">
      <span className="text-purple-400">{post.category}</span>

      <h1 className="text-4xl font-bold mt-2">{post.title}</h1>

      {post.image && (
        <img
          src={post.image}
          className="rounded-xl mb-3 h-40 w-full object-cover"
        />
      )}

      <p className="text-gray-400 mt-4">{post.description}</p>

      <div className="mt-8 text-lg leading-relaxed">
        {post.content}
      </div>
    </div>
  );
}