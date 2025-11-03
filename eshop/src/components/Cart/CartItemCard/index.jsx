import React from "react";
import { useDispatch } from "react-redux";
import { addToCart, decreaseQuantity, deleteFromCart } from "../../../redux/actions/cart-actions";
import { showToast } from "../../../utils/ToastService";

const CartItemCard = ({ item, selectedItems, setSelectedItems }) => {
  const dispatch = useDispatch();

  const rowKey = item.lineId ?? item.productId ?? item.id;

  const isSelected = selectedItems?.includes(rowKey);

  const toggleSelect = () => {
    setSelectedItems(
      isSelected ? selectedItems.filter((k) => k !== rowKey) : [...selectedItems, rowKey]
    );
  };

  const handleIncrease = () => {
    dispatch(addToCart(item));
    showToast(`Increased "${item.title}" quantity`, "info");
  };

  const handleDecrease = () => {
    const q = Number(item.quantity ?? 1);
    if (q <= 1) {
      dispatch(deleteFromCart(rowKey)); // your reducer should accept an id
      setSelectedItems(selectedItems.filter((k) => k !== rowKey));
      showToast(`Removed "${item.title}" from cart`, "danger");
    } else {
      dispatch(decreaseQuantity(rowKey));
      showToast(`Decreased "${item.title}" quantity`, "warning");
    }
  };

  const handleDelete = () => {
    dispatch(deleteFromCart(rowKey));
    setSelectedItems(selectedItems.filter((k) => k !== rowKey));
    showToast(`Removed "${item.title}" from cart`, "danger");
  };

  const handleSaveForLater = () => {
    dispatch({ type: "SAVE_FOR_LATER", payload: item });
    setSelectedItems(selectedItems.filter((k) => k !== rowKey));
    showToast(`Saved "${item.title}" for later`, "success");
  };

  const imgSrc = item.imageUrls?.[0] || item.images?.[0] || "/images/placeholder.png";
  const price = Number(item.price);
  const qty = Math.max(1, Number(item.quantity ?? 1));

  return (
    <div className="border-bottom py-4">
      <div className="d-flex align-items-start">
        <div className="me-3 mt-2">
          <input
            type="checkbox"
            checked={!!isSelected}
            onChange={toggleSelect}
            className="form-check-input"
            style={{ width: 18, height: 18 }}
          />
        </div>

        <img
          src={imgSrc}
          alt={item.title}
          width="120"
          height="120"
          className="border rounded me-3"
          style={{ objectFit: "contain", background: "#fafafa" }}
          onError={(e) => { e.currentTarget.src = "/images/placeholder.png"; }}
        />

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

          <div className="d-flex align-items-center mt-3">
            <div className="d-flex align-items-center border rounded-pill px-2 py-1">
              <button className="btn p-0 px-2" onClick={handleDecrease}>−</button>
              <span className="px-2 fw-semibold">{qty}</span>
              <button className="btn p-0 px-2" onClick={handleIncrease}>+</button>
            </div>

            <div className="ms-3 small text-nowrap">
              <button className="btn btn-link p-0 text-decoration-none me-3" onClick={handleDelete}>
                Delete
              </button>
              <button className="btn btn-link p-0 text-decoration-none me-3" onClick={handleSaveForLater}>
                Save for later
              </button>
              <button className="btn btn-link p-0 text-decoration-none me-3">Compare</button>
              <button className="btn btn-link p-0 text-decoration-none">Share</button>
            </div>
          </div>
        </div>

        <div className="text-end ms-3" style={{ minWidth: 120 }}>
          <h6 className="fw-bold mb-0">${price.toFixed(2)}</h6>
          <small className="text-muted">
            (${(price / qty).toFixed(2)} / count)
          </small>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
