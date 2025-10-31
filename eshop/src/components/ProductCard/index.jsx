import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./index.css";

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();

  // ✅ Use real backend field names
  const {
    productId,
    productName,
    price,
    imageUrls = [],
    categoryId,
    categoryName,
  } = product;

  // ✅ Handle image URLs safely
  const imageSrc =
    Array.isArray(imageUrls) && imageUrls.length > 0
      ? imageUrls[0].startsWith("http")
        ? imageUrls[0]
        : `http://localhost:9191/${imageUrls[0].replace(/^\/+/, "")}`
      : "/assets/no-image.png"; // fallback image from public/assets

  const isBestSeller = Math.random() > 0.8;

  const handleViewDetails = () => navigate(`/products/${productId}`);

  return (
    <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
      <div className="card h-100 text-center shadow-sm border-0 position-relative overflow-hidden">
        {isBestSeller && (
          <div className="bestseller-ribbon-wrapper">
            <span className="bestseller-ribbon">Best Seller</span>
          </div>
        )}

        <Link
          to={`/products/${productId}`}
          className="text-decoration-none text-dark"
        >
          <img
            src={imageSrc}
            alt={productName}
            className="card-img-top"
            style={{
              height: "230px",
              objectFit: "contain",
              backgroundColor: "#f9f9f9",
              borderBottom: "1px solid #eee",
            }}
            onError={(e) => {
              e.target.src = "/assets/no-image.png"; // fallback if broken
            }}
          />
        </Link>

        <div className="card-body text-start">
          <small className="text-muted d-block mb-1">Sponsored</small>
          <h6 className="fw-semibold text-truncate mb-2">{productName}</h6>

          {/*  Category badge fixed */}
          <span className="badge bg-info text-white mb-2">
            {categoryName || "General"}
          </span>

          <div className="mb-2">
            <span className="text-warning">★★★★☆</span>
            <span className="text-muted small ms-1">(1.2k)</span>
          </div>

          <span className="badge bg-danger text-white mb-2">
            Limited time deal
          </span>

          <div className="d-flex align-items-baseline mb-2">
            <h5 className="text-danger fw-bold mb-0">${price}</h5>
            <small className="text-muted ms-2">
              <s>${(Number(price) + 20).toFixed(2)}</s>
            </small>
          </div>

          <div className="d-flex justify-content-between">
            <button
              className="btn btn-outline-dark btn-sm flex-fill me-2 fw-semibold"
              onClick={handleViewDetails}
            >
              View Details
            </button>
            <button
              className="btn btn-warning btn-sm flex-fill fw-semibold"
              onClick={() => onAddToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
