// src/pages/ProductDetail/index.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import api from "../../services/api";
import { addToCart } from "../../redux/actions/cart-actions";
import "react-toastify/dist/ReactToastify.css";

const GATEWAY = "http://localhost:9191";

// build absolute URL if backend returns relative paths
const toAbsolute = (url) => {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return `${GATEWAY}/${String(url).replace(/^\/+/, "")}`;
};

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    api
      .get(`/api/products/${id}`)
      .then((res) => {
        if (!mounted) return;

        const p = res.data || {};
        const imagesArray = Array.isArray(p.imageUrls) ? p.imageUrls : [];
        const normalizedImages = imagesArray.map(toAbsolute).filter(Boolean);

        const normalized = {
          productId: p.productId ?? p.id,
          productName: p.productName ?? p.name ?? "Unnamed Product",
          // also expose as 'title' for any component that expects it
          title: p.productName ?? p.name ?? "Unnamed Product",
          price: Number(p.price) || 0,
          quantity: Number(p.quantity) || 0,
          categoryId: p.categoryId ?? p.category?.id ?? null,
          categoryName: p.categoryName ?? p.category?.name ?? "General",
          description: p.description ?? "",
          imageUrls: normalizedImages.length
            ? normalizedImages
            : ["https://via.placeholder.com/600x600?text=No+Image"],
        };

        setProduct(normalized);
        setSelectedImage(normalized.imageUrls[0]);
      })
      .catch((err) => {
        console.error("Error fetching product:", err?.response?.data || err);
        toast.error("Failed to load product.", { theme: "colored" });
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [id]);

  const outOfStock = useMemo(() => {
    if (!product) return false;
    return Number(product.quantity) <= 0;
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;

    if (outOfStock) {
      toast.warn("This item is currently out of stock.", { theme: "colored" });
      return;
    }
    if (qty > product.quantity) {
      toast.info(`Only ${product.quantity} left in stock.`, { theme: "colored" });
      setQty(product.quantity);
      return;
    }

    // Add with the current quantity; reducer normalizes the shape
    dispatch(addToCart({ ...product, quantity: qty }));

    toast.success(`Added ${qty} × "${product.productName}" to cart`, {
      theme: "colored",
      autoClose: 700,
    });

    // quick redirect so toast is visible first
    setTimeout(() => navigate("/cart"), 750);
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" />
        <p className="mt-2">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">
          Product not found.{" "}
          <Link to="/" className="alert-link">
            Go back
          </Link>
        </div>
      </div>
    );
  }

  const maxSelectable = Math.max(0, Math.min(10, Number(product.quantity) || 0));
  const savingsMsrp = (product.price * 1.1).toFixed(2); // fake “was” price for display

  return (
    <div className="container-fluid my-4">
      <ToastContainer position="bottom-right" theme="colored" limit={1} />

      <div className="row g-4">
        {/* LEFT: gallery */}
        <div className="col-lg-5 d-flex">
          <div className="d-flex flex-column align-items-center me-3" style={{ gap: 10 }}>
            {product.imageUrls.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`thumb-${i}`}
                width="60"
                height="60"
                className={`border rounded ${selectedImage === img ? "border-primary shadow-sm" : "border-secondary"}`}
                style={{ cursor: "pointer", objectFit: "cover" }}
                onClick={() => setSelectedImage(img)}
                onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/60")}
              />
            ))}
          </div>

          <div className="flex-grow-1 text-center border rounded p-3 bg-white shadow-sm">
            <img
              src={selectedImage || product.imageUrls[0]}
              alt={product.productName}
              className="img-fluid rounded"
              style={{ maxHeight: 520, objectFit: "contain" }}
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/600x600?text=Image+Not+Found";
              }}
            />
          </div>
        </div>

        {/* MIDDLE: info */}
        <div className="col-lg-4">
          <h6 className="text-primary fw-semibold mb-1">
            Visit the {product.categoryName} Store
          </h6>
          <h3 className="fw-bold">{product.productName}</h3>

          <div className="mb-2">
            <span className="text-warning">★★★★☆</span>
            <span className="ms-2 text-muted">(46 ratings)</span>
          </div>

          <div className="badge bg-danger mb-2">Limited time deal</div>

          <div className="d-flex align-items-end">
            <h3 className="text-danger fw-bold me-2">${product.price.toFixed(2)}</h3>
            <small className="text-muted">
              <del>${savingsMsrp}</del>
            </small>
          </div>

          <p className={`small mt-2 ${outOfStock ? "text-danger" : "text-success"}`}>
            {outOfStock
              ? "Out of stock"
              : `In stock — ${product.quantity} available`}
          </p>

          {/* Description */}
          {product.description && (
            <>
              <h5 className="fw-bold mt-4 mb-2">About this item</h5>
              <div className="text-muted" style={{ whiteSpace: "pre-wrap" }}>
                {product.description}
              </div>
            </>
          )}

          {/* Specs table */}
          <h5 className="fw-bold mt-4 mb-2">Product details</h5>
          <table className="table table-borderless table-sm">
            <tbody>
              <tr>
                <td className="fw-semibold">Category</td>
                <td>{product.categoryName}</td>
              </tr>
              <tr>
                <td className="fw-semibold">Price</td>
                <td>${product.price.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="fw-semibold">Quantity</td>
                <td>{product.quantity}</td>
              </tr>
              <tr>
                <td className="fw-semibold">Product ID</td>
                <td>{product.productId}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* RIGHT: buy box */}
        <div className="col-lg-3">
          <div className="border rounded p-3 shadow-sm bg-white sticky-top" style={{ top: 90 }}>
            <h4 className="fw-bold">${product.price.toFixed(2)}</h4>
            <p className={`small mb-2 ${outOfStock ? "text-danger" : "text-success"}`}>
              {outOfStock ? "Currently unavailable" : "Available to ship in 1–2 days"}
            </p>

            <div className="mb-3">
              <label className="form-label fw-semibold">Quantity:</label>
              <select
                className="form-select"
                value={qty}
                disabled={outOfStock}
                onChange={(e) => setQty(Number(e.target.value))}
              >
                {outOfStock ? (
                  <option value={0}>0</option>
                ) : (
                  Array.from({ length: maxSelectable }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))
                )}
              </select>
              {!outOfStock && product.quantity <= 5 && (
                <div className="small text-danger mt-1">Only {product.quantity} left in stock!</div>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              className="btn w-100 fw-semibold mb-2"
              disabled={outOfStock}
              style={{
                backgroundColor: "#FFD814",
                borderColor: "#FCD200",
                color: "#111",
              }}
            >
              🛒 Add to Cart
            </button>

            <button
              onClick={() => {
                if (outOfStock) {
                  toast.warn("This item is currently out of stock.", { theme: "colored" });
                } else {
                  dispatch(addToCart({ ...product, quantity: 1 }));
                  navigate("/cart");
                }
              }}
              className="btn w-100 fw-semibold"
              disabled={outOfStock}
              style={{
                backgroundColor: "#FFA41C",
                borderColor: "#FF8F00",
                color: "#111",
              }}
            >
              ⚡ Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
