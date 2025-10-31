import React, { useState, useEffect } from "react";
import api from "../../services/api"; // import the configured axios instance
import Category from "./Category";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/categories");
      setCategories(res.data.content || res.data); // support pageable or list
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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
