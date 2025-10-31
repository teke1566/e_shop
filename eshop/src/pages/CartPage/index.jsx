import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    emptyCart,
    moveToCart,
    deleteFromCart,
    deleteFromSaved,
} from "../../redux/actions/cart-actions";
import CartItemCard from "../../components/Cart/CartItemCard";
import Navbar from "../../components/Navbar";
import { showToast } from "../../utils/ToastService";

const CartPage = () => {
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);
    const [selectedItems, setSelectedItems] = useState(
        cart.carts.map((item) => item.id)
    );
    const [activeCategory, setActiveCategory] = useState(null);

    // ---- Totals ----
    const subtotal = cart.cartTotalAmount || 0;
    const totalItems = cart.cartTotalQuantity || 0;
    const shipping = subtotal > 50 ? 0 : 5.99;
    const grandTotal = subtotal + shipping;

    // ---- Select / Deselect ----
    const toggleSelectAll = () => {
        if (selectedItems.length === cart.carts.length) {
            setSelectedItems([]);
            showToast("All items deselected", "info");
        } else {
            setSelectedItems(cart.carts.map((item) => item.id));
            showToast("All items selected", "success");
        }
    };

    // ---- Clear Cart ----
    const handleClearCart = () => {
        if (cart.carts.length === 0) {
            showToast("Your cart is already empty", "info");
            return;
        }
        if (window.confirm("Are you sure you want to clear your cart?")) {
            dispatch(emptyCart());
            setSelectedItems([]);
            showToast("Cart cleared successfully", "danger");
        }
    };

    // ---- Dynamic categories from saved items ----
    const categories =
        cart.savedItems && cart.savedItems.length > 0
            ? Object.entries(
                cart.savedItems.reduce((acc, item) => {
                    const cat =
                        typeof item.category === "string"
                            ? item.category
                            : item.category?.name || "Uncategorized";
                    acc[cat] = (acc[cat] || 0) + 1;
                    return acc;
                }, {})
            )
            : [];

    // ---- Filter saved items by active category ----
    const filteredSavedItems = activeCategory
        ? cart.savedItems.filter((item) => {
            const cat =
                typeof item.category === "string"
                    ? item.category
                    : item.category?.name || "Uncategorized";
            return cat === activeCategory;
        })
        : cart.savedItems;

    return (
        <>
            <Navbar />

            <div className="container-fluid my-4" style={{ maxWidth: "1200px" }}>
                {/* ---------- HEADER ---------- */}
                <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                    <h3 className="fw-bold mb-0">Shopping Cart</h3>
                    <div className="d-flex align-items-center gap-3">
                        <button
                            className="btn btn-link text-decoration-none small"
                            onClick={toggleSelectAll}
                        >
                            {selectedItems.length === cart.carts.length
                                ? "Deselect all items"
                                : "Select all items"}
                        </button>
                        <button
                            onClick={handleClearCart}
                            className="btn btn-outline-danger btn-sm"
                            disabled={cart.carts.length === 0}
                        >
                            <i className="bi bi-trash me-1"></i> Clear Cart
                        </button>
                    </div>
                </div>

                <div className="row">
                    {/* ---------- LEFT : ITEMS ---------- */}
                    <div className="col-lg-8 border-end pe-4">
                        {cart.carts && cart.carts.length > 0 ? (
                            cart.carts.map((item) => (
                                <CartItemCard
                                    key={item.id}
                                    item={item}
                                    selectedItems={selectedItems}
                                    setSelectedItems={setSelectedItems}
                                />
                            ))
                        ) : (
                            <div className="text-center py-5 text-muted">
                                <i className="bi bi-cart-x display-6 d-block mb-2"></i>
                                <p>Your cart is empty</p>
                            </div>
                        )}
                    </div>

                    {/* ---------- RIGHT : SUMMARY ---------- */}
                    <div className="col-lg-4 ps-lg-4 mt-4 mt-lg-0">
                        <div
                            className="border rounded-3 p-4 bg-light"
                            style={{ position: "sticky", top: "100px" }}
                        >
                            <h5 className="fw-semibold mb-3">
                                Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"}):{" "}
                                <span className="fw-bold text-dark">${subtotal.toFixed(2)}</span>
                            </h5>

                            <button
                                className="btn btn-warning w-100 fw-semibold mb-3"
                                disabled={cart.carts.length === 0}
                                style={{
                                    backgroundColor: "#FFD814",
                                    borderColor: "#FCD200",
                                    color: "#111",
                                }}
                            >
                                Proceed to Checkout
                            </button>

                            <hr />
                            <div className="small mb-2 d-flex justify-content-between">
                                <span>Total Items:</span>
                                <span className="fw-semibold">{totalItems}</span>
                            </div>
                            <div className="small mb-2 d-flex justify-content-between">
                                <span>Subtotal:</span>
                                <span className="fw-semibold">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="small mb-2 d-flex justify-content-between">
                                <span>Shipping:</span>
                                <span
                                    className={`fw-semibold ${shipping === 0 ? "text-success" : "text-dark"
                                        }`}
                                >
                                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                                </span>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between align-items-center">
                                <h6 className="fw-bold mb-0">Grand Total:</h6>
                                <h5 className="fw-bold text-danger mb-0">
                                    ${grandTotal.toFixed(2)}
                                </h5>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ---------- SAVED FOR LATER ---------- */}
                {cart.savedItems && cart.savedItems.length > 0 && (
                    <div
                        className="mt-5 border-top pt-4 border rounded-3 bg-white p-4 shadow-sm"
                        style={{ borderColor: "#e0e0e0" }}
                    >
                        <h4 className="fw-bold mb-4">Your Items</h4>

                        {/* Tabs */}
                        <ul className="nav nav-tabs mb-4">
                            <li className="nav-item">
                                <button className="nav-link active fw-semibold text-dark">
                                    Saved for later ({cart.savedItems.length}{" "}
                                    {cart.savedItems.length === 1 ? "item" : "items"})
                                </button>
                            </li>
                            <li className="nav-item">
                                <button className="nav-link text-muted fw-semibold">
                                    Buy it again
                                </button>
                            </li>
                        </ul>

                        {/*  Category Buttons inside the box */}
                        <div
                            className="d-flex flex-wrap gap-2 mb-4"
                            style={{ alignItems: "center" }}
                        >
                            {categories.map(([cat, count], i) => (
                                <button
                                    key={i}
                                    className={`btn btn-sm rounded-pill px-3 py-1 ${activeCategory === cat
                                            ? "btn-primary text-white"
                                            : "btn-outline-secondary"
                                        }`}
                                    style={{
                                        whiteSpace: "nowrap",
                                        fontSize: "0.85rem",
                                        lineHeight: "1",
                                        height: "32px",
                                    }}
                                    onClick={() =>
                                        setActiveCategory(activeCategory === cat ? null : cat)
                                    }
                                >
                                    {cat} ({count})
                                </button>
                            ))}
                        </div>

                        {/* Filter title */}
                        {activeCategory && (
                            <h6 className="fw-bold mb-3">{activeCategory}</h6>
                        )}

                        {/* Grid */}
                        <div className="row g-4">
                            {filteredSavedItems.map((item) => (
                                <div key={item.id} className="col-md-3 col-sm-6 col-12">
                                    <div
                                        className="card h-100 border rounded-3 shadow-sm p-3"
                                        style={{
                                            minHeight: "520px",
                                            transition: "transform 0.2s ease",
                                        }}
                                    >
                                        <div className="d-flex justify-content-center align-items-center mb-3">
                                            <img
                                                src={
                                                    item.images?.[0] || "https://via.placeholder.com/200"
                                                }
                                                alt={item.title}
                                                width="180"
                                                height="180"
                                                style={{ objectFit: "contain" }}
                                            />
                                        </div>

                                        <h6
                                            className="fw-semibold mb-1"
                                            style={{ lineHeight: "1.3", minHeight: "40px" }}
                                        >
                                            {item.title.length > 80
                                                ? `${item.title.substring(0, 80)}...`
                                                : item.title}
                                        </h6>

                                        <p className="text-danger small fw-semibold mb-1">
                                            Limited time deal
                                        </p>

                                        <h6 className="fw-bold mb-1 text-danger">
                                            ${item.price.toFixed(2)}{" "}
                                            <small className="text-muted fw-normal">
                                                (${(item.price / item.quantity).toFixed(2)} / count)
                                            </small>
                                        </h6>

                                        <p className="text-muted small mb-0">
                                            List Price:{" "}
                                            <span className="text-decoration-line-through">
                                                $34.95
                                            </span>
                                        </p>
                                        <p className="text-muted small mb-1">
                                            3K+ bought in past month <br />
                                            <span className="text-success fw-semibold">In Stock</span>
                                        </p>

                                        <p className="text-muted small mb-1">
                                            <img
                                                src="https://upload.wikimedia.org/wikipedia/commons/e/e3/Amazon_Prime_logo.svg"
                                                alt="Prime"
                                                height="14"
                                                className="me-1"
                                            />
                                            & FREE Returns
                                        </p>

                                        {/* Move to cart */}
                                        <button
                                            className="btn btn-outline-secondary w-100 rounded-pill fw-semibold mt-2"
                                            onClick={() => {
                                                dispatch(moveToCart(item));
                                                showToast(`"${item.title}" moved to cart`, "success");
                                            }}
                                        >
                                            Move to cart
                                        </button>

                                        {/* Actions */}
                                        <div className="mt-2 small text-primary d-flex flex-wrap gap-3">
                                            <button
                                                className="btn btn-link text-decoration-none p-0 text-danger"
                                                onClick={() => {
                                                    dispatch(deleteFromSaved(item.id));
                                                    showToast(`"${item.title}" removed from Saved Items`, "danger");
                                                }}
                                            >
                                                Delete
                                            </button>


                                            <button className="btn btn-link text-decoration-none p-0">
                                                Compare with similar items
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartPage;
