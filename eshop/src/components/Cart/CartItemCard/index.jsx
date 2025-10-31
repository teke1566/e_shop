import React from "react";
import { useDispatch } from "react-redux";
import {
  addToCart,
  decreaseQuantity,
  deleteFromCart,
} from "../../../redux/actions/cart-actions";
import { showToast } from "../../../utils/ToastService";

const CartItemCard = ({ item, selectedItems, setSelectedItems }) => {
  const dispatch = useDispatch();
  const isSelected = selectedItems.includes(item.id);

  // ✅ Select / Deselect checkbox
  const toggleSelect = () => {
    if (isSelected) {
      setSelectedItems(selectedItems.filter((id) => id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item.id]);
    }
  };

  // ➕ Increase quantity
  const handleIncrease = () => {
    dispatch(addToCart(item));
    showToast(`Increased "${item.title}" quantity`, "info");
  };

  // ➖ Decrease quantity
  const handleDecrease = () => {
    dispatch(decreaseQuantity(item.id));
    showToast(`Decreased "${item.title}" quantity`, "warning");
  };

  // 🗑 Delete item
  const handleDelete = () => {
    dispatch(deleteFromCart(item));
    showToast(`Removed "${item.title}" from cart`, "danger");
    setSelectedItems(selectedItems.filter((id) => id !== item.id));
  };

  // 💾 Save for later
  const handleSaveForLater = () => {
    dispatch({ type: "SAVE_FOR_LATER", payload: item });
    showToast(`Saved "${item.title}" for later`, "success");
    setSelectedItems(selectedItems.filter((id) => id !== item.id));
  };

  return (
    <div className="border-bottom py-4">
      <div className="d-flex align-items-start">
        {/* ✅ Checkbox */}
        <div className="me-3 mt-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={toggleSelect}
            className="form-check-input"
            style={{ width: "18px", height: "18px" }}
          />
        </div>

        {/* 🖼 Product Image */}
        <img
          src={item.images?.[0] || "https://via.placeholder.com/120"}
          alt={item.title}
          width="120"
          height="120"
          className="border rounded me-3"
          style={{ objectFit: "contain" }}
        />

        {/* 📋 Product Info */}
        <div className="flex-grow-1">
          <h6 className="fw-semibold mb-1">{item.title}</h6>
          <p className="text-success small mb-1">In Stock</p>
          <p className="text-muted small mb-1">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/e/e3/Amazon_Prime_logo.svg"
              alt="Prime"
              height="14"
              className="me-1"
            />
            FREE delivery <b>Tomorrow, October 22</b>
          </p>
          <p className="text-muted small mb-1">FREE Returns</p>
          <p className="text-muted small mb-0">
            Size: <span className="text-dark">Standard</span> | Color:{" "}
            <span className="text-dark">Black</span>
          </p>

          {/* ➕➖ Quantity Controls */}
          <div className="d-flex align-items-center mt-3">
            <div
              className="d-flex align-items-center border rounded-pill px-2 py-1"
              style={{
                borderColor: "#FFD814",
                backgroundColor: "#fff",
                fontSize: "14px",
              }}
            >
              <button
                className="btn p-0 px-2"
                onClick={handleDecrease}
                disabled={item.quantity <= 1}
              >
                −
              </button>
              <span className="px-2 fw-semibold">{item.quantity}</span>
              <button className="btn p-0 px-2" onClick={handleIncrease}>
                +
              </button>
            </div>

            {/* 🧩 Action Links */}
            <div className="ms-3 small text-nowrap">
              <button
                className="btn btn-link p-0 text-decoration-none me-3"
                onClick={handleDelete}
              >
                Delete
              </button>
              <button
                className="btn btn-link p-0 text-decoration-none me-3"
                onClick={handleSaveForLater}
              >
                Save for later
              </button>
              <button className="btn btn-link p-0 text-decoration-none me-3">
                Compare
              </button>
              <button className="btn btn-link p-0 text-decoration-none">
                Share
              </button>
            </div>
          </div>
        </div>

        {/* 💰 Price Section */}
        <div className="text-end ms-3" style={{ minWidth: "120px" }}>
          <h6 className="fw-bold mb-0">${item.price.toFixed(2)}</h6>
          <small className="text-muted">
            (${(item.price / item.quantity).toFixed(2)} / count)
          </small>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
