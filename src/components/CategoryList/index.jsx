import React, { useState, useEffect } from "react";
import api from "../../services/api";
import Category from "./Category";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/categories");
      const data = res.data;

      const list = Array.isArray(data)
        ? data
        : data?.content ?? data?.categories ?? [];

      setCategories(list);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) return <div className="container mt-4">Loading...</div>;

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Category List</h1>
      <div className="row">
        {categories.length > 0 ? (
          categories.map((cat) => <Category key={cat.id} data={cat} />)
        ) : (
          <p className="text-center">No categories available</p>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
