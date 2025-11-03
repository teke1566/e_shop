import React from "react";
import "./index.css";

const CategoryNavBar = ({
  categories = [],
  activeCategory,
  onCategorySelect,
}) => {
  const staticButtons = ["All", "Today's Deals", "New Arrivals", "Top Rated"];

  return (
    <div className="category-navbar shadow-sm">
      <div className="container-fluid d-flex flex-nowrap overflow-auto align-items-center px-3">
        {staticButtons.map((label) => (
          <button
            key={label}
            className={`btn btn-link fw-semibold px-3 ${
              activeCategory === label ? "text-warning" : "text-white"
            }`}
            onClick={() => onCategorySelect(label === "All" ? "" : label)}
          >
            {label}
          </button>
        ))}

        {categories.map((cat) => (
          <button
            key={cat}
            className={`btn btn-link px-3 ${
              activeCategory === cat ? "text-warning fw-bold" : "text-white"
            }`}
            onClick={() => onCategorySelect(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryNavBar;
