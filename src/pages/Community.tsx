import { useEffect, useState } from "react";

import { db } from "../firebase";

import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

import CategoryFilter from "../components/community/CategoryFilter";
import CreatePost from "../components/community/CreatePost";
import CommunityPost from "../components/community/CommunityPost";

interface Comment {
  id: string;
  username: string;
  avatar: string;
  content: string;
  time: string;
}

interface CommunityPostData {
  id: string;
  username: string;
  avatar: string;
  category: string;
  content: string;
  likes: number;
  liked: boolean;
  time: string;
  comments: Comment[];
}

const categories = [
  "All",
  "Anime",
  "Manga",
  "K-pop",
  "General",
];

export default function Community() {
  const [posts, setPosts] = useState<CommunityPostData[]>([]);

  const [activeCategory, setActiveCategory] =
    useState("All");

  const [newPost, setNewPost] = useState("");

  const [newPostCategory, setNewPostCategory] =
    useState("General");

  const [commentInputs, setCommentInputs] =
    useState<Record<string, string>>({});

  const [openComments, setOpenComments] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  /*
   * LOAD POSTS
   */
  useEffect(() => {
    const postsQuery = query(
      collection(db, "communityPosts"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      postsQuery,
      (snapshot) => {
        const loadedPosts: CommunityPostData[] =
          snapshot.docs.map((doc) => {
            const data = doc.data();

            return {
              id: doc.id,
              username: data.username || "Anonymous",
              avatar: data.avatar || "A",
              category: data.category || "General",
              content: data.content || "",
              likes: data.likes || 0,
              liked: false,
              time: formatTime(data.createdAt),
              comments: [],
            };
          });

        setPosts(loadedPosts);
        setLoading(false);
      },
      (error) => {
        console.error(
          "Error loading community posts:",
          error
        );

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  /*
   * LOAD COMMENTS FOR POSTS
   */
  useEffect(() => {
    if (posts.length === 0) return;

    const unsubscribers = posts.map((post) => {
      const commentsQuery = query(
        collection(
          db,
          "communityPosts",
          post.id,
          "comments"
        ),
        orderBy("createdAt", "asc")
      );

      return onSnapshot(
        commentsQuery,
        (snapshot) => {
          const comments: Comment[] =
            snapshot.docs.map((doc) => {
              const data = doc.data();

              return {
                id: doc.id,
                username:
                  data.username || "Anonymous",
                avatar: data.avatar || "A",
                content: data.content || "",
                time: formatTime(
                  data.createdAt
                ),
              };
            });

          setPosts((currentPosts) =>
            currentPosts.map((currentPost) =>
              currentPost.id === post.id
                ? {
                    ...currentPost,
                    comments,
                  }
                : currentPost
            )
          );
        },
        (error) => {
          console.error(
            `Error loading comments for ${post.id}:`,
            error
          );
        }
      );
    });

    return () => {
      unsubscribers.forEach((unsubscribe) =>
        unsubscribe()
      );
    };
  }, [posts.length]);

  /*
   * FORMAT TIME
   */
  const formatTime = (timestamp: any) => {
    if (!timestamp) {
      return "Just now";
    }

    const date = timestamp.toDate
      ? timestamp.toDate()
      : new Date(timestamp);

    const difference =
      Date.now() - date.getTime();

    const minutes = Math.floor(
      difference / 60000
    );

    if (minutes < 1) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes} ${
        minutes === 1
          ? "minute"
          : "minutes"
      } ago`;
    }

    const hours = Math.floor(
      minutes / 60
    );

    if (hours < 24) {
      return `${hours} ${
        hours === 1
          ? "hour"
          : "hours"
      } ago`;
    }

    const days = Math.floor(
      hours / 24
    );

    return `${days} ${
      days === 1
        ? "day"
        : "days"
    } ago`;
  };

  /*
   * FILTER POSTS
   */
  const filteredPosts =
    activeCategory === "All"
      ? posts
      : posts.filter(
          (post) =>
            post.category === activeCategory
        );

  /*
   * CREATE POST
   */
  const handleCreatePost = async () => {
    if (!newPost.trim()) return;

    try {
      await addDoc(
        collection(db, "communityPosts"),
        {
          username: "You",
          avatar: "YO",
          category: newPostCategory,
          content: newPost.trim(),
          likes: 0,
          createdAt: serverTimestamp(),
        }
      );

      setNewPost("");
      setNewPostCategory("General");
    } catch (error) {
      console.error(
        "Error creating community post:",
        error
      );

      alert("Could not create post.");
    }
  };

  /*
   * LIKE / UNLIKE
   *
   * Still temporary.
   */
  const handleLike = (postId: string) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) => {
        if (post.id !== postId) {
          return post;
        }

        return {
          ...post,
          liked: !post.liked,
          likes: post.liked
            ? post.likes - 1
            : post.likes + 1,
        };
      })
    );
  };

  /*
   * OPEN / CLOSE COMMENTS
   */
  const toggleComments = (postId: string) => {
    setOpenComments((current) =>
      current === postId
        ? null
        : postId
    );
  };

  /*
   * COMMENT INPUT
   */
  const handleCommentChange = (
    postId: string,
    value: string
  ) => {
    setCommentInputs((current) => ({
      ...current,
      [postId]: value,
    }));
  };

  /*
   * ADD COMMENT TO FIRESTORE
   */
  const handleAddComment = async (
    postId: string
  ) => {
    const commentText =
      commentInputs[postId]?.trim();

    if (!commentText) return;

    try {
      await addDoc(
        collection(
          db,
          "communityPosts",
          postId,
          "comments"
        ),
        {
          username: "You",
          avatar: "YO",
          content: commentText,
          createdAt: serverTimestamp(),
        }
      );

      setCommentInputs((current) => ({
        ...current,
        [postId]: "",
      }));
    } catch (error) {
      console.error(
        "Error adding comment:",
        error
      );

      alert("Could not add comment.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] px-4 py-10">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Community
          </h1>

          <p className="mt-2 text-gray-400">
            Connect with anime, manga and K-pop fans.
          </p>
        </div>

        {/* Create Post */}
        <CreatePost
          newPost={newPost}
          newPostCategory={newPostCategory}
          onPostChange={setNewPost}
          onCategoryChange={setNewPostCategory}
          onCreatePost={handleCreatePost}
        />

        {/* Categories */}
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Posts */}
        <div className="space-y-5">

          {loading && (
            <div className="rounded-2xl border border-gray-800 bg-[#171725] p-10 text-center">
              <p className="text-gray-400">
                Loading community posts...
              </p>
            </div>
          )}

          {!loading &&
            filteredPosts.map((post) => (
              <CommunityPost
                key={post.id}
                post={post}
                commentsOpen={
                  openComments === post.id
                }
                commentInput={
                  commentInputs[post.id] || ""
                }
                onLike={() =>
                  handleLike(post.id)
                }
                onToggleComments={() =>
                  toggleComments(post.id)
                }
                onCommentChange={(value) =>
                  handleCommentChange(
                    post.id,
                    value
                  )
                }
                onAddComment={() =>
                  handleAddComment(post.id)
                }
              />
            ))}

          {!loading &&
            filteredPosts.length === 0 && (
              <div className="rounded-2xl border border-gray-800 bg-[#171725] p-10 text-center">
                <p className="text-gray-400">
                  No posts in this category yet.
                </p>

                <p className="mt-2 text-sm text-gray-600">
                  Be the first person to start a discussion!
                </p>
              </div>
            )}

        </div>
      </div>
    </div>
  );
}