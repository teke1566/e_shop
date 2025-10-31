import React from "react";
import { useParams, Link } from "react-router-dom";

const OrderConfirmation = () => {
  const { id } = useParams();

  return (
    <div className="container py-5 text-center">
      <div className="card shadow-sm border-0 p-5 mx-auto" style={{ maxWidth: "600px" }}>
        <h2 className="text-success mb-3">🎉 Order Confirmed!</h2>
        <p className="lead">
          Your order <strong>#{id}</strong> has been successfully placed and paid.
        </p>

        <div className="my-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/845/845646.png"
            alt="Order Confirmed"
            width="120"
            height="120"
          />
        </div>

        <p className="text-muted mb-4">
          We’re processing your order. You’ll receive an email confirmation soon.
        </p>

        <div className="d-flex justify-content-center gap-3">
          <Link to="/products" className="btn btn-warning fw-semibold">
            Continue Shopping
          </Link>
          <Link to="/orders" className="btn btn-outline-dark fw-semibold">
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
