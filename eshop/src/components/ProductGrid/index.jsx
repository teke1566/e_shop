import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/actions/cart-actions";
import ProductCard from "../ProductCard";
import ProductAddToCartModal from "../ProductModal"; // Amazon-style modal

const ProductGrid = ({ products, loading, error }) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 🛒 Open modal for product
  const handleAddToCart = (product) => {
    setSelectedProduct(product);
    setShow(true);
  };

  // 🛍 Confirm add inside modal
  const handleConfirmAdd = (product) => {
    dispatch(addToCart(product));
  };

  // --- Conditional UI ---
  if (loading)
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-warning" role="status"></div>
        <p className="mt-3 text-muted">Loading products...</p>
      </div>
    );

  if (error)
    return <div className="alert alert-danger text-center">{error}</div>;

  if (!products?.length)
    return (
      <div className="text-center text-muted py-5">
        <i className="bi bi-search display-5 d-block mb-3"></i>
        <p>No products found.</p>
      </div>
    );

  // ✅ Normalize product data from backend
  const normalizeProduct = (p) => {
    return {
      productId: p.productId ?? p.id,
      productName: p.productName ?? p.name ?? "Unnamed Product",
      price: Number(p.price) || 0,
      quantity: Number(p.quantity) || 0,
      categoryId: p.categoryId ?? p.category?.id,
      categoryName: p.categoryName ?? p.category?.name ?? "General",
      imageUrls: Array.isArray(p.imageUrls)
        ? p.imageUrls.map((url) =>
            url.startsWith("http")
              ? url
              : `http://localhost:9191/${url.replace(/^\/+/, "")}`
          )
        : [],
    };
  };

  // --- Render product cards + modal ---
  return (
    <>
      <div className="row g-4">
        {products.map((p) => {
          const normalized = normalizeProduct(p);
          return (
            <ProductCard
              key={normalized.productId}
              product={normalized}
              onAddToCart={handleAddToCart}
            />
          );
        })}
      </div>

      {/* Amazon-style Add to Cart Modal */}
      <ProductAddToCartModal
        show={show}
        onClose={() => setShow(false)}
        product={selectedProduct}
        onAdd={handleConfirmAdd}
      />
    </>
  );
};

export default ProductGrid;
