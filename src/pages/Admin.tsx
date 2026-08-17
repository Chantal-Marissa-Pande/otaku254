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
      setReadTime("");
      setFeatured(false);

      alert("Post added!");

    } catch (error) {
      console.error(error);

      alert("Error adding post");
    }
  };

  return (
    <main className="page-shell"><div className="page-container max-w-3xl"><header className="page-header"><span className="eyebrow">Content studio</span><h1 className="page-title">Admin panel</h1><p className="page-intro">Create and publish stories across the Otaku254 fandom channels.</p></header><div className="form-card space-y-4">

      {/* TITLE */}
      <input
        value={title}
        className="form-field"
        placeholder="Post Title"
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      {/* DESCRIPTION */}
      <input
        value={description}
        className="form-field"
        placeholder="Short Description"
        onChange={(e) =>
          setDescription(e.target.value)
        }
      />

      {/* IMAGE */}
      <input
        value={image}
        className="form-field"
        placeholder="Image URL"
        onChange={(e) =>
          setImage(e.target.value)
        }
      />

      {/* AUTHOR */}
      <input
        value={author}
        className="form-field"
        placeholder="Author"
        onChange={(e) =>
          setAuthor(e.target.value)
        }
      />

      {/* READ TIME */}
      <input
        value={readTime}
        className="form-field"
        placeholder="Read Time (e.g. 5 min read)"
        onChange={(e) =>
          setReadTime(e.target.value)
        }
      />

      {/* CONTENT */}
      <textarea
        value={content}
        rows={8}
        className="form-field"
        placeholder="Full Content"
        onChange={(e) =>
          setContent(e.target.value)
        }
      />

      {/* CATEGORY */}
      <select
        value={category}
        className="form-field"
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
        className="primary-action w-full"
      >
        Publish Post
      </button>
    </div></div></main>
  );
}
