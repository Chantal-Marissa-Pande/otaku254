import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function Admin() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Anime");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");

  const addPost = async () => {
    if (!title || !content) {
      alert("Title and content are required");
      return;
    }

    await addDoc(collection(db, "posts"), {
      title,
      category,
      description,
      content,
      image,
    });

    // RESET FORM
    setTitle("");
    setCategory("Anime");
    setDescription("");
    setContent("");
    setImage("");

    alert("Post added!");
  };

  return (
    <div className="max-w-xl mx-auto p-10 space-y-4">
      <h1 className="text-2xl font-bold">Admin Panel</h1>

      {/* TITLE */}
      <input
        value={title}
        className="w-full p-3 rounded bg-black border border-white/20"
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* DESCRIPTION */}
      <input
        value={description}
        className="w-full p-3 rounded bg-black border border-white/20"
        placeholder="Short Description"
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* IMAGE URL */}
      <input
        value={image}
        className="w-full p-3 rounded bg-black border border-white/20"
        placeholder="Image URL (Imgur link)"
        onChange={(e) => setImage(e.target.value)}
      />

      {/* CONTENT */}
      <textarea
        value={content}
        className="w-full p-3 rounded bg-black border border-white/20"
        placeholder="Full Content"
        rows={6}
        onChange={(e) => setContent(e.target.value)}
      />

      {/* CATEGORY */}
      <select
        value={category}
        className="w-full p-3 rounded bg-black border border-white/20"
        onChange={(e) => setCategory(e.target.value)}
      >
        <option>Anime</option>
        <option>Manga</option>
        <option>K-pop</option>
      </select>

      {/* SUBMIT */}
      <button
        onClick={addPost}
        className="bg-purple-600 px-4 py-2 w-full rounded hover:bg-purple-700"
      >
        Add Post
      </button>
    </div>
  );
}