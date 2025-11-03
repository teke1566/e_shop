import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./index.css";

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();

  const {
    productId,
    productName,
    price,
    imageUrls = [],
    categoryName,
  } = product;

  const SVG_FALLBACK =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'>
         <defs>
           <linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
             <stop offset='0%' stop-color='#f3f4f6'/>
             <stop offset='100%' stop-color='#e5e7eb'/>
           </linearGradient>
         </defs>
         <rect width='100%' height='100%' fill='url(#g)'/>
         <g fill='#9ca3af'>
           <rect x='140' y='170' width='320' height='200' rx='8' ry='8' opacity='0.45'/>
           <circle cx='220' cy='270' r='34' opacity='0.45'/>
         </g>
         <text x='50%' y='78%' dominant-baseline='middle' text-anchor='middle'
               font-family='sans-serif' font-size='28' fill='#9ca3af'>No Image</text>
       </svg>`
    );

  const toAbsolute = (url) => {
    if (!url) return null;
    return /^https?:\/\//i.test(url)
      ? url
      : `http://localhost:9191/${String(url).replace(/^\/+/, "")}`;
  };

  const firstUrl = Array.isArray(imageUrls) && imageUrls.length > 0 ? imageUrls[0] : null;
  const imageSrc = toAbsolute(firstUrl) || SVG_FALLBACK;

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
            alt={productName || "Product"}
            loading="lazy"
            className="card-img-top"
            style={{
              aspectRatio: "1 / 1",
              minHeight: 230,
              objectFit: "contain",
              backgroundColor: "#f9f9f9",
              borderBottom: "1px solid #eee",
            }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = SVG_FALLBACK;
            }}
          />
        </Link>

        <div className="card-body text-start">
          <small className="text-muted d-block mb-1">Sponsored</small>
          <h6 className="fw-semibold text-truncate mb-2">{productName}</h6>

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
            <h5 className="text-danger fw-bold mb-0">${Number(price || 0).toFixed(2)}</h5>
            <small className="text-muted ms-2">
              <s>${(Number(price || 0) + 20).toFixed(2)}</s>
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
