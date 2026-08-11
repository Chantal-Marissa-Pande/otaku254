interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="mb-6 flex flex-wrap gap-3">

      {categories.map((category) => (
        <button
          key={category}
          onClick={() =>
            onCategoryChange(category)
          }
          className={`rounded-full px-5 py-2 text-sm font-medium transition ${
            activeCategory === category
              ? "bg-purple-600 text-white"
              : "bg-[#171725] text-gray-400 hover:bg-[#222235] hover:text-white"
          }`}
        >
          {category}
        </button>
      ))}

    </div>
  );
}