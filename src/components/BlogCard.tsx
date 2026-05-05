import { Link } from "react-router-dom";

export default function BlogCard({ id, title, category, description, image }: any) {
  return (
    <div className="p-6 rounded-2xl bg-gradient-to-b from-white/10 to-black border border-purple-500/20 hover:scale-105 transition">
      {image && (
        <img
          src = {image}
          className="rounded-xl mb-3 h-40 w-full object-cover"
        />
      )}
      
      <span className="text-xs text-pink-400 uppercase">{category}</span>

      <h3 className="text-xl font-bold mt-2">{title}</h3>

      <p className="text-gray-400 mt-3">{description}</p>

      <Link
        to={`/post/${id}`}
        className="inline-block mt-4 text-purple-400 hover:text-pink-400"
      >
        Read More →
      </Link>
    </div>
  );
}