import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/actions/cart-actions";

const Product = ({ data }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { productId, productName, price, imageUrls = [], categoryId } = data;
  const [show, setShow] = useState(false);
  const [size, setSize] = useState("Medium");

  //  Normalize image URL (handle relative or absolute)
  const imageSrc =
    imageUrls?.[0]?.startsWith("http")
      ? imageUrls[0]
      : imageUrls?.[0]
      ? `http://localhost:9191/${imageUrls[0]}`
      : "https://via.placeholder.com/300x200?text=No+Image";

  const handleAddToCart = () => {
    dispatch(addToCart({ productId, productName, price, imageUrls, size }));
    setShow(false);
  };

  const handleCategoryClick = (catId) => {
    navigate(`/search?catId=${catId}`);
  };

  const categoryColors = {
    1: "#007185",
    2: "#1a8917",
    3: "#8b4513",
    4: "#b12704",
    5: "#e91e63",
    default: "#232f3e",
  };

  const badgeColor = categoryColors[categoryId] || categoryColors.default;
  const isBestSeller = Math.random() > 0.8;

  return (
    <>
      <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
        <div
          className="card h-100 text-center shadow-sm border-0 position-relative overflow-hidden"
          style={{
            transition: "transform 0.2s ease-in-out",
            borderRadius: "10px",
          }}
        >
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
                borderBottom: "1px solid #eee",
                backgroundColor: "#f9f9f9",
              }}
            />
          </Link>

          <div className="card-body text-start">
            <small className="text-muted d-block mb-1">Sponsored</small>
            <h6 className="fw-semibold text-truncate mb-2">{productName}</h6>

            {categoryId && (
              <span
                className="category-badge mb-2"
                style={{ backgroundColor: badgeColor }}
                onClick={() => handleCategoryClick(categoryId)}
              >
                Category #{categoryId}
              </span>
            )}

            <div className="mb-2 mt-2">
              <span className="text-warning">★★★★☆</span>
              <span className="text-muted small ms-1">(1.2k)</span>
            </div>

            <span className="badge bg-danger text-white mb-2">
              Limited time deal
            </span>

            <div className="d-flex align-items-baseline mb-2">
              <h5 className="text-danger fw-bold mb-0">${price}</h5>
              <small className="text-muted ms-2">
                <s>List: ${(price + 20).toFixed(2)}</s>
              </small>
            </div>

            <p className="text-muted small mb-3">
              <span className="text-primary fw-semibold">prime</span> FREE
              delivery <strong>Tomorrow</strong>
            </p>

            <div className="d-flex justify-content-between">
              <Link
                to={`/products/${productId}`}
                className="btn btn-outline-dark btn-sm flex-fill me-2 fw-semibold"
              >
                View Details
              </Link>
              <button
                className="btn btn-warning btn-sm flex-fill fw-semibold"
                onClick={() => setShow(true)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add to Cart Modal */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6">{productName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex mb-3">
            <img
              src={imageSrc}
              alt={productName}
              className="me-3 rounded"
              style={{ width: "80px", height: "80px", objectFit: "cover" }}
            />
            <div>
              <p className="mb-1 fw-semibold">{productName}</p>
              <p className="text-muted small mb-0">
                Category ID: {categoryId || "N/A"}
              </p>
              <Link to={`/products/${productId}`} className="small text-primary">
                See all item details
              </Link>
            </div>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Size:</Form.Label>
            <Form.Select
              value={size}
              onChange={(e) => setSize(e.target.value)}
            >
              <option>Small</option>
              <option>Medium</option>
              <option>Large</option>
              <option>Extra Large</option>
            </Form.Select>
          </Form.Group>

          <div className="d-flex align-items-baseline">
            <h4 className="text-danger fw-bold">${price}</h4>
            <small className="text-muted ms-2">
              <s>List: ${(price + 20).toFixed(2)}</s>
            </small>
          </div>
          <p className="text-muted small mt-2">
            <span className="text-primary fw-semibold">prime</span> FREE delivery{" "}
            <strong>Tomorrow</strong>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setShow(false)}>
            Cancel
          </Button>
          <Button variant="warning" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx="true">{`
        .category-badge {
          display: inline-block;
          color: #fff;
          font-size: 0.8rem;
          padding: 4px 10px;
          border-radius: 12px;
          cursor: pointer;
          text-transform: capitalize;
          transition: transform 0.2s ease, background-color 0.2s ease;
        }
        .category-badge:hover {
          transform: scale(1.05);
          filter: brightness(1.2);
        }
        .bestseller-ribbon-wrapper {
          position: absolute;
          top: 10px;
          left: -40px;
          width: 150px;
          transform: rotate(-45deg);
          text-align: center;
          z-index: 10;
        }
        .bestseller-ribbon {
          display: block;
          background-color: #ffa41c;
          color: #111;
          font-weight: bold;
          font-size: 0.75rem;
          padding: 6px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
          border: 1px solid #e59400;
        }
      `}</style>
    </>
  );
};

export default Product;
