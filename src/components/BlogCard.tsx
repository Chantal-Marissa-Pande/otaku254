import { Link } from "react-router-dom";

interface Props {
  id: string;
  title: string;
  description: string;
  image?: string;
  category: string;
}

export default function BlogCard({
  id,
  title,
  description,
  image,
  category,
}: Props) {
  return (
    <Link to={`/post/${id}`}>
      <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500 transition hover:scale-[1.02]">

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

        <div className="p-5">

          <span className="text-purple-400 text-sm">
            {category}
          </span>

          <h2 className="text-xl font-bold mt-2 mb-2">
            {title}
          </h2>

          <p className="text-gray-400">
            {description}
          </p>

        </div>
      </div>
    </Link>
  );
}