import React, { useState, useMemo } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ProductAddToCartModal = ({ show, onClose, product, onAdd }) => {
  const navigate = useNavigate();
  const [size, setSize] = useState("Medium");

  const deliveryDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1); 
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }, []);

  if (!product) return null;

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      backdrop="static"
      dialogClassName="amazon-add-modal"
    >
      {/* --- Header --- */}
      <Modal.Header
        className="border-0 pb-0 position-relative"
        closeButton
        closeVariant="dark"
      >
        <Modal.Title className="fs-6 fw-semibold text-dark">
          Added to Cart
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="px-4 pt-2 pb-4">
        {/* Product Info */}
        <div className="d-flex mb-3 align-items-start">
          <img
            src={
              product.images?.[0] ||
              "https://via.placeholder.com/100x100?text=No+Image"
            }
            alt={product.title}
            className="me-3 rounded"
            style={{
              width: "90px",
              height: "90px",
              objectFit: "contain",
              border: "1px solid #eee",
            }}
          />
          <div>
            <p
              className="fw-semibold mb-1 text-dark"
              style={{ lineHeight: "1.2" }}
            >
              {product.title.length > 85
                ? product.title.slice(0, 85) + "..."
                : product.title}
            </p>
            <p className="text-muted mb-1 small">
              Category: <strong>{product.category?.name || "General"}</strong>
            </p>
            <Button
              variant="link"
              className="p-0 text-primary small text-decoration-none"
              onClick={() => navigate(`/products/${product.id}`)}
            >
              See all item details
            </Button>
          </div>
        </div>

        <hr className="my-3" />

        {/* Size Selection */}
        <div className="mb-3">
          <Form.Label className="fw-semibold small mb-1 text-muted">
            Size:
          </Form.Label>
          <Form.Select
            size="sm"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            style={{
              width: "150px",
              fontSize: "0.9rem",
            }}
          >
            <option>Small</option>
            <option>Medium</option>
            <option>Large</option>
            <option>Extra Large</option>
          </Form.Select>
        </div>

        {/* Price & Delivery Info */}
        <div className="mb-2">
          <h3 className="fw-bold mb-1 text-dark">
            ${product.price}
            <sup className="fs-6 align-top">00</sup>
          </h3>
          <div className="d-flex align-items-center mb-1">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_Prime_logo.svg"
              alt="Prime"
              style={{ height: "16px", marginRight: "6px" }}
            />
            <small className="text-muted">
              FREE delivery <strong>{deliveryDate}</strong>
            </small>
          </div>
        </div>
      </Modal.Body>

      {/* --- Footer --- */}
      <Modal.Footer className="border-0 pt-0 pb-4 px-4 d-flex justify-content-end">
        <Button
          variant="outline-dark"
          className="fw-semibold rounded-pill px-4"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          variant="warning"
          className="fw-semibold rounded-pill px-4 ms-2"
          style={{
            backgroundColor: "#FFD814",
            border: "1px solid #FCD200",
            color: "#111",
          }}
          onClick={() => {
            onAdd({ ...product, size });
            onClose();
          }}
        >
          Add to Cart
        </Button>
      </Modal.Footer>

      <style jsx="true">{`
        .amazon-add-modal .modal-content {
          border-radius: 12px !important;
          border: 1px solid #ddd;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
          max-width: 440px;
          margin: auto;
        }

        .amazon-add-modal .btn-warning:hover {
          background-color: #f7ca00 !important;
        }

        .amazon-add-modal .btn-outline-dark:hover {
          background-color: #f2f2f2 !important;
        }

        .amazon-add-modal hr {
          border-top: 1px solid #eee;
        }
      `}</style>
    </Modal>
  );
};

export default ProductAddToCartModal;
