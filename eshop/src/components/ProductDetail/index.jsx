import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { addToCart } from "../../redux/actions/cart-actions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    api
      .get(`/api/products/${id}`)
      .then((res) => {
        const data = res.data;

        // 🧩 Normalize all fields safely
        const normalized = {
          productId: data.productId,
          productName: data.productName || "Unnamed Product",
          price: data.price || 0,
          quantity: data.quantity || 0,
          categoryId: data.categoryId,
          categoryName: data.categoryName || "General",
          imageUrls: Array.isArray(data.imageUrls)
            ? data.imageUrls.map((url) =>
                url.startsWith("http")
                  ? url
                  : `http://localhost:9191/${url.replace(/^\/+/, "")}`
              )
            : [],
        };

        normalized.selectedImage =
          normalized.imageUrls[0] ||
          "https://via.placeholder.com/400x400?text=No+Image";

        setProduct(normalized);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity }));
    toast.success(`Added ${quantity} × "${product.productName}" to cart`, {
      position: "bottom-right",
      autoClose: 1200,
      theme: "colored",
    });
    setTimeout(() => navigate("/cart"), 900);
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary"></div>
        <p>Loading product details...</p>
      </div>
    );

  if (!product)
    return (
      <div className="text-center mt-5 text-danger">
        Product not found or failed to load.
      </div>
    );

  return (
    <div className="container-fluid my-4">
      <ToastContainer limit={1} />
      <div className="row g-4">
        {/* LEFT COLUMN - Images */}
        <div className="col-lg-5 d-flex">
          <div
            className="d-flex flex-column align-items-center me-3"
            style={{ gap: "10px" }}
          >
            {product.imageUrls.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`thumb-${i}`}
                className={`border rounded ${
                  product.selectedImage === img
                    ? "border-primary shadow-sm"
                    : "border-secondary"
                }`}
                width="60"
                height="60"
                style={{ cursor: "pointer", objectFit: "cover" }}
                onClick={() =>
                  setProduct((prev) => ({ ...prev, selectedImage: img }))
                }
              />
            ))}
          </div>

          <div className="flex-grow-1 text-center border rounded p-3 bg-white shadow-sm">
            <img
              src={product.selectedImage}
              alt={product.productName}
              className="img-fluid rounded"
              style={{
                maxHeight: "500px",
                objectFit: "contain",
              }}
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/400x400?text=Image+Not+Found";
              }}
            />
          </div>
        </div>

        {/* MIDDLE COLUMN - Product Info */}
        <div className="col-lg-4">
          <h6 className="text-primary fw-semibold">
            Visit the {product.categoryName} Store
          </h6>
          <h3 className="fw-bold">{product.productName}</h3>

          <div className="mb-2">
            <span className="text-warning">★★★★☆</span>
            <span className="ms-2 text-muted">(46 ratings)</span>
          </div>

          <div className="badge bg-danger mb-2">Limited time deal</div>

          <div className="d-flex align-items-center">
            <h3 className="text-danger fw-bold me-2">${product.price}</h3>
            <small className="text-muted ms-2">
              <del>${(product.price * 1.1).toFixed(2)}</del>
            </small>
          </div>

          <p className="text-muted small mb-3">
            In stock — {product.quantity} available
          </p>

          <h5 className="fw-bold mt-4 mb-2">Product details</h5>
          <table className="table table-borderless table-sm">
            <tbody>
              <tr>
                <td className="fw-semibold">Category</td>
                <td>{product.categoryName}</td>
              </tr>
              <tr>
                <td className="fw-semibold">Price</td>
                <td>${product.price}</td>
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

        {/* RIGHT COLUMN - Cart */}
        <div className="col-lg-3">
          <div className="border rounded p-3 shadow-sm bg-white sticky-top" style={{ top: "90px" }}>
            <h4 className="fw-bold">${product.price}</h4>
            <p className="text-success small mb-1">
              Available to ship in 1–2 days
            </p>

            <div className="mb-3">
              <label className="form-label fw-semibold">Quantity:</label>
              <select
                className="form-select"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleAddToCart}
              className="btn w-100 fw-semibold mb-2"
              style={{
                backgroundColor: "#FFD814",
                borderColor: "#FCD200",
                color: "#111",
              }}
            >
              🛒 Add to Cart
            </button>
            <button
              onClick={() => toast.info("Proceeding to checkout...")}
              className="btn w-100 fw-semibold"
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
