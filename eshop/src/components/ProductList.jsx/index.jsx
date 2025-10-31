import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProductGrid from "../../components/ProductGrid";
import api from "../../services/api";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryId = params.get("category");

    // build API endpoint
    let endpoint = "/api/products";
    if (categoryId) {
      endpoint = `/api/products/by-category/${categoryId}`;
    }

    setLoading(true);
    setError(null);

    api
      .get(endpoint)
      .then((res) => {
        console.log("✅ Products loaded from:", endpoint, res.data);
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching products:", err);
        setError("Failed to load products. Please try again.");
        setLoading(false);
      });
  }, [location.search]);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Product List</h2>
      <ProductGrid products={products} loading={loading} error={error} />
    </div>
  );
};

export default ProductList;
