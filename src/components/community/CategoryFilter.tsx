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
          className={`filter-chip ${
            activeCategory === category
              ? "active"
              : ""
          }`}
        >
          {category}
        </button>
      ))}

    </div>
  );
}
