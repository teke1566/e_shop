import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTotalCartAmount, emptyCart } from "../../../redux/actions/cart-actions";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../../utils/ToastService";

const CartSummary = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartTotalAmount = 0, cartTotalQuantity = 0, carts = [] } =
    useSelector((state) => state.cart || {});

  useEffect(() => {
    dispatch(getTotalCartAmount());
  }, [carts, dispatch]);

  const subtotal = Number(cartTotalAmount) || 0;
  const shipping = 0;
  const grandTotal = subtotal + shipping;

  const handleCheckout = async () => {
    if (carts.length === 0) {
      showToast("Your cart is empty!", "warning");
      return;
    }

    const orderItems = carts.map((p) => ({
      productId: Number(p.id ?? p.productId),                 
      productName: p.title ?? p.productName ?? p.name ?? "",
      imageUrl:
        (Array.isArray(p.imageUrls) && p.imageUrls[0]) ||
        (Array.isArray(p.images) && p.images[0]) ||
        p.imageUrl ||
        null,
      unitPrice: Number(p.price),                              
      quantity: Number(p.quantity ?? 1),
    }));

    const bad = orderItems.find(
      (i) =>
        !Number.isFinite(i.productId) ||
        !Number.isFinite(i.unitPrice) ||
        !Number.isFinite(i.quantity) ||
        i.quantity <= 0
    );
    if (bad) {
      showToast("One or more items are invalid. Refresh and try again.", "danger");
      return;
    }

    const payload = {
      shipping,                         
      paymentMethod: "CREDIT_CARD",
      items: orderItems,
    };

    try {
      const res = await api.post("/api/orders/placed", payload);

      
      const orderId = Number(res?.data?.orderId ?? res?.data);
      if (!Number.isFinite(orderId)) {
        showToast("Unexpected response from server.", "warning");
        return;
      }

      showToast("Order placed successfully!", "success");
      dispatch(emptyCart());
      navigate(`/order-confirmation/${orderId}`, { state: { orderId } });
    } catch (error) {
      const msg =
        error?.response?.data?.errorMessage ||
        error?.message ||
        "Failed to place order.";
      console.error("Checkout failed:", error);
      showToast(`⚠️ ${msg}`, "danger");
    }
  };

  return (
    <div className="card shadow-sm p-4 border-0">
      <div className="d-flex justify-content-between mb-2">
        <span className="text-secondary">Total Items:</span>
        <span className="fw-semibold">{cartTotalQuantity}</span>
      </div>

      <div className="d-flex justify-content-between mb-2">
        <span className="text-secondary">Subtotal:</span>
        <span className="fw-semibold">${subtotal.toFixed(2)}</span>
      </div>

      <div className="d-flex justify-content-between mb-2">
        <span className="text-secondary">Shipping:</span>
        <span className="fw-semibold">${shipping.toFixed(2)}</span>
      </div>

      <hr />

      <div className="d-flex justify-content-between mb-3">
        <h6 className="fw-bold">Grand Total:</h6>
        <h6 className="fw-bold text-success">${grandTotal.toFixed(2)}</h6>
      </div>

      <button
        className="btn btn-success w-100 fw-semibold"
        disabled={carts.length === 0}
        onClick={handleCheckout}
      >
        Proceed to Pay
      </button>
    </div>
  );
};

export default CartSummary;
