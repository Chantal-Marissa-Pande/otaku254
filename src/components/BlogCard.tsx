import { Link } from "react-router-dom";

interface Props {
  id: string;
  title: string;
  description: string;
  image?: string;
  category: string;
  readTime?: string;
  author?: string;
}

export default function BlogCard({
  id,
  title,
  description,
  image,
  category,
  readTime,
  author,
}: Props) {
  return (
    <Link to={`/post/${id}`}>
      <div
        className="
          bg-white/5
          rounded-2xl
          overflow-hidden
          border
          border-white/10
          hover:border-purple-500
          hover:scale-[1.02]
          transition
          duration-300
          cursor-pointer
        "
      >

        {/* IMAGE */}
        {image && (
          <img
            src={image}
            alt={title}
            className="
              w-full
              h-52
              object-cover
            "
          />
        )}

        {/* CONTENT */}
        <div className="p-5">

          {/* TOP INFO */}
          <div className="flex justify-between items-center text-xs text-purple-400 mb-3">

            <span>{category}</span>

            {readTime && (
              <span>{readTime}</span>
            )}
          </div>

          {/* TITLE */}
          <h2 className="text-xl font-bold mb-3">
            {title}
          </h2>

          {/* DESCRIPTION */}
          <p className="text-gray-400 text-sm line-clamp-3">
            {description}
          </p>

          {/* AUTHOR */}
          {author && (
            <div className="mt-4 text-xs text-gray-500">
              By {author}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}