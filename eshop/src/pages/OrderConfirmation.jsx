import React, { useEffect, useMemo, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

const OrderConfirmation = () => {
  const params = useParams();
  const location = useLocation();

  const orderIdFromUrl =
    params.orderId ?? params.id ?? null; 

  const orderFromState = location.state?.order || null;
  const orderIdFromState =
    location.state?.orderId || location.state?.id || null;

  const effectiveOrderId =
    orderIdFromUrl ||
    orderIdFromState ||
    orderFromState?.id ||
    orderFromState?.orderId ||
    null;

  const [order, setOrder] = useState(orderFromState || null);
  const [loading, setLoading] = useState(!orderFromState);
  const [error, setError] = useState(null);

  const items = useMemo(() => {
    const raw = order?.items ?? order?.orderItems ?? order?.lines ?? [];
    return Array.isArray(raw) ? raw : [];
  }, [order]);

  useEffect(() => {
    if (order || !effectiveOrderId) return; 

    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/api/orders/${effectiveOrderId}`);
        if (!cancelled) setOrder(res.data);
      } catch (e) {
        if (!cancelled) setError(e);
        console.error("Failed to fetch order:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [effectiveOrderId, order]);

  // ---- RENDER STATES ----
  if (!effectiveOrderId && !order) {
    return (
      <div className="text-center mt-5">
        <h4 className="text-danger">Invalid order link</h4>
        <Link to="/" className="btn btn-primary mt-3">Back to Home</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-3">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center mt-5">
        <h4 className="text-danger">Order not found</h4>
        {effectiveOrderId && (
          <p className="text-muted small">Tried order #{effectiveOrderId}</p>
        )}
        <Link to="/" className="btn btn-primary mt-3">Back to Home</Link>
      </div>
    );
  }

  const displayId = order.id ?? order.orderId ?? effectiveOrderId;
  const total = Number(order.totalAmount ?? order.total ?? 0);

  return (
    <>
      <Navbar />
      <div className="container py-5" style={{ maxWidth: "900px" }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold text-success">Order Confirmed!</h2>
          <p className="text-muted">
            Thank you for your purchase. Your order ID is <b>#{displayId}</b>.
          </p>
          <p>We’ll email you when your items are on the way.</p>
        </div>

        <div className="card shadow-sm p-4">
          <h5 className="fw-bold mb-3">Order Summary</h5>

          <table className="table table-sm">
            <thead>
              <tr>
                <th>Product</th>
                <th className="text-center">Qty</th>
                <th className="text-end">Price</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => {
                const title =
                  item.title ?? item.productName ?? item.name ?? `Item ${i + 1}`;
                const qty = Number(item.quantity ?? 1);
                const price = Number(item.price ?? item.unitPrice ?? 0);
                return (
                  <tr key={item.id || item.lineId || i}>
                    <td>{title}</td>
                    <td className="text-center">{qty}</td>
                    <td className="text-end">${price.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <hr />
          <div className="d-flex justify-content-between">
            <span>Subtotal:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span>Shipping:</span>
            <span className="text-success">Free</span>
          </div>
          <div className="d-flex justify-content-between fw-bold mt-2">
            <span>Grand Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="text-center mt-5">
          <Link to="/" className="btn btn-primary me-3">Continue Shopping</Link>
          <Link to="/orders" className="btn btn-outline-secondary">View Orders</Link>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmation;
