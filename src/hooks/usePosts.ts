import { useEffect, useState } from "react";
import { db } from "../firebase";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import type { Post } from "../types/post";

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const snapshot = await getDocs(
          collection(db, "posts")
        );

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[];

        // SORT NEWEST FIRST
        data.sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));

        setPosts(data);

      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("We could not load articles right now. Please try again shortly.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return { posts, loading, error };
}
