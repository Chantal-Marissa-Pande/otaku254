import { useState } from "react";

import { db } from "../firebase";

import {
  collection,
  addDoc,
} from "firebase/firestore";

export default function Admin() {
  const [title, setTitle] = useState("");

  const [category, setCategory] =
    useState("Anime");

  const [description, setDescription] =
    useState("");

  const [content, setContent] =
    useState("");

  const [image, setImage] = useState("");

  const [author, setAuthor] =
    useState("");

  const [tags, setTags] = useState("");

  const [readTime, setReadTime] =
    useState("");

  const [featured, setFeatured] =
    useState(false);

  const addPost = async () => {
    if (!title || !content) {
      alert("Title and content are required");
      return;
    }

    try {
      await addDoc(collection(db, "posts"), {
        title,
        category,
        description,
        content,
        image,

        author,

        tags: tags
          .split(",")
          .map((tag) => tag.trim()),

        readTime,

        featured,

        createdAt: Date.now(),
      });

      // RESET FORM
      setTitle("");
      setCategory("Anime");
      setDescription("");
      setContent("");
      setImage("");
      setTags("");
      setReadTime("");
      setFeatured(false);

      alert("Post added!");

    } catch (error) {
      console.error(error);

      alert("Error adding post");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-10 space-y-4">

      <h1 className="text-3xl font-bold mb-6">
        Admin Panel
      </h1>

      {/* TITLE */}
      <input
        value={title}
        className="w-full p-3 rounded bg-black border border-white/20"
        placeholder="Post Title"
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      {/* DESCRIPTION */}
      <input
        value={description}
        className="w-full p-3 rounded bg-black border border-white/20"
        placeholder="Short Description"
        onChange={(e) =>
          setDescription(e.target.value)
        }
      />

      {/* IMAGE */}
      <input
        value={image}
        className="w-full p-3 rounded bg-black border border-white/20"
        placeholder="Image URL"
        onChange={(e) =>
          setImage(e.target.value)
        }
      />

      {/* AUTHOR */}
      <input
        value={author}
        className="w-full p-3 rounded bg-black border border-white/20"
        placeholder="Author"
        onChange={(e) =>
          setAuthor(e.target.value)
        }
      />

      {/* READ TIME */}
      <input
        value={readTime}
        className="w-full p-3 rounded bg-black border border-white/20"
        placeholder="Read Time (e.g. 5 min read)"
        onChange={(e) =>
          setReadTime(e.target.value)
        }
      />

      {/* TAGS */}
      <input
        value={tags}
        className="w-full p-3 rounded bg-black border border-white/20"
        placeholder="Tags separated by commas"
        onChange={(e) =>
          setTags(e.target.value)
        }
      />

      {/* CONTENT */}
      <textarea
        value={content}
        rows={8}
        className="w-full p-3 rounded bg-black border border-white/20"
        placeholder="Full Content"
        onChange={(e) =>
          setContent(e.target.value)
        }
      />

      {/* CATEGORY */}
      <select
        value={category}
        className="w-full p-3 rounded bg-black border border-white/20"
        onChange={(e) =>
          setCategory(e.target.value)
        }
      >
        <option>Anime</option>
        <option>Manga</option>
        <option>K-pop</option>
        <option>Merch</option>
      </select>

      {/* FEATURED */}
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) =>
            setFeatured(e.target.checked)
          }
        />

        Featured Post
      </label>

      {/* BUTTON */}
      <button
        onClick={addPost}
        className="
          bg-purple-600
          hover:bg-purple-700
          transition
          px-4
          py-3
          rounded-xl
          w-full
          font-semibold
        "
      >
        Publish Post
      </button>
    </div>
  );
}