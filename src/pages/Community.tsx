import { useEffect, useState } from "react";

import {
  onAuthStateChanged,
  type User,
} from "firebase/auth";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "../firebase";

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

type CommunityTimestamp = { toDate?: () => Date } | number | string | null | undefined;

function formatTime(timestamp: CommunityTimestamp) {
  if (!timestamp) return "Just now";
  const date = typeof timestamp === "object" && timestamp.toDate ? timestamp.toDate() : new Date(timestamp as number | string);
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} ${days === 1 ? "day" : "days"} ago`;
}


export default function Community() {

  const [posts, setPosts] =
    useState<CommunityPostData[]>([]);

  const [activeCategory, setActiveCategory] =
    useState("All");

  const [newPost, setNewPost] =
    useState("");

  const [newPostCategory, setNewPostCategory] =
    useState("General");

  const [commentInputs, setCommentInputs] =
    useState<Record<string, string>>({});

  const [openComments, setOpenComments] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [currentUser, setCurrentUser] =
    useState<User | null>(null);

  const [currentUsername, setCurrentUsername] =
    useState("Anonymous");


  /*
   * LOAD CURRENT USER
   */
  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (user) => {

          setCurrentUser(user);

          if (!user) {
            setCurrentUsername(
              "Anonymous"
            );

            return;
          }

          let username =
            user.displayName ||
            "Otaku User";

          /*
           * Check Firestore for the
           * saved username.
           */
          try {

            const userRef =
              doc(
                db,
                "users",
                user.uid
              );

            const snapshot =
              await getDoc(userRef);

            if (
              snapshot.exists()
            ) {

              const data =
                snapshot.data();

              if (
                data.username &&
                typeof data.username ===
                  "string"
              ) {
                username =
                  data.username;
              }
            }

          } catch (error) {

            console.error(
              "Error loading username:",
              error
            );

          }

          setCurrentUsername(
            username
          );
        }
      );

    return () =>
      unsubscribe();

  }, []);


  /*
   * LOAD POSTS
   */
  useEffect(() => {

    const postsQuery =
      query(
        collection(
          db,
          "communityPosts"
        ),
        orderBy(
          "createdAt",
          "desc"
        )
      );

    const unsubscribe =
      onSnapshot(
        postsQuery,
        (snapshot) => {

          const loadedPosts:
            CommunityPostData[] =
            snapshot.docs.map(
              (postDoc) => {

                const data =
                  postDoc.data();

                return {

                  id: postDoc.id,

                  username:
                    data.username ||
                    "Anonymous",

                  avatar:
                    data.avatar ||
                    (
                      data.username ||
                      "A"
                    )
                      .charAt(0)
                      .toUpperCase(),

                  category:
                    data.category ||
                    "General",

                  content:
                    data.content ||
                    "",

                  likes:
                    data.likes ||
                    0,

                  liked: false,

                  time:
                    formatTime(
                      data.createdAt
                    ),

                  comments: [],
                };
              }
            );

          setPosts(
            loadedPosts
          );

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

    return () =>
      unsubscribe();

  }, []);


  /*
   * LOAD COMMENTS
   */
  useEffect(() => {

    if (
      posts.length === 0
    ) {
      return;
    }

    const unsubscribers =
      posts.map((post) => {

        const commentsQuery =
          query(
            collection(
              db,
              "communityPosts",
              post.id,
              "comments"
            ),
            orderBy(
              "createdAt",
              "asc"
            )
          );

        return onSnapshot(
          commentsQuery,
          (snapshot) => {

            const comments:
              Comment[] =
              snapshot.docs.map(
                (commentDoc) => {

                  const data =
                    commentDoc.data();

                  const commentUsername =
                    data.username ||
                    "Anonymous";

                  return {

                    id:
                      commentDoc.id,

                    username:
                      commentUsername,

                    avatar:
                      data.avatar ||
                      commentUsername
                        .charAt(0)
                        .toUpperCase(),

                    content:
                      data.content ||
                      "",

                    time:
                      formatTime(
                        data.createdAt
                      ),
                  };
                }
              );

            setPosts(
              (currentPosts) =>
                currentPosts.map(
                  (currentPost) =>
                    currentPost.id ===
                    post.id
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

      unsubscribers.forEach(
        (unsubscribe) =>
          unsubscribe()
      );

    };

  // Subscriptions are rebuilt only when the post collection size changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts.length]);


  /*
   * FILTER POSTS
   */
  const filteredPosts =
    activeCategory === "All"
      ? posts
      : posts.filter(
          (post) =>
            post.category ===
            activeCategory
        );


  /*
   * CREATE POST
   */
  const handleCreatePost =
    async () => {

      if (
        !newPost.trim()
      ) {
        return;
      }

      if (!currentUser) {

        alert(
          "Please log in to create a post."
        );

        return;
      }

      try {

        await addDoc(
          collection(
            db,
            "communityPosts"
          ),
          {

            uid:
              currentUser.uid,

            username:
              currentUsername,

            avatar:
              currentUsername
                .charAt(0)
                .toUpperCase(),

            category:
              newPostCategory,

            content:
              newPost.trim(),

            likes: 0,

            likedBy: [],

            createdAt:
              serverTimestamp(),
          }
        );

        setNewPost("");

        setNewPostCategory(
          "General"
        );

      } catch (error) {

        console.error(
          "Error creating community post:",
          error
        );

        alert(
          "Could not create post."
        );
      }
    };


  /*
   * LIKE / UNLIKE
   *
   * Still temporary.
   */
  const handleLike =
    (postId: string) => {

      setPosts(
        (currentPosts) =>
          currentPosts.map(
            (post) => {

              if (
                post.id !==
                postId
              ) {
                return post;
              }

              return {

                ...post,

                liked:
                  !post.liked,

                likes:
                  post.liked
                    ? post.likes - 1
                    : post.likes + 1,
              };
            }
          )
      );
    };


  /*
   * OPEN / CLOSE COMMENTS
   */
  const toggleComments =
    (postId: string) => {

      setOpenComments(
        (current) =>
          current === postId
            ? null
            : postId
      );
    };


  /*
   * COMMENT INPUT
   */
  const handleCommentChange =
    (
      postId: string,
      value: string
    ) => {

      setCommentInputs(
        (current) => ({
          ...current,
          [postId]:
            value,
        })
      );
    };


  /*
   * ADD COMMENT
   */
  const handleAddComment =
    async (
      postId: string
    ) => {

      const commentText =
        commentInputs[
          postId
        ]?.trim();

      if (!commentText) {
        return;
      }

      if (!currentUser) {

        alert(
          "Please log in to comment."
        );

        return;
      }

      try {

        await addDoc(
          collection(
            db,
            "communityPosts",
            postId,
            "comments"
          ),
          {

            uid:
              currentUser.uid,

            username:
              currentUsername,

            avatar:
              currentUsername
                .charAt(0)
                .toUpperCase(),

            content:
              commentText,

            createdAt:
              serverTimestamp(),
          }
        );

        setCommentInputs(
          (current) => ({
            ...current,
            [postId]: "",
          })
        );

      } catch (error) {

        console.error(
          "Error adding comment:",
          error
        );

        alert(
          "Could not add comment."
        );
      }
    };


  return (
    <div
      className="page-shell"
      style={{
        background:
          "var(--otaku-bg)",
        color:
          "var(--otaku-text)",
      }}
    >

      <div className="page-container max-w-5xl">

        {/* HEADER */}

        <div className="page-header">

          <span className="eyebrow">Fan discussions</span><h1
            className="page-title"
            style={{
              color:
                "var(--otaku-text)",
            }}
          >
            Community
          </h1>

          <p
            className="mt-2"
            style={{
              color:
                "var(--otaku-muted)",
            }}
          >
            Connect with anime,
            manga and K-pop fans.
          </p>

        </div>


        {/* CREATE POST */}

        <CreatePost
          newPost={newPost}
          newPostCategory={
            newPostCategory
          }
          onPostChange={
            setNewPost
          }
          onCategoryChange={
            setNewPostCategory
          }
          onCreatePost={
            handleCreatePost
          }
        />


        {/* CATEGORIES */}

        <CategoryFilter
          categories={
            categories
          }
          activeCategory={
            activeCategory
          }
          onCategoryChange={
            setActiveCategory
          }
        />


        {/* POSTS */}

        <div className="space-y-5">

          {loading && (
            <div
              className="rounded-2xl p-10 text-center"
              style={{
                background:
                  "var(--otaku-surface)",
                border:
                  "1px solid var(--otaku-border)",
              }}
            >
              <p
                style={{
                  color:
                    "var(--otaku-muted)",
                }}
              >
                Loading community
                posts...
              </p>
            </div>
          )}


          {!loading &&
            filteredPosts.map(
              (post) => (
                <CommunityPost
                  key={post.id}
                  post={post}
                  commentsOpen={
                    openComments ===
                    post.id
                  }
                  commentInput={
                    commentInputs[
                      post.id
                    ] || ""
                  }
                  onLike={() =>
                    handleLike(
                      post.id
                    )
                  }
                  onToggleComments={() =>
                    toggleComments(
                      post.id
                    )
                  }
                  onCommentChange={(
                    value
                  ) =>
                    handleCommentChange(
                      post.id,
                      value
                    )
                  }
                  onAddComment={() =>
                    handleAddComment(
                      post.id
                    )
                  }
                />
              )
            )}


          {!loading &&
            filteredPosts.length ===
              0 && (

              <div
                className="rounded-2xl p-10 text-center"
                style={{
                  background:
                    "var(--otaku-surface)",
                  border:
                    "1px solid var(--otaku-border)",
                }}
              >

                <p
                  style={{
                    color:
                      "var(--otaku-muted)",
                  }}
                >
                  No posts in this
                  category yet.
                </p>

                <p
                  className="mt-2 text-sm"
                  style={{
                    color:
                      "var(--otaku-muted)",
                  }}
                >
                  Be the first person
                  to start a discussion!
                </p>

              </div>
            )}

        </div>

      </div>

    </div>
  );
}
