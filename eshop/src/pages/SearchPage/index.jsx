import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";
import CategoryNavBar from "../../components/CategoryNavBar";
import ProductGrid from "../../components/ProductGrid";
import { searchProducts } from "../../redux/actions/search-actions";
import { Dropdown } from "react-bootstrap";

const SearchPage = () => {
  const dispatch = useDispatch();
  const { results, loading, error } = useSelector((state) => state.search);

  const [sortBy, setSortBy] = useState("Featured");
  const [activeCategory, setActiveCategory] = useState("");

  const params = new URLSearchParams(useLocation().search);
  const query = params.get("query") || "";
  const category = params.get("cat") || "All";

  useEffect(() => {
    if (query.trim() || category.trim() !== "All") {
      dispatch(searchProducts(query, category));
    }
  }, [dispatch, query, category]);

  const availableCategories = useMemo(() => {
    const unique = new Set();
    results.forEach(
      (item) => item.category?.name && unique.add(item.category.name)
    );
    return Array.from(unique);
  }, [results]);

  const filtered = activeCategory
    ? results.filter((r) => r.category?.name === activeCategory)
    : results;

  const sortedResults = useMemo(() => {
    const sorted = [...filtered];
    switch (sortBy) {
      case "Price: Low to High":
        return sorted.sort((a, b) => a.price - b.price);
      case "Price: High to Low":
        return sorted.sort((a, b) => b.price - a.price);
      case "Newest Arrivals":
        return sorted.sort((a, b) => new Date(b.creationAt) - new Date(a.creationAt));
      default:
        return sorted;
    }
  }, [filtered, sortBy]);

  return (
    <>
      <Navbar />
      <CategoryNavBar
        categories={availableCategories}
        activeCategory={activeCategory}
        onCategorySelect={setActiveCategory}
      />

      <div className="container d-flex justify-content-between align-items-center mt-4 mb-3 flex-wrap">
        <h5 className="fw-bold mb-2">
          Showing results for <span className="text-primary">"{query}"</span>
        </h5>

        <Dropdown onSelect={(eventKey) => setSortBy(eventKey)}>
          <Dropdown.Toggle variant="light" className="border shadow-sm">
            Sort by: {sortBy}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item eventKey="Featured">Featured</Dropdown.Item>
            <Dropdown.Item eventKey="Price: Low to High">
              Price: Low to High
            </Dropdown.Item>
            <Dropdown.Item eventKey="Price: High to Low">
              Price: High to Low
            </Dropdown.Item>
            <Dropdown.Item eventKey="Newest Arrivals">
              Newest Arrivals
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <div className="container my-4">
        <ProductGrid products={sortedResults} loading={loading} error={error} />
      </div>
    </>
  );
};

export default SearchPage;
