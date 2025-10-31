import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTotalCartAmount, emptyCart } from "../../../redux/actions/cart-actions";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";

const CartSummary = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartTotalAmount = 0, cartTotalQuantity = 0, carts = [] } =
    useSelector((state) => state.cart || {});

  useEffect(() => {
    dispatch(getTotalCartAmount());
  }, [carts, dispatch]);

  const subtotal = Number(cartTotalAmount) || 0;
  const shipping = carts.length > 0 ? 10 : 0;
  const grandTotal = subtotal + shipping;

  // Checkout Handler
  const handleCheckout = async () => {
    try {
      if (carts.length === 0) {
        alert("Your cart is empty!");
        return;
      }

      // For simplicity: pick the first item (you can loop through multiple)
      const firstItem = carts[0];

      const orderPayload = {
        productId: firstItem.id || firstItem.productId,
        quantity: firstItem.quantity,
        amount: firstItem.price * firstItem.quantity,
        paymentMethod: "CREDIT_CARD",
      };

      console.log("Sending order request:", orderPayload);

      const response = await api.post("/api/orders/placed", orderPayload);

      if (response.status === 201) {
        alert(`Order placed successfully! Order ID: ${response.data}`);
        dispatch(emptyCart());
        navigate(`/order-confirmation/${response.data}`);
      } else {
        alert("❌ Something went wrong. Try again.");
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("⚠️ Failed to place order. Check backend logs for details.");
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
